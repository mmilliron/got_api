
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

var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
var nextPageToken = null;
var prevPageToken = null;
var prevPageCount = 0;



// grabs json data from api, takes arguments
// searchTerm which is the user entered search
//call back which displays the data
//t which is the page token
function getDataFromAPI(searchTerm, callback, t){
    var query = {
        pageToken: t,
        part: 'snippet',
        key: "AIzaSyA5OLlxxDAdn7hf0ocsE50T2mbSAuHPir0",
        q: searchTerm,
        maxResults: 6,
        type: "video",
        relevanceLanguage: "en"
    }
    $.getJSON(YOUTUBE_BASE_URL, query, callback);
}

//function edits the DOM to display the data
function displayYoutubeSearchData(data){
    var resultElement= "<div class=\"row\">";
    var counter = 0; //allows control for how many results go into each row
    //$("#js-all-results").empty();
    if (data.items){
        data.items.forEach(function(item){
            resultElement += //adds below code for each item in the json file
            "<div class=\'col-sm-12 col-lg-6 result\'>" + 
                "<div class=\"item-container\">" + //sets bootstrap div and then a div inside of it
          '<div class=\'result-title\'><span>' + item["snippet"]["title"] + '<span></div>' + //places title of video above video
           '<iframe src=\'https://www.youtube.com/embed?v=' + item["id"]["videoId"] + "\' data-lity width='1000' height='700' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
                    //"<embed src=\'https://www.youtube.com/watch?v=" + item["id"]["videoId"] + "\' data-lity>"+ //creates hyperlink to lightbox around thumbnail
                    "<img src=\'" + item["snippet"]["thumbnails"]["high"]["url"] + '\'>' + //places high-res thumbnail
                    '</a>'+
                    "<div><a class = \'btn btn-default channel-id\'href=\'https://www.youtube.com/channel/" + item["snippet"]["channelId"] + "\'><p class=\'channel-id-title\'></p></a>" +
          "</div>" +    
        "</div>" +
            "</div>";
            counter++;
            if (counter == 2){ //if counter reaches two then row is done so it resets everything
                resultElement += "</div>";
                $("#videoResults").append(resultElement);
                //resultElement = "#videoResults";//
                counter = 0;
            }
        });
        nextPageToken = data["nextPageToken"]; //updates next page token
        prevPageToken = data["prevPageToken"]; //updates next page token
    }
    else {
        resultElement += '<p>No results</p>'; //displays no results if user doesn't input a valid search
    }
}

function watchSearch(){
    $(".js-form").submit(function(event){ //watches for form to be submitted
        event.preventDefault(); //prevents page refresh
        var query = $(this).find(".js-search-term").val(); //sets query to user inputted data
        getDataFromAPI(query, displayYoutubeSearchData, null); //calls function that takes user input as query, display function as callback, and null as token
    });
};


$(function(){ //ready function
    watchSearch();
    $( ".js-form" ).focus();
});
