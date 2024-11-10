const canvas = document.getElementById('mandelbrotCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const xMin = -2.5, xMax = 1;
const yMin = -1.5, yMax = 1.5;
let maxIter = 100;

const xStep = (xMax - xMin) / (width - 1);
const yStep = (yMax - yMin) / (height - 1);

function mandelbrot(x, y) {
    let zx = x;
    let zy = y;
    let iter = 0;
    while (zx * zx + zy * zy <= 4 && iter < maxIter) {
        const temp = zx * zx - zy * zy + x;
        zy = 2 * zx * zy + y;
        zx = temp;
        iter++;
    }
    return iter;
}

function drawAxes() {
    ctx.strokeStyle = '#7f7f7f';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
}

function getColor(iter) {
    if (iter === maxIter) {
        return 'black';
    } else {
        const hue = Math.floor(360 * iter / maxIter);
        const saturation = 100;
        const lightness = iter < maxIter ? 55 : 0;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
}

function drawMandelbrot() {
    for (let ix = 0; ix < width; ix++) {
        for (let iy = 0; iy < height; iy++) {
            const x = xMin + ix * xStep;
            const y = yMin + iy * yStep;
            const iter = mandelbrot(x, y);

            ctx.fillStyle = getColor(iter);
            ctx.fillRect(ix, iy, 1, 1);
        }
    }
}

function updateAndDrawMand() {
    drawMandelbrot();
    drawAxes();
}

updateAndDrawMand();

document.getElementById('iter4Mandelbrot').addEventListener('input', (e) => {
    maxIter = parseInt(e.target.value);
    setTimeout(() => {
        updateAndDrawMand();
    }, 200);
});

// Handle canvas click for zooming
// let scale = 1;
// let isZoomed = false;
// canvas.addEventListener('click', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;
//
//     if (!isZoomed) {
//         // Zoom in
//         scale = 2; // Change scale as needed
//         ctx.setTransform(scale, 0, 0, scale, -mouseX * (scale - 1), -mouseY * (scale - 1));
//     } else {
//         // Reset to original scale
//         scale = 1;
//         ctx.setTransform(scale, 0, 0, scale, 0, 0);
//     }
//
//     isZoomed = !isZoomed; // Toggle zoom state
//     updateAndDrawMand(); // Redraw grid after zooming
// });

