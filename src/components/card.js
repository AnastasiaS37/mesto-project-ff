// Функция создания карточки
export function createCard(cardElement, deleteCardFunction, likeCardFunction, imageOpenFunction, myUserID) {
  const cardTemplate = document.querySelector('#card-template').content;
  // клонируем содержимое тега template и наполняем данными
  const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
  newCardElement.querySelector('.card__image').src = cardElement.link;
  newCardElement.querySelector('.card__image').alt = cardElement.name;
  newCardElement.querySelector('.card__title').textContent = cardElement.name;
  const likeButton = newCardElement.querySelector('.card__like-button');
  const cardLikesNumber = newCardElement.querySelector('.card__likes');

  function renderLikes(cardElement) {
    const cardIsLiked = cardElement.likes.map((like) => like._id).includes(myUserID);
    likeButton.classList.toggle('card__like-button_is-active', cardIsLiked);
    cardLikesNumber.textContent = cardElement.likes.length;
  };
  renderLikes(cardElement);
  
  likeButton.addEventListener('click', function() {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    likeCardFunction(cardElement._id, isLiked, renderLikes);
  });

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

  const cardImage = newCardElement.querySelector('.card__image');
  cardImage.addEventListener('click', imageOpenFunction);

  return newCardElement;
};