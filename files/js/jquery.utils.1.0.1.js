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
            if ( $.thereIsAjaxRuning === false ) { // IF there is NOT ajax running, call next function
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

    $.valAndThenChange = function( v ) {
        return this.val(v).trigger('change');
    };
}( jQuery ));