const http = require('http');
const fs = require('fs'); // ファイルを読み込むためのモジュール
const path = require('path');

const hostname = '0.0.0.0'; // どこからでもアクセスOKにする設定
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // index.htmlのパスを指定
    const filePath = path.join(__dirname, 'index.html');

    // ファイルを読み込んでブラウザに返す
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
});

// サーバーを起動
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});