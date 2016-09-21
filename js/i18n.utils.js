/** 
 *
 */
InternacionalizationHelper = function() {
    this.langDictionary = null;
    this.pendingSave = 0;

    // -------------------------------------------------------------------------
    this.init = function() {
        var self = this;
        
        $.ajaxSetup({async: false});
        $.get('/home/ajaxGetTexts', {}, function(data) {
            if (data.success) {
                self.langDictionary = data.data;
            }
        }, 'json');
        $.ajaxSetup({async: true});
    }

    // -------------------------------------------------------------------------
    this.getText = function(baseText, parameters) {
        var translatedText = baseText;
        var found = false;
        if (this.langDictionary != null && typeof this.langDictionary[baseText] != 'undefined' && this.langDictionary[baseText]) {
            translatedText = this.langDictionary[baseText];
            found = true;
        }

        if (typeof parameters == 'object') {
            for (var key in parameters) {
                translatedText = translatedText.replace(new RegExp(':' + key, 'g'), parameters[key]);
            }
        }
        
        /* Agrego el texto en el sistema de traducciones */
        if (!found && typeof Data != 'undefined' && Data.System.Environment == 'dev' && this.pendingSave < 15) {
            var self = this;
            self.pendingSave++;
            $.post('/home/ajaxText', { text : baseText }, function() {
                self.pendingSave--;
            });
        }

        return translatedText;
    }

    // -------------------------------------------------------------------------
    this.getTranslatedArray = function(arrayWithBaseTexts) {
        var translatedArray = [];

        var self = this;
        $(arrayWithBaseTexts).each(function(idx, baseText) {
            translatedArray.push(self.getText(baseText));
        })

        return translatedArray;
    }

    this.init();
}

var i18nHelper = new InternacionalizationHelper();