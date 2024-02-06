import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Router from "./routes/routes.js"
import Connection from "./Connection/db.js"

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/",Router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

Connection(process.env.DB_USERNAME,process.env.DB_PASSWORD);