import { NextRequest, NextResponse } from "next/server";
import { getBranding, setBranding } from "@/lib/config";
import { brandingSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  try {
    const branding = await getBranding();
    return NextResponse.json({ branding });
  } catch {
    return NextResponse.json({ error: "Failed to fetch branding" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const payload = brandingSchema.parse(body);
    await setBranding(payload);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save branding" }, { status: 500 });
  }
}
