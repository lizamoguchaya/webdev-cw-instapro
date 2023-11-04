import { renderApp, setPosts } from './index.js'

// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "liza-moguchaya";
const baseHost = 'https://wedev-api.sky.pro'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      setPosts(data.posts)
      return data.posts;
    })
    .catch((error) =>{
      console.warn(error)
    })
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    if (response.status === 400) {
        alert('Размер изображения превышает установленный')
        renderApp()
        throw new Error('Слишком большое изображение')
    } else {
        return response.json()
    }
})
}

export function addPost({ token, imageUrl }) {
  const descriptionInputElement = document.getElementById('description')
  return fetch(postsHost, {
      method: 'POST',
      body: JSON.stringify({
          description: descriptionInputElement.value
              .replaceAll('&', '&amp;')
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;')
              .replaceAll('"', '&quot;'),
          imageUrl,
      }),
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 400) {
          alert('Заполнены не все поля: фото, описание')
          throw new Error('Некорректно введены данные')
      } else {
          return response.json()
      }
  })
}

export function deletePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}`, {
      method: 'DELETE',
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 401) {
          alert('Удалять посты могут только авторизованные пользователи')
          throw new Error('Нет авторизации')
      }

      return response.json()
  })
}

export function getPostsOfUser({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
      method: 'GET',
      headers: {
          Authorization: token,
      },
  })
      .then((response) => {
          if (response.status === 401) {
              throw new Error('Нет авторизации')
          }
          return response.json()
      })
      .then((data) => {
          setPosts(data.posts)
          return data.posts
      })
      .catch((error) => {
          alert('Кажется, у вас сломался интернет, попробуйте позже')
          console.warn(error)
      })
}
export function addLikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
      method: 'POST',
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 401) {
          alert('Лайкать посты могут только авторизованные пользователи')
          throw new Error('Нет авторизации')
      }

      return response.json()
  })
}
export function removeLikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
      method: 'POST',
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 401) {
          alert('Войдите, чтобы убрать лайк')
          throw new Error('Нет авторизации')
      }

      return response.json()
  })
}
