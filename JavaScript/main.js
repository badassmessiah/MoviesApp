import { fetchPopularMovies, searchMovies, fetchFilteredMovies, fetchGenres } from './api.js';
import { renderMovies, updatePagination } from './ui.js';
import { fetchMovieDetails } from './api.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

let currentPage = 1;
let selectedGenre = null;
let selectedYear = null;

document.addEventListener('DOMContentLoaded', async () => {
    loadDarkModePreference();
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

    const genres = await fetchGenres();
    populateGenreDropdown(genres.genres);

    populateYearDropdown();

    loadMovies();

    document.getElementById('pagination').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentPage = parseInt(e.target.dataset.page);
            loadMovies();
        }
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            searchAndRenderMovies(query);
        } else if (query.length === 0) {
            loadMovies();
        }
    });

    document.getElementById('genre-filter').addEventListener('change', (e) => {
        selectedGenre = e.target.value || null;
        currentPage = 1;
        loadMovies();
    });

    document.getElementById('year-filter').addEventListener('change', (e) => {
        selectedYear = e.target.value || null;
        currentPage = 1;
        loadMovies();
    });
});

async function loadMovies() {
    let data;
    if (selectedGenre || selectedYear) {
        data = await fetchFilteredMovies(currentPage, selectedGenre, selectedYear);
    } else {
        data = await fetchPopularMovies(currentPage);
    }
    renderMovies(data.results);
    updatePagination(data.total_pages, currentPage);
}

async function searchAndRenderMovies(query) {
    const data = await searchMovies(query, 1);
    renderMovies(data.results);
    updatePagination(data.total_pages, 1);
}

function populateGenreDropdown(genres) {
    const genreDropdown = document.getElementById('genre-filter');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreDropdown.appendChild(option);
    });
}

function populateYearDropdown() {
    const yearDropdown = document.getElementById('year-filter');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }
}

if (window.location.pathname.includes('movie-details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        loadMovieDetails(movieId);
    }
}

async function loadMovieDetails(movieId) {
    const movie = await fetchMovieDetails(movieId);

    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-poster').src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';
    document.getElementById('movie-overview').textContent = movie.overview || 'No overview available.';
    document.getElementById('movie-release-date').textContent = movie.release_date || 'N/A';
    document.getElementById('movie-rating').textContent = movie.vote_average.toFixed(1) || 'N/A';
    document.getElementById('movie-runtime').textContent = movie.runtime || 'N/A';
    document.getElementById('movie-genres').textContent = movie.genres.map(genre => genre.name).join(', ') || 'N/A';
    document.getElementById('movie-budget').textContent = movie.budget.toLocaleString() || 'N/A';
    document.getElementById('movie-revenue').textContent = movie.revenue.toLocaleString() || 'N/A';
}

const toggleDarkMode = () => {
    const header = document.querySelector('.fixed-header');
    const body = document.body;

    header.classList.toggle('dark-mode');
    body.classList.toggle('dark-mode');

    const isDarkMode = body.classList.contains('dark-mode');
    saveToLocalStorage('darkMode', isDarkMode);
};

const loadDarkModePreference = () => {
    const isDarkMode = getFromLocalStorage('darkMode');
    if (isDarkMode) {
        const header = document.querySelector('.fixed-header');
        const body = document.body;

        header.classList.add('dark-mode');
        body.classList.add('dark-mode');
    }
};