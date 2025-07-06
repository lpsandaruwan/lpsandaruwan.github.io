---
layout: plasma-desktop
title: KSysGuard
icon: fas fa-chart-area
order: 4
---

<div class="ksysguard-dashboard" id="ksysguard-dashboard">
  
  <!-- KSysGuard Toolbar -->
  <div class="ksysguard-toolbar">
    <div class="toolbar-section">
      <div class="toolbar-title">
        <i class="fas fa-chart-area"></i>
        <span>System Monitor - Developer Statistics</span>
      </div>
    </div>
    <div class="toolbar-section">
      <div class="refresh-indicator">
        <i class="fas fa-sync-alt" id="refresh-icon"></i>
        <span>Auto-refresh: ON</span>
      </div>
    </div>
  </div>

  <!-- KSysGuard Main Content -->
  <div class="ksysguard-content">
    
    <!-- Top Row - Overview Metrics -->
    <div class="monitor-row">
      <div class="monitor-panel half-width">
        <div class="panel-header">
          <i class="fab fa-github"></i>
          <span>GitHub Profile Overview</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="metrics-overview">
            <img src="https://github-readme-stats.vercel.app/api?username=lpsandaruwan&show_icons=true&theme=dark&count_private=true&hide_border=true&bg_color=2a2e32&text_color=fcfcfc&icon_color=3daee9&title_color=3daee9" alt="GitHub Stats" />
          </div>
        </div>
      </div>
      
      <div class="monitor-panel half-width">
        <div class="panel-header">
          <i class="fas fa-fire"></i>
          <span>Activity Streak Monitor</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="metrics-overview">
            <img src="https://github-readme-streak-stats.herokuapp.com/?user=lpsandaruwan&theme=dark&hide_border=true&background=2a2e32&stroke=3daee9&ring=3daee9&fire=f67400&currStreakLabel=3daee9" alt="GitHub Streak" />
          </div>
        </div>
      </div>
    </div>

    <!-- Second Row - Language and Activity -->
    <div class="monitor-row">
      <div class="monitor-panel third-width">
        <div class="panel-header">
          <i class="fas fa-code"></i>
          <span>Language Distribution</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="metrics-chart">
            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=lpsandaruwan&layout=compact&theme=dark&hide_border=true&bg_color=2a2e32&text_color=fcfcfc&title_color=3daee9&count_private=true&include_orgs=true&langs_count=8" alt="Top Languages" />
          </div>
        </div>
      </div>
      
      <div class="monitor-panel two-thirds-width">
        <div class="panel-header">
          <i class="fas fa-chart-line"></i>
          <span>Contribution Timeline</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="activity-graph">
            <img src="https://github-readme-activity-graph.vercel.app/graph?username=lpsandaruwan&theme=react-dark&hide_border=true&bg_color=2a2e32&color=fcfcfc&line=3daee9&point=f67400" alt="Activity Graph" />
          </div>
        </div>
      </div>
    </div>

    <!-- Third Row - Repository Monitoring -->
    <div class="monitor-row">
      <div class="monitor-panel half-width">
        <div class="panel-header">
          <i class="fas fa-folder-open"></i>
          <span>Repository Monitor</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
            <span class="metric-count" id="repo-count">0</span>
          </div>
        </div>
        <div class="panel-content">
          <div class="process-list" id="repositories-list">
            <div class="loading">
              <i class="fas fa-spinner fa-spin"></i> Scanning repositories...
            </div>
          </div>
        </div>
      </div>
      
      <div class="monitor-panel half-width">
        <div class="panel-header">
          <i class="fas fa-users"></i>
          <span>Organization Processes</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
            <span class="metric-count" id="org-count">0</span>
          </div>
        </div>
        <div class="panel-content">
          <div class="process-list" id="organizations-list">
            <div class="loading">
              <i class="fas fa-spinner fa-spin"></i> Detecting organizations...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fourth Row - System Resources -->
    <div class="monitor-row">
      <div class="monitor-panel full-width">
        <div class="panel-header">
          <i class="fas fa-building"></i>
          <span>Organization Repository Activity</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="process-list compact" id="org-repositories-list">
            <div class="loading">
              <i class="fas fa-spinner fa-spin"></i> Loading organization processes...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fifth Row - Achievement Metrics -->
    <div class="monitor-row">
      <div class="monitor-panel full-width">
        <div class="panel-header">
          <i class="fas fa-trophy"></i>
          <span>Achievement Metrics</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="achievements-grid">
            <img src="https://github-profile-trophy.vercel.app/?username=lpsandaruwan&theme=darkhub&no-frame=true&column=6&margin-w=10&margin-h=10" alt="GitHub Trophies" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row - Analytics -->
    <div class="monitor-row">
      <div class="monitor-panel full-width">
        <div class="panel-header">
          <i class="fas fa-analytics"></i>
          <span>Performance Metrics</span>
          <div class="panel-controls">
            <span class="status-indicator active"></span>
          </div>
        </div>
        <div class="panel-content">
          <div class="performance-metrics">
            <div class="metric-item">
              <img src="https://komarev.com/ghpvc/?username=lpsandaruwan&color=3daee9&style=flat-square&label=Profile+Views" alt="Profile Views" />
            </div>
            <div class="metric-item">
              <img src="https://img.shields.io/github/followers/lpsandaruwan?color=3daee9&style=flat-square&label=Followers" alt="Followers" />
            </div>
            <div class="metric-item">
              <img src="https://img.shields.io/github/stars/lpsandaruwan?color=f67400&style=flat-square&label=Total+Stars" alt="Total Stars" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>