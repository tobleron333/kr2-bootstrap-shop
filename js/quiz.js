/* Подбор квеста: четыре вопроса и рекомендация. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('quizRoot');
  if (!root || !window.QR || !window.QRStore) return;

  const { quests, questOrder, formatPrice } = window.QR;
  const answers = {};
  let stepIndex = 0;
  let finished = false;

  const audienceLabels = {
    couple: 'для пары',
    friends: 'для компании друзей',
    kids: 'для детей',
    corporate: 'для корпоратива',
  };

  const questions = [
    {
      key: 'audience',
      title: 'С кем идёте?',
      lead: 'Подберём квест под ваш состав — от свидания до корпоратива.',
      options: [
        { value: 'couple', label: 'Парой', desc: 'Свидание или небольшой дуэт' },
        { value: 'friends', label: 'С друзьями', desc: 'Компания на выходные' },
        { value: 'kids', label: 'С детьми', desc: 'Семейное приключение' },
        { value: 'corporate', label: 'Корпоратив', desc: 'Команда коллег' },
      ],
    },
    {
      key: 'genre',
      title: 'Какой жанр ближе?',
      lead: 'Хоррор щекочет нервы, детектив заставляет думать, фантастика уносит в другой мир.',
      options: [
        { value: 'horror', label: 'Хоррор', desc: 'Страшно и атмосферно' },
        { value: 'detective', label: 'Детектив', desc: 'Улики и логика' },
        { value: 'fantasy', label: 'Фантастика', desc: 'Космос и другие миры' },
        { value: 'action', label: 'Экшн', desc: 'Погони и адреналин' },
        { value: 'adventure', label: 'Приключение', desc: 'Сокровища и путешествия' },
        { value: 'any', label: 'Любой', desc: 'Главное — интересно' },
      ],
    },
    {
      key: 'difficulty',
      title: 'Насколько сложно?',
      lead: 'Можно взять лёгкий квест для первого раза или испытать себя на сложном.',
      options: [
        { value: 'easy', label: 'Попроще', desc: 'Для первого знакомства' },
        { value: 'medium', label: 'Средне', desc: 'Баланс загадок и темпа' },
        { value: 'hard', label: 'Посложнее', desc: 'Хотим challenge' },
        { value: 'any', label: 'Не важно', desc: 'Доверимся рекомендации' },
      ],
    },
    {
      key: 'duration',
      title: 'Сколько времени есть?',
      lead: 'Длительность квестов — от 60 до 80 минут.',
      options: [
        { value: '60', label: 'До 60 минут', desc: 'Короткое приключение' },
        { value: '70', label: 'До 70 минут', desc: 'Чуть больше времени' },
        { value: '80', label: 'До 80 минут', desc: 'Готовы на всё' },
        { value: 'any', label: 'Не важно', desc: 'Выберем по другим параметрам' },
      ],
    },
  ];

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating) || 0);
    let html = '<span class="rating-stars" aria-hidden="true">';
    for (let index = 1; index <= 5; index += 1) {
      html += '<span class="rating-star' + (index <= rounded ? ' is-filled' : '') + '">★</span>';
    }
    return html + '</span>';
  };

  const progress = () => {
    if (finished) return 100;
    return Math.round(((stepIndex + 1) / questions.length) * 100);
  };

  const renderProgress = () => {
    return (
      '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress() + '">' +
        '<div class="progress-bar" style="width:' + progress() + '%"></div>' +
      '</div>'
    );
  };

  const renderQuestion = () => {
    const question = questions[stepIndex];
    const selected = answers[question.key];
    const isLast = stepIndex === questions.length - 1;

    const options = question.options.map((option) =>
      '<button type="button" class="quiz-option' + (selected === option.value ? ' is-selected' : '') + '" data-quiz-value="' + option.value + '">' +
        '<strong>' + option.label + '</strong>' +
        '<span>' + option.desc + '</span>' +
      '</button>'
    ).join('');

    root.innerHTML =
      renderProgress() +
      '<div class="quiz-step">' +
        '<span class="quiz-step__eyebrow">Вопрос ' + (stepIndex + 1) + ' из ' + questions.length + '</span>' +
        '<h2>' + question.title + '</h2>' +
        '<p class="quiz-step__lead">' + question.lead + '</p>' +
        '<div class="quiz-options">' + options + '</div>' +
        '<div class="quiz-actions">' +
          '<button type="button" class="btn btn-outline-secondary" data-quiz-back' + (stepIndex === 0 ? ' disabled' : '') + '>Назад</button>' +
          '<button type="button" class="btn btn-primary" data-quiz-next' + (selected ? '' : ' disabled') + '>' +
            (isLast ? 'Показать результат' : 'Далее') +
          '</button>' +
        '</div>' +
      '</div>';
  };

  const scoreQuests = () => {
    const result = questOrder.map((id) => {
      const quest = quests[id];
      const rating = window.QRStore.getRatingStats(id);
      let score = rating.average * 0.2;
      const reasons = [];

      if (quest.audience.includes(answers.audience)) {
        score += 4;
        reasons.push('Подходит ' + audienceLabels[answers.audience]);
      } else {
        score -= 3;
      }

      if (answers.genre === 'any') {
        score += 1;
      } else if (quest.genre === answers.genre) {
        score += 3;
        reasons.push('Жанр «' + quest.genreLabel + '»');
      }

      if (answers.difficulty === 'any') {
        score += 0.5;
      } else if (quest.difficulty === answers.difficulty) {
        score += 2;
        reasons.push('Сложность «' + quest.difficultyLabel + '»');
      }

      if (answers.duration === 'any') {
        score += 0.5;
      } else if (quest.duration <= Number(answers.duration)) {
        score += 1;
        reasons.push('Укладывается в ' + quest.duration + ' минут');
      }

      return { id, quest, rating, score, reasons };
    });

    return result.sort((a, b) => b.score - a.score || b.rating.average - a.rating.average);
  };

  const renderResult = () => {
    finished = true;
    const ranked = scoreQuests();
    const main = ranked[0];
    const alternatives = ranked.slice(1, 3);
    const quest = main.quest;
    const reasons = main.reasons.length ? main.reasons : ['Сбалансированный вариант для первого знакомства'];

    const altHtml = alternatives.map((item) =>
      '<a class="quiz-alt-card" href="product.html?id=' + item.id + '">' +
        '<img src="' + item.quest.image + '" alt="">' +
        '<span><strong>' + item.quest.title + '</strong>' +
        '<span>' + item.quest.genreLabel + ' · ' + formatPrice(item.quest.price) + '</span></span>' +
      '</a>'
    ).join('');

    root.innerHTML =
      renderProgress() +
      '<div class="quiz-result">' +
        '<span class="quiz-step__eyebrow">Ваш квест</span>' +
        '<div class="quiz-result__grid">' +
          '<div class="quiz-result__media"><img src="' + quest.image + '" alt="' + quest.title + '"></div>' +
          '<div class="quiz-result__body">' +
            '<h2>' + quest.title + '</h2>' +
            '<div class="d-flex flex-wrap align-items-center gap-2 mb-2">' +
              renderStars(main.rating.average) +
              '<span class="rating-count mt-0">' + (main.rating.average ? String(main.rating.average).replace('.', ',') : '—') +
              ' · ' + main.rating.count + ' ' + window.QR.plural(main.rating.count, ['отзыв', 'отзыва', 'отзывов']) + '</span>' +
            '</div>' +
            '<p class="text-muted">' + quest.genreLabel + ' · ' + quest.duration + ' минут · ' +
              quest.minPlayers + '–' + quest.maxPlayers + ' игроков · ' + formatPrice(quest.price) + '</p>' +
            '<ul class="quiz-reasons">' + reasons.map((reason) => '<li>' + reason + '</li>').join('') + '</ul>' +
            '<div class="d-flex flex-wrap gap-2">' +
              '<a class="btn btn-primary" href="order.html?quest=' + main.id + '">Забронировать</a>' +
              '<a class="btn btn-outline-primary" href="product.html?id=' + main.id + '">Подробнее о квесте</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="quiz-alternatives">' +
          '<span class="quiz-step__eyebrow mb-0">Ещё варианты</span>' + altHtml +
        '</div>' +
        '<div class="quiz-actions">' +
          '<button type="button" class="btn btn-outline-secondary" data-quiz-restart>Пройти заново</button>' +
        '</div>' +
      '</div>';
  };

  root.addEventListener('click', (event) => {
    const option = event.target.closest('[data-quiz-value]');
    if (option) {
      answers[questions[stepIndex].key] = option.dataset.quizValue;
      renderQuestion();
      return;
    }

    if (event.target.closest('[data-quiz-next]')) {
      if (!answers[questions[stepIndex].key]) return;
      if (stepIndex === questions.length - 1) {
        renderResult();
      } else {
        stepIndex += 1;
        renderQuestion();
      }
      return;
    }

    if (event.target.closest('[data-quiz-back]')) {
      if (stepIndex > 0) {
        stepIndex -= 1;
        renderQuestion();
      }
      return;
    }

    if (event.target.closest('[data-quiz-restart]')) {
      finished = false;
      stepIndex = 0;
      Object.keys(answers).forEach((key) => delete answers[key]);
      renderQuestion();
    }
  });

  renderQuestion();
});
