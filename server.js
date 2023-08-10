//This line should initialise the server

const express = require('express');
const app = express();
const path = require('path')

app.use(express.urlencoded({extended : true}));
app.use('public',express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const fileRoutes = require('./routes/fileRoutes');
const adminRoutes = require('./routes/adminRoutes')


const port = process.env.PORT || 5500
app.listen(port, ()=>console.log(`Listening on port ${port}`));
