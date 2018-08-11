/**
 * Extension on jquery functions 
 * Sample can be found at samples.html
 *       
 * @author allansantos
 */
(function( $ ){
    var _countAjaxRunning   = 0;    
    var _originalJQueryAjax = $.ajax;
    $.ajax = function() {
        _countAjaxRunning++;
        var _call    = _originalJQueryAjax.apply($, arguments);
        var _monitor = setInterval( function() { 
            if ( _call.status !== undefined) {
                _countAjaxRunning--;
                clearInterval( _monitor );
            }
        }, 100);
        return _call;
    };
    $.thereIsAjaxRuning = function() {        
        return _countAjaxRunning > 0;
    }
    $.howManyIsAjaxRuning = function() {
        return _countAjaxRunning;
    }

    $.execStackOfFunctions = function( arrayOfFunctions ) {        
        var next         = arrayOfFunctions.shift();
        var execInterval = setInterval(function() {
            // if (next) console.log( next );
            if ( $.thereIsAjaxRuning() === false ) { // IF there is NOT ajax running, call next function
                clearInterval( execInterval );
                $.execStackOfFunctions( arrayOfFunctions );
            }
        }, 500);
        if (next === undefined) {
            clearInterval( execInterval );
        }
        if (next) {
            next();
        }
    }
    /**
     * Format an message with arguments.
     * For instance: formatMessage(' My {0} is {1} ',['dog','happy']) will produce "My dog is happy";
     */
    $.formatMessage = function( messages, arrayValues ) {
        $.each(arrayValues, function( index ) {
            var r = new RegExp('\\{'+index+'\\}','g');
            messages = messages.replace( r, this );
        });
        return messages.trim();
    }

////////////////////////////////////////////
/// FUNCTIONS THAT YOU CAN CALL ON INPUTS //
////////////////////////////////////////////
    /**
     * Use method "val" and after calls trigger('change')
     * @param {*} v 
     */
    $.fn.valAndThenChange = function( v ) {
        return this.val(v).trigger('change');
    };

    /**
     * Create an animated option to suggest that HTMLSelectOne (Combobox) is wating to be loaded
     */
    $.fn.selectOneWaiting = function() {
        try {
            var select = $(this);
            if ($(select)[0].type === 'select-one') {
                var loadingText = $(select).attr('data-loading-text') ? $(select).attr('data-loading-text') : 'Getting data';
                var option      = $('<option/>', {text: loadingText});
                //
                $(select).empty();
                $(select).append( option );
                $(select).attr('selectedIndex', 0);
                //
                var baseSize = loadingText.length;
                var interval = window.setInterval(function() {
                    if ( $(option).text().length > ( baseSize + 6) ) {
                        $(option).text( loadingText );
                    } else {
                        $(option).text( $(option).text() + ' . ' );
                    }
                    if ( $(select).children('option').length > 1 ) {
                        clearInterval( interval );
                    }
                }, 500);
            }
        } catch(ex) {
            throw new Error('this function can only be applied on select-one ')
        }        
    };

    /**
     * Create an animated option to suggest that HTMLSelectOne (Combobox) is wating to be loaded
     */
    $.fn.addOptionsOnSelect = function(collection, value, label, addicionalInfo) {
        try {
            var select = $(this);
            if ($(select)[0].type === 'select-one') {

                $(select).empty();
                if ( $(select).attr( 'data-default-option' )) {
                    $(select).append( $('<option>', {text: $(select).attr( 'data-default-option' )}) );
                }

                $.each( collection, function(){
                    var opt = $('<option>', { id: this[value], text: this[label] });
                    if (addicionalInfo && addicionalInfo['data-additional-info']) {
                        $(opt).attr('data-additional-info', addicionalInfo['data-additional-info']);
                    }
                    $(select).append( opt );
                });
            }
        } catch(ex) {
            throw new Error('this function can only be applied on select-one ')
        }     
    };

}( jQuery ));