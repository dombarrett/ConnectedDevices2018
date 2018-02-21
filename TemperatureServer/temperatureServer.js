var ads1x15 = require('node-ads1x15');
var chip = 0; //0 for ads1015, 1 for ads1115

//Simple usage (default ADS address on pi 2b or 3):
var adc = new ads1x15(chip);

// Optionally i2c address as (chip, address) or (chip, address, i2c_dev)
// So to use  /dev/i2c-0 use the line below instead...:

//    var adc = new ads1x15(chip, 0x48, 'dev/i2c-0');

var channel0 = 0; //channel 0, 1, 2, or 3...
var channel1 = 1;
var samplesPerSecond = '250'; // see index.js for allowed values for your chip
var progGainAmp = '4096'; // see index.js for allowed values for your chip

//somewhere to store our reading
var tempReading  = 0;
var potReading = 0;

//if you want to do repeatedly, per millisecond:
//setInterval(readAndPostTemp,1111);

//if you want to run once:
readAndPostTemp();

function readAndPostTemp(){
//Temperature Reading
if(!adc.busy)
{
  adc.readADCSingleEnded(channel0, progGainAmp, samplesPerSecond, function(err, data) {
    if(err)
    {
      //logging / troubleshooting code goes here...
      throw err;
    }
    // if you made it here, then the data object contains your reading!
    tempReading = ((data-100)/10)-40;
    console.log("Pin 0 Data: "+data);
    console.log("Pin 0 Temp Reading: " + tempReading);



    /*
    	Simple HTTP/HTTPS request example
    	Demonstrates a POST request with the body sent as JSON
    	created 19 April 2015
    	by Tom Igoe
    	based on node.js and stackoverflow examples

      //found here:
      https://github.com/tigoe/NodeExamples/tree/master/SimpleClient


    */

    // you can do this with http or https:
    var http = require('https');

    // make the POST data a JSON object and stringify it:
    var postData =JSON.stringify({
      "macAddress":"B8:27:EB:57:7E:09",
      "sessionKey": "eb9c27a5-b51a-4412-a31d-89808b6c1638",
      "data": {"temp":tempReading}
    });

    /*
     set up the options for the request.
     the full URL in this case is:
     http://example.com:443/login
    */

    var options = {
      host: 'connected-devices-itp.herokuapp.com',
      port: 443,
      path: '/add',
    	method: 'POST',
    	headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    /*
    	the callback function to be run when the response comes in.
    	this callback assumes a chunked response, with several 'data'
    	events and one final 'end' response.
    */
    function callback(response) {
      var result = '';		// string to hold the response

      // as each chunk comes in, add it to the result string:
      response.on('data', function (data) {
        result += data;
      });

      // when the final chunk comes in, print it out:
      response.on('end', function () {
        console.log(result);
      });
    }

    // make the actual request:
    var request = http.request(options, callback);	// start it
    request.write(postData);							// send the data
    request.end();												// end it


      //End of HTTP posting
     }    // any other data processing code goes here...
     //Ending the ADC read
    );
  }

//end main readAndPostTemp function
}
