// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import * as Ably from "ably";

export async function GET() {
  try {
    if (!process.env.ABLY_API_KEY) {
      return NextResponse.json({ error: "Missing ABLY_API_KEY" }, { status: 500 });
    }

    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    // optionally you can set a clientId based on auth session
    const tokenRequestData = await client.auth.createTokenRequest({});
    // Return the tokenRequest object to the client so it can create a realtime token
    return NextResponse.json(tokenRequestData);
  } catch (err: any) {
    console.error("Auth token creation error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
