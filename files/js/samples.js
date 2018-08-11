(function(){

    var cleanMessages = function() {
        var messages = $('div#messages').children('ol');
        $(messages).empty();
    };
    var putMessages = function( ...msgList ) {
        var messages = $('div#messages').children('ol');
        $.each( msgList, function(){ 
            $(messages).append($('<li/>', {text: this}));
        });
    };
    
    $(document).on('click', '#btnSleep2', function() {
        cleanMessages();
        putMessages('INI', new Date());
        JSUtils.sleep( 2000 );
        putMessages( new Date(), 'END');
    });

    $(document).on('click', '#btnCompareJSON', function() {
        cleanMessages();
        try {
            var j1 = JSON.parse(  $('#ttaJ1').val() );
            var j2 = JSON.parse(  $('#ttaJ2').val() );
            
            var eq = JSUtils.jsonEquals( j1, j2 );
            (eq ? putMessages('These are equals') : putMessages('These are not equals'));

        } catch (ex) { 
            putMessages('Your are using invalid JSON data');
        }
    });

    $(document).on('click', '#btnOrder', function() {
        cleanMessages();
        try {
            var input = $(this).prev();
            var array = $(input).val().split(',');

            var orderedArray = JSUtils.orderNumberLevels( array );
            for (var index in orderedArray) { putMessages( orderedArray[index] ); }
        } catch (ex) { 
            putMessages('Data is not in correct format');
        }
    });

    
})();