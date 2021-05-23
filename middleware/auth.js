/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


// We setup a token and sign it, with a username and secret key
// > const myToken = jwt.sign({username: "Toddd"}, 'adsfdfewfsdfds')
// Undefined

// We bring that token over to the website and it gives us a token
// > myToken
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvZGRkIiwiaWF0IjoxNjIxNjE3OTIxfQ.jqxSn4Du0GoQewHosESF06cgBEiej4EnFDk4m7tSSzM'

// We setup a variable by the name of reqToken or whatever we want to call it. 
// > const reqToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvZGRkIiwiaWF0IjoxNjIxNjE3OTIxfQ.jqxSn4Du0GoQewHosESF06cgBEiej4EnFDk4m7tSSzM'

// We can now verify that token any time someone logs in wit the correct username, and whatever secret key they used previously
// > jwt.verify(reqToken, 'adsfdfewfsdfds')
// { username: 'Toddd', iat: 1621617921 }



/** Middleware: Authenticate user. */


// its going to look for a token, verify it, 
// add the payload into the request itself on req.user.On every single route will have access to req.user.
// If theres nothing in req.user then that means it wasn’t verifed


function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token; //we look for the req.body._token set it to variable to use later
    const payload = jwt.verify(tokenFromBody, SECRET_KEY); //its going to verfiy the token, add it to the payload
    req.user = payload; //We set the payload equal to req.user. Now On every single route will have access to req.user.
    console.log("YEYY YOU HAVE A VALID TOKEN!");
    return next();
  } catch (err) {//If theres nothing in req.user then that means it wasn’t verifed then moves on
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  //check if there is no user, then throw error with message "You are not authorized"
  if (!req.user) {
    return next({ status: 401, message: "Your are not Unauthorized ensuredLoggedIn middleware" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}
// end

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
};
