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

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token; //we take the req.body._token  and verify it 
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);//if token is verified this token will return the actual data in that token
    req.user = payload; // create a current user we add it to req.user, every single handler will have access to req.user
    console.log("YEYY YOU HAVE A VALID TOKEN!")
    return next();
  } catch (err) {//if it doesn't work it catches that error 
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
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
