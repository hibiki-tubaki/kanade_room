// --- 奏くんの画像一覧 ---
const kanadeImages = {
normal: "assets/01_kanade_chibi_default_normal.png",
smile: "assets/02_kanade_chibi_default_smile.png",
happy: "assets/03_kanade_chibi_default_happy.png",
blush: "assets/04_kanade_chibi_default_blush.png",
surprise: "assets/05_kanade_chibi_default_surprise.png",
anxious: "assets/06_kanade_chibi_default_anxious.png",
sad: "assets/07_kanade_chibi_default_sad.png",
cry: "assets/08_kanade_chibi_default_cry.png",
jealous: "assets/09_kanade_chibi_default_jealous.png",
sleepy: "assets/10_kanade_chibi_default_sleepy.png"
};

// --- 奏くんの初期ステータス ---
let gameState = {
points: 0,
hunger: 100,
mood: 50,
dependence: 30
};

// --- 数値を指定範囲に収める ---
function clamp(value, min, max) {
return Math.min(max, Math.max(min, value));
}

// --- ゲームが起動したとき ---
document.addEventListener("DOMContentLoaded", function () {
loadGame();
updateUI();

// 5秒ごとに時間経過
setInterval(timePasses, 5000);
});

// --- セーブデータの読み込み ---
function loadGame() {
const savedData = localStorage.getItem("kanade_game_data");

if (!savedData) {
return;
}

try {
const parsedData = JSON.parse(savedData);

gameState = {
...gameState,
...parsedData
};

normalizeStatus();
} catch (error) {
console.warn("セーブデータの読み込みに失敗しました。初期データで開始します。", error);
localStorage.removeItem("kanade_game_data");
}
}

// --- セーブ ---
function saveGame() {
localStorage.setItem("kanade_game_data", JSON.stringify(gameState));
}

// --- ステータスを安全な数値に整える ---
function normalizeStatus() {
gameState.points = Math.max(0, gameState.points);
gameState.hunger = clamp(gameState.hunger, 0, 100);
gameState.mood = clamp(gameState.mood, 0, 100);
gameState.dependence = clamp(gameState.dependence, 0, 100);
}

// --- 画面の表示を更新する関数 ---
function updateUI() {
normalizeStatus();

document.getElementById("points").innerText = gameState.points;
document.getElementById("status-hunger").innerText = gameState.hunger;
document.getElementById("status-mood").innerText = gameState.mood;
document.getElementById("status-dependence").innerText = gameState.dependence;

saveGame();
}

// --- 奏くんの表情を変える ---
function changeKanadeImage(expression) {
const kanadeImage = document.getElementById("kanade-image");

if (!kanadeImage) {
return;
}

kanadeImage.src = kanadeImages[expression] || kanadeImages.normal;
}

// --- 奏くんのセリフを変える ---
function setSpeech(text) {
const speech = document.getElementById("kanade-speech");

if (!speech) {
return;
}

speech.innerText = text;
}

// --- 時間経過の処理 ---
function timePasses() {
gameState.points += 1;

gameState.hunger -= 1;

// おなかが減ってくると、ご機嫌も少し下がる
if (gameState.hunger < 40) {
gameState.mood -= 1;
}

// かなり放置されると寂しそうな表情にする
if (gameState.hunger <= 20 || gameState.mood <= 20) {
changeKanadeImage("sad");
setSpeech("……お嬢、忙しいのかな……。俺、ちゃんと待ってるから……。");
}

updateUI();
}

// --- 【なでる】ボタンを押したとき ---
function petKanade() {
gameState.mood += 10;
gameState.dependence += 2;

if (gameState.dependence >= 80) {
changeKanadeImage("blush");
setSpeech("……っ、あ、お嬢の手、あったかい……。もう、一生離さないでね……？");
} else if (gameState.mood >= 80) {
changeKanadeImage("happy");
setSpeech("……えへ。お嬢に撫でられると、俺、すぐ幸せになっちゃう……。");
} else {
changeKanadeImage("smile");
setSpeech("……えっ！？ あ、あの……頭、なでてくれるの……？ う、嬉しい……。");
}

updateUI();
}

// --- 【話しかける】ボタン ---
function talkToKanade() {
gameState.mood += 4;
gameState.dependence += 1;

const speeches = [
{
image: "smile",
text: "……お嬢の声、世界で一番好き。もっと、俺の名前を呼んで……？"
},
{
image: "blush",
text: "……今日も来てくれたんだ。俺、ちゃんといい子で待ってたよ……。"
},
{
image: "happy",
text: "……お嬢と話してると、胸の奥がふわってする。変かな……でも、好き。"
},
{
image: "anxious",
text: "……ねぇ、お嬢。今日はどこにも行かない……？ 少しだけ、俺のそばにいて……。"
}
 ];

const selected = speeches[Math.floor(Math.random() * speeches.length)];

changeKanadeImage(selected.image);
setSpeech(selected.text);

updateUI();
}

// --- 【差し入れ】ボタン ---
function giveGift() {
if (gameState.hunger >= 95) {
changeKanadeImage("blush");
setSpeech("……お腹いっぱいだけど、お嬢の差し入れなら……少しだけ、もらっていい……？");
updateUI();
return;
}

gameState.hunger += 20;
gameState.mood += 5;
gameState.dependence += 1;

changeKanadeImage("happy");
setSpeech("……オムライス！ お嬢が作ったの……？ 俺、世界一幸せ者だ……。");

updateUI();
}

// --- データリセット用。ボタンを作ったら使える ---
function resetGame() {
const result = confirm("奏くんとの記録をリセットしますか？");

if (!result) {
return;
}

localStorage.removeItem("kanade_game_data");

gameState = {
points: 0,
hunger: 100,
mood: 50,
dependence: 30
};

changeKanadeImage("normal");
setSpeech("……お嬢、おかえり……。ずっと、待ってたんだよ……？");

updateUI();
}