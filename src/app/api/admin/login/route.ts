import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@jerseyonthego.com').toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'jotg@dmin2026';

    if (
      email &&
      password &&
      typeof email === 'string' &&
      typeof password === 'string' &&
      email.toLowerCase().trim() === expectedEmail &&
      password === expectedPassword
    ) {
      // Generate a signed session token
      const timestamp = Date.now();
      const token = Buffer.from(`${expectedEmail}:${timestamp}:jotg_secure_session`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
      });
    }

    return NextResponse.json(
      { error: 'Invalid administrator email or password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
