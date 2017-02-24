//Extracting tweets from the rio olympics. Much less decentralized conversation
//Hashtags are checked upon their ISO-3 code names.



var config= require('./config'); 
var Twit= require('twit'); 
var fs= require('fs');
var lupus = require('lupus'); //for asyncronous for-loops
var jsonfile = require('jsonfile')
var geonames = require('search-geonames');
var underscore= require('underscore')

//geonames options
const LANGUAGE = 'eng';
//language option needed for geonames query
var options = {
  language: LANGUAGE
};



var T= new Twit(config);
var parsedTweetCount= 0;
var file= 'ISO-3.JSON';
var outputFilename= 'RioTweets.JSON'


var myData ={
	Uid: '',
	text: '',
	user_id: '',
	location: '',
	destination:{},
	lang: '',
	country: '',
	time_zone: '',
	utc_offset: '',
	geonameLocation: '',
	real_location: ''
}


var stream = T.stream('statuses/filter', { track: '#olympics' })


//load iso-3.JSON file into dictionary 
dictionary={}
jsonfile.readFile(file, function(err, obj) {
  console.dir('done loading dictionary');

  dictionary=obj;
  dictionary= underscore.invert(dictionary);
  startStream();
})


//set up twitter stream

function startStream(){
stream.on('tweet', function (tweet) {
  //console.log(tweet.text)
 // console.log("new tweet =============--------")
	process(tweet);
})

}

//TO DO: retreive a tweet's geoname location
function process(tweet){

	var locations= new Array();
	console.log(tweet.text)
	console.log(tweet.user.location)
	tweetText= tweet.text;


	if (tweet.user.location == null){
		console.log("ADDRESS IS NULL")
		myData.geonameLocation= ' ';
		findDestinations(tweetText);
			} 
		else{

		geonames.searchByQuery(tweet.user.location, callback, options);
		function callback (error, result) {

			console.log("fetching geonameLocation---------------------------------------------------------------------");
			var location= result[0]? result[0].countryIso: "unknown";
			console.log("LOOK HERE========================",result[0])
			if (error) console.log(error); // on error 
			else myData.geonameLocation= location; // on success 
			console.log("recording geonameLocation---------------------------------------------------------------------");

			findDestinations(tweetText);
			//consider only hastagged locations (using a regular expression)
		


       }
   }

       function findDestinations(tweetText){
       		
       		var hashregex= /\S*(?:#)\S*[^\']/g; 
			tweetText= tweetText.match(hashregex);

			if (tweetText== null) tweetText= '%';
				for (var i=0; i< tweetText.length;i++){
					tweetText[i]=tweetText[i].replace('#', '');
					tweetText[i]=tweetText[i].trim();
				}



			//TODO: make recursive and clear the stack
			console.log("tweet text is",tweetText);

			console.log("started looping")

			lupus(0, tweetText.length, function(n) {
				var query= tweetText[n];

				console.log("TRYNA FIND  ", query)

				if(query in dictionary){
					loc=dictionary[query]
					  console.log("LOCATION ALERT  ", loc)
					locations.push(loc);
				}
			}, function() {
					console.log("finished looping")
					append(tweet,locations);

				});

       }
			
			
		}

		function append (tweet, locations){
			myData.Uid= parsedTweetCount; parsedTweetCount++;
			myData.text= tweet.text;
			myData.user_id= tweet.user.id;
			myData.location= tweet.user.location;
			myData.lang= tweet.lang;
			myData.time_zone= tweet.user.time_zone;
			myData.utc_offset= tweet.user.utc_offset;
			myData.destination= locations;
			console.log(myData.Uid)
			console.log('destinations are:',myData.destination);
			console.log('geoname location is', myData.geonameLocation )

			fs.appendFile (outputFilename, JSON.stringify(myData, null, 4),function(err){
				if (err){
					console.log(err);
				} else {
					console.log("JSON saved to "+ outputFilename);
				}
			});
		}
	

		

		



