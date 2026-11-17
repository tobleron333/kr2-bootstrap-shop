/* Локальное хранилище: профиль, брони и отзывы в localStorage. */
(function () {
  'use strict';

  const KEYS = {
    profile: 'qr_profile',
    bookings: 'qr_bookings',
    reviews: 'qr_reviews',
  };

  const seedReviews = [
    {
      id: 'seed-lab-1', questId: 'lab', name: 'Ирина', rating: 5, verified: true,
      date: '2026-10-18', createdAt: '2026-10-18T12:00:00',
      text: 'Были с подругой первый раз. Атмосфера лаборатории — отдельный восторг: свет, звуки, детали. Ведущий подсказывал ровно там, где мы застревали, но не выдавал ответы сразу.',
    },
    {
      id: 'seed-lab-2', questId: 'lab', name: 'Максим', rating: 4, verified: true,
      date: '2026-09-30', createdAt: '2026-09-30T18:30:00',
      text: 'Страшно ровно настолько, чтобы было интересно. Пара загадок показалась слишком простой, но финал всё компенсировал. Командой из четырёх человек уложились за 52 минуты.',
    },
    {
      id: 'seed-mansion-1', questId: 'mansion', name: 'Ольга', rating: 5, verified: true,
      date: '2026-10-05', createdAt: '2026-10-05T20:10:00',
      text: 'Настоящий детектив: улики, допросы, старый особняк. Мы спорили всей командой, кто убийца, и в итоге ошиблись — было обидно и очень круто. Обязательно придём на другой сценарий.',
    },
    {
      id: 'seed-mansion-2', questId: 'mansion', name: 'Артём', rating: 5, verified: true,
      date: '2026-08-22', createdAt: '2026-08-22T16:00:00',
      text: 'Декорации уровня кино. Отдельное спасибо актёру, который держал образ всю игру и ни разу не вышел из роли. Для тех, кто любит логику и атмосферу, — идеально.',
    },
    {
      id: 'seed-cosmo-1', questId: 'cosmo', name: 'Дмитрий', rating: 4, verified: true,
      date: '2026-09-14', createdAt: '2026-09-14T15:20:00',
      text: 'Космос сделан красиво, кислородный таймер реально подгоняет. Одна головоломка с панелью управления заставила понервничать. Хотелось бы чуть больше подсказок в самом начале.',
    },
    {
      id: 'seed-cosmo-2', questId: 'cosmo', name: 'Алина', rating: 5, verified: true,
      date: '2026-07-19', createdAt: '2026-07-19T19:40:00',
      text: 'Были вдвоём, справились за 58 минут. Очень понравилось, что загадки связаны с сюжетом, а не просто набор замков. Финальный выход — отдельный спектакль.',
    },
    {
      id: 'seed-camp-1', questId: 'camp', name: 'Сергей', rating: 5, verified: true,
      date: '2026-10-11', createdAt: '2026-10-11T22:00:00',
      text: 'Хоррор, после которого хочется проверить, закрыта ли дверь. Звук и свет работают на все сто. Шли впятером, визжали все. Если боитесь темноты — берите друга за руку.',
    },
    {
      id: 'seed-camp-2', questId: 'camp', name: 'Настя', rating: 4, verified: true,
      date: '2026-08-30', createdAt: '2026-08-30T21:15:00',
      text: 'Очень атмосферно и местами действительно жутко. Понравилось, что можно влиять на ход игры. Минус — в одном месте было слишком темно, чтобы разглядеть подсказку.',
    },
    {
      id: 'seed-bank-1', questId: 'bank', name: 'Павел', rating: 5, verified: true,
      date: '2026-09-06', createdAt: '2026-09-06T17:30:00',
      text: 'Динамично, азартно, с настоящим таймером полиции. Чувствуешь себя героем ограбления. Командой из трёх человек успели за минуту до «приезда» — эмоции зашкаливали.',
    },
    {
      id: 'seed-bank-2', questId: 'bank', name: 'Егор', rating: 4, verified: true,
      date: '2026-06-28', createdAt: '2026-06-28T14:10:00',
      text: 'Хороший экшн без провисаний. Загадок меньше, чем в детективах, но темп не даёт скучать. Подойдёт для компании, которая хочет просто повеселиться.',
    },
    {
      id: 'seed-island-1', questId: 'island', name: 'Мария', rating: 5, verified: true,
      date: '2026-10-01', createdAt: '2026-10-01T13:00:00',
      text: 'Были с детьми 8 и 11 лет. Дети в восторге, ведущий мягко направлял и не давал взрослым всё решить за них. Отличный вариант для семейного выходного.',
    },
    {
      id: 'seed-island-2', questId: 'island', name: 'Кирилл', rating: 4, verified: true,
      date: '2026-07-12', createdAt: '2026-07-12T12:20:00',
      text: 'Лёгкий и добрый квест. Взрослым может показаться простоватым, но с детьми — то, что нужно. Красивые декорации и понятные загадки.',
    },
    {
      id: 'seed-pharaoh-1', questId: 'pharaoh', name: 'Виктория', rating: 5, verified: true,
      date: '2026-09-21', createdAt: '2026-09-21T18:00:00',
      text: 'Гробница, ловушки, мистика — всё как мы любим. Несколько раз реально вздрогнули. Загадки логичные, но требуют командной работы. Вшестером было идеально.',
    },
    {
      id: 'seed-pharaoh-2', questId: 'pharaoh', name: 'Роман', rating: 4, verified: true,
      date: '2026-08-08', createdAt: '2026-08-08T20:30:00',
      text: 'Атмосферно и красиво. Чуть не хватило времени на финальную часть, но ведущий дал небольшую подсказку. Хочется вернуться и пройти на скорость.',
    },
    {
      id: 'seed-zombie-1', questId: 'zombie', name: 'Алексей', rating: 5, verified: true,
      date: '2026-10-14', createdAt: '2026-10-14T23:00:00',
      text: 'Настоящий зомби-фильм, только ты внутри. Бегали, прятались, кричали. После квеста ещё минут десять обсуждали, кто где струсил. Лучший хоррор из тех, где мы были.',
    },
    {
      id: 'seed-zombie-2', questId: 'zombie', name: 'Дарья', rating: 4, verified: true,
      date: '2026-06-15', createdAt: '2026-06-15T19:15:00',
      text: 'Очень драйвово, но физически непросто: придётся много двигаться. Если идёте в компании, где кто-то не любит резкие звуки, лучше предупредить ведущего заранее.',
    },
    {
      id: 'seed-sherlock-1', questId: 'sherlock', name: 'Елена', rating: 5, verified: true,
      date: '2026-09-27', createdAt: '2026-09-27T17:00:00',
      text: 'Лондон, газеты, дела, улики — полное погружение. Понравилось, что можно строить разные версии и проверять их. Мы раскрыли дело за 61 минуту и очень собой гордились.',
    },
    {
      id: 'seed-sherlock-2', questId: 'sherlock', name: 'Илья', rating: 5, verified: true,
      date: '2026-07-03', createdAt: '2026-07-03T15:45:00',
      text: 'Один из самых сбалансированных квестов: и подумать, и поговорить, и удивиться. Детали интерьера можно рассматривать бесконечно. Рекомендую для пар и небольших компаний.',
    },
  ];

  const read = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  };

  const normalizePhone = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length > 10 ? digits.slice(-10) : digits;
  };

  const getProfile = () => {
    const profile = read(KEYS.profile, null);
    if (!profile || !profile.phone) return null;
    return profile;
  };

  const saveProfile = (profile) => {
    const normalized = {
      name: String(profile.name || '').trim(),
      phone: String(profile.phone || '').trim(),
      createdAt: new Date().toISOString(),
    };
    write(KEYS.profile, normalized);
    return normalized;
  };

  const clearProfile = () => {
    try {
      window.localStorage.removeItem(KEYS.profile);
    } catch (error) {
      // localStorage может быть недоступен
    }
  };

  const getBookings = () => read(KEYS.bookings, []);

  const getMyBookings = () => {
    const profile = getProfile();
    if (!profile) return [];
    const phone = normalizePhone(profile.phone);
    return getBookings()
      .filter((booking) => normalizePhone(booking.phone) === phone)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  };

  const addBooking = (booking) => {
    const bookings = getBookings();
    let code = 'QR-' + Math.floor(100000 + Math.random() * 900000);

    while (bookings.some((item) => item.code === code)) {
      code = 'QR-' + Math.floor(100000 + Math.random() * 900000);
    }

    const saved = Object.assign({}, booking, {
      id: 'booking-' + Date.now(),
      code,
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    bookings.push(saved);
    write(KEYS.bookings, bookings);
    return saved;
  };

  const cancelBooking = (id) => {
    const bookings = getBookings().map((booking) =>
      booking.id === id ? Object.assign({}, booking, { status: 'cancelled' }) : booking
    );
    write(KEYS.bookings, bookings);
    return getBookings();
  };

  const getReviews = (questId) => {
    const custom = read(KEYS.reviews, []);
    return seedReviews
      .concat(custom)
      .filter((review) => review.questId === questId)
      .sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
  };

  const addReview = (review) => {
    const custom = read(KEYS.reviews, []);
    const saved = Object.assign({}, review, {
      id: 'review-' + Date.now(),
      date: window.QR.todayISO(),
      createdAt: new Date().toISOString(),
    });
    custom.push(saved);
    write(KEYS.reviews, custom);
    return saved;
  };

  const getRatingStats = (questId) => {
    const reviews = getReviews(questId);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((review) => {
      const rating = Math.max(1, Math.min(5, Number(review.rating) || 0));
      distribution[rating] += 1;
      sum += rating;
    });

    return {
      count: reviews.length,
      average: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0,
      distribution,
    };
  };

  const hasBookedQuest = (questId) => {
    const profile = getProfile();
    if (!profile) return false;
    const phone = normalizePhone(profile.phone);
    return getBookings().some((booking) =>
      booking.questId === questId &&
      booking.status !== 'cancelled' &&
      normalizePhone(booking.phone) === phone
    );
  };

  const getBookingEnd = (booking) => {
    const quest = window.QR && window.QR.quests ? window.QR.quests[booking.questId] : null;
    const duration = quest ? quest.duration : 90;
    const start = new Date(String(booking.date) + 'T' + String(booking.time || '00:00') + ':00');
    return new Date(start.getTime() + duration * 60 * 1000);
  };

  const isBookingDone = (booking) => {
    if (!booking || booking.status === 'cancelled') return false;
    const end = getBookingEnd(booking);
    return !Number.isNaN(end.getTime()) && end.getTime() <= Date.now();
  };

  const hasCompletedQuest = (questId) => {
    const profile = getProfile();
    if (!profile) return false;
    const phone = normalizePhone(profile.phone);
    return getBookings().some((booking) =>
      booking.questId === questId &&
      isBookingDone(booking) &&
      normalizePhone(booking.phone) === phone
    );
  };

  const getBonuses = () => {
    const total = getMyBookings()
      .filter((booking) => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + (Number(booking.total) || 0), 0);
    return Math.round(total * 0.05);
  };

  window.QRStore = {
    getProfile,
    saveProfile,
    clearProfile,
    getBookings,
    getMyBookings,
    addBooking,
    cancelBooking,
    getReviews,
    addReview,
    getRatingStats,
    hasBookedQuest,
    hasCompletedQuest,
    isBookingDone,
    getBookingEnd,
    getBonuses,
    normalizePhone,
  };
})();
