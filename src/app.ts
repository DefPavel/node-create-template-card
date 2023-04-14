import "reflect-metadata";
import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";
import config from "./config";

const app = express();
// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);


app.listen(config.PORT, () => {  
    console.log(`Server started on port ${config.PORT}!`);
});