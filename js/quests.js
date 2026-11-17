/* Общие данные сайта: квесты, цены, слоты и небольшие утилиты. */
(function () {
  'use strict';

  const quests = {
    lab: {
      title: 'Побег из лаборатории',
      description: 'Учёный исчез, лаборатория закрыта. У вас 60 минут, чтобы найти выход и разгадать тайну.',
      price: 2500,
      image: 'images/quest-lab.jpg',
      badge: 'Новинка',
      badgeClass: 'bg-success',
      genre: 'horror',
      genreLabel: 'Хоррор',
      difficulty: 'medium',
      difficultyLabel: 'Средняя',
      minPlayers: 2,
      maxPlayers: 4,
      duration: 60,
      age: '14+',
      audience: ['couple', 'friends'],
      warning: 'Квест содержит элементы хоррора и резкие звуки. Не рекомендуется детям до 14 лет и людям с повышенной чувствительностью.',
    },
    mansion: {
      title: 'Тайна старого особняка',
      description: 'Детектив в доме XIX века. Найдите убийцу до полуночи, пока он не скрылся.',
      price: 3000,
      image: 'images/quest-mansion.jpg',
      badge: 'Хит',
      badgeClass: 'bg-warning text-dark',
      genre: 'detective',
      genreLabel: 'Детектив',
      difficulty: 'medium',
      difficultyLabel: 'Средняя',
      minPlayers: 4,
      maxPlayers: 6,
      duration: 70,
      age: '16+',
      audience: ['couple', 'friends', 'corporate'],
      warning: 'Квест содержит сцены насилия и элементы детективного расследования. Рекомендуется для участников от 16 лет.',
    },
    cosmo: {
      title: 'Космический рейс',
      description: 'Корабль сбился с курса. Вернитесь на Землю, пока не кончился кислород.',
      price: 2800,
      image: 'images/quest-cosmo.jpg',
      badge: 'Скидка',
      badgeClass: 'bg-danger',
      genre: 'fantasy',
      genreLabel: 'Фантастика',
      difficulty: 'hard',
      difficultyLabel: 'Сложная',
      minPlayers: 2,
      maxPlayers: 5,
      duration: 60,
      age: '12+',
      audience: ['couple', 'friends'],
      warning: null,
    },
    camp: {
      title: 'Заброшенный лагерь',
      description: 'Хоррор. Ночь в лесу, странные звуки, пропавшие дети. Сможете ли вы выбраться?',
      price: 3200,
      image: 'images/quest-camp.jpg',
      badge: '',
      badgeClass: '',
      genre: 'horror',
      genreLabel: 'Хоррор',
      difficulty: 'hard',
      difficultyLabel: 'Сложная',
      minPlayers: 3,
      maxPlayers: 6,
      duration: 80,
      age: '18+',
      audience: ['friends'],
      warning: 'Квест содержит элементы хоррора, резкие звуки и пугающие сцены. Не рекомендуется детям до 18 лет.',
    },
    bank: {
      title: 'Ограбление банка',
      description: 'Экшн. Проберитесь в хранилище и выйдите до приезда полиции.',
      price: 2600,
      image: 'images/quest-bank.jpg',
      badge: '',
      badgeClass: '',
      genre: 'action',
      genreLabel: 'Экшн',
      difficulty: 'medium',
      difficultyLabel: 'Средняя',
      minPlayers: 2,
      maxPlayers: 4,
      duration: 60,
      age: '16+',
      audience: ['friends', 'corporate'],
      warning: 'Квест содержит сцены погони и имитацию оружия. Рекомендуется для участников от 16 лет.',
    },
    island: {
      title: 'Пиратский остров',
      description: 'Приключение для детей и взрослых. Найдите сокровища и вернитесь домой.',
      price: 2400,
      image: 'images/quest-island.jpg',
      badge: '',
      badgeClass: '',
      genre: 'adventure',
      genreLabel: 'Приключение',
      difficulty: 'easy',
      difficultyLabel: 'Лёгкая',
      minPlayers: 2,
      maxPlayers: 6,
      duration: 60,
      age: '6+',
      audience: ['kids', 'couple'],
      warning: null,
    },
    pharaoh: {
      title: 'Проклятие фараона',
      description: 'Древняя гробница, ловушки и проклятие. Найдите выход, пока не проснулся страж.',
      price: 3400,
      image: 'images/quest-pharaoh.jpg',
      badge: '',
      badgeClass: '',
      genre: 'horror',
      genreLabel: 'Мистика',
      difficulty: 'hard',
      difficultyLabel: 'Сложная',
      minPlayers: 4,
      maxPlayers: 6,
      duration: 75,
      age: '16+',
      audience: ['friends', 'corporate'],
      warning: 'Квест содержит мистические сцены, резкие звуки и внезапные появления. Не рекомендуется детям до 16 лет.',
    },
    zombie: {
      title: 'Зомби-апокалипсис',
      description: 'Выживите в городе, захваченном зомби. Найдите вакцину и выберитесь до эвакуации.',
      price: 3100,
      image: 'images/quest-zombie.jpg',
      badge: '',
      badgeClass: '',
      genre: 'action',
      genreLabel: 'Экшн-хоррор',
      difficulty: 'hard',
      difficultyLabel: 'Сложная',
      minPlayers: 2,
      maxPlayers: 4,
      duration: 60,
      age: '18+',
      audience: ['friends'],
      warning: 'Квест содержит сцены насилия, имитацию оружия и пугающие сцены. Не рекомендуется детям до 18 лет.',
    },
    sherlock: {
      title: 'Шерлок: дело о пропавшем лорде',
      description: 'Лондон, 1895 год. Раскройте дело о пропавшем лорде, пока не истёк срок.',
      price: 2700,
      image: 'images/quest-sherlock.jpg',
      badge: '',
      badgeClass: '',
      genre: 'detective',
      genreLabel: 'Детектив',
      difficulty: 'medium',
      difficultyLabel: 'Средняя',
      minPlayers: 2,
      maxPlayers: 4,
      duration: 65,
      age: '16+',
      audience: ['couple', 'friends', 'corporate'],
      warning: 'Квест содержит сцены насилия и элементы детективного расследования. Рекомендуется для участников от 16 лет.',
    },
  };

  const order = ['lab', 'mansion', 'cosmo', 'camp', 'bank', 'island', 'pharaoh', 'zombie', 'sherlock'];
  const timeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30'];

  const formatPrice = (value) => Number(value).toLocaleString('ru-RU') + ' ₽';

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const formatDate = (iso) => {
    if (!iso) return '';
    const date = new Date(iso + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const plural = (number, forms) => {
    const value = Math.abs(Number(number)) % 100;
    const last = value % 10;
    if (value > 10 && value < 20) return forms[2];
    if (last > 1 && last < 5) return forms[1];
    if (last === 1) return forms[0];
    return forms[2];
  };

  const todayISO = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
  };

  window.QR = Object.assign(window.QR || {}, {
    quests,
    questOrder: order,
    timeSlots,
    formatPrice,
    escapeHtml,
    formatDate,
    plural,
    todayISO,
  });
})();
