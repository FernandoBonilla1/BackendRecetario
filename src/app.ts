import express from 'express';
import path from 'path';
import bodyParser from "body-parser"
import { upload } from "./multer";

import routes from "./Routes/routes";
import authRouter from "./Routes/authRoutes";

const app = express();
const port = 3000;



// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/auth", authRouter);
app.use("/api", routes);


// Start server
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});