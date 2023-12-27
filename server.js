const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // Add this line

// Load environment variables from .env file
dotenv.config();


const adminRoutes = require('./routes/adminRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use("public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(adminRoutes);
app.use(fileRoutes);
app.use(userRoutes);
app.use(videoRoutes);

const port = process.env.PORT || 5500
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})