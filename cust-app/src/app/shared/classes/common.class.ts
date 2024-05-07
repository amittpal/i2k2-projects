import { Injectable } from '@angular/core';
@Injectable()

export class CommonClass {
    /**
     * Function to check keydown value is only number
     * @param {event} event - event happened
     * @param {boolean} isFloat - allow dot
     */

    //allow decimal values
    public onlyNumbers(event, isFloat) {
        var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
        var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

        if ((charCode >= 37 && charCode <= 40)) { // enable arrow key
            return true;
        }

        if (
            // Allow: home, end, left, right, down, up
            (charCode >= 35 && charCode <= 40)
            // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
            || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
            return true;
        }

        // Ensure that it is a number or decimal-point and stop the keypress
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && charCode != 190
            && charCode != 110)
            return false;
        else if (isFloat == true) {
            //allow only single point
            var parts = event.target.value.split('.');
            if (parts.length > 1 && (charCode == 46 || charCode == 190 || charCode == 110))
                return false;
            else {
                //allow only two digits after decimal        
                var character = String.fromCharCode(charCode);
                var newValue = event.target.value + character;
                if (Number(newValue) * 100 % 1 > 0) {
                    event.returnValue = false; // IE
                    event.preventDefault(); // Normal Browsers
                    return false;
                }
                //return true;
            }
        } else if (isFloat == false && charCode == 190) {
            // allow only numbers
            return false;
        }
    }

    /**
     * Function to check keydown value is only Integer number as `Phone Numbers`, `Mobile Numbers` & `Quantity`
     * @param {event} event - event happened
     * @param {boolean} allowShortcut - allow shortcuts as `Ctrl+A`, `Ctrl+C`, `Ctrl+V` & `Command+A`
     */

    // allow only numbers
    public onlyIntNumbers(event, allowShortcut) {
        var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
        var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

        if (allowShortcut == true) {  // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
            if ((charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
                return true;
            }
        }
        if (charCode >= 35 && charCode <= 40) {// Allow: home, end, left, right, down, up
            return true;
        }
        if (charCode > 31
            && (charCode < 48 || charCode > 57)) {
            return false;
        }
        else {
            return true
        }
        //this.commonClass.isNumbers(event, event.target, false);
    }


}