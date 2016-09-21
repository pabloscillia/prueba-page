$(function() {
    
    $('#confirmLogin').show();
    $('#loadImgPor').hide();

    $(document).keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#confirmLogin').click();//Trigger search button click event
        }
    });

    $(document).on('focus','#formLogin input',function(e){
        $('.errorMessage').hide();
    });
    
    $(document).on('click','.errorMessage',function(e){
        $(this).hide();
    })



    var confirmLogin = function(){
       
        //Loader o Precarga        
        $('#confirmLogin').hide();
        $('#loadImgPor').show();

        var data = {
            'username' : $('#username').val(), 
            'password' : $('#password').val()
        }

        $.post('/login/ajaxLogin', data, function(response) {
            if (response.success) {
                $('#confirmLogin').hide();
                $('#loadImgPor').show(); 

                window.location.href = response.nextUrl;
            } else {
                $('#confirmLogin').show();
                $('#loadImgPor').hide();

                $('.errorMessage').fadeIn('fast', function(){
                    $('.errorMessage').delay(3000).fadeOut();
                });
            }
            
        }, 'json');
    
    }
    
    new FormValidator($("#formLogin"), 'portalSantanderES', 'login', $("#confirmLogin"), confirmLogin, false, function(){}, true);
    
    /**
     * Santander Chile
     * Confirm Login
     * 
     * @returns {undefined}
     */
    var confirmLoginCL = function(){
       
        var data = {
            'username' : $('#username').val(),
            'password' : $('#password').val(),
            'reseller' : $('#reseller').val()
        };
        
        $.post('/login/ajaxLogin', data, function(response) {
            if (response.success) {
                window.location.href = response.nextUrl;
            } else {
                $('<div for="password" class="error">' + i18nHelper.getText('Login Inválido') + '</div>').insertAfter('#password');
            }
        }, 'json');
    
    };
    new FormValidator($("#formLoginCL"), 'portalSantanderCL', 'login', $("#confirmLoginCL"), confirmLoginCL, false, function(){}, true);
    
    // Ejecutar el formulario cuando se apreta el enter en los campos
    $(document).on('keydown', '#formLoginCL input[type=text], #formLoginCL input[type=password]', function(e) {
        if(e.which === 13) {
            console.log(e.which + ' ENTER');
            $('#confirmLoginCL').trigger('click');
        }
    });
    
    
    //precarga

    $(window).load(function() {
        $('.page-loader').fadeOut('slow');
        $('body').css({'overflow-y':'visible'});
    })

    /* Ingresa a tu sitio */ 

    $('.login_box').fadeTo(0,0);

    // Login
    $('.access, .login_box').on('click',function(event){
        $('.login_box').fadeTo('fast',1);
        event.stopPropagation();
        return false;
    })


    $(document).on('click',function(){
        $('.login_box').fadeTo(0,0);
    });
        //Box Login
        function showStepLogin(stepToShow){
            $('#step_login').hide();
            $('#step_forget').hide();
            $('#step_success').hide();      

            $('#step_'+stepToShow).show();
        }

        //init login user
        showStepLogin('login');

        $('#step_login').show();
        $('#step_forget').hide();
        $('#step_success').hide();

        $('.rest_cont').on('click',function(e){
            //showStepLogin('forget');            
            e.preventDefault();
            window.location.href = $(this).attr('href');
        });

        //recuperar contraseña
        $('#btn_forget_pass').on('click',function(e){
            var emailRecPass = $('#textMailContrasena').val();
            if (emailRecPass != ''){
                $('#error_forget_pass').html('');
                $('#step_success span').html('');
                $('#step_success span').html(emailRecPass);
                showStepLogin('success');
                // $('#miForm2').submit();
            } else {
                $('#error_forget_pass').html('');
                $('#error_forget_pass').html('El E-mail no es valido.');
            }
            e.preventDefault();
        })


        $('.volver_forget').on('click',function(e){     
            showStepLogin('login');
            e.preventDefault();
        })

});

(function(d, $) {
    "use strict";

    var TrialForm = function() {
        var _process, _receiveResponse, _showError;
        _process = function(e) {
            var handler = new Handler();
            var data = handler.getData(e);
            data.email ? handler.send(data, "ajaxSendTrial", _receiveResponse) : _showError();
        },
        _receiveResponse = function(res) {
            if(res.success) {
                var messageSuccess = $('#message-form-trial');
                messageSuccess.show();
                setTimeout(function() {
                    messageSuccess.hide();
                }, 3000);
            } else {
                _showError();
            }
        },
        _showError = function() {
            var messageInvalidEmail = $('#message-invalid-email');
            messageInvalidEmail.show();
            setTimeout(function() {
                messageInvalidEmail.hide();
            }, 3000);
            $('#trial-form .specialInput').addClass('form-error');
            $('#trial-form .form-error').on('change', function(e) {
                $(e.currentTarget).removeClass('form-error');
            });
        }

        return {process: _process};
    }

    var ContactForm = function() {
        var _process, _receiveResponse;
        _process = function(e) {
            var handler = new Handler();
            handler.send(handler.getData(e), "ajaxSendContact", _receiveResponse);
        },
        _receiveResponse = function(res) {
            if(res.success) {
                var messageSuccess = $('#message-success');
                messageSuccess.show();
                setTimeout(function() {
                    messageSuccess.hide();
                }, 3000);
            } else {
                var len = res.fields.length;
                for(var i = len; i--;) {
                    var errorField = res.fields[i];
                    $(d.getElementsByName(errorField)).parent().addClass('form-error');
                }
                $(d.getElementsByClassName('form-error')).children().on('change', function(e) {
                    $(e.currentTarget).parent().removeClass('form-error');
                });
            }
        }

        return {process: _process};
    };

    var Handler = function() {
        var _initialize, _getFormData, _errorHandler, _sendForm;
        _initialize = function() {
            $('#contact-form').on('submit', function(e) {
                e.preventDefault();
                new ContactForm().process(e);
            });

            $('#trial-form').on('submit', function(e) {
                e.preventDefault();
                new TrialForm().process(e);
            });
        },
        _getFormData = function(e) {
            var values = {};
            var inputs = $('#' + e.currentTarget.id + ' .input-field');
            var len = inputs.length;
            for(var i = len; i--;) {
                values[inputs[i].name] = inputs[i].value;
            }
            values['g-recaptcha-response'] = $('#g-recaptcha-response').val() || null;
            return values;
        },
        _errorHandler = function(e) {
            console.log('error', e);
        },
        _sendForm = function(values, url, cb) {
            values.action = url;
            $.ajax({
                type: "POST",
                url: url,
                data: values,
                success: cb,
                error: _errorHandler,
                dataType: 'json'
            });
        }
        return {init: _initialize, send: _sendForm, getData: _getFormData, errorHandler: _errorHandler};
    }

    new Handler().init();
})(document, jQuery);
