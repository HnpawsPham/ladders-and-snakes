const board = document.getElementById("main")
const nextBtn = document.getElementById("next-btn");
const resultBtn = document.getElementById("result-btn");
const wheel = document.getElementById("inside");
const spinBtn = document.getElementById("spin-btn");
const wheelNumbers = wheel.querySelectorAll("span");
const container = document.getElementById("container");
container.classList.add("hidden");
const noti = document.getElementById("noti");
noti.classList.add("hidden");

// NOTIFICATION
function visibleNoti(content, milisec){
    noti.classList.remove("hidden");
    noti.innerHTML = content;

    setTimeout(function(){
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

        values[i].min = (i != "0") ? values[i - 1].max + 0.1 : 0;

        values[i].max = deg * (parseInt(i) + 1);
    }
}
loadGiftsInfo()

let gamePrice = 10;
let quantity = values.length;
let res;

function spin(){
    let randomres = Math.floor(Math.random() * quantity);

    let max = values[randomres].max;
    let min = values[randomres].min;
    res = values[randomres].steps;

    let spinDeg = Math.floor(Math.random() * (max - min + 0.1)) + min;

    // ROTATE THE WHEEL
    wheel.style.transform = `rotate(-${3600 + (spinDeg - deg / 2)}deg)`;
}

// TELEPORT GATES AND LADDERS
let cur = 0;
let blocks = []

function loadBlocks(id){
    let block = document.createElement("div");
    block.classList.add("block");
    block.id = id;

    if(id % 2 == 0) block.classList.add("blue")
    else block.classList.add("cyan")

    let num = document.createElement("p");
    num.innerHTML = id;
    block.appendChild(num);

    board.appendChild(block);
    blocks.push(block);
}

let fr = 50;
let to = 40;

while(fr > 9){
    for(let i = fr; i > to; i--) loadBlocks(i);
    fr -= 10; to -= 10;
    for(let i = to + 1; i <= fr; i++) loadBlocks(i);
    fr -= 10; to -= 10;
}

board.innerHTML += `<div id="players">
                    <div style="left: 90%; top:77%; z-index: 6;" class="player"><img src="./assets/c1.png" alt=""></div>
                    <div style="left:87%; top: 72%;" class="player"><img src="./assets/c2.png" alt=""></div>
                    <div style="left: 86%; top: 80%;" class="player"><img src="./assets/c3.png" alt=""></div>
                    </div>`

console.log(blocks[2].getBoundingClientRect().left)

nextBtn.addEventListener("click", function(){
    container.classList.remove("hidden");
})

let players = document.getElementsByClassName("player");
players[cur].classList.add("chosen");
let playerPos = [1,1,1];

function movePlayer(){
    playerPos[cur] += res;
    let pos = playerPos[cur];
    let id = parseInt(blocks[pos].id);

    let x = id % 10 + (10 * (id == 0));
    let y = Math.ceil(id/10);
    x *= 10;
    y *= 15;

    players[cur].style.position = 'absolute';
    players[cur].style.left = `${x}%`;
    players[cur].style.top = `${y}%`;

 
    players[cur].classList.remove("chosen");
    cur = (cur + 1) % 3;
    players[cur].classList.add("chosen");
}

spinBtn.addEventListener("click", async function () {
    spin();

    while(res == 6){
        wheel.addEventListener("transitionend", async function(){
            visibleNoti(`Go ahead ${res} step(s)`, 2000);
            await sleep(2000);
            visibleNoti("EXTRA ROLL!", 1500);
            await sleep(1500);
        })
    
        spin();
    }
    wheel.addEventListener("transitionend", async function(){
        visibleNoti(`Go ahead ${res} step(s)`, 2000);
        await sleep(2000);
        container.classList.add("hidden");
        wheel.style.transform = `rotate(0deg)`;

        movePlayer();
    })
})