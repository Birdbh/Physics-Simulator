//Physics Quantities
let gravity = 0.3;
let rebound = -0.4;
let airResistance = 0.99;

//List of all Balls on screen
var objectsOnScreen = new Array();

//Size of User Window
const height = (window.innerHeight - 120);
const width = (window.innerWidth - 40);

//Object Class for "Ball" that is bouncing
class Object{
    constructor(event, yvelocity, xvelocity, time){
        this.xposition = event.clientX;
        this.yposition = event.clientY;
        this.yvelocity = yvelocity;
        this.xvelocity = xvelocity;
        this.time = time;
    }

    //Vertical Movements of Ball: Can either Bounce bounceVertical() or have its velocity affected by gravity
    moveVertical(){
        if(this.yposition > height){
            this.bounceVertical();
        }
        else{
            //Update velocity with the effect of gravity
            this.yvelocity = this.gravityEffectVertical(this.yvelocity);

            //Calculate new height based upon new velocity
            this.yposition = this.yposition + (-1)*(this.yvelocity);
        }
    }

    bounceVertical(){
        //Once bounced time since last bounce is set to zero and the rebound effect is applied
        this.time = 0
        this.yvelocity = this.rebound(this.yvelocity);

        //Height is upated to "floor" position so it doesnt glitch through
        this.yposition = height;
    }

    gravityEffectVertical(velocity){
        //Velocity is updated as a function of gravity and the time since last bounce
        velocity = (velocity)-(gravity*this.time);

        return velocity;
    }

    rebound(velocity){
        //Rebound effect decreases the velocity of the ball after hitting the "ground"
        return velocity*rebound;
    }

    moveHorizontal(){
        //If going off left side of screen
        if(this.xposition > width){
            //Reverse direction
            this.xvelocity = (this.xvelocity)*(-1)

            //Distance position is updated to right "wall" so it doesnt glitch through
            this.xposition = width;
        }
        if(this.xposition < 0){
            //Reverse direction
            this.xvelocity = (this.xvelocity)*(-1)

            //Distance position is updated to left "wall" so it doesnt glitch through
            this.xposition = 0;
        }
        else{
            //If no collision with wall updated positition with Horizontal Velocity
            this.xposition = this.xposition + this.xvelocity;
        }

        //Air Resitance is always applied
        this.airResistance();
    }

    airResistance(){
        //Horizontal Velocity is decreased by the affect of airResistance
        this.xvelocity = this.xvelocity*airResistance;
    }

}

function draw(event){

    //Create new wall object
    let object = new Object(event, 0, 0, 0);

    //Add to List of Balls
    objectsOnScreen.push(object);

    //Create div that can be updated with object positions
    let ball = document.createElement("div");

    //Style the ball element
    ball.style.cssText = 'background: red;border-radius: 50%;height: 20px; width: 20px; position: absolute; left: 10px;top: 5px;'

    window.setInterval(function(){

        //Check Vertical Movement of object
        object.moveVertical();
        
        //Check Horizontal Movement of object
        object.moveHorizontal();

        //Update div with object data
        ball.style.top = object.yposition + "px";
        ball.style.left = object.xposition + "px";

        //Update div onto page
        document.getElementById("body").appendChild(ball);

        //Add time to object time
        object.time = object.time + 0.05;
    }, 10);
}

//Listener for keypresses or arrows
document.addEventListener('keydown', function(event){

    switch (event.key) {
        case "ArrowLeft":
            //for objects in List of objects if still bouncing increase velocity left
            for (let i of objectsOnScreen){
                if (i.yposition < height ){
                    i.xvelocity -=1;
                }
            }
            break;
        case "ArrowRight":
            //for objects in List of objects if still bouncing increase velocity right
            for (let i of objectsOnScreen){
                if (i.yposition < height ){
                    i.xvelocity +=1;
                }
            }
            break;
    }

});

//Listener for svg arrow presses left
function leftSVG(){
    for (let i of objectsOnScreen){
        if (i.yposition < height ){
            i.xvelocity -=1;
        }
    }
}

//Listern for svg arrow press right
function rightSVG(){
    for (let i of objectsOnScreen){
        if (i.yposition < height ){
            i.xvelocity +=1;
        }
    }
}

//slider function when called by change in html slider
function sliderChange(){

    //Set gravity to slider value
    gravity = document.getElementById("gravitySlider").value;

    //Set rebound to slider value
    rebound =(-1)*(document.getElementById("reboundSlider").value);
}