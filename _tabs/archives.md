---
layout: plasma-desktop
title: Ark
icon: fas fa-file-archive
order: 3
---

<div class="ark-interface" id="ark-interface">
  
  <!-- Ark Toolbar -->
  <div class="ark-toolbar">
    <div class="toolbar-section">
      <div class="toolbar-title">
        <i class="fas fa-file-archive"></i>
        <span>Ark - Archive Manager</span>
      </div>
    </div>
    <div class="toolbar-section">
      <div class="archive-info">
        <span>blog-posts.tar.gz</span>
        <span class="file-count" id="archive-file-count">0 files</span>
      </div>
    </div>
  </div>


  <!-- Ark Content Area -->
  <div class="ark-content">
    
    <!-- File Tree / Navigation -->
    <div class="ark-sidebar">
      <div class="tree-header">
        <i class="fas fa-folder-open"></i>
        <span>Archive Structure</span>
      </div>
      <div class="archive-tree">
        <div class="tree-item expanded" data-year="all">
          <i class="fas fa-folder-open"></i>
          <span>All Posts</span>
          <span class="item-count" id="total-posts">0</span>
        </div>
        <div id="year-tree">
          <!-- Years will be populated by JavaScript -->
        </div>
      </div>
    </div>

    <!-- File List Area -->
    <div class="ark-main">
      <div class="file-list-header">
        <div class="column-header name-column">
          <i class="fas fa-sort"></i>
          <span>Name</span>
        </div>
        <div class="column-header size-column">
          <i class="fas fa-sort"></i>
          <span>Size</span>
        </div>
        <div class="column-header type-column">
          <i class="fas fa-sort"></i>
          <span>Type</span>
        </div>
        <div class="column-header date-column">
          <i class="fas fa-sort"></i>
          <span>Modified</span>
        </div>
      </div>
      
      <div class="file-list" id="archive-file-list">
        <div class="loading-files">
          <i class="fas fa-spinner fa-spin"></i>
          Reading archive contents...
        </div>
      </div>
    </div>
  </div>

  <!-- Ark Status Bar -->
  <div class="ark-statusbar">
    <div class="status-section">
      <span id="selected-count">0 selected</span>
    </div>
    <div class="status-section">
      <span>Compression: gzip</span>
    </div>
    <div class="status-section">
      <span id="archive-size">Archive size: calculating...</span>
    </div>
  </div>

</div>
