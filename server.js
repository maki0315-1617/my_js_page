const http = require('http');
const fs = require('fs'); // ファイルを読み込むためのモジュール
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // index.html ファイルのパスを指定
  const filePath = path.join(__dirname, 'index.html');

  // ファイルを読み込む
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // ファイル読み込みに失敗した場合のエラーハンドリング
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('サーバー内部でエラーが発生しました。');
      return;
    }

    // 成功したらHTMLとしてブラウザに返す
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); // ここを text/html にするのがポイント！
    res.end(data);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});