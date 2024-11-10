const serpinskyCanvas = document.getElementById('serpinskyCanvas');
const ctx2 = serpinskyCanvas.getContext('2d');

function drawTriangle(x, y, size) {
    ctx2.beginPath();
    ctx2.moveTo(x, y);
    ctx2.lineTo(x + size, y);
    ctx2.lineTo(x + size / 2, y - (Math.sqrt(3) / 2) * size);
    ctx2.closePath();
    ctx2.fill();
}

function sierpinski(x, y, size, depth) {
    if (depth === 0) {
        drawTriangle(x, y, size);
    } else {
        const newSize = size / 2;
        sierpinski(x, y, newSize, depth - 1);
        sierpinski(x + newSize, y, newSize, depth - 1);
        sierpinski(x + newSize / 2, y - (Math.sqrt(3) / 2) * newSize, newSize, depth - 1);
    }
}

drawSierpinski()

function drawSierpinski() {
    const depth = parseInt(document.getElementById('depth').value);
    ctx2.clearRect(0, 0, serpinskyCanvas.width, serpinskyCanvas.height);
    ctx2.fillStyle = 'blue';
    sierpinski(0, 400, 400, depth);
}

document.querySelector("#depth").addEventListener('change', (e)=>{
    drawSierpinski()
})


