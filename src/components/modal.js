// Функции открытия и закрытия модальных окон
export function openPopup(popupToOpen) {
  popupToOpen.classList.add('popup_is-opened');
  document.addEventListener('keyup', handleEscKey);
};

export function closePopup(popupToClose) {
  popupToClose.classList.remove('popup_is-opened');
  document.removeEventListener('keyup', handleEscKey);
};

// Обработчик нажатия на esc
export function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector('.popup_is-opened');
    closePopup(openedPopup);
  };
};

// Функция добавления слушателей закрытия модального окна (нажатие на "крестика" и на оверлей)
export function addCloseListeners(popup) {
  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    closePopup(popup);
  });
  
  popup.addEventListener('mousedown', function (evt) {
    if (evt.target === evt.currentTarget) closePopup(popup);
  });
};