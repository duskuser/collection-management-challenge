// Functions for ensuring date / time stamps are added to logWithTimestamp statements
// Use in place of console.log() where possible

class ServerLogger {
    static log(...args) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}]`, ...args);
    }

    // Wrappers with corresponding emojis for clarity
    static success(...args) {
        this.log('✅', ...args);
    }

    static processing(...args) {
        this.log('🔄', ...args);
    }

    static failed(...args) {
        this.log('❌', ...args);
    }
}

module.exports = ServerLogger;