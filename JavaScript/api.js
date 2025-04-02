const API_KEY = 'a354f722d49a1c49d09316ea5711411a';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFilteredMovies(page = 1, genreId = null, releaseYear = null) {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
    if (genreId) url += `&with_genres=${genreId}`;
    if (releaseYear) url += `&primary_release_year=${releaseYear}`;
    const response = await fetch(url);
    return response.json();
}

export async function fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

export async function fetchPopularMovies(page = 1) {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    const response = await fetch(url);
    return response.json();
}

export async function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

export async function searchMovies(query, page = 1) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);
    return response.json();
}