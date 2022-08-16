import {newFrame} from "./Simulate.js"
import {simulate} from "./Simulate.js"
const canvas = document.getElementById("Main");
const ctx = canvas.getContext("2d");

function getWidth(element){
    var cs = getComputedStyle(element);

var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

// Element width and height minus padding and border
var elementWidth = element.offsetWidth - paddingX - borderX;
var elementHeight = element.offsetHeight - paddingY - borderY;
return elementWidth;
}

const width = getWidth(document.body);
const height = window.innerHeight;
const scale = 1;
canvas.setAttribute("width", width * scale + "px");
canvas.setAttribute("height", width * scale * .5 + "px");
var gravity = 0;
const bar = document.getElementById("bar");
bar.setAttribute("width", width * scale + "px");

var mouseDown = false;
const scrub = document.getElementById("scrubber");
scrub.onmousedown = (e) => {
    console.log("click");
    mouseDown = true;
}

document.onmouseup = (e) => {
    console.log("unclick");
    mouseDown = false;
}

var items = {time:0, pos: new Array};
for(var i = 20; i< canvas.width - 20; i+=40){
    for(var j = 20; j< canvas.height - 20; j+= 40){
        var direction = Math.random() * 2 * Math.PI;
        var magnitude = Math.random() * 5;
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
            mass:1,
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
        ctx.arc(frame.pos[i].x, frame.pos[i].y, ballSet.pos[i].radius, 0, Math.PI * 2, 0);
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

const simTime = 120;
var frameTime = 1/60;
var frameCount = (simTime)/frameTime;
var simulation = simulate(frameTime, simTime, items, new Array,  canvas.clientWidth, canvas.clientHeight)

const scrubPos = scrub.getBoundingClientRect();
const barPos = bar.getBoundingClientRect();
const percentageDifference = (barPos.width - scrubPos.width)/barPos.width;
var mousePosX;
drawFrame(simulation.frames[0], items);
document.onmousemove = (e) => {
    if(mouseDown){
        console.log("moved");
        var percent = 100 * ((e.x-barPos.left - (.5 * scrubPos.width)) / (barPos.width * percentageDifference));
        mousePosX = e.x;
        if(percent <= 0){
            percent = 0;
        } else if(percent >= 100){
            percent = 100;
        };
        
        scrub.style.left = (percent * percentageDifference) + "%";
        var frameNum = Math.round((percent/100) * frameCount);
        drawFrame(simulation.frames[frameNum], simulation.ballSet);
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