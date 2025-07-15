import '../pages/index.css';
import { createCard } from './card.js';
import { openPopup, closePopup, addCloseListeners } from './modal.js';
import { validationConfig, clearValidation, enableValidation } from './validation.js';
import { baseConfig, userDataPromise, cardDataPromise, updateUserDataPromise, updateCardDataPromise, cardDeletionPromise, toggleLikePromise, updateUserAvatarPromise } from './api.js';

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
const saveButtonEditProfileForm = editProfileForm.querySelector('.popup__button');
const addCardForm = document.forms['new-place'];
const saveButtonAddCardForm = addCardForm.querySelector('.popup__button');
const placeName = addCardForm.elements['place-name'];
const photoLink = addCardForm.elements.link;
const placesList = document.querySelector('.places__list');
const popupConfirmDeletion = document.querySelector('.popup_type_confirm-deletion');
const confirmDeletionForm = document.forms['confirm-deletion'];
const popupUpdateAvatar = document.querySelector('.popup_type_update-avatar');
const updateAvatarForm = document.forms['update-avatar'];
const avatarUrl = updateAvatarForm.elements['avatar-url'];
const saveButtonUpdateAvatarForm = updateAvatarForm.querySelector('.popup__button');

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
  updateAvatarForm.reset();
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
  const defaultText = saveButtonUpdateAvatarForm.textContent;
  saveButtonUpdateAvatarForm.textContent = 'Сохранение...';
  updateUserAvatarPromise(avatarUrl.value)
    .then((userData) => {
      userAvatar.style['background-image'] = `url('${userData.avatar}')`;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      saveButtonUpdateAvatarForm.textContent = defaultText;
    });
  closePopup(popupUpdateAvatar);
  updateAvatarForm.reset();
};

updateAvatarForm.addEventListener('submit', handleUpdateAvatarFormSubmit);

// Обработка отправки формы профиля и формы добавления карточки
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const defaultText = saveButtonEditProfileForm.textContent;
  saveButtonEditProfileForm.textContent = 'Сохранение...';
  updateUserDataPromise(profileName.value, profileDescription.value)
    .then((newUserData) => {
      userName.textContent = newUserData.name;
      userAbout.textContent = newUserData.about;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      saveButtonEditProfileForm.textContent = defaultText;
    });
  closePopup(popupEditProfile);
  editProfileForm.reset();
};

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const defaultText = saveButtonAddCardForm.textContent;
  saveButtonAddCardForm.textContent = 'Сохранение...';
  updateCardDataPromise(placeName.value, photoLink.value) // Функция обработки запроса данных при добавлении новой карточки
    .then((newCardData) => {
      const newCardToAdd = createCard(newCardData, deleteCard, handleLike, handleImageClick, baseConfig.myUserID);
      placesList.prepend(newCardToAdd);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      saveButtonAddCardForm.textContent = defaultText;
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
    });
};

confirmDeletionForm.addEventListener('submit', handleCardDeletionSubmit);

// Валидация форм
enableValidation(validationConfig);

//// API
// Загрузка информации о пользователе и карточек с сервера
Promise.all([userDataPromise(), cardDataPromise()])
  .then(([userData, cardsData]) => {
    userName.textContent = userData.name;
    userAbout.textContent = userData.about;
    userAvatar.style['background-image'] = `url('${userData.avatar}')`;
    cardsData.forEach(function (item) {
      const cardToAdd = createCard(item, deleteCard, handleLike, handleImageClick, baseConfig.myUserID);
      placesList.append(cardToAdd);
    })
  })
  .catch((err) => {
    console.log(err);
  });

// Постановка и снятие лайка
function handleLike(cardID, isLiked, renderLikes) {
  toggleLikePromise(cardID, isLiked)
    .then((cardElement) => {
      renderLikes(cardElement)
    })
    .catch((err) => {
      console.log(err);
    });
};