# Minerva Match

Minerva plush sticker memory matching game.

## Run

Open `index.html` directly in a browser.

## Assets

Card images live in `assets/` and use three-digit JPG names:

```txt
assets/card-001.jpg
assets/card-002.jpg
assets/card-003.jpg
```

When adding or replacing cards, keep the sequence continuous and update
`assetCount` in `index.html`. Keep card images around 384-512px wide for smooth mobile loading.

Recommended minimums:

- `2x2`: 2 images
- `4x4`: 8 images
- `6x6`: 18 images

UI images live in `res/`:

- `logo.png`: game logo and card-back badge. Keep it around 256-512px wide for a fast first screen.
- `nice.png`: win dialog image
