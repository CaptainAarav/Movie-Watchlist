let savedMovies = JSON.parse(localStorage.getItem("watchlist")) || []
const movieContainer = document.getElementById("movie-container")
const defaultSection = document.getElementById("default-ele")
const cpYear = document.getElementById("footer-cp")

let year = new Date().getFullYear()
cpYear.textContent = `© ${year}`

if (savedMovies.length === 0) {
	defaultSection.classList.remove("hide")
} else {
	removeMovie()
}

document.addEventListener("click", function (e) {
	if (e.target.classList.contains("remove-movie-button")) {
		e.target.innerHTML = `<i class="fa-solid fa-x"></i> Removed`
		e.target.classList.add("red")
		e.target.disabled = true
		setTimeout(() => {
			removeMovie(e.target.dataset.imdbid)
		}, 1000);

	}
})

async function renderMovies() {
	let html = ``
	for (let id of savedMovies) {
		let response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=d6943f3`)
		let movieData = await response.json()

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
						<button data-imdbid="${movieData.imdbID}" class="remove-movie-button"><i class="fa-solid fa-circle-minus"></i> Remove</button>
					</div>
					<p class="movie-plot">${movieData.Plot}</p>
				</div>
			</section>
		`
	}

	defaultSection.classList.add("hide")
	movieContainer.innerHTML = html
}

function removeMovie(id) {
	const index = savedMovies.indexOf(id)
	if (index > -1) {
		savedMovies.splice(index, 1)
	}

	localStorage.setItem("watchlist", JSON.stringify(savedMovies))
	renderMovies()
}