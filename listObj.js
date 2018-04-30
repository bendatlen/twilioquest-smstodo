// An object that stores a list of items and holds functions for managing the list that add, list, delete and reorder the list
// which is called after a deletion of an item to reset the numbers appended

var list = {

    // An empty array for the list to be created in
    _list: [],
  
    // Adds an item to the list and prefixes it with a number.  Items are are numbered in the order they are addedd to the list
    addItem: function(newItem) {
      var nextNum = this._list.length + 1;
      this._list.push(nextNum + '. ' + newItem);
    },
   
    // Delete an item from the list based on the item's number in the list and also return the item that was deleted with the number prefix removed
    deleteItem: function(itemNum) {
      var i = itemNum - 1;
      var deletedItem = this._list[i];
      var dotIndex = deletedItem.indexOf(".");
      deletedItem = deletedItem.slice(dotIndex + 1,);
      this._list.splice(i,1);
      return deletedItem;
    },
  
    // Re-number the items in the list.  This is called after an item is deleted from the list
    reorderItems: function() {
      for(i = 0; i < this._list.length; i++) {
        var dotIndex = this._list[i].indexOf(".");
        var item = this._list[i].slice(dotIndex + 1,);
        item = i + 1 + '. ' + item;
        this._list[i] = item;
      }
    }
  };
  
  // Allows this object and it's contents to be called by other js code elsewhere in the library  
  exports.list = list
  