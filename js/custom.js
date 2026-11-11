// Принудительный автозапуск карусели в hero-блоке
const heroCarouselElement = document.getElementById('heroCarousel');

if (heroCarouselElement && window.bootstrap && bootstrap.Carousel) {
  const heroCarousel = bootstrap.Carousel.getOrCreateInstance(heroCarouselElement, {
    interval: 4000,
    pause: false,
    ride: 'carousel',
  });

  heroCarousel.cycle();
}

document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  const toggleBackToTop = () => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
  };

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Ручной ввод для полей «Квест» и «Количество игроков»
document.querySelectorAll('select[data-custom-target]').forEach((select) => {
  const target = document.querySelector(select.dataset.customTarget);
  if (!target) return;

  const customValue = select.dataset.customValue || 'other';
  const form = select.closest('form');

  const syncCustomField = () => {
    const isCustom = select.value === customValue;
    target.classList.toggle('d-none', !isCustom);
    target.disabled = !isCustom;
    target.required = isCustom;
    if (!isCustom) target.value = '';
  };

  select.addEventListener('change', syncCustomField);

  if (form) {
    form.addEventListener('reset', () => {
      window.setTimeout(syncCustomField, 0);
    });
  }

  syncCustomField();
});

const orderForm = document.getElementById('order-form');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
      orderForm.classList.add('was-validated');
      return;
    }

    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-3';
    successAlert.setAttribute('role', 'alert');
    successAlert.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами.';

    const oldAlert = document.querySelector('.alert-success');
    if (oldAlert) oldAlert.remove();

    orderForm.after(successAlert);
    orderForm.reset();
    orderForm.classList.remove('was-validated');
  });
}

// Валидация формы в модалке
const modalOrderForm = document.getElementById('modal-order-form');

if (modalOrderForm) {
  modalOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!modalOrderForm.checkValidity()) {
      modalOrderForm.classList.add('was-validated');
      return;
    }

    // Закрыть модалку
    const modalElement = document.getElementById('orderModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Показать сообщение об успехе на странице
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-3';
    successAlert.setAttribute('role', 'alert');
    successAlert.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами.';

    const oldAlert = document.querySelector('.alert-success');
    if (oldAlert) oldAlert.remove();

    const main = document.querySelector('main');
    if (main) main.prepend(successAlert);

    modalOrderForm.reset();
    modalOrderForm.classList.remove('was-validated');
  });
}