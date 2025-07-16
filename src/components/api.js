export const baseConfig = {
  url: 'https://nomoreparties.co/v1/wff-cohort-42',
  myUserID: '9466035ed48581704398b9ea',
  headers: {
    authorization: '1bc14402-fe38-4b04-90a8-028dfc53871d',
    'Content-Type': 'application/json'
  }
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

// Запрос информации о пользователе и карточек с сервера
export function userDataPromise() {
  return fetch(`${baseConfig.url}/users/me`, {
    headers: baseConfig.headers
  })
    .then(checkResponse)
};

export function cardDataPromise() {
  return fetch(`${baseConfig.url}/cards`, {
    headers: baseConfig.headers
  })
    .then(checkResponse)
};

// Запрос данных при редактировании профиля
export function updateUserDataPromise(newUserName, newUserDescription) {
  return fetch(`${baseConfig.url}/users/me`, {
    method: 'PATCH',
    headers: baseConfig.headers,
    body: JSON.stringify({
      name: newUserName,
      about: newUserDescription
    })
  })
    .then(checkResponse)
};

// Запрос данных при добавлении новой карточки
export function updateCardDataPromise(newCardName, newCardLink) {
  return fetch(`${baseConfig.url}/cards`, {
    method: 'POST',
    headers: baseConfig.headers,
    body: JSON.stringify({
      name: newCardName,
      link: newCardLink
    })
  })
    .then(checkResponse);
};

// Запрос на удаление карточки с сервера
export function cardDeletionPromise(cardID) {
  return fetch(`${baseConfig.url}/cards/${cardID}`, {
    method: 'DELETE',
    headers: baseConfig.headers
  })
    .then(checkResponse);
};

// Запрос на постановку и снятие лайка
export function toggleLikePromise(cardID, isLiked) {
  return fetch(`${baseConfig.url}/cards/likes/${cardID}`, {
    method: isLiked ? 'DELETE' : 'PUT', // Если лайк на момент клика есть, значит, будем снимать, иначе - ставить
    headers: baseConfig.headers
  })
    .then(checkResponse);
};

// Запрос данных при обновлении аватара пользователя
export function updateUserAvatarPromise(newUserAvatar) {
  return fetch(`${baseConfig.url}/users/me/avatar`, {
    method: 'PATCH',
    headers: baseConfig.headers,
    body: JSON.stringify({
      avatar: newUserAvatar
    })
  })
    .then(checkResponse)
};
