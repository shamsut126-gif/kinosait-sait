const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

const starsContainer = document.querySelector('.movie__detail-stars');

//Получение фильма
async function getMovie() {
    if (!movieId) return;
    try{
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        
        rendermovie(data);
        getActors(movieId);

    } catch (error) {
        console.log(error);
    }
}   

// Отрисовка фильма
function rendermovie(movie) {
    document.querySelector(".movie__detail-title").textContent = movie.nameRu || movie.nameEn;
    const moviePoster = document.querySelector('.movie__detail-poster');
    moviePoster.src = movie.posterUrlPreview || 'img/i (3).webp';
    moviePoster.alt = movie.nameRu || movie.nameEn;

    document.querySelector('.movie__detail-desc').textContent = movie.description || 'Описания нет';
    const genresElement = document.querySelector('.movie__detail-genres')
    genresElement.textContent = movie.genres?.length ? movie.genres.map(g => g.genre).join(', ') : 'Нет жанра';

    document.querySelector('.movie__detail-facts-text.year').textContent = movie.year
    document.querySelector('.movie__detail-facts-text.age').textContent = movie.ratingAgeLimits ? movie.ratingAgeLimits.replace('age', '') + '+': '-';
    document.querySelector('.movie__detail-facts-text.timing').textContent = movie.filmLength ? movie.filmLength +' мин.' : '-';
    document.querySelector('.movie__detail-facts-text.rating').textContent = movie.ratingKinopoisk || movie.ratingImdb || '-'

    renderStars(movie.ratingKinopoisk);
}

//Актеры
async function getActors(filmId) {
    if (!movieId) return;
    try{
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${filmId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        renderActors(data);

    } catch (error) {
        console.log(error);
    }
}   

//Отрисовка актеров
function renderActors(actors) {
    const actorList = document.querySelector('.movie__detail-actors-list');
    actorList.innerHTML = '';
    const onlyActors = actors.filter(person => person.professionKey === 'ACTOR').slice(0, 6);

    onlyActors.forEach(actor => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="actors.html?filmId=${movieId}&actorId=${actor.staffId}">${actor.nameRu || actor.nameEn || 'Без имени'}</a>`;
        actorList.appendChild(li);
    })

    if (onlyActors.length === 0) {
        actorList.innerHTML = `<li>Информации нет</li>`
    }
}


//Звезды
function renderStars(rating){
    starsContainer.innerHTML = '';
    const ratingValue = Math.round(parseFloat(rating) || 0);

    for (let i = 1; i <= 10;  i++) {
        const star = document.createElement('img');
        star.src = i <= ratingValue ? 'icons/favorites (4).png ' : 'icons/favorites (3).png';
        starsContainer.appendChild(star)
    }

}
getMovie()