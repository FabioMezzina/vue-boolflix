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
    // arrays for toggling 'selected' class on click for filters
    movieFilterClass: [],
    serieFilterClass: [],
    // utility variables for genre filters
    movieGenreList: [],
    filteredMovieGenreList: [],
    movieGenresChosen: [],
    serieGenreList: [],
    filteredSerieGenreList: [],
    serieGenresChosen: [],
  }, // <- End Data
  created() {
    // Get movies and series genres lists
    this.getMovieGenres();
    this.getSerieGenres();
  },
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
              this.filterGenreList(this.movies, 'movie');
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
              this.filterGenreList(this.series, 'serie');
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
      return path ? `https://image.tmdb.org/t/p/w342/${path}` : "https://www.altavod.com/assets/images/poster-placeholder.png"
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
    /**
     * Get the movies genres list
     */
    getMovieGenres() {
      axios.get('https://api.themoviedb.org/3/genre/movie/list', {
              params: {
                api_key: 'c7984b175d921dd492707f69a01be0da',
                language: this.searchLanguage,
              }
          })
          .then(result => {
            this.movieGenreList = [...result.data.genres]
          })
          .catch(error => {
            console.log(error);
          });
    },
    /**
     * Get the tv series genres list
     */
    getSerieGenres() {
      axios.get('https://api.themoviedb.org/3/genre/tv/list', {
              params: {
                api_key: 'c7984b175d921dd492707f69a01be0da',
                language: this.searchLanguage,
              }
          })
          .then(result => {
            this.serieGenreList = [...result.data.genres]
          })
          .catch(error => {
            console.log(error);
          });
    },
    /**
     * Filter the global genre list based on the movie/serie list searched
     * @param {object} list 
     * @param {string} type 
     */
    filterGenreList(list, type) {
      let id = null;
      if (type === 'movie') {
        this.filteredMovieGenreList = [];
        this.movieGenreList.forEach(genre => {
          id = genre.id;
          list.forEach(movie => {
            if(movie.genre_ids.includes(id) && !this.filteredMovieGenreList.includes(genre)) {
              this.filteredMovieGenreList.push(genre);
            }
          })
        });
      } else {
        this.filteredSerieGenreList = [];
        this.serieGenreList.forEach(genre => {
          id = genre.id;
          list.forEach(serie => {
            if(serie.genre_ids.includes(id) && !this.filteredSerieGenreList.includes(genre)) {
              this.filteredSerieGenreList.push(genre);
            }
          });
        });
      }
    },
    /**
     * If the clicked genre has not yet been selected, the function pushes it into the chosen genres list.
     * In addition, toggle the 'selected' class for the clicked button
     * Otherwise the genre is removed, as well as the 'selected' class.
     * @param {number} id 
     * @param {string} type 
     * @param {number} i 
     */
    toggleGenre(id, type, i) {
      console.log(id);
      if (type === 'movie') {
        if (this.movieGenresChosen.includes(id)) {
          const position = this.movieGenresChosen.indexOf(id);
          this.movieGenresChosen.splice(position, 1);
          this.movieFilterClass[i] = '';
        } else {
          this.movieGenresChosen.push(id);
          this.movieFilterClass[i] = 'selected';
        }
      } else {
        if (this.serieGenresChosen.includes(id)) {
          const position = this.serieGenresChosen.indexOf(id);
          this.serieGenresChosen.splice(position, 1);
          this.serieFilterClass[i] = '';
        } else {
          this.serieGenresChosen.push(id);
          this.serieFilterClass[i] = 'selected';
        }
      }
    },
    /**
     * Check if the genres in a movie/serie are included in the selected filters
     * Return true if one or more genres are found, false otherwise
     * @param {object} genreList 
     * @param {string} type 
     */
    hasGenresSelected(genreList, type) {
      let show = false;
      if (type === 'movie') {
        if (this.movieGenresChosen.length === 0 || genreList.length === 0) {
          show = true;
        }
        genreList.forEach(genre => {
          if (this.movieGenresChosen.includes(genre)) {
            show = true;
          }
        });
      } else {
        if (this.serieGenresChosen.length === 0 || genreList.length === 0) {
          show = true;
        }
        genreList.forEach(genre => {
          if (this.serieGenresChosen.includes(genre)) {
            show = true;
          }
        });
      }
      return show;
    }
  } // <- End Methods
});