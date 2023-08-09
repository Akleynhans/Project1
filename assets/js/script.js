var searchBTN = document.querySelector('#searchBTN');
var searchInput = document.querySelector('#searchInput');
var resultBody = document.querySelector('#searchBody');
var modalBTNEl = document.querySelector(".modalBTN");

function search(event) {
    event.preventDefault();

    var input = searchInput.value.split(' ');
    for (let i = 0; i < input.length; i++) {

        if (i < 0) {
            input[i] = '%20' + input[i];
        }
    }
    var addedInfo = input.toString();
    mbdFetch(addedInfo)

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
                searchstring(element);
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

    streamingAvailabilityFetch(addedInfo);

}

// fetch data of titles from streaming API
function streamingAvailabilityFetch(addedInfo) {
    const baseurl = 'https://streaming-availability.p.rapidapi.com/search/title?title=';
    var url = baseurl + addedInfo + '&country=us&show_type=all&output_language=en'


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '57a746aabcmsh658867c83d6065ap1700c3jsn4f3fcf862c0f',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            streamingResults(data)
        })

    // useful data
    // streaming platform = result[i].streamingInfo.us[i].service
    // streaming platform = result[i].streamingInfo.us[i].streamingtype
    // streaming platform = result[i].streamingInfo.us[i].quality
    // streaming platform = result[i].streamingInfo.us[i].link
}

// create elements to display data from moviedatabase API
function createElements(element) {


    // create cards for results
    var resultCard = document.createElement('div');
    resultCard.classList.add('card')
    resultBody.append(resultCard);

    // fill card
    var title = document.createElement('h2');
    var year = document.createElement('p');
    var type = document.createElement('p');
    var poster = document.createElement('img');
    var modalBTN = document.createElement('button');

    resultCard.append(title);
    resultCard.append(year);
    resultCard.append(type);
    resultCard.append(poster);
    resultCard.append(modalBTN);
    modalBTN.classList.add('modalBTN')

    title.textContent = element.Title;
    year.textContent = 'Year: ' + element.Year;
    type.textContent = 'Type: ' + element.Type;
    poster.src = element.Poster;
    modalBTN.textContent = 'Streaming Options';

}

function streamingResults(data) {

    // create modal elements
    var mymodal = document.createElement('div');
    var modalContent = document.createElement('div');
    var close = document.createElement('span')

    // append modal elements
    document.body.append(mymodal);
    mymodal.append(modalContent);
    modalContent.append(close);

    // add classes and ids to elements
    close.classList.add('close');
    mymodal.classList.add('modal');
    modalContent.classList.add('modal-content');
    mymodal.setAttribute("id", "mymodal");
    

    // populate elements
    close.textContent = '&times;'

    // populate modal with 3 modes of streaming
    for (let i = 0; i < 4; i++) {
        var serviceName = document.createElement('h2')
        // append elements
        modalContent.append(serviceName);
        serviceName.textContent = data.result[i].streamingInfo.us[i].service;

    }



}

resultBody.addEventListener('click', function (event) {
    var element = event.target;

    var modal = document.querySelector('#myModal');
    

    if (element.matches(".modalBTN")) {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})


// event listener for search button
searchBTN.addEventListener('click', search)



