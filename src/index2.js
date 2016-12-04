'use strict';
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

var AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';

//Replace this
var sqsURL = 'https://sqs.us-east-1.amazonaws.com/522674837128/CUVis_Rev2';


exports.handler = (event, context, callback) => {
    try {
        console.log("event.session.application.applicationId= ${ event.session.application.applicationId}");

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
         if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
         context.fail("Invalid Application ID");
         }
         */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};

// Called when the session starts.
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);


    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    //if ("MyColorIsIntent" === intentName) {
    //    setColorInSession(intent, session, callback);
    //} else if ("FullQueryIntent" === intentName) {
    //    handleFullQueryIntent(intent, session, callback);
    if ("ContinentQueryIntent" === intentName) {
        handleContinentQueryIntent(intent, session, callback);
    } else if ("VariableQueryIntent" === intentName) {
        handleVariableQueryIntent(intent, session, callback);
    } else if ("FullQueryIntent" === intentName) {
        handleFullQueryIntent(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the CU Visually Experience.  You can visualize various university statistics related to student admissions, international funding, and so on.'
        +'  In front of you is a voice command palette showing the different types of commands you can ask me to perform.  Say out loud any commands when you are ready.';

    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Say out loud any commands when you are ready.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



function handleContinentQueryIntent(intent, session, callback) {
    const cardTitle = intent.name;
    const continentOneSlot = intent.slots.ContinentOne;
    const continentTwoSlot = intent.slots.ContinentTwo;
    const continentThreeSlot = intent.slots.ContinentThree;
    let repromptText = "Please tell me the variables you would like to visualize for the selected countries.";
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = "";

    if (continentOneSlot) {
        var continentOne = continentOneSlot.value;
        var continentTwo = continentTwoSlot.value;
        var continentThree = continentThreeSlot.value;
        //sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "Processing continents " + continentOne +" "+ continentTwo + " " + continentThree+"."+'  Now please tell me the variables you would like to visualize for the selected continents.' ;
        repromptText = "Please tell me the variables you would like to visualize for the selected countries.";


        //
        // write to SQS
        //

        var queueUrl = sqsURL;
        var queue = new AWS.SQS({params: {QueueUrl: queueUrl.toString()}});
        var params = {
            MessageBody: '{"Continents":"'+continentOne+','+continentTwo+','+continentThree+'"}'
        }

        queue.sendMessage(params, function (err, data){
            if (err) console.log(err, err.stack);
            else {
                console.log("message Sent");

                //
                // be sure to move the callback to here
                // node is async
                //
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        })




    } else {
        speechOutput = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";
        repromptText = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";

        //
        // be sure to move the callback to here
        // node is async
        //
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }


    //Need to move the callback from here to inside the SQS call.
    // callback(sessionAttributes,
    //         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


function handleVariableQueryIntent(intent, session, callback) {
    const cardTitle = intent.name;
    const variableOneSlot = intent.slots.VariableOne;
    const variableTwoSlot = intent.slots.VariableTwo;
    const variableThreeSlot = intent.slots.VariableThree;
    let repromptText = "Please tell me the continents you would like to visualize for the selected variables.";
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = "";

    if (variableOneSlot) {
        var variableOne = variableOneSlot.value;
        var variableTwo = variableTwoSlot.value;
        var variableThree = variableThreeSlot.value;
        //sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "Processing variables " + variableOne +" "+ variableTwo + " " + variableThree+"."+ '  Now please tell me the variables you would like to visualize for the selected continents.' ;
        repromptText = "Please tell me the variables you would like to visualize for the selected countries.";


        //
        // write to SQS
        //

        var queueUrl = sqsURL;
        var queue = new AWS.SQS({params: {QueueUrl: queueUrl.toString()}});
        var params = {
            MessageBody: '{"Variables":"'+variableOne+','+variableTwo+','+variableThree+'"}'
        }

        queue.sendMessage(params, function (err, data){
            if (err) console.log(err, err.stack);
            else {
                console.log("message Sent");

                //
                // be sure to move the callback to here
                // node is async
                //
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        })




    } else {
        speechOutput = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";
        repromptText = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";

        //
        // be sure to move the callback to here
        // node is async
        //
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    //Need to move the callback from here to inside the SQS call.
    // callback(sessionAttributes,
    //         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleFullQueryIntent(intent, session, callback){
    //intent.slots.commands.value

    const cardTitle = "Got full query response";
    const variableOneSlot = intent.slots.VariableOne;
    const variableTwoSlot = intent.slots.VariableTwo;
    const variableThreeSlot = intent.slots.VariableThree;
    const continentOneSlot = intent.slots.ContinentOne;
    const continentTwoSlot = intent.slots.ContinentTwo;
    const continentThreeSlot = intent.slots.ContinentThree;
    let repromptText = "Please tell me the continents you would like to visualize for the selected variables.";
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = "";

    if (continentOneSlot) {
        var continentOne = continentOneSlot.value;
        var continentTwo = continentTwoSlot.value;
        var continentThree = continentThreeSlot.value;
        var variableOne = variableOneSlot.value;
        var variableTwo = variableTwoSlot.value;
        var variableThree = variableThreeSlot.value;

        //sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "Processing continents " + continentOne + "," + continentTwo + "," +  continentThree + " and variables " + "," +  variableOne + "," +  variableTwo + "," +  variableThree ;
        repromptText = "Please tell me the variables you would like to visualize for the selected countries.";


        //
        // write to SQS
        //

        var queueUrl = sqsURL;
        var queue = new AWS.SQS({params: {QueueUrl: queueUrl.toString()}});
        var params = {
            //MessageBody: '{"Continents":'+continentOne+','+continentTwo+','+continentThree+'};{"Variables:"'+variableOne+','+variableTwo+','+variableThree'}'
            MessageBody: '{"Variables":"'+variableOne+','+variableTwo+','+variableThree+'"};{"Continents":"'+continentOne+','+continentTwo+','+continentThree+'"}'
        }

        queue.sendMessage(params, function (err, data){
            if (err) console.log(err, err.stack);
            else {
                console.log("message Sent");

                //
                // be sure to move the callback to here
                // node is async
                //
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        })

    } else {
        speechOutput = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";
        repromptText = "I'm sorry.  I couldn't recognize your voice command.  Could you repeat your command again?";

        //
        // be sure to move the callback to here
        // node is async
        //
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    //Need to move the callback from here to inside the SQS call.
    // callback(sessionAttributes,
    //         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}




// function createFavoriteColorAttributes(string id, favoriteColor) {
//     return {
//         id: favoriteColor
//     };
// }

// function getColorFromSession(intent, session, callback) {
//     var favoriteColor;
//     var repromptText = null;
//     var sessionAttributes = {};
//     var shouldEndSession = false;
//     var speechOutput = "";
//
//     if (session.attributes) {
//         favoriteColor = session.attributes.favoriteColor;
//     }
//
//     if (favoriteColor) {
//         speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye. oh, and by the way, You have nice hair today.";
//         shouldEndSession = true;
//     } else {
//         speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
//             " is red";
//     }
//
//     // Setting repromptText to null signifies that we do not want to reprompt the user.
//     // If the user does not respond or says something that is not understood, the session
//     // will end.
//     callback(sessionAttributes,
//         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
// }



function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Unity Voice Command. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}