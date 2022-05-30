const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    console.log(req)
    const cookie__ = req.headers.cookie
    if (!cookie__.includes('my-secret-key')) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }
    try {
        let {userIdx} = jwt.verify(cookie__.split('=')[1], "my-secret-key");
        User.findOne({userIdx}).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        console.log(err)
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 페이지입니다.",
        });
    }
};