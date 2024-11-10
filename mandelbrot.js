const canvas = document.getElementById('mandelbrotCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let xMin = -2.5, xMax = 1;
let yMin = -1.5, yMax = 1.5;
let maxIter = 1000;
let originalBounds = { xMin, xMax, yMin, yMax };

function calculateStep() {
    // Пересчитываем шаги каждый раз при изменении области
    return {
        xStep: (xMax - xMin) / (width - 1),
        yStep: (yMax - yMin) / (height - 1),
    };
}

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
        return '#FEFEF7'; // Белый цвет для максимальных итераций
    } else if (iter < maxIter / 3) {
        // Часть итераций от черного до красного
        const ratio = iter / (maxIter / 3);
        const red = Math.floor(13 + ratio * (254 - 13));   // от 0D0000 до FE2907
        const green = Math.floor(0 + ratio * (41 - 0));    // от 0 до FE2907
        const blue = Math.floor(0 + ratio * (7 - 0));     // от 0 до FE2907
        return `rgb(${red}, ${green}, ${blue})`;
    } else if (iter < 2 * maxIter / 3) {
        // Часть итераций от красного до желтого
        const ratio = (iter - maxIter / 3) / (maxIter / 3);
        const red = Math.floor(254 + ratio * (255 - 254));   // от FE2907 до FEFD31
        const green = Math.floor(41 + ratio * (253 - 41));   // от FE2907 до FEFD31
        const blue = Math.floor(7 + ratio * (31 - 7));       // от FE2907 до FEFD31
        return `rgb(${red}, ${green}, ${blue})`;
    } else {
        // Часть итераций от желтого до белого
        const ratio = (iter - 2 * maxIter / 3) / (maxIter / 3);
        const red = Math.floor(255 + ratio * (255 - 255));   // от FEFD31 до FEFEF7 (не меняем красный)
        const green = Math.floor(253 + ratio * (255 - 253)); // от FEFD31 до FEFEF7
        const blue = Math.floor(31 + ratio * (247 - 31));    // от FEFD31 до FEFEF7
        return `rgb(${red}, ${green}, ${blue})`;
    }
}



function drawMandelbrot() {
    const { xStep, yStep } = calculateStep();

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

}

canvas.addEventListener('click', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const { xStep, yStep } = calculateStep();
    const centerX = xMin + mouseX * xStep;
    const centerY = yMin + mouseY * yStep;

    // Масштабирование области при клике
    const zoomFactor = 0.5; // Увеличиваем масштаб в два раза при каждом клике
    const widthZoom = (xMax - xMin) * zoomFactor;
    const heightZoom = (yMax - yMin) * zoomFactor;

    xMin = centerX - widthZoom / 2;
    xMax = centerX + widthZoom / 2;
    yMin = centerY - heightZoom / 2;
    yMax = centerY + heightZoom / 2;

    updateAndDrawMand();
});

// Восстановление исходного масштаба
document.getElementById('resetZoom').addEventListener('click', () => {
    xMin = originalBounds.xMin;
    xMax = originalBounds.xMax;
    yMin = originalBounds.yMin;
    yMax = originalBounds.yMax;
    updateAndDrawMand();
});

document.getElementById('iter4Mandelbrot').addEventListener('input', (e) => {
    maxIter = parseInt(e.target.value);
    setTimeout(() => {
        updateAndDrawMand();
    }, 200);
});

updateAndDrawMand();
