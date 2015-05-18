$.fn.allowNumbersOnly = function(data){
	var allow_sign = true;
	var allow_precision = true;

	if(data)
	{
		if(data['sign'] !== undefined)
		{
			if(data['sign'] == false)
				allow_sign = false;
		}
		if(data['precision'] !== undefined)
		{
			if(data['precision'] == false)
				allow_precision = false;
		}
	}


	$(this).livequery('keydown',function (e) {
	    // Allow: backspace, delete, tab, escape, enter and .
	    if ($.inArray(e.keyCode, [109,189, 46, 8, 9, 27, 13, 110, 190, 86, 67]) !== -1 ||
	         // Allow: Ctrl+A
	        (e.keyCode == 65 && e.ctrlKey === true) ||
	         // Allow: home, end, left, right
	        (e.keyCode == 86 && e.ctrlKey === true) ||

	        (e.keyCode == 67 && e.ctrlKey === true) ||

	        (e.keyCode >= 35 && e.keyCode <= 39)) {
	             // let it happen, don't do anything
	        //don't allow multiple '.'
	        if((e.keyCode == 110 || e.keyCode == 190))
	        {
	         	if(($(this).val()).indexOf(".") >= 0 && allow_precision == true)
	         		e.preventDefault();
		     	else
		     	{
		     		if(allow_precision)
	        			return;
	        		else
	        			e.preventDefault();
		     	}
	        }
	        else
	        {
	        	if(e.keyCode == 109 || e.keyCode == 189)
	        	{
	    			if(($(this).val()).indexOf("-") >= 0 && allow_sign == true)
	         			e.preventDefault();
	         		else
	         		{
	         			if(allow_sign)
	         				return;
	         			else
	         				e.preventDefault();
	         		}
	         	}
	         	else
	    			return;
	        }
	    }
	    // Ensure that it is a number and stop the keypress
	    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	        if((e.keyCode == 109 || e.keyCode == 189) && allow_sign == true)
	        	return;
	        else
	        	e.preventDefault();
	    }
	});

	//On KeyUp event
	$(this).livequery('keyup',function (e) {
		if(!(e.keyCode == 65 && e.ctrlKey === true) && !(e.keyCode >= 35 && e.keyCode <= 39))
		{
			if((e.keyCode == 109 || e.keyCode == 189))
			{
				if($(this).val().indexOf('-') == 0)
					return;
				else
				{
					var sign = "";
					var str = $(this).val();
					var caret_pos = $(this).getCursorPosition();
					amount_caret_pos = caret_pos;
					if(str.indexOf('-') == 0 && allow_sign == true) sign = "-";
					str = str.replace(/[^0-9\.]+/g, "");
					if(str.indexOf('.') >= 0)
						str = process_decimal(str);
					if(allow_precision == false)
						str = str.split('.').join('');
					str = sign + str;
					$(this).val(str).trigger('change');
					$(this).caretTo(caret_pos);
					return;
				}
			}
			else
			{
				var sign = "";
				var str = $(this).val();
				var caret_pos = $(this).getCursorPosition();
				amount_caret_pos = caret_pos;
				if(str.indexOf('-') == 0 && allow_sign == true) sign = "-";
				str = str.replace(/[^0-9\.]+/g, "");
				if(str.indexOf('.') >= 0)
					str = process_decimal(str);
				if(allow_precision == false)
						str = str.split('.').join('');
				str = sign + str;
				$(this).val(str).trigger('change');
				$(this).caretTo(caret_pos);
				return;
			}
		}
		else
		{
			// Ensure that it is a number and stop the keypress
	    	if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	        	if((e.keyCode == 109 || e.keyCode == 189))
	        		return;
	        	else
	        		e.preventDefault();
	    	}
			else
				return;
		}
	});
};

(function($) {
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
})(jQuery);


//Set cursor position at specified index of textbox
(function ($) {
    // Behind the scenes method deals with browser
    // idiosyncrasies and such
    $.caretTo = function (el, index) {
        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move("character", index);
            range.select();
        } else if (el.selectionStart != null) {
            el.focus();
            el.setSelectionRange(index, index);
        }
    };

    // The following methods are queued under fx for more
    // flexibility when combining with $.fn.delay() and
    // jQuery effects.

    // Set caret to a particular index
    $.fn.caretTo = function (index, offset) {
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);

                if (offset === true) {
                    i += index.length;
                } else if (offset) {
                    i += offset;
                }

                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }

            next();
        });
    };

    // Set caret to beginning of an element
    $.fn.caretToStart = function () {
        return this.caretTo(0);
    };

    // Set caret to the end of an element
    $.fn.caretToEnd = function () {
        return this.queue(function (next) {
            $.caretTo(this, $(this).val().length);
            next();
        });
    };
}(jQuery));


//usage
$('input[type="text"]').allowNumbersOnly({
	'sign':false
});
