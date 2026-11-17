/* Рейтинг квестов на карточках каталога и главной. */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.QRStore || !window.QR) return;

  document.querySelectorAll('.quest-card').forEach((card) => {
    const link = card.querySelector('a[href*="product.html?id="]');
    const title = card.querySelector('.card-title');
    if (!link || !title || card.querySelector('.quest-rating')) return;

    let questId = '';
    try {
      questId = new URL(link.href).searchParams.get('id') || '';
    } catch (error) {
      return;
    }

    if (!questId) return;

    const stats = window.QRStore.getRatingStats(questId);
    if (!stats.count) return;

    const average = String(stats.average).replace('.', ',');
    const rounded = Math.round(stats.average);
    const reviewWord = window.QR.plural(stats.count, ['отзыв', 'отзыва', 'отзывов']);

    let stars = '<span class="rating-stars rating-stars--sm" aria-hidden="true">';
    for (let index = 1; index <= 5; index += 1) {
      stars += '<span class="rating-star' + (index <= rounded ? ' is-filled' : '') + '">★</span>';
    }
    stars += '</span>';

    const rating = document.createElement('div');
    rating.className = 'quest-rating';
    rating.dataset.ratingQuest = questId;
    rating.setAttribute('role', 'img');
    rating.setAttribute('aria-label', 'Рейтинг ' + average + ' из 5, ' + stats.count + ' ' + reviewWord);
    rating.innerHTML =
      stars +
      '<span class="quest-rating__value">' + average + '</span>' +
      '<span class="quest-rating__count">' + stats.count + ' ' + reviewWord + '</span>';

    const titleRow = title.closest('.d-flex.justify-content-between') || title;
    titleRow.insertAdjacentElement('afterend', rating);
  });
});
