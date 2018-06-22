class ChangeLogsError extends Error {
    constructor(message) {
        super(message);
        this.name = `WarpWorks.${this.constructor.name}`;
    }
}

module.exports = ChangeLogsError;
