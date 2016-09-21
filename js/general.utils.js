MessageManager = function (messageContainer, containerClasses) {
    /* Container General*/
    this.container             = null;
    this.messageContainer      = null;
    this.notificationContainer = null;

    this.classes              = {};
    this.showingMessage       = false;
    this.showingNotifications = false;
    this.lastClass            = null;

    this.scrollToTop = true;

    this.currentMessageTimeout = null;
    this.showTime              = 14; // cantidad de segundos que se muestra un mensaje

    var self = this;

    $(document).ready(
        function () {
            setTimeout(
                function () {
                    // Si habia un mensaje, reubico las notificaciones debajo de este
                    if (self.showingMessage) {
                        self.floatNotifications();
                    }
                }, 1
            );
        }
    );

    // -------------------------------------------------------------------------
    this.init = function (container, classes) {
        this.container             = container;
        this.messageContainer      = $(
            '<div />', {
                'id'    : 'messageContainer',
                'text'  : '',
                'class' : ''
            }
        );
        this.notificationContainer = $(
            '<div />', {
                'id'    : 'notificationContainer',
                'text'  : '',
                'class' : ''
            }
        );
        this.container.append(this.messageContainer);
        this.container.append(this.notificationContainer);

        var clearFixDiv = $('<div/>', {style : 'clear: both;'});
        this.container.append(clearFixDiv);

        this.container.show();
        this.messageContainer.hide();
        this.notificationContainer.hide();

        if (classes) {
            this.classes = classes;
        }

        var innerContainer = $(
            '<div />', {
                'id'    : 'innerContainer',
                'text'  : '',
                'class' : 'messageInner'
            }
        );
        var icon           = $(
            '<div />', {
                'id'    : 'messageIcon',
                'text'  : ' ',
                'style' : 'width: 30px; min-height: 21px; float : left;'
            }
        );
        var textContainer  = $(
            '<div />', {
                'id'    : 'textContainer',
                'style' : 'float : left; padding: 4px 0 0;margin-right:5px'
            }
        );
        var close          = $(
            '<div />', {
                'id'    : 'closeDiv',
                'class' : 'closeDiv',
                'style' : 'float : left; padding: 4px 0 0;'
            }
        );

        var self = this;
        $(document).on(
            'click', '#closeDiv', function () {
                self.lowerNotifications();
                self.hideMessage();
            }
        )

        innerContainer.append(icon).append(textContainer).append(close);
        this.messageContainer.append(innerContainer);
    }

    // -------------------------------------------------------------------------
    this.setScrollToTop = function (active) {
        self.scrollToTop = active;
    };

    // -------------------------------------------------------------------------
    this.showErrorMessage = function (messageText) {
        var errorClass = "messageError";
        if (this.classes.error) {
            errorClass = this.classes.error;
        }

        this._showMessage(messageText, errorClass);
    }

    // -------------------------------------------------------------------------
    this.showSuccessMessage = function (messageText) {
        var errorClass = "messageSuccess";
        if (this.classes.error) {
            errorClass = this.classes.error;
        }

        this._showMessage(messageText, errorClass);
    }

    // -------------------------------------------------------------------------
    this.showWarningMessage = function (messageText) {
        var errorClass = "messageWarning";
        if (this.classes.error) {
            errorClass = this.classes.error;
        }

        this._showMessage(messageText, errorClass);
    }

    // -------------------------------------------------------------------------
    this.showInternationalizedSuccessMessage = function (messageText, messageParameters) {
        messageParameters = messageParameters || {};
        self.showSuccessMessage(i18nHelper.getText(messageText, messageParameters));
    }

    // -------------------------------------------------------------------------
    this.showInternationalizedErrorMessage = function (messageText, messageParameters) {
        messageParameters = messageParameters || {};
        self.showErrorMessage(i18nHelper.getText(messageText, messageParameters));
    }

    // -------------------------------------------------------------------------
    this.showInternationalizedWarningMessage = function (messageText, messageParameters) {
        messageParameters = messageParameters || {};
        self.showWarningMessage(i18nHelper.getText(messageText, messageParameters));
    }

    // -------------------------------------------------------------------------
    this.showMessage = function (messageText, priority, showTime) {
        var errorClass   = "message" + priority;
        var lastShowTime = this.showTime;
        this.showTime    = showTime;

        this._showNotification(messageText, errorClass);
        this.showTime    = lastShowTime;
    }

    // -------------------------------------------------------------------------
    this.hideMessage = function (now) {
        this.lowerNotifications();
        if (this.showingMessage) {
            var self = this;

            clearTimeout(self.currentMessageTimeout);
            if (now) {
                $(self.messageContainer).hide();
                $(self.messageContainer).removeClass(this.lastClass);
                self.showingMessage = false;
            } else {
                $(self.messageContainer).slideUp(
                    "slow", function () {
                        $(self.messageContainer).hide();
                        $(self.messageContainer).removeClass(this.lastClass);
                        self.showingMessage = false;
                    }
                );
            }

        }
    }
    /* Difiere del showMessage porque pueden aparecer varias notificaciones */
    // -------------------------------------------------------------------------
    this._showNotification = function (messageText, messageTypeClass) {
        if (this.showingMessage) {
            this.floatNotifications();
        }

        this.notificationContainer.show();
        var self                  = this;
        this.showingNotifications = true;

        this.lastClass      = messageTypeClass;
        var subId           = Math.floor(Math.random() * 11);
        var innerContainerN = $(
            '<div />', {
                'id'    : 'innerContainer' + subId,
                'text'  : '',
                'class' : 'messageInner ' + messageTypeClass
            }
        );
        var iconN           = $(
            '<div />', {
                'id'    : 'messageIcon',
                'text'  : ' ',
                'style' : 'width: 30px; min-height: 21px; float : left;'
            }
        );
        var textContainerN  = $(
            '<div />', {
                'id'    : 'textContainer' + subId,
                'style' : 'float : left; padding: 4px 0 0;margin-right:5px'
            }
        );
        var closeN          = $(
            '<div />', {
                'id'    : 'closeDiv' + subId,
                'class' : 'closeDiv',
                'style' : 'float : left; padding: 4px 0 0;'
            }
        );

        var self    = this;
        $('#closeDiv' + subId).live(
            'click', function () {
                cualBorrar                = this.id.replace("closeDiv", "");
                this.showingNotifications = false;
                $("#innerContainer" + cualBorrar).remove();
            }
        )
        $("#innerContainer" + subId).hide();

        innerContainerN.append(iconN).append(textContainerN).append(closeN);
        this.notificationContainer.append(innerContainerN);

        $('#textContainer' + subId).html(messageText);
        var timeout = self.showTime;
        setTimeout(
            function () {
                $("#innerContainer" + subId).remove();
                this.showingNotifications = false;
            }, 15000
        );


    }

    this.lowerNotifications = function () {
        $('#notificationContainer').find('.messageWarning').css("top", "64px");
        $('#notificationContainer').find('.messageError').css("top", "64px");
    }

    this.floatNotifications = function () {
        setTimeout(
            function () {
                var notifTop = parseInt($('#messageContainer').find('.messageSuccess').css("top")) + 60;
                $('#notificationContainer').find('.messageWarning').css("top", notifTop + 'px');
                $('#notificationContainer').find('.messageError').css("top", notifTop + 'px');
            }, 100
        );
    }

    // -------------------------------------------------------------------------
    this._showMessage = function (messageText, messageTypeClass) {
        if (this.showingNotifications) {
            this.floatNotifications();
        }

        this.messageContainer.show();
        if (!this.showingMessage) {
            var self       = this;
            this.lastClass = messageTypeClass;
            $(this.messageContainer).find('#textContainer').html(messageText);
            var timeout    = self.showTime;
            $(this.messageContainer).find('.messageInner').removeClass('messageError messageSuccess');
            $(this.messageContainer).find('.messageInner').addClass(messageTypeClass).fadeIn(
                "fast", function () {
                    self.showingMessage        = true;
                    self.currentMessageTimeout = setTimeout(
                        function () {
                            $(self.messageContainer).slideUp(
                                "slow", function () {
                                    $(self.messageContainer).hide();
                                    $(self.messageContainer).removeClass(messageTypeClass);
                                    self.showingMessage = false;
                                    self.lowerNotifications();
                                }
                            );
                        }, timeout * 1000
                    );
                }
            );
        } else {
            this.hideMessage(true);
            this._showMessage(messageText, messageTypeClass);
        }

        if (this.scrollToTop && !isScrolledIntoView(this.messageContainer)) {
            // si no está visible, scrolleo
            var elemTop = $(this.messageContainer).offset().top - 150;
            $("html, body").animate(
                {
                    scrollTop : elemTop
                }, 600
            );
        } else {
            // está visible
        }
    }

    this.init(messageContainer, containerClasses);
    var self          = this;
    if (typeof (successFlashMessages) != 'undefined') {
        $.each(
            successFlashMessages, function (idx, message) {
                self.showSuccessMessage(message);
            }
        );
        successFlashMessages = [];
    }

    if (typeof (errorFlashMessages) != 'undefined') {
        $.each(
            errorFlashMessages, function (idx, message) {
                self.showErrorMessage(message);
            }
        );
        errorFlashMessages = [];
    }

    if (typeof (notificationMessages) != 'undefined') {
        $.each(
            notificationMessages, function (idx, message) {
                self.showMessage(message.message, message.priority, message.showTime);
            }
        );
        notificationMessages = [];
    }


}

isScrolledIntoView = function(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
    && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

/**
 * Clase que permite formatear números.
 * El método formatInputs aplica el formato indicado a todos los inputs que
 * posean la clase pasada por parámetro.
 * El método formatNumber retornará el número indicado con el formato solicitado.
 */
NumberFormatter = {
    /**
     * Cantidad de decimales
     */
    decimals: 2,

    /**
     * Cantidad de decimales para las monedas
     */
    decimalsForCurrency: 2,

    /**
     * Separador de decimales
     */
    decimalPoint: '.',

    /**
     * Separador de miles
     */
    thousandsSep: ',',

    /**
     * Simbolo de la moneda
     */
    currency: '$',

    /**
     * Symbolo de moneda segun pais
     */
    countryCurrency: null,

    /**
     * Exceptiones de monedas
     */
    exceptionsSymbol: [],

    /**
     *
     * @param options
     */
    setOptions: function(options) {

        if(options !== undefined) {

            if (options.decimals !== undefined) {
                this.decimals = options.decimals;
            }
            if (options.decimalsForCurrency !== undefined) {
                this.decimalsForCurrency = options.decimalsForCurrency;
            }

            if (options.decimalPoint !== undefined) {
                this.decimalPoint = options.decimalPoint;
            }

            if (options.thousandsSep !== undefined) {
                this.thousandsSep = options.thousandsSep;
            }

            if (options.currency !== undefined) {
                this.currency = options.currency;
            }

            if (options.countryCurrency !== undefined) {
                this.countryCurrency = options.countryCurrency;
            }

            if (options.exceptionsSymbol !== undefined) {
                this.exceptionsSymbol = options.exceptionsSymbol;
            }
        }

        return this;
    },

    /**
     * Inicializa los formateos
     * @param options
     */
    init: function(options) {
        this.setOptions(options);
        this.integer('.integerFormat');
        this.toFloat('.floatFormat');
        this.percentage('.percentageFormat');
        this.currencyFormat('.currencyFormat');
        this.currencyWithoutSymbol('.currencyFormatWithoutSymbol');
        this.bindClickEvent();
    },

    /**
     *
     * @param element
     * @param options
     */
    setEventDomNodeInserted: function(elementName, options, callbackFunction) {
        var self = this;

        $('body').on('DOMNodeInserted', function(e) {
            if ($(e.target).find(elementName + ':not(.alreadyFormatted)').length > 0) {
                $(e.target).find(elementName + ':not(.alreadyFormatted)').each(function(idx, element) {
                    $(element).val(self.formatNumber($(element).val(), options));
                    $(element).number(true, options.decimals, options.decimalPoint, options.thousandsSep);
                    $(element).addClass('alreadyFormatted');

                    self.addEventDecimalSeparator(element);

                    if(callbackFunction != undefined) {
                        callbackFunction(self, elementName);
                    }
                });
            }
        });
    },

    /**
     * Formatea del número según configuración inicial
     *
     * @param elementName
     */
    makeFormat: function(elementName, options, callbackFunction) {
        var self = this;

        this.setEventDomNodeInserted(elementName, options, callbackFunction);

        $(elementName).each(function(idx, element) {
            $(element).val(self.formatNumber($(element).val(), options));
        });

        $(elementName).number(true, options.decimals, options.decimalPoint, options.thousandsSep);

        this.addEventDecimalSeparator(elementName);

        if(callbackFunction != undefined) {
            callbackFunction(self, elementName);
        }

        $(document).on('blur', elementName, function(e) {
            if ($(this).val() == '') {
                $(this).val(self.formatNumber(0, options));
            }

            /*
             * Esta accion se realiza para forzar el evento change,
             * el cual nunca se lanza cuando se utiliza la libreria jquery.number
             */
             $(this).trigger('change');
        });
    },

    /**
     * @param elementName
     */
    addEventDecimalSeparator: function(elementName) {
        if(this.decimals > 0 && this.decimalPoint == ',') {
            var self = this;
            $(elementName).on('keyup', function (event) {

                if (event.which == 110) {
                    var value = $(this).val();
                    var totalNumbers = value.toString().split('.')[0].length;
                    var thousandsSepCant = Math.ceil(totalNumbers / 3 - 1);

                    if(thousandsSepCant < 0) {
                        thousandsSepCant = 0;
                    }

                    var totalLength = parseFloat(value).toFixed(self.decimals).length + thousandsSepCant;
                    this.setSelectionRange(totalLength - self.decimals, totalLength - self.decimals);
                }
            });
        }
    },

    /**
     *
     * @param value
     * @param options
     * @param callbackFunction
     */
    getFormatted: function(value, options, callbackFunction) {
        var formattedValue = this.formatNumber(value, options);

        if(callbackFunction != undefined) {
            formattedValue = callbackFunction(this, formattedValue);
        }

        return formattedValue;
    },

    /**
     * Formateo de número
     *
     * @param number
     * @returns {*}
     */
    formatNumber: function(number, options) {
        return $.number(parseFloat(number), options.decimals, options.decimalPoint, options.thousandsSep);
    },

    /**
     * Alias de "integer"
     */
    toInteger : function(element, options) {
        return this.integer(element, options);
    },

    /**
     * @param element
     * @param options (Opcional)
     */
    integer: function(element, options) {
        this.setOptions(options);

        var integerOptions = {
            decimals: "0",
            decimalPoint: this.decimalPoint,
            thousandsSep: this.thousandsSep
        };

        if( this.isHtmlElement(options) && this.existElements(element)) {
            this.makeFormat(element, integerOptions);
        }

        return this.getFormatted(element, integerOptions);
    },

    /**
     * Alias del método "integer"
     * @param element
     * @param options (Opcional)
     */
    toInteger : function(element, options) {
        return this.integer(element, options);
    },

    /**
     * @param element
     * @param options (Opcional)
     *
     * El nombre de esta funcion es toFloat debido a que YUI compressor toma
     * float como una palabra reservada, dando errores de compresión. Para que
     * no quede diferente al resto, se agregaron alias para integer (toInterger)
     * y percentage (toPercentage).
     */
    toFloat: function(element, options) {
        this.setOptions(options);

        var floatOptions = {
            decimals: this.decimals.toString(),
            decimalPoint: this.decimalPoint,
            thousandsSep: this.thousandsSep
        };

        if( this.isHtmlElement(options) && this.existElements(element)) {
            this.makeFormat(element, floatOptions);
        }

        return this.getFormatted(element, floatOptions);
    },

    /**
     * Alias de "percentage"
     */
    toPercentage : function(element, options) {
        return this.integer(element, options);
    },

    /**
     * @param element
     * @param options (Opcional)
     */
    percentage: function(element, options) {
        this.setOptions(options);

        var percentageOptions = {
            decimals: this.decimals.toString(),
            decimalPoint: this.decimalPoint,
            thousandsSep: this.thousandsSep
        };

        if( this.isHtmlElement(options) && this.existElements(element)) {
            $(element).addClass('percentageFormat').addClass('currency_POR');
            this.makeFormat(element, percentageOptions);
        }

        return this.getFormatted(element, percentageOptions) + ' %' ;
    },

    /**
     * Alias del método "percentage"
     * @param element
     * @param options (Opcional)
     */
    toPercentage : function(element, options) {
        return this.percentage(element, options);
    },

    /**
     * @param element
     * @param options (Opcional)
     */
    currencyFormat: function(element, options) {
        this.setOptions(options);

        var currencyOptions = {
            decimals: this.decimalsForCurrency,
            decimalPoint: this.decimalPoint,
            thousandsSep: this.thousandsSep
        };

        if( this.isHtmlElement(options) && this.existElements(element)) {
            this.makeFormat(element, currencyOptions, this.setCurrencySymbol);
        }

        return this.addStrCurrencySymbol(this.getFormatted(element, currencyOptions));
    },

    /**
     * @param element
     * @param options (Opcional)
     */
    currencyWithoutSymbol: function(element, options) {
        this.setOptions(options);

        var currencyOptions = {
            decimals: this.decimalsForCurrency,
            decimalPoint: this.decimalPoint,
            thousandsSep: this.thousandsSep
        };

        if( this.isHtmlElement(options) && this.existElements(element)) {
            this.makeFormat(element, currencyOptions);
        }

        return this.getFormatted(element, currencyOptions);
    },

    /**
     *
     * @param value
     */
    addStrCurrencySymbol: function(value) {
        var currency = value;

        if(this.currency) {
            var symbol = this.getCurrencySymbol();

            if(this.currency.symbol_position == 'pre') {
                currency = symbol + ' ' + value;
            } else {
                currency = value + ' ' + symbol;
            }
        }

        return currency;
    },

    /**
     *
     * @param object
     * @param element
     */
    setCurrencySymbol: function(object, element) {
        if (object.currency) {
            var symbol = object.getCurrencySymbol();
            object.addCurrencySymbol(element, symbol);
        }
    },

    /**
     * Obtiene el symbolo a mostrar
     * @returns {*}
     */
    getCurrencySymbol: function() {
        var currencySymbol = this.currency.symbol;

        if(this.countryCurrency != this.currency.id && $.inArray( this.currency.id, this.exceptionsSymbol) < 0) {
            currencySymbol = this.currency.iso_code;
        }

        return currencySymbol;
    },

    /**
     * Inserta el symbolo de la moneda
     * @param element
     * @param symbol
     */
    addCurrencySymbol: function(element, symbol) {
        var self = this;
        var lengthSymbol = symbol.length;
        var currencySymbolClass = 'currency-symbol-' + lengthSymbol;
        var inactive = '';

        if($(element).hasClass('inactive')) {
            inactive = 'inactive';
        }

        this.cleanCurrencyFormat(element);

        $(element).each(function(){
            if(self.currency.symbol_position == 'pre') {
                $(this).addClass('currencyFormat currency-input-left ' + currencySymbolClass);
                $(this).before('<input type="text" value="'+symbol+'" readonly="" disabled class="currency-input pre-currency ' + currencySymbolClass + ' ' + inactive + '"/>');
            } else {
                $(this).addClass('currencyFormat currency-input-right ' + currencySymbolClass);
                $(this).after('<input type="text" value="'+symbol+'" readonly="" disabled class="currency-input suf-currency ' + currencySymbolClass + ' ' + inactive + '"/>');
            }
        });
    },

    /**
     * Comprueba si es un valor o un elemento html como el input
     *
     * @param options
     * @returns {boolean}
     */
    isHtmlElement: function(options) {
        var isHtmlElement = true;

        if(options !== undefined && options.inputElement !== undefined && options.inputElement === false) {
            isHtmlElement = false;
        }

        return isHtmlElement;
    },

    /**
     * Verifica si existe el elemento
     *
     * @param element
     * @returns {boolean}
     */
    existElements: function(element) {
        var existElements = false;

        if($(element).length > 0){
            existElements = true;
        }

        return existElements;
    },

    /**
     *
     * @param element
     */
    toogle: function(element, newType) {
        if(newType == 'currencyFormat') {
            this.currencyFormat(element);
        }

        if(newType == 'percentageFormat') {
            this.percentage(element);
            this.cleanCurrencyFormat(element);
        }

        if(newType == 'floatFormat') {
            this.toFloat(element);
            this.cleanCurrencyFormat(element);
        }

        if(newType == 'currencyWithoutSymbolFormat') {
            this.currencyWithoutSymbol(element);
            this.cleanCurrencyFormat(element);
        }
    },

    /**
     * Limpia el formato del precio
     * @param element
     */
    cleanCurrencyFormat: function(element) {
        var sufCurrency = $(element).next();
        var preCurrency = $(element).prev();

        if($(sufCurrency).hasClass('suf-currency')) {
            $(sufCurrency).remove();
        }

        if($(preCurrency).hasClass('pre-currency')) {
            $(preCurrency).remove();
        }
    },

    bindClickEvent: function() {
        $('.integerFormat, .floatFormat, .percentageFormat, .currencyFormat, .currencyFormatWithoutSymbol').on('click', function(e) {
            $(this).select();
        });
    }
}

/**
 * Validador de formularios que utiliza el plugin de jQuery Validation
 * Todas las reglas de validacion se encuentran en el archivo validation.utils.js
 * Todos los textos de validacion se encuentran en el archivo _validationText.php
 * http://docs.jquery.com/Plugins/Validation
 *
 * formElement         -> Elemento formulario
 * section             -> Nombre de la sección dentro del js de validaciones (ej: stock, general, sales, etc)
 * type                -> Tipo entro de la sección en el js de validaciones (ej dentro de sales: editOrCreateCustomer, newBranch, etc)
 * submitButton        -> Elemento que al ser clickeado envia el formulario
 * validFormCallback   -> Codigo a ser ejecutado cuando se clickea en el submitButton y el formulario es valido
 * invalidFormCallback -> Codigo a ser ejecutado cuando se clickea en el submitButton y el formulario es invalido
 * noScroll            -> Evitar o no el scroll en la validación (ej: true o false)
 *
 * En caso que el submit button asociado con la instancia del form validator tenga la clase
 * "stopsubmitting", se detendrá el submiteo del formulario, dejando al botón en estado
 * "disabled".
 */
FormValidator = function (formElement, section, type, submitButton, validFormCallback, useMessageManager, invalidFormCallback, noScroll) {

    this.section                   = null;
    this.type                      = null;
    this.form                      = null;
    this.submitButton              = null;
    this.submitCallback            = null;
    this.breakValidationCycleClass = 'stopsubmitting';
    this.useMessageManager         = true;
    this.invalidCallback           = function () {
    };
    this.noScroll                  = false;

    // -------------------------------------------------------------------------
    this.init = function (form, section, type, submitButton, validFormCallback, useMessageManager, invalidFormCallback, noScroll) {

        this.form           = form;
        this.section        = section;
        this.type           = type;
        this.submitButton   = submitButton;
        this.submitCallback = validFormCallback;

        if (typeof invalidFormCallback != 'undefined') {
            this.invalidCallback = invalidFormCallback;
        }

        if (typeof useMessageManager != 'undefined') {
            this.useMessageManager = useMessageManager;
        }

        if (typeof noScroll != 'undefined') {
            this.noScroll = noScroll;
        }

        var self      = this;
        var vInterval = setInterval(
            function () {
                if (loadedValidationLangs) {
                    clearInterval(vInterval);
                    self.startValidation();
                }
            }, 250
        );
    }

    this.showErrors = function (errorMap, errorList) {
        var idPrimerError;

        if (errorList && errorList.length) {

            var i, elements;

            for (i = 0; errorList[i]; i++) {

                var error = errorList[i];
                if (this.settings.highlight) {
                    this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass)
                }

                if (this.useMessageManager) {
                    //messageManager.showErrorMessage(i18nHelper.getText(error.message));
                    messageManager.showErrorMessage(error.message);
                } else {
                    //this.showLabel(error.element, i18nHelper.getText(error.message));
                    this.showLabel(error.element, error.message);
                    //alert(submitButton.attr('class'));
                    //Fix en Datos del Cliente para el mensaje de error cuando se selecciona DNI
                    if (error.element.id == 'company_name' || error.element.id == 'company_surname') {
                        if (type == 'sesManagers') {
                            $('.wrap-error-company').parent().find('input.error').css('display', 'inline');
                            var errorCompany = $('#' + error.element.id).parent().find('div.error');
                            errorCompany.clone().appendTo($('.wrap-error-company'));
                            errorCompany.remove();
                        }
                    }
                    //Fix en Datos de Persona para el mensaje de error
                    if (error.element.id == 'contact_surname' || error.element.id == 'contact_name') {
                        $('.wrap-error-persona').parent().find('input.error').css('display', 'inline');
                        var errorClient = $('#' + error.element.id).parent().find('div[for=' + error.element.id + '].error');
                        errorClient.clone().appendTo($('.wrap-error-persona'));
                        errorClient.remove();
                    }
                }

            }
        } else {
            $("div.error").remove();
        }

        //Guardo el primer error para scrolear a este solo
        if (errorList.length >= 1) {
            idPrimerError = $('.error');
            scrollFixed   = ( idPrimerError.stop().offset().top - 170 );

            //scrolleo al error
            if (type != 'sesManagers' && !noScroll) {
                $('html, body').animate(
                    {
                        scrollTop : scrollFixed
                    }, 2000
                );
            }
        }

        for (i = 0, elements = this.validElements(); elements[i]; i++) {
            this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
        }

    }

    // -------------------------------------------------------------------------
    this.getRules = function () {
        if (ValidationSchemas[this.section] && ValidationSchemas[this.section][this.type]) {
            var rules = ValidationSchemas[this.section][this.type].rules;
            return this.expandClasses(rules);
        } else {
            return {};
        }
    }

    // -------------------------------------------------------------------------
    this.getMessages = function () {
        if (ValidationSchemas[this.section] && ValidationSchemas[this.section][this.type]) {
            var messages = ValidationSchemas[this.section][this.type].messages;
            return this.expandClasses(messages);
        } else {
            return {};
        }
    }

    // -------------------------------------------------------------------------
    this.expandClasses = function (obj) {
        for (var formElementId in obj) {
            if (formElementId.indexOf('.') == 0) {
                this.form.find(formElementId).each(
                    function (idx, formElement) {
                        var newFormElementName = (formElementId + '_' + idx).replace('.', '');

                        $(formElement).attr('name', newFormElementName);

                        obj[newFormElementName] = obj[formElementId];
                    }
                );
                delete obj[formElementId];
            }
        }

        return obj;
    }

    // -------------------------------------------------------------------------
    this.startValidation = function () {
        var self     = this;
        var rules    = this.getRules();
        var messages = this.getMessages();

        this.form.validate(
            {
                onsubmit            : false,
                onkeyup             : function(element) { $(element).valid() },
                submitHandler       : function () {
                    return false;
                },
                onfocusout          : function () {
                    return true;
                },
                invalidHandler      : self.invalidCallback,
                errorLabelContainer : $("#" + this.form.attr('id') + " #formValidationErrorContainer"),
                errorElement        : 'div',
                rules               : rules,
                messages            : messages,
                showErrors          : self.showErrors
            }
        );

        this.submitButton.unbind('click');
        this.submitButton.bind(
            'click', function (e) {
                e.preventDefault();

                // Verifico clase que permite cortar el ciclo de validación/submit en un boton
                if (!$(this).hasClass(self.breakValidationCycleClass)) {
                    if ($(self.form).valid()) {
                        self.submitCallback(this, e);
                    } else {
                        //Si hay errores, corto la propagación de eventos
                        e.stopPropagation();
                    }
                }

            }
        );
    }

    this.init(formElement, section, type, submitButton, validFormCallback, useMessageManager, invalidFormCallback, noScroll);
}

// ---------------------------------------------------------------------------
/**
 * Carga de los mensajes de validación específicos para el módulo y acción actuales
 */
var loadedValidationLangs = false;
$(document).ready(
    function () {
        var dataSystem = {};
        if (typeof Data != 'undefined') {
            dataSystem = Data.System;
        }

        $.get(
            '/home/getValidationTexts', dataSystem, function (data) {
                for (var key in data) {
                    if (ValidationSchemas[key]) {
                        for (var validationForm in data[key]) {
                            if (ValidationSchemas[key][validationForm]) {
                                ValidationSchemas[key][validationForm]['messages'] = data[key][validationForm].messages;
                            }
                        }
                    }
                }
                loadedValidationLangs = true;
            }, 'json'
        );
    }
);


/**
 * Funciones creadas por nosotros para validacion de formularios.
 */
jQuery.validator.setDefaults(
    {
        ignore : false
    }
);

jQuery.validator.addMethod(
    'inarray', function (value, element, params) {
        return this.optional(element) || params.indexOf(value) != -1;
    }, 'El elemento seleccionado no es valido'
);
jQuery.validator.addMethod(
    'pattern', function (value, element, params) {
        var regex = new RegExp(params);
        return this.optional(element) || regex.test(value);
    }, 'El elemento seleccionado no es valido'
);

jQuery.validator.addMethod(
    'integer', function (value, element, params) {
        var intRegex = /^\d+$/;
        if (intRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    }, 'El valor debe ser del tipo entero'
);
jQuery.validator.addMethod(
    'custom', function (value, element, customValidation) {
        return customValidation;
    }
);

/**
 * Equivalente al ucfirst de php en javascript
 * @param string input
 * @return string
 */
var str_ucfirst = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Aplica al elemento seleccionado un velo semi transparente.
 *
 * @var Object target
 * @deprecated
 **/
function divLoader(target) {
    var div = $(
        '<div>', {
            id : 'divLoader'
        }
    );

    div.height(target.height());
    div.width(target.width());
    div.css('margin', target.css('margin'));
    div.css('padding', target.css('padding'));
    div.css('opacity', '0.5');
    div.css('position', 'absolute');
    div.css('float', 'left');
    div.css('background-color', 'white');
    div.css('z-index', '1000');

    div.css('text-align', 'center');

    var loadingImg = $(
        '<img />', {
            src   : '/img/slider-ajax-loader.gif',
            style : 'margin-top: ' + target.height() / 3 + 'px;'
        }
    );

    div.append(loadingImg);
    target.prepend(div);
}

/**
 * Aplica del elemento seleccionado el velo semi transparente que se está mostrando.
 *
 * @var Object target
 **/
function removeDivLoader() {
    $('#divLoader').remove();
}

/**
 * Agrega un loading bloqueante al elemento identificado por el parámetro "selector"
 */
function showContentLoading(selector) {
    var elem;
    if (typeof selector === "string") {
        elem = $(selector);
    } else if (typeof selector === "object") {
        elem = selector;
    } else {
        throw "Invalid selector in showContentLoading";
    }
    removeContentLoading();
    var divLoaderWrapper = $(
        '<div>', {
            'class' : 'divLoaderWrapper'
        }
    );
    var divBg            = $(
        '<div>', {
            'class' : 'bg'
        }
    );
    var divLoader        = $(
        '<div>', {
            'class' : 'loader'
        }
    );
    var divLoader32      = $(
        '<div>', {
            'class' : 'loader-container'
        }
    );

    divBg.css('width', elem.css('width'));
    divBg.css('height', elem.css('height'));
    divLoader.append(divLoader32);
    divBg.append(divLoader);
    divLoaderWrapper.append(divBg);
    elem.prepend(divLoaderWrapper);
}

/**
 * Quita los loader agregados con showContentLoading
 */
function removeContentLoading() {
    $('.divLoaderWrapper').remove();
}

/**
 * Agrega un loading bloqueante al div con la clase mainContentWrapper
 * Para quitarlo hay que llamar a removeMainContentLoading
 */
function showMainContentLoading() {
    removeMainContentLoading();
    $('.cont').addClass('blanco').show();
    var loaderObj = $('#divMainLoader');
    loaderObj.show();
    loaderObj.attr('style', "position:absolute");

    $(document).one(
        'keyup', function (e) {
            if (e.which == 27) {
                removeMainContentLoading();
            }
        }
    );
}

/**
 * Agrega un loading bloqueante a la pantalla completa
 * Para quitarlo hay que llamar a removeWindowContentLoading
 *
 * overlayColor tiene que ser algo del estilo: rgba(R, G, B, opacity) o rgb(R, G, B)
 */
function showWindowContentLoading(overlayColor) {
    removeMainContentLoading();

    if (!overlayColor) {
        overlayColor = 'rgba(0, 0, 0, 0.4)';
    }

    var modal  = $(
        '<div/>',
        {
            id    : 'windowLoader',
            style : 'background: none repeat scroll 0% 0% ' + overlayColor + '; position: fixed; z-index: 8956; top: 0px; height: 100%; width: 100%;'
        }
    );
    var loader = $('<div/>', {'class' : 'main-loader'});
    $('body').append(modal.append(loader));
}

function removeWindowContentLoading() {
    $('#windowLoader').remove();
}

/**
 * Quita el loading que se agregó con showMainContentLoading
 */
function removeMainContentLoading() {
    removeContentLoading();
    $('#divMainLoader').hide('');
    $('.cont').hide();
    $('#divMainLoader').hide();
}

/**
 * Pone un layer con transparencia en toda la pantalla para bloquear cualquier acción
 */
function showMainContentLayer() {
    $('body').append('<div class="ui-widget-overlay ui-front"></div>');
}

/**
 * Quita el layer que se agregó con showMainContentLayer
 */
function removeMainContentLayer() {
    $('.ui-widget-overlay').remove();
}


$(window).resize(
    function () {
        if ($('#divLoader').length > 0) {
            removeMainContentLoading();
            showMainContentLoading();
        }
    }
);

// -----------------------------------------------------------------------------
/**
 * Limpia el string sacandole los espacios y pasandolo a minuscula
 * @param {string} string
 * @returns {string}
 */
var sanitizeString = function(string) {
    return string = $.trim(string).toLowerCase();

}

function sanitizeStr(str) {
    var x = str.split(" ");
    var res = "";
    x.forEach(function(z) {
        res += z.replace(/^[[:alpha:]\s'"\-_&@!?()\[\]-]*$/ig, "") + " ";
    });
    return res.trim();
};

function replaceWeirdChars(str) {
    var replace = {
        'ъ':'-', 'Ь':'-', 'Ъ':'-', 'ь':'-',
        'Ă':'A', 'Ą':'A', 'À':'A', 'Ã':'A', 'Á':'A', 'Æ':'A', 'Â':'A', 'Å':'A', 'Ä':'Ae',
        'Þ':'B',
        'Ć':'C', 'ץ':'C', 'Ç':'C',
        'È':'E', 'Ę':'E', 'É':'E', 'Ë':'E', 'Ê':'E',
        'Ğ':'G',
        'İ':'I', 'Ï':'I', 'Î':'I', 'Í':'I', 'Ì':'I',
        'Ł':'L',
        'Ñ':'N', 'Ń':'N',
        'Ø':'O', 'Ó':'O', 'Ò':'O', 'Ô':'O', 'Õ':'O', 'Ö':'Oe',
        'Ş':'S', 'Ś':'S', 'Ș':'S', 'Š':'S',
        'Ț':'T',
        'Ù':'U', 'Û':'U', 'Ú':'U', 'Ü':'Ue',
        'Ý':'Y',
        'Ź':'Z', 'Ž':'Z', 'Ż':'Z',
        'â':'a', 'ǎ':'a', 'ą':'a', 'á':'a', 'ă':'a', 'ã':'a', 'Ǎ':'a', 'а':'a', 'А':'a', 'å':'a', 'à':'a', 'א':'a', 'Ǻ':'a', 'Ā':'a', 'ǻ':'a', 'ā':'a', 'ä':'ae', 'æ':'ae', 'Ǽ':'ae', 'ǽ':'ae',
        'б':'b', 'ב':'b', 'Б':'b', 'þ':'b',
        'ĉ':'c', 'Ĉ':'c', 'Ċ':'c', 'ć':'c', 'ç':'c', 'ц':'c', 'צ':'c', 'ċ':'c', 'Ц':'c', 'Č':'c', 'č':'c', 'Ч':'ch', 'ч':'ch',
        'ד':'d', 'ď':'d', 'Đ':'d', 'Ď':'d', 'đ':'d', 'д':'d', 'Д':'d', 'ð':'d',
        'є':'e', 'ע':'e', 'е':'e', 'Е':'e', 'Ə':'e', 'ę':'e', 'ĕ':'e', 'ē':'e', 'Ē':'e', 'Ė':'e', 'ė':'e', 'ě':'e', 'Ě':'e', 'Є':'e', 'Ĕ':'e', 'ê':'e', 'ə':'e', 'è':'e', 'ë':'e', 'é':'e',
        'ф':'f', 'ƒ':'f', 'Ф':'f',
        'ġ':'g', 'Ģ':'g', 'Ġ':'g', 'Ĝ':'g', 'Г':'g', 'г':'g', 'ĝ':'g', 'ğ':'g', 'ג':'g', 'Ґ':'g', 'ґ':'g', 'ģ':'g',
        'ח':'h', 'ħ':'h', 'Х':'h', 'Ħ':'h', 'Ĥ':'h', 'ĥ':'h', 'х':'h', 'ה':'h',
        'î':'i', 'ï':'i', 'í':'i', 'ì':'i', 'į':'i', 'ĭ':'i', 'ı':'i', 'Ĭ':'i', 'И':'i', 'ĩ':'i', 'ǐ':'i', 'Ĩ':'i', 'Ǐ':'i', 'и':'i', 'Į':'i', 'י':'i', 'Ї':'i', 'Ī':'i', 'І':'i', 'ї':'i', 'і':'i', 'ī':'i', 'ĳ':'ij', 'Ĳ':'ij',
        'й':'j', 'Й':'j', 'Ĵ':'j', 'ĵ':'j', 'я':'ja', 'Я':'ja', 'Э':'je', 'э':'je', 'ё':'jo', 'Ё':'jo', 'ю':'ju', 'Ю':'ju',
        'ĸ':'k', 'כ':'k', 'Ķ':'k', 'К':'k', 'к':'k', 'ķ':'k', 'ך':'k',
        'Ŀ':'l', 'ŀ':'l', 'Л':'l', 'ł':'l', 'ļ':'l', 'ĺ':'l', 'Ĺ':'l', 'Ļ':'l', 'л':'l', 'Ľ':'l', 'ľ':'l', 'ל':'l',
        'מ':'m', 'М':'m', 'ם':'m', 'м':'m',
        'ñ':'n', 'н':'n', 'Ņ':'n', 'ן':'n', 'ŋ':'n', 'נ':'n', 'Н':'n', 'ń':'n', 'Ŋ':'n', 'ņ':'n', 'ŉ':'n', 'Ň':'n', 'ň':'n',
        'о':'o', 'О':'o', 'ő':'o', 'õ':'o', 'ô':'o', 'Ő':'o', 'ŏ':'o', 'Ŏ':'o', 'Ō':'o', 'ō':'o', 'ø':'o', 'ǿ':'o', 'ǒ':'o', 'ò':'o', 'Ǿ':'o', 'Ǒ':'o', 'ơ':'o', 'ó':'o', 'Ơ':'o', 'œ':'oe', 'Œ':'oe', 'ö':'oe',
        'פ':'p', 'ף':'p', 'п':'p', 'П':'p',
        'ק':'q',
        'ŕ':'r', 'ř':'r', 'Ř':'r', 'ŗ':'r', 'Ŗ':'r', 'ר':'r', 'Ŕ':'r', 'Р':'r', 'р':'r',
        'ș':'s', 'с':'s', 'Ŝ':'s', 'š':'s', 'ś':'s', 'ס':'s', 'ş':'s', 'С':'s', 'ŝ':'s', 'Щ':'sch', 'щ':'sch', 'ш':'sh', 'Ш':'sh', 'ß':'ss',
        'т':'t', 'ט':'t', 'ŧ':'t', 'ת':'t', 'ť':'t', 'ţ':'t', 'Ţ':'t', 'Т':'t', 'ț':'t', 'Ŧ':'t', 'Ť':'t', '™':'tm',
        'ū':'u', 'у':'u', 'Ũ':'u', 'ũ':'u', 'Ư':'u', 'ư':'u', 'Ū':'u', 'Ǔ':'u', 'ų':'u', 'Ų':'u', 'ŭ':'u', 'Ŭ':'u', 'Ů':'u', 'ů':'u', 'ű':'u', 'Ű':'u', 'Ǖ':'u', 'ǔ':'u', 'Ǜ':'u', 'ù':'u', 'ú':'u', 'û':'u', 'У':'u', 'ǚ':'u', 'ǜ':'u', 'Ǚ':'u', 'Ǘ':'u', 'ǖ':'u', 'ǘ':'u', 'ü':'ue',
        'в':'v', 'ו':'v', 'В':'v',
        'ש':'w', 'ŵ':'w', 'Ŵ':'w',
        'ы':'y', 'ŷ':'y', 'ý':'y', 'ÿ':'y', 'Ÿ':'y', 'Ŷ':'y',
        'Ы':'y', 'ž':'z', 'З':'z', 'з':'z', 'ź':'z', 'ז':'z', 'ż':'z', 'ſ':'z', 'Ж':'zh', 'ж':'zh'
    };

    $.each(replace, function (c, equivalent) {
        str = str.replace(new RegExp(c, 'g'), equivalent);
    });

    return str;
};

function htmlEntities(text) {
    return jQuery('<div />').text(text).html();
}

function htmlDecode(text) {
    return $('<div />').html(text).text();
}

/**
 * Extend String object with latinize function
 */
var Latinize={};
Latinize.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinize=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinize.latin_map[a]||a})};