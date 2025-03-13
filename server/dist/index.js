"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const database_1 = require("./database");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../build/index.html'));
});
app.use('/api', routes_1.router);
const port = process.env.PORT || 5000;
async function startServer() {
    await (0, database_1.connectToMongoDB)();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
;
startServer();
