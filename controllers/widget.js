/*--------------------------------------------------------
* Initialization.
*-------------------------------------------------------*/
var args = arguments[0] || {};
var outerView = args.outerView;

// Placeholder for picker data.
var pickerData = [];

// Placeholder for keeping track of key/value pairs.
var pickerValueArray = [];

// For single-picker columns on Android, use an option dialog.
var androidSpecificTypes = ['single-column'];
var androidSpecific = (OS_ANDROID && _.contains(androidSpecificTypes, args.type));

// Placeholder elements.
var pickerView;
var picker;
var optionsDialog;



/*--------------------------------------------------------
* Initialization.
*-------------------------------------------------------*/

// On iOS, hide the nav bar if requested.
if (OS_IOS && args.hideNavBar === true) {
  outerView.hideNavBar();
}


var overlay = Widget.createController('overlay').getView();
  // Create the controller for the picker view.
  // Pass callback functions to controller.
var pickerController = Widget.createController('pickerView', {
    type: args.type,
    pickerParams: args.pickerParams,
    parentFunctions: {
      close: close,
      done: done
    }
  });
pickerView = pickerController.getView('pickerView');
if (pickerView.children) {
        for (var c = pickerView.children.length - 1; c >= 0; c--) {
            if(pickerView.children[c].id !== undefined && pickerView.children[c].id === 'picker') {
                picker = pickerView.children[c];
            }
        }
    }



outerView.add(overlay);
outerView.add(pickerView);


/**
* Get the value from a selected row.
*
* @param index
*   Index for the picker column. Defaults to 0.
*/
function getSelectedRowTitle(index) {
  index = index || 0;
  return picker.getSelectedRow(index).title;
}

/**
* Get index for key from pairs.
*
*/
function getKeyIndexFromPairs(pairs, key) {
  pairs = pairs || [];
  key = key || null;
  var rowIndex = null;

  // Determine index.
  _.each(pairs, function(pair, index) {
    if (key == pair[0]) {
      rowIndex = index;
      return;
    }
  });

  return rowIndex;
}

/**
* Determine the the key of the pair in this array.
*
* @param pairs
*   Array of pairs.
* @param title
*   Title that is currently selected.
*/
function getKeyFromPairs(pairs, title) {
  pairs = pairs || [];
  title = title || null;
  var key = null;

  // Determine key.
  _.each(pairs, function(pair) {
    if (title == pair[1]) {
      key = pair[0];
      return;
    }
  });

  return key;
}

/**
* User clicks done.
*/
function done(e) {
  // Return data.
  var data = null;

  // Boolean for cancel data.
  var cancel = false;

     // Determine the selected date.
    var selectedDate = picker.getValue();
    // Error checking for minimum selected date.
    if (_.isDate(args.pickerParams.maxSelectedDate) && (selectedDate > args.pickerParams.maxSelectedDate)) {
      if (_.isString(args.pickerParams.maxSelectedDateErrorMessage)) {
        var message = args.pickerParams.maxSelectedDateErrorMessage;
      }
      else {
        var message = 'The date you selected is not valid';
      }
      var alertDialog = Ti.UI.createAlertDialog({
        title: "Error",
        message: message,
        buttonNames: ['Ok']
      }).show();
      return;
    }

    // @see http://stackoverflow.com/questions/4060004/calculate-age-in-javascript
    var age = Math.floor((Date.now() - selectedDate) / (31557600000));
    var unixMilliseconds = Math.round(selectedDate.getTime());
    var unixSeconds = Math.round(selectedDate.getTime() / 1000);
    data = {
      date: selectedDate,
      age: age,
      unixMilliseconds: unixMilliseconds,
      unixSeconds: unixSeconds
    }

  // Close the view.
  close({
    type: args.type,
    data: data,
    cancel: cancel
  });
}

/**
* Close the window.
*/
function close(_callbackParams) {
  _callbackParams = _callbackParams || {};
  _callbackParams.type = args.type;
  _callbackParams.id = args.id || null;
  _callbackParams.data = _callbackParams.data || null;
  _callbackParams.cancel = _callbackParams.cancel || false;

  // If the navbar was supposed to be hidden, show it again.
  if (OS_IOS && args.hideNavBar === true) {
    outerView.showNavBar();
  }

  // Execute callback function if one is set.
  if (_.isFunction(args.onDone)) {
    args.onDone(_callbackParams);
  }

  // Remove elements from views.
  if (androidSpecific === false) {
    outerView.remove(overlay);
    outerView.remove(pickerView);
  }

  // Null out elements.
  overlay = null;
  pickerView = null;
  picker = null;
  optionsDialog = null;
}