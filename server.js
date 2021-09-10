require("dotenv").config();

const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const Emitter = require("events");

/* ---------------------------------------- 
  Database connection 
---------------------------------------- */
const url = "mongodb://localhost/fresh_juice";

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed...");
  });

/* ---------------------------------------- 
  Session config
---------------------------------------- */
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: url,
      collectionName: "sessions",
    }),
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 24 * 24 }, // 24 hours
  })
);
app.use(flash());

/* ---------------------------------------- 
  Passport config
---------------------------------------- */
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------------------- 
  Assets
---------------------------------------- */
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------------------------------------- 
  Global middleware
---------------------------------------- */
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

/* ---------------------------------------- 
  Set template engine
---------------------------------------- */
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

/* ---------------------------------------- 
  App Config
---------------------------------------- */
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------------------------------------- 
  Routes
---------------------------------------- */
require("./routes/web")(app);
app.use((req, res) => {
  res.status(404).render("404.ejs");
});

/* ---------------------------------------- 
  Start server
---------------------------------------- */
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

/* ----------------------------------------
  Event Emitter
---------------------------------------- */
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

/* ----------------------------------------
  Socket Connection
---------------------------------------- */
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // Join
  socket.on("join", (roomName) => {
    socket.join(roomName);
  });
});

// update order status in real time
eventEmitter.on("orderStatusUpdated", (data) => {
  io.to(`order_${data.id}`).emit("statusUpdated", data);
});

// update order list in real time in admin panel
eventEmitter.on("orderPalced", (data) => {
  io.to("adminRoom").emit("orderListUpdated", data);
});
