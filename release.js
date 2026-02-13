#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import OpenAI from 'openai';
import 'dotenv/config';

// --- Configuration ---
const OPENAI_MODEL = 'gpt-4o-mini';

// --- OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Utility Functions ---

function run(cmd) {
  return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] })
    .toString()
    .trim();
}

function getLastTag() {
  try {
    return run('git describe --tags --abbrev=0');
  } catch {
    return null;
  }
}

function getCommitMessages(sinceTag) {
  const range = sinceTag ? `${sinceTag}..HEAD` : 'HEAD';
  const log = run(`git log ${range} --pretty=format:%s`);
  return log.split('\n').filter(Boolean);
}

function getCommitDetails(sinceTag) {
  const range = sinceTag ? `${sinceTag}..HEAD` : 'HEAD';
  const log = run(`git log ${range} --pretty=format:"%h|%s"`);
  return log
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, ...msg] = line.split('|');
      return { hash, message: msg.join('|') };
    });
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

function bumpVersion(lastTag, type) {
  if (!lastTag) return 'v1.0.0';
  const parts = lastTag.replace(/^v/, '').split('.').map(Number);
  switch (type) {
    case 'major':
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1] += 1;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2] += 1;
      break;
  }
  return 'v' + parts.join('.');
}

async function generateDetailedReleaseNotes(commits, version, isInitialRelease) {
  const commitList = commits
    .map((c, i) => `${i + 1}. [${c.hash}] ${c.message}`)
    .join('\n');

  const prompt = isInitialRelease
    ? `
    This is the INITIAL release (${version}) of a project. Here are all commit messages from the repository:
    ${commitList}

    Please write comprehensive, detailed release notes for this initial release.
    - Start with an overview paragraph describing what this project/boilerplate offers.
    - Group changes into clear sections: Features, Improvements, Fixes, Infrastructure/DevOps, Testing, and Other as appropriate.
    - Be thorough and descriptive—list the key capabilities, integrations, and notable work.
    - Use Markdown formatting with headers and bullet points.
    - No emojis.
    - Aim for a professional, detailed changelog that gives readers a complete picture of the release.
  `
    : `
    Here are the commit messages for the new release ${version}:
    ${commitList}

    Please write short, clear, and natural-sounding release notes for this release.
    - Group changes into Features, Fixes, Improvements, and Other if needed.
    - Keep it concise and easy to read.
    - Start with a brief summary.
    - Use Markdown formatting.
    - No emojis.
  `;

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content.trim();
}

function createAndPushTag(version) {
  run(`git tag ${version}`);
  run(`git push origin ${version}`);
  console.log(`\nGit tag ${version} created and pushed.\n`);
}

function createGitHubRelease(version, notes) {
  const tmpFile = `.release_notes_tmp.md`;
  fs.writeFileSync(tmpFile, notes, 'utf8');

  execSync(`gh release create ${version} --title "${version}" -F ${tmpFile}`, {
    stdio: 'inherit',
  });

  fs.unlinkSync(tmpFile);
}

// --- Main Script ---

async function main() {
  console.log('\nAutomated Release Script\n');

  const lastTag = getLastTag();
  const commits = getCommitMessages(lastTag);
  const commitDetails = getCommitDetails(lastTag);

  if (!commits.length) {
    console.log('No new commits since last release.');
    process.exit(0);
  }

  console.log(
    `Found ${commits.length} commit(s) since ${lastTag || 'the beginning'}.\n`,
  );

  const arg = process.argv[2];
  let bumpType = arg
    ? arg.toLowerCase()
    : (
        (await askQuestion(
          'Choose version bump (major / minor / patch) [patch]: ',
        )) || 'patch'
      ).toLowerCase();

  if (!['major', 'minor', 'patch'].includes(bumpType)) {
    console.log('Invalid bump type, defaulting to patch.');
    bumpType = 'patch';
  }

  const newVersion = bumpVersion(lastTag, bumpType);
  console.log(`\nCreating release ${newVersion} (${bumpType} bump)\n`);

  const isInitialRelease = !lastTag;
  let notes;
  try {
    notes = await generateDetailedReleaseNotes(
      commitDetails,
      newVersion,
      isInitialRelease,
    );
  } catch (err) {
    console.error('Failed to generate release notes:', err);
    process.exit(1);
  }

  try {
    createAndPushTag(newVersion);
  } catch (err) {
    console.error('Failed to create or push git tag:', err);
    process.exit(1);
  }

  try {
    createGitHubRelease(newVersion, notes);
  } catch (err) {
    console.error('Failed to create GitHub release:', err);
    process.exit(1);
  }

  console.log('\nRelease process completed successfully.\n');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
