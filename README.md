# Mary Dolson, LCSW site

This is a static site deployed on Vercel.

The built output uses a site URL env var instead of hardcoded canonical and sitemap URLs.

## Current production setup

- Linked Vercel project: `punk-as-fun`
- Booking and coverage URL: `https://secure.helloalma.com/providers/mary-kima-dolson/`
- Analytics: none configured
- Site URL source: `SITE_URL`, or Vercel system envs `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`

## Files

- `index.html`: homepage
- `privacy.html`: privacy page
- `site-use.html`: site use / disclaimer page
- `mary-hero.png`, `favicon.svg`, `social-share.svg`: site assets
- `robots.txt`, `sitemap.xml`: crawl and indexing files

## Publish workflow

1. Build locally with `SITE_URL=https://punk-as-fun.vercel.app npm run build`.
2. Run `npm run lint`.
3. Preview the built site from `dist/`.
4. Deploy with `vercel`.
5. Confirm the production domain points to the expected Vercel project.

## Launch checks

- Verify `https://secure.helloalma.com/providers/mary-kima-dolson/` still works.
- Confirm `mary@marydolsonlcsw.com` is the right public email.
- Confirm `SITE_URL` or the Vercel system env resolves to the intended production base URL.
- Submit a live consultation request test through Alma.
- Check that `robots.txt`, `sitemap.xml`, and social preview assets load on production.

## Post-launch monitoring

- Re-test the Alma booking link after each deploy.
- Check the homepage, `privacy.html`, and `site-use.html` on the live domain.
- Confirm `robots.txt` and `sitemap.xml` load from production.
- If a custom domain is added later, update `SITE_URL` so canonical URLs and the sitemap build with that domain.