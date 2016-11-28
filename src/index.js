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
    FullQueryIntent: function(intent, session, response){
        handleFullQueryIntent(intent, session, response);
    },
    ContinentQueryIntent: function(intent, session, response){
        handleContinentQueryIntent(intent, session, response);
    },
    VariableQueryIntent: function(intent, session, response){
        handleVariableQueryIntent(intent, session, response);
    },

    HelpIntent: function(intent, session, response){
        var speechOutput = 'Get the distance from arrival for any NYC bus stop ID. ' +
          'Which bus stop would you like?';
        response.ask(speechOutput);
    }
};


//Override prototype's onLaunch
CUVis.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Welcome to the CU Visually Experience.  You can visualize various university statistics related to student admissions, international funding, and so on.'
    +'  In front of you is a voice command palette showing the different types of commands you can ask me to perform.  Say out loud any commands when you are ready.';

  var reprompt = 'Say out loud any commands when you are ready.';

  //ask method on response (keep connection open and listen for reply)
  response.ask(output, reprompt);
};




var getVariables = function(){};

var handleCommandRequest = function(intent, session, response){
  //intent.slots.commands.value
  var text = intent.slots.commands.value + ' was executed using the following variables ' + intent.slots.variableone.value + intent.slots.variabletwo.value + intent.slots.variablethree.value + intent.slots.variablefour.value;
  var cardText = 'Commanded: ' + text;
  var cardHeading = 'Commands ' +  intent.slots.commands.value;
  response.tellWithCard(text, cardHeading, cardText);
};


var handleFullQueryIntent = function(intent, session, response){
    //intent.slots.commands.value
    // var text = intent.slots.commands.value + ' was executed using the following variables ' + intent.slots.variableone.value + intent.slots.variabletwo.value + intent.slots.variablethree.value + intent.slots.variablefour.value;
    // var cardText = 'Commanded: ' + text;
    // var cardHeading = 'Commands ' +  intent.slots.commands.value;
    // response.tellWithCard(text, cardHeading, cardText);

    //Figure out how many continents
    var continentOneSlot = intent.slots.ContinentOne,
        continentOne;
    var continentTwoSlot = intent.slots.ContinentTwo,
        continentTwo;
    var continentThreeSlot = intent.slots.ContinentThree,
        continentThree;

    //Figure out how many variables

    var variableOneSlot = intent.slots.VariableOne,
        variableOne;
    var variableTwoSlot = intent.slots.VariableTwo,
        variableTwo;
    var variableThreeSlot = intent.slots.VariableThree,
        variableThree;

    //Setting the variables based on recognized slots
    if (continentOneSlot && continentOneSlot.value){
        continentOne = continentOneSlot.value;
    }

    if (continentTwoSlot && continentTwoSlot.value){
        continentTwo = continentTwoSlot.value;
    }
    if (continentThreeSlot && continentThreeSlot.value){
        continentThree = continentThreeSlot.value;
    }
    if (variableOneSlot && variableOneSlot.value){
        variableOne = variableOneSlot.value;
    }
    if (variableTwoSlot && variableTwoSlot.value){
        variableTwo = variableTwoSlot.value;
    }

    if (variableThreeSlot && variableThreeSlot.value){
        variableThree = variableThreeSlot.value;
    }

    var cardTitle = "Got full query response",
        speech = "Processing continents " + continentOne + "," + continentTwo + "," +  continentThree + "and variables " + "," +  variableOne + "," +  variableTwo + "," +  variableThree,
        speechOutput,
        repromptOutput,
        cardContent;

    Console.Log(continentOne);
    if (continentOne) {
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardContent = speech;
        response.tellWithCard(speechOutput, cardTitle, cardContent);

    } else {
        Console.Log("Some sort of error");
        //Invalid query response
        var speech;
        speech = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";

        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "Could you repeat your command again?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

var handleContinentQueryIntent = function(intent, session, response){

    //Figure out how many continents
    var continentOneSlot = intent.slots.ContinentOne,
        continentOne;
    var continentTwoSlot = intent.slots.ContinentTwo,
        continentTwo;
    var continentThreeSlot = intent.slots.ContinentThree,
        continentThree;

    //Setting the variables based on recognized slots
    if (continentOneSlot && continentOneSlot.value){
        continentOne = continentOneSlot.value;
    }
    if (continentTwoSlot && continentTwoSlot.value){
        continentTwo = continentTwoSlot.value;
    }
    if (continentThreeSlot && continentThreeSlot.value){
        continentThree = continentThreeSlot.value;
    }

    var cardTitle = "Got continent query response",
        speech = "Processing continents " + continentOne + ", " + continentTwo + ", " +  continentThree + 'Now please tell me the variables you would like to visualize for the selected continents.' ,
        speechOutput,
        repromptOutput,
        cardContent;

    if (continentOne) {
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "Please tell me the variables you would like to visualize for the selected countries.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardContent = speech;
        response.askWithCard(speechOutput,repromptOutput, cardTitle, cardContent);
        return;

    } else {
        Console.Log("Some sort of error");
        //Invalid query response
        var speech;
        speech = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";

        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "I'm sorry.  I couldnt recognize the continents.  Could you repeat your command again?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

var handleVariableQueryIntent = function(intent, session, response){

    //Figure out how many continents
    var variableOneSlot = intent.slots.VariableOne,
        variableOne;
    var variableTwoSlot = intent.slots.VariableTwo,
        variableTwo;
    var variableThreeSlot = intent.slots.VariableThree,
        variableThree;

    //Setting the variables based on recognized slots
    if (variableOneSlot && variableOneSlot.value){
        variableOne = variableOneSlot.value;
    }
    if (variableTwoSlot && variableTwoSlot.value){
        variableTwo = variableTwoSlot.value;
    }
    if (variableThreeSlot && variableThreeSlot.value){
        variableThree = variableThreeSlot.value;
    }

    var cardTitle = "Got variable query response",
        speech = "Processing variables " + variableOne + ", " + variableTwo + ", " +  variableThree + 'Now please tell me the continents you would like to visualize for the selected variables.' ,
        speechOutput,
        repromptOutput,
        cardContent;

    if (variableOne) {
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "Please tell me the continents you would like to visualize.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardContent = speech;
        response.askWithCard(speechOutput,repromptOutput, cardTitle, cardContent);
        return;
    } else {
        Console.Log("Some sort of error");
        //Invalid query response
        var speech;
        speech = "I'm sorry.  I couldnt recognize the variables that you asked for.  Could you repeat the command again?";

        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "I'm sorry.  I couldnt recognize the variables that you asked for.  Could you repeat the command again?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};



var handleRandomRequest = function(intent, session, response){
    var text = 'Random words';
    var cardText = 'The next bus is: ' + text;
    var cardHeading = 'Next bus for stop: XXX';
    response.tellWithCard(text, cardHeading, cardText);
};
