


const fetchData = async (searchTerm) => {               //fetch a list of movies from a movie API site
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '95cacf70',
            s: searchTerm            // API specifies s for searching the index - www.omdbapi.com
        }                            // for the specification of the API
    });
    if (response.data.Error){ // check for error
        console.log('No title with that name found!! try something else')
        return [];
    }
    return response.data.Search
    // console.log(response.data);
};

const root = document.querySelector('.autocomplete')
root.innerHTML = `
<label><b>Search for a Movie</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => {                        // pass function fetch data into a debounce function
    const movies = await fetchData(event.target.value)    // fetch data from movie API site - search for a list of movies
    if (!movies.length){                                  //if the text box is empty remove the dropdown box
        dropdown.classList.remove('is-active')
        return;
    }

    resultsWrapper.innerHTML=''                              //clear all the items in the dropdown
    dropdown.classList.add('is-active');

    for (movie of movies){                                   //Iterate through the list of movies returned from the API
        const option = document.createElement('a');
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster  //check that the movie has a link to a poster -
        option.classList.add('dropdown-item');                     //make link blank if not, to prevent an  error
        option.innerHTML = `
        <img src="${imgSRC}" alt=""/>
        ${movie.Title}
        `;
        option.addEventListener('click', () => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput,1000)); // listen to the text input box
document.addEventListener('click', event => {
    if (!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }

});

const onMovieSelect = async (movie) =>{
    /*
    This function goes back to the API and gets more information.
     */
    console.log(movie)

        const response = await axios.get('http://www.omdbapi.com/', {  //fetch a list of movies from a movie API site
            params: {
                apikey: '95cacf70',
                i: movie.imdbID            // API specifies i getting movie with specific ID
            }                              // See the specification of the API on www.omdbapi.com
        });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) =>{

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content"> 
            <div class="content"
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
           </div>     
        </div> 
            
    
    </div>`
}
