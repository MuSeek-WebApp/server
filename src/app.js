import express from "express";
import usersRouter from "./user/user";
import admin from "firebase-admin";
import serviceAccount from "./config/serviceAccountKey.json";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://museek-ebe73.firebaseio.com"
});

module.exports = app;
