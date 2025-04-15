const { AppDataSource } = require("../../../data-source");
const ErrorLog = require("../entities/error-log.entity");

class ErrorLogService {
    constructor() {
        this.errorLogRepository = AppDataSource.getRepository("ErrorLog");
    }

    /**
     * Logs an error to the database.
     */
    async logError(error, details = null) {
        // Create an error log record, stringify additional details if provided.
        const errorRecord = {
            message: JSON.stringify(error),
            stack: error.stack,
            details: details ? JSON.stringify(details) : null,
        };

        try {
            await this.errorLogRepository.save(errorRecord);
            console.log("Error logged to database.");
        } catch (err) {
            console.error("Failed to log error to the database:", err);
        }
    }
}

module.exports = new ErrorLogService();
