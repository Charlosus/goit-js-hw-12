import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
const gallery = document.querySelector(".gallery");
const form = document.querySelector(".search-form");
const loader = document.querySelector(".loader")
const input = document.querySelector("input[name='searchQuery']");
const lmbtn = document.querySelector(".lmbtn")
let lightbox = null;
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const userInput = input.value
    userSearch(userInput)
} )

window.rejectAlert = function(message) {
  iziToast.show({
    message: message,
    position: 'topRight',
    messageColor: "#ffffff",
    backgroundColor: "#d15858",
  });
}
  const apiKey = "50495832-52e00f4195b6d2cb1ef4fba52"
  axios.defaults.headers.common["header-name"] = apiKey
  const client = axios.create({
        baseURL: "https://pixabay.com/api/",
    });

const userSearch = async (userInput) => {
  gallery.innerHTML = "";
  const trimmedInput = userInput.trim();

  if (trimmedInput === "") {
    return rejectAlert("Sorry, there are no images matching your search query. Please try again!");
  }

  loader.style.display = 'block';

  try {
    const url = "https://corsproxy.io/?" + encodeURIComponent("https://pixabay.com/api/");
    const response = await client.get(url, {
      params: {
        key: apiKey,
        q: trimmedInput,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 3,
      }
    });

    loader.style.display = 'none';

    const images = response.data.hits;

    if (images.length === 0) {
      return rejectAlert("Sorry, there are no images matching your search query. Please try again!");
    }

    renderGallery(images);
    lmbtn.classList.remove("visualy-hidden");

  } catch (error) {
    loader.style.display = 'none';
    console.error(error);
    return rejectAlert("Something went wrong. Please try again later.");
  }
};
// const createGallery = (res) => {
//   const imgs = images.map(renderImage);
//   container.append(...imgs);
// };
const renderImage = (image) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
  const li = document.createElement('li');
  li.classList.add('gallery-item');

  const link = document.createElement('a');
  link.classList.add('gallery-link');
  link.href = largeImageURL;

  const img = document.createElement('img');
  img.classList.add('gallery-image');
  img.src = webformatURL;
  img.alt = tags.split(',')[0];

    const statsBox = document.createElement('div');
    statsBox.classList.add("imageStats")

    const likesBox = document.createElement('div');
    likesBox.classList.add("stat-box");

    const likesTitle = document.createElement('span');
    likesTitle.classList.add("stat-name");
    likesTitle.textContent = "Likes"

    const likesNum = document.createElement('span')
    likesNum.classList.add("stat-amount")
    likesNum.textContent = likes

        const viewsBox = document.createElement('div');
    viewsBox.classList.add("stat-box");

    const viewsTitle = document.createElement('span');
    viewsTitle.classList.add("stat-name");
    viewsTitle.textContent = "Views"

    const viewsNum = document.createElement('span')
    viewsNum.classList.add("stat-amount")
    viewsNum.textContent = views

        const commentsBox = document.createElement('div');
    commentsBox.classList.add("stat-box");

    const commentsTitle = document.createElement('span');
    commentsTitle.classList.add("stat-name");
    commentsTitle.textContent = "Comments"

    const commentsNum = document.createElement('span')
    commentsNum.classList.add("stat-amount")
    commentsNum.textContent = comments

        const downloadsBox = document.createElement('div');
    downloadsBox.classList.add("stat-box");

    const downloadsTitle = document.createElement('span');
    downloadsTitle.classList.add("stat-name");
    downloadsTitle.textContent = "Downloads"

    const downloadsNum = document.createElement('span')
    downloadsNum.classList.add("stat-amount")
    downloadsNum.textContent = downloads
  
    likesBox.append(likesTitle, likesNum); 
    statsBox.appendChild(likesBox);

    viewsBox.append(viewsTitle, viewsNum); 
    statsBox.appendChild(viewsBox);

    commentsBox.append(commentsTitle, commentsNum); 
    statsBox.appendChild(commentsBox);

    downloadsBox.append(downloadsTitle, downloadsNum); 
    statsBox.appendChild(downloadsBox);


    link.appendChild(img);
    li.append(link, statsBox);

    return li;
};

const renderGallery = (images) => {
  const items = images.map(renderImage); 
  gallery.append(...items);

  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
};