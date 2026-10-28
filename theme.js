document.documentElement.classList.add('js');
(() => {
  try {
    const saved = localStorage.getItem('gt-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch { /* Browsing with storage disabled remains supported. */ }
})();
