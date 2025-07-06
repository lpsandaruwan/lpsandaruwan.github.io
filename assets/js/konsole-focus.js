/**
 * Konsole Focus Enhancement
 * Adds smooth darkness to items behind the konsole and improves focus on konsole content
 */

document.addEventListener('DOMContentLoaded', function() {
  // Function to add terminal focus effect
  function setupTerminalFocus() {
    // Find all terminal windows
    const terminalWindows = document.querySelectorAll('.terminal-window');
    
    if (terminalWindows.length === 0) return;
    
    // Add event listeners to each terminal window
    terminalWindows.forEach(terminal => {
      // Add focus class on mouseenter
      terminal.addEventListener('mouseenter', () => {
        document.body.classList.add('terminal-focus');
      });
      
      // Remove focus class on mouseleave
      terminal.addEventListener('mouseleave', () => {
        document.body.classList.remove('terminal-focus');
      });
      
      // Add focus class on click (for mobile devices)
      terminal.addEventListener('click', () => {
        document.body.classList.add('terminal-focus');
      });
    });
    
    // Add event listener to document to remove focus when clicking outside terminal
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.terminal-window')) {
        document.body.classList.remove('terminal-focus');
      }
    });
  }
  
  // Run setup
  setupTerminalFocus();
  
  // Re-run setup when content changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    setupTerminalFocus();
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, { 
    childList: true,
    subtree: true
  });
});
