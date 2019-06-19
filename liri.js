require("dotenv").config();
// Spotify Starts Here
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");
let default_song = "Sign of the Times"; 

// Concert API

// Commands
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

//https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp
// Return the following:
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")

// Get arguments
let arguments = "";
for(let i = 3; i < process.argv.length; i++){
  arguments = "" + arguments + " " + process.argv[i];
}

// Check for command in arguments 
  // concert-this
  // spotify-this-song
  // movie-this
  // do-what-it-says

if (process.argv[2] == "concert-this"){
  // Search concerts
  getConcertInfo(arguments);
}
if (process.argv[2] == "spotify-this-song"){
  // Search spotify
  getSpotifySong(arguments);
}
if(process.argv[2] == "movie-this"){
  // Search Movies 
  getMovieInfo(arguments);
}
if(process.argv[2] == "do-what-it-says"){
  // Search what it says 
  pickRandomCommand();
}

function getSpotifySong(song_name){
    let spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
      });
      
      let spotify_search_results;
    
      spotify.search({ type: 'track', query: song_name }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        spotify_search_results = data.tracks.items;
          if(spotify_search_results.length > 0){
            // Print Song Results Here
            console.log("Found results!")
            let song = spotify_search_results[0];
            let artist = song.artists[0].name;
            let name = song.name;
            let link = song.preview_url;
            let album = song.album.name;
          
             console.log("=========== Print Starts Here");
             console.log("Artist: " + artist);
             console.log("Song Name: " + name);
             console.log("Song Preview Link: " + link);
             console.log("Album: " + album);   
             console.log("=========== Print Ends Here");
          }else {
            // Print Default Song Here
            console.log("Default Song Picked");
            spotify.search({ type: 'track', query: default_song }, function(err, data) {
              if (err) {
                return console.log('Error occurred: ' + err);
              }
              // Set search results to variable
              spotify_search_results = data.tracks.items;
              let song = spotify_search_results[0];
              
              // Extract all Info
              let artist = song.artists[0].name;
              let name = song.name;
              let link = song.preview_url;
              let album = song.album.name;
             
             console.log("=========== Default Print Starts Here");
             console.log("Artist: " + artist);
             console.log("Song Name: " + name);
             console.log("Song Preview Link: " + link);
             console.log("Album: " + album);   
             console.log("=========== Print Ends Here");
            })   
          }
          });
} 

function getConcertInfo(artist){
  const axios = require('axios');

  // Make a request for a user with a given ID
  axios.get('https://rest.bandsintown.com/artists/' + artist.trim() + '/events?app_id=codingbootcamp')
    .then(function (response) {
      // handle success
      // Name of the venue
      // Venue location
      // Date of the Event (use moment to format this as "MM/DD/YYYY")
      let concert_info = response.data;
      console.log("============Got some concert info back!=========== ");
      concert_info.forEach(function(concert){ 
        let name_venue = concert.venue.name;
        let venue_location = concert.venue.city;
        let venue_date = concert.datetime;
        console.log("Name of Venue: " + name_venue);
        console.log("Venue Location: " + venue_location);
        console.log("Venue Date: " + venue_date);
        console.log("--------------------------------------------------------");
        console.log(" ");
      }); 
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function getMovieInfo(movie_name){
  const axios = require('axios');
  // Make a request for a user with a given ID
  
  axios.get('http://www.omdbapi.com/?t=' + movie_name.trim() + '&apikey=' + keys.movie_db.key)
    .then(function (response) {
      // handle success
      let movie_info = response.data;
      console.log("============Got some Movie info back!=========== ");
      // console.log(JSON.stringify(response));
  // *  Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
      let title = movie_info.Title;
      let year =  movie_info.Year;
      let imdb_rating = "";
      let rotten_tomatoes = "";
      if (movie_info.Ratings.length > 0){
        imdb_rating =  movie_info.Ratings[0].Value;
      }else {
        imdb_rating =  "No IMDB Rating";
      }
      if (movie_info.Ratings.length > 1){
        rotten_tomatoes =  movie_info.Ratings[1].Value;
      }else {
        rotten_tomatoes =  "No Rotten Tomatoes Rating";
      }
      let country = movie_info.Country;
      let language = movie_info.Language;
      let plot = movie_info.Plot;
      let actors = movie_info.Actors;
      console.log("Title: " + title);
      console.log("year: " + year);
      console.log("IMDB_rating: " + imdb_rating);
      console.log("Rotten_Tomatoes: " + rotten_tomatoes);
      console.log("country: " + country);
      console.log("language: " + language);
      console.log("plot: " + plot);
      console.log("Actors: " + actors);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}

function pickRandomCommand(){
  const fs = require('fs') 
  
  fs.readFile('random.txt', (err, data) => { 
      if (err) throw err; 
      let text = data.toString();
      let split_text_array = text.split("\n");
      let random_int = -1;
      while(random_int < 0 || random_int > split_text_array.length - 1){
        random_int = Math.floor(Math.random() * split_text_array.length - 1);
      }
      let command_picked = split_text_array[random_int];
      runCommand(command_picked);
  }) 

  function runCommand(command){
    let commnd_split = command.split(" ");
    let arguments = commnd_split.splice(1).join(" ");
    console.log("Full command: " + commnd_split) ;
    console.log("First command[0]: " + commnd_split[0]);
    if (commnd_split[0] == "concert-this"){
      // Search concerts
      console.log("Arguments: " + arguments);
      getConcertInfo(arguments);
    }
    if (commnd_split[0] == "spotify-this-song"){
      // Search spotify
      console.log("Arguments: " + arguments);
      getSpotifySong(arguments);
    }
    if (commnd_split[0] == "movie-this"){
      // Search Movies 
      console.log("Arguments: " + arguments);
      getMovieInfo(arguments);
    }
  }
}