// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment")
const morgan = require("morgan")


// internal imports
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

// internal imports
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/common/errorHandler");

const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = require("socket.io")(server);
global.io = io;

// set comment as app locals
app.locals.moment = moment;

// database connection


// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))


// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

const url = `mongodb+srv://${dbUser}:${dbPass}@cluster0.ltldm.mongodb.net/chatApp?retryWrites=true&w=majority`
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`app listening to port ${process.env.PORT}`);
            console.log("database connection successful!")
        });
    })
    .catch((err) => console.log(err));