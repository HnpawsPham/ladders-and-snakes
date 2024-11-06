const board = document.getElementById("main")
const nextBtn = document.getElementById("next-btn");
const wheel = document.getElementById("inside");
const spinBtn = document.getElementById("spin-btn");
const skipBtn = document.getElementById("skip-btn");
const wheelNumbers = wheel.querySelectorAll("span");
const container = document.getElementById("container");
container.classList.add("hidden");
const noti = document.getElementById("noti");
noti.classList.add("hidden");

// NOTIFICATION
function visibleNoti(content, milisec) {
    noti.classList.remove("hidden");
    noti.innerHTML = content;

    setTimeout(function () {
        noti.classList.add("hidden");
    }, milisec)
}

// WHEEL
const values = [
    { steps: 1, min: 0, max: 0, },
    { steps: 2, min: 0, max: 0, },
    { steps: 3, min: 0, max: 0, },
    { steps: 4, min: 0, max: 0, },
    { steps: 5, min: 0, max: 0, },
    { steps: 6, min: 0, max: 0, },
];
const sleep = ms => new Promise(r => setTimeout(r, ms));
let deg = 60;

// LOAD STEPSS ON WHEEL, LOAD MIN AND MAX DEGREE OF GIFTS
function loadGiftsInfo() {
    for (let i in values) {
        wheelNumbers[i].innerHTML = values[i].steps;

        values[i].min = (i != "0") ? values[i - 1].max + 1 : 0;

        values[i].max = deg * (parseInt(i) + 1);
    }
}
loadGiftsInfo()

let spinTimes = 10;
let quantity = values.length;
let res = 0;
let first = true;

function spin() {
    if(!first) movePlayer();
    first = false;

    let randomres = Math.floor(Math.random() * quantity);

    let max = values[randomres].max;
    let min = values[randomres].min;
    res += values[randomres].steps;

    let spinDeg = Math.floor(Math.random() * (max - min + 1)) + min;

    // ROTATE THE WHEEL
    wheel.style.transform = `rotate(-${360 * spinTimes + Math.floor(spinDeg - deg / 2)}deg)`;
    spinTimes += 10;
}

// TELEPORT GATES AND LADDERS
let blocks = []

function loadBlocks(id) {
    let block = document.createElement("div");
    block.classList.add("block");
    block.id = id;

    if (id % 2 == 0) block.classList.add("blue")
    else block.classList.add("cyan")

    let num = document.createElement("p");
    num.innerHTML = id;
    block.appendChild(num);

    board.appendChild(block);
    blocks.push(block);
}

let fr = 50;
let to = 40;

while (to >= 0) {
    for (let i = fr; i > to; i--) loadBlocks(i);
    if (to < 1) break;
    fr -= 10; to -= 10;
    for (let i = to + 1; i <= fr; i++) loadBlocks(i);
    fr -= 10; to -= 10;
}

board.innerHTML += `<div id="players">
                    <div style="left: 92%; bottom:3%; z-index: 6;" class="player"><img src="./assets/c1.png" alt=""></div>
                    <div style="left:87%; bottom: 5%;" class="player"><img src="./assets/c2.png" alt=""></div>
                    <div style="left: 84%; bottom: 1%;" class="player"><img src="./assets/c3.png" alt=""></div>
                    </div>`

console.log(blocks[2].getBoundingClientRect().left)

nextBtn.addEventListener("click", function () {
    container.classList.remove("hidden");
    console.log(playerPos);
})

let cur = 0;
let players = document.getElementsByClassName("player");
players[cur].classList.add("chosen");
let playerPos = [1, 1, 1];

let isMoving = false;

players[cur].addEventListener("click", function () {
    isMoving = !isMoving; 
});

document.addEventListener("mousemove", function (event) {
    players[cur].addEventListener("click", function () {
        isMoving = !isMoving; 
    });
    
    if (isMoving) {
        let mX = event.clientX;
        let mY = event.clientY;

        players[cur].style.position = "absolute";
        players[cur].style.margin = "0";
        players[cur].style.top = mY - players[cur].getBoundingClientRect().height * 1.5 + "px";
        players[cur].style.left = mX - players[cur].getBoundingClientRect().width * 2 + "px";
    }
});


function movePlayer(move) {
    let pos = playerPos[cur] + res;
    playerPos[cur] = pos;
    players[cur].classList.remove("chosen");
    cur = (cur + 1) % 3;
    players[cur].classList.add("chosen");
}

async function handleSpin() {
    spin();
    await sleep(3000);

    if (res % 6 == 0) {
        visibleNoti(`Go ahead ${res} step(s)`, 2000);
        await sleep(2000);

        visibleNoti("EXTRA ROLL!", 1500);
        await sleep(1500);
    }
    else {
        visibleNoti(`Go ahead ${res} step(s)`, 2000);
        await sleep(2000);
        container.classList.add("hidden");
        res = 0;
    }
}

spinBtn.addEventListener("click", handleSpin);

// SKIP HANDLE
skipBtn.addEventListener("click", function () {
    visibleNoti("Skill issues 🤡", 2000);
    first = true;
    players[cur].classList.remove("chosen");
    cur = (cur + 2) % 3;
    players[cur].classList.add("chosen");
})