import './pages/index.css';
import { initialCards } from './cards.js';

function createCard(cardElement, deleteCardFunction, likeCardFunction, imageOpenFunction) {
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

function deleteCard(cardToDelete) {
  cardToDelete.remove();
  return;
};

const placesList = document.querySelector('.places__list');
initialCards.forEach(function (item) {
  const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick);
  placesList.append(cardToAdd);
});

/* */
//// Открытие и закрытие модальных окон

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector('.popup_is-opened');
    closePopup(openedPopup);
    document.removeEventListener('keyup', handleEscKey);
  };
};

function openPopup(popupToOpen) {
  popupToOpen.classList.add('popup_is-opened');
  document.addEventListener('keyup', handleEscKey);
};

function closePopup(popupToClose) {
  popupToClose.classList.remove('popup_is-opened');
};

function addCloseListeners(popup) {
  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    closePopup(popup);
  });
  popup.addEventListener('mousedown', function (evt) {
    if (evt.target === evt.currentTarget) closePopup(popup);
  });
};

const profileEditButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const cardAddButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

profileEditButton.addEventListener('click', function() {
  profileName.value = document.querySelector('.profile__title').textContent;
  profileDescription.value = document.querySelector('.profile__description').textContent;
  openPopup(popupEditProfile);
  addCloseListeners(popupEditProfile);
});

cardAddButton.addEventListener('click', function() {
  addCardForm.reset();
  openPopup(popupNewCard);
  addCloseListeners(popupNewCard);
});

//// Работа с формой профиля и с формой добавления карточек
const editProfileForm = document.forms['edit-profile'];
const profileName = editProfileForm.elements.name;
const profileDescription = editProfileForm.elements.description;
const addCardForm = document.forms['new-place'];
const placeName = addCardForm.elements['place-name'];
const photoLink = addCardForm.elements.link;

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const openedPopup = document.querySelector('.popup_is-opened');
  const openedForm = openedPopup.querySelector('.popup__form');
  document.querySelector('.profile__title').textContent = profileName.value;
  document.querySelector('.profile__description').textContent = profileDescription.value;
  closePopup(openedPopup);
  openedForm.reset();
};

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const openedPopup = document.querySelector('.popup_is-opened');
  const openedForm = openedPopup.querySelector('.popup__form');
  const newCardItem = {
    name: placeName.value,
    link: photoLink.value
  };
  const newCardToAdd = createCard(newCardItem, deleteCard, handleLike, handleImageClick);
  placesList.prepend(newCardToAdd);
  closePopup(openedPopup);
  openedForm.reset();
};

editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleCardFormSubmit);

//// Обработчик лайка
function handleLike(evt) {
  // if (evt.target.classList.contains('card__like-button')) {
    evt.target.classList.add('card__like-button_is-active');
  // };
};

//// Обработчик нажатия на картинку
function handleImageClick(evt) {
  // if (evt.target.classList.contains('card__image')) {
    openPopup(popupImage);
    popupImage.querySelector('.popup__image').src = evt.target.src;
    popupImage.querySelector('.popup__caption').textContent = evt.target.alt;
    addCloseListeners(popupImage);
  // };
};