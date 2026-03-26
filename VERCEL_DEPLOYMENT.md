# Deploying Game Portal to Vercel

## Required Environment Variables

Set all values in Vercel project settings:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-32-plus-char-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAIL=admin@example.com
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=
```

## Vercel Build Settings

- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run prisma:generate && npm run build`

## Prisma Database Setup

Run migrations in CI or release pipeline:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Optional initial config seed:

```bash
npm run seed
```

## Google OAuth Setup

In Google Cloud Console:

- Authorized JavaScript origins:
  - `https://your-domain.com`
- Authorized redirect URIs:
  - `https://your-domain.com/api/auth/callback/google`

## Storage Setup (AWS S3)

- Create bucket and IAM user with `s3:PutObject` permission.
- Set env vars listed above.
- Uploaded game ZIP files are extracted and uploaded under:
  - `games-content/<slug>/...`

## Deploy

```bash
npm i -g vercel
vercel
vercel --prod
```

