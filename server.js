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

        /* 過去の運勢セクション */
        .history-container {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #ddd;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s ease;
            max-height: 0;
            overflow: hidden;
        }

        .history-container.show {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
        }

        .history-item {
            background: #f0f4f8;
            border-left: 4px solid #3498db;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            line-height: 1.5;
            transition: all 0.3s ease;
        }

        .history-item:hover {
            background: #e8f1f8;
            transform: translateX(4px);
        }

        .history-fortune {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .history-time {
            font-size: 0.8rem;
            color: #7f8c8d;
            margin-top: 8px;
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

        <button class="btn" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); margin-top: 15px;" onclick="toggleHistory()">過去の運勢を見る</button>

        <div class="result-container" id="resultContainer">
            <div class="fortune" id="fortuneText">-</div>
            <div class="details">
                <div id="adviceText">-</div>
                <!-- 追加: 運勢を変えるためのアドバイス -->
                <div id="changeFortuneAdvice" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 0.9rem; font-style: italic; color: #8e44ad;">-</div>
                <div class="extra-info">
                    <span>ラッキーカラー: <strong id="colorText">-</strong></span>
                    <span>ラッキーアイテム: <strong id="itemText">-</strong></span>
                </div>
                <!-- 追加: 引いた日時を結果内に表示 -->
                <div id="drawTime">引いた日時: -</div>
            </div>
        </div>

        <!-- 追加: 過去の運勢表示セクション -->
        <div class="history-container" id="historyContainer" style="display: none;">
            <h2 style="font-size: 1.3rem; color: #2c3e50; margin-top: 0; margin-bottom: 15px;">過去の運勢（最新3件）</h2>
            <div id="historyList" style="max-height: 400px; overflow-y: auto;">
                <div style="text-align: center; color: #7f8c8d; padding: 20px;">履歴がまだありません</div>
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

        // 追加: 運勢を変えるためのアドバイス
        const changeFortuneAdvice = {
            great: [
                "今の気持ちを大切にしてください。この幸運を他者と分かち合うことで、さらに幸せが増します。",
                "感謝の気持ちを忘れずに過ごしてください。その感謝があれば、運勢はずっと良いままです。",
                "この幸運を次のチャレンジへの足がかりにしましょう。さらに大きな目標へ向かう時です。",
                "良い流れに乗っています。今こそ、あなたが本当にやりたいことに取り組むチャンスです。",
                "周囲への親切や優しさを忘れずに。与えたものはやがて自分に返ってきます。",
                "この運気を維持するために、毎日小さな感謝を忘れずに。継続することが運を呼びます。"
            ],
            good: [
                "周囲との関係を大事にしましょう。人間関係を丁寧にしていくことが、運勢を保つ鍵です。",
                "小さなことでも丁寧に取り組むと、良い運勢がさらに続きます。",
                "今は地道な努力が報われる時。コツコツと積み重ねたものが大きな成果になります。",
                "信頼できる人に相談することで、さらに良い道が開けるでしょう。",
                "毎日の習慣を大事にしてください。小さな良い習慣が大きな運気を作ります。",
                "自分の直感と周囲の声のバランスを取ることが大切です。両方を大事にしましょう。"
            ],
            neutral: [
                "自分自身と向き合う時間を作りましょう。瞑想や日記を通じて、気づきが生まれます。",
                "新しいことに挑戦する勇気を持つことで、運勢は変わります。小さな一歩から始めてください。",
                "今は準備の時期です。次のステップに向けて、スキルや知識を磨きましょう。",
                "小さな変化を大事にしてください。目に見えない変化が、やがて大きな流れを作ります。",
                "人との交流を増やしてみてください。新しい出会いが運勢を動かすきっかけになります。",
                "今のあなたに必要なものは何かをよく考えてみてください。その答えが運勢を変えます。"
            ],
            bad: [
                "前向きな気持ちを保つことが最も大切です。ポジティブなマインドが、状況を変えます。",
                "今は学びの時。この経験から得られる教訓が、将来の幸運へとつながります。",
                "困難な時こそ、できることに集中しましょう。小さな成功が自信につながります。",
                "信頼できる人に頼ることも大事です。一人で抱え込まず、サポートを求めてください。",
                "今のマイナスの状況は、あなたを成長させるための試練です。乗り越えた先に光があります。",
                "今こそ、自分の本当に大切なものが何かを知る時です。その気づきが運勢を変えます。"
            ]
        };

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function setMascotMood(style, isDrawing) {
            const mascot = document.getElementById('mascot');
            const speech = document.getElementById('mascotSpeech');

            mascot.className = 'mascot';
            if (isDrawing) {
                // 待ち時間中により多くの表情変化を加える
                mascot.classList.add('shake');
                // ランダムに目を見開いたり、つぶったりする表現を追加
                const randomMood = Math.random();
                if (randomMood < 0.3) {
                    mascot.classList.add('happy');
                } else if (randomMood < 0.6) {
                    mascot.classList.add('sad-mood');
                }
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
                // 待ち時間中にロンの表情をランダムに変化させる
                const mascot = document.getElementById('mascot');
                const randomMood = Math.random();
                mascot.className = 'mascot shake';
                if (randomMood < 0.4) {
                    mascot.classList.add('happy');
                } else if (randomMood < 0.7) {
                    mascot.classList.add('sad-mood');
                }
            }, 500);

            // 待機時間を長めに（例：5000ms = 5秒）
            const thinkingDuration = 5000;
            setTimeout(() => {
                clearInterval(thinkingInterval);

                const fortune = pickWeighted(fortunes);
                const advice = pickRandom(advices);
                const color = pickRandom(colors);
                const item = pickRandom(items);
                const changeTip = pickRandom(changeFortuneAdvice[fortune.style]);

                document.getElementById('fortuneText').innerText = fortune.name;
                document.getElementById('adviceText').innerText = advice;
                document.getElementById('changeFortuneAdvice').innerText = '🌟 運勢を変えるためには：' + changeTip;
                document.getElementById('colorText').innerText = color;
                document.getElementById('itemText').innerText = item;
                document.getElementById('fortuneText').style.color = fortuneColors[fortune.style];

                // 引いた日時を表示
                const now = new Date();
                drawTimeEl.innerText = '引いた日時: ' + now.toLocaleString();

                // 追加: LocalStorageに保存
                saveToHistory({
                    fortune: fortune.name,
                    advice: advice,
                    color: color,
                    item: item,
                    time: now.toLocaleString(),
                    style: fortune.style
                });

                setMascotMood(fortune.style, false);
                container.classList.add('show');
            }, thinkingDuration);
        }

        // 追加: LocalStorageに運勢を保存（最新3件）
        function saveToHistory(fortuneData) {
            let history = JSON.parse(localStorage.getItem('omikujiHistory') || '[]');
            history.unshift(fortuneData); // 先頭に追加
            history = history.slice(0, 3); // 最新3件に制限
            localStorage.setItem('omikujiHistory', JSON.stringify(history));
        }

        // 追加: 履歴表示のトグル
        function toggleHistory() {
            const historyContainer = document.getElementById('historyContainer');
            historyContainer.classList.toggle('show');
            if (historyContainer.classList.contains('show')) {
                displayHistory();
            }
        }

        // 追加: 履歴を表示
        function displayHistory() {
            const history = JSON.parse(localStorage.getItem('omikujiHistory') || '[]');
            const historyList = document.getElementById('historyList');
            
            if (history.length === 0) {
                historyList.innerHTML = '<div style="text-align: center; color: #7f8c8d; padding: 20px;">履歴がまだありません</div>';
                return;
            }

            historyList.innerHTML = history.map((item, index) => `
                <div class="history-item">
                    <div class="history-fortune" style="color: ${fortuneColors[item.style]};">第${index + 1}回: ${item.fortune}</div>
                    <div><strong>アドバイス：</strong> ${item.advice}</div>
                    <div><strong>ラッキーカラー：</strong> ${item.color}</div>
                    <div><strong>ラッキーアイテム：</strong> ${item.item}</div>
                    <div class="history-time">${item.time}</div>
                </div>
            `).join('');
        }

        // 追加: ページ読み込み時に初期化
        window.addEventListener('DOMContentLoaded', function() {
            // 初期化処理（必要に応じてここに追加）
        });
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
