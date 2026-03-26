# Project Overview  
We will replicate Poki’s look-and-feel in a Next.js app with a responsive, grid-based UI of game thumbnails and category menus.  For example, Poki uses a polished, minimalist design with a top category bar and tiled game listing; hovering over a game tile highlights it and shows a Play overlay.  Our design must match Poki’s emphasis on a “consistent and responsive” UI【31†L78-L82】.  Each game tile will be a fixed-size box (using `box-sizing: border-box`) with an image thumbnail and title; on hover we’ll apply a smooth CSS transition (e.g. subtle scale or overlay) to reveal a “▶ Play” button and quick game info.  We’ll use a CSS grid or flex container to arrange tiles responsively.  The home page will show featured/popular games, plus category navigation (e.g. “Action”, “Puzzle”, etc.) as horizontal tabs (similar to Poki’s top bar【3†L4-L11】).  The UI text and elements will use our branding (logo, colors) but follow Poki’s spacing, typography and hover effects.  

【42†embed_image】 *Figure: A player with a game controller (Unsplash) – the site will showcase games that users play on controllers or keyboard, presented in a similar visual style to Poki.*  

Key UI/UX features:  
- **Category navigation:** A sticky top menu listing game genres (2 Player, Action, Puzzle, .io, etc.) – clicking filters the game grid.  
- **Search / Sorting (optional):** A search box and sort options (e.g. “Popular”, “Latest”) to quickly find games.  
- **Game grid:** Responsive grid of thumbnail images with game title overlay.  Tiles change background or overlay on hover and show a Play button.  
- **Game detail view:** When a game is clicked, navigate (e.g. route `/games/[slug]`) to a full game page with an embedded game player (in an `<iframe>` or canvas) and game metadata (title, developer, ratings).  The game view includes “Fullscreen” and “Report a bug” links as on Poki【5†L25-L33】.  
- **Footer & Info:** A footer with links (About, FAQ, Privacy) and ad placeholders.  We’ll follow Poki’s copy guidelines (no annoying popups) and keep pages lightweight.  

All layout will be fully responsive (desktop and mobile).  The UX should remain “polished” and fast【31†L78-L82】. We will ensure all text is legible, buttons are prominent, and load times minimal.   

## Next.js Architecture and File Structure  
We’ll build using Next.js (latest stable) with the App Router or Pages Router.  Core pages include: the landing page, category pages, game listing, game detail pages, and admin routes.  Routing will follow Next.js conventions: e.g. `app/games/[slug]/page.tsx` for a game page, and `app/api/games/route.ts` for game-related APIs【56†L559-L568】. We will colocate each feature’s code: for example, the `/games` folder contains its page, components, and styles【46†L170-L177】.  Static assets (like game thumbnails) go into `public/` or served via CDN.  

A sketch of the project structure:  
```
/app or /pages/                 
  index.js              # Home (featured/popular games)  
  /games/[slug]/page.js # Game detail page (embeds the HTML5 game)  
  /category/[name]/page.js # Filter by category  
  /admin/                
    dashboard.tsx       # Admin homepage  
    games.tsx           # Manage games (upload/list/edit)  
    branding.tsx        # Logo/colors settings  
    ads.tsx             # Manage ad slots/units  
    auth.tsx            # User/admin auth management  
  /api/                 
    /games/             
      list.js           # GET list of games  
      detail/[slug].js  # GET game details  
      upload.js         # POST new game (zip upload)  
    /config/            
      branding.js       # GET/POST branding settings  
      ads.js            # GET/POST ad config  
```
We will use either Next.js API Routes or middleware (Route Handlers) for backend logic.  For example, `pages/api/upload.js` will handle file uploads.  We can use **Next.js Server Actions** or **API Routes with multer** to process uploads【54†L1-L4】【54†L25-L28】.  For large game ZIPs, we’ll use presigned uploads to S3/Cloud storage (Next.js can direct uploads to S3 for files >5MB【54†L25-L28】).  

We’ll use **TypeScript** and a CSS framework (Tailwind CSS or shadcn/ui) for styling.  Using a UI toolkit like [shadcn/ui](https://vercel.com/templates/next.js/next-js-and-shadcn-ui-admin-dashboard) and Tailwind has worked well for admin dashboards【46†L107-L116】.  Our code will use React components (e.g. `<GameCard>`, `<AdminForm>`, etc.) and Next.js built-in features (Image optimization, link prefetching).  

## Admin Panel Features  
The admin interface (protected by authentication and admin role) will allow managing all dynamic content. Key features:  
- **Game Management:** Upload new games (via ZIP), edit game metadata (title, description, thumbnail), and remove games.  An upload form posts a ZIP to the backend; the server extracts it to a safe directory (or to S3) and registers the game in the database or file index.  We’ll validate uploads (file type, size limit) and scan for viruses.  
- **Branding Settings:** Admin can set the site’s **logo** image and **color scheme** (primary colors).  We’ll store these settings in a configuration table or JSON.  The front-end will read theme colors (e.g. CSS variables) from this config.  For example, a `/config/branding` API returns the current logo URL and theme colors; the header component loads the logo from that URL.  
- **Authentication Setup:** Support sign-in via Google, Apple, Microsoft, and WebAuthn (passkeys).  We will use **NextAuth.js (Auth.js)** for authentication, which has built-in Google, Apple, and Azure/Microsoft providers【24†L33-L41】.  For example:  
  ```ts
  import NextAuth from "next-auth";
  import GoogleProvider from "next-auth/providers/google";
  import AppleProvider from "next-auth/providers/apple";
  import AzureADProvider from "next-auth/providers/azure-ad";
  // …
  export default NextAuth({
    providers: [
      GoogleProvider({ clientId: GOOG_ID, clientSecret: GOOG_SECRET }),
      AppleProvider({ clientId: APPLE_ID, clientSecret: APPLE_SECRET }),
      AzureADProvider({ clientId: MS_ID, clientSecret: MS_SECRET }),
      // ...add credentials or email provider if needed
    ],
    // additional config…
  });
  ```  
  NextAuth handles the OAuth flow and session cookies securely. For passkey support, Auth.js now includes a WebAuthn provider (experimental)【21†L246-L254】. We can enable `NextAuth({ providers: [PasskeyProvider], experimental: { enableWebAuthn: true } })` so users can register device passkeys.  Once logged in, admins can only access `/admin/*` pages (we’ll protect these routes via middleware or server session checks).  
- **Ads Management:** We will integrate Google AdSense/Ad Manager to monetize the site (as Poki does by showing ads【2†L76-L82】). The admin panel will have an “Ads” section where you can enter your Google AdSense *Publisher ID* and *Ad Slot IDs* for different positions (e.g. leaderboard, sidebar).  We’ll store these in config (or environment vars).  On game/detail pages and listings, we’ll render Google ad components (e.g. `<ins>` tags with the configured IDs).  Admin can enable/disable ads or change units without code changes.  For example, a React component might check a `config.ads.leaderboardEnabled` flag and then insert the AdSense script snippet in that location.  
- **User Accounts:** Optional user sign-up/sign-in (players). If needed, users can sign in to save favorites or leaderboards. This uses the same NextAuth setup. We will likely allow anonymous play but provide an optional “Sign in” to track scores/wishlists.  

All admin forms and tables will have server-side validation. We’ll use a UI library (e.g. react-hook-form + Tailwind) for speed. The admin theme can be a dark/light toggle and use the same branding colors.  

## Game Upload & Hosting Flow  
The core functionality is hosting multiple HTML5 games securely. Our flow: the admin uploads a ZIP containing the game’s `index.html` and assets. The server (Next.js backend or separate service) will:  
1. Receive the uploaded ZIP file via an API endpoint (using Next.js Route Handler or Server Action【54†L1-L4】).  
2. Validate it (check ZIP contents for an `index.html`, virus-scan if possible, size limits).  
3. Extract the contents to a game-specific folder (e.g. `/public/games/game-slug/`) or upload to cloud storage (S3). We may rename resources to avoid conflicts.  
4. Generate game metadata (thumbnail, title, description) and store it in a database (e.g. a JSON file or a real DB like PostgreSQL).  
5. Update the game listing so the new game appears on the site (e.g. by adding to a JSON manifest or DB table).  

When a player clicks a game, they load `/games/[slug]`. This page either embeds the game via an `<iframe src="/games/game-slug/index.html">` or by directly loading the HTML and JS (careful with SSR though). Either way, the browser will fetch the game files from our domain (or CDN) – we must ensure our headers prevent other domains from embedding or hotlinking our games.  

We will also implement pagination or lazy loading on game lists to avoid loading all games at once. For performance, we use Next.js code-splitting: each game page route will only bundle that game’s script, not every game【1†L163-L172】. The StackOverflow community suggests exactly this: serve each game on a separate route and let Next.js split code per route【1†L163-L172】.  

## Security and Anti-Cloning Measures  
Protecting game code on the web is challenging, but we’ll implement deterrents:  
- **Frame/Domain protection:** Use HTTP headers like `X-Frame-Options: SAMEORIGIN` or better, a CSP `frame-ancestors 'self'` to prevent other sites from framing our content【17†L206-L214】【49†L209-L218】.  This stops easy iframe embedding. We’ll also use the `Content-Security-Policy: frame-ancestors 'none'` (or `'self'`) directive so browsers refuse to render our pages if framed by unauthorized domains【49†L209-L218】.  
- **Domain checks in code:** In each game’s JavaScript, add a check like `if (window.location.host !== "ourdomain.com") { throw Error("Invalid domain"); }`. This won’t stop determined attackers but deters copying by making it fail when moved to another host. We’ll then obfuscate or bundle the game scripts (Next.js build with minification and Terser) to make manual scraping harder.  
- **Code obfuscation/minification:** While no solution is foolproof, minifying and obfuscating JavaScript (e.g. using Google Closure Compiler or jscrambler) makes the source code much harder to read【15†L248-L256】. Game libraries and logic will be bundled and minified. We will not store any secrets in client-side code.  
- **Server-side critical logic:** Any critical game logic (e.g. scoring, payments) will run on the server/API so it cannot be trivially extracted from JS. In general we follow the advice that “all inputs should be checked server-side”【15†L258-L265】.  
- **SSL and secure transport:** All traffic will use HTTPS to avoid tampering.  
- **Performance security:** Avoid leaking configuration or keys in client code. Keep environment secrets (e.g. Google OAuth client secrets, AdSense keys) in server env, never exposed in front-end.  
- **Rate limiting and WAF:** Optionally, deploy behind a Web Application Firewall (Cloudflare/WAF) to detect scraping bots or DDOS.  

Despite these, note that “if you can see it in a browser, you can download it”【15†L332-L340】. We acknowledge complete prevention is impossible, but layering these measures will deter most cloning.  

## Authentication and Authorization  
We will use **NextAuth.js (Auth.js)** for user and admin login【24†L33-L41】.  We can configure providers for: Google, Apple, and Microsoft (Azure) OAuth【24†L33-L41】, plus an email/password or magic-link option if needed.  In `next.config.js` or an auth file, we’ll list all providers.  NextAuth will handle the OAuth callbacks and session cookies securely (HTTP-only, sameSite, etc.). The admin pages will be protected by checking the session: only users with a certain email or role in the database can access the admin panel (we can extend the NextAuth callbacks to set `session.user.role = 'admin'`).  

Passkeys (WebAuthn) are experimental but supported by Auth.js. We’ll optionally add the Passkey provider so users can register device-based logins【21†L246-L254】.  This requires setting up the Auth.js Passkeys provider and database for WebAuthn credentials, as described in Auth.js docs【21†L246-L254】.  

All user sessions and tokens will be managed by NextAuth (which signs JWTs or session cookies with a secure key)【24†L33-L41】. We’ll also implement rate limiting on login and require CAPTCHA on admin login to prevent brute force.  

## Ads and Monetization  
As Poki does, we will monetize via ads: mainly Google AdSense or Google Ad Manager units integrated into our pages【2†L76-L82】.  The admin panel’s Ads section will allow configuration of each ad slot: for example, a leaderboard ad on top of game pages, a banner on home page, and interstitial ads between levels. Admin can paste the AdSense “ca-pub-XXXX” ID and slot IDs into our config. Our frontend will then render `<ins class="adsbygoogle"...>` tags with those IDs. We’ll use React components to insert ads in the correct places. Ad refresh and lazy-loading will be handled by Google’s script.  

The site must comply with Google policies (e.g. not too many ads, proper placement). We’ll verify ads appear only on high-resolution areas and do not cover UI. We’ll also load ads scripts asynchronously so they don’t block the main content.  

## Performance Optimization  
We will optimize for smooth gameplay and fast loads:  
- **Code splitting:** As mentioned, each game is split into its own chunk. The main app bundles only the shell + admin code. We use Next.js’s automatic splitting by route【1†L163-L172】.  
- **Lazy loading:** Use `next/image` for thumbnails (optimized with `srcset`), lazy-load off-screen images. Only fetch game assets when user clicks “Play”.  
- **Static generation:** We’ll statically render as many pages as possible (home and category pages can be pre-generated at build or via ISR). Game pages might use SSR if they need realtime data (like live high scores), but can also be SSG if static.  
- **Minification and compression:** Enable gzip/Brotli on server. Tree-shake and minify all JS/CSS.  
- **Caching:** Use CDNs for static assets (Next.js in production typically uses a global CDN like Vercel’s or AWS CloudFront). We’ll set HTTP cache headers for images and game files (immutable)【31†L125-L129】. Poki expressly disallows “excessive load size, poor performance”【31†L125-L129】, so we keep each game under ~10 MB compressed and under ~1–2 MB to load normally.  
- **Progressive loading:** Show a loading spinner or simple frame while a game loads, so the UI never hangs.  
- **Monitoring:** Integrate performance monitoring (e.g. New Relic or Google Lighthouse) in CI to catch regressions.  

By following these practices, our site will load quickly even on slow networks, and feel as smooth as Poki’s.  

## Implementation Steps and CI/CD  
1. **Scaffold Next.js app:** Initialize a new Next.js project (e.g. `create-next-app`). Configure `next.config.js`, TypeScript, and Tailwind (or other UI library).  
2. **Build main layout:** Create a top-level layout (`/app/layout.tsx` or `pages/_app.js`) with the header (branding logo & categories) and footer. Build the home page with placeholder game grid.  
3. **Game listing and detail routes:** Implement `pages/category/[name].js` and `pages/games/[slug].js`. Fetch game lists (for category) and game details from our back-end API. For now use mock data JSON. Style the game cards and detail view to match Poki (refer to Poki screenshots).  
4. **Admin pages:** Under `/pages/admin/`, create components for game upload, branding settings, ads settings. Secure them by wrapping with a server-side auth check (e.g. `getServerSideProps` verifying `getSession()` from NextAuth). Use forms to POST to `/api/` endpoints.  
5. **Back-end API:** In `/pages/api/`, create endpoints to handle games and settings:  
   - `POST /api/games/upload`: receives ZIP, validates and extracts. (Use multer or Next.js Server Action【53†L197-L205】.) Store game metadata in a database or JSON store.  
   - `GET /api/games`: lists all games (supports filter query for category).  
   - `GET /api/games/[slug]`: returns a single game’s data (and the URL to its index.html).  
   - `PUT/DELETE /api/games/[slug]`: edit or remove a game.  
   - `GET/POST /api/config/branding` and `/api/config/ads`: to get/set branding/ad configurations.  
6. **Authentication:** Set up NextAuth in `pages/api/auth/[...nextauth].js` with Google, Apple, Microsoft, and optionally passkey providers【24†L33-L41】【21†L246-L254】. Protect admin pages by checking `session.user.role === 'admin'`.  
7. **Ad integration:** Add Google AdSense script to `_document.js` or Layout, and insert ad placeholders in the game detail page. Read ad IDs from config (set by admin).  
8. **Styling and polish:** Apply CSS per Poki’s style – use `box-sizing: border-box`, consistent margins, card shadows, etc. Implement on-hover card effects with transitions. Add a “fullscreen” meta tag for mobile. Ensure any audio in games is muted by default (good UX).  
9. **Security headers:** Configure the server (or Next.js `next.config.js` headers) to include `X-Frame-Options: DENY` (or SAMEORIGIN) and `Content-Security-Policy: frame-ancestors 'self'`【17†L206-L214】【49†L209-L218】. Add `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, etc. Sanitize all inputs on server side.  
10. **Testing:** Write unit/integration tests for key components. Manually test game upload and play. Use Lighthouse to audit performance (aim for >90 scores).  
11. **Deployment/CI-CD:** Push code to GitHub and set up a pipeline (GitHub Actions) to run tests and build on each commit. Deploy to Vercel or Netlify for hosting. These platforms support Next.js SSR and static optimization out-of-box. On each merge to main, the CI will rebuild and deploy.  

A summary of the proposed file structure could be included as a markdown code block to guide implementation.  With this plan, an AI IDE or developer can generate the Next.js codebase end-to-end.

**Sources:** We followed Poki’s own design guidelines and public docs【31†L78-L82】【2†L76-L82】, used NextAuth examples【24†L33-L41】【21†L246-L254】, and best practices from Next.js and StackOverflow (e.g. code-splitting games【1†L163-L172】) to inform the implementation details. 

