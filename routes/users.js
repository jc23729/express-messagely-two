const Router = require("express").Router;
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = new Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
//ensureLoggedIn is checking to make sure that person is logged in
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    //User.all is pulling form models/users.js/class User/ static async all
    let users = await User.all();
    //and this returns that query in json format
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});
//User.all is pulling form models/users.js/class User/ static async all
/** All: basic info on all users:
 * [{username, first_name, last_name}, ...] */

//   static async all() {
//     const result = await db.query(
//       `SELECT username,
//                 first_name,
//                 last_name,
//                 phone
//             FROM users
//             ORDER BY username`
//     );

//     return result.rows;
//   }



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
  try {
    //User.all is pulling form models/users.js/class User/ static async all
      let user= await User.get(req.params.username);
    //and this returns that query in json format
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


//We're pulling from models/user/static async get(username)
//  /** Get: get user by username
//    *
//    * returns {username,
//    *          first_name,
//    *          last_name,
//    *          phone,
//    *          join_at,
//    *          last_login_at } */

//   static async get(username) {
//     const result = await db.query(
//       `SELECT username,
//                 first_name,
//                 last_name,
//                 phone,
//                 join_at,
//                 last_login_at
//             FROM users
//             WHERE username = $1`,
//       [username]
//     );

//     if (!result.rows[0]) {
//       throw new ExpressError(`No such user: ${username}`, 404);
//     }

//     return result.rows[0];
//   }




/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

module.exports = router;
