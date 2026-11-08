# QuestRoom - учебный сайт квест-комнат

## Контрольная работа №2

Тема: «CSS-фреймворки: разработка интерфейса на Bootstrap или альтернативном CSS-фреймворке».

## Описание

QuestRoom - учебный сайт квест-комнат. Пользователь выбирает квест из каталога, смотрит подробное описание и оставляет заявку на прохождение.

## Ссылка на сайт

GitHub Pages: https://<твой-логин>.github.io/kr2-bootstrap-shop/

## Используемый фреймворк

Bootstrap 5.3.3.

## Способ подключения

Bootstrap подключён через CDN (jsdelivr):

- CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
- JS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`

## Структура проекта

- kr2-bootstrap-shop/
- index.html
- catalog.html
- product.html
- order.html
- css/
- custom.css
- images/
- README.md
- .gitignore

## Реализованные страницы

### Главная (`index.html`)

- Bootstrap-навигация (`navbar`).
- Hero-блок на сетке.
- Блок преимуществ (3 карточки).
- Сетка популярных квестов.
- Подвал.

### Каталог (`catalog.html`)

- `alert` с подсказкой.
- 6 карточек квестов через `card`.
- Значки `badge` (Новинка, Хит, Скидка).
- Кнопки «Подробнее» и «Записаться».
- Модальное окно `modal` с быстрой заявкой.

### Квест (`product.html`)

- Хлебные крошки.
- Карточка квеста: изображение, описание, цена.
- Таблица характеристик.
- `accordion` с частыми вопросами.

### Заявка (`order.html`)

- Форма с `form-control`, `form-select`, `input-group`, `form-check`.
- Поля: имя, e-mail, телефон, квест, дата, количество игроков, комментарий, согласие.
- Кнопки «Отправить заявку» и «Очистить».

## Реализованные Bootstrap-компоненты

- `navbar`
- `card`
- `btn` / `btn-primary` / `btn-outline-primary` / `btn-secondary`
- `badge` (bg-success, bg-warning, bg-danger)
- `alert` (alert-info, alert-warning)
- `modal`
- `accordion`
- `form-control`
- `form-select`
- `input-group`
- `form-check`
- `breadcrumb`
- `table table-striped table-bordered`
- `container`, `row`, `col-*`, `g-*`

## Доработки

- Собственный `custom.css`: анимация карточек при наведении, стили заглушек изображений.
- Дополнительный компонент `accordion` на странице квеста (частые вопросы).
- Хлебные крошки `breadcrumb` на странице квеста.
- Улучшенная форма заявки: `input-group` для телефона, `form-select` для квеста и количества игроков, `type="date"` для даты.
- Адаптивная сетка: 1 -> 2 -> 3 колонки на разных ширинах.
- Развёрнутый README с описанием структуры и компонентов.

## Автор

ФИО: Харчев Александр Максимович
Группа: ЭФБО-02-25