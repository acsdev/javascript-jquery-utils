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

    $(document).on('click','.tablinks', function() {
        $('.tabcontent').hide();
        $('.tablinks').removeClass('active');
        //
        var btn   = $(this);
        var tab   = $('div#tab-view').children().get( $(btn).index() );
        //
        $(tab).fadeIn('slow', function() { $(btn).addClass('active') });
    });
    
    $('div#message-container').on('mousedown', function (e) {
        $(this).addClass('divActiveMove').parents().on('mousemove', function (e) {
            $('.divActiveMove').offset({
                top: e.pageY - $('.divActiveMove').outerHeight() / 2,
                left: e.pageX - $('.divActiveMove').outerWidth() / 2
            }).on('mouseup', function () {
                $(this).removeClass('divActiveMove');
            });
        });
        return false;    
    });

    $(document).ready(function() {
        var staticJsonSample = {
            "_id": "5b6ef116157df345e9d7c77b",
            "company": "IPLAX",
            "email": "melbajoyce@iplax.com",
            "phone": "+1 (904) 413-3834",
            "address": "679 Kingston Avenue, Greenock",
            "about": "Dolor sunt irure ",
            "registered": "2015-12-28T03:36:34 +02:00",
            "latitude": 33.819133,
            "longitude": 111.044133
        };
        $('#ttaJ1,#ttaJ2').val( JSON.stringify( staticJsonSample, undefined, 2) );


        $('.tab').children('a').get(1).click(); //START ON TAB 02
    });
})();