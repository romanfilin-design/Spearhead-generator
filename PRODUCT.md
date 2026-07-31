# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two players of Warhammer Age of Sigmar: Spearhead, using the app together at the same physical table during a live tabletop skirmish match — one device per player, or shared. Potentially wider: other Spearhead players could pick this up if shared, so it should read as a real product, not a private tool only its author understands. Primary job: track army state (HP, activations, VP, twist deck, tactics hand) without falling back to paper.

## Product Purpose
Digital companion/scorekeeper for Spearhead battles. Replaces paper HP trackers, printed twist-card decks, and manual score tallying with a synced, mobile-first tracker both players can run live during a game.

## Positioning
Purpose-built for this exact game (not a generic notebook or spreadsheet): real warscroll data (armies, weapons, abilities) baked in, a clickable rules glossary for weapon-ability terms, live two-device room sync (Firestore) so both players see round/VP/twist state without calling numbers across the table, and official unit portraits.

## Operating Context
Used in-hand or propped on a table next to physical miniatures, terrain, and dice during a live game session (~1–2 hours). Room lighting varies (often dim, evening game nights); one-handed use is common while the other hand handles models. Two devices may be open simultaneously via the same room code. [Inferred, confirmed: dim-room legibility is the primary accessibility concern — no other stated constraint.]

## Capabilities and Constraints
Static HTML/CSS/JS, no build step, no framework. Data-driven from `armies.json` (army/unit/ability/weapon data, hand-curated per official warscrolls). Firebase (Firestore + anonymous auth) for room sync of round/VP/twist state and each player's own army/HP/activation state, read-only mirrored to the opponent. Unit portraits are product photography with backgrounds removed (rembg), stored in `assets/textures/`. Mode picker gates the app; only one mode ("Sand & Bone" / Realm of Death ruleset) is implemented, two more are reserved placeholders. Mobile-first; desktop is secondary.

## Brand Commitments
App name "Sand & Bone". Displays the official Warhammer Age of Sigmar: Spearhead logo (GW asset, not to be redrawn) in the header. No other locked brand elements — current visual system ("grimdark" dark theme, Cinzel/Inter pairing, bronze accent) is treated as evidence/incumbent, not a binding constraint, for redesign exploration.

## Evidence on Hand
Real army/unit/ability/weapon data for 5 armies in `armies.json`. Real unit portrait images (background-removed) in `assets/textures/`. No fabricated content needed — all game text is sourced from official warscrolls (mechanics only, flavor/lore text intentionally stripped from ability cards per user rule, kept only in a separate per-unit lore spoiler).

## Product Principles
1. Playable one-handed, at a table, in a dim room — legibility and touch-target size outrank decoration.
2. Real data only — no placeholder game text; decorative art may be a placeholder until generated, but rules text is always real.
3. Two-device parity — anything either player needs to see (round, VP, twist, opponent's army state) must work identically on both screens without verbal cross-table sync.
4. The mode picker is a real seam, not cosmetic — future rulesets are a first-class extension point, not an afterthought.

## Accessibility & Inclusion
Primary concern is legibility in low/variable ambient light (evening game sessions) — sufficient contrast and touch-target size matter more than typical daylight-reading assumptions. No other confirmed requirement.
