export function applyForce(ball, force){
    magnitude = force.magnitude/ball.mass;
    x = (ball.velocity * Math.cos((ball.direction / 180)*Math.PI)) + (magnitude * Math.cos((force.direction/180)*Math.PI));
    y = (ball.velocity * Math.csin((ball.direction / 180)*Math.PI)) + (magnitude * Math.sin((force.direction/180)*Math.PI));
    newBall = ball;
    newBall.velocity = Math.sqrt(x*x+y*y);
    newBall.direction = ((Math.atan2(y,x)*180)/Math.PI);
    return newBall;
}

export function getDistance(x1, y1, x2, y2){
    return Math.sqrt((Math.pow((x1-x2),2)) + (Math.pow((y1-y2),2)))
}



export function newFrame(frame, dTime, ballSet, forces, frameWidth, frameHeight) {
    function mapBall(ball){
        var ball2 = {x:0, y:0, vX:0, vY:0};
        ball2.x = ball.vX * (dTime) + ball.x;
        ball2.y = ball.vY * (dTime) + ball.y;
        ball2.vX = ball.vX;
        ball2.vY = ball.vY;
        return ball2;
    }
    
    var result = {time: frame.time + dTime,
    pos:frame.pos.map(mapBall)
    };

    for(var i = 0;i<forces.length;i++){
        result.pos[forces[i].target].vX += forces[i].magnitude * Math.cos((forces[i].direction/180) * Math.PI)
        result.pos[forces[i].target].vY += forces[i].magnitude * Math.sin((forces[i].direction/180) * Math.PI)
    }

    for(i=0;i<ballSet.length;i++){

        if(result.pos[i].x - ballSet[i].radius <0) {
            result.pos[i].vX -= 2 * result.pos[i].vX;
            result.pos[i].x -= result.pos[i].x - ballSet[i].radius;
        }

        if(result.pos[i].x + ballSet[i].radius > frameWidth){
            result.pos[i].vX -= 2 * result.pos[i].vX;
            result.pos[i].x -= result.pos[i].x + ballSet[i].radius - frameWidth;
        }

        if(result.pos[i].y - ballSet[i].radius <0){
            result.pos[i].vY -= 2 * result.pos[i].vY;
            result.pos[i].y -= result.pos[i].y - ballSet[i].radius;
        }

        if(result.pos[i].y + ballSet[i].radius > frameHeight){
            result.pos[i].vY -= 2 * result.pos[i].vY;
            result.pos[i].y -= result.pos[i].y + ballSet[i].radius - frameHeight;
        }

        for(var j = i + 1; j<ballSet.length;j++){
            var ball1 = ballSet[i]
            ball1.x = result.pos[i].x
            ball1.y = result.pos[i].y
            ball1.vY = result.pos[i].vY
            ball1.vX = result.pos[i].vX
            var ball2 = ballSet[j]
            ball2.x = result.pos[j].x
            ball2.y = result.pos[j].y
            ball2.vX = result.pos[j].vX
            ball2.vY = result.pos[j].vY


            if(getDistance(ball1.x, ball1.y, ball2.x, ball2.y) <= ball1.radius + ball2.radius){
                var collisionAngle = (Math.atan2((ball1.y - ball2.y), (ball1.x - ball2.x)));
                
                var vx1 = ball1.vX * Math.cos(collisionAngle) + Math.sin(collisionAngle) * ball1.vY;
                var vx2 = ball2.vX * Math.cos(collisionAngle) + Math.sin(collisionAngle) * ball2.vY;
                var vy1 = ball1.vX * -Math.sin(collisionAngle) + Math.cos(collisionAngle) * ball1.vY;
                var vy2 = ball2.vX * -Math.sin(collisionAngle) + Math.cos(collisionAngle) * ball2.vY;

                var vx1f = ((ball1.mass - ball2.mass) * vx1 + 2 * ball2.mass * vx2)/(ball1.mass + ball2.mass);
                var vx2f = ((ball2.mass - ball1.mass) * vx2 + 2 * ball1.mass * vx1)/(ball1.mass + ball2.mass);

                var fvx1 = vx1f * Math.cos(collisionAngle) - Math.sin(collisionAngle) * vy1;
                var fvy1 = vx1f * Math.sin(collisionAngle) + Math.cos(collisionAngle) * vy1;

                var fvx2 = vx2f * Math.cos(collisionAngle) - Math.sin(collisionAngle) * vy2;
                var fvy2 = vx2f * Math.sin(collisionAngle) + Math.cos(collisionAngle) * vy2;

                result.pos[i].vX = fvx1;
                result.pos[i].vY = fvy1;

                result.pos[j].vX = fvx2;
                result.pos[j].vY = fvy2;

                var distance = (ball1.radius + ball2.radius) - getDistance(ball1.x, ball1.y, ball2.x, ball2.y) 
                var xmovement = .5 * Math.cos(collisionAngle) * distance;
                var ymovement = .5 * Math.sin(collisionAngle) * distance;

                result.pos[i].x += xmovement;
                result.pos[i].y += ymovement;

                result.pos[j].x -= xmovement;
                result.pos[j].y -= ymovement;
            }

        }
    }
    return result;
}

export function simulate(dTime, simTime, ballSet, forces, frameWidth, frameHeight) {
    var simulation = {
        ballSet: ballSet,
        frames: new Array
    }
    var frame = ballSet;
    var frameCount = 0;
    frame.time = 0;
    for(var i = 0; i < simTime; i+= dTime){
        var nFrame = newFrame(frame, dTime, ballSet.pos, new Array, frameWidth, frameHeight);
        simulation.frames.push(nFrame);
        frame = nFrame;
        frameCount++;
    }
    return simulation;
}