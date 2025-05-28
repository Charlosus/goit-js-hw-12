import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const gallery = document.querySelector(".gallery");
const form = document.querySelector(".search-form");
const loader = document.querySelector(".loader")
const input = document.querySelector("input[name='searchQuery']");
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

const userSearch = (userInput) => {
    gallery.innerHTML = ""

    const trimmedInput = userInput.trim();

    if (trimmedInput === "") {
        return rejectAlert("Sorry, there are no images matching your search query. Please try again!")
    }
    loader.style.display = 'block'

    const apiKey = "50495832-52e00f4195b6d2cb1ef4fba52"
    const userSearchUrl = `https://pixabay.com/api/?key=${apiKey}&q=${trimmedInput}&image_type=photo&orientation=horizontal&safesearch=true`
    const options = {
        method: "GET"
    };
    fetch(userSearchUrl, options) 
        .then(res => {
            loader.style.display = 'none'
            if (!res.ok) {
                throw new Error(res.status)
            }
            return res.json();
        })
        .then (res => {
            const images = res.hits;

            if (images.length === 0) { 
                return rejectAlert("Sorry, there are no images matching your search query. Please try again!")
            }
            // const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = firstImage
             renderGallery(images);
        })
        .catch(console.error)
}
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