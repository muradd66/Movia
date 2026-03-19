let searchBtn = document.querySelector(".search-button")
let searchInput = document.querySelector(".search-input")
let films = document.querySelector(".film-container")
function search() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=14f70647643cfc65b7633986a74d806e&query=${searchInput.value}&language=az&page=1`)
        .then(response => response.json())
        .then(res => {
            console.log(res.results)
            console.log(res.results)
            films.innerHTML = ""
            showFilms(res.results)

        })
}
searchBtn.addEventListener("click", search)

function showFilms(film) {
    film.forEach(element => {
        let card = document.createElement("div")
        card.classList.add("card")
        let p = document.createElement("p")
        let filmname = document.createElement("h3")
        let MoreBtn = document.createElement("button")
        MoreBtn.classList.add("moreBtn")
        p.innerText = element.popularity
        filmname.innerHTML = element.original_title
        let img = document.createElement("img")
        img.classList.add("film-img")
        img.src = `https://image.tmdb.org/t/p/w500${element.poster_path}`
        card.append(img)
        card.append(filmname)
        card.append(p)
        films.append(card)
    });

}