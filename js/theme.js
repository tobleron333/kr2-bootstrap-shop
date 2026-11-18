/* Переключение тёмной и светлой темы с плавным переходом. */
(function () {
  'use strict';

  const STORAGE_KEY = 'qr_theme';
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentTheme = () => (root.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark');

  const updateButton = (theme) => {
    if (!button) return;
    const nextLabel = theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему';
    button.setAttribute('aria-label', nextLabel);
    button.setAttribute('title', nextLabel);
    button.setAttribute('aria-pressed', String(theme === 'light'));
  };

  const commitTheme = (theme, options = {}) => {
    if (options.instantIcon) {
      root.classList.add('theme-instant-icon');
    }

    root.setAttribute('data-bs-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // localStorage может быть недоступен
    }
    updateButton(theme);

    if (options.instantIcon) {
      window.setTimeout(() => {
        root.classList.remove('theme-instant-icon');
      }, 300);
    }
  };

  const applyWithCssTransition = (theme) => {
    root.classList.add('theme-transition');
    commitTheme(theme);

    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 460);
  };

  const applyTheme = (theme) => {
    if (prefersReducedMotion) {
      commitTheme(theme);
      return;
    }

    // Плавный кроссфейд всей страницы там, где поддерживается View Transitions API.
    if (typeof document.startViewTransition === 'function') {
      try {
        document.startViewTransition(() => commitTheme(theme, { instantIcon: true }));
        return;
      } catch (error) {
        // Если переход не запустился, используем CSS-фолбэк.
      }
    }

    applyWithCssTransition(theme);
  };

  if (!button) return;

  updateButton(currentTheme());

  button.addEventListener('click', () => {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });
})();
