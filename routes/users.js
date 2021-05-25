const Router = require("express").Router;
const User = require ("../models/user");
const { ensureLoggedIn } = require("../middleware/auth");

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
    }
    catch (err) {
        return next(err);
    }
});

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