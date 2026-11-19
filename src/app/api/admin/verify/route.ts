import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body || {};

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.includes('jotg_secure_session')) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false }, { status: 401 });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
