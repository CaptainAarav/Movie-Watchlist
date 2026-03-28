const movieContainer = document.getElementById("movie-container")
const searchButton = document.getElementById("search-button")
const defaultSection = document.getElementById("default-ele")
const searchInput = document.getElementById("search-input")
const cpYear = document.getElementById("footer-cp")

let year = new Date().getFullYear()
let savedMovies = JSON.parse(localStorage.getItem("watchlist")) || []

cpYear.textContent = `© ${year}`

searchButton.addEventListener("click", searchMovies)

document.addEventListener("click", function (e) {
	if (e.target.classList.contains("add-movie-button")) {
		e.target.innerHTML = `<i class="fa-solid fa-check"></i> Added`
		e.target.classList.add("green")
		e.target.disabled = true
		setTimeout(() => {
			e.target.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Watchlist`
			e.target.classList.remove("green")
			e.target.disabled = false
		}, 2000);
		addMovie(e.target.dataset.imdbid)
	}
})

async function searchMovies() {
	let searchResponse = await fetch(`http://www.omdbapi.com/?s=${searchInput.value}&apikey=d6943f3`)
	let searchData = await searchResponse.json()
	let html = ``

	if (searchData.Response === "False") {
		defaultSection.innerHTML = `<h2 class="default-text">We were unable to find what you were looking for</h2>`
		defaultSection.classList.remove("hide")
		movieContainer.innerHTML = ""
		return
	}

	for (let movie of searchData.Search) {
		let movieResponse = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=d6943f3`)
		let movieData = await movieResponse.json()

		html += `
			<section class="movie-section">
				<div class="movie-text-container">
					<div class="title-section">
						<h2 class="movie-title">${movieData.Title}</h2>
						<div>
							<i class="fa-solid fa-star"></i>
							<p class="movie-rating">${movieData.imdbRating}</p>
						</div>
					</div>
					<div class="middle-section">
						<p>${movieData.Runtime}</p>
						<p class="movie-genre">${movieData.Genre}</p>
						<button data-imdbid="${movieData.imdbID}" class="add-movie-button"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
					</div>
					<p class="movie-plot">${movieData.Plot}</p>
				</div>
			</section>
		`
	}

	defaultSection.classList.add("hide")
	movieContainer.innerHTML = html
}

function addMovie(id) {
	if (!savedMovies.includes(id)) {
		savedMovies.push(id)
		localStorage.setItem("watchlist", JSON.stringify(savedMovies))
	}
}