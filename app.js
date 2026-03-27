let searchBtn = document.querySelector(".search-button")
let searchInput = document.querySelector(".search-input")
let films = document.querySelector(".film-container")
let sidebar = document.querySelector(".sidebar")
let searchContainer = document.querySelector(".search-container")
let selectGenre = document.querySelector(".select-genre");
let optionsList = document.querySelector(".options-list");
let genresId = null
let currentPage = 1
let prevBtn = document.querySelector(".prevBtn")
let nextBtn = document.querySelector(".nextBtn")
let pageNumber = document.querySelector(".pageNumber")
function search() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=14f70647643cfc65b7633986a74d806e&query=${searchInput.value}&language=az&page=${currentPage}`)
        .then(response => response.json())
        .then(res => {
            console.log(res.results)
            // console.log(res.results)
            films.innerHTML = ""
            showFilms(res.results)

        })
}
searchBtn.addEventListener("click", search)

function showFilms(film) {
    film.forEach(element => {
        let card = document.createElement("div")
        card.classList.add("card")

        let film_info = document.createElement("div")
        film_info.classList.add("film_info")

        let rating = document.createElement("p")
        rating.classList.add("rating")

        let star = document.createElement("img")
        star.src = "images_and_logos/star.png"
        star.classList.add("star")

        let filmname = document.createElement("h2")
        filmname.classList.add("filmname")
        let MoreBtn = document.createElement("button")


        let btnContainer = document.createElement("div")
        btnContainer.classList.add("btnContainer")


        let favBtn = document.createElement("i")
        favBtn.classList.add("bi", "bi-heart")
        favBtn.addEventListener("mouseover", () => {
            favBtn.classList.remove("bi-heart")
            favBtn.classList.add("bi-heart-fill")
        })

        favBtn.addEventListener("mouseout", () => {
            favBtn.classList.remove("bi-heart-fill")
            favBtn.classList.add("bi-heart")
        })

        MoreBtn.innerHTML = "More"
        MoreBtn.classList.add("moreBtn")

        rating.innerText = element.vote_average
        filmname.innerHTML = element.original_title

        let img = document.createElement("img")
        img.classList.add("film-img")
        img.src = `https://image.tmdb.org/t/p/w500${element.poster_path}`

        card.append(img)
        card.append(filmname)
        film_info.append(star, rating)
        card.append(film_info)
        btnContainer.append(MoreBtn)
        btnContainer.append(favBtn)
        card.append(btnContainer)
        films.append(card)
    });

}

window.addEventListener("load", getGenres)

function getPopular(page) {
    films.innerHTML = ""
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=14f70647643cfc65b7633986a74d806e&language=en&page=${page}`)
        .then(res => res.json())
        .then(response => {
            console.log(response.results)
            showFilms(response.results)
        })
}

getPopular(currentPage)

function getGenres() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=14f70647643cfc65b7633986a74d806e&language=en")
        .then(res => res.json())
        .then(response => {
            console.log(response.genres)
            renderGenres(response.genres)
        })
}


selectGenre.addEventListener("click", () => {
    optionsList.classList.toggle("show")
})

function renderGenres(genres) {
    optionsList.innerHTML = "";

    genres.forEach(genre => {
        let genreOpt = document.createElement("div")
        genreOpt.innerText = genre.name
        genreOpt.dataset.id = genre.id
        genreOpt.addEventListener("click", () => {
            genresId = genre.id
            let valueGenre = selectGenre.querySelector("span")
            valueGenre.innerHTML = genre.name
            optionsList.classList.remove("show")

            getMovies(genre.id, currentPage)
        })


        optionsList.append(genreOpt)
    })
}

function getMovies(genreId, page) {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=14f70647643cfc65b7633986a74d806e&with_genres=${genreId}&language=en&page=${page}`)
        .then(response => response.json())
        .then(res => {
            films.innerHTML = ""
            showFilms(res.results)
        })
}

pageNumber.innerHTML = `Page: ${currentPage}`
prevBtn.disabled = true

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage = currentPage - 1
        pageNumber.innerHTML = `Page: ${currentPage}`
        if (genresId) {
            getMovies(genresId, currentPage)

        }
        else {
            getPopular(currentPage)
        }
    }
    if (currentPage === 1) {
        prevBtn.disabled = true
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })

})

nextBtn.addEventListener("click", () => {

    currentPage = currentPage + 1
    pageNumber.innerHTML = `Page: ${currentPage}`

    if (genresId) {
        getMovies(genresId, currentPage)
    }
    else {
        getPopular(currentPage)
    }
    if (currentPage > 1) {
        prevBtn.disabled = false
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
})