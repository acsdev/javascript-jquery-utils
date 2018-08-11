/**
 * Java script many util codes
 * Sample can be found at samples.html
 *       
 * @author allansantos
 */
var JSUtils = (function() {
    
    var fn = new Function();

    /**
     * Keep the code stop for miliseconds
     */
    fn.sleep = function( ms ) {
        var start = Date.now();
        while (true) {
            var clock = (Date.now() - start);
            if (clock >= ms) break;
        }        
    }
    /**
     * Generate random String
     */
    fn.randomString = function () {
        return Math.random().toString(36).replace(/[^a-z]+/g, '');
    };

    /**
     * Generate random percent number link 0.5, 0.37, 0.96, etc;
     */
    fn.randomPercentNumber = function () {
        return Math.round(Math.random() * 100) / 100;
    };

    /**
     * Generate random dates
     */
    fn.randomDate = function () {
        return new Date(new Date().getTime() + (Math.random() * 1000000000000));
    };
    
    /**
     * Test if two JSON objects are equals
     */
    fn.jsonEquals = function(json1, json2) {
        return JSON.stringify(json1) === JSON.stringify(json2);
    }

    /**
     * Order an array with this kind of data: [0.1.0, 1.0.1, 2.0.1, 0.3.0.1, 1.0, 2.0.3, ...]
     * @param {*} array 
     */
    fn.orderNumberLevels = function( array ) {    
        var splitAndThenSumHundredThousandAndBack = function( item ) {
            return item.split('.').map( function( part ){ return + ( parseInt( part ) + 100000) }).join('.');
        }
        var splitAndThenSubtractHundredThousandAndBack = function( item ) {
            return item.split('.').map( function( part ){ return + ( parseInt( part ) - 100000) }).join('.');
        }
        return array.map( splitAndThenSumHundredThousandAndBack ).sort().map( splitAndThenSubtractHundredThousandAndBack );
    };

    /**
     * Convert base64 into array
     * @param {*} base64Data sample of base64Data ( "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBx ..." )
     */ 
    fn.base64ToArrayBuffer = function(base64Data) {
        var BASE64_MARKER = ';base64,';
        var base64Index   = base64Data.indexOf(BASE64_MARKER) + BASE64_MARKER.length;

        var base64    = base64Data.substring(base64Index);
        var raw       = window.atob(base64);
        var rawLength = raw.length;
        var array     = new Uint8Array(new ArrayBuffer(rawLength));

        for(i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    return fn; 
})();
