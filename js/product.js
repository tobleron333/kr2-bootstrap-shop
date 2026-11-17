/* Страница квеста: данные из общего каталога. */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const questId = params.get('id') || 'lab';
  const quests = window.QR ? window.QR.quests : {};
  const quest = quests[questId];

  if (!quest) {
    return;
  }

  document.getElementById('quest-title').textContent = quest.title;
  document.getElementById('quest-description').textContent = quest.description;
  document.getElementById('quest-price').textContent = window.QR.formatPrice(quest.price);
  document.getElementById('quest-image').src = quest.image;
  document.getElementById('quest-image').alt = quest.title;
  document.title = quest.title + ' — QuestRoom';

  const breadcrumbCurrent = document.querySelector('.breadcrumb-item.active');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = quest.title;

  const badge = document.getElementById('quest-badge');
  if (badge) {
    if (quest.badge) {
      badge.textContent = quest.badge;
      badge.className = 'badge ' + quest.badgeClass + ' mb-3';
    } else {
      badge.style.display = 'none';
    }
  }

  const characteristics = [
    ['Сложность', quest.difficultyLabel],
    ['Жанр', quest.genreLabel],
    ['Возраст', quest.age],
    ['Игроков', quest.minPlayers + '–' + quest.maxPlayers + ' человек'],
    ['Длительность', quest.duration + ' минут'],
    ['Цена', window.QR.formatPrice(quest.price) + ' за команду'],
  ];

  const tbody = document.getElementById('quest-characteristics');
  if (tbody) {
    tbody.innerHTML = '';
    characteristics.forEach(([key, value]) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = key;
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(th, td);
      tbody.appendChild(tr);
    });
  }

  const warningBlock = document.getElementById('quest-warning');
  if (warningBlock) {
    if (quest.warning) {
      warningBlock.textContent = quest.warning;
      warningBlock.hidden = false;
    } else {
      warningBlock.hidden = true;
    }
  }

  const bookingLinks = document.querySelectorAll('a[href="order.html"]');
  bookingLinks.forEach((link) => {
    link.href = 'order.html?quest=' + encodeURIComponent(questId);
  });
});
