const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** login: {username, password} => {token} */

//  http://localhost:3000/auth/login
// This format in insomnia will give us a token then log us in {username, password} => {token}

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      let token = jwt.sign({ username }, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});

////////////////////////REGISTER ROUTE///////////////////////////////////////////

// So usually the first route should be a register route, so you can regester a user, then they can log back in the future.

// The route would be the actual folder file so auth.js would be auth/ and then the actual route register

// Actual route you would be put in insomnia would be http://localhost:3000/auth/register

/** register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

//Put these credentials in your register route in postman same as above, so basically you create user then it gives you a token
// {
//    "username" : "Johnny",
//    "password": "password",
//    "first_name": "Juan",
//    "last_name": "Cruz",
//    "phone": "917-243-6675"
// }

// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5ueSIsImlhdCI6MTYyMTYzMDY2Mn0.505vknfXRFJEs29acObFNvKA28K_Sk4DSpzlylUX4ac"
// }

router.post("/register", async function (req, res, next) {
  try {
    //{ username } is dynamic    "username" : "Johnny", await User is class in users.js in models/users.js
    // its pulling this information {username, password, first_name, last_name, phone;} and waiting to make sure that the user is registered
    //if not then it catches that error and moves on
    let { username } = await User.register(req.body);
    let token = jwt.sign({ username }, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


//MODELS/users.js
// class User {
//   /** register new user -- returns
//    *    {username, password, first_name, last_name, phone}
//    */

//   static async register({ username, password, first_name, last_name, phone }) {
//     let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
//     const result = await db.query(
//       `INSERT INTO users (
//               username,
//               password,
//               first_name,
//               last_name,
//               phone,
//               join_at,
//               last_login_at)
//             VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
//             RETURNING username, password, first_name, last_name, phone`,
//       [username, hashedPassword, first_name, last_name, phone]
//     );
//     return result.rows[0];

module.exports = router;
