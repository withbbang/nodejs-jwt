const User = require("../../../models/user.js");
const jwt = require("jsonwebtoken");

/*
    POST /api/auth
    {
        username,
        password
    }
*/

exports.getRes = (req, res) => {
    res.send("this router is working well");
};

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const secret = req.app.get("jwt-secret");

    const check = user => {
        if (!user) {
            throw new Error("login failed");
        } else {
            if (user.verify(password)) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        },
                        secret,
                        {
                            expiresIn: "7d",
                            issuer: "google.com",
                            subject: "userInfo"
                        },
                        (err, token) => {
                            if (err) reject(err);
                            resolve(token);
                        }
                    );
                });
                return p;
            } else {
                throw new Error("login failed");
            }
        }
    };

    const respond = token => {
        res.json({
            message: "logged in successfully",
            token
        });
    };

    const onError = error => {
        res.status(403).json({
            message: error.message
        });
    };

    User.findOneByUsername(username)
        .then(check)
        .then(respond)
        .catch(onError);
};

exports.register = (req, res) => {
    const { username, password } = req.body;
    let newUser = null;

    // create a new user if does not exist
    const create = user => {
        if (user) {
            throw new Error("username exists");
        } else {
            return User.create(username, password);
        }
    };

    // count the number of the user
    const count = user => {
        newUser = user;
        return User.count({}).exec();
    };

    // assign admin if count is 1
    const assign = count => {
        if (count === 1) {
            return newUser.assignAdmin();
        } else {
            // if not, return a promise that returns false
            return Promise.resolve(false);
        }
    };

    // respond to the client
    const respond = isAdmin => {
        res.json({
            message: "registered successfully",
            admin: isAdmin ? true : false
        });
    };

    // run when there is an error (username exists)
    const onError = error => {
        res.status(409).json({
            message: error.message
        });
    };

    // check username duplication
    User.findOneByUsername(username)
        .then(res_1 => create(res_1))
        .then(res_2 => count(res_2))
        .then(res_3 => assign(res_3))
        .then(res_4 => respond(res_4))
        .catch(onError);
};
