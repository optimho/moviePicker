const createDropdownSelector = ({
                               root,
                               renderOption,
                               onOptionSelect,
                               inputValue,
                               fetchData})=>{

    root.innerHTML = `
<label><b>Search</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;

    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async (event) => {                        // pass function fetch data into a debounce function
        const items = await fetchData(event.target.value)     // fetch data from movie API site - search for a list of items
        if (!items.length){                                  //if the text box is empty remove the dropdown box
            dropdown.classList.remove('is-active')
            return;
        }

        resultsWrapper.innerHTML=''                          //clear all the items in the dropdown
        dropdown.classList.add('is-active');

        for (let item of items){                                 //Iterate through the list of items returned from the API
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item)
            option.addEventListener('click', () => {


                dropdown.classList.remove('is-active')
                input.value = inputValue(item);
                onOptionSelect(item);
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

};
