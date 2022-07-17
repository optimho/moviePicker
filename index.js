

const dropdownSelectorConfig={
/*


 */
    renderOption: (movie)=>{                                   //What the render looks like
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster  //check that the movie has a link to a poster
                                                                   // don't try and get a poster if none is available
        return `
            <img src="${imgSRC}" alt=""/>
            ${movie.Title} (${movie.Year})
            `;
    },

    inputValue (movie){                                // Write the name of the movie to the text box after selection
        return movie.Title;
    },
    async fetchData(searchTerm){                        // Search and return a list of movies - from an API

        const response = await axios.get('http://www.omdbapi.com/', {
            //fetch a list of movies from a movie API site
            params: {
                apikey: '95cacf70',
                s: searchTerm            // API specifies s for searching the index - www.omdbapi.com
            }                            // for the specification of the API
        });
        if (response.data.Error){        // check for error - nothing found
            console.log('No title with that name found!! try something else');
            return [];
        }
        return response.data.Search;
        // console.log(response.data);

    }

};

createDropdownSelector({
    ...dropdownSelectorConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect (movie){                            // Select a movie from the dropdown
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'),'left');
    },//where to render the data in index.html

});
createDropdownSelector({
    ...dropdownSelectorConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect (movie){                            // Select a movie from the dropdown
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },//where to render the data in index.html
});

let leftside;
let rightside;
const onMovieSelect = async (movie, targetLocation, side) =>{
    /*
    This function goes back to the API and gets more information.
     */

        const response = await axios.get('http://www.omdbapi.com/', {  //fetch a list of movies from a movie API site
            params: {
                apikey: '95cacf70',
                i: movie.imdbID            // API specifies i getting movie with specific ID
            }                              // See the specification of the API on www.omdbapi.com
        });


    targetLocation.innerHTML = movieTemplate(response.data)
    if (side==='left'){
        leftside = response.data;
    } else
        rightside = response.data;
    if (leftside && rightside){
        runComparison();
    }
}

const runComparison = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');

    leftStats.forEach((leftSideStats, index)=>{
        rightSideStats = rightStats[index];

        const leftSideValue = parseInt(leftSideStats.dataset.value)
        const rightSideValue =parseInt(rightSideStats.dataset.value)
        console.log(leftSideValue, ' --o-- ', rightSideValue)


        if (rightSideValue > leftSideValue){
            console.log(leftSideValue, ' --o-- ', rightSideValue)
            leftSideStats.classList.remove('is-primary')
            leftSideStats.classList.add('is-warning')
            rightSideStats.classList.add('is-primary')
            rightSideStats.classList.remove('is-warning')
        } else if (rightSideValue < leftSideValue){
            console.log('---equal---')
            rightSideStats.classList.remove('is-primary')
            rightSideStats.classList.add('is-warning')
            leftSideStats.classList.add('is-primary')
            leftSideStats.classList.remove('is-warning')
        }
        else {
           console.log('must be equal')
            rightSideStats.classList.remove('is-primary')
            rightSideStats.classList.remove('is-warning')
            leftSideStats.classList.remove('is-primary')
            leftSideStats.classList.remove('is-warning')
        }
    })
}

const movieTemplate = (movieDetail) =>{
/*
 This object holds the html to display data on the screen.
 This is how and what to display.

 */
    imDBRating = parseFloat(movieDetail.imdbRating)
    imDBVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

    //total number of nominationsSplit and winsSplit
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) =>{
        const value = parseInt(word);

        if (isNaN(value)){
            return prev;
        }else
        {
            return prev+value
        }
    }, 0);
    // console.log(awards)
    //
    const winsSplit= movieDetail.Awards.split(' ')
    const nominationsSplit= movieDetail.Awards.split(' ')
    const wins = winsSplit[winsSplit.indexOf("wins",0)-1] ? winsSplit[winsSplit.indexOf("wins",0)-1] : 0
    const nominations = nominationsSplit[nominationsSplit.indexOf("nominations",0)-1] ?
        nominationsSplit[nominationsSplit.indexOf("nominations",0)-1] : 0



    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" alt="" />
            </p>
        </figure>
        <div class="media-content"> 
            <div class="content"
                <h1>${movieDetail.Title} (${movieDetail.Year})</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
           </div>     
        </div> 
    </article>
    <article data-value=${nominations} class="notification is-primary">
        <p class="title">${nominations}</p>
        <p class="subtitle">Nominations</p>
    </article>     
        <article data-value=${wins} class="notification is-primary">
        <p class="title">${wins}</p>
        <p class="subtitle">Wins</p>
    </article>     
    <article data-value=${imDBRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>        
 
    <article data-value=${imDBVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>         
    `
}
// <article className="notification is-primary">
//     <p className="title">${movieDetail.Ratings[0].Value}</p>
//     <p className="subtitle">${movieDetail.Ratings[0].Source}</p>
// </article>
