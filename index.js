

const fetchData = async (searchTerm) => {
};

createDropdownSelector({
    /*


     */
    root: document.querySelector('.autocomplete-one'), //where to render the data
    renderOption: (movie)=>{                                   //What the render looks like
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster  //check that the movie has a link to a poster
                                                                   // don't try and get a poster if none is available
        return `
            <img src="${imgSRC}" alt=""/>
            ${movie.Title} (${movie.Year})
            `;
    },
    onOptionSelect (movie){                            // Select a movie from the dropdown
        console.log('movie ----', movie)
        onMovieSelect(movie);
    },
    inputValue (movie){                                // Write the name of the movie to the text box after selection
        return movie.Title;
    },
    async fetchData(searchTerm){                        // Search and return a list of movies - from an API
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

        const response = await axios.get('http://www.omdbapi.com/', {  //fetch a list of movies from a movie API site
            params: {
                apikey: '95cacf70',
                i: movie.imdbID            // API specifies i getting movie with specific ID
            }                              // See the specification of the API on www.omdbapi.com
        });


    document.querySelector('#summary').innerHTML = movieTemplate(response.data)
    const {Source, Value} = response.data.Rating[0];
    console.log(Value)
}

const movieTemplate = (movieDetail) =>{
/*


 */

    console.log("movie Detail", movieDetail.Ratings.length)


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
        <p class="title">${movieDetail.Ratings[0].Value}</p>
        <p class="subtitle">${movieDetail.Ratings[0].Source}</p>
    </article>    
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>         
    `
}
