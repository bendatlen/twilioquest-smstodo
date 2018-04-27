node.js application using Twilio to respond to provide an SMS based ToDo list.  This web server in this example uses port 1337 which can be changed in the code `http.createServer(app).listen(`**1337**`, () => {`

## Requirements
[NodeJS and NPM](http://nodejs.org/download)   

## Related modules
[twilio](https://www.npmjs.com/package/twilio) - Twilio helper library for node   
[express](https://github.com/visionmedia/express) - web application framework for node   
[body-parser](https://www.npmjs.com/package/body-parser) - Parse message request bodies   
[dotenv](https://www.npmjs.com/package/dot-env) - merges .env file into process.env runtime for using environment variables   

## License
None    

## User Guide
The application accepts request to **_add_** an item to your ToDo list, **_remove_** an item by its numbered place in the list and provide a **_list_** of all ToDo list items.   

### Add an item
start your SMS message with the word **_add_** followed by a space and then the item you wish to add.  Each item added to the list is prefixed with a number.  Items are are numbered in the order they are addedd to the list.  Any string is accepted but only one item can be added at a time.   

### List your items
Send the word **_list_** in your SMS to get a list of numbered items currently in your list.   

### Remove an item
Start your SMS with the word **_remove_** followed by a space and the number of the item you'd like to remove from your list.   

#### Example
`remove 1` will delete your first item in the list, `remove 2` will delete your second item and so on.  The application will reply to advise which item was removed and what your remaining list now contains.  When deleting an item the application also re-numbers the remaining items so there are no gaps in the number sequence.

