const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Op } = require("sequelize");
const { User } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

// 닉네임이 같은 값이면 안되게. (값을 포함하는 경우는 ㄱㅊ)
const postUsersSchema = Joi.object({
    nickname: Joi.string().min(3).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().disallow(Joi.ref('nickname')).required(),
    repeat_password: Joi.equal(Joi.ref('password'))
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
        if (req.headers.cookie){
            res.status(400).send(
                {errorMessage: '이미 로그인 되어 있습니다'}
            )
            return;
        }
        const { email, password } = await postAuthSchema.validateAsync(req.body);
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(400).send({
                errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
            });
            return;
        }
        const token = jwt.sign({userId: user.userId}, "my-secret-key");
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
            password,
            repeat_password
        } = await postUsersSchema.validateAsync(req.body);

        const existUsers = await User.findAll({
            where: {
                [Op.or]: [{ email }, { nickname }],
            },
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