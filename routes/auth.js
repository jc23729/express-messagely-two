const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

//////////////////////////LOGIN ROUTE////////////////////////////////////////////////////////////////
//Using JWT in Express

// login: { username, password } => { token }

//  http://localhost:3000/auth/login
// This format in insomnia will give us a token then log us in {username, password} => {token}
//Your credentials
// {
//    "username" : "Johnny",
//    "password": "password",
//    "first_name": "Juan",
//    "last_name": "Cruz",
//    "phone": "917-243-6675"
// }

///////////////////JWT Commands////////////////////////////////
// Decoding / Verifying Tokens
// jwt.decode(token)
// Return the payload from the token (works without secret key. Remember, the tokens are signed, not enciphered!)
// jwt.verify(token, secret-key)
// Verify token signature and return payload is valid. If not, raise error.
// jwt.decode(token);               // {username: "jane"}

// jwt.verify(token, SECRET_KEY);   // {username: "jane"}

// jwt.verify(token, "WRONG");      // error!
////////////////////////////////////////////////////////////////

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      //we pass in some payload and use a secret key which is in our config.js file const SECRET_KEY = process.env.SECRET_KEY || "secret";
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

//token to be used in insomnia
// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5ueSIsImlhdCI6MTYyMTcwNzYwM30.HfnE_D-U9Gy8SwDwDuI91hZOcskwCii1im00515htvc"
// }

//route taking from VideoCode and notes

/** Secret-1 route than only users can access */

router.get("/secret-1", async function (req, res, next) {
  try {
    // try to get the token out of the body W
    const tokenFromBody = req.body._token;

    // verify this was a token signed with OUR secret key, if we find it
    // (jwt.verify raises error if not) we pass in the token and the SECRET_KEY we used
    //if we need access to that data(const data= ), this would be the actual payload/jwt.verify is part of json webtokens
    const data = jwt.verify(tokenFromBody, SECRET_KEY);

    return res.json({
      message: "I mangaged to sing in this is Top Secret, I LIKE RED!",
    });
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
});

//////////////////////////////////////Route Showing middleware function ensureLoggedIn in middleware/auth.js/////////////////////////////////
//So basically your doing the same thing you did in router.get("/secret-1") but using middleware from
// function authenticateJWT(req, res, next)
// function ensureLoggedIn(req, res, next)

router.get("/topsecret", ensureLoggedIn, async function (req, res, next) {
  try {
    return res.json({
      msg: "SIGNED IN! THIS IS TOP SECRET, BUT REALLY NOT REALLY",
    });
  } catch (e) {
    return next(new ExpressError("Please login first fool!", 401));
  }
});

/////////////////////////////////////// Using JWTs in Express////////////////////////
// Login Route from VideoCode and also notes
// demo / auth - api / routes / auth.js

/** (Fixed) Login: returns JWT on success. */

// router.post("/login", async function (req, res, next) {
//   try {
//     const { username, password } = req.body;
//     const result = await db.query(
//       "SELECT password FROM users WHERE username = $1",
//       [username]);
//     let user = result.rows[0];

//     if (user) {
//       if (await bcrypt.compare(password, user.password) === true) {
//         let token = jwt.sign({ username }, SECRET_KEY);
//         return res.json({ token });
//       }
//     }
//     throw new ExpressError("Invalid user/password", 400);
//   } catch (err) {
//     return next(err);
//   }
// });

///EXAMPLE CODE//

// router.post("/login-1", async function (req, res, next) {
//   try {
//     //Try to find user first in that database
//     const { username, password } = req.body;
//     const result = await db.query(
//       `SELECT password FROM users WHERE username = $1`,
//       [username]
//     );
//     const user = result.rows[0];
//     //if (user)exists, compare hashed password to hash of login password
//     if (user) {
//       //bcrypt.compare() resolves to boolean—if true, Did we correctly authenticate them?
//       if ((await bcrypt.compare(password, user.password)) === true) {
//         //passwords match!
//this is just returning saying that we logged in and creating that token
//         return res.json({ message: "Logged in!" });
//       }
//     }
//     throw new ExpressError("Invalid user/password", 400);
//   } catch (err) {
//     return next(err);
//   }
// });

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
// JWTs can store any arbitrary “payload” of info, which are “signed” using a secret key, so they can be validated later (similar to Flask’s session).
// The JWT token itself is a string comprising three parts:
// •	Header: metadata about token (signing algorithm used & type of token)
// •	Payload: data to be stored in token (typically an object)
// •	Often, this will store things like the user ID
// •	This is encoded, not encrypted — don’t put secret info here!
// •	Signature: version of header & payload, signed with secret key
// •	Uses algorithm specified in header (we’ll use default, “HMAC-SHA256”)

router.post("/register", async function (req, res, next) {
  try {
    //{ username } is dynamic    "username" : "Johnny", await User is class in users.js in models/users.js
    // its pulling this information {username, password, first_name, last_name, phone;} and waiting to make sure that the user is registered
    //if not then it catches that error and moves on
    let { username } = await User.register(req.body);
    //Signature: version of header & payload, signed with secret key
    let token = jwt.sign({ username }, SECRET_KEY);
    //models/users.js/updateLoginTimeStamp is a function in users.js
    User.updateLoginTimestamp(username);
    //   this returns our token =  let = token = jwt.sign({ username }, SECRET_KEY);
    // The return is used to stop execution. It is often used to do some form of early return based on a condition.
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

////////////////////MODELS///////////////////////////////////
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

//Class      models/users.js/updateLoginTimestamp
/** Update last_login_at for user */

//   static async updateLoginTimestamp(username) {
//     const result = await db.query(
//       `UPDATE users
//            SET last_login_at = current_timestamp
//            WHERE username = $1
//            RETURNING username`,
//       [username]
//     );

//     if (!result.rows[0]) {
//       throw new ExpressError(`No such user: ${username}`, 404);
//     }
//   }

module.exports = router;
