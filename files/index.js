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
    $(document).on('click', '#btnRandom', function() {
        cleanMessages();
        try {
            var div = $(this).parent();
            $(div).find('input[type=text]').val( JSUtils.randomString() );
            $(div).find('input[type=number]').val( JSUtils.randomPercentNumber() );

            var now = JSUtils.randomDate();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var dateOnFormat = '_YYYY-_MM-_DD'.replace(/_YYYY/g,now.getFullYear()).replace(/_MM/g,month).replace(/_DD/g,day);
            $(div).find('input[type=date]').val( dateOnFormat );
            
        } catch (ex) { 
            putMessages('Data is not in correct format');
        }
    });
    
    $(document).on('click', '#btnExecFillCmbx', function() {
        cleanMessages();
        try {
            var fnCombo01 = function() {
                $('#cmbxRandomText').selectOneWaiting();
                $
                .ajax({
                    type: 'GET',
                    url:  'http://localhost:3000/listPairNumberString',
                    contentType: 'application/json',
                })
                .done(function( result, textStatus, jqXHR ) {
                    $('#cmbxRandomText').addOptionsOnSelect( result, 'id', 'desc' );
                })
                .fail(function( jqXHR, textStatus, errorThrown ) {
                    putMessages('Error on ajax at fnCombo01');
                }).always( function() {putMessages('Execute fnCombo01 with ajax');} );
            };
            
            var fnCombo02 = function() {
                $('#cmbxDate').selectOneWaiting();
                $
                .ajax({
                    type: 'GET',
                    url:  'http://localhost:3000/listPairNumberDate',
                    contentType: 'application/json',
                })
                .done(function( result, textStatus, jqXHR ) {
                    $('#cmbxDate').addOptionsOnSelect( result, 'id', 'desc' );
                })
                .fail(function( jqXHR, textStatus, errorThrown ) {
                    putMessages('Error on ajax at fnCombo01');
                }).always( function() {putMessages('Execute fnCombo02 with ajax');} );
            };

            $.execStackOfFunctions([
                fnCombo01,
                function() {  $('#cmbxRandomText').attr('selectedIndex',10), putMessages('Set value at fnCombo01 without'); },
                fnCombo02,
                function() {  $('#cmbxDate').attr('selectedIndex',5), putMessages('Set value at fnCombo02 without'); }
            ]);
        } catch (ex) { 
            putMessages(ex);
        }
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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