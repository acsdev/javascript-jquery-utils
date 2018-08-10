/**
 * Jquery many util codes
 * Sample can be found at samples.html
 *       
 * @author allansantos
 */
$.fn.valAndThenChange = function( v ) {
    return this.val(v).trigger('change');
};

$.fn.ajaxRunning = false;
var _originalJQueryAjax = $.ajax;
$.ajax = function() {
    $.fn.ajaxRunning = true;
    var _call    = _originalJQueryAjax.apply($, arguments);
    var _monitor = setInterval( function() { 
        if ( _call.status !== undefined) {
            $.fn.ajaxRunning = false;
            clearInterval( _monitor );
        }
    }, 100);
    return _call;
};