class Service {
    BASIC_URL = "https://pixabay.com/api/?image_type=photo&orientation=horizontal&"; 
    API_KEY = "20961462-909795e71f735a58f24820845";
    errorMsg = "Fetch falure"
    constructor() {
        this.page = 1;
        this.searchQuery = '';
    }

    async fetchImages() {
        try {
            const url = this.getURL(this.searchQuery)

            const response = await fetch(url);
            if(!response.ok){
                throw new Error(this.errorMsg);
            }
            const result = await response.json();
            return result;
        }
        catch (error) {
            return error;
        }
    }

    getURL(search){
        return `${this.BASIC_URL}q=${this.query}&page=${this.page}&per_page=12&key=${this.API_KEY}`
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page +=1; 
    }

    clearMarkup (elem) {
        elem.innerHTML = '';
    }

    resetPage() {
        this.page = 1;
    }
}

export default Service


