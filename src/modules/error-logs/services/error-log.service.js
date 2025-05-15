const { AppDataSource } = require("../../../data-source");
const ErrorLog = require("../entities/error-log.entity");

class ErrorLogService {
    constructor() {
        this.errorLogRepository = AppDataSource.getRepository("ErrorLog");
    }

    async logError(error, details = null) {
        const errorRecord = {
            message: JSON.stringify(error),
            details: details ? JSON.stringify(details) : null,
        };

        try {
            await this.errorLogRepository.save(errorRecord);
        } catch (err) {
            // Do nothing.
        }
    }
}

module.exports = new ErrorLogService();
