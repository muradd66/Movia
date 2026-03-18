let searchBtn = document.querySelector(".search-button")
let searchInput = document.querySelector(".search-input")
let films = document.querySelector(".film-container")
function search() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=14f70647643cfc65b7633986a74d806e&query=${searchInput.value}&language=az&page=1`)
        .then(response => response.json())
        .then(res => {
            showFilms(res.results)
            
        })
}
searchBtn.addEventListener("click", search)

function showFilms(film) {
    film.forEach(element => {

        let img = document.createElement("img")
        img.src = `https://image.tmdb.org/t/p/w500${element.poster_path}`
        films.append(img)
    });

}