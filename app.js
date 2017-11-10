// 1: STATE OBJECT (global vars) :

//the state object...
var state = { 
	items: []
};

// DOM <ul> lines added by render process...
var liElt = (    
      '<li>' +
        '<span class="shopping-item js-shopping-item">stuff</span>' +
        '<div class="shopping-item-controls">' +
          '<button class="js-shopping-item-check">' +
            '<span class="button-label">check</span>' +
          '</button>' +
          '<button class="js-shopping-item-delete">' +
            '<span class="button-label">delete</span>' +
          '</button>' +
        '</div>' +
      '</li>'
);

// -----------------------------------------------------------
// 2: STATE modification functions
// strictly mod the state object...
// no jquery in this section...
var addItem = function(state, item) {
	state.items.push({
		product: item,
		crossedOut: false
	});
};

function getItem(state, itemIndex) {
  return state.items[itemIndex];
}

function deleteItem(state, itemIndex) {
  state.items.splice(itemIndex, 1);
}

function updateItem(state, itemIndex, newItemState) {
  state.items[itemIndex] = newItemState;
}


// ----------------------------------------------------------
// 3: DOM RENDER functions (render state to DOM / html)...

function renderItem(item, index, liElt, itemAttrID){
  // grab the template...
  var element = $(liElt);
  // set the list item name to the state elt's name:
  element.find('.js-shopping-item').text(item.product);
  if (item.crossedOut) {
    element.find('.js-shopping-item').addClass('shopping-item__checked');
  }
  element.find('.js-shopping-item-toggle')
  element.attr(itemAttrID, index);
  return element;
}

function renderList(state, listElt, itemAttrID) {
	var itemUL = state.items.map(function(item, index) {
		console.log(item);
		// console.log(index);
		// console.log(state.items[index]);
		return renderItem(item, index, liElt, itemAttrID);		
		});
	listElt.html(itemUL);
};


// ---------------------------------------------------------
// 4: EVENT LISTENERS; the command-control area;
// ...calls state updates based on user input then
// ...calls render functions
function addItems(formElt, listElt, inputField, itemAttrID, state){
    // console.log("addItems func");
	// trigger on form submit...
	formElt.submit(function(event){
		// console.log("submit func...");
		
		// standard stop default behavior of form
		event.preventDefault();
		
		// var for newly added item...
		var justAdded = formElt.find(inputField).val();
	    // console.log(justAdded);
		// put the new item into the state object ...
		addItem(state, justAdded);

		//debug 
		// console.log(state);

		// now render the item to the DOM ...
        renderList(state, listElt, itemAttrID);
        // reset the form 
        this.reset();
    });
}
// 	deleteItems(formElt,deleteFlag,itemAttrID, listElt, state);
function deleteItems(formElt, deleteFlag, itemAttrID, listElt, state) {
	// $(selector).on(event,childSelector,function) 
	listElt.on('click', deleteFlag, function(even) {
        // parseInt(string, radix);
        // parseInt converts first arg to a str parses it, returns an int or NaN
		var itemIndex = parseInt($(this).closest('li').attr(itemAttrID));
		deleteItem(state, itemIndex);
		renderList(state, listElt, itemAttrID);
	})
}

function crossOutItems(listElt,strikeThruFlag,itemAttrID,state){
    // $(selector).on(event,childSelector,function) 
	listElt.on('click', strikeThruFlag, function(event) {
		var itemID = $(event.currentTarget.closest('li')).attr(itemAttrID);
		var tgt = getItem(state, itemID);

		updateItem(state, itemID, {
			product: tgt.product,
			crossedOut: !tgt.crossedOut
        });
        renderList(state, listElt, itemAttrID); 
    }); // end inner func
} // end func	
// -------------------------------------------------------
// 5: instantiate the form after DOM loads
// instantiate the form once the DOM is loaded
// same as $(document).ready(function() {...});
$(function() {

    // make some variables which will work w/the event handler funcs processing
	var formElt = $('#js-shopping-list-form'); // the entry form...
	var listElt = $('.js-shop-list'); // the <ul> holding shopList
	var inputField = '#js-shop-list-input'; // for adding a new item (can't use jQuery here) 
    var itemAttrID = 'item-attr-id';  // making an attr at runtime to track the added list items...
	var deleteFlag = '.js-shopping-item-delete' // <li> delete button
	var strikeThruFlag = '.js-shopping-item-check' // <li> check button
	//pass these variables to the addItems listener func...
	addItems( formElt, listElt, inputField, itemAttrID, state);
    //call delete func
	deleteItems(formElt,deleteFlag,itemAttrID, listElt, state);
    //call crossOutItems
    crossOutItems(listElt,strikeThruFlag,itemAttrID,state);
});