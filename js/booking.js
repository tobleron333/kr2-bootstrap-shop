/* Бронирование: выбор квеста, даты, времени и расчёт стоимости. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  if (!form || !window.QR || !window.QRStore) return;

  const { quests, questOrder, timeSlots, formatPrice, formatDate, todayISO } = window.QR;
  const profile = window.QRStore.getProfile();

  const questSelect = document.getElementById('booking-quest');
  const questCustom = document.getElementById('booking-quest-custom');
  const dateInput = document.getElementById('booking-date');
  const slotsBox = document.getElementById('booking-slots');
  const playersSelect = document.getElementById('booking-players');
  const playersCustom = document.getElementById('booking-players-custom');
  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  const emailInput = document.getElementById('booking-email');
  const commentInput = document.getElementById('booking-comment');
  const agreeInput = document.getElementById('booking-agree');
  const errorBox = document.getElementById('booking-error');
  const submitButton = document.getElementById('booking-submit');

  const summaryQuest = document.getElementById('summary-quest');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryPlayers = document.getElementById('summary-players');
  const summaryTotal = document.getElementById('summary-total');

  const modalElement = document.getElementById('bookingModal');
  const modalCode = document.getElementById('booking-code');
  const modalTotal = document.getElementById('booking-modal-total');
  const modalDetails = document.getElementById('booking-modal-details');

  let selectedTime = null;

  const questId = () => questSelect.value;
  const isCustomQuest = () => questId() === 'custom';
  const currentQuest = () => (isCustomQuest() ? null : quests[questId()] || null);
  const currentTitle = () => (isCustomQuest() ? (questCustom.value.trim() || 'Свой квест') : (currentQuest() ? currentQuest().title : ''));

  const selectedPlayers = () => {
    if (playersSelect.value === 'other') {
      const customValue = Number(playersCustom.value);
      return Number.isFinite(customValue) && customValue > 0 ? customValue : 0;
    }
    return Number(playersSelect.value) || 0;
  };

  const currentTotal = () => {
    const quest = currentQuest();
    if (!quest) return null;
    const players = selectedPlayers();
    const extraPlayers = Math.max(0, players - 4);
    return quest.price + extraPlayers * 300;
  };

  const fillQuestOptions = () => {
    questSelect.innerHTML = '<option value="" selected>Выберите квест</option>';
    questOrder.forEach((id) => {
      const quest = quests[id];
      const option = document.createElement('option');
      option.value = id;
      option.textContent = quest.title + ' — ' + formatPrice(quest.price);
      questSelect.appendChild(option);
    });

    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Другой квест…';
    questSelect.appendChild(customOption);
  };

  const fillPlayers = () => {
    const quest = currentQuest();
    const min = quest ? quest.minPlayers : 2;
    const max = quest ? quest.maxPlayers : 6;
    const previous = Number(playersSelect.value);

    playersSelect.innerHTML = '';
    for (let count = min; count <= max; count += 1) {
      const option = document.createElement('option');
      option.value = String(count);
      option.textContent = String(count);
      playersSelect.appendChild(option);
    }

    const other = document.createElement('option');
    other.value = 'other';
    other.textContent = 'Другое количество';
    playersSelect.appendChild(other);

    if (previous >= min && previous <= max) {
      playersSelect.value = String(previous);
    } else {
      playersSelect.value = String(min);
    }

    playersCustom.value = '';
    playersSelect.dispatchEvent(new Event('change'));
  };

  const renderSlots = () => {
    selectedTime = null;

    if (!questId()) {
      slotsBox.innerHTML = '<p class="summary-empty mb-0">Сначала выберите квест.</p>';
      return;
    }

    const date = dateInput.value || todayISO();
    const seed = date.split('-').reduce((sum, part) => sum + Number(part), 0) + (questId() === 'custom' ? 3 : questOrder.indexOf(questId()) + 1);

    slotsBox.innerHTML = '';
    timeSlots.forEach((time, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'slot-btn';
      button.textContent = time;
      button.dataset.time = time;

      const busy = (seed + index) % 4 === 0;
      const slotStart = new Date(date + 'T' + time + ':00');
      const passed = slotStart.getTime() <= Date.now();

      if (busy || passed) {
        button.disabled = true;
        button.title = passed ? 'Время уже прошло' : 'Это время уже занято';
      }

      slotsBox.appendChild(button);
    });
  };

  const updateSummary = () => {
    const quest = currentQuest();
    const title = currentTitle();

    if (summaryQuest) summaryQuest.textContent = title || '—';
    if (summaryDate) summaryDate.textContent = dateInput.value ? formatDate(dateInput.value) : '—';
    if (summaryTime) summaryTime.textContent = selectedTime || '—';
    if (summaryPlayers) summaryPlayers.textContent = selectedPlayers() ? selectedPlayers() + ' ' + window.QR.plural(selectedPlayers(), ['игрок', 'игрока', 'игроков']) : '—';

    const total = currentTotal();
    if (summaryTotal) {
      if (!title) {
        summaryTotal.textContent = '—';
      } else if (total === null) {
        summaryTotal.textContent = 'По запросу';
      } else {
        summaryTotal.textContent = formatPrice(total);
      }
    }

    if (submitButton) {
      submitButton.disabled = !questId() || !selectedTime;
    }

    if (quest && selectedPlayers() > 4) {
      if (summaryTotal) summaryTotal.title = 'Включена доплата за игроков сверх четырёх: 300 ₽ за каждого';
    }
  };

  const showError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = !message;
  };

  // Начальные значения
  fillQuestOptions();
  const requestedQuest = new URLSearchParams(window.location.search).get('quest');
  if (requestedQuest && (quests[requestedQuest] || requestedQuest === 'custom')) {
    questSelect.value = requestedQuest;
  }

  dateInput.min = todayISO();
  dateInput.value = todayISO();

  if (profile) {
    nameInput.value = profile.name;
    phoneInput.value = profile.phone.replace(/^\+?7\s*/, '');
  }

  fillPlayers();
  renderSlots();
  updateSummary();

  questSelect.addEventListener('change', () => {
    fillPlayers();
    renderSlots();
    updateSummary();
  });

  questCustom.addEventListener('input', updateSummary);
  dateInput.addEventListener('change', () => {
    renderSlots();
    updateSummary();
  });

  playersSelect.addEventListener('change', () => {
    if (playersSelect.value !== 'other') playersCustom.value = '';
    updateSummary();
  });
  playersCustom.addEventListener('input', updateSummary);

  slotsBox.addEventListener('click', (event) => {
    const button = event.target.closest('.slot-btn');
    if (!button || button.disabled) return;
    slotsBox.querySelectorAll('.slot-btn').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    selectedTime = button.dataset.time;
    updateSummary();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.classList.add('was-validated');
    showError('');

    if (!questId()) {
      showError('Выберите квест.');
      return;
    }

    if (isCustomQuest() && !questCustom.value.trim()) {
      showError('Укажите название своего квеста.');
      return;
    }

    if (!dateInput.value) {
      showError('Выберите дату.');
      return;
    }

    if (!selectedTime) {
      showError('Выберите свободное время.');
      return;
    }

    if (playersSelect.value === 'other' && (!selectedPlayers() || selectedPlayers() > 30)) {
      showError('Укажите количество игроков от 1 до 30.');
      return;
    }

    if (!form.checkValidity()) {
      showError('Проверьте обязательные поля формы.');
      return;
    }

    const quest = currentQuest();
    const total = currentTotal();
    const booking = window.QRStore.addBooking({
      questId: questId(),
      questTitle: currentTitle(),
      questImage: quest ? quest.image : 'images/quest-logo-big.jpg',
      date: dateInput.value,
      time: selectedTime,
      players: selectedPlayers(),
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      comment: commentInput.value.trim(),
      total: total || 0,
    });

    if (modalCode) modalCode.textContent = booking.code;
    if (modalTotal) {
      modalTotal.textContent = booking.total ? formatPrice(booking.total) : 'Стоимость уточнит менеджер';
    }
    if (modalDetails) {
      modalDetails.textContent = booking.questTitle + ' · ' + formatDate(booking.date) + ' · ' + booking.time + ' · ' + booking.players + ' ' + window.QR.plural(booking.players, ['игрок', 'игрока', 'игроков']);
    }

    if (modalElement && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }

    form.reset();
    form.classList.remove('was-validated');
    dateInput.value = todayISO();
    questSelect.value = '';
    if (profile) {
      nameInput.value = profile.name;
      phoneInput.value = profile.phone.replace(/^\+?7\s*/, '');
    }
    fillPlayers();
    renderSlots();
    updateSummary();
    showError('');
  });

  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      updateSummary();
    });
  }

  // Обновляем подпись цены при вводе количества
  const note = document.getElementById('booking-price-note');
  if (note) {
    note.textContent = 'Цена за команду. За игроков сверх четырёх — +300 ₽ за каждого.';
  }

  // Проверка согласия и обязательных полей до отправки
  [nameInput, phoneInput, emailInput, agreeInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', () => {
      if (form.classList.contains('was-validated') && form.checkValidity()) {
        showError('');
      }
    });
  });
});
