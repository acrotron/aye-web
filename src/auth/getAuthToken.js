// src/auth/getAuthToken.js
//import { Auth } from "aws-amplify";
//import { Auth } from '@aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Returns the current Cognito **access** token.
 * Throws if the user is not signed‑in.
 */
export async function getAuthToken_bad() {
  // Amplify automatically refreshes the session when needed.
  //const session = await Auth.currentSession();
  //return session.getAccessToken().getJwtToken(); // <-- the JWT string
}

export async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    const idTokenJwt = session.tokens?.idToken?.toString(); // Get the JWT string of the ID token

    if (idTokenJwt) {
      return idTokenJwt;
    } else {
      console.log('No ID Token found in session.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching auth session:', error);
    return null;
  }
}

