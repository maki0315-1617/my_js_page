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
    <title>ロンの運勢占い</title>
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

        /* 日時表示 */
        #datetime {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 12px;
        }

        /* 結果に表示する引いた日時 */
        #drawTime {
            margin-top: 8px;
            font-size: 0.85rem;
            color: #7f8c8d;
        }

        /* マスコット */
        .mascot-area {
            position: relative;
            margin-bottom: 20px;
            height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
        }

        .mascot-speech {
            background: #fff;
            border: 2px solid #666;
            border-radius: 16px;
            padding: 8px 14px;
            font-size: 0.8rem;
            color: #333;
            margin-bottom: 8px;
            position: relative;
            max-width: 260px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .mascot-speech::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #666;
        }

        .mascot {
            width: 80px;
            height: 80px;
            position: relative;
            animation: mascotBounce 2s ease-in-out infinite;
            transition: transform 0.4s ease;
        }

        .mascot.shake {
            animation: mascotShake 0.5s ease;
        }

        .mascot.jump {
            animation: mascotJump 0.6s ease;
        }

        .mascot.sad {
            animation: mascotSad 1s ease;
        }

        @keyframes mascotBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }

        @keyframes mascotShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-8deg); }
            75% { transform: rotate(8deg); }
        }

        @keyframes mascotJump {
            0%, 100% { transform: translateY(0) scale(1); }
            40% { transform: translateY(-20px) scale(1.1); }
            60% { transform: translateY(-20px) scale(1.1); }
        }

        @keyframes mascotSad {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(4px); }
        }

        .mascot-body {
            width: 70px;
            height: 60px;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            border-radius: 50% 50% 45% 45%;
            position: absolute;
            bottom: 0;
            left: 5px;
            box-shadow: inset -4px -4px 8px rgba(0,0,0,0.3);
        }

        .mascot-ear {
            width: 22px;
            height: 28px;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            border-radius: 50% 50% 0 0;
            position: absolute;
            top: 0;
        }

        .mascot-ear.left { left: 8px; transform: rotate(-15deg); }
        .mascot-ear.right { right: 8px; transform: rotate(15deg); }

        .mascot-ear-inner {
            width: 12px;
            height: 16px;
            background: #ff69b4;
            border-radius: 50% 50% 0 0;
            position: absolute;
            bottom: 4px;
            left: 5px;
        }

        .mascot-face {
            position: absolute;
            bottom: 18px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
        }

        .mascot-eyes {
            display: flex;
            justify-content: space-between;
            padding: 0 6px;
        }

        .mascot-eye {
            width: 10px;
            height: 12px;
            background: #ffcc00;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s ease;
            border: 1px solid #ff9900;
        }

        .mascot-eye::after {
            content: '';
            width: 4px;
            height: 6px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            right: 1px;
        }

        .mascot.happy .mascot-eye {
            height: 6px;
            border-radius: 50% 50% 0 0;
            margin-top: 4px;
        }

        .mascot.sad-mood .mascot-eye {
            height: 4px;
            border-radius: 0 0 50% 50%;
            margin-top: 6px;
        }

        .mascot-cheeks {
            display: flex;
            justify-content: space-between;
            padding: 0 2px;
            margin-top: 4px;
        }

        .mascot-cheek {
            width: 10px;
            height: 6px;
            background: #ffb3ba;
            border-radius: 50%;
            opacity: 0.7;
        }

        .mascot-mouth {
            width: 12px;
            height: 6px;
            border: 2px solid #ffcc00;
            border-top: none;
            border-radius: 0 0 12px 12px;
            margin: 2px auto 0;
            transition: all 0.3s ease;
        }

        .mascot.happy .mascot-mouth {
            width: 14px;
            height: 8px;
            border-radius: 0 0 14px 14px;
        }

        .mascot.sad-mood .mascot-mouth {
            border-top: 2px solid #ffcc00;
            border-bottom: none;
            border-radius: 12px 12px 0 0;
            margin-top: 4px;
        }

        .mascot-tail {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            border-radius: 50%;
            position: absolute;
            bottom: 8px;
            right: -8px;
            animation: tailWag 1.5s ease-in-out infinite;
        }

        @keyframes tailWag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
        }
    </style>
</head>
<body>

    <div class="omikuji-card">
        <div class="mascot-area">
            <div class="mascot-speech" id="mascotSpeech">ニャア！ロンだよ。今日の運勢を占おう♪</div>
            <div class="mascot" id="mascot">
                <div class="mascot-ear left"><div class="mascot-ear-inner"></div></div>
                <div class="mascot-ear right"><div class="mascot-ear-inner"></div></div>
                <div class="mascot-body"></div>
                <div class="mascot-face">
                    <div class="mascot-eyes">
                        <div class="mascot-eye"></div>
                        <div class="mascot-eye"></div>
                    </div>
                    <div class="mascot-cheeks">
                        <div class="mascot-cheek"></div>
                        <div class="mascot-cheek"></div>
                    </div>
                    <div class="mascot-mouth"></div>
                </div>
                <div class="mascot-tail"></div>
            </div>
        </div>

        <h1>ロンの運勢占い</h1>
        <p class="description">黒猫ロンが今日のあなたの運勢を占います</p>
        
        <!-- 追加: ページ上部に常時表示する日時 -->
        <div id="datetime">今日の日時: -</div>

        <button class="btn" onclick="drawOmikuji()">おみくじを引く</button>

        <div class="result-container" id="resultContainer">
            <div class="fortune" id="fortuneText">-</div>
            <div class="details">
                <div id="adviceText">-</div>
                <div class="extra-info">
                    <span>ラッキーカラー: <strong id="colorText">-</strong></span>
                    <span>ラッキーアイテム: <strong id="itemText">-</strong></span>
                </div>
                <!-- 追加: 引いた日時を結果内に表示 -->
                <div id="drawTime">引いた日時: -</div>
            </div>
        </div>
    </div>

    <script>
        // 運勢（出やすさの重み付き）
        const fortunes = [
            { name: "超大吉", weight: 1, style: "great" },
            { name: "大吉", weight: 3, style: "great" },
            { name: "向大吉", weight: 4, style: "good" },
            { name: "吉", weight: 8, style: "good" },
            { name: "中吉", weight: 10, style: "good" },
            { name: "小吉", weight: 12, style: "good" },
            { name: "半吉", weight: 10, style: "neutral" },
            { name: "末吉", weight: 8, style: "neutral" },
            { name: "末小吉", weight: 6, style: "neutral" },
            { name: "凶", weight: 5, style: "bad" },
            { name: "小凶", weight: 4, style: "bad" },
            { name: "半凶", weight: 3, style: "bad" },
            { name: "末凶", weight: 2, style: "bad" },
            { name: "大凶", weight: 1, style: "bad" },
            { name: "吉凶未分", weight: 6, style: "neutral" }
        ];

        const advices = [
            "最高の運気です！願ったことがすべて叶うレベルの1日。何か新しいことを始めるなら今日！",
            "素晴らしい一日になるでしょう！周囲への感謝を忘れずに過ごすとさらに吉。",
            "これからどんどん運気が上がっていきます。少し高めの目標に挑戦してみて！",
            "堅実に行動すると成果が出る日。焦らず一歩ずつ進むのがスマートです。",
            "バランスの良い安定した運勢。身近な友人に連絡を取ると良い刺激をもらえそう。",
            "小さな幸せが見つかる日。落とし物や忘れ物には少しだけ気をつけて。",
            "あなたの行動次第で吉にも凶にもなる日。今日は自分の直感を信じて動いてみましょう！",
            "後半にかけて運気が回復します。午前中はのんびり過ごすのがおすすめです。",
            "思いがけない出会いや発見がありそう。いつもと違う道を歩いてみるのも吉。",
            "今日は「待つ」ことが吉。焦って決断せず、情報を集めてから動きましょう。",
            "人との協力が鍵。一人で抱え込まず、周囲に相談してみて。",
            "健康管理に気を配ると運気アップ。水分補給と早寝を心がけて。",
            "慎重さが吉。契約や約束は内容をよく確認してからサインを。",
            "今日は控えめに。目立つ行動より、地道な積み重ねが後から効いてきます。",
            "一度立ち止まって振り返る日。過去の経験が今日のヒントになります。",
            "無理をせず、できることから。小さな成功が次の一歩を後押しします。"
        ];

        const colors = [
            "ゴールド", "レッド", "スカイブルー", "グリーン", "オレンジ", "イエロー",
            "パープル", "ホワイト", "ピンク", "ネイビー", "ミント", "コーラル",
            "ラベンダー", "シルバー", "ターコイズ", "ベージュ"
        ];

        const items = [
            "新しい靴", "お気に入りのカフェのコーヒー", "ノートとペン", "観葉植物",
            "スマホケース", "ハンカチ", "お香・アロマ", "温かいお茶", "お守り",
            "音楽プレイリスト", "お気に入りの本", "チョコレート", "傘", "時計",
            "マフラーやストール", "写真立て", "ボールペン", "クッキー"
        ];

        const fortuneColors = {
            great: "#e74c3c",
            good: "#27ae60",
            neutral: "#2c3e50",
            bad: "#7f8c8d"
        };

        const mascotMessages = {
            idle: ["ニャア！ロンだよ。今日の運勢を占おう♪", "運勢を占ってみない？", "ロンが応援してるにゃん！"],
            drawing: ["ガタガタ…ニャーン！", "何が出るかな〜？", "おみくじおみくじ〜♪"],
            great: ["ニャア！超大吉だ！", "すごい！最高の運気だね！", "わぁ〜！ラッキーにゃん！"],
            good: ["いい感じだね！", "吉が出たよ！良い一日になりそう♪", "うれしい！がんばってね！"],
            neutral: ["まあまあかな…", "自分のペースでいこう！", "どっちつかず…でも大丈夫！"],
            bad: ["えへへ…次はきっと吉にゃん！", "大丈夫、ロンがそばにいるよ", "凶でも、明日はきっと良い日！"]
        };

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function setMascotMood(style, isDrawing) {
            const mascot = document.getElementById('mascot');
            const speech = document.getElementById('mascotSpeech');

            mascot.className = 'mascot';
            if (isDrawing) {
                mascot.classList.add('shake');
                speech.innerText = pickRandom(mascotMessages.drawing);
                return;
            }

            if (style === 'great' || style === 'good') {
                mascot.classList.add('happy', 'jump');
                speech.innerText = pickRandom(mascotMessages[style]);
            } else if (style === 'bad') {
                mascot.classList.add('sad-mood', 'sad');
                speech.innerText = pickRandom(mascotMessages.bad);
            } else {
                speech.innerText = pickRandom(mascotMessages.neutral);
            }
        }

        function pickWeighted(items) {
            const total = items.reduce((sum, item) => sum + item.weight, 0);
            let roll = Math.random() * total;
            for (const item of items) {
                roll -= item.weight;
                if (roll <= 0) return item;
            }
            return items[items.length - 1];
        }

        // --- 追加: 常時日時表示（ページ上部） ---
        const datetimeEl = document.getElementById('datetime');
        function updateDatetime() {
            const now = new Date();
            datetimeEl.textContent = '今日の日時: ' + now.toLocaleString();
        }
        updateDatetime();
        setInterval(updateDatetime, 1000);

        // 変更: ロン君が考えているアニメーションを長くして、結果に引いた日時を表示する
        function drawOmikuji() {
            const container = document.getElementById('resultContainer');
            const speech = document.getElementById('mascotSpeech');
            const drawTimeEl = document.getElementById('drawTime');

            container.classList.remove('show');
            setMascotMood(null, true); // 振動等の表示を付与

            // 考えている間のドットアニメーション（500ms ごと）
            let dots = 0;
            const base = pickRandom(mascotMessages.drawing);
            const thinkingInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                speech.innerText = base + ' ' + '.'.repeat(dots);
            }, 500);

            // 待機時間を長めに（例：5000ms = 5秒）
            const thinkingDuration = 5000;
            setTimeout(() => {
                clearInterval(thinkingInterval);

                const fortune = pickWeighted(fortunes);
                const advice = pickRandom(advices);
                const color = pickRandom(colors);
                const item = pickRandom(items);

                document.getElementById('fortuneText').innerText = fortune.name;
                document.getElementById('adviceText').innerText = advice;
                document.getElementById('colorText').innerText = color;
                document.getElementById('itemText').innerText = item;
                document.getElementById('fortuneText').style.color = fortuneColors[fortune.style];

                // 引いた日時を表示
                const now = new Date();
                drawTimeEl.innerText = '引いた日時: ' + now.toLocaleString();

                setMascotMood(fortune.style, false);
                container.classList.add('show');
            }, thinkingDuration);
        }
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
