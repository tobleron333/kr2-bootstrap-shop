/* Личный кабинет: вход, брони и бонусы. */
document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('accountLogin');
  const dashboard = document.getElementById('accountDashboard');
  if (!loginSection || !dashboard || !window.QRStore) return;

  const { formatPrice, formatDate, escapeHtml, plural } = window.QR;
  const loginForm = document.getElementById('accountLoginForm');
  const nameInput = document.getElementById('account-name');
  const phoneInput = document.getElementById('account-phone');
  const loginError = document.getElementById('accountLoginError');
  const logoutButton = document.getElementById('accountLogout');
  const bookingsList = document.getElementById('bookingsList');
  const userName = document.getElementById('account-user-name');
  const userPhone = document.getElementById('account-user-phone');
  const bookingsCount = document.getElementById('account-bookings-count');
  const upcomingCount = document.getElementById('account-upcoming-count');
  const bonusBalance = document.getElementById('account-bonus-balance');
  const bookingsLabel = document.getElementById('account-bookings-label');
  const upcomingLabel = document.getElementById('account-upcoming-label');
  const bonusLabel = document.getElementById('account-bonus-label');
  const bonusTotal = document.getElementById('bonus-total');

  let profile = window.QRStore.getProfile();

  const setVisible = (visible) => {
    loginSection.hidden = !visible;
    dashboard.hidden = visible;
  };

  const bookingStatus = (booking) => {
    if (booking.status === 'cancelled') {
      return { key: 'cancelled', label: 'Отменена' };
    }
    if (window.QRStore.isBookingDone(booking)) {
      return { key: 'done', label: 'Пройден' };
    }
    return { key: 'upcoming', label: 'Предстоит' };
  };

  const renderBookings = () => {
    if (!bookingsList) return;
    const bookings = window.QRStore.getMyBookings();

    if (!bookings.length) {
      bookingsList.innerHTML =
        '<div class="empty-state">' +
          '<h3>Пока нет броней</h3>' +
          '<p class="mb-3">Выберите квест — и он появится здесь после бронирования.</p>' +
          '<a class="btn btn-primary" href="catalog.html">Перейти в каталог</a>' +
        '</div>';
      return;
    }

    bookingsList.innerHTML = bookings.map((booking) => {
      const status = bookingStatus(booking);
      const image = booking.questImage || 'images/quest-logo-big.jpg';
      const isCustom = booking.questId === 'custom';
      const canReview = !isCustom && status.key === 'done';
      const canCancel = status.key === 'upcoming';
      const price = booking.total ? formatPrice(booking.total) : 'По запросу';

      return (
        '<article class="booking-item' + (status.key === 'cancelled' ? ' booking-item--cancelled' : '') + '">' +
          '<img class="booking-item__image" src="' + escapeHtml(image) + '" alt="">' +
          '<div>' +
            '<h3 class="booking-item__title">' + escapeHtml(booking.questTitle) + '</h3>' +
            '<div class="booking-item__meta">' +
              '<span>' + escapeHtml(formatDate(booking.date)) + '</span>' +
              '<span>' + escapeHtml(booking.time) + '</span>' +
              '<span>' + booking.players + ' ' + plural(booking.players, ['игрок', 'игрока', 'игроков']) + '</span>' +
              '<span>№ ' + escapeHtml(booking.code) + '</span>' +
            '</div>' +
            '<span class="booking-status booking-status--' + status.key + '">' + status.label + '</span>' +
          '</div>' +
          '<div class="booking-item__side">' +
            '<span class="booking-item__price">' + price + '</span>' +
            (canCancel ? '<button type="button" class="btn btn-outline-secondary btn-sm" data-cancel="' + escapeHtml(booking.id) + '">Отменить</button>' : '') +
            (canReview ? '<a class="btn btn-primary btn-sm" href="product.html?id=' + encodeURIComponent(booking.questId) + '&review=1#reviews">Оставить отзыв</a>' : '') +
          '</div>' +
        '</article>'
      );
    }).join('');
  };

  const renderDashboard = () => {
    const bookings = window.QRStore.getMyBookings();
    const activeBookings = bookings.filter((booking) => booking.status !== 'cancelled');
    const upcoming = activeBookings.filter((booking) => !window.QRStore.isBookingDone(booking));
    const bonuses = window.QRStore.getBonuses();

    if (userName) userName.textContent = profile ? profile.name : 'Игрок';
    if (userPhone) userPhone.textContent = profile ? profile.phone : '';
    if (bookingsCount) bookingsCount.textContent = String(activeBookings.length);
    if (upcomingCount) upcomingCount.textContent = String(upcoming.length);
    if (bonusBalance) bonusBalance.textContent = String(bonuses);
    if (bonusTotal) bonusTotal.textContent = String(bonuses);

    if (bookingsLabel) {
      bookingsLabel.textContent = plural(activeBookings.length, ['бронь', 'брони', 'броней']) + ' всего';
    }
    if (upcomingLabel) {
      upcomingLabel.textContent = plural(upcoming.length, ['предстоящая', 'предстоящие', 'предстоящих']);
    }
    if (bonusLabel) {
      bonusLabel.textContent = plural(bonuses, ['бонусный балл', 'бонусных балла', 'бонусных баллов']);
    }

    renderBookings();
  };

  const showLogin = () => {
    setVisible(true);
    if (loginError) loginError.hidden = true;
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
  };

  const showDashboard = () => {
    setVisible(false);
    renderDashboard();
  };

  if (profile) {
    showDashboard();
  } else {
    setVisible(true);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      loginForm.classList.add('was-validated');

      const name = nameInput.value.trim();
      const rawPhone = phoneInput.value.trim();
      const digits = window.QRStore.normalizePhone(rawPhone);

      if (!name || digits.length < 10) {
        if (loginError) {
          loginError.textContent = 'Укажите имя и телефон в формате 900 000-00-00.';
          loginError.hidden = false;
        }
        return;
      }

      const phone = '+7 ' + rawPhone.replace(/^\+?7\s*/, '').replace(/^8\s*/, '');
      profile = window.QRStore.saveProfile({ name, phone });
      loginForm.reset();
      loginForm.classList.remove('was-validated');
      showDashboard();
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.QRStore.clearProfile();
      profile = null;
      showLogin();
    });
  }

  if (bookingsList) {
    bookingsList.addEventListener('click', (event) => {
      const cancelButton = event.target.closest('[data-cancel]');
      if (!cancelButton) return;
      const confirmed = window.confirm('Отменить эту бронь?');
      if (!confirmed) return;
      window.QRStore.cancelBooking(cancelButton.dataset.cancel);
      renderDashboard();
    });
  }

  // Статус «Пройден» появляется по времени, даже если страница открыта давно
  window.setInterval(() => {
    if (profile && !dashboard.hidden) renderDashboard();
  }, 60000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && profile && !dashboard.hidden) renderDashboard();
  });
});
