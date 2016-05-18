/* Custom validator v1.0.0
* Author Christian Verdaguer
* Requires jQuery >= 1.7
* Tested only in jQuery 1.7.2
*
* REQUIREMENTES
*   JQuery >= 1.7.2

*
* USAGE: 
*       $("#any_container").initialize(options);   //Initialize
*       $("#any_container").validate(options);     //Validate all controls from container and returns true if there is error
*       $("#a_control").validateField(options);    //Validate just an specific control
*
*       How to register a new validator outside the plugin:
*       0. Initialize: $("#container").initialize();
*       1. Define the validator tag in the control ex: data-new-validator
*       2. Define the validator error msg tag in the control ex: data-new_validator-msg
*       3. Define the function that validates returning true if there is error, or false if not and register it like this.
*
*        $("#container").registerValidator("data-new-validator",
*            function(control){
*                if (control.val()=="error") return true; //There is error
*                else return false;
*            }
*        );
*
*       4. Validate: $("#container").validate();
*
*
* FLAGS:
*   CONFIGURATION
*     data-message-control: Control ID where to show the error message (should be with display:none); If not specified, uses standar text just after control.
*     data-disable-validation: If the tag is in the control is not going to be validated
*
*   VALIDATORS
*     data-required: Mark that element is required to be filled
*     data-required-msg: Error message
*
*     data-only-numbers: The element should only have numbers ( , . - )
*     data-only-numbers-msg: Error message
*
*     data-date-format="dd/MM/yyyy"
*     data-date-format-separator="/"
*     data-date-format-msg: Error message
*
*     data-select-value-different="0"    //Sobre el desplegable, permite decir que selecciones un valor diferente del "0"
*     data-select-value-different-msg: Error message
*
*     data-iban:  Validates IBAN Bank format
*     data-iban-msg:  Error message
*
*     data-email: Validates valid email entry
*     data-email-msg: Error message
*
* */

(function ($) {

    var settings = {
        errorClass: 'validator_error',      // Error css class
        scrollToFirstError: true,           //If error, move scroll till first page
        scrollToFirstElementTime: 1000,     //Tiempo de scroll hasta el primer elemento
        scrollToFirstElementOffset: 0,      //Offset in pixels to have a margin on scroll
        debug : false,                      //Sacamos informacion por la consola de debug
        dataDynamicRevalidate: false,       //Sets auto-validate fields onblur.
        validationSummary: false,           //Activate if u want the errors to appear in a central place defined in the html control "validationSummaryControl"
        validationSummaryControl: ''
    };

    var validators = {
        data_required: "data-required",
        data_only_numbers: "data-only-numbers",
        data_date_format: "data-date-format",
        data_select_value_different: "data-select-value-different",
        data_iban: "data-iban",
        data_email: "data-email",
        data_disable_validation: "data-disable-validation"
    };

    var validation_ok = true;   //Retorno, indica que por el momento todo es OK.
    var firstErrorControlToScroll = null;
    var ERROR_MSG_TAG = "_error_msg_";

    var active_validators = new Array();    //Collection with all validators to handle. If we create manually a new validator, it has to be registered to this collection.


    /***************************************************************************
    *                                   PUBLIC METHODS
    ****************************************************************************/

    /**
    * PUBLIC METHOD
    * Init the plugin and the default validators
    */
    $.fn.initialize = function (options) {
        //Recogemos las opciones del usuario y si no especifican los valores por defecto
        this.settings = $.extend(settings, options);

        //Registramos todos los validadores
        this.registerAllValidators();

        if (settings.dataDynamicRevalidate) {
            
            this.find("input,select,textarea").each(function () {
                if (settings.debug) console.log("------------- #" + $(this).attr("id") + " ------------------");
                $(this).blur(function () {
                    console.log(" >> BLUR: " + $(this).attr("id"));
                    $(this).validateField(this.settings)
                });
            })
        }
    }

    /**
    * PUBLIC METHOD
    * Función validar, que lanza las validaciones pertinentes para cada control (Todos los controles)
    */
    $.fn.validate = function () {
        
        validation_ok = true;
        firstErrorControlToScroll = null;

        //If there is validation summary, empty it and hide it
        if (settings.validationSummary) {
            $("#" + settings.validationSummaryControl).empty();
            $("#" + settings.validationSummaryControl).hide();
        }

        //For each form element, we just execute validation
        this.find("input,select,textarea").each(function () {
            $(this).validateField(this.settings);
        })

        //Scrollamos hasta el primer error
        if (settings.scrollToFirstError && firstErrorControlToScroll != null) {
            if (settings.validationSummary && settings.validationSummary != "") {
                firstErrorControlToScroll = $("#" + settings.validationSummaryControl);
                firstErrorControlToScroll.show();
            }
            
            $('html, body').animate({
                scrollTop: firstErrorControlToScroll.offset().top - settings.scrollToFirstElementOffset
            }, settings.scrollToFirstElementTime);
        }

        return validation_ok;
        
    };

    /**
    * PRIVATE METHOD
    * Method that registers all the default validators
    */
    $.fn.registerAllValidators = function () {

        /* DATA-REQUIRED */
        this.registerValidator(
            validators.data_required,
            function (control) {
                var validator_name = validators.data_required;
                
                if (control.attr(validator_name) != null) {
                    if (control.isEmpty())  return false;
                    else return true;
                }
            }
        );

        /* ONLY NUMBERS */
        this.registerValidator(validators.data_only_numbers,
            function (control) {
                var validator_name = validators.data_only_numbers;
                if (control.attr(validator_name) != null) {
                    if (control.isEmpty() || (control.isNumeric(control.val()))) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        );


        /* DATE FORMAT */
        this.registerValidator(validators.data_date_format,
            function (control) {
                var validator_name = validators.data_date_format;
                if (control.attr(validator_name) != null) {
                    var dateFormat = control.attr(validator_name);
                    
                    var stringDate = control.val();
                    var separator = control.attr(validator_name + "-separator");
                    var dateok = true;
                    try {
                        dateok = $(this).checkDateDMY(stringDate);

                        stringDate = $(this).parseDate(stringDate, dateFormat, separator);
                    } catch (e) { dateok = false; alert(e);}
                    if (!control.isEmpty() && !dateok) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        );

        /* SELECT A VALUE OF DROP DOWN */
        this.registerValidator(validators.data_select_value_different,
            function (control) {
                var validator_name = validators.data_select_value_different;
                if (control.attr(validator_name) != null) {
                    if (control.prop("selectedIndex") != control.attr(validator_name)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });


        /* IBAN VALIDATIONS */
        this.registerValidator(validators.data_iban,
            function (control) {
                var validator_name = validators.data_iban;
                if (control.attr(validator_name) != null) {
                    if (!control.isEmpty() && !control.validateIBAN(control.val())) {
                        return false;
                    } else return true;
                }
            }
        );

        /* EMAIL VALIDATOR */
        this.registerValidator(validators.data_email,
            function (control) {
                var validator_name = validators.data_email;
                if (control.attr(validator_name) != null) {
                    if (!control.isEmpty() && !control.isEmail()) {
                        return false;
                    } else return true;
                }
            }
        );
    }

    /**
    * PUBLIC METHOD
    * Registers a new validator.
    * Receives the name of the validator (tag to search for active) and a function receiving jQuery control to validate.
    * Returns true if there is error, false if no error.
    */
    $.fn.registerValidator = function (validator_name,validator_function) {
        active_validators[validator_name] = validator_function;
    }

    /**
    * PRIVATE METHOD
    * manages the response after validations, shows Error if necessary
    */
    $.fn.manageValidateResponse = function (validator_name,validation_result,control) {
        if (!validation_result){
            control.showError(control, validator_name);
        } else {
            $(this).hideError(control, validator_name);
        }
    }

    /*
    * PUBLIC METHOD
    *   Lanzamos la validación de un campo en concreto.
    */
    $.fn.validateField = function (options) {
        var field_ok = true;
        //Si hay settings, los mergeamos
        if (options != null)
            this.settings = $.extend(settings, options);
        
        if (settings.debug) console.log("------------- #" + $(this).attr("id") + " ------------------");

        //Check if we have to validate the field
        if ($(this).attr(validators.data_disable_validation) != null) return true;


        //For every validator
        for (validator_name in active_validators) {
            if (settings.debug) console.log("** Validator "+validator_name + " active: " + ($(this).attr(validator_name) != null ? "true" : "false"));
            if ($(this).attr(validator_name) == null) continue;

            var ok = active_validators[validator_name]($(this));
            field_ok &= ok;
            if (settings.debug) console.log("    Validation isValid: [" + ok + "] Global field validator: [" + field_ok+"]");
            this.manageValidateResponse(validator_name, ok, $(this));
        }

        return field_ok;
    }

    /***************************************************************************
    *                                   PRIVATE METHODS
    ****************************************************************************/


    /**
    *  PRIVATE METHOD
    *  Mostrar el error de un elemento específico con el mensaje determinado por el usuario
    */
    $.fn.showError = function (element, validator_name) {
        if (settings.debug) console.log("    ShowError: " + validator_name);
        validation_ok &= false;

        var id = element.attr("id") + ERROR_MSG_TAG + validator_name;
        var message = element.attr(validator_name + "-msg");
        var controlMessage = element.attr("data-message-control");

        //Si no hay mensaje, no continuamos, no hay nada que mostrar
        if (message == null) return;

        //Guardamos el elemento con el error en el caso que se a el primer error (para poder scrollar hasta el)
        if (settings.scrollToFirstError && firstErrorControlToScroll == null) {
            firstErrorControlToScroll = element;
        }

        //Si me dicen que muestre el mensaje en un control existente
        if (controlMessage != null) {
            $("#" + controlMessage).html(message);
            $("#" + controlMessage).show();
            return;
        }

        //Sino, si tengo activado el errorsummary, muestro todos los elementos dentro de éste
        if (settings.validationSummary) {
            var errors = $("#" + settings.validationSummaryControl).html();
            errors += "<span id='" + id + "' class='" + settings.errorClass + "'>" + message + "</span><br/>";
            $("#" + settings.validationSummaryControl).html(errors);
            $("#" + settings.validationSummaryControl).show();            
            return;
        }

        //Sino, creo un control dinamicamente
        if ($("#" + id).length == 0) {
            element.after("<span id='" + id + "' class='" + settings.errorClass + "'>" + message + "</span>");
        } else element.parent("#" + id).show();
    }

    /**
    *  PRIVATE METHOD
    *  Esconde un mensaje de error
    */
    $.fn.hideError = function (element, validator_name) {
        if (settings.debug) console.log("    HideError: " + validator_name);

        var controlMessage = element.attr("data-message-control");
        if (controlMessage != null) {
            $("#" + controlMessage).html("");
            $("#" + controlMessage).hide();
            return;
        }

        var id = element.attr("id") + ERROR_MSG_TAG + validator_name;
        validation_ok &= true;
        if ($("#" + id).length > 0) {
            $("#" + id).remove();
        }
    }

    /**
    * PUBLIC METHOD
    * Devuelve si un valor es numérico o no (incluye {. , - } como valores válidos )
    */
    $.fn.isNumeric = function (strString) {
        strString = $.trim(strString);
        var strValidChars = "0123456789,.-"; var strChar; var blnResult = true; if (strString.length == 0) return false; for (i = 0; i < strString.length && blnResult == true; i++) { strChar = strString.charAt(i); if (strValidChars.indexOf(strChar) == -1) { blnResult = false; } } return blnResult;
    }

    /**
    * PUBLIC METHOD
    * Wether an element is empty
    */
    $.fn.isEmpty = function () {
        return $.isEmpty($(this).val());
    }

    /**
    * PUBLIC METHOD
    * Wether an element is empty
    */
    $.isEmpty = function (str) {
        if ($.trim(str) == "") return true;
        return false;
    }

    /**
    * PUBLIC METHOD
    * Checks email format
    */
    $.fn.isEmail = function(){
        return $.isEmail($(this).val());
    }

    /**
    * PUBLIC METHOD
    * Checks email format
    */
    $.isEmail = function (str) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return str.match(re); 
    }

    /**
    * PUBLIC METHOD
    * Replaces all elements of a string
    */
    $.fn.replaceAll = function(text, replace, replacewith) {
        while (text.toString().indexOf(replace) != -1)
            text = text.toString().replace(replace, replacewith);
        return text;
    }

    /**
    *  PUBLIC METHOD
    *  Validates IBAN.
    */
    $.fn.validateIBAN = function (IBAN) {

        //Limpiamos el numero de IBAN
        IBAN = IBAN.toUpperCase();  //Todo a Mayus
        IBAN = $.trim(IBAN); //Quitamos blancos de principio y final.
        IBAN = IBAN.replace(/\s/g, "");  //Quitamos blancos del medio.
        IBAN = IBAN.replace(/\-/g, "");//Quitamos los guiones.

        var letra1, letra2, num1, num2;
        var isbanaux;
        var numeroSustitucion;
        var resto;

        // Para obtener la letra del NIE solo hay que sustituir la X del principio por un 0 y la Y por un 1 dividir el número entre 23 
        // Letra (X,Y,Z) seguida de número de 7 cifras y otra letra (digito de control). (NIE).

        if (IBAN.length > 34 || IBAN.length < 5) {
            return false;
        }

        var codigoPais = IBAN.substring(0, 2).toUpperCase();
        var digitoControl = IBAN.substring(2, 4);
        var numeroCuenta = IBAN.substring(4).toUpperCase();

        var numCuenta = numeroCuenta + codigoPais + "00";
        var Modulus = this.IBANCleaner(numCuenta);


        if (98 - this.ModuloIBAN(Modulus, 97) != parseInt(digitoControl)) {
            return false;
        }
        return true;
    }

    /**
    *  PRIVATE METHOD
    *  Method necessary for IBAN validation
    */
    $.fn.ModuloIBAN = function (sModulus, divisor) {
        var iStart, iEnde, iErgebniss, iRestTmp, iBuffer;
        var iRest = "", sErg = "";

        iStart = 0;
        iEnde = 0;
        while (iEnde <= sModulus.length - 1) {
            iBuffer = parseInt(iRest + sModulus.substring(iStart, iEnde + 1));

            if (iBuffer >= divisor) {
                iErgebniss = Math.floor(iBuffer / divisor);
                iRestTmp = iBuffer - iErgebniss * divisor;
                iRest = iRestTmp;

                iStart = iEnde + 1;
                iEnde = iStart;
            }
            else {

                iEnde = iEnde + 1;
            }
        }
        if (iStart <= sModulus.length)
            iRest = iRest + sModulus.substring(iStart);
        return parseInt(iRest);
    }

    /**
    *  PRIVATE METHOD
    *  Method necessary for IBAN validation
    */
    $.fn.IBANCleaner = function (sIBAN) {
        ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var x = 0; x < ls_letras.length; x++) {
            var replacewith = ls_letras.search(ls_letras[x]) + 10;
            var replace = ls_letras[x].toString();
            sIBAN = this.replaceAll(sIBAN, replace, replacewith.toString());
        }
        return sIBAN;
    }
    

    /**
    *  PRIVATE METHOD
    *  Verifys date format following DMY
    */
    $.fn.checkDateDMY = function (dateString) {
        try {
            var reg = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            if (!dateString.match(reg)) return false;

            var sdate = dateString.split("/");
            var d = parseInt(sdate[0], 10),
                 m = parseInt(sdate[1], 10),
                 y = parseInt(sdate[2], 10);

            if (d <= 0 || d > 31) return false;
            if (m <= 0 || m > 12) return false;
            if (y <= 0 || y > 9999) return false;
            return true;
        } catch (e) {
            return false;
        }
    };


    /** 
    *    PRIVATE METHOD
    *    Parses a date string in the specified format.
    * dateString: the string with the date to parse, usually a string of the kind 20/02/1978 or 2/20/1978
    * format: could be a string of the kind M/d/yyyy or dd/MM/yyyy
    * dateSeparator: the string used to separate the date parts, usually '/'
     */
    $.fn.parseDate = function (dateString, format, dateSeparator) {
        var formatParts = format.split(dateSeparator);
        var dateParts = dateString.split(dateSeparator);
        var day, month, year;

        //Idenfity which part contains the day
        if (formatParts[0].indexOf("d") > -1) day = dateParts[0];
        if (formatParts[1].indexOf("d") > -1) day = dateParts[1];
        if (formatParts[2].indexOf("d") > -1) day = dateParts[2];

        //Idenfity which part contains the month
        if (formatParts[0].indexOf("M") > -1) month = dateParts[0];
        if (formatParts[1].indexOf("M") > -1) month = dateParts[1];
        if (formatParts[2].indexOf("M") > -1) month = dateParts[2];

        //The javascript date object uses the 0-11 date format, so we 
        //decrease the month number to match the right number according to javascript.
        month--;

        //Idenfity which part contains the year
        if (formatParts[0].indexOf("y") > -1) year = dateParts[0];
        if (formatParts[1].indexOf("y") > -1) year = dateParts[1];
        if (formatParts[2].indexOf("y") > -1) year = dateParts[2];

        return new Date(year, month, day);
    };

}(jQuery));