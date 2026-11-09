const quests = {
  lab: {
    title: 'Побег из лаборатории',
    description: 'Учёный исчез, лаборатория закрыта. У вас 60 минут, чтобы найти выход и разгадать тайну.',
    price: '2500 руб.',
    image: 'images/quest-lab.jpg',
    badge: 'Новинка',
    badgeClass: 'bg-success',
    warning: 'Квест содержит элементы хоррора и резкие звуки. Не рекомендуется детям до 14 лет и людям с повышенной чувствительностью.',
    characteristics: [
      ['Сложность', 'Средняя'],
      ['Возраст', '14+'],
      ['Игроков', '2–4 человека'],
      ['Длительность', '60 минут'],
      ['Цена', '2500 руб. за команду'],
    ],
  },
  mansion: {
    title: 'Тайна старого особняка',
    description: 'Детектив в доме XIX века. Найдите убийцу до полуночи, пока он не скрылся.',
    price: '3000 руб.',
    image: 'images/quest-mansion.jpg',
    badge: 'Хит',
    badgeClass: 'bg-warning text-dark',
    warning: 'Квест содержит сцены насилия и элементы детективного расследования. Рекомендуется для участников от 16 лет.',
    characteristics: [
      ['Сложность', 'Средняя'],
      ['Возраст', '16+'],
      ['Игроков', '4–6 человек'],
      ['Длительность', '70 минут'],
      ['Цена', '3000 руб. за команду'],
    ],
  },
  cosmo: {
    title: 'Космический рейс',
    description: 'Корабль сбился с курса. Вернитесь на Землю, пока не кончился кислород.',
    price: '2800 руб.',
    image: 'images/quest-cosmo.jpg',
    badge: 'Скидка',
    badgeClass: 'bg-danger',
    warning: null,
    characteristics: [
      ['Сложность', 'Сложная'],
      ['Возраст', '12+'],
      ['Игроков', '2–5 человек'],
      ['Длительность', '60 минут'],
      ['Цена', '2800 руб. за команду'],
    ],
  },
  camp: {
    title: 'Заброшенный лагерь',
    description: 'Хоррор. Ночь в лесу, странные звуки, пропавшие дети. Сможете ли вы выбраться?',
    price: '3200 руб.',
    image: 'images/quest-camp.jpg',
    badge: '',
    badgeClass: '',
    warning: 'Квест содержит элементы хоррора, резкие звуки и пугающие сцены. Не рекомендуется детям до 18 лет.',
    characteristics: [
      ['Сложность', 'Сложная'],
      ['Возраст', '18+'],
      ['Игроков', '3–6 человек'],
      ['Длительность', '80 минут'],
      ['Цена', '3200 руб. за команду'],
    ],
  },
  bank: {
    title: 'Ограбление банка',
    description: 'Экшн. Проберитесь в хранилище и выйдите до приезда полиции.',
    price: '2600 руб.',
    image: 'images/quest-bank.jpg',
    badge: '',
    badgeClass: '',
    warning: 'Квест содержит сцены погони и имитацию оружия. Рекомендуется для участников от 16 лет.',
    characteristics: [
      ['Сложность', 'Средняя'],
      ['Возраст', '16+'],
      ['Игроков', '2–4 человека'],
      ['Длительность', '60 минут'],
      ['Цена', '2600 руб. за команду'],
    ],
  },
  island: {
    title: 'Пиратский остров',
    description: 'Приключение для детей и взрослых. Найдите сокровища и вернитесь домой.',
    price: '2400 руб.',
    image: 'images/quest-island.jpg',
    badge: '',
    badgeClass: '',
    warning: null,
    characteristics: [
      ['Сложность', 'Лёгкая'],
      ['Возраст', '6+'],
      ['Игроков', '2–6 человек'],
      ['Длительность', '60 минут'],
      ['Цена', '2400 руб. за команду'],
    ],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const questId = params.get('id') || 'lab';
  const quest = quests[questId];

  if (!quest) {
    return;
  }

  document.getElementById('quest-title').textContent = quest.title;
  document.getElementById('quest-description').textContent = quest.description;
  document.getElementById('quest-price').textContent = quest.price;
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

  const tbody = document.getElementById('quest-characteristics');
  if (tbody) {
    tbody.innerHTML = '';
    quest.characteristics.forEach(([key, value]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<th>${key}</th><td>${value}</td>`;
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
});