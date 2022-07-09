import axios from 'axios';
const APIKEY = "28536083-93f700431aee8dfae28382edd";
axios.defaults.baseURL = 'https://pixabay.com/api';



export class GetPixabayApi {
    constructor() {
        this.searchQuery = " ";
        this.page = 1;
     }

    async fetchImages() {
        const options = new URLSearchParams({
            key: APIKEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: this.page,
            per_page: 40,
        });
        const { data } = await axios.get(`/?${options}`);
        this.incrementPage();
        return data;
       
    }

    get query() {
        return this.searchQuery;
    }
    set query(newSearchQuery) {
        this.searchQuery = newSearchQuery;
    }

    incrementPage() {
        this.page += 1
    }
    resetPage() {
        this.page=1
    }
}
