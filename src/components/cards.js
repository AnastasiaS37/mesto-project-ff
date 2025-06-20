export const initialCards = [
    {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
    },
    {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
    },
    {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
    },
    {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
    }
];

// Функция создания карточки
export function createCard(cardElement, deleteCardFunction, likeCardFunction, imageOpenFunction) {
  const cardTemplate = document.querySelector('#card-template').content;
  // клонируем содержимое тега template и наполняем данными
  const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
  newCardElement.querySelector('.card__image').src = cardElement.link;
  newCardElement.querySelector('.card__image').alt = cardElement.name;
  newCardElement.querySelector('.card__title').textContent = cardElement.name;

  const deleteButton = newCardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function (evt) {
    const cardToDelete = deleteButton.closest('.card');
    deleteCardFunction(cardToDelete);
  });

  const likeButton = newCardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeCardFunction);

  const cardImage = newCardElement.querySelector('.card__image');
  cardImage.addEventListener('click', imageOpenFunction);

  return newCardElement;
};

// Обработчик удаления карточки
export function deleteCard(cardToDelete) {
  cardToDelete.remove();
  return;
};

// Обработчик лайка карточки
export function handleLike(evt) {
  if (! evt.target.classList.contains('card__like-button_is-active')) {
    evt.target.classList.add('card__like-button_is-active');
  } else {
    evt.target.classList.remove('card__like-button_is-active');
  };
};