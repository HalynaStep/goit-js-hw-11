import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { GetPixabayApi } from './getPixabay';

const lightbox = new SimpleLightbox('.gallery a', { 
  captionsData: 'alt',
  captionDelay: 300,
});

const galleryEl = document.querySelector(".gallery");
const formEl = document.querySelector("#search-form");
const loadMorBtnEl = document.querySelector('.load-more')
let page = 1;

const getPixabayApi = new GetPixabayApi();


formEl.addEventListener('submit', onFormSubmit);
loadMorBtnEl.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();

  clearCalleryCard();
  getPixabayApi.resetPage();
  const name = event.target.elements.searchQuery.value.trim();
  if (!name) return Notiflix.Notify.info('Please enter a search query.');
  getPixabayApi.query = name;
  try {
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    if (!totalHits)
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderGalleryCard(hits);
    lightbox.refresh();
  }
  catch(error){console.log(error.message)}
  
  event.target.reset();
  loadMorBtnEl.classList.remove('is-hidden');
}

async function onLoadMore() {
  page += 1;
  try {
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    renderGalleryCard(hits);
    lightbox.refresh();
    if (page * 40 > totalHits) {
        loadMorBtnEl.classList.add('is-hidden');
        Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
    }
  }
   catch (error) { console.log(error.message) }
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function createGalleryCard(images) {
    return images.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    }) => 
    `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div></a>
</div>` )
.join("");
};

function renderGalleryCard(images) {
    galleryEl.insertAdjacentHTML("beforeend", createGalleryCard(images));
}

function clearCalleryCard() {
  galleryEl.innerHTML = "";
}

// 