


const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '95cacf70',
            s: searchTerm
        }
    });
    console.log(response.data);
};

const input = document.querySelector('input');

const debounce = (func) => {
    /*
    function denounces an input, it will only fire what's in the test input box after a second of no  activity
    every time a key is pressed the timer is reset back to 0 seconds
     */
    let timeOutId;
    return (...args) => {
        if (timeOutId) {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(() => {
            func.apply(this, args);
        }, 1000)
    }

};

const onInput = debounce(event => {
    fetchData(event.target.value)
});

input.addEventListener('input', onInput);
