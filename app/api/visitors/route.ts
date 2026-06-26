import { NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount, isVisitorCounterConfigured } from '@/lib/visitors';

export const runtime = 'nodejs';

export async function GET() {
  if (!isVisitorCounterConfigured()) {
    return NextResponse.json({ enabled: false, count: 0 }, { status: 200 });
  }

  const count = await getVisitorCount();
  return NextResponse.json({ enabled: true, count }, { status: 200 });
}

export async function POST() {
  if (!isVisitorCounterConfigured()) {
    return NextResponse.json({ enabled: false, count: 0 }, { status: 200 });
  }

  const count = await incrementVisitorCount();
  return NextResponse.json({ enabled: true, count }, { status: 200 });
}
