import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, WALLET_SESSION_COOKIE } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getTelegramLinkCookieOptions, TELEGRAM_LINK_COOKIE } from '@/lib/telegram/link-state';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await supabaseAdmin.auth.admin.signOut(token);
    } catch {
      // Clear local cookie even when token revocation fails.
    }
  }

  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  cookieStore.set(WALLET_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  cookieStore.set(TELEGRAM_LINK_COOKIE, '', getTelegramLinkCookieOptions(0));

  return NextResponse.json({ ok: true });
}
