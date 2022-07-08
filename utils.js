const debounce = (func, delay=1000) => {
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
        }, delay)
    }
};
