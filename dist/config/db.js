"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const credentialsdb_json_1 = __importDefault(require("./credentialsdb.json"));
const connection = mysql_1.default.createConnection({
    host: credentialsdb_json_1.default.host,
    user: credentialsdb_json_1.default.user,
    password: credentialsdb_json_1.default.password,
    database: credentialsdb_json_1.default.database,
    port: credentialsdb_json_1.default.port
});
connection.connect((error) => {
    if (error) {
        console.log('El error de conexion es: ' + error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});
exports.default = connection;
