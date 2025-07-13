import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLike } from './card.js';
import { openPopup, closePopup, addCloseListeners } from './modal.js';
import { validationConfig, clearValidation, enableValidation } from './validation.js';

const userName = document.querySelector('.profile__title');
const userAbout = document.querySelector('.profile__description');
const userAvatar = document.querySelector('.profile__image');
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

/*initialCards.forEach(function (item) {
  const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick);
  placesList.append(cardToAdd);
}); */

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
  profileName.value = userName.textContent;
  profileDescription.value = userAbout.textContent;
  clearValidation(editProfileForm, validationConfig);
  openPopup(popupEditProfile);
});

cardAddButton.addEventListener('click', function() {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openPopup(popupNewCard);
});

// Обработка отправки формы профиля и формы добавления карточки
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const openedPopup = document.querySelector('.popup_is-opened');
  const openedForm = openedPopup.querySelector('.popup__form');
  userName.textContent = profileName.value;
  userAbout.textContent = profileDescription.value;
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

// Валидация форм
enableValidation(validationConfig);

//// API

// Загрузка информации о пользователе с сервера
function userDataPromise() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-42/users/me', {
    headers: {
      authorization: '1bc14402-fe38-4b04-90a8-028dfc53871d'
    }
  })
    .then((res) => {
      return res.json()
    })
};

// Загрузка карточек с сервера
function cardDataPromise() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-42/cards', {
    headers: {
      authorization: '1bc14402-fe38-4b04-90a8-028dfc53871d'
    }
  })
    .then((res) => {
      return res.json()
    })
};

Promise.all([userDataPromise(), cardDataPromise()])
  .then(([userData, cardsData]) => {
    userName.textContent = userData.name;
    userAbout.textContent = userData.about;
    userAvatar.style['background-image'] = `url('${userData.avatar}')`;

    cardsData.forEach(function (item) {
      const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick);
      placesList.append(cardToAdd);
    });
  });

// Редактирование профиля
function updateUserData() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-42/users/me', {
    method: 'PATCH',
    headers: {
      authorization: '1bc14402-fe38-4b04-90a8-028dfc53871d',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Marie Skłodowska Curie',
      about: 'Physicist and Chemist'
    })
  })
    .then((res) => {
      return res.json()
    })
    // .then((data) => {
    //   console.log(data)
    // })
};
// updateUserData();

// Добавление новой карточки
function updateCardData() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-42/cards', {
    method: 'POST',
    headers: {
      authorization: '1bc14402-fe38-4b04-90a8-028dfc53871d',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    })
  })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log(data)
    })
};
// updateCardData();