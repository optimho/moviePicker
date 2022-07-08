


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

const input = document.querySelector('input');

const onInput = async (event) => {                        // pass function fetch data into a debounce function
    const movies = await fetchData(event.target.value)   // fetch data from movie API site - search for a list of movies
    for (movie of movies){
        const div = document.createElement('div');
        div.innerHTML = `
        <h1>${movie.Title}</h1>
        <img src="${movie.Poster}"/>
        `;
        document.querySelector('#target').appendChild(div);
    }
};
input.addEventListener('input', debounce(onInput,1000)); // listen to the text input box

