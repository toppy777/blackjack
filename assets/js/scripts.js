const drawButton	= document.getElementById('draw');
const startButton	= document.getElementById('start');
const duelButton	= document.getElementById('duel');
const p	= document.getElementById('p');
const d	= document.getElementById('d')
const ps	= document.getElementById('psum');
const ds	= document.getElementById('dsum');
const result = document.getElementById('duelresult');
const goldc = document.getElementById('gold');

let playerHand;
let dealerHand;
let dealerHandSecond;
let i = 0;

let gold = 1000;

drawButton.disabled = true;
duelButton.disabled = true;

const d_imgs = document.getElementById('d_imgs');
const p_imgs = document.getElementById('p_imgs');

/*
◆実装予定
・Aを含めた手の処理
・ディーラーのブラックジャック判定がされない
・ディーラーのAが出たときに、Aを11として判定した方が良い
*/

startButton.onclick = function(){
	
	playerHand = [];
	dealerHand = [];
	dealerHandSecond = "";
	result.innerText = "";
	p.innerText = "";
	d.innerText = "";

	while (d_imgs.firstChild) d_imgs.removeChild(d_imgs.firstChild);
	while (p_imgs.firstChild) p_imgs.removeChild(p_imgs.firstChild);
	
	// プレイヤー1回目のドロー
	let card = DrawCard();
	PutDrawCard("p", card, true);
	SaveCard("p", card.n);
	PutTotalHand("p");
	AppendImg("p", card.pn, card.n);
	
	const img = document.createElement('img');
	
	//ディーラー1回目のドロー
	card = DrawCard();
	PutDrawCard("d", card, true);
	SaveCard("d", card.n);
	PutTotalHand("d");
	AppendImg("d", card.pn, card.n);
	
	// プレイヤー2回目のドロー
	card = DrawCard();
	PutDrawCard("p", card);
	SaveCard("p", card.n);
	PutTotalHand("p");
	AppendImg("p", card.pn, card.n);
	
	//ディーラー2回目のドロー(2枚目は表示しない)
	card = DrawCard();
	dealerHandSecond = card.pn;
	SaveCard("d", card.n);


	// プレイヤーがブラックジャックかどうかみる
	if(playerHand[0] == 1 || playerHand[1] == 1){
		if((playerHand[0] + playerHand[1]) == 11){
			p.innerText += "\nブラックジャック!";
			drawButton.disabled = true;
			duelButton.disabled = false;
			startButton.disabled = true;
			return;
		}
	}
	
	startButton.disabled = true;
	drawButton.disabled = false;
	duelButton.disabled = false;
};

drawButton.onclick = function(){
/*
	i++;
	drawButton.innerText = "カード" + i;
*/	
	let card = DrawCard();
	PutDrawCard("p", card);
	AppendImg("p", card.pn, card.n);
	if(card.n >= 10)
		card.n = 10;
	playerHand.push(card.n);
	let sum = 0;
	for(let j = 0; j < playerHand.length; j++){
		sum += playerHand[j];
		console.log("sum : " + sum);
		if(sum == 21){
			p.innerText += "\n21です。";
			PutTotalHand("p");
			drawButton.disabled = true;
			return;
		}
		if(sum > 21){
			p.innerText += "\nバースト！！！！！！！！！";
			result.innerText = "負け";
			drawButton.disabled = true;
			duelButton.disabled = true;
			startButton.disabled = false;
		}
	}
	PutTotalHand("p");
};

duelButton.onclick = function(){
	let d_burst = false; // ディーラーのバースト具合
	let d_blackjack = false;
	d.innerText += "\n" + numToPictureName(dealerHandSecond) + "の" + dealerHand[1]; // ディーラー2回目の手
	AppendImg("d", dealerHandSecond, dealerHand[1]);
	PutTotalHand("d");
	if((dealerHand[0] == 1 || dealerHand[1] == 1) && (dealerHand[0] + dealerHand[1]) == 11){
		d.innerText += "\nブラックジャックです。";
		d_blackjack = true;
	}
	
	while(TotalHand("d") < 17 && d_blackjack == false){
		let card = DrawCard();
		PutDrawCard("d", card);
		SaveCard("d", card.n);
		PutTotalHand("d");
		AppendImg("d", card.pn, card.n);
		if(TotalHand("d") > 21){
			d.innerText += "\nバースト！！！！！！！！！";
			d_burst = true;
		}
	}
	let p_existA = false;
	for(let j = 0; j < playerHand.length; j++){
		if(playerHand[j] == 1){
			p_existA = true;
		}
	}
	let d_existA = false;
	for(let j = 0; j < dealerHand.length; j++){
		if(dealerHand[j] == 1){
			d_existA = true;
		}
	}
	
	if(p_existA){
		if((TotalHand("p") + 10) < 21){
			playerHand.push(10);
		}
	}
	if(d_existA){
		if((TotalHand("d") + 10) < 21){
			dealerHand.push(10);
		}
	}
	
	if(d_burst == false){
		if((playerHand[0] == 1 || playerHand[1] == 1) && (playerHand[0] + playerHand[1]) == 11){
			result.innerText = "勝ち";
			if((dealerHand[0] == 1 || dealerHand[1] == 1) && (dealerHand[0] + dealerHand[1]) == 11){
				result.innerText = "引き分け"; // プレイヤーもディーラーもブラックジャックの場合
			}
		}
		else if((dealerHand[0] == 1 || dealerHand[1] == 1) && (dealerHand[0] + dealerHand[1]) == 11){
			result.innerText = "負け";
		}
		else if(TotalHand("p") > TotalHand("d")){
			result.innerText = "勝ち";
		}
		else if(TotalHand("p") < TotalHand("d")){
			result.innerText = "負け";
		}
		else{
			result.innerText = "引き分け";
		}
	}
	else result.innerText = "勝ち";
	
	startButton.disabled = false;
	drawButton.disabled = true;
	duelButton.disabled = true;
};

/**
* 0～maxまでの数値をランダムで返す
*/
function getRandomInt(max) {
  	return Math.floor(Math.random() * Math.floor(max));
}

/**
* 画像追加
*/
function AppendImg(oStr, pName, num){ // oStr: プレイヤーかディーラーか(p or d)
	let o;
	if(oStr == "d")
		o = d_imgs;
	else if(oStr == "p")
		o = p_imgs;
	
	let div = document.createElement('div');
	div.style.position = "relative";
	div.style.overflow = "hidden";
	div.style.width = "60px";
	div.style.height = "90px";
	div.style.display = "inline-block";
	o.appendChild(div);
	
	let img = document.createElement('img');
	img.src = "assets/img/" + num + ".png";
	img.style.position = "absolute";
	img.style.top = "0";
	img.style.left = GetPixel(pName);
	img.style.height = "100%";
	img.style.width = "auto";
	img.style.maxWidth = "none";
	div.appendChild(img);
	
		/*
	div = document.createElement('div');
	div.style.position = "relative";
	div.style.overflow = "hidden";
	div.style.width = "60px";
	div.style.height = "90px";
	div.style.display = "inline-block";
	div.appendChild(img);

	document.getElementById('card-history').appendChild(div);
	img = document.createElement('img');
	img.src = "assets/img/" + num + ".png";
	img.style.position = "absolute";
	img.style.top = "0";
	img.style.left = GetPixel(pName);
	img.style.height = "100%";
	img.style.width = "auto";
	img.style.maxWidth = "none";
	div.appendChild(img);
	*/
}

/**
* 図柄名を受け取って、ピクセル数を返す
*/
function GetPixel(pName){
	let p = "0";
	if(pName == 0){
		p = "0";
	}
	else if(pName == 1){
		p = "-60";
	}
	else if(pName == 2){
		p = "-120";
	}
	else if(pName == 3){
		p = "-180";
	}
	return p;
}

/**
* 対象の手の合計を返す
*/
function TotalHand(oStr){ // oStr:誰のカードか(ディーラーかプレイヤーか)
	let o;
	let oc;
	if(oStr == "d"){
		o = dealerHand;
		oc = d;
	}
	else if(oStr == "p"){
		o = playerHand;
		oc = p;
	}
	let sum = 0;
	for(let j = 0; j < o.length; j++){
		sum += o[j];
/*		console.log("sum : " + sum);
		if(sum == 21){
			oc.innerText += "\n21です。";
		}
		if(sum > 21){
			oc.innerText += "\nバースト！！！！！！！！！";
		}*/
	}
	return sum;
}

/**
* 引いたカードを表示
*/
function PutDrawCard(oStr, card, first = false){ // oStr  "d":ディーラー "p":プレイヤー
	let o;
	if(oStr == "d"){
		o = d;
	}
	else if(oStr == "p"){
		o = p;
	}
	let n = "";
	if(first == false){
		n = "\n";
	}
	if(card.n > 10){
		o.innerText += n + numToPictureName(card.pn) + "の" + card.n + "(10)";
	}
	else{
		o.innerText += n + numToPictureName(card.pn) + "の" + card.n;
	}
}

/**
* 手の合計の表示
*/
function PutTotalHand(oStr){ // oStr  "d":ディーラー "p":プレイヤー
	let o;
	let oc;
	if(oStr == "d"){
		o = dealerHand;
		oc = ds;
	}
	else if(oStr == "p"){
		o = playerHand;
		oc = ps;
	}
	let existA = false;
	for(let j = 0; j < o.length; j++){
		if(o[j] == 1){
			existA = true;
		}
	}
	if(existA == true){
		if((o[0] == 1 || o[1] == 1) && (o[0] + o[1]) == 11){
			oc.innerText = " : " + (TotalHand(oStr) + 10);
		}
		else if((TotalHand(oStr) + 10) > 21){
			oc.innerText = " : " + TotalHand(oStr);
		}
		else{
			oc.innerText = " : " + TotalHand(oStr) + " or " + (TotalHand(oStr) + 10);
		}
	}
	else{
		oc.innerText = " : " + TotalHand(oStr);
	}
}

/**
* カードを保存
* 10以上のカードは10にする
*/
function SaveCard(oStr, num){ // oStr:誰のカードか(ディーラーかプレイヤーか) num:カードの数字
	let o;
	if(oStr == "d")
		o = dealerHand;
	else if(oStr == "p")
		o = playerHand;
	if(num >= 10){
		num = 10;
	}
	o.push(num)
}

/**
* カードを引く
*/
function DrawCard(){
	let cardNum = 0;
	let cardPicture = 0;
	while(cardNum == 0){
		cardPicture = getRandomInt(4)
		cardNum = getRandomInt(13) + 1;
		cardNum = findCard(cardPicture, cardNum);
		if(deck[0][0] == 13 && deck[1][0] == 13 && deck[2][0] == 13 && deck[3][0] == 13){
			return {pn: null, n: null} // カードがなくなった時
		}
	}
/*	if(cardNum >= 1 && cardNum <= 13){
		p.innerText = numToPictureName(cardPicture) + "の" + cardNum;
	}*/
	return {pn: cardPicture, n: cardNum} // pn:
}

/**
* 絵柄の数、数字をもとにカードを見つけて返す
*/
function findCard(picture, num){
	console.log("find :" + picture + ", " + num);
	if(deck[picture][num] == 0)
		return 0;
	console.log(deck[picture][num]);
	let r = deck[picture][num];
	usedCard(picture, num);
	return r;
}

/**
* 使用したカードを使用不能にする
*/
function usedCard(picture, num){
	deck[picture][num] = 0;
	deck[picture][0] += 1;
	console.log("deck" + picture + " : " + deck[picture][0]);
}

/**
* 絵柄の数値を名前に変換
*/
function numToPictureName(pictureNum){
	let pictureName = "";
	if(pictureNum == 0)
		pictureName = "ハート";
	else if(pictureNum == 1)
		pictureName = "スペード";
	else if(pictureNum == 2)
		pictureName = "ダイヤ";
	else if(pictureNum == 3)
		pictureName = "クローバー";
	return pictureName;
}

let deck = [
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13],		// 0...ハート
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13],		// 1...スペード
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13],		// 2...ダイヤ
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13]		// 3...クローバー
];

/*
参考にしたサイト
・http://cly7796.net/wp/javascript/create-elements-with-javascript/
・https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
・https://www.tam-tam.co.jp/tipsnote/html_css/post10099.html
*/