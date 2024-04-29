const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");

const usedEmails = [
  "halit@re-coded.com",
  "shrreya@re-coded.com",
  "ammar@re-coded.com",
  "osama@re-coded.com",
  "muhanned@re-coded.com",
];

// GET request for rendering the registration form
app.get("/", (req, res) => {
  res.render("index");
});

// Validation chain for username
const usernameValidation = [
  check("username")
    .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long')
    .not().isEmpty().withMessage('Username should not be empty')
    .not().matches(/\s/).withMessage('Username should not include spaces')
];

// Validation chain for email
const emailValidation = [
  check("email")
    .isEmail().withMessage('Invalid email')
    .not().isEmpty().withMessage('Email should not be empty')
    .custom((value) => {
      if (usedEmails.includes(value)) {
        throw new Error('Email already exists');
      }
      return true;
    })
];

// Validation chain for password
const passwordValidation = [
  check("password")
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).withMessage('Password must contain a number, uppercase and lowercase')
    .not().isEmpty().withMessage('Password should not be empty'),
  check("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords are not matching');
      }
      return true;
    })
];

// POST request handler for user registration
app.post("/users", [...usernameValidation, ...emailValidation, ...passwordValidation], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("index", { alerts: errors.array() });
  }

  // Save email to usedEmails array
  usedEmails.push(req.body.email);

  // Render success message
  res.render("index", { success: "Congratulations, your account has been successfully created!" });
});

app.listen(port, () => console.log(`Application running on port ${port}`));

module.exports = app;
