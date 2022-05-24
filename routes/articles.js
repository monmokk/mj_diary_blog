const express = require("express");
const router = express.Router();
const Articles = require("../schemas/articles");

// routes/articles.js
router.get('/', (req, res) => {
    res.send('this is home page');
});

router.get('/about', (req, res) => {
    res.send('this is about page');
});
//목록
router.get("/articles", async (req, res, next) => {
    const articles = await Articles.find({}, { articleId:1, title: 1, writer: 1, createDate:1 }).sort({createDate:-1});
    res.json({ articles });
});
//상품 상세 조회 API
router.get("/articles/:articleId", async (req, res) => {
    const { articleId } = req.params;
    const articles = await Articles.findOne({ articleId }, {articleId:1, title: 1, writer: 1, createDate:1, content:1});

    res.json({ articles });
});
router.delete("/articles/:articleId/:pwd", async (req, res) => {
    const { articleId } = req.params;
    const { pwd } = req.params;

    const existsArticles = await Articles.find({ articleId, pwd });
    if (existsArticles.length > 0) {
        await Articles.deleteOne({ articleId, pwd });
    }

    res.json({ result: "success" });
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

router.patch("/articles/:articleId/:pwd", async (req, res) => {
    const { articleId } = req.params;
    const { pwd } = req.params;
    const { title, content } = req.body;

    await Articles.updateOne({ articleId, pwd }, { $set: { title, content } });

    res.json({ success: true });
})

router.post("/articles", async (req, res) => {
    const { title , content, writer, pwd } = req.body;

    const createdArticles = await Articles.create({ title , content, createDate: new Date(), writer, pwd });

    res.json({ articles: createdArticles });
});

module.exports = router