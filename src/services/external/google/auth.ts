import { OAuth2Client } from 'google-auth-library';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials not configured');
}

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
);

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export const getGoogleAuthUrl = (state?: string) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
  });
};

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const verifyGoogleToken = async (idToken: string): Promise<GoogleUserInfo> => {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token');
  }

  return {
    id: payload.sub,
    email: payload.email!,
    name: payload.name!,
    picture: payload.picture,
    verified_email: payload.email_verified || false,
  };
};

export const getGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  oauth2Client.setCredentials({ access_token: accessToken });

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  return userInfoResponse.json();
};
