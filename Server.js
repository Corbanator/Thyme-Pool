const Simulate = require("simulate")
const gridRatio = .5;
const frametime = 1/60;
const simTime = 30;
const gridWidth = 1000;
const gridHeight = gridWidth * .5;
var bigArray = new Array();
/*var ballSet = {
    pos:[
    {
        x:0,
        y:0,
        vX:20,
        vY:20,
        color:{
            h:60,
            s:50,
            l:50
        },
        radius: 10,
        mass: 1
    }],
    time:0
}
*/
/*function generateBalls(){
    let ballSet = {
        pos:[],
        time:0
    }
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
            ballSet.pos.push({
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
    return ballSet;
}*/

function generateBalls(){
    let ballSet = {
        time:0,
        pos:[]
    };
    ballSet.pos.push({
        x:100,
        y:100,
        vX:0,
        vY:0,
        color:{
            h:50,
            s:50,
            l:50
        },
        mass:5,
        radius:10
    })
    return ballSet;
}


function getRoomCode(){
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    var text = "";
    for(i =0; i<12;i++){
        text+=possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var exists = false;
    for(i=0;i<bigArray.length;i++){
        if(bigArray[i].Code == text){
            exists = true;
        }
    }
    if(!exists){
        return text;
    } else{
        return getRoomCode();
    }
}

function cleanseSims(array){
    result = new Array();
    array.forEach(element => {
        newResult = Object.assign({},element);
        delete newResult.Sim;
        result.push(newResult);
    });
    return result;
}

const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/Client"));
app.use(cors({
    origin:['http://127.0.0.1:5173','http://127.0.0.1:5174','http://growtobe.me:5174',
    'http://growtobe.me:5173','http://dev.growtobe.me:5173','http://dev.growtobe.me:5174'
    ,'http://108.61.85.163:5173','http://108.61.85.163:5174']
}))

app.post("/Room", (req, res) => {
    let ballSet = generateBalls();
    var newRoom = 
    {
        Code: getRoomCode(),
        Sim: Simulate.simulate(frametime,simTime,ballSet,ballSet,new Array(),gridWidth,gridWidth * gridRatio),
        player1:"N/A",
        player2:"N/A",
        roomName:"Test",
        turn:1,
        forces:[],
        ballSet:ballSet
    }
    bigArray.push(newRoom);
    res.status(201);
    res.json({
        Code:newRoom.Code
    })
})

function reSim(room){
    returnSim = Simulate.simulate(frametime, simTime, room.ballSet, room.ballSet, room.forces, gridWidth, gridWidth * gridRatio);
    return returnSim;
}

app.get("/Room", (req, res) => {
        res.status(200);
        res.end(JSON.stringify(cleanseSims(bigArray)));
        console.log(req);
        //res.end(JSON.stringify(bigArray));

})

app.get("/",(req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "Client/MainPage.html"));
})


app.listen(port);
var nextID = 0;
const clients = new Array();
const { Server } = require('ws');
const wss = new Server({ port:(port+1) });
wss.on('connection', (ws)=>{
    console.log("client connected");
    clients.push({
        client:ws,
        ID:nextID
    })
    nextID++;
    ws.on('message', (message) =>{
        let data = JSON.parse(message.toString());
        console.log(data);
        id = clients.find(item => item.client == ws).ID;
        switch (data.type) {
            case 'join':
                console.log(bigArray.find(room => room.Code === data.room));
                
                let player = 0;
                if(!(bigArray.find(room => room.Code === data.room).player1 >0)){
                    bigArray.find(room => room.Code === data.room).player1 = id;
                    clients.find(item => item.client == ws).player = 1;
                } else{
                    bigArray.find(room => room.Code === data.room).player2 = id;
                    clients.find(item => item.client == ws).player = 2;
                }
                let returnSim = bigArray.find(room => room.Code === data.room).Sim;
                clients.find(item => item.client == ws).ROOM = data.room;
                ws.send(JSON.stringify({type:'join-confirmation', sim:returnSim, player:clients.find(item => item.client == ws).player, turn:1}));
                break;
            case 'action':
                let force = {type: data.actionType, magnitude:data.magnitude, target:data.target, direction:data.direction, frame:data.frame}
                bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).forces.push(force);
                bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).Sim = reSim(bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM));
                switch (bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).turn) {
                    case 1:
                        bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).turn = 2;
                        break;
                    case 2:
                        bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).turn = 1;
                        break;
                    default:
                        break;
                }
                //ws.send(JSON.stringify({type:'new-sim',sim:bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).Sim,turn:bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).turn}));
                for(let i = 0; i<clients.length; i++){
                    if(clients[i].ROOM == clients.find(item => item.client == ws).ROOM){
                        clients[i].client.send(JSON.stringify({type:'new-sim',sim:bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).Sim,turn:bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).turn}));
                    }
                }
                break;
            default:
                break;
        }

    });

    ws.on("disconnect", (message)=>{
        if(clients.find(item => item.client == ws).player == 1){bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).player1 = null}
        else{bigArray.find(room => room.Code === clients.find(item => item.client == ws).ROOM).player2 = null}
        
    })
});



