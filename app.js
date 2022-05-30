const express = require('express');
const app = express();
const port = 3000;
const articlesRouter = require("./routes/articles");
const userRouter = require("./routes/user");

app.listen(port, () => {
    console.log(`
    ##############################
            ${port} port
           server running
    ##############################`);
});

app.use(express.json());
app.use("/api", [articlesRouter, userRouter]);
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
});

