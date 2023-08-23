const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

app = express();
app.use(express.urlencoded({ extended: true }));
dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(cookieparser());
app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const localUsers = [];

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB SUCCESS"))
  .catch((error) => console.error("DB ERROR:", error));

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please type name"],
  },
  email: {
    type: String,
    required: [true, "Please type E-Mail"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please type password"],
    minlength: 8,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  if (
    !user.userName ||
    !user.email ||
    !user.password ||
    user.password.length > 8 ||
    !/^(?=.*[A-Z])(?=.*\d)/.test(user.password) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
  ) {
    return true;
  }

  return true;
}

app.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;

  if (!validateUser(req.body)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser = { userName, email, password };
  registeredUsers.push(newUser);

  const userToDb = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
  });

  let id = userToDb._id;

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(201).json({
    message: "User signed up successfully",
    token: token,
    user: userToDb,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validateUser(req.body)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  const loggedUser = await User.findOne({ email });
  localUsers.push(loggedUser.toObject());

  if (!loggedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (loggedUser.password === password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  console.log(localUsers);
  return res
    .status(200)
    .json({ message: "User logged in successfully", user: loggedUser });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
