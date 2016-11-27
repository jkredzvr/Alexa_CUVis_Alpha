var http       = require('http')
  , AlexaSkill = require('./AlexaSkill')
    //UPDATE ALEXA APP_ID, and .....
  , APP_ID     = 'amzn1.ask.skill.5ac278b7-b623-4881-8dc0-51ef374b04a0';
//  , MTA_KEY    = '329e2427-b66b-4de7-8e9d-b602b2b83f87';

//Extend Amazon API by creating a  Constructor
var CUVis = function(){
  AlexaSkill.call(this, APP_ID);
};

//Export our handler for Alexa
exports.handler = function(event, context) {
    var skill = new CUVis();
    skill.execute(event, context);
};

//Extend the AlexaSkill prototype
CUVis.prototype = Object.create(AlexaSkill.prototype);
CUVis.prototype.constructor = CUVis;

//Intent Handling - add additional intents
CUVis.prototype.intentHandlers = {
  CommandIntent: function(intent, session, response){
    handleCommandRequest(intent, session, response);
  },
  RandomIntent: function(intent, session, response){
    handleRandomRequest(intent, session, response);
  },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'Get the distance from arrival for any NYC bus stop ID. ' +
      'Which bus stop would you like?';
    response.ask(speechOutput);
  }
};


//Override prtotype's onLaunch
CUVis.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Welcome to CU Visually V.R. Application. ' +
    'Say the number of a bus stop to get how far the next bus is away.';

  var reprompt = 'Which command would you like?';

  //ask method on response (keep connection open and listen for reply)
  response.ask(output, reprompt);
};

//Method to communicate with MTA API for stop info
//var url = function(stopId){
  return 'http://bustime.mta.info/api/siri/stop-monitoring.json?key=' + MTA_KEY + '&OperatorRef=MTA&MaximumStopVisits=1&MonitoringRef=' + stopId;
};
//var getJsonFromMta = function(stopId, callback){
  http.get(url(stopId), function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};


var getVariables = function(){};
var handleCommandRequest = function(intent, session, response){
  //intent.slots.commands.value
  var text = intent.slots.commands.value + ' was executed using the following variables ' + intent.slots.variableone.value + intent.slots.variabletwo.value + intent.slots.variablethree.value + intent.slots.variablefour.value;
  var cardText = 'Commanded: ' + text;
  var cardHeading = 'Commands ' +  intent.slots.commands.value;
  response.tellWithCard(text, cardHeading, cardText);
};

var handleRandomRequest = function(intent, session, response){
    var text = 'Random words';
    var cardText = 'The next bus is: ' + text;
    var cardHeading = 'Next bus for stop: XXX';
    response.tellWithCard(text, cardHeading, cardText);
};
