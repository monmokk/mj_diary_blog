const express = require('express');
const app = express();
const port = 3000;

const articlesRouter = require("./routes/articles");
const userRouter = require("./routes/user");
const connect = require("./schemas")
connect();
app.listen(port, () => {
    console.log(port, 'port: server run');
});


app.use(express.json());
app.use("/api", [articlesRouter, userRouter]);
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

