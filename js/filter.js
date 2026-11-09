document.addEventListener('DOMContentLoaded', () => {
  const genreSelect = document.getElementById('filter-genre');
  const difficultySelect = document.getElementById('filter-difficulty');
  const playersSelect = document.getElementById('filter-players');
  const priceMinInput = document.getElementById('filter-price-min');
  const priceMaxInput = document.getElementById('filter-price-max');
  const resetButton = document.getElementById('filter-reset');

  const cardsContainer = document.querySelector('.col-12.col-lg-9 .row.g-4');
  const cards = cardsContainer ? cardsContainer.querySelectorAll('[data-genre]') : [];

  if (!genreSelect || !difficultySelect || !playersSelect || !priceMinInput || !priceMaxInput || !cards.length) {
    return;
  }

  function filterCards() {
    const genre = genreSelect.value;
    const difficulty = difficultySelect.value;
    const players = playersSelect.value;
    const priceMin = priceMinInput.value === '' ? 0 : Number(priceMinInput.value);
    const priceMax = priceMaxInput.value === '' ? Infinity : Number(priceMaxInput.value);

    cards.forEach((card) => {
      const cardGenre = card.dataset.genre;
      const cardDifficulty = card.dataset.difficulty;
      const cardPlayers = card.dataset.players;
      const cardPrice = Number(card.dataset.price);

      const matchGenre = genre === 'all' || genre === cardGenre;
      const matchDifficulty = difficulty === 'all' || difficulty === cardDifficulty;
      const matchPlayers = players === 'all' || players === cardPlayers;
      const matchPrice = cardPrice >= priceMin && cardPrice <= priceMax;

      card.style.display = matchGenre && matchDifficulty && matchPlayers && matchPrice ? '' : 'none';
    });
  }

  genreSelect.addEventListener('change', filterCards);
  difficultySelect.addEventListener('change', filterCards);
  playersSelect.addEventListener('change', filterCards);
  priceMinInput.addEventListener('input', filterCards);
  priceMaxInput.addEventListener('input', filterCards);

  resetButton.addEventListener('click', () => {
    genreSelect.value = 'all';
    difficultySelect.value = 'all';
    playersSelect.value = 'all';
    priceMinInput.value = 0;
    priceMaxInput.value = 4000;
    filterCards();
  });
});