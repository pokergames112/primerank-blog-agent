(function () {
  // Prime Rank Marketing - Blog Embed Widget
  const scriptTag = document.currentScript;
  const baseUrl = scriptTag ? new URL(scriptTag.src).origin : 'http://localhost:3006';

  function initWidget() {
    const container = document.getElementById('primerank-blog-preview');
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/widget/preview-frame.html`;
    iframe.style.width = '100%';
    iframe.style.minHeight = '480px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';

    // Auto-resize iframe
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'primerank-blog-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });

    container.appendChild(iframe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
