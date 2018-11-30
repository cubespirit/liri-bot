require("dotenv").config();
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var fs = require('fs');

function song(trackname) {
    var spotify_search = new Spotify(keys.spotify);
    // takes param info and generates logs song information
    function displayresults(info) {
        var trackinfo = info;
        var artist = trackinfo.tracks.items[0].artists[0].name;
        var name = trackinfo.tracks.items[0].name;
        var album = trackinfo.tracks.items[0].album.name;
        var link = trackinfo.tracks.items[0].external_urls.spotify;
        console.log(
            `Track Name: ${name}
Artist: ${artist}
Album: ${album}
Preview Link: ${link}`);
    }

    // if (trackname === "") {
    //     var artistname = 'Ace of Base';
    //     spotify_search.search({ type: 'artist', query: artistname }, function (err, data) {
    //         if (err) {
    //             return console.log('Error occurred: ' + err);
    //         }
    //         //displayresults(data);
    //         console.log(data);
    //     });
    // }
    spotify_search.search({ type: 'track', query: trackname }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        displayresults(data);
    });
}

function show(showname) {
    var url = 'https://rest.bandsintown.com/artists/' + showname + '/events?app_id=codingbootcamp';
    axios.get(url)
        .then(function (response) {
            var data_array = [];
            data_array = response.data;
            data_array.forEach(function (element, index) {
                var name = response.data[index].venue.name;
                var city = response.data[index].venue.city;
                var country = response.data[index].venue.country;
                var date = response.data[index].datetime;
                console.log(
                    `Venue Name: ${name}
Location: ${city}, ${country}
Date: ${date}
`
                );
            })
        }
        )
        .catch(function (err) {
            console.log(err);
        });
}

function movie(moviename) {
    if (moviename === "") {
        moviename = "Mr. Nobody";
    }
    var url = 'http://www.omdbapi.com/?apikey=trilogy&t=' + moviename;
    axios.get(url)
        .then(function (response) {
            var title = response.data.Title;
            var year = response.data.Year;
            var imdb_rating = response.data.imdbRating;
            var rt_rating = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;
            console.log(
                `Title: ${title}
Year: ${year}
IMDB Rating: ${imdb_rating}
RT Rating: ${rt_rating}
Country: ${country}
Language: ${language}
Summary: ${plot}
Cast: ${actors}`
            );
        }
        )
        .catch(function (err) {
            console.log(err);
        }
        )
}

function readtxt() {
    require.extensions['.txt'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
    };
    var commands = require("./random.txt").split(',');
    interpret(commands[0], commands[1]);
};

function interpret(command, input) {
    if (command === 'spotify-this-song') {
        song(input);
    } else if (command === 'concert-this') {
        show(input);
    } else if (command === 'movie-this') {
        movie(input);
    } else if (command === 'do-what-it-says') {
        readtxt();
    } else {
        console.log("invalid input");
    }
}

function inputmaker() {
    var query = "";
    var count = 3;
    while (count < process.argv.length) {
        query += process.argv[count];
        if (count === process.argv.length - 1) {
            break;
        }
        query += " ";
        count++;
    }
    return query;
}

interpret(process.argv[2], inputmaker())