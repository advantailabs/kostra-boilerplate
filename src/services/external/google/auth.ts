// This file handles Google OAuth authentication using @react-oauth/google
import axios from 'axios';

export interface GoogleUserInfo {
  id: string | undefined;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
  sub?: string;
  email_verified?: boolean;
}

// Helper function to extract user info from Google OAuth response
export const extractGoogleUserInfo = (response: GoogleUserInfo): GoogleUserInfo => {
  return {
    id: response.id || response.sub,
    email: response.email,
    name: response.name,
    picture: response.picture,
    verified_email: response.verified_email || response.email_verified || false,
  };
};

// Helper function to validate Google OAuth response
export const validateGoogleResponse = (response: GoogleUserInfo): boolean => {
  return !!(response && response.email && (response.id || response.sub));
};

export async function verifyGoogleToken(accessToken: string) {
  try {
    // Use the access token to get user info from Google's userinfo endpoint
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid Google access token');
  }
}
