// Helper classes
const ServerLogger = require('./ServerLogger.js');
const Charset = require('./Charset.js');

class NoteHandler {
    // Length is arbitrary at the moment
    static keyLength = 50;
    static CHARSET_VALUES = {
        NUMBERS: 1,
        SYMBOLS: 2,
        LOWERCASE_LETTERS: 3,
        UPPERCASE_LETTERS: 4,
    };

    static generateKey() {
        ServerLogger.log("Request to generate key received");
        ServerLogger.processing("Generating key...");
    
        let key = "";
    
        for (let i = 0; i < this.keyLength; i++) {
            const charType = Math.floor(Math.random() * 4);
    
            switch (charType) {
                case this.CHARSET_VALUES.NUMBERS:
                    key += Charset.numbers[Math.floor(Math.random() * Charset.numbers.length)];
                    break;
    
                case this.CHARSET_VALUES.SYMBOLS:
                    key += Charset.symbols[Math.floor(Math.random() * Charset.symbols.length)];
                    break;
    
                case this.CHARSET_VALUES.LOWERCASE_LETTERS:
                    key += Charset.lowercaseLetters[Math.floor(Math.random() * Charset.lowercaseLetters.length)];
                    break;
    
                case this.CHARSET_VALUES.UPPERCASE_LETTERS:
                    key += Charset.uppercaseLetters[Math.floor(Math.random() * Charset.uppercaseLetters.length)];
                    break;
            }
        }
    
        ServerLogger.success('Generated key: "' + key + '"!');
        return key;
    }
    

    static updateTimeArray(prevTimes) {
        ServerLogger.processing("Updating time object last updated...");
        var newTimes = prevTimes;
        newTimes.push(new Date().toISOString());
        return newTimes;
    };

}

module.exports = NoteHandler;