const API_KEY = 'e1e33c5b-aac2-4b96-87f1-56450a5c294e'
window.addEventListener('DOMContentLoaded', () => {

    let currentPage = 1;
    let totalPages = 0;

    const cardFilms = document.querySelector('.films__cards')
    const paginationNumber =  document.querySelectorAll('.film__pagination_number');

    paginationNumber.forEach((number, index) => {
        number.addEventListener('click', () =>{
            currentPage = index + 1;
            updateUI()
            //getFilms(currentPage)
        });
    });

    async function getFilms(page) {
        try {
            let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=7&ratingTo=10&yearFrom=2020&yearTo=2026&page=${page}`, {
                method: 'GET',
                headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Ошибочка', response.status);
            }
            const data = await response.json();
            totalPages = data.totalPages;
            renderMovies(data.items)
            updateUI();
            console.log(data)

        }   catch (error) {
            console.log(error)
        }
    }
    function renderMovies(movies) {
        cardFilms.innerHTML ='';

        movies.forEach(movie => {
            let div = document.createElement('div');
            div.classList.add('films__card')

            div.innerHTML = `
            <img class='films__card-img' src='${movie.posterUrlPreview}' onerror = 'this.onerror=null'; this.src='img/i (3).webp' alt='${movie.nameOriginal || movie.nameRu}'>
            <h3 class="films__card-title">${movie.nameRu || movie.nameOriginal}</h3>
            <div class="films__card-wrapper">
                <p class="films__card-year">${movie.year}</p>
                <p class="films__card-rating">${movie.ratingImdb || movie.ratingKinopoisk}</p>
            </div>

            <a href="movie.html?id=${movie.kinopoiskId}" class="films__card-link">Перейти</a>
            `
            cardFilms.appendChild(div);
        })
    }

    function updateUI() {
        paginationNumber.forEach((number, index) => {
            if (index + 1 ==currentPage) {
                number.classList.add('number__active');
            }else {
                number.classList.remove('number__active')
            }
        })
    }


    //getFilms(currentPage);

})