# TOETI international launch audit gate (11 October 2026)

Owner approved cloning and Cloudflare deployment **only after a clean audit**. Keep existing supplier routes and request flow. Do not claim error-free until proven.

## Verified
- Existing repo: 26/26 Node tests passed on Penguin (11 October 2026).
- Existing Worker route entry is `src/entry.js`; production is not modified.
- Original HTML (in conversation container, not yet on Penguin) contains ~15 MB embedded assets and supports only `nl` and `en` for client-side localization.
- Existing HTML chooses NL only for Dutch browser languages, otherwise EN. It does **not** support automatic country-specific language selection.
- Existing regions include Africa, Europe, Asia and Oceania; Caribbean is missing. Curaçao is not included among the destinations.

## Mandatory before deploy
1. Transfer exact original HTML to Penguin private worktree and verify SHA-256 against original.
2. Implement language selection based on locale with a visible manual override, persisted preference, correct document `lang`, localized SEO metadata and accessibility labels. Geo-IP is optional; browser locale is not equivalent to country. Avoid falsely implying all world languages are covered. Localize **all** customer-facing UI, forms, validation, and confirmations for each supported locale; fallback to EN.
3. Add Caribbean region and Curaçao as a destination without inventing an approved supplier, inventory, prices, booking links, or availability. Keep unapproved listings non-bookable.
4. Audit all source image assets, text, animation, buttons, mobile behavior, security/CSP, and full routes; no changes to existing supplier and booking endpoints.
5. Run existing automated tests plus browser interaction regression on mobile/desktop; test each supported locale. Confirm no broken images and no false claims.
6. Use a private Cloudflare preview with access control or equivalent non-public environment. **No deployment of unverified changes to the public production hostname.** Production release is owner-authorized after passing these gates; record evidence.

## Blocking dependency
Original HTML is not present on Penguin. Local worktree: `/home/desmar124/toeti-exact-homepage-private`. User must transfer the ZIP/HTML to Chromebook Downloads or an authorized accessible source. Do not replace it with an approximation.
