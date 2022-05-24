const express = require('express');
const app = express();
const port = 3000;

const articlesRouter = require("./routes/articles");
const connect = require("./schemas")
connect();
app.listen(port, () => {
    console.log(port, 'port: server run');
});


app.use(express.json());
app.use("/api", [articlesRouter]);
// request log - middleware
//middleware? 모든 요청에 대해 공통적인 처리 ex Apache, Nginx
// req 요청, res 응답, next 다음 스택 호출
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

