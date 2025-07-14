// Функция создания карточки
export function createCard(cardElement, deleteCardFunction, likeCardFunction, imageOpenFunction, myUserID) {
  const cardTemplate = document.querySelector('#card-template').content;
  // клонируем содержимое тега template и наполняем данными
  const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
  newCardElement.querySelector('.card__image').src = cardElement.link;
  newCardElement.querySelector('.card__image').alt = cardElement.name;
  newCardElement.querySelector('.card__title').textContent = cardElement.name;
  const deleteButton = newCardElement.querySelector('.card__delete-button');

  if(cardElement.owner._id != myUserID) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', function() {
      const cardToDelete = deleteButton.closest('.card');
      const cardToDeleteID = cardElement._id;
      deleteCardFunction(cardToDelete, cardToDeleteID);
    });
  };

  const likeButton = newCardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeCardFunction);

  const cardImage = newCardElement.querySelector('.card__image');
  cardImage.addEventListener('click', imageOpenFunction);

  return newCardElement;
};

// Обработчик лайка карточки
export function handleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
};