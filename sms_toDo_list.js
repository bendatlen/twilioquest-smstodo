// Set up ========================================================================
require('dotenv').load();
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();
const list = require("./listObj").list;


// Configuration =================================================================
app.use(bodyParser.urlencoded({'extended':'true'}));		// parse application/x-www-form-urlencoded


// Express routes ================================================================
app.post('/sms', (req, res) => {

	// Variables =================================================================
	const twiml = new MessagingResponse();
	const reqMsg = req.body.Body;
	const reqMsgFirst = reqMsg.substr(0, reqMsg.indexOf(' ')).toLowerCase(); //get first word in msg and convert to lowercase
	const reqMsgRemain = reqMsg.substr(reqMsg.indexOf(' ')); //get remainder of message after first word
	const itemList = list._list;
	const URL = process.env.URL;
	  
	// If message contains one word
	if (reqMsg.split(' ').length <= 1) { 
		// Convert message string to lowercase
		reqMsgLow = (reqMsg.toLowerCase());
		  
		// and if that 1 word string is "list"
	  	if (reqMsgLow == 'list') {
			// If list is empty
			if (itemList.length == 0) {
	    		twiml.message({
					action: URL,
					method: 'POST'
				}, 'nothing in your list');
			// Else list must have something in it so return the contents of the list
	    	} else {
	    		twiml.message({
					action: URL,
					method: 'POST'
				}, 'Your list contains: \n' + itemList.join( "\n" )); //.join( "\n" ) turns array into string with each element separated with a new line
			}
		// Error handling
		} else {
			twiml.message({
				action: URL,
				method: 'POST'
			}, '1st catch all...No Body param match, Twilio sends this in the request to your server.');
		}
	
	// If first word of message is "add" then add a the remainder of the message to the list prefixed with next number in list
	} else if (reqMsgFirst == 'add') {
	    list.addItem(reqMsgRemain);
		twiml.message(reqMsgRemain + ' added to your list!');	
	
	// If first word of message is "remove" then grab the list item's number after the space in the message and remove the key entry
	} else if (reqMsgFirst == 'remove') {
	    var splitMsg = reqMsg.split(' ');
	    var itemNum = splitMsg[1];
		var deletedItem = list.deleteItem(itemNum);

		// If after deleting the item the list becomes empty tell the user the list is now empty
		if (itemList.length == 0) {
			twiml.message(deletedItem + ' deleted. Your list is now empty');
		// If list still has stuff in it renumber the list to maintain consecutive num sequence
		} else if (itemList.length > 0) {
			list.reorderItems();
			twiml.message(deletedItem + ' deleted. Your updated list is: \n' + itemList.join( "\n ")); //.join( "\n" ) turns array into string with each element separated with a new line
		}
	// Error handling
	} else {
		twiml.message('2nd catch all...No Body param match, Twilio sends this in the request to your server.');
	};

	// Response code ==========================================
	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
});


// Status url to send delivery status messages to
app.post ('/status', (req, res) => {

	// Variables =================================================================
	const messageSid = req.body.MessageSid;
	const messageStatus = req.body.MessageStatus;
	const xTwilioSig = req.headers.xTwilioSig;

	console.log('SID: ' + messageSid + ', Status: ' + messageStatus + ', X-Twilio-Signature: ' + xTwilioSig);

	res.writeHead(200, {'Content-Type': 'text/xml'});
	res.end();
});


// Listen (start app) ============================================================
http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});