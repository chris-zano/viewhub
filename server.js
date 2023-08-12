const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");


const adminRoutes = require('./routes/adminRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.urlencoded({extended: true}));
app.use("public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(adminRoutes);
app.use(fileRoutes);
app.use(userRoutes);

const port = process.env.port || 5500
app.listen(5500, ()=> {
    console.log(`listening on port ${port}`);
})