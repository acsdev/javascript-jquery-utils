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


    $.valAndThenChange = function( v ) {
        return this.val(v).trigger('change');
    };
}( jQuery ));