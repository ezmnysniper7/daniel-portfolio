import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  need?: string;
  timeline?: string;
  budget?: string;
  page?: string;
  locale?: string;
  website?: string;
  submittedAt?: number;
};

/** What the visitor says they need; the keys match ContactNeed in data/dictionary.ts. */
const NEEDS: Record<string, string> = {
  discovery: 'Discovery / architecture',
  build: 'MVP or platform build',
  lead: 'Founding engineer / technical lead',
  role: 'Permanent role',
  other: 'Other',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /(https?:\/\/|www\.)/gi;
/** A link or two is normal (a client's website); a pile of them is spam. */
const MAX_LINKS = 3;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_SUBMIT_TIME_MS = 2500;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_SHORT_FIELD = 160;

/** Optional one-line fields: trimmed, capped, never trusted. */
const short = (value: unknown) => (typeof value === 'string' ? value.trim().slice(0, MAX_SHORT_FIELD) : '');

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return `${ip}:${userAgent.slice(0, 80)}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isSpamPayload(payload: { name: string; email: string; message: string; website: string; submittedAt: number }) {
  if (payload.website.trim() !== '') return true;
  if (payload.submittedAt <= 0) return true;

  const elapsed = Date.now() - payload.submittedAt;
  if (elapsed < MIN_SUBMIT_TIME_MS) return true;

  if (payload.name.length > MAX_NAME_LENGTH || payload.email.length > MAX_EMAIL_LENGTH) return true;
  if (payload.message.length < 10 || payload.message.length > MAX_MESSAGE_LENGTH) return true;
  if ((payload.message.match(urlRegex) || []).length > MAX_LINKS) return true;
  if (/(.)\1{8,}/.test(payload.message)) return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const payload = {
      name: body.name?.trim() || '',
      email: body.email?.trim() || '',
      company: short(body.company),
      message: body.message?.trim() || '',
      need: NEEDS[body.need || ''] ? (body.need as string) : 'other',
      timeline: short(body.timeline),
      budget: short(body.budget),
      page: short(body.page),
      locale: body.locale === 'zh-CN' ? 'zh-CN' : 'en',
      website: body.website?.trim() || '',
      submittedAt: Number(body.submittedAt || 0),
    };

    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!emailRegex.test(payload.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    if (isSpamPayload(payload)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || 'chendaniel150701@gmail.com';

    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      console.error('Resend API key not configured properly');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const row = (label: string, value: string) => (value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : '');
    const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br>');

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: toEmail,
      subject: `[${NEEDS[payload.need]}] ${payload.name}${payload.company ? ` (${payload.company})` : ''} via danielchenbuilds.com`,
      replyTo: payload.email,
      html: `
        <h2>New enquiry from danielchenbuilds.com</h2>
        <p><strong>Needs:</strong> ${NEEDS[payload.need]}</p>
        <p><strong>From:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${row('Company or project', payload.company)}
        ${row('Timeline', payload.timeline)}
        ${row('Budget range', payload.budget)}
        ${row('Sent from page', payload.page)}
        <p><strong>Site language:</strong> ${payload.locale}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p style="color:#666;font-size:12px;">
          Sent from your portfolio at ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' })} (MYT). Reply to this email to answer them directly.
        </p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
