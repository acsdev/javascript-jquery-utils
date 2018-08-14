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

    /**
     * Duplicate an area of DIVs and add the new HTML part as a sibling DIV.
     * Sample:
     * <div id="DivIDGrouping">
     *     <div>[Many HTML tags]</div> >>> Will use as base to clone html
     *     <div>[Many HTML tags]</div> >>> Clone of first DIV
     *     <div>[Many HTML tags]</div> >>> Clone of first DIV
     *     <div>[Many HTML tags]</div> >>> Clone of first DIV
     * </div>
     * 
     * @param {*} options json object that with two attributes group and limit. (limit attr is not required)
     * Sample: {
     *      'group':'DivIDGrouping'
     *      'limit': 10 (optional) Will allow only 10 Divs (Div Orginal plus nine Divs )
     * }
     * @param {*} callback after execute funcions, start callback functions if exists
     */
    $.duplicateElementAndAddBelow = function( options, callback ) {
        
        var repeatableQTD      = $( options.group ).children('div').length;   
        var reorganize = function() {
            $( options.group ).children('div').each(function( index ) {
                $(this).find(':input[data-entity-bind-index]').attr('data-entity-bind-index', index);
            });
        }

        if (options.limit && options.limit == repeatableQTD) { return; }
                
        // CLONE ITEM
        var newDiv = $( options.group ).find('div:first').clone();

        // CLEAN ALL INPUT VALUES
        $(newDiv).find(':input').val( null );

        // PREARE IDS
        var next = Date.now();
        if ($(newDiv).attr('id')) {
            $(newDiv).attr('id', $(newDiv).attr('id').concat('_').concat( next ));
        }
        $.each( $(newDiv).children(), function() {
            var attrID  = $(this).attr('id');
            var attrFOR = $(this).attr('for');
            if (attrID)  { 
                $(this).attr('id', attrID.concat('_').concat( next ));
            }
            if (attrFOR) {
                $(this).attr('for', attrFOR.concat('_').concat( next ));
            }
        });
        //
        $( options.group ).append( newDiv );        
        
        reorganize();

        if (callback && typeof callback === 'function') {
            callback();
        }
    };

    /**
     * Get value of HTML inputs ( <input>, <select>, <textarea> ) and put data into json object
     * 
     * HTML input has to use attribute data-entity-bind where an value must be object dotted notation.
     *
     * data-entity-bind-index must be used if the value you want store on json is nested on an array.
     * data-entity-bind-img64 must be used if the value you want store on json is from an <input type="file"/>
     * data-decimalnumber must be used if the value you want store on json must be convert as an numbner
     * 
     * @param {*} input HTML input
     * @param {*} jsonOBJECT JSON object
     */
    $.addValueOnJSON = function(input, jsonOBJECT) {

        var onFileType = function( objectToPutData, input, base64DottedNotation ) {
            if ( $(input).attr('type') === 'file' ) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL( $(input)[0].files[0] );
                fileReader.onerror = function (error) { 
                    throw new Error('Unexpected error on read file data')
                };
                fileReader.onload = function () {
                    $.addValueWithDottedNotation( objectToPutData, base64DottedNotation, fileReader.result );
                };                
            }
        }

        var value = $(input).val();
        if ( $(input)[0].hasAttribute('data-decimalnumber')) {
            if (/\./g.test( value ) && /,/g.test( value )) { value = value.replace(/\./g, '').replace(/,/g, '.');  } //IF value has '.' and ','
            if ( !(/\./g.test( value )) && /,/g.test( value )) { value = value.replace(/,/g, '.'); } //IF value has ',' and not has '.'
        }

        var dottedNotationAttribute = $(input).attr('data-entity-bind');
        var dottedNotationAttributeBase64 = $(input).attr('data-entity-bind-img64');
        
        var isAttrInList = /(.+)(\[)(.+)(\]$)/.test( dottedNotationAttribute );
        
        if ( isAttrInList ) {
            var dataIndex    =  $(input).attr('data-entity-bind-index');

            var attrListName = dottedNotationAttribute.replace(/(.+)(\[)(.+)(\]$)/, '$1');
            var attrName     = dottedNotationAttribute.replace(/(.+)(\[)(.+)(\]$)/, '$3');

            if ( typeof jsonOBJECT[attrListName] != 'object') {
                jsonOBJECT[attrListName] = []; // INIT JUST IN CASE
            }

            if ( jsonOBJECT[attrListName][dataIndex] === undefined) {
                jsonOBJECT[attrListName][dataIndex] = {};
            }

            var insideObject = jsonOBJECT[attrListName][dataIndex];
            
            $.addValueWithDottedNotation( insideObject, attrName, value );
            if ( $(input).attr('type') === 'file' ) {
                var attrName64  = dottedNotationAttributeBase64.replace(/(.+)(\[)(.+)(\]$)/, '$3');
                onFileType( insideObject, $(input), attrName64 );
            }
        } else {
            $.addValueWithDottedNotation( jsonOBJECT, dottedNotationAttribute, value );
            if ( $(input).attr('type') === 'file' ) {
                onFileType( jsonOBJECT, $(input), dottedNotationAttributeBase64 );
            }
        }           
    };

    /**
     * Set a value int json object.
     * 
     * @param {*} jsonOBJECT json object
     * @param {*} dottedNotationAttribute  path on attr that will receive the value
     * @param {*} value value will want set
     */
    $.addValueWithDottedNotation = function(jsonOBJECT, dottedNotationAttribute, value) {
        var part  = null;
        var parts = dottedNotationAttribute.split('.');
        while (part = parts.shift() ) {   
            if (parts.length == 0) {
                jsonOBJECT[part] = value;
            } else {
                if ( typeof jsonOBJECT[part] != "object") {
                    jsonOBJECT[part] = {}; // INIT JUST IN CASE
                }
                jsonOBJECT = jsonOBJECT[part]; // ADD NEW PART
            }
        }
    };

    /**
     * Convert an object json into a dotted notation string.
     * Samples:
     * 
     */
    $.convertJsonObjectToDotNotationObject = function(jsonOBJECT, target, prefix, index) {
        target = target || {},
        prefix = prefix || '';
      
        Object.keys(jsonOBJECT).forEach(function(key) {
            if ( typeof( jsonOBJECT[key] ) === 'object' ) {
                if (isNaN(key)) {
                    $.convertJsonObjectToDotNotationObject(jsonOBJECT[key], target, prefix + key + '.', index);
                } else {
                    $.convertJsonObjectToDotNotationObject(jsonOBJECT[key], target, prefix.substring(0, prefix.length-1) + '[', key);
                }
            } else {
                var finalPrefix = prefix + key + (index ? ']{' + index + '}' : '' );
                return target[finalPrefix] = jsonOBJECT[key];
            }
        });
        return target;
    };

    $.putDataOnScreenDottedOperation = function( parentArea, dottedNotation ) {

        var fill = function( inputField, key, indexValue ) {
            if ($(inputField).attr('type') === 'file') {   
                //
                var linkDownload      = $( inputField ).parent('div').find('[data-entity-bind-input-file-name]');
                var dataBindKeyBase64 = $( inputField ).attr('data-entity-bind-img64');
                //
                var base64Key ='_KEY{_INDEX}'.replace(/_KEY/g, dataBindKeyBase64).replace(/_INDEX/g, indexValue);
                var base64    = dottedNotation[ base64Key ];
                var buffer    = OSUtils.base64ToArrayBuffer(base64);
                var blob      = new Blob([buffer]);
                linkDownload.text( dottedNotation[key] );
                linkDownload.attr('href',  window.URL.createObjectURL(blob));
                linkDownload.attr('download', dottedNotation[key]);
            } else if ( $(inputField).attr('type') === 'radio' ) {
                $( inputField ).each(function() { 
                    if ($(this).val() ===  dottedNotation[key] ) {
                        $(this).attr('checked', true);
                    } 
                });
            } else {
                $( inputField ).val( dottedNotation[key] );
            }
        }

        // PREENCHENDO VALORES NO FORMULÁRIO        
        Object.keys( dottedNotation ).forEach(function(key) {
            var regex = /(.+)(\[)(.+)(\])({)([0-9]+)(}$)/; //7Groups
            var isgroupData = regex.test( key );
            if  ( isgroupData ) {
                var bindValue   = key.replace(regex, '$1$2$3$4');
                var indexValue  = key.replace(regex, '$6');
                //
                var fieldSelectorExpression =  '[data-entity-bind="_B"][data-entity-bind-index="_I"]'.replace(/_B/g, bindValue).replace(/_I/g, indexValue);               
                var input = $( parentArea ).find( fieldSelectorExpression );
                if (input.length == 0) {
                    
                    var newGroup = $('[data-entity-bind="_B"]'.replace(/_B/g, bindValue)).parents('div[data-repeatable]').parent('div');
                    OSScreenUtils.duplicateElementAndAddBelow( {'group' : newGroup });
                    //
                    input = $( parentArea ).find( fieldSelectorExpression );
                }
                //
                if (input.length > 0 ) {
                    fill( input, key, indexValue );
                }
            } else {
                var dataBindKey = '[data-entity-bind="_K"]'.replace(/_K/g, key);
                var input = $( parentArea ).find( dataBindKey );

                fill( input, key );
            }
        });
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
     * Drag and Drop Div
     * 
     * @param {*} options (optional) JSON object with options that you can use to do a little bit more
     *      options.classNameForDivInMoviment >> if you wanna to usa an class while div is moviment
     *      options.afterMove                 >> if you wanna execute something after you move
     *  
     */
    $.fn.dragable = function( options ) {
        try {
            if (! $(this).is('div')) { throw new Error(); };

            var divMove = $(this);
            $(divMove).on('mousedown', function (e) {

                if (options && options.classNameForDivInMoviment) {
                    $(divMove).addClass( options.classNameForDivInMoviment );
                }
                //
                $(divMove).parents().on('mousemove', function (e) {
                    $(divMove).offset({
                        top: e.pageY - $(divMove).outerHeight() / 2,
                        left: e.pageX - $(divMove).outerWidth() / 2
                    });
                });
                
            });

            $(divMove).on('mouseup', function (e) {
                if (options && options.classNameForDivInMoviment) {
                    $(divMove).removeClass( options.classNameForDivInMoviment );
                }

                $(divMove).parents().off('mousemove');
                if (options && options.afterMove) {
                    options.afterMove();
                }
            });
            
        } catch(ex) {
            throw new Error('Funcion dragable can only be used in DIV element')
        } 
    }

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