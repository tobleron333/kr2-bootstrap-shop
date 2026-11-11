document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('quest-map');
  const buttons = document.querySelectorAll('[data-map-lat]');

  if (!map || !buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const lat = button.dataset.mapLat;
      const lon = button.dataset.mapLon;
      const zoom = button.dataset.mapZoom || '16';

      map.src = 'https://yandex.ru/map-widget/v1/?ll=' + lon + '%2C' + lat +
        '&z=' + zoom + '&pt=' + lon + '%2C' + lat + '%2Cpm2rdm';

      const mapSection = document.getElementById('map');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
