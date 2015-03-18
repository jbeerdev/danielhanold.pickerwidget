var args = arguments[0] || {};
var pickerParams = args.pickerParams || {};
var picker;
var minDate, maxDate, currentValue;
// Specify custom parameters for Android date pickers,
// as date picker values on Android can't be edit
// after they picker is created.
if (args.type === 'date-picker') {
  // Set picker type to "Date Picker".

  if (_.isDate(pickerParams.minDate)) {
    minDate = pickerParams.minDate;
  }else{
    minDate = new Date(new Date().setYear(1900));
  }
  
  if (_.isDate(pickerParams.maxDate)) {
    maxDate = pickerParams.maxDate;
  }else{
    maxDate = new Date(new Date().setYear(2100));
  }

  // Set the default value.
  if (_.isDate(pickerParams.value)) {
    currentValue = pickerParams.value;
  }else{
    currentValue = new Date();
  }


  picker = Ti.UI.createPicker({
        id: "picker",
        type : Ti.UI.PICKER_TYPE_DATE,
        minDate : minDate,
        maxDate : maxDate,
        value : currentValue
    });
  // Hide the visual selection indicator.
  // On iOS 7 and later, the picker indicator is always shown and you cannot control it.
  // On iOS 6 and prior, hide the blue bar that is displayed to indicate the current selection.
  picker.selectionIndicator = false;
  // Set additional options for Android.
  if (OS_ANDROID) {
     picker.useSpinner = false;
     picker.visibleItems = undefined;
  }

$.pickerView.add(picker);

}

function onCancel() {
  args.parentFunctions.close({
    cancel: true
  });
}

function onDone() {
  args.parentFunctions.done();
}
