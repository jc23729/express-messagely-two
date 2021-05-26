const Router = require("express").Router;
const router = new Router();

const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");
const ExpressError = require("../expressError");

/** get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

// You put the token in of the person that is the user
// {
//   "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5ueSIsImlhdCI6MTYyMTYzMDY2Mn0.505vknfXRFJEs29acObFNvKA28K_Sk4DSpzlylUX4ac"
// }

// So remember each route was connected to app in app.js. The url that shows in app.js for example --> in app.use("/messages", messageRoutes) is what you need


// So in this case  -------- localhost:3000/messages/1   ---------    is what you need. And then /id  or whatever id your looking for
//////////////////////////WIll return this
// //{
//   "message": {
//     "id": 1,
//     "from_user": {
//       "username": "Christina23",
//       "first_name": "Christina",
//       "last_name": "Serrano",
//       "phone": "914-609-2550"
//     },
//     "to_user": {
//       "username": "Johnny",
//       "first_name": "Juan",
//       "last_name": "Cruz",
//       "phone": "917-243-6675"
//     },
//     "body": "This message is from Christina to Johnny",
//     "sent_at": "2021-05-26T21:38:33.072Z",
//     "read_at": "2021-05-26T23:16:16.418Z"
//   }
// }

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.user.username;
    let msg = await Message.get(req.params.id);

    if (
      msg.to_user.username !== username &&
      msg.from_user.username !== username
    ) {
      throw new ExpressError("Cannot read this message", 401);
    }

    return res.json({ message: msg });
  } catch (err) {
    return next(err);
  }
});

/** post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


// So, it would be a POST request to this path:

// http://127.0.0.1:3000/messages

// And you would send JSON data with this structure, to correspond to the req.body.* data that the /messages POST route expects (and also to pass in the authentication _token):

// {
// "to_username": "Johnny",
// "body": "Message content.",
// "_token": "token-of-the-sender-user-goes-here"
// }

// Where Johnny would be the username of the user receiving the message - "to_username"
// And "body" would be the message content

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let msg = await Message.create({
      from_username: req.user.username,
      to_username: req.body.to_username,
      body: req.body.body,
    });

    return res.json({ message: msg });
  } catch (err) {
    return next(err);
  }
});

/** mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

//localhost:3000/messages/1/read 

http: router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.user.username;
    let msg = await Message.get(req.params.id);

    if (msg.to_user.username !== username) {
      throw new ExpressError("Cannot set this message to read", 401);
    }
    let message = await Message.markRead(req.params.id);

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
