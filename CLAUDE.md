# Claude Memory Bank - KDE Plasma 6 Jekyll Blog

## Project Overview
This is a Jekyll blog designed to mimic the KDE Plasma 6 desktop environment. The entire site functions as an interactive desktop experience with:

- **Blog URL**: https://lpsandaruwan.github.io (configured in _config.yml)
- **Owner**: Lahiru Sandaruwan (lpsandaruwan)
- **Location**: Colombo, Sri Lanka
- **Email**: hello@lpsandaruwan.dev

## Architecture

### Core Technologies
- **Jekyll** static site generator
- **GitHub Pages** hosting
- **Custom CSS/JS** for Plasma 6 desktop simulation
- **Liquid templating** for dynamic content

### File Structure
```
├── _config.yml           # Jekyll configuration
├── _layouts/
│   ├── desktop.html      # Main desktop layout
│   └── post.html         # Individual post layout
├── _includes/
│   └── pagination.html   # Pagination component
├── assets/
│   ├── css/desktop.css   # Main Plasma 6 styling (1494 lines)
│   ├── js/desktop.js     # Desktop functionality (659 lines)
│   └── images/           # Asset directory
├── _posts/               # Blog posts (5 existing posts)
└── index.html           # Main desktop interface
```

## Design System

### Color Palette (CSS Variables)
- **Background**: `--plasma-bg: #1e1e2e` (dark base)
- **Surface**: `--plasma-surface: #313244` (cards, windows)
- **Primary**: `--plasma-primary: #89b4fa` (blue accent)
- **Text**: `--plasma-text: #cdd6f4` (light text)
- **Border**: `--plasma-border: #585b70` (subtle boundaries)

### Key Components

#### 1. Desktop Environment
- **Animated wallpaper** with floating dots (4 types of animations)
- **Desktop icons** (currently: Posts folder)
- **Taskbar** with app launcher, running apps, and system tray
- **Start menu** with applications and social links

#### 2. File Manager (Dolphin)
- **Window interface** with titlebar, toolbar, and controls
- **File list view** showing blog posts as files
- **Pagination** for handling multiple posts
- **Double-click to open** posts functionality

#### 3. Widgets (Conky-style)
- **Bio widget**: Profile info and contact details
- **System info**: OS, kernel, uptime, post count
- **Blog stats**: Total posts, words, categories

#### 4. Interactive Features
- **Draggable windows** with mouse support
- **Ripple effects** on clickable elements
- **Real-time clock** updates
- **Responsive design** for mobile devices

## Current Content
5 blog posts covering KDE/Plasma topics:
1. Welcome to KDE Plasma (2024-01-15)
2. Customizing Plasma Desktop (2024-01-20) 
3. Dolphin File Manager Tips (2024-01-25)
4. Plasma 6 New Features (2024-02-01)
5. Kate Editor Workflow (2024-02-05)

## JavaScript Functionality
- **PlasmaDesktop class** manages the entire desktop experience
- **Clock updates** every second
- **Widget animations** for stats and system info
- **Dynamic wallpaper** with 120+ floating particles
- **Window management** with dragging and focus

## Social Integration
- GitHub: lpsandaruwan
- LinkedIn: lpsandaruwan  
- Twitter: lpsandaruwan
- YouTube: @lpsandaruwan
- Email: hello@lpsandaruwan.dev

## Development Notes

### Build Commands
- Jekyll uses standard commands: `bundle exec jekyll serve`
- Built site outputs to `_site/` directory
- GitHub Pages auto-builds from main branch

### Key Features to Remember
1. **Desktop paradigm**: Everything mimics a real desktop OS
2. **File metaphor**: Blog posts are treated as files in a folder
3. **Window management**: Posts open in Kate-style editor windows
4. **Plasma aesthetics**: Authentic KDE color scheme and animations
5. **Responsive**: Adapts to mobile while maintaining desktop feel

### Potential Improvements
- Add more desktop applications/windows
- Implement context menus for desktop icons
- Add notification system
- Create system settings panel
- Add more interactive widgets
- Implement window snapping/tiling

## Usage Instructions
- Click desktop icons to select/open
- Use app launcher (bottom-left) for start menu
- File manager shows all blog posts
- Posts open in Kate-style editor
- Widgets show real blog statistics
- Fully responsive design works on mobile

This blog successfully creates an immersive KDE Plasma 6 desktop experience within a web browser, making reading technical content feel like using a familiar desktop environment.