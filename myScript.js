import {newFrame} from "./Simulate.js"
const canvas = document.getElementById("Main");
const ctx = canvas.getContext("2d");

var items = new Array;
/*items.push({
    x:40,
    y:30,
    color:{
        r:0,
        g:0,
        b:255,
        a:1
    },
    vX: 5,
    vY: 5,
    mass:1,
    radius:10
});
items.push({
    x:300,
    y:40,
    color:{
        r:100,
        g:100,
        b:100,
        a:1
    },
    vX:3,
    vY:4,
    mass:2,
    radius:20
});
items.push({
    x:300,
    y:90,
    color:{
        r:255,
        g:0,
        b:0,
        a:1
    },
    vX:7,
    vY:3,
    mass:3,
    radius:30
});
items.push({
    x:90,
    y:100,
    color:{
        r:0,
        g:100,
        b:0,
        a:1
    },
    vX:2,
    vY:10,
    mass:5,
    radius:10
});
items.push({
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
function simulate(frametime, startballs, forcelist, endtime,){
    result = new Array;
    result.push(startballs);
    frameNum = 0;
    for(t=frametime; t< endtime; t += frametime){
        newFrame = {
            time:t,
            balls:new Array
        }
        for(i=0;i<startballs.length;i++){
            
        }


        frameNum++;
    }
}

function draw(ball) {
    ctx.fillstyle = rgba(ball.color.r, ball.color.g, ball.color.b, ball.color.a);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, 0);
    ctx.fill();
}

function drawFrame(frame, ballSet){
    for (var i = 0; i < ballSet.length; i++){
        ctx.fillStyle = "rgba(" + ballSet[i].color.r + "," + ballSet[i].color.g + "," + ballSet[i].color.b + "," + ballSet[i].color.a + ")";
        ctx.beginPath();
        ctx.arc(frame.pos[i].x, frame.pos[i].y, ballSet[i].radius, 0, Math.PI * 2, 0);
        ctx.fill();
    }
}
var frame = {
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
*/
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        var nframe = newFrame(frame, deltaTime,items, new Array,canvas.clientWidth, canvas.clientHeight);
        drawFrame(nframe, items);
        frame = nframe;

}

start();