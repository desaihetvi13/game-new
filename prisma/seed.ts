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

  const games = [
    {
      slug: "stacktris",
      title: "Stacktris",
      description: "Stack blocks and survive in this fast arcade challenge.",
      category: "Arcade",
      thumbnail:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://htmlxm.github.io/h6/stacktris/",
      developer: "HTMLXM",
      rating: 4.8,
      featured: true,
      plays: 4200,
      active: true,
    },
    {
      slug: "blumgi-ball",
      title: "Blumgi Ball",
      description: "Bouncy basketball gameplay with fun trick shots.",
      category: "Sports",
      thumbnail:
        "https://images.unsplash.com/photo-1546519156-d8114228c21b?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://htmlxm.github.io/h2/blumgi-ball/",
      developer: "HTMLXM",
      rating: 4.7,
      featured: true,
      plays: 5300,
      active: true,
    },
    {
      slug: "grand-racing-2026",
      title: "Grand Racing 2026",
      description: "Formula-style high-speed racing and tight corner battles.",
      category: "Racing",
      thumbnail:
        "https://images.unsplash.com/photo-1547915721-dba249bc0148?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://v6p9d9t4.ssl.hwcdn.net/html/145/index.html",
      developer: "RacingDev",
      rating: 4.6,
      featured: true,
      plays: 6100,
      active: true,
    },
    {
      slug: "neon-puzzle-blocks",
      title: "Neon Puzzle Blocks",
      description: "A calm puzzle experience with glowing block mechanics.",
      category: "Puzzle",
      thumbnail:
        "https://images.unsplash.com/photo-1553481199-ea51732df213?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://v6p9d9t4.ssl.hwcdn.net/html/145/index.html",
      developer: "ZenGames",
      rating: 4.5,
      featured: true,
      plays: 2800,
      active: true,
    },
    {
      slug: "space-shooter-galaxy",
      title: "Space Shooter Galaxy",
      description: "Classic bullet-hell action in deep space.",
      category: "Action",
      thumbnail:
        "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://v6p9d9t4.ssl.hwcdn.net/html/145/index.html",
      developer: "ArcadeFlyer",
      rating: 4.2,
      featured: false,
      plays: 1700,
      active: true,
    },
    {
      slug: "combat-io",
      title: "Combat.io",
      description: "Multiplayer arena battles with instant matchmaking.",
      category: ".io",
      thumbnail:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400&h=300",
      gameUrl: "https://v6p9d9t4.ssl.hwcdn.net/html/145/index.html",
      developer: "IOGamesInc",
      rating: 4.1,
      featured: true,
      plays: 7500,
      active: true,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
