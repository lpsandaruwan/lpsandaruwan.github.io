/**
 * KDE Plasma Desktop functionality
 */

// Global functions first - need to be available immediately
function updateClock() {
  const now = new Date();
  
  // Update desktop clock
  const desktopTime = document.getElementById('desktop-time');
  const desktopDate = document.getElementById('desktop-date');
  
  if (desktopTime) {
    desktopTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  if (desktopDate) {
    desktopDate.textContent = now.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
  }
  
  // Update taskbar clock
  const taskbarTime = document.getElementById('taskbar-time');
  const taskbarDate = document.getElementById('taskbar-date');
  
  if (taskbarTime) {
    taskbarTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  if (taskbarDate) {
    taskbarDate.textContent = now.toLocaleDateString([], {month: 'short', day: 'numeric'});
  }
}

// Open post in terminal - GLOBAL FUNCTION
function openPost(element) {
  console.log('openPost called', element);
  const url = element.dataset.url;
  const title = element.dataset.title;
  const content = element.dataset.content;
  
  const terminal = document.getElementById('terminal-window');
  const terminalTitle = document.getElementById('terminal-title-text');
  const terminalOutput = document.getElementById('terminal-output');
  const currentPostFile = document.getElementById('current-post-file');
  const overlay = document.getElementById('overlay');
  
  // Store current URL before opening post (for returning later)
  if (!window.location.pathname.includes('/posts/') && !window.location.pathname.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
    localStorage.setItem('lastFileManagerView', window.location.pathname);
  }
  
  if (terminal && terminalOutput) {
    // Store post URL for maximize functionality
    terminal.dataset.currentPostUrl = url;
    
    // Update terminal title
    if (terminalTitle) {
      terminalTitle.textContent = `Konsole - ${title}`;
    }
    
    // Update file name in prompt
    if (currentPostFile) {
      currentPostFile.textContent = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    }
    
    // Fetch and display post content
    fetch(url)
      .then(response => response.text())
      .then(html => {
        // Extract main content from the fetched page
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('main') || doc.querySelector('.content') || doc.querySelector('article');
        
        if (mainContent) {
          // Add title and clean up the content
          let cleanContent = mainContent.innerHTML;
          // Remove any existing h1 tags to avoid duplication
          cleanContent = cleanContent.replace(/<h1[^>]*>.*?<\/h1>/gi, '');
          
          // Remove all post-tail-wrapper sections from fetched content 
          // (we'll use the one from plasma-desktop layout instead)
          cleanContent = cleanContent.replace(/<div class="post-tail-wrapper[\s\S]*?<\/div>\s*<\/div>/gi, '');
          
          // Remove any post-meta sections that might be duplicated
          cleanContent = cleanContent.replace(/<div class="post-meta[\s\S]*?<\/div>/gi, '');
          
          // Remove social sharing sections from fetched content
          cleanContent = cleanContent.replace(/<div class="share-wrapper[\s\S]*?<\/div>/gi, '');
          
          // Remove ALL post-tags sections from fetched content (more thorough)
          cleanContent = cleanContent.replace(/<div class="post-tags[\s\S]*?<\/div>/gi, '');
          cleanContent = cleanContent.replace(/<div[^>]*tags[^>]*>[\s\S]*?<\/div>/gi, '');
          cleanContent = cleanContent.replace(/<i class="fa fa-tags[^>]*>[\s\S]*?<\/i>/gi, '');
          cleanContent = cleanContent.replace(/<i class="fas fa-tags[^>]*>[\s\S]*?<\/i>/gi, '');
          
          // Remove comments sections from fetched content 
          cleanContent = cleanContent.replace(/<div class="post-comments[\s\S]*?<\/div>/gi, '');
          cleanContent = cleanContent.replace(/<div id="disqus_thread[\s\S]*?<\/div>/gi, '');
          
          // Remove any remaining tag-related elements (more comprehensive)
          cleanContent = cleanContent.replace(/<a href="[^"]*\/tags\/[^"]*"[^>]*>.*?<\/a>/gi, '');
          cleanContent = cleanContent.replace(/<span[^>]*tag[^>]*>.*?<\/span>/gi, '');
          cleanContent = cleanContent.replace(/<div[^>]*post-tail[^>]*>[\s\S]*?<\/div>/gi, '');
          cleanContent = cleanContent.replace(/<div[^>]*post-tags[^>]*>[\s\S]*?<\/div>/gi, '');
          
          // Fix code blocks - ensure they're properly displayed
          cleanContent = cleanContent.replace(/<pre class="highlight">([\s\S]*?)<\/pre>/gi, function(match, p1) {
            return '<pre class="highlight">' + p1.replace(/&lt;/g, '<').replace(/&gt;/g, '>') + '</pre>';
          });
          
          terminalOutput.innerHTML = `
            <h1># ${title}</h1>
            <div class="content">
              ${cleanContent}
            </div>
          `;
        } else {
          terminalOutput.innerHTML = `
            <h1># ${title}</h1>
            <p>Loading post content...</p>
            <p><a href="${url}" style="color: #16a085;">→ Open full post</a></p>
          `;
        }
        
        // Show terminal and overlay
        terminal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        
        // Auto-maximize terminal on mobile devices
        if (window.innerWidth <= 768) {
          maximizeTerminal();
        }
        
        // Update browser URL to post URL
        window.history.pushState({}, '', url);
        
        // Update task manager
        updateTaskManager();
      })
      .catch(error => {
        console.error('Error loading post:', error);
        terminalOutput.innerHTML = `
          <h1># ${title}</h1>
          <p class="error">Error loading post content.</p>
          <p><a href="${url}" style="color: #16a085;">→ Open full post</a></p>
        `;
        
        // Show terminal anyway
        terminal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        
        // Auto-maximize terminal on mobile devices
        if (window.innerWidth <= 768) {
          maximizeTerminal();
        }
        
        // Update browser URL to post URL even on error
        window.history.pushState({}, '', url);
        
        updateTaskManager();
      });
  }
}

// Terminal window controls - GLOBAL FUNCTION
function closeTerminal() {
  const terminal = document.getElementById('terminal-window');
  const overlay = document.getElementById('overlay');
  
  if (terminal) {
    terminal.classList.add('hidden');
    // Reset terminal position to default
    terminal.style.transform = 'translateX(-50%)';
    terminal.style.left = '50%';
    terminal.style.top = '20px';
    terminal.style.width = '70%';
    terminal.style.height = 'calc(100vh - 88px)';
    
    // Reset any maximized state
    terminal.classList.remove('maximized');
    terminal.style.borderRadius = '8px';
    terminal.style.border = '1px solid #4d5157';
    
    // Reset the maximize button text
    const maximizeButton = document.querySelector('.control.maximize');
    if (maximizeButton) {
      maximizeButton.textContent = '□';
    }
    
    // When closing a post, try to return to the last file manager view
    if (window.location.pathname.includes('/posts/') || window.location.pathname.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
      // Get the last file manager view from local storage
      const lastView = localStorage.getItem('lastFileManagerView');
      
      // If we have a stored view, go there; otherwise go to home
      if (lastView) {
        window.location.href = lastView;
      } else {
        window.location.href = '/';
      }
    }
  }
  if (overlay) overlay.classList.add('hidden');
  
  // Update task manager to remove terminal task
  updateTaskManager();
}

// Application menu toggle - GLOBAL FUNCTION
function toggleAppMenu() {
  const appMenu = document.getElementById('app-menu');
  const networkInfo = document.getElementById('network-info');
  const overlay = document.getElementById('overlay');
  
  if (appMenu && overlay) {
    const isHidden = appMenu.classList.contains('hidden');
    
    // Close network menu if open
    if (networkInfo) networkInfo.classList.add('hidden');
    
    if (isHidden) {
      appMenu.classList.remove('hidden');
      overlay.classList.remove('hidden');
    } else {
      appMenu.classList.add('hidden');
      overlay.classList.add('hidden');
    }
  }
}


// Network info toggle - GLOBAL FUNCTION
function toggleNetworkInfo() {
  const appMenu = document.getElementById('app-menu');
  const networkInfo = document.getElementById('network-info');
  const overlay = document.getElementById('overlay');
  
  if (networkInfo && overlay) {
    const isHidden = networkInfo.classList.contains('hidden');
    
    // Close other menus if open
    if (appMenu) appMenu.classList.add('hidden');
    
    if (isHidden) {
      networkInfo.classList.remove('hidden');
      overlay.classList.remove('hidden');
      // Load network info when opened
      loadNetworkInfo();
    } else {
      networkInfo.classList.add('hidden');
      overlay.classList.add('hidden');
    }
  }
}

// Load network information
function loadNetworkInfo() {
  // Try to get IP address from external service
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('ip-address').textContent = data.ip;
      
      // Get additional info about the IP
      return fetch(`https://ipapi.co/${data.ip}/json/`);
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('location').textContent = `${data.city}, ${data.country_name}`;
      document.getElementById('isp').textContent = data.org || 'Unknown';
    })
    .catch(error => {
      console.log('Network info fetch failed:', error);
      document.getElementById('ip-address').textContent = 'Unavailable';
      document.getElementById('location').textContent = 'Unavailable';
      document.getElementById('isp').textContent = 'Unavailable';
    });
  
  // Update connection type based on screen size (simple heuristic)
  const connectionType = window.innerWidth > 768 ? 'Wired/WiFi' : 'Mobile';
  document.getElementById('connection-type').textContent = connectionType;
}

// Close all panels - GLOBAL FUNCTION
function closeAllPanels() {
  const appMenu = document.getElementById('app-menu');
  const networkInfo = document.getElementById('network-info');
  const terminal = document.getElementById('terminal-window');
  const overlay = document.getElementById('overlay');
  
  if (appMenu) appMenu.classList.add('hidden');
  if (networkInfo) networkInfo.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');
  
  // Don't close terminal when clicking overlay if it's open
  // User should use close button
}

// Search functionality - GLOBAL FUNCTION
function performSearch() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.toLowerCase().trim();
  const postListContainer = document.getElementById('post-list');
  
  if (!postListContainer) return;
  
  if (query === '') {
    // Show original posts if search is empty - restore from pagination
    window.location.reload();
    return;
  }
  
  // Search through all posts in searchData
  const results = window.searchData.filter(post => {
    return post.title.toLowerCase().includes(query) || 
           post.content.toLowerCase().includes(query) ||
           post.categories.some(cat => cat.toLowerCase().includes(query));
  });
  
  // Clear current posts and show search results
  postListContainer.innerHTML = '';
  
  if (results.length === 0) {
    postListContainer.innerHTML = `
      <div class="search-no-results">
        <div class="file-item">
          <div class="file-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="file-details">
            <div class="file-label">No results found</div>
            <div class="file-description">No posts match your search query: "${query}"</div>
          </div>
        </div>
      </div>
    `;
    return;
  }
  
  // Display search results
  results.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'file-item post-file';
    postElement.setAttribute('data-url', post.url);
    postElement.setAttribute('data-title', post.title);
    postElement.setAttribute('data-content', post.content);
    postElement.onclick = function() { openPost(this); };
    
    const categoriesHtml = post.categories.map(cat => 
      `<span class="category-tag">${cat}</span>`
    ).join('');
    
    postElement.innerHTML = `
      <div class="file-icon">
        <i class="${post.icon}"></i>
      </div>
      <div class="file-details">
        <div class="file-label">${post.title}</div>
        <div class="file-description">${post.excerpt}</div>
        <div class="file-meta">
          <span class="date">${post.date}</span>
          ${post.categories.length > 0 ? `<span class="categories">${categoriesHtml}</span>` : ''}
        </div>
      </div>
    `;
    
    postListContainer.appendChild(postElement);
  });
  
  // Update status bar
  const statusLeft = document.querySelector('.status-left');
  if (statusLeft) {
    statusLeft.textContent = `${results.length} search results`;
  }
}

// Update task manager
function updateTaskManager() {
  const taskManager = document.querySelector('.task-manager');
  const terminal = document.getElementById('terminal-window');
  
  if (taskManager) {
    // Clear existing tasks except Dolphin
    const tasks = taskManager.querySelectorAll('.task-item:not([title="Dolphin"])');
    tasks.forEach(task => task.remove());
    
    // Add terminal task if terminal is open
    if (terminal && !terminal.classList.contains('hidden')) {
      const terminalTask = document.createElement('div');
      terminalTask.className = 'task-item active';
      terminalTask.title = 'Terminal';
      terminalTask.innerHTML = '<i class="fas fa-terminal"></i>';
      terminalTask.onclick = () => {
        terminal.classList.toggle('hidden');
        updateTaskManager();
      };
      taskManager.appendChild(terminalTask);
    }
  }
}

// Calendar toggle (placeholder)
function toggleCalendar() {
  // Placeholder for calendar widget
  console.log('Calendar clicked');
}

// Categories menu toggle - GLOBAL FUNCTION
function toggleCategoriesMenu() {
  console.log('Categories menu toggle');
  // Placeholder for categories menu
}

// Theme toggle functionality is handled by the mode-watcher.js in commons.min.js

// Terminal window controls - GLOBAL FUNCTIONS
function maximizeTerminal() {
  const terminal = document.getElementById('terminal-window');
  const taskbar = document.querySelector('.plasma-taskbar');
  const taskbarHeight = taskbar ? taskbar.offsetHeight : 48;
  
  if (terminal) {
    if (terminal.classList.contains('maximized')) {
      // Restore to normal size
      terminal.classList.remove('maximized');
      terminal.style.width = '70%';
      terminal.style.height = 'calc(100vh - 88px)';
      terminal.style.transform = 'translateX(-50%)';
      terminal.style.top = '20px';
      terminal.style.left = '50%';
      terminal.style.right = 'auto';
      terminal.style.bottom = 'auto';
      terminal.style.borderRadius = '8px';
      terminal.style.border = '1px solid #4d5157';
      terminal.style.position = 'fixed';
      document.querySelector('.control.maximize').textContent = '□';
    } else {
      // Maximize to full screen but keep taskbar
      terminal.classList.add('maximized');
      terminal.style.width = '100%';
      terminal.style.height = `calc(100vh - ${taskbarHeight}px)`; // Dynamic taskbar height
      terminal.style.transform = 'none';
      terminal.style.position = 'fixed';
      terminal.style.top = '0';
      terminal.style.left = '0';
      terminal.style.right = '0';
      terminal.style.bottom = `${taskbarHeight}px`; // Position above taskbar
      terminal.style.margin = '0';
      terminal.style.padding = '0';
      terminal.style.borderRadius = '0';
      terminal.style.border = 'none';
      terminal.style.zIndex = '10000'; // Above taskbar
      terminal.style.maxWidth = '100%'; // Ensure it uses full width
      document.querySelector('.control.maximize').textContent = '❐';
      
      // Update address bar to show full URL
      const currentPostUrl = terminal.dataset.currentPostUrl;
      if (currentPostUrl) {
        // Update browser URL without navigating
        window.history.pushState({}, '', currentPostUrl);
      }
    }
  }
}

function minimizeTerminal() {
  const terminal = document.getElementById('terminal-window');
  if (terminal) {
    // Restore to default size
    terminal.classList.remove('maximized');
    terminal.style.width = '70%';
    terminal.style.height = 'calc(100vh - 88px)';
    terminal.style.transform = 'translateX(-50%)';
    terminal.style.top = '20px';
    terminal.style.left = '50%';
    terminal.style.right = 'auto';
    terminal.style.bottom = 'auto';
    terminal.style.borderRadius = '8px';
    terminal.style.border = '1px solid #4d5157';
    document.querySelector('.control.maximize').textContent = '□';
    
    // Restore original URL when minimizing
    const originalPath = window.location.pathname.split('/').slice(0, -1).join('/') || '/';
    window.history.pushState({}, '', originalPath);
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl+Alt+T: Open terminal
  if (e.ctrlKey && e.altKey && e.key === 't') {
    e.preventDefault();
    // Open empty terminal
    const terminal = document.getElementById('terminal-window');
    const overlay = document.getElementById('overlay');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (terminal && overlay && terminalOutput) {
      terminalOutput.innerHTML = '<p>Welcome to the terminal!</p>';
      terminal.classList.remove('hidden');
      overlay.classList.remove('hidden');
      
      // Auto-maximize terminal on mobile devices
      if (window.innerWidth <= 768) {
        maximizeTerminal();
      }
      
      updateTaskManager();
    }
  }
  
  // Escape: Close panels
  if (e.key === 'Escape') {
    closeAllPanels();
  }
  
  // F11: Toggle fullscreen
  if (e.key === 'F11') {
    e.preventDefault();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
});

// Load GitHub repositories
function loadGitHubRepositories() {
  const repoContainer = document.getElementById('repositories-list');
  const repoCount = document.getElementById('repo-count');
  if (!repoContainer) return;
  
  fetch('https://api.github.com/users/lpsandaruwan/repos?sort=updated&per_page=8&type=owner')
    .then(response => response.json())
    .then(repos => {
      if (repoCount) repoCount.textContent = repos.length;
      
      repoContainer.innerHTML = '';
      
      repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repo-item';
        
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        const language = repo.language || 'Unknown';
        
        repoElement.innerHTML = `
          <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
          <div class="repo-description">${repo.description || 'Repository process'}</div>
          <div class="repo-meta">
            <div class="meta-item">
              <i class="fas fa-star"></i>
              <span>${repo.stargazers_count}</span>
            </div>
            <div class="meta-item language">
              <i class="fas fa-circle"></i>
              <span>${language}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>${updatedDate}</span>
            </div>
          </div>
        `;
        
        repoContainer.appendChild(repoElement);
      });
    })
    .catch(error => {
      console.error('Error loading repositories:', error);
      if (repoCount) repoCount.textContent = '!';
      repoContainer.innerHTML = `
        <div class="loading">
          <i class="fas fa-exclamation-triangle"></i>
          Failed to scan processes
        </div>
      `;
    });
}

// Load GitHub organizations
function loadGitHubOrganizations() {
  const orgContainer = document.getElementById('organizations-list');
  const orgCount = document.getElementById('org-count');
  if (!orgContainer) return;
  
  fetch('https://api.github.com/users/lpsandaruwan/orgs')
    .then(response => response.json())
    .then(orgs => {
      if (orgCount) orgCount.textContent = orgs.length;
      
      if (orgs.length === 0) {
        orgContainer.innerHTML = `
          <div class="loading">
            <i class="fas fa-info-circle"></i>
            No public organizations found
          </div>
        `;
        return;
      }
      
      orgContainer.innerHTML = '';
      
      orgs.forEach(org => {
        const orgElement = document.createElement('div');
        orgElement.className = 'org-item';
        
        orgElement.innerHTML = `
          <a href="${org.html_url}" target="_blank" class="org-name">${org.login}</a>
          <div class="org-description">${org.description || 'Organization process'}</div>
          <div class="org-meta">
            <div class="meta-item">
              <i class="fas fa-users"></i>
              <span>ORG</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-play"></i>
              <span>RUNNING</span>
            </div>
          </div>
        `;
        
        orgContainer.appendChild(orgElement);
      });
    })
    .catch(error => {
      console.error('Error loading organizations:', error);
      if (orgCount) orgCount.textContent = '!';
      orgContainer.innerHTML = `
        <div class="loading">
          <i class="fas fa-exclamation-triangle"></i>
          Failed to detect processes
        </div>
      `;
    });
}

// Load organization repositories
function loadOrganizationRepositories() {
  const orgRepoContainer = document.getElementById('org-repositories-list');
  if (!orgRepoContainer) return;
  
  // First get organizations, then get repos from each org
  fetch('https://api.github.com/users/lpsandaruwan/orgs')
    .then(response => response.json())
    .then(orgs => {
      if (orgs.length === 0) {
        orgRepoContainer.innerHTML = `
          <div class="loading">
            <i class="fas fa-info-circle"></i>
            No organization repositories found
          </div>
        `;
        return;
      }
      
      orgRepoContainer.innerHTML = '';
      let allOrgRepos = [];
      
      // Fetch repos from each organization
      const orgPromises = orgs.slice(0, 3).map(org => // Limit to first 3 orgs for performance
        fetch(`https://api.github.com/orgs/${org.login}/repos?sort=updated&per_page=3`)
          .then(response => response.json())
          .then(repos => repos.map(repo => ({...repo, orgName: org.login})))
      );
      
      Promise.all(orgPromises)
        .then(orgRepoArrays => {
          // Flatten and combine all org repos
          allOrgRepos = orgRepoArrays.flat().slice(0, 6); // Limit total to 6
          
          if (allOrgRepos.length === 0) {
            orgRepoContainer.innerHTML = `
              <div class="loading">
                <i class="fas fa-info-circle"></i>
                No accessible organization repositories
              </div>
            `;
            return;
          }
          
          allOrgRepos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'repo-item';
            
            const updatedDate = new Date(repo.updated_at).toLocaleDateString();
            const language = repo.language || 'Unknown';
            
            repoElement.innerHTML = `
              <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
              <div class="repo-description">${repo.description || 'No description available'}</div>
              <div class="repo-meta">
                <div class="meta-item">
                  <i class="fas fa-building"></i>
                  <span>${repo.orgName}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-star"></i>
                  <span>${repo.stargazers_count}</span>
                </div>
                <div class="meta-item language">
                  <i class="fas fa-circle"></i>
                  <span>${language}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>Updated ${updatedDate}</span>
                </div>
              </div>
            `;
            
            orgRepoContainer.appendChild(repoElement);
          });
        });
    })
    .catch(error => {
      console.error('Error loading organization repositories:', error);
      orgRepoContainer.innerHTML = `
        <div class="loading">
          <i class="fas fa-exclamation-triangle"></i>
          Failed to load organization repositories
        </div>
      `;
    });
}

// Load archive data for Ark interface
function loadArchiveData() {
  const fileList = document.getElementById('archive-file-list');
  const yearTree = document.getElementById('year-tree');
  const fileCount = document.getElementById('archive-file-count');
  const totalPosts = document.getElementById('total-posts');
  const selectedCount = document.getElementById('selected-count');
  const archiveSize = document.getElementById('archive-size');
  
  if (!fileList) return;
  
  // Get all posts from Jekyll (this would need to be populated via Jekyll)
  // For demo purposes, we'll simulate loading archive data
  
  // Create archive structure from posts
  const posts = window.searchData || []; // Use search data if available
  const postsByYear = {};
  let totalSize = 0;
  
  // Group posts by year
  posts.forEach(post => {
    const year = new Date(post.date).getFullYear() || 'Unknown';
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });
  
  // Update counters
  if (fileCount) fileCount.textContent = `${posts.length} files`;
  if (totalPosts) totalPosts.textContent = posts.length;
  if (selectedCount) selectedCount.textContent = '0 selected';
  
  // Build year tree
  if (yearTree) {
    yearTree.innerHTML = '';
    const years = Object.keys(postsByYear).sort((a, b) => b - a);
    
    years.forEach(year => {
      const yearItem = document.createElement('div');
      yearItem.className = 'tree-item';
      yearItem.dataset.year = year;
      yearItem.innerHTML = `
        <i class="fas fa-folder"></i>
        <span>${year}</span>
        <span class="item-count">${postsByYear[year].length}</span>
      `;
      
      yearItem.addEventListener('click', function() {
        // Remove previous selections
        document.querySelectorAll('.tree-item').forEach(item => item.classList.remove('selected'));
        this.classList.add('selected');
        
        // Filter file list by year
        displayArchiveFiles(year === 'all' ? posts : postsByYear[year]);
      });
      
      yearTree.appendChild(yearItem);
    });
  }
  
  // Display all files initially
  displayArchiveFiles(posts);
  
  // Calculate total archive size (simulated)
  const sizeInKB = posts.length * 3.2; // Estimate 3.2KB per post
  if (archiveSize) {
    if (sizeInKB > 1024) {
      archiveSize.textContent = `Archive size: ${(sizeInKB / 1024).toFixed(1)} MB`;
    } else {
      archiveSize.textContent = `Archive size: ${sizeInKB.toFixed(0)} KB`;
    }
  }
}

// Display archive files in the file list
function displayArchiveFiles(posts) {
  const fileList = document.getElementById('archive-file-list');
  if (!fileList) return;
  
  fileList.innerHTML = '';
  
  posts.forEach((post, index) => {
    const fileEntry = document.createElement('div');
    fileEntry.className = 'file-entry';
    fileEntry.dataset.url = post.url;
    
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    
    // Estimate file size based on content length
    const contentSize = (post.content || '').length;
    const sizeInKB = Math.max(1, Math.floor(contentSize / 100) / 10);
    
    fileEntry.innerHTML = `
      <div class="file-name">
        <i class="fas fa-file-alt"></i>
        <span class="name-text">${post.title}.md</span>
      </div>
      <div class="file-size">${sizeInKB} KB</div>
      <div class="file-type">Markdown</div>
      <div class="file-date">${formattedDate}</div>
    `;
    
    // Add click handler to open post
    fileEntry.addEventListener('click', function() {
      // Remove previous selections
      document.querySelectorAll('.file-entry').forEach(entry => entry.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update selected count
      const selectedCount = document.getElementById('selected-count');
      if (selectedCount) selectedCount.textContent = '1 selected';
    });
    
    // Add double-click handler to open post
    fileEntry.addEventListener('dblclick', function() {
      // Create a fake element to trigger openPost
      const fakeElement = {
        dataset: {
          url: post.url,
          title: post.title,
          content: post.content
        }
      };
      openPost(fakeElement);
    });
    
    fileList.appendChild(fileEntry);
  });
  
  // Update file count
  const fileCount = document.getElementById('archive-file-count');
  if (fileCount) fileCount.textContent = `${posts.length} files`;
}

// Mobile navigation functions
function toggleMobileNav() {
  const sidebar = document.querySelector('.fm-sidebar');
  const overlay = document.querySelector('.mobile-nav-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  }
}

function closeMobileNav() {
  const sidebar = document.querySelector('.fm-sidebar');
  const overlay = document.querySelector('.mobile-nav-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }
}

function initializeMobileNavigation() {
  // Create mobile navigation elements if they don't exist
  if (window.innerWidth <= 768) {
    createMobileNavigation();
  }
  
  // Add event listeners for mobile navigation
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileNav);
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileNav();
    } else if (window.innerWidth <= 768) {
      createMobileNavigation();
    }
  });
}

function createMobileNavigation() {
  // Create mobile header if it doesn't exist
  if (!document.querySelector('.mobile-header')) {
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-header';
    mobileHeader.innerHTML = `
      <button class="mobile-menu-button" onclick="toggleMobileNav()">
        <i class="fas fa-bars"></i>
      </button>
      <span class="mobile-title">File Manager</span>
    `;
    
    const plasmaDesktop = document.querySelector('.plasma-desktop');
    if (plasmaDesktop) {
      plasmaDesktop.insertBefore(mobileHeader, plasmaDesktop.firstChild);
    }
  }
  
  // Create mobile nav overlay if it doesn't exist
  if (!document.querySelector('.mobile-nav-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.addEventListener('click', closeMobileNav);
    
    const plasmaDesktop = document.querySelector('.plasma-desktop');
    if (plasmaDesktop) {
      plasmaDesktop.appendChild(overlay);
    }
  }
}

// Check if current page is a post and auto-maximize terminal on mobile
function checkAndAutoMaximizePost() {
  // Check if we're on a post page by URL pattern
  const isPostPage = window.location.pathname.includes('/posts/') || 
                     window.location.pathname.match(/\/\d{4}\/\d{2}\/\d{2}\//);
  
  if (isPostPage && window.innerWidth <= 768) {
    const terminal = document.getElementById('terminal-window');
    
    if (terminal) {
      // If terminal is already visible, maximize it
      if (!terminal.classList.contains('hidden')) {
        setTimeout(() => {
          maximizeTerminal();
        }, 100);
      } else {
        // If terminal is hidden, use MutationObserver to watch for when it becomes visible
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (!terminal.classList.contains('hidden')) {
                setTimeout(() => {
                  maximizeTerminal();
                }, 50);
                observer.disconnect(); // Stop observing once we've maximized
              }
            }
          });
        });
        
        observer.observe(terminal, {
          attributes: true,
          attributeFilter: ['class']
        });
        
        // Also check periodically in case the class change isn't detected
        const checkInterval = setInterval(() => {
          if (!terminal.classList.contains('hidden')) {
            setTimeout(() => {
              maximizeTerminal();
            }, 50);
            clearInterval(checkInterval);
            observer.disconnect();
          }
        }, 100);
        
        // Stop checking after 5 seconds to avoid infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
          observer.disconnect();
        }, 5000);
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
  
  // Initialize task manager
  updateTaskManager();
  
  // Initialize mobile navigation
  initializeMobileNavigation();
  
  // Check if we need to auto-maximize terminal for direct post access
  checkAndAutoMaximizePost();
  
  // Handle orientation changes and window resizing for mobile
  window.addEventListener('resize', function() {
    // Re-check auto-maximize on orientation change
    setTimeout(() => {
      checkAndAutoMaximizePost();
    }, 300); // Small delay to allow orientation change to complete
  });
  
  // Handle orientation change events specifically
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      checkAndAutoMaximizePost();
    }, 500); // Longer delay for orientation change
  });
  
  // Load GitHub data if on GitHub stats page
  if (window.location.pathname.includes('/projects/')) {
    loadGitHubRepositories();
    loadGitHubOrganizations();
    loadOrganizationRepositories();
  }
  
  // Load archive data if on Ark page
  if (window.location.pathname.includes('/archives/')) {
    loadArchiveData();
    
    // Add click handler for "All Posts" button
    const allPostsButton = document.querySelector('.tree-item[data-year="all"]');
    if (allPostsButton) {
      allPostsButton.addEventListener('click', function() {
        // Remove previous selections
        document.querySelectorAll('.tree-item').forEach(item => item.classList.remove('selected'));
        this.classList.add('selected');
        
        // Show all posts
        const posts = window.searchData || [];
        displayArchiveFiles(posts);
      });
    }
  }
  
  // Add double-click to file items for better UX
  document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('dblclick', function() {
      openPost(this);
    });
  });
  
  // Add search functionality
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      } else {
        // Real-time search as user types
        performSearch();
      }
    });
  }
  
  // Add window dragging (basic implementation)
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  document.addEventListener('mousedown', function(e) {
    if (e.target.closest('.terminal-titlebar')) {
      isDragging = true;
      const terminal = document.getElementById('terminal-window');
      const rect = terminal.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
    }
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const terminal = document.getElementById('terminal-window');
      // Reset transform and use absolute positioning while dragging
      terminal.style.transform = 'none';
      terminal.style.left = (e.clientX - dragOffset.x) + 'px';
      terminal.style.top = (e.clientY - dragOffset.y) + 'px';
    }
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });
  
  console.log('KDE Plasma Desktop initialized');
});

// Make sure functions are available globally
window.openPost = openPost;
window.closeTerminal = closeTerminal;
window.toggleAppMenu = toggleAppMenu;
window.toggleNetworkInfo = toggleNetworkInfo;
window.closeAllPanels = closeAllPanels;
window.performSearch = performSearch;
window.toggleCategoriesMenu = toggleCategoriesMenu;
window.maximizeTerminal = maximizeTerminal;
window.minimizeTerminal = minimizeTerminal;
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
