"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./Routes/routes"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use("/auth", authRoutes_1.default);
app.use("/api", routes_1.default);
// Start server
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
