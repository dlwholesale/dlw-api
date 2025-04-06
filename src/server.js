require("dotenv").config();
const { AppDataSource } = require("./data-source");
const app = require("./app");

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });
