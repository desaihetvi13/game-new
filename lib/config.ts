import { prisma } from "@/lib/prisma";
import { adsSchema, brandingSchema } from "@/lib/validators";
function isConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("can't reach database server") ||
    message.includes("database server") ||
    message.includes("connection") ||
    message.includes("p1001")
  );
}


export interface BrandingConfig {
  logoUrl: string;
  siteName: string;
  primaryColor: string;
  tagline: string;
}

export interface AdsConfig {
  enabled: boolean;
  publisherId: string;
  leaderboardSlotId: string;
  sidebarSlotId: string;
  interstitialSlotId: string;
}

const defaultBranding: BrandingConfig = {
  logoUrl: "/logo.svg",
  siteName: "GamePortal",
  primaryColor: "#7c3aed",
  tagline: "Play Free HTML5 Games Online",
};

const defaultAds: AdsConfig = {
  enabled: false,
  publisherId: "",
  leaderboardSlotId: "",
  sidebarSlotId: "",
  interstitialSlotId: "",
};

async function getConfig<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.config.findUnique({ where: { key } });
    if (!row) {
      await prisma.config.create({ data: { key, value: fallback as object } });
      return fallback;
    }
    return row.value as T;
  } catch (error) {
    if (isConnectionError(error)) {
      return fallback;
    }
    throw error;
  }
}

async function setConfig<T>(key: string, value: T): Promise<void> {
  try {
    await prisma.config.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return;
    }
    throw error;
  }
}

export const getBranding = async () =>
  brandingSchema.parse(await getConfig<BrandingConfig>("branding", defaultBranding));
export const setBranding = async (data: BrandingConfig) => setConfig("branding", brandingSchema.parse(data));
export const getAdsConfig = async () => adsSchema.parse(await getConfig<AdsConfig>("ads", defaultAds));
export const setAdsConfig = async (data: AdsConfig) => setConfig("ads", adsSchema.parse(data));
