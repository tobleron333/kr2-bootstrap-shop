document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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