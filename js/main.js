const app = new Vue({
  el: '#app',
  data: {
    searchInput: '',
    movies: [],
    series: [],
    searchLanguage: 'it-IT',
  }, // <- End Data
  methods: {
    search() {
      this.getMovies();
      this.getSeries();
      this.searchInput = '';
    },
    getMovies() {
      if (this.searchInput) {
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
      }
    },
    getSeries() {
      if (this.searchInput) {
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
      }
    },
    setStarRating(numRating) {
      return Math.ceil(numRating / 2);
    },
  } // <- End Methods
});