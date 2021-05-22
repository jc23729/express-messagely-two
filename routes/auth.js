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
      //{ username } is dynamic    "username" : "Johnny",
      let { username } = await User.register(req.body);
      let token = jwt.sign({ username }, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({ token });
    } catch (err) {
    return next(err);
  }
});



module.exports = router;
