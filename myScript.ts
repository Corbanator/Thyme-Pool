import {newFrame} from "./Simulate.js"
import {simulate} from "./Simulate.js"
const canvas:HTMLCanvasElement = document.getElementById("Main");
const ctx = canvas.getContext("2d");
const scale = 1;
var mouseDown = false;
const scrub = document.getElementById("scrubber");
const bar = document.getElementById("bar");
var gravity = 0;
var width;
var ratio = .5;
var gridWidth = 1000;
var gridHeight = gridWidth * ratio;
var gridDensity;
var barRatio = .05;
const vidBar = document.getElementById("vidBar");

function getWidth(element){
    var cs = getComputedStyle(element);

var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

// Element width and height minus padding and border
var elementWidth = element.offsetWidth - paddingX - borderX;
//var elementHeight = element.offsetHeight - paddingY - borderY;
return elementWidth;
}


bar.onmousedown = (e) => {
    console.log("click");
    mouseDown = true;
    update(e);
}

document.onmouseup = (e) => {
    console.log("unclick");
    mouseDown = false;
}

var items = {time:0, pos: new Array};

for(var i = 20; i< gridWidth - 20; i+=40){
    for(var j = 20; j< gridHeight - 20; j+= 40){
        var direction = Math.random() * 2 * Math.PI;
        var magnitude = Math.random() * 200;
        var vX = Math.cos(direction) * magnitude;
        var vY = Math.sin(direction) * magnitude;
        var red = Math.round(Math.random() * 255);
        var blue = Math.round(Math.random() * 255);
        var green = Math.round(Math.random() * 255);
        var radius = Math.round(Math.random() * 10 + 5);

        items.pos.push({
            x:i,
            y:j,
            vX:vX,
            vY:vY,
            color:{
                r:red,
                g:green,
                b:blue,
                a:1
            },
            mass:radius/5,
            radius:radius
        })
    }
}
/*items.push({
    x:400,
    y:300,
    color:{
        r:0,
        g:0,
        b:255,
        a:.2
    },
    vX:0,
    vY:0,
    mass:.5,
    radius:100
});*/
/*items.pos.push({
    x:400,
    y:300,
    color:{
        r:0,
        g:0,
        b:255,
        a:.2
    },
    vX:0,
    vY:0,
    mass:.5,
    radius:100
})
items.pos.push({
    x:500,
    y:300,
    color:{
        r:0,
        g:255,
        b:0,
        a:.2
    },
    vX:0,
    vY:0,
    mass:.5,
    radius:100
})*/
function moveBall(ball) {
    ball.x += (ball.velocity * Math.cos((ball.direction/180)*Math.PI))
    ball.y += (ball.velocity * Math.sin((ball.direction/180)*Math.PI))
}

function applyForce(ball, force){
    magnitude = force.magnitude/ball.mass;
    x = (ball.velocity * Math.cos((ball.direction / 180)*Math.PI)) + (magnitude * Math.cos((force.direction/180)*Math.PI));
    y = (ball.velocity * Math.csin((ball.direction / 180)*Math.PI)) + (magnitude * Math.sin((force.direction/180)*Math.PI));
    newBall = ball;
    newBall.velocity = Math.sqrt(x*x+y*y);
    newBall.direction = ((Math.atan2(y,x)*180)/Math.PI);
    return newBall;
}

function draw(ball) {
    ctx.fillstyle = rgba(ball.color.r, ball.color.g, ball.color.b, ball.color.a);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, 0);
    ctx.fill();
}

function drawFrame(frame, ballSet){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (var i = 0; i < ballSet.pos.length; i++){
        ctx.fillStyle = "rgba(" + ballSet.pos[i].color.r + "," + ballSet.pos[i].color.g + "," + ballSet.pos[i].color.b + "," + ballSet.pos[i].color.a + ")";
        ctx.beginPath();
        ctx.arc(frame.pos[i].x * gridDensity, frame.pos[i].y * gridDensity, ballSet.pos[i].radius * gridDensity, 0, Math.PI * 2, 0);
        var m = 5;
        ctx.fill();
    }
}
var frame = {
    time: 0,
    pos:items
};

/*var lastTime = new Date().getTime();
var deltaTime;
function gameLoop (timeStamp){
    var deltaTime = 0;
    deltatime = (timeStamp - lastTime)/1000;
    lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        nframe = newFrame(frame, deltaTime,items, new Array,canvas.clientWidth, canvas.clientHeight);
        drawFrame(nframe);
        frame = nframe;
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
*/
/*function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

        ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
        var nframe = newFrame(frame, deltaTime,items, new Array,canvas.clientWidth, canvas.clientHeight);
        drawFrame(nframe, items);
        frame = nframe;

}

start();*/

const playButton = document.getElementById("play-button");
const play = document.getElementById("play");

var playButtonPos;
const simTime = 120;
var frameTime = 1/60;
var frameCount = (simTime)/frameTime;
var simulation = simulate(frameTime, simTime, items, new Array,  gridWidth, gridHeight)

var scrubPos = scrub.getBoundingClientRect();
var barPos = bar.getBoundingClientRect();
var percentageDifference = (barPos.width - scrubPos.width)/barPos.width;
var mousePosX;
var frameNum = 0;
var vidBarPos;
const prog = document.getElementById("progress");

function resizeCanvas(){
    width = getWidth(document.body);
    canvas.setAttribute("width", width * scale + "px");
    canvas.setAttribute("height", width * scale * ratio + "px");
    gridDensity = (width * scale)/gridWidth;
    vidBarPos = vidBar.getBoundingClientRect();
    playButtonPos = playButton.getBoundingClientRect();
    bar.style.width = vidBarPos.width - (playButtonPos.width) + "px";
    scrubPos = scrub.getBoundingClientRect();
    barPos = bar.getBoundingClientRect();
    percentageDifference = (barPos.width - scrubPos.width)/barPos.width;
    drawFrame(simulation.frames[frameNum], items);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.onmousemove = (e) => {
    update(e);
}
function update(e){
    if(mouseDown){
        console.log("moved");
        var percent = 100 * ((e.x - barPos.left - (.5*scrubPos.width)) / (barPos.width * percentageDifference));
        mousePosX = e.x;
        if(percent <= 0){
            percent = 0;
        } else if(percent >= 100){
            percent = 100;
        };
        
        scrub.style.left = (percent * percentageDifference) + "%";
        prog.style.width = (percent * percentageDifference) + (percentageDifference) + "%";
        frameNum = Math.round((percent/100) * frameCount);
        drawFrame(simulation.frames[frameNum], simulation.ballSet);
    }
}
var playing = false;
playButton.addEventListener("click", playPause);

function playPause(){
    if(playing == false){
        playing = true;
        document.getElementById("play").setAttribute("src","Icons/pause-solid.svg");
        var time = simulation.frames[frameNum].time;
        changeFrame();
    } else {
        playing = false;
        document.getElementById("play").setAttribute("src","Icons/play-solid.svg");
    }
}

var playbackSpeed = 1;
function changeFrame(){
    if(playing == false){
        document.getElementById("play").setAttribute("src","Icons/play-solid.svg");
    } else {
        
        frameNum +=1;
        drawFrame(simulation.frames[frameNum], items);
        var percent = 100 * (frameNum/frameCount);
            if(percent <= 0){
                percent = 0;
            } else if(percent >= 100){
                percent = 100;
            };
        scrub.style.left = (percent * percentageDifference) + "%";
        prog.style.width = (percent * percentageDifference) + (percentageDifference) + "%";
        if(frameNum >= frameCount){
            playing = false;
        }
        setTimeout(requestAnimationFrame(changeFrame), (1000/frameTime)/playbackSpeed);
    }
}

/*function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    if(mouseDown){
        requestAnimationFrame(update);
    }
    scrub.setAttribute("left", )

}

start();*/