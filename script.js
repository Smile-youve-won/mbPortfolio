//Landing page effect. Taken from YouTube tutorial "Frank's Laboratory"
//https://www.youtube.com/watch?v=XGioNBHrFU4

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = []; //Store particle info: size, colour, co-ordinates etc. info pulled from here to draw on canvas
let adjustX = -5;
let adjustY = 10;


// HANDLE MOUSE INTERACTIONS
//Mouse location and radius for particle interaction
const mouse = {
    x: null,
    y: null,
    radius: 200
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse.x, mouse.y);
});

//Styling interactive text
ctx.fillStyle = 'white';
ctx.font = '20px Verdana';
ctx.fillText('Web Developer', 10, 50);
const textCoordinates = ctx.getImageData(0, 0, 310, 110);

//build array of info of particle locations (Blueprint to create particles)
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;                              //Size of particle
        this.baseX = this.x;                        //Remembers location to move back to after interaction
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 10;    //Weight of particle, so they move at different speeds
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); //Draw circle
        ctx.closePath();
        ctx.fill();
    }
    //Calculating distance between particle and mouse pointer using pythagoras (a^2 + b^2 = c^2)
    //Then calculate particle speed relevant to the distance from pointer. Closer to pointer faster it moves away and slows down as it moves away
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let DirectionX = forceDirectionX * force * this.density;
        let DirectionY = forceDirectionY * force * this.density;


        if (distance < mouse.radius) {       //Distance of reacting particles
            this.x -= DirectionX;            //- pushes away + will attract
            this.y -= DirectionY;            //- pushes away + will attract
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

//Fill particle array with particle objects (Text pixels)
function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }
}
init();
console.log(particleArray);

//Animation Function - redraws canvas after every frame 
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

//Drawing lines between each particle
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // let distance = Math.sqrt(dx * dx + dy * dy);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 25) {                //Number of line connecting
                opacityValue = 1 - (distance / 25);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}