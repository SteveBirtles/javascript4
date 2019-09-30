let w = 0, h = 0;
const ballImage = new Image();

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('pathCanvas');
    canvas.width = w;
    canvas.height = h;
}

let balls = [];
let markers = [];

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    markers.push({x: 50, y: h/2});
    markers.push({x: w-50, y: h/2});

    ballImage.src = "ball.png";
    ballImage.onload = () => window.requestAnimationFrame(redraw);

    setInterval(addBall, 1000);

    const canvas = document.getElementById('pathCanvas');

    canvas.addEventListener('click', event => {
        addMarker(event.clientX, event.clientY);
    }, false);

    canvas.addEventListener('contextmenu', event => {
        removeMarker();
        event.preventDefault();
    }, false);

}

function addBall() {

	let x = markers[0].x;
	let y = markers[0].y;
	let r = 30;

	let nextMarker = 1;
	let progress = 0;

	balls.push({x, y, r, nextMarker, progress});

}

function addMarker(x, y) {

    let lastMarker = markers.pop();
    markers.push({x, y});
    markers.push(lastMarker);

}

function removeMarker() {

    if (markers.length <= 2) return;
    markers.splice(markers.length - 2, 1);

}

let lastTimestamp = 0;

function redraw(timestamp) {

    const canvas = document.getElementById('pathCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    for (let b of balls) {

        if (b.nextMarker >= markers.length) continue;

    	let n = b.nextMarker;
    	b.x = markers[n-1].x + (markers[n].x - markers[n-1].x) * b.progress;
    	b.y = markers[n-1].y + (markers[n].y - markers[n-1].y) * b.progress;

        let d = Math.sqrt(Math.pow( markers[n].x - markers[n-1].x, 2) + Math.pow(markers[n].y - markers[n-1].y, 2));

        b.progress += frameLength * 100/d;
 	    if (b.progress >= 1) {
 			b.nextMarker++;
 			b.progress -= 1;
        }

    }

    while (balls.length > 0) {
        if (balls[0].nextMarker < markers.length) break;
        balls.shift();
    }

    context.strokeStyle = 'blue';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.setLineDash([5, 10]);

    let lastMarker = null;
    for (let marker of markers) {
        if (lastMarker != null) {
            context.beginPath();
            context.moveTo(lastMarker.x, lastMarker.y);
            context.lineTo(marker.x, marker.y);
            context.stroke();
        }
        lastMarker = marker;
    }

    for (let b of balls) {
       context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, b.x-b.r, b.y-b.r, b.r*2, b.r*2);
    }



    window.requestAnimationFrame(redraw);

}
