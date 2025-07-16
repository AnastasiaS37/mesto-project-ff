// Функция создания карточки
function renderLikes(cardObj, likeButton, cardLikesNumber, myUserID) {
  const cardIsLiked = cardObj.likes.map((like) => like._id).includes(myUserID);
  likeButton.classList.toggle('card__like-button_is-active', cardIsLiked);
  cardLikesNumber.textContent = cardObj.likes.length;
};

export function createCard(cardObj, deleteCardFunction, likeCardFunction, imageOpenFunction, myUserID) {
  const cardTemplate = document.querySelector('#card-template').content;
  // клонируем содержимое тега template и наполняем данными
  const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = newCardElement.querySelector('.card__image');
  const likeButton = newCardElement.querySelector('.card__like-button');
  const cardLikesNumber = newCardElement.querySelector('.card__likes');

  cardImage.src = cardObj.link;
  cardImage.alt = cardObj.name;
  newCardElement.querySelector('.card__title').textContent = cardObj.name;
  
  renderLikes(cardObj, likeButton, cardLikesNumber, myUserID);
  
  likeButton.addEventListener('click', function() {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    likeCardFunction(cardObj._id, likeButton, cardLikesNumber, isLiked, renderLikes);
  });

  const deleteButton = newCardElement.querySelector('.card__delete-button');
  if(cardObj.owner._id != myUserID) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', function() {
      const cardToDelete = deleteButton.closest('.card');
      const cardToDeleteID = cardObj._id;
      deleteCardFunction(cardToDelete, cardToDeleteID);
    });
  };

  cardImage.addEventListener('click', function() {
    imageOpenFunction(cardObj.link, cardObj.name)
  });

  return newCardElement;
};