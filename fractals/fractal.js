window.addEventListener('DOMContentLoaded', () => {
    let zoom = 5;

    const maxiterations = 77;

    let canvasContainer;

    window.addEventListener("resize", () => {
        resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    });

    mouseWheel = (event) => {
        let zMin = 0;
        let zMax = 10;
        let sens = 0.001;
        zoom += sens * event.delta;
        zoom = constrain(zoom, zMin, zMax);
        return false;
    }

    const colorsB = [];
    const colorsR = [];
    const colorsG = [];

    coloredMode = () => {
        colorMode(HSB, 1);
        for (let n = 0; n < maxiterations; n++) {
            let hu = sqrt(n / maxiterations);
            let col = color(hu, 1, 1);
            colorsR[n] = red(col);
            colorsG[n] = green(col);
            colorsB[n] = blue(col);
        }
    }

    lightMode = () => {
        colorMode(HSB, 1);
        for (let n = 0; n < maxiterations; n++) {
            let hu = sqrt((n + 1) / maxiterations);
            let hue = 255;
            let col = color(hue, hu, 1);
            colorsR[n] = green(col);
            colorsG[n] = blue(col);
            colorsB[n] = red(col);
        }
    }

    darkMode = () => {
        colorMode(HSB, 1);
        for (let n = 0; n < maxiterations; n++) {
            let hu = sqrt((n + 1) / maxiterations);
            let hue = 0;
            let col = color(hue, 0.8, hu);
            colorsR[n] = green(col);
            colorsG[n] = blue(col);
            colorsB[n] = red(col);
        }
    }

    greyMode = () => {
        colorMode(RGB, 255);
        for (let n = 0; n < maxiterations; n++) {
            var bright = map(n, 0, maxiterations, 0, 1);
            bright = map(sqrt(bright), 0, 1, 0, 255);
            colorsR[n] = bright;
            colorsG[n] = bright;
            colorsB[n] = bright;
        }
    }

    document.querySelector("#coloredMode").addEventListener("change", () => coloredMode());

    document.querySelector("#greyMode").addEventListener("change", () => greyMode());

    document.querySelector("#lightMode").addEventListener("change", () => lightMode());

    document.querySelector("#darkMode").addEventListener("change", () => darkMode());



    setup = () => {
        canvasContainer = document.querySelector("#canvasContainer");
        let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        canvas.parent("canvasContainer");
        document.querySelector("canvas").className = "fractal";
        pixelDensity(1);
        coloredMode();
    }

    let cointainerMouseX = 0;
    let cointainerMouseY = 0;
    draw = () => {

        canvasContainer.addEventListener("mousemove", (event) => {
            cointainerMouseX = event.pageX - document.querySelector("#canvasContainer").offsetLeft;
            cointainerMouseY = event.pageY - document.querySelector("#canvasContainer").offsetTop;
        });

        let cx = map(cointainerMouseX, 0, canvasContainer.offsetWidth, -1, 1);
        let cy = map(cointainerMouseY, 0, canvasContainer.offsetHeight, -1, 1);

        document.querySelector("#cx").value = cx.toFixed(4);
        document.querySelector("#cy").value = cy.toFixed(4);

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
                    a = aa - bb + cx;
                    b = twoab + cy;
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
});
