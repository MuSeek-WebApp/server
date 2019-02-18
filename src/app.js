import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import routes from "./app.route";
import serviceAccount from "../config/serviceAccountKey.json";

const app = express();
app.use(bodyParser.json());

// mount all routes on /api path
app.use("/api", routes);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://museek-ebe73.firebaseio.com"
});

module.exports = app;
