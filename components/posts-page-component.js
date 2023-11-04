import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, page, renderApp,setPosts } from "../index.js";
import { addLikePost, deletePost, removeLikePost, getPosts } from '../api.js'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'


export function renderPostsPageComponent() {
   const appEl = document.getElementById('app')

  const getPosts = posts.map((post) => {
    
      return {
          postId: post.id,
          imageUrl: post.imageUrl,
          createdAt: formatDistanceToNow(new Date(post.createdAt), {
              locale: ru,
          }),
          description: post.description,
          userId: post.user.id,
          userName: post.user.name,
          userLogin: post.user.login,
          userImageUrl: post.user.imageUrl,
          usersLikes: post.likes,
          isLiked: post.isLiked,
      }
  })

  const appHTML = getPosts
      .map((post, index) => {
          const localUser = JSON.parse(window.localStorage.getItem('user'))
          const localUserId = localUser ? localUser._id : null

          return `<div class="page-container">
          <div class="header-container"></div>
          <ul id="list" class="posts">
          <li class="post" data-id="${post.postId}">
          <div class="post-header-container">
            <div class="post-header" data-user-id="${post.userId}">
              <img src="${post.userImageUrl}" class="post-header-user-image">
              <p class="post-header-user-name">${post.userName}</p></div>
              <div class="delete-button-container">
              <button class="delete-button ${
                  localUser === null || post.userId !== localUserId
                      ? 'hidden'
                      : ''
              }" id="button-delete" data-post-id="${
                  post.postId
              }">Удалить</button>
            </div>
            </div>
            <div class="post-image-container">
              <img class="post-image" data-post-id="${post.postId}" src="${
                  post.imageUrl
              }" data-index="${index}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.postId}" data-like="${
                  post.isLiked ? 'true' : ''
              }" data-index="${index}" class="like-button">
                <img src="${
                    post.isLiked
                        ? './assets/images/like-active.svg'
                        : './assets/images/like-not-active.svg'
                }">
              </button>
              <p class="post-likes-text">
              Нравится: ${
                  post.usersLikes.length > 0
                      ? `${
                            post.usersLikes[post.usersLikes.length - 1].name
                        } ${
                            post.usersLikes.length - 1 > 0
                                ? 'и ещё ' + (post.usersLikes.length - 1)
                                : ''
                        }`
                      : '0'
              }
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.userName}</span>
              ${post.description}
            </p>
            <p class="post-date">
              ${post.createdAt} назад
            </p>
          </li>
          </ul>
        </div>
      `
      })
      .join('')

  appEl.innerHTML = appHTML

  renderHeaderComponent({
      element: document.querySelector('.header-container'),
  })

  for (let userEl of document.querySelectorAll('.post-header')) {
      userEl.addEventListener('click', () => {
          goToPage(USER_POSTS_PAGE, {
              userId: userEl.dataset.userId,
          })
      })
  }

  likeEventListener({ token: getToken() })
  likeEventListenerOnIMG({ token: getToken() })
  deletePostEventListener({ token: getToken() })
}

export function likeEventListener() {
  const likeButtons = document.querySelectorAll('.like-button')

  likeButtons.forEach((likeButton) => {
      likeButton.addEventListener('click', (event) => {
          event.stopPropagation()
          const postId = likeButton.dataset.postId
          const index = likeButton.dataset.index
          const postHeader = document.querySelector('.post-header')
          const userId = postHeader.dataset.userId

          if (posts[index].isLiked) {
             removeLikePost({ token: getToken(), postId })
                  .then(() => {
                      posts[index].isLiked = false
                  })
                  .then(() => {
                      getPosts({ token: getToken(), userId }).then(
                          (response) => {
                              if (page === USER_POSTS_PAGE) {
                                  setPosts(response)
                                  goToPage(USER_POSTS_PAGE, {
                                      userId,
                                  })
                              } else {
                                  setPosts(response)
                                  renderApp()
                              }
                          },
                      )
                  })
          } else {
              addLikePost({ token: getToken(), postId })
                  .then(() => {
                      posts[index].isLiked = true
                  })
                  .then(() => {
                      getPosts({ token: getToken(), userId }).then(
                          (response) => {
                              if (page === USER_POSTS_PAGE) {
                                  setPosts(response)
                                  goToPage(USER_POSTS_PAGE, {
                                      userId,
                                  })
                              } else {
                                  setPosts(response)
                                  renderApp()
                              }
                          },
                      )
                  })
          }
      })
  })
}

export function likeEventListenerOnIMG() {
  const likeButtons = document.querySelectorAll('.post-image')

  likeButtons.forEach((likeButton) => {
      likeButton.addEventListener('dblclick', (event) => {
          event.stopPropagation()
          const postId = likeButton.dataset.postId
          const index = likeButton.dataset.index
          const postHeader = document.querySelector('.post-header')
          const userId = postHeader.dataset.userId

          if (posts[index].isLiked) {
              removeLikePost({ token: getToken(), postId })
                  .then(() => {
                      posts[index].isLiked = false
                  })
                  .then(() => {
                      getPosts({ token: getToken(), userId }).then(
                          (response) => {
                              if (page === USER_POSTS_PAGE) {
                                  setPosts(response)
                                  goToPage(USER_POSTS_PAGE, {
                                      userId,
                                  })
                              } else {
                                  setPosts(response)
                                  renderApp()
                              }
                          },
                      )
                  })
          } else {
              addLikePost({ token: getToken(), postId })
                  .then(() => {
                      posts[index].isLiked = true
                  })
                  .then(() => {
                      getPosts({ token: getToken(), userId }).then(
                          (response) => {
                              if (page === USER_POSTS_PAGE) {
                                  setPosts(response)
                                  goToPage(USER_POSTS_PAGE, {
                                      userId,
                                  })
                              } else {
                                  setPosts(response)
                                  renderApp()
                              }
                          },
                      )
                  })
          }
      })
  })
}

export function deletePostEventListener() {
  const deleteButtons = document.querySelectorAll('.delete-button')

  deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener('click', (event) => {
          event.stopPropagation()

          const postId = deleteButton.dataset.postId
          const postElement = deleteButton.closest('.post')
          if (postElement) {
              const userId =
                  postElement.querySelector('.post-header').dataset.userId

              deletePost({ token: getToken(), postId }).then(() => {
                  getPosts({ token: getToken(), userId }).then((response) => {
                      if (page === USER_POSTS_PAGE) {
                          setPosts(response)
                          goToPage(USER_POSTS_PAGE, {
                              userId,
                          })
                      } else {
                          setPosts(response)
                          renderApp()
                      }
                  })
              })
          }
      })
  })
}