const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
        user
    });
});

router.post("/auth", async (req, res) => {
    try{
        const { email, password } = await postAuthSchema.validateAsync(req.body);
        const user = await User.findOne({ email, password }).exec();
        if (!user) {
            res.status(400).send({
                errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
            });
            return;
        }
        const token = jwt.sign({userIdx: user.userIdx}, "my-secret-key");
        res.cookie('my-secret-key', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        res.send({
            user
        });
    }catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "데이터 형식이 올바르지 않습니다.",
        });
    }
});

router.post("/users", async (req, res) => {
    try {
        const {
            nickname,
            email,
            password
        } = await postUsersSchema.validateAsync(req.body);

        const existUsers = await User.find({
            $or: [{ email }, { nickname }],
        });

        if (existUsers.length) {
            res.status(400).send({
                errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
            });
            return;
        }

        const user = new User({ email, nickname, password });
        await user.save();
        res.status(201).send({});
        const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
    }
});

module.exports = router