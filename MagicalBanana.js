// クリアに必要なスコア
const REQUIRED_SCORE = 20;

let selectionButtons = [0, 1, 2, 3].map(i =>
	new Button("selectionButton" + i));
for(let i in selectionButtons){
	let button = selectionButtons[i];
	button.displayed = false;
	button.x = 10;
	button.y = 30 * i + 40;
}

let controlButton = new Button("controlButton");
controlButton.x = 10;

let message = new Text("message");
message.x = 10;
message.y = 10;

let scoreAndTime = new Text("scoreAndTime");
scoreAndTime.x = 10;

let score = 0;

let stopwatch = new Stopwatch(10);

let related = loadData();

let theme = "バナナ";
let lastTheme = "";
let selections = [];

let effects = [];
let effectCounter = 0;

// オブジェクトの複製
function duplicate(obj){
	return JSON.parse(JSON.stringify(obj));
}

// 配列のシャッフル
// https://qiita.com/pure-adachi/items/77fdf665ff6e5ea22128
function shuffle(array){
	array = [...array];
	for (i = array.length; 1 < i; i--) {
		let k = Math.floor(Math.random() * i);
		[array[k], array[i - 1]] = [array[i - 1], array[k]]; 
	}
	return array;
}

// number format
// https://takuya-1st.hatenablog.jp/entry/2014/12/03/114154
Number.prototype.format = function(char, cnt){
    return (Array(cnt).fill(char).join("") + this.valueOf()).substr(-1 * cnt); 
}

// データの読み込みと加工
function loadData(){
	let related = {};
	for(let item in DATA){
		for(let item2 of DATA[item]){
			if(related[item] === undefined){
				related[item] = [];
			}
			if(related[item2] === undefined){
				related[item2] = [];
			}
			related[item].push(item2);
			related[item2].push(item);
		}
	}

	// 1つしか要素を持たないものを削除
	while(true){
		let isolatedItems = Object.keys(related).filter(item => related[item].length == 1);
		let isolated = item => isolatedItems.includes(item);

		let changed = false;
		Object.keys(related).forEach(item => {
			if(isolated(item)){
				console.log("deleted " + item);
				delete related[item];
				changed = true;
			}
			else{
				related[item]
					= related[item].filter(elem => !isolated(elem));
			}
		})
		if(!changed) break;
	}
	
	return related;
}

function pickUpRandomItem(){
	let keys = Object.keys(related);
	let i = Math.floor(Math.random() * keys.length);
	return keys[i];
}

function pickUpCorrectAnswer(){
	while(true){
		let item = pickUpRandomItem();

		// 直前のテーマと被っておらず、現在のテーマと関連性がある
		if(item != lastTheme && related[item].includes(theme)){
			return item;
		}
	}
}

function pickUpWrongAnswers(){
	let wrongAnswers = [];
	while(true){
		let item = pickUpRandomItem();

		// 現在のテーマと一致しておらず、他の選択肢と被っておらず、現在のテーマと関連性が無い
		if(item != theme && !wrongAnswers.includes(item) && !related[item].includes(theme)){
			wrongAnswers.push(item);
			if(wrongAnswers.length == 3){
				return wrongAnswers;
			}
		}
	}
}

function select(){
	selections = [pickUpCorrectAnswer(theme, lastTheme)]
		.concat(pickUpWrongAnswers(theme, lastTheme));

	selections = shuffle(selections);

	for(let i in selectionButtons){
		selectionButtons[i].text = selections[i];
	}
}

function backToTitle(){
	clearEffects();
	stopwatch.stop();
	controlButton.y = 50;
	controlButton.text = "スタート！";
	selectionButtons.forEach(button => button.displayed = false);
	message.text = "マジカルバナナ";
	scoreAndTime.text = "";
	scoreAndTime.displayed = false;
	scoreAndTime.y = 170;
}

function startGame(){
	score = 0;
	controlButton.y = 200;
	controlButton.text = "戻る";
	selectionButtons.forEach(button => button.displayed = true);
	message.text = theme + "と言ったら？";
	stopwatch.start();
	scoreAndTime.displayed = true;
	scoreAndTime.y = 170;
	select();
}

function displayResult(){
	clearEffects();
	stopwatch.stop();
	controlButton.y = 90;
	controlButton.text = "戻る";
	selectionButtons.forEach(button => button.displayed = false);
	message.text = "結果";
	scoreAndTime.text = "time : " + stopwatch.time.toFixed(2) + " s";;
	scoreAndTime.displayed = true;
	scoreAndTime.y = 40;
}

function clearEffects(){
	for(let i = effects.length - 1; i >= 0; i--){
		let effect = effects[i];
		document.getElementById("base").removeChild(
			document.getElementById(effect.name)
		);
	}
	effects = [];
}

window.onload = function(){

	// 10ミリ秒ごとに呼び出される
	stopwatch.update = function(){
		scoreAndTime.text 
			= "score : " + score.format(" ", 3) + ", time : " + stopwatch.time.toFixed(2) + " s";
		
		for(let effect of effects){
			effect.y -= 0.01;
		}

		for(let i = effects.length - 1; i >= 0; i--){
			let effect = effects[i];
			if(effect.y < 20){
				document.getElementById("base").removeChild(
					document.getElementById(effect.name)
				);
				effects.splice(i, 1);
			}
		}

		// スコアが目標に達したらゲーム終了
		if(score >= REQUIRED_SCORE){
			displayResult();
		}
	}
	
	// controlButtonが押されたときの処理
	controlButton.onClicked = function(){
		let value = controlButton.text;
		if(value == "スタート！"){
			startGame();
		}
		else if(value == "戻る"){
			backToTitle();
		}
	}

	// selectionButtonが押されたときの処理
	for(let i in selectionButtons){
		selectionButtons[i].onClicked = function(){
			let selectedItem = selections[i];
			let isCorrect = related[selectedItem].includes(theme);

			// 正解
			if(isCorrect){
				score++;
				let effect = new Text("effect" + effectCounter, "+1");
				effectCounter++;
				effect.color = "red";
				effect.x = 180;
				effect.y = 150;
				effects.push(effect);
			}
			// 不正解
			else{
				score--;
				let effect = new Text("effect" + effectCounter, "-1");
				effectCounter++;
				effect.color = "blue";
				effect.x = 180;
				effect.y = 150;
				effects.push(effect);
			}
			
			lastTheme = theme;
			theme = selections[i];
			message.text = theme + "と言ったら？";
			select();
		}
	}

	console.log(duplicate(related));

	backToTitle();
}