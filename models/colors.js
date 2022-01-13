window.addEventListener('DOMContentLoaded', () => {

    const fullCircle = 360;
    const yellowHue = 60;
    const yellowHueNorm = yellowHue / fullCircle;

    let hueTolerance = document.querySelector("#hueRange").value;

    let brightnessDiff = 0;

    let canvasOrig = document.querySelector("#canvasOrig");
    let canvasColored = document.querySelector("#canvasColored");

    let defaultMask = [];

    for (let i = 0; i < canvasOrig.height; ++i) {
        defaultMask[i] = [];
        for (let j = 0; j < canvasOrig.width; ++j) {
            defaultMask[i][j] = 1;
        }
    }

    getMousePos = (canvas, evt) => {
        return {
            x: Math.round(evt.pageX - canvas.offsetLeft),
            y: Math.round(evt.pageY - canvas.offsetTop)
        };
    }

    getRgbPixel = (canvas, mouseX, mouseY) => {
        let cs = getComputedStyle(canvas);

        let widthCanvas = parseInt(cs.getPropertyValue('width'), 10);
        let heightCanvas = parseInt(cs.getPropertyValue('height'), 10);

        let imageData = canvas.getContext('2d').getImageData(0, 0, widthCanvas, heightCanvas).data;
        let basePos = mouseY * widthCanvas + mouseX;
        basePos *= 4;
        return {
            r: imageData[basePos],
            g: imageData[basePos + 1],
            b: imageData[basePos + 2]
        };
    }

    changeBlueValue = (mask = defaultMask) => {
        if (mask == null)
            mask = defaultMask;

        let aData = canvasOrig.getContext('2d').getImageData(0, 0, canvasOrig.width, canvasOrig.height).data;

        for (let i = 0; i < canvasOrig.height; ++i) {
            for (let j = 0; j < canvasOrig.width; ++j) {
                pos = i * canvasOrig.width + j;
                pos *= 4;
                if (mask[i][j] === 1) {
                    let pixel = {
                        r: aData[pos],
                        g: aData[pos + 1],
                        b: aData[pos + 2]
                    };
                    let pixelHsv = rgb2hsv(pixel.r, pixel.g, pixel.b);
                    if (checkHueTolerance(yellowHueNorm, hueTolerance, pixelHsv.h)) {
                        pixelHsv.v += brightnessDiff;
                        let pixelRgb = hsv2rgb(pixelHsv.h, pixelHsv.s, pixelHsv.v);
                        aData[pos] = pixelRgb.r;
                        aData[pos + 1] = pixelRgb.g;
                        aData[pos + 2] = pixelRgb.b;
                    }
                }
            }
        }
        console.log("zzzzzzzzzzzzzzzzzzzz");
        canvasColored.getContext('2d').putImageData(new ImageData(aData, canvasOrig.width), 0, 0);
    }

    document.querySelector("#hueRange").addEventListener("mousemove", () => {
        hueTolerance = document.querySelector("#hueRange").value / fullCircle;
        changeBlueValue();
    });

    document.querySelector("#brightnessRange").addEventListener("mousemove", () => {
        brightnessDiff = document.querySelector("#brightnessRange").value / 100.0;
        changeBlueValue(); 
    });

    getColorString = (event) => {
        console.log("a");
        let pos = getMousePos(canvasOrig, event);
        let rgb = getRgbPixel(canvasOrig, pos.x, pos.y);
        let cmyk = rgb2cmyk(rgb.r, rgb.g, rgb.b);

        document.querySelector("#RGB").textContent = " " + rgb.r + ", " + rgb.g + ", " + rgb.b;
        document.querySelector("#CMYK").textContent = " " + (100*cmyk.c).toFixed(0) + "%, " + (100*cmyk.m).toFixed(0) + "%, " + (100*cmyk.y).toFixed(0) + "%, " + (100*cmyk.k).toFixed(0) + "%";
    }

    removeColorString = () => {
        document.querySelector("#RGB").textContent = "";
        document.querySelector("#CMYK").textContent = "";
    }

    document.querySelector("#canvasOrig").addEventListener("mousemove", (event) => getColorString(event));
    document.querySelector("#canvasOrig").addEventListener("mouseout", () => removeColorString());

    document.querySelector("#canvasColored").addEventListener("mousemove", (event) => getColorString(event));
    document.querySelector("#canvasColored").addEventListener("mouseout", () => removeColorString());


    loadImageFromFile = () => {
        let fileInput = document.querySelector("#fileInput");

        let image = new Image();

        image.addEventListener("load", () => {
            let context = canvasOrig.getContext('2d');
            context.clearRect(0, 0, canvasOrig.width, canvasOrig.height);
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasOrig.width, canvasOrig.height );
            changeBlueValue();
        });

        let fileReader = new FileReader();
        fileReader.addEventListener("load", function() { image.src = this.result });

        if (fileInput.files.length == 1) {
            let file = fileInput.files[0];
            fileReader.readAsDataURL(file);
        } else if (!image.src) {
            image.src = "img/fr.png";
        }
    }

    checkHueTolerance = (neededHue, tolerance, currentHue) => {
        if (tolerance < 0) return false;
        
        if (currentHue > 1) currentHue = currentHue % 1;
        
        if (currentHue < 0) currentHue = currentHue % 1 + 1;
        
        if (currentHue < neededHue + tolerance && currentHue > neededHue - tolerance) return true;
        
        if (neededHue + tolerance > 1) 
            if ((neededHue + tolerance) % 1 > currentHue) 
                return true;
            
        if (neededHue - tolerance < 0) 
            if ((neededHue - tolerance) % 1 + 1 < currentHue) 
                return true;
            
        return false;
    }

    hsv2rgb = (hue, saturation, value) => {
        if (hue < 0 || hue > 1) {
            hue = hue - Math.floor(hue);
        }
        if (saturation < 0) {
            saturation = 0;
        }
        if (saturation > 1) {
            saturation = 1;
        }
        if (value < 0) {
            value = 0;
        }
        if (value > 1) {
            value = 1;
        }
        let chroma = value * saturation;
        let hue1 = hue * 6;
        let x = chroma * (1 -  Math.abs((hue1 % 2) - 1));
        let r1, g1, b1;


        if (hue1 >= 0 && hue1 <= 1) {
            ([r1, g1, b1] = [chroma, x, 0]);
        } else if (hue1 <= 2) {
            ([r1, g1, b1] = [x, chroma, 0]);
        } else if (hue1 <= 3) {
            ([r1, g1, b1] = [0, chroma, x]);
        } else if (hue1 <= 4) {
            ([r1, g1, b1] = [0, x, chroma]);
        } else if (hue1 <= 5) {
            ([r1, g1, b1] = [x, 0, chroma]);
        } else if (hue1 <= 6) {
            ([r1, g1, b1] = [chroma, 0, x]);
        }

        let m = value - chroma;
        let [r, g, b] = [r1 + m, g1 + m, b1 + m];

        return {
            r: 255 * r,
            g: 255 * g,
            b: 255 * b
        };
    }

    rgb2hsv = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
        let h,
        s,
        v = max;

        let d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:     h = (g - b) / d + (g < b ? 6 : 0);
                            break;

                case g:     h = (b - r) / d + 2;
                            break;

                case b:     h = (r - g) / d + 4;
                            break;

                default:    break;
            }
            h /= 6;
        }

        return {
            h: h,
            s: s,
            v: v
        };
    }

    rgb2cmyk = (r, g, b) => {
        let c = 1 - r / 255;
        let m = 1 - g / 255;
        let y = 1 - b / 255;

        let k = Math.min(c, m, y);
        if (k == 1) {
            return {
                c: 0,
                m: 0,
                y: 0,
                k: 1
            };
        }

        return {
            c: (c - k) / (1 - k),
            m: (m - k) / (1 - k),
            y: (y - k) / (1 - k),
            k: k
        };
    }

    cmyk2rgb = (c, m, y, k) => {
        c = c * (1 - k) + k;
        m = m * (1 - k) + k;
        y = y * (1 - k) + k;

        let r = 1 - c;
        let g = 1 - m;
        let b = 1 - y;

        r = Math.round(255 * r);
        g = Math.round(255 * g);
        b = Math.round(255 * b);

        return {
            r: r,
            g: g,
            b: b
        };
    }

    loadImageFromFile();
});