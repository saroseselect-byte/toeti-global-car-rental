# Exact TOETI homepage integration (private review)

This branch prepares integration of the user-approved standalone HTML into the existing Worker. The original ~15 MB HTML is **not committed** to this public repository: it contains embedded media and must be reviewed before publication.

To install on a local checkout of this branch, run:

```sh
node scripts/install-exact-homepage.mjs /path/to/TOETI-wereldhomepage-preview.html
npm test
npm run check
npx wrangler dev
```

The script injects the exact HTML only for GET /, preserving all other Worker routes. It adds an ASSETS binding and a noindex response header for private review. Compare desktop/mobile and test all interactions, links, supplier routes, booking/request flows, assets and languages. **Do not deploy, merge, or send supplier communications before explicit owner approval.**

Known gap: visual/client-side equivalence does not itself prove live booking/backend integration. The original HTML must be tested against actual route contracts. Never claim 100% complete without tests.
