const gameOverDiv = document.querySelector(".game-over");
const h3 = gameOverDiv.querySelector("h3");
const restartBtn = gameOverDiv.querySelector(".restart");
const allSymbols = document.querySelectorAll(".symbol > img");
const attempt = document.querySelector(".attempt");
const endResult = document.getElementsByClassName('end-result')[0];

gameOverDiv.style.display = "";
let currentRowNum = 0;

const symbols = [
	{ name: "srce", imgSrc: "assets/srce.png" },
	{ name: "skocko", imgSrc: "assets/skocko.png" },
	{ name: "pik", imgSrc: "asserts/pik.png" },
	{ name: "tref", imgSrc: "assets/tref.png" },
	{ name: "karo", imgSrc: "assets/karo.png" },
	{ name: "zvezda", imgSrc: "assets/zvezda.png" },
];

restartBtn.addEventListener("click", restart);
const combination = randomize();
start();

function start() {
	currentRowNum++;
	for (const symbol of allSymbols) {
		symbol.addEventListener("click", insertSymbol);
	}
};

function randomize() {
	let copyArray = [...symbols];
	// shuffle index possition
	let rand = [];
	for (let i = 0; i < 4; i++) {
		rand.push(Math.floor(Math.random() * copyArray.length));
	}
	// combination
	let combination = [];
	for (let i = 0; i < 4; i++) {
		combination.push(copyArray[rand[i]].name); // from rand array pull out el
	}
	return combination;
};

function insertSymbol() {
	if(attempt.querySelector(".row6").children.length === 3) {
		loose();
	}
	if (attempt.querySelector(".row" + currentRowNum).children.length < 4) {
		let image = document.createElement("img");
		image.setAttribute("src", this.getAttribute("src"));
		image.setAttribute("data-name", this.getAttribute("data-name"));
		let div = document.createElement("div");
		div.appendChild(image);
		attempt.querySelector(".row" + currentRowNum).appendChild(div);
		div.onclick = function () {
			this.remove();
		};
	}
	if (attempt.querySelector(".row" + currentRowNum).children.length == 4) {
		const arr = [
			...attempt.querySelector(".row" + currentRowNum).children,
		];
		const newArr = [];
		for (const item of arr) {
			newArr.push(item.firstChild.getAttribute("data-name"));
		}
		attempt.querySelector(".row" + currentRowNum).classList.add("disabled");
		currentRowNum++;
		checkCombination(newArr);
	}
};

function checkCombination(arg) {
	// array with user attempt
	const userAttempt = arg;
	const currentCombo = [];

	for (let i = 0; i < 4; i++) {
		if (combination[i] === userAttempt[i]) {
			currentCombo.push('<div class="red"></div>');
			userAttempt.splice(i, 1, "izbrisano");
		} else if (userAttempt.includes(combination[i])) {
			currentCombo.push('<div class="yellow"></div>');
		} else {
			currentCombo.push('<div class"none"></div>');
		}
	}

	const redCircle = [];
	const yellowCircle = [];
	const whiteCircle = [];

	currentCombo.forEach((el) => {
		if (el === '<div class="red"></div>') {
			redCircle.push(el);
		} else if (el === '<div class="yellow"></div>') {
			yellowCircle.push('<div class="yellow"></div>');
		} else {
			whiteCircle.push('<div class="none"></div>');
		}
	});
	const final = [...redCircle, ...yellowCircle, ...whiteCircle];

	if (final.length === 4) {
		let row = document.querySelector(
			".results .row" + (currentRowNum - 1)
		);
		for (const item of final) {
			row.innerHTML += item;
		}
		if(final.every((el) => {
			return el === '<div class="red"></div>';
		})){
			winner();
		}
	}
};

function winner() {
	setTimeout(() => {
		gameOverDiv.style.display = "flex";
		h3.innerText = "You won!"
	},300)
}

function loose() {
	for (const symbol of allSymbols) {
		symbol.removeEventListener("click", insertSymbol);
	};
	let res = "";
	combination.forEach(item => {
		res +=`<div><img src="./assets/${item}.png"/></div>`;
	});
	endResult.innerHTML = res;
	setTimeout(() => {
		h3.innerText = "You lost.";
		gameOverDiv.style.display = "flex";
	}, 300)
}

function restart() {
	window.location.reload();
}