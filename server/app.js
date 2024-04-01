// imports

const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");

const router = require("./router.js");

// done with imports

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/domoMaker'
mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
})


// setup handlebars and express
const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// use sessions to secure user logins
app.use(session({
    key: 'sessionid',
    secret: 'domo arigato',
    resave: false,
    saveUninitialized: false
}))

app.engine('handlebars', expressHandlebars.engine({defaultLayout: ''}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on port ${port}`);
});