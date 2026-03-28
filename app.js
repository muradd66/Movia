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
let paginationContainer = document.querySelector(".pagination-container")
function search() {
    genresId = null
    currentPage = 1
    pageNumber.innerHTML = `Page: ${currentPage}`
    if (currentPage == 1) {
        prevBtn.disabled = true
    }
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=14f70647643cfc65b7633986a74d806e&query=${searchInput.value}&language=en&page=${currentPage}`)
        .then(response => response.json())
        .then(res => {
            if (res.results.length == 0) {
                films.innerHTML = ""
                paginationContainer.style.display = "none"

                let noResults = document.createElement("div")
                noResults.classList.add("noResults")

                let icon = document.createElement("i")
                icon.classList.add("bi", "bi-search-heart", "no-results-icon")

                let title = document.createElement("h2")
                title.classList.add("no-results-title")
                title.innerText = "Oops! Our movie scouts couldn't find that."

                let description = document.createElement("p")
                description.classList.add("no-results-text")
                description.innerText = "Try checking the spelling or searching for another blockbuster!"

                noResults.append(icon, title, description)
                films.append(noResults)
            }
            else {
                paginationContainer.style.display = "flex"
                films.innerHTML = ""
                showFilms(res.results)
            }
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
        MoreBtn.classList.add("MoreBtn")

        MoreBtn.addEventListener("click", () => {
            movieDetails(element.id)
        })

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
            showFilms(response.results)
            pageNumber.innerHTML = `Page: ${page}`

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
            searchInput.value = ""
            currentPage = 1
            pageNumber.innerHTML = `Page: ${currentPage}`
            if (currentPage == 1) {
                prevBtn.disabled = true
            }
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


        if (searchInput.value.trim() !== "") {
            search()
        } else if (genresId) {
            getMovies(genresId, currentPage)
        } else {
            getPopular(currentPage)
        }
    }
    if (currentPage == 1) {
        prevBtn.disabled = true
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })

})

nextBtn.addEventListener("click", () => {

    currentPage = currentPage + 1
    pageNumber.innerHTML = `Page: ${currentPage}`

    if (searchInput.value.trim() !== "") {
        search();
    } else if (genresId) {
        getMovies(genresId, currentPage)
    } else {
        getPopular(currentPage)
    }

    prevBtn.disabled = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

let details = document.querySelector(".movie-details")
let detailContainer = document.querySelector(".detail-container")
let closeBtn = document.querySelector(".close-btn")

function movieDetails(movieId) {
    details.style.display = "flex"
    detailContainer.innerHTML = "Loading..."

    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=14f70647643cfc65b7633986a74d806e&append_to_response=videos,credits&language=en`)
        .then(res => res.json())
        .then(response => {
            console.log(response)
            detailContainer.innerHTML = ""

            const trailer = response.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube")

            let leftContent; // Bu dəyişən ya poster, ya da video olacaq

            if (trailer) {
                // Əgər trailer varsa, iframe yaradırıq
                leftContent = document.createElement("iframe");
                leftContent.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
                leftContent.width = "400px"
                leftContent.height = "250px"
                leftContent.classList.add("detail-trailer-video")
                leftContent.allowFullscreen = true
                leftContent.style.border = "none"
                leftContent.style.borderRadius = "12px"
            } else {
                leftContent = document.createElement("img")
                leftContent.src = `https://image.tmdb.org/t/p/w500${response.poster_path}`
                leftContent.classList.add("detail-poster")
            }
            let infoDiv = document.createElement("div")
            infoDiv.classList.add("detail-info")

            let title = document.createElement("h2")
            title.innerText = response.title

            let filmHistory = document.createElement("p")
            filmHistory.classList.add("filmHistory")
            filmHistory.innerText = `${response.release_date} • ${response.runtime} min • ⭐ ${response.vote_average.toFixed(1)}`

            let castTitle = document.createElement("h3")
            castTitle.innerText = "Top Cast"

            let castContainer = document.createElement("div")
            castContainer.classList.add("cast-container")

            response.credits.cast.slice(0, 6).forEach(actor => {
                let actorCard = document.createElement("div")
                actorCard.classList.add("actor-card")

                let actorImg = document.createElement("img")
                actorImg.src = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe577334cbf30f003e13a46340a1bd5e3c63599a508c655655241AD77494b8.svg";

                let actorName = document.createElement("p")
                actorName.innerText = actor.name
                actorName.classList.add("actor-name")

                let characterName = document.createElement("p")
                characterName.innerText = actor.character
                characterName.classList.add("character-name")

                actorCard.append(actorImg, actorName, characterName)
                castContainer.append(actorCard)
            });



            let overviewTitle = document.createElement("h3")
            overviewTitle.innerText = "Overview"

            let overview = document.createElement("p")
            overview.innerText = response.overview || "No description available."
            overview.classList.add("detail-overview")

            infoDiv.append(title, filmHistory, overviewTitle, overview, castTitle, castContainer)
            detailContainer.append(leftContent, infoDiv)
        })
        .catch(err => {
            detailContainer.innerHTML = "Xəta baş verdi məlumat yüklənərkən."
            console.error(err)
        });
}