function getDistance(x1, y1, x2, y2){
    return Math.sqrt((Math.pow((x1-x2),2)) + (Math.pow((y1-y2),2)))
}
const canvas = document.getElementById("Main");
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
var loading = false;

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
    clicking = false;
    selected = -1;
}

var items = {time:0, pos: new Array};

for(var i = 20; i< gridWidth - 20; i+=40){
    for(var j = 20; j< gridHeight - 20; j+= 40){
        var direction = Math.random() * 1 * Math.PI;
        var magnitude = Math.random() * 200;
        var vX = Math.cos(direction) * magnitude;
        var vY = Math.sin(direction) * magnitude;
        var hue = Math.round(Math.random() * 355);
        //var sat = Math.round(Math.random() * 100);
        //var light = Math.round(Math.random() * 100);
        var sat = 50;
        var light = 50;
        var radius = Math.round(Math.random() * 10 + 5);
        var mass = Math.round(Math.random() * 10 + 1);
        items.pos.push({
            x:i,
            y:j,
            vX:vX,
            vY:vY,
            color:{
                h:hue,
                s:light,
                l:sat,
            },
            mass:mass,
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


function draw(ball) {
    ctx.fillstyle = rgba(ball.color.r, ball.color.g, ball.color.b, ball.color.a);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, 0);
    ctx.fill();
}

function drawFrame(frame, ballSet, selectionNum){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (var i = 0; i < ballSet.pos.length; i++){
        var toAdd = 0;

        ctx.fillStyle = "hsl(" + ballSet.pos[i].color.h + "," + ballSet.pos[i].color.s + "%," + (ballSet.pos[i].color.l + toAdd) + "%)";
        ctx.beginPath();
        ctx.arc(frame.pos[i].x * gridDensity, frame.pos[i].y * gridDensity, ballSet.pos[i].radius * gridDensity, 0, Math.PI * 2, 0);
        var m = 5;
        ctx.fill();
    }
    if(selectionNum>=0 && clicking != true){
            toAdd = 20;
            var gradient = ctx.createRadialGradient(frame.pos[selectionNum].x*gridDensity, frame.pos[selectionNum].y * gridDensity, ballSet.pos[selectionNum].radius * gridDensity,frame.pos[selectionNum].x*gridDensity, frame.pos[selectionNum].y * gridDensity, ballSet.pos[selectionNum].radius * gridDensity * 3);
            gradient.addColorStop(0,"hsl(" + ballSet.pos[selectionNum].color.h + "," + ballSet.pos[selectionNum].color.s + "%," + (ballSet.pos[selectionNum].color.l + toAdd) + "%)");
            gradient.addColorStop(1,"hsla(" + ballSet.pos[selectionNum].color.h + "," + ballSet.pos[selectionNum].color.s + "%," + (ballSet.pos[selectionNum].color.l + toAdd) + "%, 0)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(frame.pos[selectionNum].x * gridDensity, frame.pos[selectionNum].y * gridDensity, ballSet.pos[selectionNum].radius * gridDensity * 3, 0, Math.PI * 2, 0);
            ctx.fill();
        ctx.fillStyle = "hsl(" + ballSet.pos[selectionNum].color.h + "," + ballSet.pos[selectionNum].color.s + "%," + (ballSet.pos[selectionNum].color.l + toAdd) + "%)";
        ctx.beginPath();
        ctx.arc(frame.pos[selectionNum].x * gridDensity, frame.pos[selectionNum].y * gridDensity, ballSet.pos[selectionNum].radius * gridDensity, 0, Math.PI * 2, 0);
        var m = 5;
        ctx.fill();
    }

    if(clicking && selected >=0){
        var canPos = canvas.getBoundingClientRect();
        drawArrow((mousePosX - canPos.x)/gridDensity, (mousePosY - canPos.y)/gridDensity, simulation.frames[frameNum].pos[selected].x,simulation.frames[frameNum].pos[selected].y );
        
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
var simulation;
worker.postMessage({
    dTime:frameTime,
    simTime:simTime,
    ballSet:items,
    frame1:items,
    forces: new Array,
    frameWidth:gridWidth,
    frameHeight:gridHeight
});
loading = true;

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
    drawFrame(simulation.frames[frameNum], items, -1);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
var mousePosY
document.onmousemove = (e) => {
    mousePosX = e.x;
    mousePosY = e.y;
    update(e);
}
function update(e){
    if(mouseDown && !loading){
        console.log("moved");
        var percent = 100 * ((e.x - barPos.left - (.5*scrubPos.width)) / (barPos.width * percentageDifference));
        if(percent <= 0){
            percent = 0;
        } else if(percent >= 100){
            percent = 100;
        };
        
        scrub.style.left = (percent * percentageDifference) + "%";
        prog.style.width = (percent * percentageDifference) + (percentageDifference) + "%";
        frameNum = Math.round((percent/100) * frameCount);
        drawFrame(simulation.frames[frameNum], simulation.ballSet, -1);
    }
}
var playing = false;
playButton.addEventListener("click", playPause);
var pausePos = new Array;
function playPause(){
    if(!loading){
        if(playing == false){
            playing = true;
            document.getElementById("play").setAttribute("src","Icons/pause-solid.svg");
            var time = simulation.frames[frameNum].time;
        } else {
            playing = false;
            document.getElementById("play").setAttribute("src","Icons/play-solid.svg");
        }
    }
}

var playbackSpeed = 1;
function changeFrame(){
    if(loading){
        drawLoad(loadFrame)
        requestAnimationFrame(changeFrame);
    }
    else if(playing == false){
        pausePos = new Array;
        var canPos = canvas.getBoundingClientRect();
        for (i = 0; i< items.pos.length; i++){
            pausePos.push(
                {
                    radius:items.pos[i].radius,
                    x:simulation.frames[frameNum].pos[i].x * gridDensity + canPos.x,
                    y:simulation.frames[frameNum].pos[i].y * gridDensity + canPos.y,
                }
            )
        }
        var toHighlight;
        for(i = 0; i<pausePos.length; i++){
            if(getDistance(mousePosX, mousePosY, pausePos[i].x, pausePos[i].y) < pausePos[i].radius * gridDensity){
                toHighlight = i;
                break;
            }
        }
        drawFrame(simulation.frames[frameNum], items, toHighlight);
        toHighlight = -1;
        requestAnimationFrame(changeFrame);
    } else {
        
        frameNum +=1;
        drawFrame(simulation.frames[frameNum], items, -1);
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

changeFrame();

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
var selected;
var clicking;
canvas.onmousedown = startArrow;
function startArrow(){
    if(playing == false)
    clicking = true;
    console.log("clickity click");
    pausePos = new Array;
    var canPos = canvas.getBoundingClientRect();
    for (i = 0; i< items.pos.length; i++){
        pausePos.push(
            {
                radius:items.pos[i].radius,
                x:simulation.frames[frameNum].pos[i].x * gridDensity + canPos.x,
                y:simulation.frames[frameNum].pos[i].y * gridDensity + canPos.y,
            }
        )
    }
    var toHighlight;
    for(i = 0; i<pausePos.length; i++){
        if(getDistance(mousePosX, mousePosY, pausePos[i].x, pausePos[i].y) < pausePos[i].radius * gridDensity){
            toHighlight = i;
            break;
        }
    }
    selected = toHighlight
}

function drawArrow(fromx, fromy, tox, toy){
    //variables to be used when creating the arrow
    const scale = .005 * getDistance(fromx,fromy,tox,toy);
    const width = 22 * gridDensity * scale;
    var headlen = 10* gridDensity * scale;
    fromx = fromx * gridDensity;
    tox = tox * gridDensity;
    fromy = fromy * gridDensity;
    toy = toy * gridDensity;
    // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
    var angle = Math.atan2(toy-fromy,tox-fromx);
    tox -= Math.cos(angle) * ((width*1.15));
    toy -= Math.sin(angle) * ((width*1.15));

    
    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = width;
    ctx.stroke();
    
    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
    
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
    
    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.fillStyle = "#cc0000";
    ctx.fill();
}
var forceList = [];

var worker = new Worker("Simulate.js");
function applyForce(target, magnitude, direction){
    var force = {
        magnitude:magnitude,
        direction:direction,
        target:target,
        frame:frameNum
    }

    forceList.push(force);
    var e = {
        dTime:frameTime,
        simTime:simTime-simulation.frames[frameNum].time,
        ballSet:items,
        frame1:simulation.frames[frameNum],
        type:"new",
        frameWidth:gridWidth,
        frameHeight:gridHeight
    }

    worker.postMessage(e);
    loading = true;

}

self.addEventListener("message", function(e){
    if(e.type == "Original"){
        simulation = e;
    } else {
        simulation.frames.splice(frameNum, simulation.frames.length - frameNum);
        simulation.frames.concat(e.frames);
    }
    loading = false;
});