import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard } from './card.js';
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
const popupConfirmDeletion = document.querySelector('.popup_type_confirm-deletion');
const confirmDeletionForm = document.forms['confirm-deletion'];
const popupUpdateAvatar = document.querySelector('.popup_type_update-avatar');
const updateAvatarForm = document.forms['update-avatar'];
const avatarUrl = updateAvatarForm.elements['avatar-url'];

addCloseListeners(popupImage);
addCloseListeners(popupEditProfile);
addCloseListeners(popupNewCard);
addCloseListeners(popupConfirmDeletion);
addCloseListeners(popupUpdateAvatar);

// Обработчик нажатия на картинку
function handleImageClick(evt) {
  openPopup(popupImage);
  popupImage.querySelector('.popup__image').src = evt.target.src;
  popupImage.querySelector('.popup__caption').textContent = evt.target.alt;
};

// Обработка нажатия на редактирование аватара
userAvatar.addEventListener('click', function() {
  // updateAvatarForm.reset();
  clearValidation(updateAvatarForm, validationConfig);
  openPopup(popupUpdateAvatar);
});

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

// Обработка отправки формы обновления аватара 
function handleUpdateAvatarFormSubmit(evt) {
  evt.preventDefault();
  updateAvatarForm.querySelector('.popup__button').textContent = 'Сохранение...';
  updateUserAvatarPromise(avatarUrl.value)
    .then((userData) => {
      userAvatar.style['background-image'] = `url('${userData.avatar}')`;
    })
    .catch((err) => {
      console.log(err);
    })
  closePopup(popupUpdateAvatar);
  updateAvatarForm.reset();
};

updateAvatarForm.addEventListener('submit', handleUpdateAvatarFormSubmit);

// Обработка отправки формы профиля и формы добавления карточки
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  editProfileForm.querySelector('.popup__button').textContent = 'Сохранение...';
  updateUserDataPromise(profileName.value, profileDescription.value)  // Функция обработки запроса данных при редактировании профиля
   .then((newUserData) => {
      userName.textContent = newUserData.name;
      userAbout.textContent = newUserData.about;
    });
  closePopup(popupEditProfile);
  editProfileForm.reset();
};

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  addCardForm.querySelector('.popup__button').textContent = 'Сохранение...';
  updateCardDataPromise(placeName.value, photoLink.value) // Функция обработки запроса данных при добавлении новой карточки
     .then((newCardData) => {
      // console.log(newCardData);
      const newCardToAdd = createCard(newCardData, deleteCard, handleLike, handleImageClick, baseConfig.myUserID);
      placesList.prepend(newCardToAdd);
    });
  closePopup(popupNewCard);
  addCardForm.reset();
};

editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleCardFormSubmit);

// Обработка удаления карточки
let cardToDeleteData = {};

function deleteCard(cardToDelete, cardToDeleteID) {
  cardToDeleteData = {cardToDelete, id: cardToDeleteID};
  openPopup(popupConfirmDeletion);
  return; // Удалить?
};

function handleCardDeletionSubmit(evt) {
  evt.preventDefault();
  if (!cardToDeleteData.cardToDelete) return;
  cardDeletionPromise(cardToDeleteData.id)
    .then(() => {
      cardToDeleteData.cardToDelete.remove();
      closePopup(popupConfirmDeletion);
      cardToDeleteData = {};
    })
    .catch((err) => {
      console.log(err);
    })
};

confirmDeletionForm.addEventListener('submit', handleCardDeletionSubmit);

// Валидация форм
enableValidation(validationConfig);

//// API
const baseConfig = {
  url: 'https://nomoreparties.co/v1/wff-cohort-42',
  token: '1bc14402-fe38-4b04-90a8-028dfc53871d',
  myUserID: '9466035ed48581704398b9ea'
};

// Функция проверки ответа сервера
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json()
    .then((error) => {
      error.httpResponseCode = res.status;
      return Promise.reject(error);
    })
};

// Загрузка информации о пользователе с сервера
function userDataPromise() {
  return fetch(`${baseConfig.url}/users/me`, {
    headers: {
      authorization: baseConfig.token
    }
  })
    .then(checkResponse)
};

// Загрузка карточек с сервера
function cardDataPromise() {
  return fetch(`${baseConfig.url}/cards`, {
    headers: {
      authorization: baseConfig.token
    }
  })
    .then(checkResponse)
};

Promise.all([userDataPromise(), cardDataPromise()])
  .then(([userData, cardsData]) => {
    userName.textContent = userData.name;
    userAbout.textContent = userData.about;
    userAvatar.style['background-image'] = `url('${userData.avatar}')`;
    // console.log(cardsData);
    cardsData.forEach(function (item) {
      const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick, baseConfig.myUserID);
      placesList.append(cardToAdd);
    });
  });

// Запрос данных при редактировании профиля
function updateUserDataPromise(newUserName, newUserDescription) {
  return fetch(`${baseConfig.url}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: baseConfig.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newUserName,
      about: newUserDescription
    })
  })
    .then(checkResponse)
};

// Запрос данных при добавлении новой карточки
function updateCardDataPromise(newCardName, newCardLink) {
  return fetch(`${baseConfig.url}/cards`, {
    method: 'POST',
    headers: {
      authorization: baseConfig.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newCardName,
      link: newCardLink
      // https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg
    })
  })
    .then(checkResponse);
};

// Запрос на удаление карточки с сервера
function cardDeletionPromise(cardID) {
  return fetch(`${baseConfig.url}/cards/${cardID}`, {
    method: 'DELETE',
    headers: {
      authorization: baseConfig.token
    }
  })
    .then(checkResponse);
};

// Постановка и снятие лайка
function handleLike(cardID, isLiked, renderLikes) {
  toggleLikePromise(cardID, isLiked)
    .then((cardElement) => {
      renderLikes(cardElement)
    })
};

function toggleLikePromise(cardID, isLiked) {
  return fetch(`${baseConfig.url}/cards/likes/${cardID}`, {
    method: isLiked ? 'DELETE' : 'PUT', // Если лайк на момент клика есть, значит, будем снимать, иначе - ставить
    headers: {
      authorization: baseConfig.token,
      'Content-Type': 'application/json',
    }
  })
    .then(checkResponse);
};

// Запрос данных при обновлении аватара пользователя
function updateUserAvatarPromise(newUserAvatar) {
  return fetch(`${baseConfig.url}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: baseConfig.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatar: newUserAvatar
    })
  })
    .then(checkResponse)
};