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
     * Execute copy to clipboard of input text
     * 
     * @param {*} querySelector 
     */
    fn.copyFromText = function( querySelector ) {
        var input = document.querySelector(querySelector);
        input.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        input.blur();
    }

    /**
     * Return an array with tow itens
     * [0] - FileName
     * [1] - FileExtension
     * @param {*} input HTML input file
     */
    fn.getFileNameArray = function( input ) {
        var fullPath = input.value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            var fileNameVet = [];
            fileNameVet[0] = filename.substring(0, filename.lastIndexOf('.'));
            fileNameVet[1] = filename.substring(filename.lastIndexOf('.') + 1);
            return fileNameVet;
        }
        throw new Error('Fail on get file name');
    };

   /*
    * Convert base64 into array
    * @param {*} base64Data sample of base64Data ( "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBx ..." )
    */ 
   fn.inputFileToBase64 = function( input, callback ) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL( input.files[0] );
        fileReader.onerror = function (error) { 
            throw new Error('Unexpected error on read file data');
        };
        fileReader.onload = function () {
            callback( fileReader.result );
        }; 
   }

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

    /**
     * Dowload an file that is converted to base64
     * 
     * @param {*} base64Value (requeired) file data
     * @param {*} fileName (requeired) file name
     * @param {*} extension (requeired) file extension
     * @param {*} callbackError (optional) callback function in case of error
     * @param {*} callbackSuccess (optional) callback function in case of success
     */
    fn.downloadFileWithBase64 = function( base64Value, fileName, extension, callbackError, callbackSuccess ) {
        try {
            var bytes     = fn.base64ToArrayBuffer( base64Value );
            var blob = new Blob([bytes]);
            //
            var link      = document.createElement('a');
            link.href     = window.URL.createObjectURL(blob);
            link.download = fileName.concat('.').concat( extension );
            link.click(); 
        } catch(ex) {
            console.log( ex );
            if (callbackError && typeof callbackError === 'function' ) {
                callbackError();
            }
        } finally {
            if (callbackSuccess && typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        }
    }

    return fn; 
})();
