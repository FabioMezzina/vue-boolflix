const app = new Vue({
  el: '#app',
  data: {
    searchInput: '',
    movies: [],
    series: [],
    searchLanguage: 'it-IT',
    overlayStatus: false,
    overlay: {
      poster_path: '',
      overview: '',
      original_language: '',
      vote_average: 0,
      genre_ids: [],
    },
  }, // <- End Data
  methods: {
    /**
     * Start search and clear input search bar
     */
    search() {
      this.getMovies();
      this.getSeries();
    },
    /**
     * Search for movies and populate movies array
     */
    getMovies() {
      if (this.searchInput.trim()) {
        axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                  api_key: 'c7984b175d921dd492707f69a01be0da',
                  query: this.searchInput,
                  language: this.searchLanguage,
                }
              })
            .then(result => {
              this.movies = [...result.data.results];
            })
            .catch(error => {
              console.log(error);
            });
            return null;
      }
      this.movies = [];
    },
    /**
     * Search for tv series and populate series array
     */
    getSeries() {
      if (this.searchInput.trim()) {
        axios.get('https://api.themoviedb.org/3/search/tv', {
                params: {
                  api_key: 'c7984b175d921dd492707f69a01be0da',
                  query: this.searchInput,
                  language: this.searchLanguage,
                }
              })
            .then(result => {
              this.series = [...result.data.results];
            })
            .catch(error => {
              console.log(error);
            });
            return null;
      }
      this.series = [];
    },
    /**
     * Convert and return film rating, from 1-10 to 1-5
     * @param {number} numRating 
     */
    setStarRating(numRating) {
      return Math.ceil(numRating / 2);
    },
    /**
     * Generate and return the poster img url
     * @param {string} path 
     */
    setPosterPath(path) {
      return `https://image.tmdb.org/t/p/w342/${path}`;
    },
    showOverlay(film) {
      this.overlayStatus = true;
      this.overlay = {
        poster_path: film.poster_path,
        overview: film.overview,
        original_language: film.original_language,
        vote_average: film.vote_average,
        genre_ids: [...film.genre_ids],
      }
    },
  } // <- End Methods
});