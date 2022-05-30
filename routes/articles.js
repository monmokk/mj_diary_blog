const express = require("express");
const router = express.Router();
const {Articles} = require("../models");
const {Reply} = require("../models");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {ValidationError} = require("joi");
const replySchema = Joi.object({
    content: Joi.string().required()
})


router.get("/articles", async (req, res, next) => {
    const articles = (await Articles.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    }));

    res.json({articles});
});

router.get("/articles/:articleId", async (req, res) => {
    const {articleId} = req.params;

    const article = await Articles.findByPk(articleId, {
        include: {
            model: Reply,
            separate: true,
            order: [
                ['replyId', 'DESC']
            ]
        }
    })


    res.json({article});
});

router.delete("/articles/:articleId", async (req, res) => {
    const {articleId} = req.params;
    const cookie__ = req.headers.cookie
    let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");

    const existsArticles = await Articles.findAll({
        where: {
            articleId, userId
        }
    });
    if (existsArticles.length > 0) {
        await Articles.destroy({
            where: {
                articleId
            }
        });
    } else {
        res.json({errorMessage: '자신이 작성한 글만 삭제할 수 있습니다.'})
        return
    }

    res.json({success: true});
});

// router.put("/articles/:articleId/:pwd", async (req, res) => {
//     const { articleId } = req.params;
//     const { pwd } = req.params;
//     const { title, content, createDate, writer } = req.body;
//
//     await Articles.updateOne({ articleId }, { $set: { articleId, title, content, createDate, writer, pwd } }, {upsert: true});
//
//     res.json({ success: true });
// })

router.patch("/articles/:articleId", async (req, res) => {
    const {articleId} = req.params;
    const {title, content} = req.body;
    const cookie__ = req.headers.cookie
    let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");

    const existsArticles = await Articles.findAll({
        where: {
            articleId, userId
        }
    });
    if (existsArticles.length > 0) {
        await Articles.update({title, content}, {where: {articleId, userId}});
    } else {
        res.json({errorMessage: '자신이 작성한 글만 수정할 수 있습니다.'})
        return;
    }

    res.json({success: true});
})

router.post("/articles", async (req, res) => {
    const {title, content} = req.body;
    const cookie__ = req.headers.cookie
    let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");
    const article = new Articles({title, content, userId});
    await article.save();

    res.json({articles: article});
});

router.post("/replies/:articleId", async (req, res) => {

    const {articleId} = req.params;
    try {
        const {content} = await replySchema.validateAsync(req.body)
        const cookie__ = req.headers.cookie;
        if (!cookie__.includes('my-secret-key')) {
            res.status(401).send({
                errorMessage: "로그인 후 이용 가능한 기능입니다.",
            });
            return;
        }
        let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");
        const replies = new Reply({content, articleId, userId});
        await replies.save();
        res.json({replies: replies});
    } catch (err) {
        if(err instanceof ValidationError){
            res.status(401).send({
                errorMessage: "댓글을 입력해주세요",
            });
            return;
        }else{
            res.status(401).send({
                errorMessage: "로그인 후 이용 가능한 페이지입니다.",
            });
            return;
        }


    }

});
router.delete("/replies/:articleId/:replyId", async (req, res) => {
    const { articleId, replyId } = req.params;
    const cookie__ = req.headers.cookie
    let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");

    const existsReply = await Reply.findAll({
        where: {
            articleId, userId, replyId
        }
    });
    if (existsReply.length > 0) {
        await Reply.destroy({
            where: {
                articleId, replyId
            }
        });
    } else {
        res.json({errorMessage: '자신이 작성한 댓글만 삭제할 수 있습니다.'})
        return
    }

    res.json({success: true});
});
router.patch("/replies/:articleId/:replyId", async (req, res) => {
    const { articleId, replyId } = req.params;
    const { content } = req.body;
    const cookie__ = req.headers.cookie
    let {userId} = jwt.verify(cookie__.split('=')[1], "my-secret-key");

    const existsReply = await Reply.findAll({
        where: {
            articleId, userId, replyId
        }
    });
    if (existsReply.length > 0) {
        await Reply.update({ content }, {where: {articleId, userId, replyId}});
    } else {
        res.json({errorMessage: '자신이 작성한 댓글만 수정할 수 있습니다.'})
        return;
    }

    res.json({success: true});
})


module.exports = router