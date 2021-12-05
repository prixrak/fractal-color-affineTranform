let zoom = 5;
let angle = 0;
let zMin = 0.01;
let zMax = 5.1;
let sens = 0.001;

const maxiterations = 77;



let dark = false;


const colorsB = [];
const colorsR = [];
const colorsG = [];

var container;

var containerX;
var containerY;

$( window ).resize(function() {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
});

function beginning() {
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt(n / maxiterations);
        let col = color(hu, 1, 1);
        colorsB[n] = blue(col);
        colorsR[n] = red(col);
        colorsG[n] = green(col);
    }
}

function lightSchemeChange() {
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt((n + 1) / maxiterations);
        let hue = 255;
        let col = color(hue, hu, 1);
        colorsB[n] = red(col);
        colorsR[n] = green(col);
        colorsG[n] = blue(col);
    }
}

function darkSchemeChange() {
    colorMode(HSB, 1);
    for (let n = 0; n < maxiterations; n++) {
        let hu = sqrt((n + 1) / maxiterations);
        let hue = 0;
        let col = color(hue, 0.8, hu);
        colorsB[n] = red(col);
        colorsR[n] = green(col);
        colorsG[n] = blue(col);
    }
}

$("#monochromeScheme").change(
    function() {

        colorMode(RGB, 255);
        for (let n = 0; n < maxiterations; n++) {
            var bright = map(n, 0, maxiterations, 0, 1);
            bright = map(sqrt(bright), 0, 1, 0, 255);
            colorsB[n] = bright;
            colorsR[n] = bright;
            colorsG[n] = bright;
        }
    }
);

$("#rainbowScheme").change(beginning);

$("#lightScheme").change(
    function() {
        dark = false;
        lightSchemeChange();
    }
);

$("#darkScheme").change(
    function() {
        dark = true;
        darkSchemeChange();
    }
);



function setup() {

    container = document.getElementById('canvasDiv');
    var canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent("canvasDiv");
    document.querySelector("canvas").className = "fractal";
    pixelDensity(1);
    beginning();
}

var cointainerMouseX = 0;
var cointainerMouseY = 0;

function updateContainerMouseCoordinate(event) {
    cointainerMouseX = event.pageX - $(container).offset().left;
    cointainerMouseY = event.pageY - $(container).offset().top;
}

function draw() {
    container.addEventListener("mousemove", updateContainerMouseCoordinate);
    container.addEventListener("mouseenter", updateContainerMouseCoordinate);
    container.addEventListener("mouseleave", updateContainerMouseCoordinate);
    let ca = map(cointainerMouseX, 0, container.offsetWidth, -1, 1);
    let cb = map(cointainerMouseY, 0, container.offsetHeight, -1, 1);
    document.querySelector("#CXMOUSE").value = ca.toFixed(4);
    document.querySelector("#CYMOUSE").value = cb.toFixed(4);

    background(255);

    let w = zoom;
    let h = (w * height) / width;


    let xmin = -w / 2;
    let ymin = -h / 2;

    loadPixels();


    let xmax = xmin + w;

    let ymax = ymin + h;


    let dx = (xmax - xmin) / width;
    let dy = (ymax - ymin) / height;


    let y = ymin;
    for (let j = 0; j < height; j++) {

    let x = xmin;
    for (let i = 0; i < width; i++) {

        let a = x;
        let b = y;
        let n = 0;
        while (n < maxiterations) {
        let aa = a * a;
        let bb = b * b;

        if (aa + bb > 4.0) {
            break;
        }
        let twoab = 2.0 * a * b;
        a = aa - bb + ca;
        b = twoab + cb;
        n++;
        }


        let pix = (i + j * width) * 4;
        if (n == maxiterations) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
        } else {
        pixels[pix + 0] = colorsB[n];
        pixels[pix + 1] = colorsR[n];
        pixels[pix + 2] = colorsG[n];
        }
        x += dx;
    }
    y += dy;
    }
    updatePixels();
}


// document.querySelector("#canvasDiv").addEventListener('wheel', (event) => {
//     console.log("mouse");
//     zoom += sens * event.delta;
//     zoom = constrain(zoom, zMin, zMax);
//     return false;
// });

function mouseWheel(event) {
    zoom += sens * event.delta;
    zoom = constrain(zoom, zMin, zMax);
    return false;
}
