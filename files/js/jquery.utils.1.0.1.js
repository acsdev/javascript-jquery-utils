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
    $.duplicateElementAndAddBelow = function( options ) {
        
        var repeatableQTD      = $( options.group ).children('div').length;   

        if (options.limit && options.limit == repeatableQTD) { return; }
                
        // CLONE ITEM
        var newDiv = $( options.group ).find('div:first').clone();

        // CLEAN ALL INPUT VALUES
        $(newDiv).find(':input').val( null );

        var elementAddOrRemove = $(newDiv).find('[data-link-add-or-remove]');
        $( elementAddOrRemove ).each(function() {
            $(this).removeAttr('id');
            if ($(this).is('a')) {
                $(this).attr('href','javascript:void(0)');
                $(this).text('RVM');
            }
            if ($(this).is('input[type=button]')) {
                $(this).attr('value','RVM');
            }
            if ($(this).is('button')) {
                $(this).text('RVM');
            }
            $(this).click(function() {
                $(this).parent('div').remove();
                if (options && options.afterRemove) { options.afterRemove(); }
            });
        });

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

        if (options && options.afterAdd) { options.afterAdd(); }
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
        var onFileType = function( input, _jsonObject, _dotNotatationObject, _base64DottedNotation ) {
            if ( $(input).attr('type') === 'file' ) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL( $(input)[0].files[0] );
                fileReader.onerror = function (error) { 
                    throw new Error('Unexpected error on read file data')
                };
                fileReader.onload = function () {
                    $.addValueWithDottedNotation( _jsonObject, _dotNotatationObject, $(input).val() );
                    $.addValueWithDottedNotation( _jsonObject, _base64DottedNotation, fileReader.result );
                };                
            }
        }

        var addValue = function(_type, _jsonObject, _dotNotatationObject, _value) {

            if ( _type === 'file' ) {
                var bindBase64 = $(input).attr('data-entity-bind-base64');
                if (bindBase64) {
                    var dotNotatationObject64  = bindBase64.replace(/(.+)(\[)(.+)(\]$)/, '$3');
                    onFileType( input, _jsonObject, _dotNotatationObject, dotNotatationObject64 );
                }
            }
            if ( _type !== 'file' ) {
                $.addValueWithDottedNotation( _jsonObject, _dotNotatationObject, _value );
            }
        };
        
        var type  = $(input).attr('type');
        var value = $(input).val();
        if ( $(input)[0].hasAttribute('data-decimalnumber')) {
            if (/\./g.test( value ) && /,/g.test( value )) { value = value.replace(/\./g, '').replace(/,/g, '.');  } //IF value has '.' and ','
            if ( !(/\./g.test( value )) && /,/g.test( value )) { value = value.replace(/,/g, '.'); } //IF value has ',' and not has '.'
        }

        var dottedNotationAttribute = $(input).attr('data-entity-bind');
        var isAttrInList = /(.+)(\[)(.+)(\]$)/.test( dottedNotationAttribute );
        
        if ( ! isAttrInList ) {
            addValue( type, jsonOBJECT, dottedNotationAttribute, value);
        } else {
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
            addValue( type, insideObject, attrName, value);
        }
    };

    /**
     * Set a value into json object.
     * 
     * @param {JSON} jsonOBJECT json object
     * @param {string} dottedNotationAttribute  path on attr that will receive the value
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
     * Convert an object json into a dot notation string.
     * 
     * @param {*} objectJSON JSON objet that will be converted 
     * 
     * 
     * @returns {array} Array where is position has a pair (dot notation = value)
     */
    $.convertJsonObjectToDotNotationObject = function(objectJSON) {

        var doIt = function(jsonOBJECT, target, prefix, index) {
            target = target || {},
            prefix = prefix || '';
          
            Object.keys(jsonOBJECT).forEach(function(key) {
                if ( typeof( jsonOBJECT[key] ) === 'object' ) {
                    if (isNaN(key)) {
                        doIt(jsonOBJECT[key], target, prefix + key + '.', index);
                    } else {
                        doIt(jsonOBJECT[key], target, prefix.substring(0, prefix.length-1) + '[', key);
                    }
                } else {
                    var finalPrefix = prefix + key + (index ? ']{' + index + '}' : '' );
                    return target[finalPrefix] = jsonOBJECT[key];
                }
            });

            return target;
        }

        return doIt( objectJSON );
    };

    /**
     * Fill input data with dot notation string
     * 
     * @param {*} parentArea ID or Element parent of fields you want fill
     * @param {string} dottedNotation dot notation JSON
     */
    $.putDataOnScreenFromDotNotationObject = function( parentArea, dottedNotation ) {

        var fill = function( inputField, key, indexValue ) {
            if ($(inputField).attr('type') === 'file') {   
                
                var finalKeyValue  = key;
                var finalKeyBase64 = $( inputField ).attr('data-entity-bind-base64');
                if ( indexValue ) {
                    finalKeyValue  = '_KEY{_INDEX}'.replace(/_KEY/g, key).replace(/_INDEX/g, indexValue);
                    finalKeyBase64 ='_KEY{_INDEX}'.replace(/_KEY/g, dataBindKeyBase64).replace(/_INDEX/g, indexValue);
                }
                //
                var val       = dottedNotation[ finalKeyValue ];
                var base64    = dottedNotation[ finalKeyBase64 ];
                //
                $(inputField).attr('data-entity-bind-value', val);
                $(inputField).attr('data-entity-bind-base64-value', base64);
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
                    $.duplicateElementAndAddBelow( {'group' : newGroup });
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