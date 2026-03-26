import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.config.upsert({
    where: { key: "branding" },
    update: {},
    create: {
      key: "branding",
      value: {
        logoUrl: "/logo.svg",
        siteName: "GamePortal",
        primaryColor: "#7c3aed",
        tagline: "Play Free HTML5 Games Online",
      },
    },
  });

  await prisma.config.upsert({
    where: { key: "ads" },
    update: {},
    create: {
      key: "ads",
      value: {
        enabled: false,
        publisherId: "",
        leaderboardSlotId: "",
        sidebarSlotId: "",
        interstitialSlotId: "",
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
