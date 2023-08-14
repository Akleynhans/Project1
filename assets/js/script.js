var searchBTN = document.querySelector('#searchBTN');
var searchInput = document.querySelector('#searchInput');
var resultBody = document.querySelector('#searchBody');
var modalBTNEl = document.querySelector(".modalBTN");
var modal = document.querySelector('#streaming-modal');
var searchHistoryContainer = document.querySelector('#searchHistory')
var addedInfo = ""
var searchArray = [];

render()

function search(event) {
    event.preventDefault();

    var input = searchInput.value.split(' ');


    for (let i = 0; i < input.length; i++) {

        if (i > 1) {
            input[i] = '%20' + input[i];
        }
    }
    addedInfo = input.toString();
    mbdFetch(addedInfo)

    // add to array
    var historyInput = searchInput.value

    searchArray.unshift(historyInput)


    // if array is more than 10 drop last one
    if (searchArray.length >= 11) {
        searchArray.pop();
        searchHistoryContainer.removeChild(searchHistoryContainer.lastChild);
    }

    // save to local storage and create button for search history
    localStorage.setItem("searchHistory", JSON.stringify(searchArray))



    var buttonCreate = document.createElement('button');
    searchHistoryContainer.prepend(buttonCreate);
    buttonCreate.setAttribute("data-movie", historyInput);
    buttonCreate.setAttribute("data-addedInfo", addedInfo);
    buttonCreate.classList.add('m-2')
    buttonCreate.textContent = historyInput;

}

function mbdFetch(addedInfo) {

    const baseurl = 'https://movie-database-alternative.p.rapidapi.com/?s=';
    var url = baseurl + addedInfo + '&r=json&page=1'

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '57a746aabcmsh658867c83d6065ap1700c3jsn4f3fcf862c0f',
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // remove previous search results
            while (resultBody.firstChild) {
                resultBody.removeChild(resultBody.firstChild);
            }
            while (modal.firstChild) {
                modal.removeChild(modal.firstChild);
            }

            // get results to 10 elements
            if (data.Search.length > 10) {
                while (data.Search.length > 10) {
                    var resultsArray = data.Search.pop();
                }
            } else[
                resultsArray = data.Search
            ]
            console.log(resultsArray)
            // go through array and get data
            resultsArray.forEach(element => {
                createElements(element);
                
            });

        })

}

// create search string of movie results for streaming API
function searchstring(element) {


    if (/\s/g.test(element.Title)) {
        var input = element.Title.split(' ');
        for (let i = 1; i < input.length; i++) {
            input[i] = '%20' + input[i];
        }
    } else {
        input = element;
    }

    var addedInfo = input.toString().replace(/\,/g, '');
    console.log(addedInfo)

}

// fetch data of titles from streaming API
function streamingAvailabilityFetch(addedInfo) {
    const baseurl = 'https://streaming-availability.p.rapidapi.com/search/title?title=';
    var url = baseurl + addedInfo + '&country=us&show_type=all&output_language=en'


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e1c974e9dcmsha9f352e05da7a40p1dac8ejsn8e24321481cc',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            streamingResults(data)
            console.log(data)
        })

}

// create elements to display data from moviedatabase API
function createElements(element) {


    // create cards for results
    var resultCard = document.createElement('div');
    resultCard.classList.add('box', 'is-flex', 'is-flex-direction-column')
    resultBody.append(resultCard);

    // fill card
    var title = document.createElement('h2');
    title.classList.add('has-text-weight-bold','is-size-6', 'm-1')
    var year = document.createElement('p');
    year.classList.add('is-size-7', 'm-1')
    var type = document.createElement('p');
    type.classList.add('is-size-7', 'm-1')
    var poster = document.createElement('img');
    poster.classList.add('m-1', 'poster')
    var modalBTN = document.createElement('button');


    resultCard.append(title);
    resultCard.append(year);
    resultCard.append(type);
    resultCard.append(poster);
    resultCard.append(modalBTN);
    modalBTN.classList.add('modalBTN')
    // add data attribute to button to search for streaming options
    
    var movieTitle = element.Title.split(' ');

    for (let i = 0; i < movieTitle.length; i++) {

        if (i < 0) {
            movieTitle[i] = '%20' + movieTitle[i];
        }
    }
    var searchKey = movieTitle.toString();

    modalBTN.setAttribute("data-searchKey", searchKey);

    // populate cards
    title.textContent = element.Title;
    year.textContent = 'Release Year: ' + element.Year;
    type.textContent = 'Type: ' + element.Type;
    poster.src = element.Poster;
    modalBTN.textContent = 'Streaming Options';

}

function streamingResults(data) {
    modal.innerHTML = ""
    // create modal elements
    var modalContent = document.createElement('div');

    // append modal elements
    modal.append(modalContent);
    modalContent.classList.add('modal-content');


    // for loop search for results
    // populate modal with 5 modes of streaming
    for (let i = 0; i < 6; i++) {
        var modalStreamInfo = document.createElement('section');
        modalStreamInfo.classList.add('is-flex', 'is-flex-direction-row', 'columns', 'borderbott')
        var serviceName = document.createElement('h2');
        serviceName.classList.add('is-uppercase', 'has-text-weight-bold', 'column', 'is-one')
        var streamingType = document.createElement('p');
        streamingType.classList.add('column', 'is-one');
        var quality = document.createElement('p');
        quality.classList.add('column', 'is-one');
        var link = document.createElement('a');
        link.classList.add('column', 'is-one');
        // append elements
        modalContent.append(modalStreamInfo);
        modalStreamInfo.append(serviceName);
        modalStreamInfo.append(streamingType);
        modalStreamInfo.append(quality);
        modalStreamInfo.append(link);
        // populate elements
        serviceName.textContent = data.result[0].streamingInfo.us[i].service;
        streamingType.textContent ='Streaming Type: ' + data.result[0].streamingInfo.us[i].streamingType
        quality.textContent = 'Quality: ' + data.result[0].streamingInfo.us[i].quality
        link.href = data.result[0].streamingInfo.us[i].link
        link.target = "_blank";
        link.textContent = 'LINK'
    }
}

resultBody.addEventListener('click', function (event) {
    var element = event.target;
    if (element.matches(".modalBTN")) {
        var searchKey = element.getAttribute("data-searchKey")
        streamingAvailabilityFetch(searchKey)
        console.log(searchKey)
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }

})


// pull from local storage
function render() {
    searchArray = JSON.parse(localStorage.getItem("searchHistory"));

    if (searchArray !== null) {


        searchArray.forEach(movie => {

            var input = movie.split(' ');

            for (let i = 0; i < input.length; i++) {

                if (i < 0) {
                    input[i] = '%20' + input[i];
                }
            }
            addedInfo = input.toString();

            var buttonCreate = document.createElement('button');
            buttonCreate.setAttribute("data-movie", movie);
            buttonCreate.setAttribute("data-addedInfo", addedInfo);
            buttonCreate.classList.add('m-2')
            searchHistoryContainer.append(buttonCreate);
            buttonCreate.textContent = movie;
        });

    } else {
        searchArray = [];
    }
}

function buttonClickHandler(event) {
    var moviestring = event.target.getAttribute('data-addedInfo');
    mbdFetch(moviestring)
}


// event listener for buttons
searchBTN.addEventListener('click', search)
searchHistoryContainer.addEventListener('click', buttonClickHandler)

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (e) {

    if (e.target == modal) {
        modal.style.display = "none"
    }
})


