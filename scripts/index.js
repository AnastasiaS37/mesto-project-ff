function createCard(cardElement, deleteCardFunction) {
  const cardTemplate = document.querySelector('#card-template').content;
  // клонируем содержимое тега template и наполняем данными
  const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
  newCardElement.querySelector('.card__image').src = cardElement.link;
  newCardElement.querySelector('.card__title').textContent = cardElement.name;

  const deleteButton = newCardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function (evt) {
    const cardToDelete = deleteButton.closest('.card');
    deleteCardFunction(cardToDelete);
  });

  return newCardElement;
}

function deleteCard(cardToDelete) {
  cardToDelete.remove();
  return;
};

const places = document.querySelector('.places__list');
initialCards.forEach(function (item) {
  const cardToAdd = createCard(item, deleteCard);
  places.append(cardToAdd);
});