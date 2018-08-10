/**
 * Jquery many util codes
 * Sample can be found at samples.html
 *       
 * @author allansantos
 */
var JQueryUtils = (function( $ ){
/////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCIONS /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
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

    $.fn.valAndThenChange = function( v ) {
        return this.val(v).trigger('change');
    };

/////////////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCIONS //////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
    this.thereIsAjaxRuning = function() {        
        return _countAjaxRunning > 0;
    }
    this.howManyIsAjaxRuning = function() {
        return _countAjaxRunning;
    }
    return this;
}( jQuery ));