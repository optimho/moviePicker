

const fetchData = async (searchTerm) => {
};

creatAutocomplete({
    /*


     */
    root: document.querySelector('.autocomplete-one'),
    renderOption: (movie)=>{
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster  //check that the movie has a link to a poster -
        return `
            <img src="${imgSRC}" alt=""/>
            ${movie.Title} (${movie.Year})
            `;
    },
    onOptionSelect (movie){
        console.log('movie ----', movie)
        onMovieSelect(movie);
    },
    inputValue (movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
        //fetch a list of movies from a movie API site
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '95cacf70',
                s: searchTerm            // API specifies s for searching the index - www.omdbapi.com
            }                            // for the specification of the API
        });
        if (response.data.Error){ // check for error
            console.log('No title with that name found!! try something else');
            return [];
        }
        return response.data.Search;
        // console.log(response.data);

    }
});



const onMovieSelect = async (movie) =>{
    /*
    This function goes back to the API and gets more information.
     */
    console.log('mivi--', movie)
        const response = await axios.get('http://www.omdbapi.com/', {  //fetch a list of movies from a movie API site
            params: {
                apikey: '95cacf70',
                i: movie.imdbID            // API specifies i getting movie with specific ID
            }                              // See the specification of the API on www.omdbapi.com
        });
    console.log(response.data.Ratings[0].value)
    console.log(response.data)
    document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) =>{

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" alt="" />
            </p>
        </figure>
        <div class="media-content"> 
            <div class="content"
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
           </div>     
        </div> 
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>        
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>        
      
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>         
    `
}
