/* 

program that reads from text file 'paris-tweet-ids', 
compiles every 100 tweets, and requests their content and parses it 
onto a JSON file, with the text status, user id and geo tag.


*/



//import nesscary libraries
var config= require('./config'); 
var Twit= require('twit'); 
var asyncLoop = require('node-async-loop');
var fs= require('fs');
var LineByLineReader = require('line-by-line');
var geonames = require('search-geonames');
var request ='';
var requestc= 0;
var parsedTweetCount= 0;
var tweetcount=0;
var maxRequestcounter=0;
var min=100;
var max= 1000*60*15;
var timeoutI=100;

//intanciate a twitt API instance to connect with twitter API
var T= new Twit(config);
var tweetid= '';

var myData ={
	Uid: '',
	text: '',
	user_id: '',
	location: '',
	lang: '',
	country: '',
	time_zone: '',
	utc_offset: '',
	geonameLocation: '',
	real_location: ''
}



const LANGUAGE = 'eng';


//language option needed for geonames query


var options = {
  language: LANGUAGE
};



//name of the JSON output file
var outputFilename = 'tweetsetFinalSample.json';

//instaniate filestream from tweet ids text file
 lr = new LineByLineReader('paris-tweet-ids.txt');


lr.on('error', function (err) {
console.log('an error occured');

});
lr.on('end', function () {
	console.log('done reading file');
});

//wait 15 minutes after 180 requests. wait 10th of a second otherwise
if (maxRequestcounter<180){
			timeoutI =min;
		} else{
			timeoutI=max;
		}


//read the current line from the file stream
lr.on('line', function (line) {
	// pause emitting of lines...
	lr.pause();

	// ...do your asynchronous line processing..
	setTimeout(function () {
		compileRequest(line)

		// ...and continue emitting lines.
		lr.resume();
	}, timeoutI);
});


//add the next 100 instances of id to string and send them to re
function compileRequest(line){

	request= (line + ',' + request); //concat id to request , seperate by comma
	requestc++;
	//console.log(line)

	if (tweetcount==99){

		tweetcount=0;
		//setTimeout(sendRequest(request), 1000*60*15); // only send if 15 minutes have passed
		console.log(request);
		sendRequest(request);
		maxRequestcounter++;
		request= '';
		//process.exit(); //test line



	}
	tweetcount++;



}

//setInterval (tweetIt, 1000*20)

//sends request to retreive a 100 ids and add them to filestream
function sendRequest(request){
	console.log('entered function------=============----------');

	T.get('statuses/lookup', {id: request
}, gotData);
				//process.exit(); //test line


	function gotData(err, data, response){
		//var text = data.text;
		//	console.log(text);
			
			console.log("logging data--------------------------------");

			console.log(data);
			console.log(err);
			console.log("data logged--------------------------------");





asyncLoop(data, function (item, next)
{
    	

		if (item.user.location == ''){
		myData.geonameLocation= '';
	} 
		else{
		
		geonames.searchByQuery(item.user.location, callback, options);
		function callback (error, result) {
			console.log("fetching geonameLocation---------------------------------------------------------------------");
			var location= result[0]? result[0].country: "unknown";
			if (error) console.log(error); // on error 
			else myData.geonameLocation= location; // on success 
			console.log(location);
			console.log("recording geonameLocation---------------------------------------------------------------------");
			myData.Uid= parsedTweetCount; parsedTweetCount++;
			myData.text= item.text;
			myData.user_id= item.user.id;
			myData.location= item.user.location;
			myData.lang= item.lang;
			myData.time_zone= item.user.time_zone;
			myData.utc_offset= item.user.utc_offset;
			append();
		}

		function append (){
			fs.appendFile (outputFilename, JSON.stringify(myData, null, 4),function(err){
				if (err){
					console.log(err);
				} else {
					console.log("JSON saved to "+ outputFilename);
				}
			});
		}
	

		

		} 
    next();
}, function ()
{
    console.log('Finished!');
});

	// 	for ( var i=0; i< data.length; i++){



			

	// 	if (data[i].user.location == ''){
	// 	myData.geonameLocation= '';
	// } 
	// 	else{
		
	// 	geonames.searchByQuery(data[i].user.location, callback, options);
	// 	function callback (error, result) {
	// 		console.log("fetching geonameLocation---------------------------------------------------------------------");
	// 		var location= result[0]? result[0].country: "unknown";
	// 		if (error) console.log(error); // on error 
	// 		else myData.geonameLocation= location; // on success 
	// 		console.log(location);
	// 		console.log("recording geonameLocation---------------------------------------------------------------------");
	// 		myData.Uid= parsedTweetCount; parsedTweetCount++;
	// 		myData.text= data[i].text;
	// 		myData.user_id= data[i].user.id;
	// 		myData.location= data[i].user.location;
	// 		myData.lang= data[i].lang;
	// 		myData.time_zone= data[i].user.time_zone;
	// 		myData.utc_offset= data[i].user.utc_offset;
	// 		append();
	// 	}

	// 	function append (){
	// 		fs.appendFile (outputFilename, JSON.stringify(myData, null, 4),function(err){
	// 			if (err){
	// 				console.log(err);
	// 			} else {
	// 				console.log("JSON saved to "+ outputFilename);
	// 			}
	// 		});
	// 	}
	

		

	// 	} 
	// }

	} 

}

/*function tweetIt(line){

	T.get('statuses/show/:id', {id: line
}, gotData)


	
	function gotData(err, data, response){
		var text = data.text;
			console.log(text);
	} 

	
	
} */
