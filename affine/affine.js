


window.addEventListener('DOMContentLoaded', function () {
    let gridSize = 20;

    let xGridOffset = 15;
    let yGridOffset = 15;
    
    let xGridStartPoint = { number: 1, suffix: '' };
    let yGridStartPoint = { number: 1, suffix: '' };

    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let triangleArray = [[],[],[]];

    redrawCoordinates = () => {

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let xLineNum = Math.floor(canvasHeight/gridSize);
        let yLineNum = Math.floor(canvasWidth/gridSize);

        
        for(let i = 0; i <= xLineNum; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            
            if(i == xGridOffset) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#e9e9e9";
            
            if(i == xLineNum) {
                ctx.moveTo(0, gridSize*i);
                ctx.lineTo(canvasWidth, gridSize*i);
            }
            else {
                ctx.moveTo(0, gridSize*i+0.5);
                ctx.lineTo(canvasWidth, gridSize*i+0.5);
            }
            ctx.stroke();
        }

        
        for(i = 0; i <= yLineNum; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            
            
            if(i == yGridOffset) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#e9e9e9";
            
            if(i == yLineNum) {
                ctx.moveTo(gridSize*i, 0);
                ctx.lineTo(gridSize*i, canvasHeight);
            }
            else {
                ctx.moveTo(gridSize*i+0.5, 0);
                ctx.lineTo(gridSize*i+0.5, canvasHeight);
            }
            ctx.stroke();
        }

        
        ctx.translate(yGridOffset*gridSize, xGridOffset*gridSize);

        
        for(i = 1; i < (yLineNum - yGridOffset); i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            ctx.moveTo(gridSize*i+0.5, -3);
            ctx.lineTo(gridSize*i+0.5, 3);
            ctx.stroke();

            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(xGridStartPoint.number*i + xGridStartPoint.suffix, gridSize*i-2, 15);
        }

        for(i = 1; i < yGridOffset; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            ctx.moveTo(-gridSize*i+0.5, -3);
            ctx.lineTo(-gridSize*i+0.5, 3);
            ctx.stroke();

            ctx.font = '9px Arial';
            ctx.textAlign = 'end';
            ctx.fillText(-xGridStartPoint.number*i + xGridStartPoint.suffix, -gridSize*i+3, 15);
        }

        
        
        for(i = 1; i < (xLineNum - xGridOffset); i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            
            ctx.moveTo(-3, gridSize*i+0.5);
            ctx.lineTo(3, gridSize*i+0.5);
            ctx.stroke();

            
            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(-yGridStartPoint.number*i + yGridStartPoint.suffix, 8, gridSize*i+3);
        }

        
        
        for(i = 1; i < xGridOffset; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            
            ctx.moveTo(-3, -gridSize*i+0.5);
            ctx.lineTo(3, -gridSize*i+0.5);
            ctx.stroke();

            
            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(yGridStartPoint.number*i + yGridStartPoint.suffix, 8, -gridSize*i+3);
        }
    }

    redrawCoordinates();

    getCordinates = () => {
        let triangleX1 = parseFloat(document.querySelector('#triangleX1').value);
        let triangleY1 = parseFloat(document.querySelector('#triangleY1').value);
        let triangleX2 = parseFloat(document.querySelector('#triangleX2').value);
        let triangleY2 = parseFloat(document.querySelector('#triangleY2').value);
        let triangleX3 = parseFloat(document.querySelector('#triangleX3').value);
        let triangleY3 = parseFloat(document.querySelector('#triangleY3').value);

        triangleArray[0][0] = triangleX1;
        triangleArray[0][1] = triangleY1;
        triangleArray[1][0] = triangleX2;
        triangleArray[1][1] = triangleY2;
        triangleArray[2][0] = triangleX3;
        triangleArray[2][1] = triangleY3;

        console.log(triangleArray);
        return triangleArray;
    }

    drawTriangle = () => {
        ctx.beginPath();
        ctx.moveTo(triangleArray[0][0]/xGridStartPoint.number*gridSize,-triangleArray[0][1]/yGridStartPoint.number*gridSize);
        ctx.lineTo(triangleArray[1][0]/xGridStartPoint.number*gridSize,-triangleArray[1][1]/yGridStartPoint.number*gridSize);
        ctx.lineTo(triangleArray[2][0]/xGridStartPoint.number*gridSize,-triangleArray[2][1]/yGridStartPoint.number*gridSize);
        ctx.closePath();
        ctx.stroke();
    }


    applyTranslation = () => {
        let translationX = parseFloat(document.querySelector('#translationX').value);
        let translationY = parseFloat(document.querySelector('#translationY').value);
        for (let i = 0; i < triangleArray.length; i++) {
            triangleArray[i][0] += translationX;
            triangleArray[i][1] += translationY;
        }
        return triangleArray;
    }


    applyAngle = () => {
        let angle = parseFloat(document.querySelector('#angle').value);
        let angleRadians = angle * Math.PI /180;

        let angleMatrix = [
            [Math.cos(angleRadians), -Math.sin(angleRadians)],
            [Math.sin(angleRadians), Math.cos(angleRadians)]
        ]

        triangleArray = multiplyMatrix(triangleArray, angleMatrix);
        return triangleArray;
    }

    multiplyMatrix = (triangleArrayInput, angleMatrix) => {
        let resultMatrix = [[0,0],[0,0],[0,0]];

        centroid = []
        centroid[0] = (triangleArray[0][0] + triangleArray[1][0] + triangleArray[2][0]) / 3;
        centroid[1] = (triangleArray[0][1] + triangleArray[1][1] + triangleArray[2][1]) / 3;
        console.log("Centroid = " + centroid);

        for (let i = 0; i < triangleArrayInput.length; i++) {
            for (let j = 0; j < angleMatrix[0].length; j++) {
                for (let k = 0; k < triangleArrayInput[i].length; k++) 
                {
                    resultMatrix[i][j] += (triangleArrayInput[i][k] - centroid[k]) * angleMatrix[k][j];
                }
                resultMatrix[i][j] +=  centroid[j];
            }
        }
        return resultMatrix;
    } 


    redrawTriangle = () => {
        redrawCoordinates();
        getCordinates();
        applyTranslation();
        applyAngle();
        drawTriangle();
    }

    document.querySelectorAll('.numberAngle').forEach((item) => item.addEventListener("keyup", () => redrawTriangle())); 
    document.querySelectorAll('.numberTranslation').forEach((item) => item.addEventListener("keyup", () => redrawTriangle())); 
    document.querySelectorAll('.triangleCordinate').forEach((item) => item.addEventListener("keyup", () => redrawTriangle())); 

    redrawTriangle();

    mouseWheel = (event) => {
        console.log("lalala");
        if(event.wheelDelta /120 > 0) {
            gridSize = (gridSize+3).between(1,200)?(gridSize+3):gridSize;
            xGridOffset = canvasWidth/gridSize/2;
            yGridOffset = canvasHeight/gridSize/2;
            xGridStartPoint.number = (xGridStartPoint.number - 2).between(1,10,true) ? (xGridStartPoint.number - 2): xGridStartPoint.number;
            yGridStartPoint.number = (yGridStartPoint.number - 2).between(1,10,true) ? (yGridStartPoint.number - 2): yGridStartPoint.number;
        }
        else{
            gridSize = (gridSize-3).between(1,200)?(gridSize-3):gridSize;;
            xGridOffset = canvasWidth/gridSize/2;
            yGridOffset = canvasHeight/gridSize/2;
            xGridStartPoint.number = (xGridStartPoint.number + 2).between(1,10,true) ? (xGridStartPoint.number + 2): xGridStartPoint.number;
            yGridStartPoint.number = (yGridStartPoint.number + 2).between(1,10,true) ? (yGridStartPoint.number + 2): yGridStartPoint.number;
        }
        redrawTriangle();
        return false;
    }

    document.querySelector('#canvas').addEventListener('mousewheel', (event) => mouseWheel(event));

    Number.prototype.between = (a, b, inclusive) => {
        let min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    };
});