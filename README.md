# KDE Plasma 6 Inspired Jekyll Blog

A Jekyll website that recreates the KDE Plasma 6 desktop experience in a web browser. Features include:

## Features

- **KDE Plasma 6 Design**: Authentic desktop environment look and feel
- **Animated Wallpaper**: Dynamic floating dots background animation
- **Taskbar Interface**: Bottom taskbar with app launcher and system tray
- **Dolphin File Manager**: Browse blog posts as files with list view
- **Kate Text Editor**: Read individual posts in editor-style interface
- **Pagination Support**: Navigate through multiple pages of posts
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Elements**: Draggable windows, ripple effects, hover states

## Quick Start

1. **Install Jekyll and dependencies**:
   ```bash
   gem install bundler jekyll
   bundle install
   ```

2. **Run the development server**:
   ```bash
   bundle exec jekyll serve
   ```

3. **Open in browser**:
   Navigate to `http://localhost:4000`

## Usage

- Click the **folder icon** in the taskbar to open the file manager
- **Browse posts** in the Dolphin-style file manager interface
- **Click any post** to open it in the Kate text editor view
- Use **pagination controls** at the bottom to navigate between pages
- **Drag windows** by their title bars to reposition them

## Customization

### Adding Posts
Create new posts in the `_posts` directory:
```markdown
---
layout: post
title: "Your Post Title"
date: 2024-01-01 12:00:00 +0000
categories: category1 category2
author: your-username
---

Your post content here...
```

### Styling
Modify `assets/css/desktop.css` to customize:
- Color scheme (CSS variables in `:root`)
- Layout dimensions
- Animation timings
- Typography

### JavaScript
Edit `assets/js/desktop.js` to modify:
- Interactive behaviors
- Animation effects
- Window management
- Desktop functionality

## Deployment

### GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Your site will be available at `https://username.github.io/repository-name`

### Manual Deployment
```bash
bundle exec jekyll build
# Upload _site/ directory to your web server
```

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design included

## Contributing

Feel free to submit issues and pull requests to improve the theme and add new features.

## License

This project is open source and available under the MIT License.