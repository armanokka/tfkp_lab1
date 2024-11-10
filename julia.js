const juliacanv = document.getElementById('juliaCanvas');
const ctx1 = juliacanv.getContext('2d');
const widthJulia = juliacanv.width;
const heightJulia = juliacanv.height;

let xMinJulia = -2.5, xMaxJulia = 1;
let yMinJulia = -1.5, yMaxJulia = 1.5;
let originalBoundsJulia = { xMin: xMinJulia, xMax: xMaxJulia, yMin: yMinJulia, yMax: yMaxJulia };

let c = { x: -0.5251993, y: 0.5251993 };
let maxIterJulia = 700;

let zoomFactorJulia = 0.5; // Фактор зума

// Функция для вычисления значений Julia
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

// Функция для получения цвета в зависимости от количества итераций
function getJuliaColor(iter) {
    if (iter === maxIterJulia) {
        return 'black';
    } else if (iter < maxIterJulia / 3) {
        const ratio = iter / (maxIterJulia / 3);
        const red = Math.floor(13 + ratio * (254 - 13));
        const green = Math.floor(0 + ratio * (41 - 0));
        const blue = Math.floor(0 + ratio * (7 - 0));
        return `rgb(${red}, ${green}, ${blue})`;
    } else if (iter < 2 * maxIterJulia / 3) {
        const ratio = (iter - maxIterJulia / 3) / (maxIterJulia / 3);
        const red = Math.floor(254 + ratio * (255 - 254));
        const green = Math.floor(41 + ratio * (253 - 41));
        const blue = Math.floor(7 + ratio * (31 - 7));
        return `rgb(${red}, ${green}, ${blue})`;
    } else {
        const ratio = (iter - 2 * maxIterJulia / 3) / (maxIterJulia / 3);
        const red = Math.floor(255 + ratio * (255 - 255));
        const green = Math.floor(253 + ratio * (255 - 253));
        const blue = Math.floor(31 + ratio * (247 - 31));
        return `rgb(${red}, ${green}, ${blue})`;
    }
}

// Функция для рисования фрактала Julia
function drawJulia() {
    ctx1.clearRect(0, 0, widthJulia, heightJulia);

    for (let ix = 0; ix < widthJulia; ix++) {
        for (let iy = 0; iy < heightJulia; iy++) {
            const x = xMinJulia + ix * (xMaxJulia - xMinJulia) / (widthJulia - 1);
            const y = yMinJulia + iy * (yMaxJulia - yMinJulia) / (heightJulia - 1);
            const iter = julia(x, y);

            ctx1.fillStyle = getJuliaColor(iter);
            ctx1.fillRect(ix, iy, 1, 1);
        }
    }
}



// Функция для обновления и перерисовки
function updateAndDraw() {
    drawJulia();

}

// Начальная отрисовка
updateAndDraw();

// Обработчики событий для слайдеров
document.getElementById('cXSlider').addEventListener('input', (e) => {
    c.x = parseFloat(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20);
});

document.getElementById('cYSlider').addEventListener('input', (e) => {
    c.y = parseFloat(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20);
});

document.getElementById('iterSlider').addEventListener('input', (e) => {
    maxIterJulia = parseInt(e.target.value);
    setTimeout(() => {
        updateAndDraw();
    }, 20);
});

// Функция сброса зума
document.getElementById('resetZoomJulia').addEventListener('click', () => {
    xMinJulia = originalBoundsJulia.xMin;
    xMaxJulia = originalBoundsJulia.xMax;
    yMinJulia = originalBoundsJulia.yMin;
    yMaxJulia = originalBoundsJulia.yMax;
    updateAndDraw();
});

// Функция для зума (при клике по канвасу)
function zoomJulia(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Вычисление координат фрактала на основе текущего зума
    const xStep = (xMaxJulia - xMinJulia) / widthJulia;
    const yStep = (yMaxJulia - yMinJulia) / heightJulia;

    // Центрирование на точке клика
    const centerX = xMinJulia + mouseX * xStep;
    const centerY = yMinJulia + mouseY * yStep;

    const newWidth = (xMaxJulia - xMinJulia) * zoomFactorJulia;
    const newHeight = (yMaxJulia - yMinJulia) * zoomFactorJulia;

    // Пересчет новых границ
    xMinJulia = centerX - newWidth / 2;
    xMaxJulia = centerX + newWidth / 2;
    yMinJulia = centerY - newHeight / 2;
    yMaxJulia = centerY + newHeight / 2;

    updateAndDraw(); // Перерисовываем после зума
}

// Обработчик кликов для зума
juliacanv.addEventListener('click', zoomJulia);

// Функция переключения между фракталами
function onSelectChange() {
    let select = document.querySelector("select.select");
    let selectedValue = select.options[select.selectedIndex].value;

    switch (selectedValue) {
        case "mandelbrot":
            manageMandelbrot(true);
            manageJulia(false);
            manageSerpinsky(false);
            break;
        case "julia":
            manageMandelbrot(false);
            manageJulia(true);
            manageSerpinsky(false);
            break;
        case "serpinsky":
            manageMandelbrot(false);
            manageJulia(false);
            manageSerpinsky(true);
            break;
        default:
            console.log("unknown value", selectedValue);
    }
}

// Функции управления видимостью фракталов
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

onSelectChange();
