# Birthday tribute: Apostle Chidi Emmanuel Amanoh

Static site. No build step, no dependencies.

## Structure

```
index.html        Home: the storyline
voices.html       Every testimony, with filters
css/styles.css    All styles (design tokens at the top)
css/fonts.css     Self-hosted fonts
js/content.js     ALL content: names, chapters, testimonies, media paths
js/main.js        Rendering, background video, video player, filters
js/type-review.js REVIEW ONLY: the D / E type switcher (see below)
assets/video/     Background loops and testimony clips
assets/img/       Posters and photographs
assets/fonts/     League Gothic, Noto Serif Display, Onest, Archivo (SIL OFL)
```

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening index.html straight from disk also works.

## Replacing placeholders

Everything is edited in `js/content.js`. Every placeholder video and image has the
word PLACEHOLDER baked into it, and every placeholder testimony starts with
"Placeholder.", so anything not yet replaced is visible on the page.

| What | Where in content.js | Notes |
|---|---|---|
| Birthday date, church, years in ministry | `occasion` | Empty values are hidden on the page |
| Opening film | `hero.film.src` | Opens from "Play video" in the hero |
| Hero background | `hero.video`, `hero.poster` | |
| Chapter backgrounds | `chapters[].video`, `.poster` | Only `panel` and `center` layouts use one |
| Testimonies | `testimonies[]` | One line each; add as many as you collect |
| Photographs | `years.photos[]` | Oldest first |
| Closing blessing and background | `closing` | |

To add, remove or reorder chapters, edit `chapters` in content.js and the matching
`<div class="chapter" data-chapter="...">` lines in index.html.

## Type treatments (temporary)

Two type treatments ship side by side while the choice is open. The pill in the bottom
right corner switches between them and remembers the choice across pages.

- D: League Gothic for names, Noto Serif Display italic for testimonies, Onest for the rest
- E: Archivo throughout, wide light set against narrow heavy

Once one is chosen: delete `js/type-review.js` and its `<script>` tag in both HTML files,
set `<html data-type="d">` or `"e"`, and remove the unused fonts from `css/fonts.css`
and `assets/fonts/`.

Titles in `content.js` use two marks: `*word*` sets an accent word and `|` splits a title
into a lead part and a key part. D draws the accent word in italic serif; E sets the lead
wide and the key narrow.

## Media specs

Background loops (hero, chapters, closing):
- MP4, H.264, 1920x1080, 10 to 15 seconds, no audio track, under 5 MB
- Keep the subject away from the bottom third; text sits there
- Supply a poster JPG (first frame) for each

Testimony clips:
- MP4, H.264 video with AAC audio, landscape, 1080p
- Supply a 16:9 poster JPG for each
- If the total gets large, host the clips on a video CDN or object storage and put
  the full URL in `src`

Photographs: JPG, 4:5 portrait crop, about 800x1000.

## Behaviour worth knowing

- Background videos load and play only while on screen, and pause while the player is open.
- With "reduce motion" or data saver on, background videos do not load; the poster shows instead.
- `voices.html#<chapter id>` opens that page filtered to a chapter (for example `voices.html#home`).
- The player steps through the videos of the current chapter, or the current filter on the voices page.
