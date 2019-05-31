
'use strict'

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(Object.keys(responseJson));
    // Clearing previous results
    $('.js-error-message').empty();
    $('.results-list').empty();
    // Looping through the response and formatting results
    $('.results').removeClass('hidden');
    $('.results-list').append(`<li>${responseJson[0].name}</li>`);
    $('.results-list').append(`<li> Born: ${responseJson[0].born}</li>`);
    $('.results-list').append(`<li> Culture: ${responseJson[0].culture}</li>`);
    $('.results-list').append(`<li> Played by: ${responseJson[0].playedBy}</li>`);
  };
  
  
function getCharacters(baseUrl, charArr) {
    // Setting up parameters
    const params = {
        name: charArr,
    };
    // Creating url string
    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString;
    console.log(url);
   
  
  // Fetch information, if there's an error display a message
  fetch(url)
  .then(response => {
      if (response.ok) {
          return response.json();
      }
      throw new Error(response.statusText);
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

// Watch search form for submit, call getParks
function watchForm() {
    $('.js-form').on('submit', function() {
        event.preventDefault();
        const baseUrl = 'https://www.anapioficeandfire.com/api/characters/'
        const charArr = $('.js-search-term').val();
        getCharacters(baseUrl, charArr);
    })
}

$(watchForm);

