// KDE Plasma 6 Desktop JavaScript

class PlasmaDesktop {
  constructor() {
    this.initClock();
    this.initWallpaper();
    this.initWidgets();
    this.bindEvents();
  }

  initClock() {
    const updateClock = () => {
      const now = new Date();
      const clockElement = document.getElementById('clock');
      if (clockElement) {
        clockElement.textContent = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  initWidgets() {
    this.updateUptime();
    this.animateStats();
    setInterval(() => this.updateUptime(), 60000); // Update every minute
  }

  updateUptime() {
    const uptimeElement = document.getElementById('uptime');
    if (uptimeElement) {
      const startTime = new Date('2024-02-06T09:00:00'); // Simulated start time
      const now = new Date();
      const uptime = now - startTime;
      
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      
      uptimeElement.textContent = `${days}d ${hours}h ${minutes}m`;
    }
  }

  animateStats() {
    // Animate stat numbers with counting effect
    document.querySelectorAll('.stat-number').forEach(element => {
      const target = parseInt(element.textContent) || 0;
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;
      
      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target;
          clearInterval(counter);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  initWallpaper() {
    this.createFloatingDots();
  }

  createFloatingDots() {
    const wallpaper = document.getElementById('wallpaper');
    if (!wallpaper) return;

    // Create deep vintage tech particles and elements
    const colors = [
      'rgba(0, 255, 65, 0.18)', // Linux terminal green
      'rgba(0, 204, 51, 0.15)', // Matrix green
      'rgba(255, 107, 53, 0.12)', // Father warmth orange
      'rgba(255, 170, 0, 0.10)', // Wisdom gold
      'rgba(0, 255, 65, 0.08)', // AI consciousness green
      'rgba(255, 255, 255, 0.06)'  // Vintage white
    ];

    // Create vintage terminal particles
    this.createTerminalParticles(wallpaper, colors);
    
    // Create life memory streams
    this.createMemoryStreams(wallpaper, colors);
    
    // Create AI neural nodes
    this.createNeuralNodes(wallpaper, colors);
    
    // Create father wisdom fragments
    this.createWisdomFragments(wallpaper, colors);
  }

  createTerminalParticles(wallpaper, colors) {
    // Create vintage terminal cursor blocks
    for (let i = 0; i < 12; i++) {
      const cursor = document.createElement('div');
      cursor.className = 'terminal-cursor';
      const color = colors[0]; // Linux green
      const size = Math.random() * 8 + 4;
      
      cursor.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * 1.5}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: terminalBlink ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px ${color};
      `;
      wallpaper.appendChild(cursor);
    }
  }

  createMemoryStreams(wallpaper, colors) {
    // Create life memory flowing streams
    for (let i = 0; i < 7; i++) {
      const memory = document.createElement('div');
      memory.className = 'memory-stream';
      const color = colors[2 + Math.floor(Math.random() * 2)]; // Orange/gold colors
      
      memory.style.cssText = `
        position: absolute;
        width: 300px;
        height: 2px;
        background: linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: memoryFlow ${Math.random() * 25 + 20}s linear infinite;
        animation-delay: ${Math.random() * 15}s;
        pointer-events: none;
        transform-origin: left center;
        filter: blur(0.5px);
      `;
      wallpaper.appendChild(memory);
    }
  }

  createNeuralNodes(wallpaper, colors) {
    // Create AI neural network nodes
    for (let i = 0; i < 8; i++) {
      const neuron = document.createElement('div');
      neuron.className = 'neural-node';
      const color = colors[0]; // AI green
      const size = Math.random() * 8 + 6;
      
      neuron.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: neuralPulse ${Math.random() * 12 + 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 8}s;
        pointer-events: none;
        box-shadow: 0 0 ${size * 4}px ${color}, 0 0 ${size * 2}px ${color} inset;
      `;
      wallpaper.appendChild(neuron);
    }
  }

  createWisdomFragments(wallpaper, colors) {
    // Create father's wisdom fragments
    for (let i = 0; i < 5; i++) {
      const wisdom = document.createElement('div');
      wisdom.className = 'wisdom-fragment';
      const color = colors[3]; // Wisdom gold
      const size = Math.random() * 4 + 2;
      
      wisdom.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: wisdomFloat ${Math.random() * 30 + 40}s ease-in-out infinite;
        animation-delay: ${Math.random() * 20}s;
        pointer-events: none;
        border-radius: 50%;
        filter: blur(1px);
        box-shadow: 0 0 ${size * 6}px ${color};
      `;
      wallpaper.appendChild(wisdom);
    }

    // Small floating dots (reduced to 25)
    for (let i = 0; i < 25; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot small';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 3 + 1;
      
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatDot ${Math.random() * 15 + 20}s ease-in-out infinite;
        animation-delay: ${Math.random() * 10}s;
        pointer-events: none;
      `;
      wallpaper.appendChild(dot);
    }

    // Medium dots with different movement (30 dots)
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot medium';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 5 + 3;
      
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: spiralDot ${Math.random() * 20 + 25}s linear infinite;
        animation-delay: ${Math.random() * 8}s;
        pointer-events: none;
      `;
      wallpaper.appendChild(dot);
    }

    // Large slow-moving dots (15 dots)
    for (let i = 0; i < 15; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot large';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;
      
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: waveDot ${Math.random() * 30 + 40}s ease-in-out infinite;
        animation-delay: ${Math.random() * 15}s;
        pointer-events: none;
        filter: blur(0.5px);
      `;
      wallpaper.appendChild(dot);
    }

    // Fast moving small particles (25 dots)
    for (let i = 0; i < 25; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 2 + 0.5;
      
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: rapidDot ${Math.random() * 8 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        opacity: 0.6;
      `;
      wallpaper.appendChild(dot);
    }

    // Add CSS animations
    if (!document.getElementById('dot-animations')) {
      const style = document.createElement('style');
      style.id = 'dot-animations';
      style.textContent = `
        @keyframes floatDot {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-120px) translateX(80px) scale(1.3);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-60px) translateX(-50px) scale(0.7);
            opacity: 0.5;
          }
          75% { 
            transform: translateY(-180px) translateX(120px) scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes spiralDot {
          0% { 
            transform: translateX(0px) translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% { 
            transform: translateX(100px) translateY(-100px) rotate(90deg);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(0px) translateY(-200px) rotate(180deg);
            opacity: 0.4;
          }
          75% { 
            transform: translateX(-100px) translateY(-100px) rotate(270deg);
            opacity: 0.7;
          }
          100% { 
            transform: translateX(0px) translateY(0px) rotate(360deg);
            opacity: 0.2;
          }
        }

        @keyframes waveDot {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) scale(1);
            opacity: 0.2;
          }
          33% { 
            transform: translateX(-200px) translateY(-80px) scale(1.4);
            opacity: 0.5;
          }
          66% { 
            transform: translateX(150px) translateY(-150px) scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes rapidDot {
          0% { 
            transform: translateX(0px) translateY(0px);
            opacity: 0.8;
          }
          20% { 
            transform: translateX(200px) translateY(-50px);
            opacity: 0.4;
          }
          40% { 
            transform: translateX(-150px) translateY(-100px);
            opacity: 0.9;
          }
          60% { 
            transform: translateX(300px) translateY(50px);
            opacity: 0.3;
          }
          80% { 
            transform: translateX(-100px) translateY(-200px);
            opacity: 0.7;
          }
          100% { 
            transform: translateX(0px) translateY(0px);
            opacity: 0.8;
          }
        }

        /* Add subtle pulsing effect to some dots */
        .floating-dot.medium:nth-child(3n) {
          animation-name: spiralDot, pulseDot;
          animation-duration: 25s, 4s;
          animation-iteration-count: infinite, infinite;
          animation-timing-function: linear, ease-in-out;
        }

        .floating-dot.large:nth-child(2n) {
          animation-name: waveDot, pulseDot;
          animation-duration: 45s, 6s;
          animation-iteration-count: infinite, infinite;
          animation-timing-function: ease-in-out, ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.8;
          }
        }

        /* Deep Vintage Tech Particle Animations */
        @keyframes terminalBlink {
          0%, 50% { 
            opacity: 1;
            transform: scale(1);
          }
          51%, 100% { 
            opacity: 0.3;
            transform: scale(0.9);
          }
        }

        @keyframes memoryFlow {
          0% { 
            transform: translateX(-300px) rotateZ(0deg);
            opacity: 0;
          }
          5% { 
            transform: translateX(-200px) rotateZ(1deg);
            opacity: 0.8;
          }
          95% { 
            transform: translateX(calc(100vw + 200px)) rotateZ(-1deg);
            opacity: 0.8;
          }
          100% { 
            transform: translateX(calc(100vw + 300px)) rotateZ(0deg);
            opacity: 0;
          }
        }

        @keyframes neuralPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          30% { 
            transform: scale(1.5);
            opacity: 1;
          }
          60% { 
            transform: scale(0.8);
            opacity: 0.6;
          }
        }

        @keyframes wisdomFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-60px) translateX(30px);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-30px) translateX(-20px);
            opacity: 0.6;
          }
          75% { 
            transform: translateY(-90px) translateX(40px);
            opacity: 0.9;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  bindEvents() {
    // Window dragging
    this.makeWindowsDraggable();
    
    // View switching
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Switch file list view
        const fileList = document.getElementById('file-list');
        const fileListHeader = document.querySelector('.file-list-header');
        const viewType = e.target.getAttribute('data-view');
        
        if (fileList) {
          // Remove existing view classes
          fileList.classList.remove('list-view', 'grid-view');
          // Add new view class
          fileList.classList.add(viewType + '-view');
          
          // Show/hide header based on view type
          if (fileListHeader) {
            if (viewType === 'grid') {
              fileListHeader.style.display = 'none';
            } else {
              fileListHeader.style.display = 'flex';
            }
          }
        }
      });
    });

    // Desktop icon interactions
    this.initDesktopIcons();
    
    // Desktop click to deselect icons and close menus
    document.getElementById('wallpaper').addEventListener('click', (e) => {
      if (e.target.id === 'wallpaper') {
        this.deselectAllDesktopIcons();
        closeStartMenu();
      }
    });

    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
      const startMenu = document.getElementById('start-menu');
      const appLauncher = document.querySelector('.app-launcher');
      
      if (startMenu && !startMenu.contains(e.target) && !appLauncher.contains(e.target)) {
        closeStartMenu();
      }
    });
  }

  initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      // Single click selection
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectDesktopIcon(icon);
      });

      // Double click to open
      icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.openDesktopIcon(icon);
      });

      // Right click context menu (placeholder)
      icon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        console.log('Desktop icon right-clicked');
      });
    });
  }

  selectDesktopIcon(icon) {
    // Deselect all other icons
    this.deselectAllDesktopIcons();
    // Select clicked icon
    icon.classList.add('selected');
  }

  deselectAllDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.classList.remove('selected');
    });
  }

  openDesktopIcon(icon) {
    // For now, just open file manager for the Posts icon
    openFileManager();
  }


  makeWindowsDraggable() {
    document.querySelectorAll('.window').forEach(window => {
      const titlebar = window.querySelector('.window-titlebar');
      if (!titlebar) return;

      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;
      let xOffset = 0;
      let yOffset = 0;

      // Double-click to maximize/restore
      titlebar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.window-controls')) return;
        maximizeWindow(window.id);
      });

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;
        
        // If window is maximized, don't allow dragging
        if (window.classList.contains('maximized')) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === titlebar || titlebar.contains(e.target)) {
          isDragging = true;
          window.style.cursor = 'grabbing';
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging && !window.classList.contains('maximized')) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;

          xOffset = currentX;
          yOffset = currentY;

          window.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
      });

      document.addEventListener('mouseup', () => {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        window.style.cursor = 'default';
      });
    });
  }
}

// File Manager functionality
function openFileManager() {
  const fileManager = document.getElementById('file-manager');
  if (fileManager) {
    fileManager.classList.remove('hidden');
    fileManager.classList.remove('minimized');
    
    // Add to taskbar
    addToTaskbar('file-manager', 'Posts - Dolphin', 'file-manager');
    
    // Focus the file manager
    focusWindow('file-manager');
    
    // Add click handler if not already added
    if (!fileManager.hasAttribute('data-focus-handler')) {
      fileManager.addEventListener('mousedown', () => focusWindow('file-manager'));
      fileManager.setAttribute('data-focus-handler', 'true');
    }
  }
}

function closeFileManager() {
  closeWindow('file-manager');
}

function toggleFileManager() {
  const fileManager = document.getElementById('file-manager');
  if (fileManager) {
    if (fileManager.classList.contains('hidden') || fileManager.classList.contains('minimized')) {
      openFileManager();
      fileManager.classList.remove('minimized');
    } else {
      closeFileManager();
    }
  }
}

// Window state management
function minimizeWindow(windowId) {
  console.log('minimizeWindow called with:', windowId);
  const window = document.getElementById(windowId);
  console.log('Found window for minimize:', window);
  
  if (window) {
    console.log('Minimizing window');
    window.classList.add('minimized');
    window.classList.remove('maximized');
    
    // Update taskbar icon to show minimized state
    const appIcon = document.querySelector(`[data-app="${windowId}"]`);
    console.log('Found taskbar icon:', appIcon);
    if (appIcon) {
      appIcon.classList.remove('active');
      appIcon.classList.add('minimized');
      console.log('Taskbar icon updated for minimize');
    }
  } else {
    console.log('Window not found for minimize:', windowId);
  }
}

function maximizeWindow(windowId) {
  console.log('maximizeWindow called with:', windowId);
  const window = document.getElementById(windowId);
  console.log('Found window for maximize:', window);
  
  if (window) {
    if (window.classList.contains('maximized')) {
      // Restore window
      console.log('Restoring window from maximized');
      window.classList.remove('maximized');
      window.classList.remove('minimized');
      
      // Update maximize button symbol
      const maximizeBtn = window.querySelector('.window-maximize');
      if (maximizeBtn) {
        maximizeBtn.textContent = '□';
        maximizeBtn.title = 'Maximize';
        console.log('Updated maximize button to restore mode');
      }
    } else {
      // Maximize window
      console.log('Maximizing window');
      window.classList.add('maximized');
      window.classList.remove('minimized');
      
      // Update maximize button symbol
      const maximizeBtn = window.querySelector('.window-maximize');
      if (maximizeBtn) {
        maximizeBtn.textContent = '◱';
        maximizeBtn.title = 'Restore';
        console.log('Updated maximize button to maximize mode');
      }
    }
    
    // Ensure window is visible and active
    window.classList.remove('hidden');
    const appIcon = document.querySelector(`[data-app="${windowId}"]`);
    console.log('Found taskbar icon for maximize:', appIcon);
    if (appIcon) {
      appIcon.classList.add('active');
      appIcon.classList.remove('minimized');
      console.log('Taskbar icon updated for maximize');
    }
  } else {
    console.log('Window not found for maximize:', windowId);
  }
}

function restoreWindow(windowId) {
  const window = document.getElementById(windowId);
  if (window) {
    window.classList.remove('minimized');
    window.classList.remove('maximized');
    window.classList.remove('hidden');
    
    // Update taskbar icon
    const appIcon = document.querySelector(`[data-app="${windowId}"]`);
    if (appIcon) {
      appIcon.classList.add('active');
      appIcon.classList.remove('minimized');
    }
    
    // Reset maximize button
    const maximizeBtn = window.querySelector('.window-maximize');
    if (maximizeBtn) {
      maximizeBtn.textContent = '□';
      maximizeBtn.title = 'Maximize';
    }
  }
}

// Simple post navigation - no complex window management needed

function openPost(url, title) {
  // Simple approach - just navigate to the post URL
  window.location.href = url;
}


function focusWindow(windowId) {
  // Remove focus from all windows
  document.querySelectorAll('.window').forEach(win => {
    win.classList.remove('focused');
    win.style.zIndex = '100';
  });
  
  // Focus the target window
  const targetWindow = document.getElementById(windowId);
  if (targetWindow) {
    targetWindow.classList.add('focused');
    targetWindow.style.zIndex = '200';
  }
  
  // Update taskbar icon states
  document.querySelectorAll('.app-icon').forEach(icon => {
    if (icon.getAttribute('data-app') === windowId) {
      icon.classList.add('active');
    }
  });
}

function addToTaskbar(windowId, title, appType = 'kate') {
  const taskbarApps = document.querySelector('.taskbar-apps');
  
  // Check if icon already exists and update it
  let taskbarIcon = document.querySelector(`[data-app="${windowId}"]`);
  
  if (taskbarIcon) {
    // Update existing icon title and text
    taskbarIcon.title = title;
    const textElement = taskbarIcon.querySelector('.app-icon-text');
    if (textElement) {
      const displayTitle = title.length > 20 ? title.substring(0, 17) + '...' : title;
      textElement.textContent = displayTitle;
    }
    taskbarIcon.classList.add('active');
    taskbarIcon.classList.remove('minimized');
    taskbarIcon.style.opacity = '1';
    return;
  }
  
  // Create new taskbar icon
  taskbarIcon = document.createElement('div');
  taskbarIcon.className = 'app-icon active';
  taskbarIcon.setAttribute('data-app', windowId);
  taskbarIcon.setAttribute('data-type', appType);
  taskbarIcon.title = title;
  
  // Set appropriate icon based on app type
  let iconSvg = '';
  if (appType === 'kate') {
    iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
    `;
  } else if (appType === 'file-manager') {
    iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
      </svg>
    `;
  }
  
  // Truncate title if too long
  const displayTitle = title.length > 20 ? title.substring(0, 17) + '...' : title;
  taskbarIcon.innerHTML = iconSvg + `<span class="app-icon-text">${displayTitle}</span>`;
  
  // Add click handler
  taskbarIcon.addEventListener('click', () => {
    const window = document.getElementById(windowId);
    if (window.classList.contains('minimized')) {
      restoreWindow(windowId);
    } else if (window.classList.contains('hidden')) {
      window.classList.remove('hidden');
      focusWindow(windowId);
      taskbarIcon.classList.add('active');
    } else {
      minimizeWindow(windowId);
    }
  });
  
  taskbarApps.appendChild(taskbarIcon);
}

function removeFromTaskbar(windowId) {
  const taskbarIcon = document.querySelector(`[data-app="${windowId}"]`);
  if (taskbarIcon) {
    taskbarIcon.remove();
  }
}

function closeWindow(windowId) {
  console.log('closeWindow called with:', windowId);
  const window = document.getElementById(windowId);
  console.log('Found window element:', window);
  
  if (window) {
    if (windowId === 'file-manager') {
      // Special handling for file manager - just hide it
      console.log('Closing file manager');
      window.classList.add('hidden');
      removeFromTaskbar(windowId);
    } else {
      // Add closing animation for other windows
      console.log('Closing other window with animation');
      window.style.transition = 'all 0.3s ease-in-out';
      window.style.transform = 'scale(0.8)';
      window.style.opacity = '0';
      
      setTimeout(() => {
        window.remove();
        removeFromTaskbar(windowId);
      }, 300);
    }
  } else {
    console.log('Window not found:', windowId);
  }
}


function toggleApplicationMenu() {
  const startMenu = document.getElementById('start-menu');
  if (startMenu) {
    startMenu.classList.toggle('hidden');
    
    // Focus search input when menu opens
    if (!startMenu.classList.contains('hidden')) {
      setTimeout(() => {
        const searchInput = document.getElementById('menu-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }
}

function closeStartMenu() {
  const startMenu = document.getElementById('start-menu');
  if (startMenu && !startMenu.classList.contains('hidden')) {
    startMenu.classList.add('hidden');
  }
}

function showPowerMenu() {
  // Create a simple power menu
  const existingMenu = document.getElementById('power-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const powerMenu = document.createElement('div');
  powerMenu.id = 'power-menu';
  powerMenu.innerHTML = `
    <div class="power-menu">
      <div class="power-option" onclick="showShutdownDialog()">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"/>
        </svg>
        Shut Down
      </div>
      <div class="power-option">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C17.09,20 21.16,16.15 21.88,11.12L20.99,11.12C20.32,15.79 16.46,19.5 12,19.5A7.5,7.5 0 0,1 4.5,12A7.5,7.5 0 0,1 12,4.5C13.91,4.5 15.65,5.21 17.14,6.39L13.5,10H21V2.5L17.65,6.35Z"/>
        </svg>
        Restart
      </div>
      <div class="power-option">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
        </svg>
        Lock Screen
      </div>
    </div>
  `;

  // Style the power menu
  powerMenu.style.cssText = `
    position: fixed;
    bottom: calc(var(--taskbar-height) + 60px);
    left: 350px;
    z-index: 300;
  `;

  const menuStyle = document.createElement('style');
  menuStyle.textContent = `
    .power-menu {
      background: rgba(49, 50, 68, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid var(--plasma-border);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      padding: 8px;
      min-width: 150px;
    }
    .power-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: var(--plasma-text);
      transition: background 0.2s ease;
    }
    .power-option:hover {
      background: rgba(46, 125, 50, 0.1);
    }
    .power-option svg {
      fill: currentColor;
    }
  `;

  document.head.appendChild(menuStyle);
  document.body.appendChild(powerMenu);

  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePowerMenu(e) {
      if (!powerMenu.contains(e.target)) {
        powerMenu.remove();
        menuStyle.remove();
        document.removeEventListener('click', closePowerMenu);
      }
    });
  }, 100);
}

function showShutdownDialog() {
  alert('This would normally shut down the system. This is just a demo!');
  document.getElementById('power-menu')?.remove();
}


// Helper function to open post from HTML element with data attributes
function openPostFromElement(element) {
  const url = element.getAttribute('data-url');
  const title = element.getAttribute('data-title');
  if (url && title) {
    // For the desktop interface, directly navigate to the post
    window.location.href = url;
  }
}

// Pagination and Navigation System
class PostsPagination {
  constructor() {
    this.currentPage = 1;
    this.postsPerPage = 20;
    this.allPosts = [];
    this.init();
  }

  init() {
    console.log('PostsPagination init() called');
    
    // Try to load posts from the existing DOM first as fallback
    this.loadPostsFromDOM();
    
    // Load posts data from the script tag
    const postsDataElement = document.getElementById('posts-data');
    if (postsDataElement) {
      try {
        const jsonText = postsDataElement.textContent.trim();
        console.log('Raw JSON data length:', jsonText.length);
        console.log('First 200 chars:', jsonText.substring(0, 200));
        
        this.allPosts = JSON.parse(jsonText);
        console.log('Parsed posts from JSON:', this.allPosts.length, 'posts found');
        
        if (this.allPosts && this.allPosts.length > 0) {
          // Update the posts per page dropdown to reflect current setting
          const dropdown = document.getElementById('posts-per-page');
          if (dropdown) {
            dropdown.value = this.postsPerPage;
            console.log('Updated dropdown to:', this.postsPerPage);
          }
          
          this.renderPosts();
          this.renderPagination();
          console.log('Pagination system initialized successfully with JSON data');
        } else {
          console.warn('No posts found in JSON data, using DOM fallback');
        }
      } catch (e) {
        console.error('Error parsing posts data:', e);
        console.log('JSON parse failed, will fall back to DOM-rendered posts');
        // Don't try to access jsonText here since it might not be in scope
      }
    } else {
      console.warn('Posts data element not found, using DOM fallback');
    }
    
    // Make sure we have posts loaded (either from JSON or DOM)
    if (this.allPosts && this.allPosts.length > 0) {
      console.log('PostsPagination initialized with', this.allPosts.length, 'posts');
    } else {
      console.error('PostsPagination could not load any posts');
    }
  }

  loadPostsFromDOM() {
    // Extract posts data from the existing DOM as fallback
    const fileItems = document.querySelectorAll('#file-list .file-item');
    if (fileItems.length > 0) {
      this.allPosts = Array.from(fileItems).map(item => {
        const nameElement = item.querySelector('.file-name');
        const metaElement = item.querySelector('.file-meta');
        const url = item.getAttribute('data-url');
        const title = item.getAttribute('data-title') || nameElement?.textContent || 'Untitled';
        
        // Parse meta information
        const metaText = metaElement?.textContent || '';
        const datePart = metaText.split(' • ')[0] || '';
        const wordsPart = metaText.split(' • ')[1] || '0 words';
        const words = parseInt(wordsPart.replace(' words', '')) || 0;
        
        return {
          url: url,
          title: title,
          date: datePart,
          words: words,
          categories: [],
          excerpt: ''
        };
      });
      console.log('Loaded posts from DOM:', this.allPosts.length, 'posts found');
      
      // If we got posts from DOM, initialize the pagination UI
      if (this.allPosts.length > 0) {
        this.renderPagination();
        // Update the posts per page dropdown
        const dropdown = document.getElementById('posts-per-page');
        if (dropdown) {
          dropdown.value = this.postsPerPage;
        }
      }
    }
  }

  renderPosts() {
    const fileList = document.getElementById('file-list');
    if (!fileList || !this.allPosts || this.allPosts.length === 0) {
      console.log('Cannot render posts - missing data or element');
      return;
    }

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.postsPerPage === 50 ? this.allPosts : this.allPosts.slice(startIndex, endIndex);

    console.log(`Rendering ${postsToShow.length} posts for page ${this.currentPage}`);

    fileList.innerHTML = postsToShow.map(post => `
      <div class="file-item" data-url="${post.url}" data-title="${post.title}" onclick="openPostFromElement(this)">
        <div class="file-column name-column">
          <div class="file-icon">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <span class="file-name">${post.title}</span>
        </div>
        <div class="file-column date-column">
          <span>${post.date}</span>
        </div>
        <div class="file-column author-column">
          <span>Lahiru Sandaruwan</span>
        </div>
        <div class="file-column categories-column">
          <span>${post.categories && post.categories.length > 0 ? post.categories.join(', ') : 'General'}</span>
        </div>
        <div class="file-column words-column">
          <span>${post.words} words</span>
        </div>
      </div>
    `).join('');
  }

  renderPagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) {
      console.error('Pagination element not found');
      return;
    }

    // If showing all posts, hide pagination
    if (this.postsPerPage === 50) {
      paginationElement.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
    console.log('Rendering pagination: total posts =', this.allPosts.length, 'posts per page =', this.postsPerPage, 'total pages =', totalPages);
    
    if (totalPages <= 1) {
      paginationElement.innerHTML = '';
      return;
    }

    let paginationHTML = '';
    
    // Previous button
    if (this.currentPage > 1) {
      paginationHTML += `<button class="page-btn" onclick="window.postsPagination.goToPage(${this.currentPage - 1})">‹ Previous</button>`;
    }

    // Page numbers (limit to reasonable range for large numbers of pages)
    const maxVisiblePages = 10;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page if not in range
    if (startPage > 1) {
      paginationHTML += `<button class="page-btn" onclick="window.postsPagination.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="page-dots">...</span>`;
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<button class="page-btn active">${i}</button>`;
      } else {
        paginationHTML += `<button class="page-btn" onclick="window.postsPagination.goToPage(${i})">${i}</button>`;
      }
    }

    // Add last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="page-dots">...</span>`;
      }
      paginationHTML += `<button class="page-btn" onclick="window.postsPagination.goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    if (this.currentPage < totalPages) {
      paginationHTML += `<button class="page-btn" onclick="window.postsPagination.goToPage(${this.currentPage + 1})">Next ›</button>`;
    }

    paginationElement.innerHTML = paginationHTML;
    console.log('Pagination rendered with', totalPages, 'total pages, current page:', this.currentPage);
  }

  goToPage(page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      console.error('Invalid page number:', page);
      return;
    }

    const totalPages = this.postsPerPage === 50 ? 1 : Math.ceil(this.allPosts.length / this.postsPerPage);
    if (pageNum > totalPages) {
      console.error('Page number', pageNum, 'exceeds total pages', totalPages);
      return;
    }

    console.log('Going to page', pageNum, 'of', totalPages);
    this.currentPage = pageNum;
    this.renderPosts();
    this.renderPagination();
  }

  changePostsPerPage(newPostsPerPage) {
    this.postsPerPage = parseInt(newPostsPerPage);
    this.currentPage = 1;
    
    // Update the dropdown to reflect the change
    const dropdown = document.getElementById('posts-per-page');
    if (dropdown) {
      dropdown.value = this.postsPerPage;
    }
    
    this.renderPosts();
    this.renderPagination();
    console.log('Changed posts per page to:', this.postsPerPage);
  }
}

// Navigation functions for toolbar buttons
function navigatePosts(direction) {
  console.log('navigatePosts called with direction:', direction);
  
  // Add a small delay to allow for initialization if needed
  if (!window.postsPagination) {
    console.log('postsPagination not available, attempting to initialize...');
    setTimeout(() => {
      if (!window.postsPagination) {
        console.error('postsPagination still not available after delay');
        return;
      }
      navigatePosts(direction); // Retry the call
    }, 100);
    return;
  }
  
  // Make sure we have posts loaded
  if (!window.postsPagination.allPosts || window.postsPagination.allPosts.length === 0) {
    console.error('No posts available for navigation');
    return;
  }
  
  const totalPages = window.postsPagination.postsPerPage === 50 ? 1 : Math.ceil(window.postsPagination.allPosts.length / window.postsPagination.postsPerPage);
  console.log('Current page:', window.postsPagination.currentPage, 'Total pages:', totalPages, 'Posts per page:', window.postsPagination.postsPerPage);
  
  switch(direction) {
    case 'back':
      if (window.postsPagination.currentPage > 1) {
        console.log('Going to previous page:', window.postsPagination.currentPage - 1);
        window.postsPagination.goToPage(window.postsPagination.currentPage - 1);
      } else {
        console.log('Already on first page');
      }
      break;
    case 'forward':
      if (window.postsPagination.currentPage < totalPages) {
        console.log('Going to next page:', window.postsPagination.currentPage + 1);
        window.postsPagination.goToPage(window.postsPagination.currentPage + 1);
      } else {
        console.log('Already on last page');
      }
      break;
    case 'up':
      // Refresh - reload the posts and go to first page
      console.log('Refreshing posts and going to first page');
      window.postsPagination.init();
      window.postsPagination.goToPage(1);
      break;
  }
}

function changePostsPerPage(value) {
  console.log('changePostsPerPage called with value:', value);
  
  // Add a small delay to allow for initialization if needed
  if (!window.postsPagination) {
    console.log('postsPagination not available, attempting to initialize...');
    setTimeout(() => {
      if (!window.postsPagination) {
        console.error('postsPagination still not available after delay');
        return;
      }
      changePostsPerPage(value); // Retry the call
    }, 100);
    return;
  }
  
  const intValue = parseInt(value);
  if (isNaN(intValue) || intValue <= 0) {
    console.error('Invalid posts per page value:', value);
    return;
  }
  
  console.log('Changing posts per page from', window.postsPagination.postsPerPage, 'to', intValue);
  window.postsPagination.changePostsPerPage(intValue);
}

// Zoom functionality for Kate view
let currentZoom = 100;
const zoomLevels = [50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250, 300];

function zoomIn() {
  const currentIndex = zoomLevels.indexOf(currentZoom);
  if (currentIndex < zoomLevels.length - 1) {
    currentZoom = zoomLevels[currentIndex + 1];
    applyZoom();
  }
}

function zoomOut() {
  const currentIndex = zoomLevels.indexOf(currentZoom);
  if (currentIndex > 0) {
    currentZoom = zoomLevels[currentIndex - 1];
    applyZoom();
  }
}

function resetZoom() {
  currentZoom = 100;
  applyZoom();
}

function applyZoom() {
  const editorContent = document.querySelector('.editor-content');
  const zoomLevelDisplay = document.getElementById('zoom-level');
  
  if (editorContent) {
    editorContent.style.fontSize = `${currentZoom}%`;
    console.log('Applied zoom:', currentZoom + '%');
  }
  
  if (zoomLevelDisplay) {
    zoomLevelDisplay.textContent = currentZoom + '%';
  }
  
  // Store zoom preference in localStorage
  localStorage.setItem('kateZoomLevel', currentZoom);
}

function initializeZoom() {
  // Load saved zoom level from localStorage
  const savedZoom = localStorage.getItem('kateZoomLevel');
  if (savedZoom && zoomLevels.includes(parseInt(savedZoom))) {
    currentZoom = parseInt(savedZoom);
  }
  applyZoom();
}

// Make functions globally accessible for inline onclick handlers
window.closeWindow = closeWindow;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;
window.restoreWindow = restoreWindow;
window.openPost = openPost;
window.openPostFromElement = openPostFromElement;
window.openFileManager = openFileManager;
window.closeFileManager = closeFileManager;
window.toggleFileManager = toggleFileManager;
window.navigatePosts = navigatePosts;
window.changePostsPerPage = changePostsPerPage;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;

// Function to initialize the desktop
function initializeDesktop() {
  console.log('Initializing desktop...');
  new PlasmaDesktop();
  
  // Initialize zoom functionality if we're on a Kate view (post page)
  if (document.querySelector('.editor-content')) {
    console.log('Initializing Kate view zoom...');
    setTimeout(() => {
      initializeZoom();
    }, 100);
    
    // Add keyboard shortcuts for zoom
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          zoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          zoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
      }
    });
  }
  
  // Initialize pagination system with a delay to ensure DOM is ready
  setTimeout(() => {
    console.log('Initializing pagination system...');
    try {
      window.postsPagination = new PostsPagination();
      console.log('PostsPagination assigned to window:', !!window.postsPagination);
      
      // Ensure the pagination object is accessible
      if (window.postsPagination) {
        console.log('PostsPagination successfully initialized and accessible');
      } else {
        console.error('PostsPagination initialization failed');
      }
    } catch (e) {
      console.error('Error initializing PostsPagination:', e);
    }
    
    // Add ripple effect to clickable elements after pagination is ready
    document.querySelectorAll('.app-icon, .toolbar-btn, .view-btn, .page-btn').forEach(element => {
    element.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(46, 125, 50, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation
  if (!document.getElementById('ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    }
  }, 500);
}

// Initialize desktop when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDesktop);
} else {
  // DOM is already loaded
  initializeDesktop();
}

// Handle window resize
window.addEventListener('resize', () => {
  // Adjust windows if they're outside viewport
  document.querySelectorAll('.window').forEach(window => {
    const rect = window.getBoundingClientRect();
    if (rect.left < 0) {
      window.style.left = '10px';
    }
    if (rect.top < 0) {
      window.style.top = '10px';
    }
  });
});