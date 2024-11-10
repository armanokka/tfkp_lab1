const juliacanv = document.getElementById('juliaCanvas');
const ctx1 = juliacanv.getContext('2d');
const widthJulia = juliacanv.width;
const heightJulia = juliacanv.height;

const xMinJulia = -1.5, xMaxJulia = 1.5;
const yMinJulia = -1.5, yMaxJulia = 1.5;

const xStepJulia = (xMaxJulia - xMinJulia) / (widthJulia - 1);
const yStepJulia = (yMaxJulia - yMinJulia) / (heightJulia - 1);

let c = { x:-0.5251993, y: 0.5251993 };
let maxIterJulia = 700;

function julia(x, y) {
    let iter = 0;
    while (x * x + y * y <= 4 && iter < maxIterJulia) {
        let temp = x * x - y * y + c.x;
        y = 2 * x * y + c.y;
        x = temp;
        iter++;
    }
    return iter;
}


function getJuliaColor(iter) {
    if (iter === maxIterJulia) {
        return 'black';
    } else {
        const hue = Math.floor(540 * iter / maxIterJulia);
        const saturation = 100;  // 100% РЅР°СЃС‹С‰РµРЅРЅРѕСЃС‚СЊ
        const lightness = iter < maxIterJulia ? 55 : 0;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
}

function drawJulia() {
    ctx1.clearRect(0, 0, widthJulia, heightJulia);

    for (let ix = 0; ix < widthJulia; ix++) {
        for (let iy = 0; iy < heightJulia; iy++) {
            const x = xMinJulia + ix * xStepJulia;
            const y = yMinJulia + iy * yStepJulia;
            const iter = julia(x, y);

            ctx1.fillStyle = getJuliaColor(iter);
            ctx1.fillRect(ix, iy, 1, 1);
        }
    }
}

function drawAxesJulia() {
    ctx1.strokeStyle = '#7f7f7f';
    ctx1.lineWidth = 2;

    ctx1.beginPath();
    ctx1.moveTo(0, heightJulia / 2);
    ctx1.lineTo(widthJulia, heightJulia / 2);
    ctx1.stroke();

    ctx1.beginPath();
    ctx1.moveTo(widthJulia / 2, 0);
    ctx1.lineTo(widthJulia / 2, heightJulia);
    ctx1.stroke();
}

function updateAndDraw() {
    drawJulia();
    drawAxesJulia();
}

updateAndDraw();


document.getElementById('cXSlider').addEventListener('input', (e) => {
    c.x = parseFloat(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20)
});

document.getElementById('cYSlider').addEventListener('input', (e) => {
    c.y = parseFloat(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20)
});

document.getElementById('iterSlider').addEventListener('input', (e) => {
    maxIterJulia = parseInt(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20)
});


function onSelectChange() {
    let select = document.querySelector("select.select")
    let selectedValue = select.options[select.selectedIndex].value
    console.log(selectedValue)

    switch (selectedValue) {
        case "mandelbrot":
            manageMandelbrot(true)
            manageJulia(false)
            manageSerpinsky(false)
            break;
        case "julia":
            manageMandelbrot(false)
            manageJulia(true)
            manageSerpinsky(false)
            break;
        case "serpinsky":
            manageMandelbrot(false)
            manageJulia(false)
            manageSerpinsky(true)
            break;
        default:
            console.log("unknown value", selectedValue)
    }
}

function manageMandelbrot(show) {
    document.querySelector("#mandelbrotCanvas").style.display = show ? "block" : "none";
    document.querySelector(".mandelbrot_management").style.display = show ? "block" : "none";
}

function manageJulia(show) {
    document.querySelector("#juliaCanvas").style.display = show ? "block" : "none";
    document.querySelector(".julia_management").style.display = show ? "block" : "none";
}

function manageSerpinsky(show) {
    document.querySelector("#serpinskyCanvas").style.display = show ? "block" : "none";
    document.querySelector(".serpinsky_management").style.display = show ? "block" : "none";
}

// Handle canvas click for zooming
let scaleJulia = 1;
let isZoomedJulia = false;
juliacanv.addEventListener('click', (event) => {
    const rect = juliacanv.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (!isZoomedJulia) {
        // Zoom in
        scaleJulia = 2; // Change scale as needed
        ctx1.setTransform(scaleJulia, 0, 0, scaleJulia, -mouseX * (scaleJulia - 1), -mouseY * (scaleJulia - 1));
    } else {
        // Reset to original scale
        scaleJulia = 1;
        ctx1.setTransform(scaleJulia, 0, 0, scaleJulia, 0, 0);
    }

    isZoomedJulia = !isZoomedJulia; // Toggle zoom state
    updateAndDraw(); // Redraw grid after zooming
});

onSelectChange()

