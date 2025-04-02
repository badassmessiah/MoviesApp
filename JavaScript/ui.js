const pageSize = 18;

export function renderMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';

    const cardsPerRow = 3;
    const totalCards = movies.length;

    const remainingCards = cardsPerRow - (totalCards % cardsPerRow);

    if (remainingCards > 0 && remainingCards < cardsPerRow) {
        const duplicates = movies.slice(0, remainingCards);
        movies = [...movies, ...duplicates];
    }

    movies.forEach(movie => {
        const { id, title, poster_path, release_date, overview, vote_average } = movie;
        const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';

        const card = `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card h-100">
                    <img src="${poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}" 
                         class="card-img-top img-fluid poster-image" alt="${title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text text-muted small">
                            <span>${releaseYear}</span> | 
                            <span class="text-warning"><i class="fa-solid fa-star"></i> ${vote_average.toFixed(1)}</span>
                        </p>
                        <p class="card-text mt-2" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${overview || 'No overview available.'}
                        </p>
                        <a href="movie-details.html?id=${id}" class="btn btn-primary mt-auto">View Details</a>
                    </div>
                </div>
            </div>
        `;
        movieGrid.insertAdjacentHTML('beforeend', card);
    });
}

export function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>
        `;
        pagination.insertAdjacentHTML('beforeend', button);
    }

    if (currentPage > 1) {
        pagination.insertAdjacentHTML('afterbegin', `
            <li class="page-item">
                <button class="page-link" data-page="${currentPage - 1}">Previous</button>
            </li>
        `);
    }

    if (currentPage < totalPages) {
        pagination.insertAdjacentHTML('beforeend', `
            <li class="page-item">
                <button class="page-link" data-page="${currentPage + 1}">Next</button>
            </li>
        `);
    }
}

let allMovies = [];
let currentPage = 1;

function fetchAndRenderMovies(page) {
    currentPage = page;

    const totalPages = Math.ceil(allMovies.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const moviesForPage = allMovies.slice(startIndex, endIndex);

    renderMovies(moviesForPage);
    updatePagination(totalPages, currentPage);
}

document.addEventListener('DOMContentLoaded', () => {
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.addEventListener('click', (event) => {
            const target = event.target.closest('.page-link');
            if (target) {
                const newPage = parseInt(target.dataset.page, 10);
                fetchAndRenderMovies(newPage);
            }
        });
    } else {
        console.error("Pagination element not found in the DOM.");
    }
});