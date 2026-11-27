const TRACKER_URL = 'https://script.google.com/macros/s/AKfycbxuTLqglFL_RWl3k5PYYR1KHMc_iiDxhViOAhr66F3r98mjt-f8053Bzz6q7c8kScXDyg/exec';

  function getLinkLabel(link) {
    const text = (link.innerText || '').trim();
    if (text) return text;

    const aria = (link.getAttribute('aria-label') || '').trim();
    if (aria) return aria;

    const title = (link.title || '').trim();
    if (title) return title;

    const img = link.querySelector('img');
    if (img && img.alt && img.alt.trim()) return img.alt.trim();

    return link.href;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || !TRACKER_URL) return;

    const payload = JSON.stringify({
      site: getLinkLabel(link),
      url: link.href
    });

    const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
    const sent = navigator.sendBeacon && navigator.sendBeacon(TRACKER_URL, blob);

    if (!sent && window.fetch) {
      fetch(TRACKER_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: payload
      }).catch(() => {});
    }
  });
