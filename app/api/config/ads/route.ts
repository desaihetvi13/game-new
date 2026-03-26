import { NextRequest, NextResponse } from "next/server";
import { getAdsConfig, setAdsConfig } from "@/lib/config";
import { adsSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  try {
    const ads = await getAdsConfig();
    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ads config" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const payload = adsSchema.parse(body);
    await setAdsConfig(payload);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save ads config" }, { status: 500 });
  }
}
