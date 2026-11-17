/* Переключение тёмной и светлой темы. */
(function () {
  'use strict';

  const STORAGE_KEY = 'qr_theme';
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');

  const currentTheme = () => (root.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark');

  const updateButton = (theme) => {
    if (!button) return;
    const nextLabel = theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему';
    button.setAttribute('aria-label', nextLabel);
    button.setAttribute('title', nextLabel);
    button.setAttribute('aria-pressed', String(theme === 'light'));
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-bs-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // localStorage может быть недоступен
    }
    updateButton(theme);
  };

  if (!button) return;

  updateButton(currentTheme());

  button.addEventListener('click', () => {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });
})();
