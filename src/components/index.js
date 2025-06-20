import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLike } from './card.js';
import { openPopup, closePopup, addCloseListeners } from './modal.js';

const profileEditButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const cardAddButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const editProfileForm = document.forms['edit-profile'];
const profileName = editProfileForm.elements.name;
const profileDescription = editProfileForm.elements.description;
const addCardForm = document.forms['new-place'];
const placeName = addCardForm.elements['place-name'];
const photoLink = addCardForm.elements.link;
const placesList = document.querySelector('.places__list');

initialCards.forEach(function (item) {
  const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick);
  placesList.append(cardToAdd);
});

addCloseListeners(popupImage);
addCloseListeners(popupEditProfile);
addCloseListeners(popupNewCard);

// Обработчик нажатия на картинку
function handleImageClick(evt) {
  openPopup(popupImage);
  popupImage.querySelector('.popup__image').src = evt.target.src;
  popupImage.querySelector('.popup__caption').textContent = evt.target.alt;
};

// Обработка нажатия на редактирование профиля и на добавление карточки
profileEditButton.addEventListener('click', function() {
  profileName.value = document.querySelector('.profile__title').textContent;
  profileDescription.value = document.querySelector('.profile__description').textContent;
  openPopup(popupEditProfile);
});

cardAddButton.addEventListener('click', function() {
  addCardForm.reset();
  openPopup(popupNewCard);
});

// Обработка отправки формы профиля и формы добавления карточки
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