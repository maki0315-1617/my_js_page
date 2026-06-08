const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// アクセスされたときに「おしゃれな画面」と「おみくじの仕組み」を一緒に返す
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>モダンおみくじ</title>
    <style>
        /* 全体のデザイン設定 */
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            color: #333;
        }

        /* メインのカード */
        .omikuji-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        h1 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }

        p.description {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 30px;
        }

        /* おしゃれなグラデーションボタン */
        .btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
            transition: all 0.3s ease;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
        }

        /* 結果表示エリア（ふわっと出るアニメーション付き） */
        .result-container {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #ddd;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s ease;
            display: none;
        }

        .result-container.show {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        .fortune {
            font-size: 2.5rem;
            font-weight: 900;
            color: #e74c3c;
            margin: 15px 0;
        }

        .details {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #34495e;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
            text-align: left;
        }

        .extra-info {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 0.85rem;
            color: #7f8c8d;
        }
    </style>
</head>
<body>

    <div class="omikuji-card">
        <h1>Fortunes</h1>
        <p class="description">今日のあなたの運勢を占います</p>
        
        <button class="btn" onclick="drawOmikuji()">おみくじを引く</button>

        <div class="result-container" id="resultContainer">
            <div class="fortune" id="fortuneText">-</div>
            <div class="details">
                <div id="adviceText">-</div>
                <div class="extra-info">
                    <span>ラッキーカラー: <strong id="colorText">-</strong></span>
                    <span>ラッキーアイテム: <strong id="itemText">-</strong></span>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 【JS修正分】バリエーション豊かなおみくじデータ
        const omikujiData = [
            { fortune: "超大吉", advice: "最高の運気です！願ったことがすべて叶うレベルの1日。何か新しいことを始めるなら今日！", color: "ゴールド", item: "新しい靴" },
            { fortune: "大吉", advice: "素晴らしい一日になるでしょう！周囲への感謝を忘れずに過ごすとさらに吉。", color: "レッド", item: "お気に入りのカフェのコーヒー" },
            { fortune: "向大吉", advice: "これからどんどん運気が上がっていきます。少し高めの目標に挑戦してみて！", color: "スカイブルー", item: "ノートとペン" },
            { fortune: "吉", advice: "堅実に行動すると成果が出る日。焦らず一歩ずつ進むのがスマートです。", color: "グリーン", item: "観葉植物" },
            { fortune: "中吉", advice: "バランスの良い安定した運勢。身近な友人に連絡を取ると良い刺激をもらえそう。", color: "オレンジ", item: "スマホケース" },
            { fortune: "小吉", advice: "小さな幸せが見つかる日。落とし物や忘れ物には少しだけ気をつけて。", color: "イエロー", item: "ハンカチ" },
            { fortune: "吉凶未分", advice: "あなたの行動次第で吉にも凶にもなる日。今日は自分の直感を信じて動いてみましょう！", color: "パープル", item: "お香・アロマ" },
            { fortune: "末吉", advice: "後半にかけて運気が回復します。午前中はのんびり過ごすのがおすすめです。", color: "ホワイト", item: "温かいお茶" }
        ];

        function drawOmikuji() {
            const container = document.getElementById('resultContainer');
            container.classList.remove('show');

            const randomIndex = Math.floor(Math.random() * omikujiData.length);
            const result = omikujiData[randomIndex];

            document.getElementById('fortuneText').innerText = result.fortune;
            document.getElementById('adviceText').innerText = result.advice;
            document.getElementById('colorText').innerText = result.color;
            document.getElementById('itemText').innerText = result.item;

            if (result.fortune.includes("大吉")) {
                document.getElementById('fortuneText').style.color = "#e74c3c"; // 大吉系は赤文字
            } else {
                document.getElementById('fortuneText').style.color = "#2c3e50"; // その他はスタイリッシュな紺
            }

            setTimeout(() => {
                container.classList.add('show');
            }, 100);
        }
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});