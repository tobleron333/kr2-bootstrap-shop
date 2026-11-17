/* Отзывы на странице квеста. */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('reviews');
  if (!section || !window.QR || !window.QRStore) return;

  const questId = new URLSearchParams(window.location.search).get('id') || 'lab';
  const summary = document.getElementById('reviewsSummary');
  const list = document.getElementById('reviewsList');
  const countLabel = document.getElementById('reviewsCountLabel');
  const sortSelect = document.getElementById('reviewsSort');
  const moreButton = document.getElementById('reviewsMore');
  const formCard = document.getElementById('reviewFormCard');
  const form = document.getElementById('reviewForm');
  const formToggle = document.getElementById('reviewFormToggle');
  const formStatus = document.getElementById('reviewFormStatus');
  const nameInput = document.getElementById('review-name');
  const textInput = document.getElementById('review-text');
  const ratingInputs = form ? Array.from(form.querySelectorAll('input[name="review-rating"]')) : [];

  let visibleCount = 4;
  let sortMode = 'new';

  const escape = window.QR.escapeHtml;
  const plural = window.QR.plural;

  const renderStars = (rating, extraClass) => {
    const rounded = Math.round(Number(rating) || 0);
    let html = '<span class="rating-stars' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true">';
    for (let index = 1; index <= 5; index += 1) {
      html += '<span class="rating-star' + (index <= rounded ? ' is-filled' : '') + '">★</span>';
    }
    return html + '</span>';
  };

  const sortedReviews = () => {
    const reviews = window.QRStore.getReviews(questId).slice();
    if (sortMode === 'high') {
      reviews.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortMode === 'low') {
      reviews.sort((a, b) => Number(a.rating) - Number(b.rating));
    }
    return reviews;
  };

  const renderSummary = () => {
    if (!summary) return;
    const stats = window.QRStore.getRatingStats(questId);
    const average = stats.average ? String(stats.average).replace('.', ',') : '—';
    const reviewWord = plural(stats.count, ['отзыв', 'отзыва', 'отзывов']);

    let rows = '';
    for (let star = 5; star >= 1; star -= 1) {
      const count = stats.distribution[star] || 0;
      const percent = stats.count ? Math.round((count / stats.count) * 100) : 0;
      rows +=
        '<div class="rating-row">' +
          '<span class="rating-row__label">' + star + ' ★</span>' +
          '<span class="rating-bar"><span style="width:' + percent + '%"></span></span>' +
          '<span class="rating-row__count">' + count + '</span>' +
        '</div>';
    }

    summary.innerHTML =
      '<div class="reviews-summary__top">' +
        '<span class="rating-big">' + average + '</span>' +
        '<div>' +
          renderStars(stats.average, 'rating-stars--lg') +
          '<div class="rating-count">' + stats.count + ' ' + reviewWord + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="rating-distribution">' + rows + '</div>';
  };

  const renderList = () => {
    if (!list) return;
    const reviews = sortedReviews();
    const visible = reviews.slice(0, visibleCount);

    if (!visible.length) {
      list.innerHTML = '<div class="empty-state"><h3>Пока нет отзывов</h3><p class="mb-0">Станьте первым, кто расскажет об этом квесте.</p></div>';
    } else {
      list.innerHTML = visible.map((review) => {
        const initial = String(review.name || '?').trim().charAt(0).toUpperCase();
        const verified = review.verified
          ? '<span class="review-verified">Проверенный игрок</span>'
          : '';
        return (
          '<article class="review-card">' +
            '<div class="review-card__head">' +
              '<span class="review-avatar" aria-hidden="true">' + escape(initial) + '</span>' +
              '<div class="review-meta">' +
                '<div class="review-author">' + escape(review.name) + verified + '</div>' +
                '<div class="review-date">' + escape(window.QR.formatDate(review.date)) + '</div>' +
                renderStars(review.rating) +
              '</div>' +
            '</div>' +
            '<p class="review-text">' + escape(review.text) + '</p>' +
          '</article>'
        );
      }).join('');
    }

    if (countLabel) {
      countLabel.textContent = 'Показано ' + Math.min(visibleCount, reviews.length) + ' из ' + reviews.length;
    }
    if (moreButton) {
      moreButton.hidden = visibleCount >= reviews.length;
    }
  };

  const refresh = () => {
    renderSummary();
    renderList();
  };

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortMode = sortSelect.value;
      visibleCount = 4;
      renderList();
    });
  }

  if (moreButton) {
    moreButton.addEventListener('click', () => {
      visibleCount += 4;
      renderList();
    });
  }

  if (formToggle && formCard) {
    formToggle.addEventListener('click', () => {
      const willOpen = formCard.hidden;
      formCard.hidden = !willOpen;
      formToggle.textContent = willOpen ? 'Скрыть форму' : 'Оставить отзыв';
      if (willOpen) {
        if (formStatus) formStatus.hidden = true;
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (textInput) textInput.focus({ preventScroll: true });
      }
    });
  }

  if (form && nameInput && textInput) {
    const profile = window.QRStore.getProfile();
    if (profile) {
      nameInput.value = profile.name;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.classList.add('was-validated');

      const selectedRating = ratingInputs.find((input) => input.checked);
      if (!selectedRating || !nameInput.value.trim() || textInput.value.trim().length < 10) {
        if (formStatus) {
          formStatus.className = 'alert alert-warning mt-3 mb-0';
          formStatus.textContent = 'Поставьте оценку, укажите имя и напишите хотя бы 10 символов.';
          formStatus.hidden = false;
        }
        return;
      }

      window.QRStore.addReview({
        questId,
        name: nameInput.value.trim(),
        rating: Number(selectedRating.value),
        text: textInput.value.trim(),
        verified: window.QRStore.hasBookedQuest(questId),
      });

      visibleCount = 4;
      refresh();
      form.reset();
      form.classList.remove('was-validated');
      if (profile) nameInput.value = profile.name;

      if (formStatus) {
        formStatus.className = 'alert alert-success mt-3 mb-0';
        formStatus.textContent = 'Спасибо! Отзыв опубликован.';
        formStatus.hidden = false;
      }
    });
  }

  refresh();

  if (new URLSearchParams(window.location.search).get('review') === '1' && formCard) {
    formCard.hidden = false;
    if (formToggle) formToggle.textContent = 'Скрыть форму';
    window.setTimeout(() => formCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }
});
