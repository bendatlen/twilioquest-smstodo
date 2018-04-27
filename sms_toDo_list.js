// Set up ================================================================
require('dotenv').load();
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();
const list = require("./listObj").list;


// Configuration =========================================================
app.use(bodyParser.urlencoded({'extended':'true'}));		// parse application/x-www-form-urlencoded

// Express routes ================================================================
app.post('/sms', (req, res) => {

	// Variables =============================================================
	const twiml = new MessagingResponse();
	const reqMsg = req.body.Body;
	const reqMsgFirst = reqMsg.substr(0, reqMsg.indexOf(' ')); //get first word in msg
	const reqMsgRemain = reqMsg.substr(reqMsg.indexOf(' ')); //get remainder of message after first word
	const itemList = list._list;
	const URL = process.env.URL;
	  
	// If first word in message is "add" then add the remainder of the message to the toDo list and send a confirmation sms back
	
	// If message contains one word
	if (reqMsg.split(' ').length <= 1) { 
		  
		// and if that 1 word is "list" or "List" then list items in toDo 
	  	if (reqMsg == 'list' || reqMsg == 'List') {
			if (itemList.length == 0) {
	    		twiml.message({
					action: URL,
					method: 'POST'
				}, 'nothing in your list');
	    	} else {
	    		twiml.message({
					action: URL,
					method: 'POST'
				}, "Your list contains: " + itemList);
	    	}
		} else {
			twiml.message({
				action: URL,
				method: 'POST'
			}, '1st catch all...No Body param match, Twilio sends this in the request to your server.');
		}
	
	// if first word of message is "add|Add" then add a the remainder of the message to the list prefixed with next number in list
	} else if (reqMsgFirst == 'add' || reqMsgFirst == 'Add') {
	    list.addItem(reqMsgRemain);
		twiml.message(reqMsgRemain + ' added to your list!');	
	
	// if first word of message is "remove|Remove" then grab the list item's number and remove the key entry
	} else if (reqMsgFirst == 'remove' || reqMsgFirst == 'Remove') {
	    var splitMsg = reqMsg.split(' ');
	    var itemNum = splitMsg[1];
		var deletedItem = list.deleteItem(itemNum);

		if (itemList.length == 0) {
			twiml.message(deletedItem + "deleted. Your list is now empty");
		} else if (itemList.length > 0) {
			// After an item is deleted the list is renumbered to maintain consecutive num sequence
			list.reorderItems();
			twiml.message(deletedItem + " deleted. Your updated list is: " + itemList);
		}
	} else {
		twiml.message('2nd catch all...No Body param match, Twilio sends this in the request to your server.');
	};

	// response code ==========================================
	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
});

// Status url to send delivery status messages to
app.post ('/status', (req, res) => {

	// Variables ==============================================
	const messageSid = req.body.MessageSid;
	const messageStatus = req.body.MessageStatus;
	const xTwilioSig = req.headers.xTwilioSig;

	console.log('SID: ' + messageSid + ', Status: ' + messageStatus + ', X-Twilio-Signature: ' + xTwilioSig);

	res.end();
});

// Listen (start app) ======================================
http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});