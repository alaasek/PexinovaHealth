import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);
// src/services/googleAuth.ts
export interface GooglePayload {
  email?: string;
  name?: string;
  sub?: string;      // identifiant unique Google
  picture?: string;  // optionnel
}

export async function verifyGoogleToken(token: string): Promise<GooglePayload> {
  try {
    const audiences = [
      process.env.GOOGLE_CLIENT_ID_WEB!,
      process.env.GOOGLE_CLIENT_ID_ANDROID!,
      process.env.GOOGLE_CLIENT_ID_IOS!,
    ].filter(Boolean);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: audiences,
    });

    return ticket.getPayload() as GooglePayload;
  } catch (err) {
    const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    return (await res.json()) as GooglePayload;
  }
}
