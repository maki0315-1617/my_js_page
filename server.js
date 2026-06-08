const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/api/fortune') {
        const fortunes = [
            '✨ 大吉：最高の１日になります！ラッキーカラーは青。',
            '🌟 中吉：美味しいものを食べると運気アップ！',
            '🎵 吉：新しい音楽を聴くと良い発見があるかも。',
            '💤 小吉：今日は無理せず早めに寝ましょう。'
        ];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(randomFortune);
        return;
    }

    const filePath = path.join(__dirname, 'index.html');
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

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
