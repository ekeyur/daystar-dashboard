import { NextResponse } from "next/server";

const COOKIE_NAME = "site_authenticated";
const TWO_MONTHS_IN_SECONDS = 60 * 60 * 24 * 60; // 60 days

export async function POST(request) {
  try {
    const { password } = await request.json();
    const sitePassword = process.env.SITE_PASSWORD;

    if (!sitePassword) {
      // If no password is set, allow access
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TWO_MONTHS_IN_SECONDS,
      });
      return response;
    }

    if (password === sitePassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TWO_MONTHS_IN_SECONDS,
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: "Wrong Password" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 },
    );
  }
}
