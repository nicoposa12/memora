import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { DEFAULT_PLANS, PlanConfig } from '@/lib/plans';

// Seed default plans matching Admin Plans & Feature Matrix (2 templates, 5 layouts for Free Trial)
const INITIAL_SAVED_PLANS: Record<'free' | 'pro' | 'studio', PlanConfig> = {
  ...DEFAULT_PLANS,
  free: {
    ...DEFAULT_PLANS.free,
    allowedTemplateIds: ['classic_filmstrip', 'vogue_met'],
    allowedLayoutIds: ['strip4', 'strip3', 'grid2x2', 'filmstrip', 'grid2x3'],
    templatesUnlocked: '2 Templates Included',
  },
};

function getStoragePath(): string {
  return path.join(process.cwd(), 'data', 'plans.json');
}

async function loadPlansFromFile(): Promise<Record<'free' | 'pro' | 'studio', PlanConfig>> {
  const filePath = getStoragePath();
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.free && parsed.pro && parsed.studio) {
      return parsed;
    }
  } catch {}
  return INITIAL_SAVED_PLANS;
}

async function savePlansToFile(plans: Record<'free' | 'pro' | 'studio', PlanConfig>): Promise<void> {
  const filePath = getStoragePath();
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(plans, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const plans = await loadPlansFromFile();
    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plans = body?.plans || body;

    if (!plans || typeof plans !== 'object' || !plans.free || !plans.pro || !plans.studio) {
      return NextResponse.json(
        { success: false, error: 'Invalid plans payload. Expected free, pro, and studio configurations.' },
        { status: 400 }
      );
    }

    await savePlansToFile(plans);
    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save plans' },
      { status: 500 }
    );
  }
}
