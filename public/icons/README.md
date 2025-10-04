# FocusFlow Icons

This directory contains the extension icons in multiple sizes required for browser stores and various UI contexts.

## Icon Sizes

- **icon-16.png**: 16×16px - Browser toolbar (standard DPI)
- **icon-32.png**: 32×32px - Browser toolbar (high DPI)
- **icon-48.png**: 48×48px - Extension management page
- **icon-128.png**: 128×128px - Chrome Web Store listing

## Current Status

The icons are currently provided as SVG files for easy editing and scaling. To convert to PNG format:

### Option 1: Use the Icon Converter Tool

1. Open `icon-converter.html` in your browser
2. Click "Generate PNG" for each size
3. Right-click each canvas and "Save image as..."
4. Save with the correct filename (icon-16.png, etc.)

### Option 2: Online Conversion

1. Upload SVG files to [CloudConvert](https://cloudconvert.com/svg-to-png)
2. Download PNG versions
3. Rename to match required filenames

### Option 3: Command Line (if ImageMagick installed)

```bash
magick icon-16.svg icon-16.png
magick icon-32.svg icon-32.png
magick icon-48.svg icon-48.png
magick icon-128.svg icon-128.png
```

### Option 4: Design Tools

Open SVG files in:

- Inkscape (free)
- Adobe Illustrator
- Figma
- Sketch

Export each as PNG at the corresponding size.

## Design Notes

The FocusFlow icon represents:

- **Brain shape**: Neurodiversity and cognitive focus
- **Neural connections**: Network of thoughts and ideas
- **Central focus point**: Concentration and attention
- **Calming colors**: Blue gradient for tranquility
- **Accessibility**: High contrast for visibility

## Future Improvements

- Professional icon design by a graphic designer
- Animated icon variants for different states
- Dark mode versions
- Accessibility-optimized color schemes
- Brand consistency across all materials
