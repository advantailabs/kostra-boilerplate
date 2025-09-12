import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/utils/response';
import { getAllBlogs } from '@/services/repositories/blogs';
import { decode } from 'html-entities';
import { marked } from 'marked';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = getUserIdFromHeaders(_request);
    if (!userId) {
      return unauthorizedResponse();
    }

    // Fetch all blogs from the database
    const blogs = await getAllBlogs();

    if (blogs.length === 0) {
      return successResponse({
        message: 'No blogs found to convert',
        convertedCount: 0,
      });
    }

    let convertedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each blog
    for (const blog of blogs) {
      try {
        // Convert markdown to HTML using marked library and decode HTML entities
        const htmlContent = decode(
          await marked(blog.content, {
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert line breaks to <br>
          })
        );

        // Update only the content field in the database
        await prisma.blog.update({
          where: { id: blog.id },
          data: {
            content: htmlContent,
          },
        });

        convertedCount += 1;
      } catch (blogError) {
        console.error(`Error converting blog "${blog.title}" (ID: ${blog.id}):`, blogError);
        errorCount += 1;
        errors.push(`Blog "${blog.title}" (ID: ${blog.id}): ${blogError}`);
      }
    }

    return successResponse({
      message: 'Markdown to HTML conversion completed',
      totalBlogs: blogs.length,
      convertedCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return errorResponse('Failed to convert markdown to HTML');
  }
}
