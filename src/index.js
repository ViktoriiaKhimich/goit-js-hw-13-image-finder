import './styles.css';
import 'basiclightbox/dist/basicLightbox.min.css';
import ApiService from './js/service-api.js';
import imagesCardsTpl from './templates/imagesCards.hbs';
import * as basicLightbox from 'basiclightbox';


const appService = new ApiService();

const imagesList = document.querySelector('.gallery');

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', searchImagesByValue);

// const loadMoreButton = document.querySelector('[data-action="load-more"]');
// loadMoreButton.addEventListener('click', loadMoreImages);



async function loadMoreImages () {
    // const lastElement = document.querySelector('.gallery .photo-card:last-child')
    // const scrollValue = lastElement.offsetTop + lastElement.clientHeight;
    
    try {
        appService.incrementPage();
        const {hits} = await appService.fetchImages();
        createMarkup(hits);
 
        // window.scrollTo({
        //     top: scrollValue,
        //     behavior: 'smooth'
        // })
        
    }
    catch (error) {
        return error;
    }
}

async function searchImagesByValue (e) {
    e.preventDefault();

    const inputField = document.querySelector('[name="query"]');
    const value = inputField.value;
    appService.query = value;

    try {
        if(appService.query === '') {
            return alert('What word are willing to search for?')
        }
        appService.resetPage();
        appService.clearMarkup(imagesList);
        const {hits} = await appService.fetchImages(value);
        await createMarkup(hits);

        infinityScroll()

        imagesList.addEventListener('click', function(e) {
            e.preventDefault();
            if(e.target.nodeName !== 'IMG') {
                return;
            }
                const largeImage = e.target.dataset.source;
                if(largeImage) {
                    const instance = basicLightbox.create(`
                    <img src="${largeImage}" width="800" height="600">
                    `)
                    instance.show()
                }
            })
        }

    catch(error) {
        return error;
    }
}


function infinityScroll(){
    const observerCallback = async (entries, observer) => {
        const elem = entries[0];
        if(elem.isIntersecting) {
            observer.unobserve(elem.target);
            await loadMoreImages();
            const last = document.querySelector('.photo-card:last-child');
            observer.observe(last);
        }   
    }

    const options = {
        threshold: 0.2,
    }

    const lastImage = document.querySelector('.photo-card:last-child');
    const observer = new IntersectionObserver(observerCallback, options);
    observer.observe(lastImage);
}

function createMarkup (elem)  {
    const cardsMarkup = imagesCardsTpl(elem);
    imagesList.insertAdjacentHTML('beforeend', cardsMarkup); 
} 

