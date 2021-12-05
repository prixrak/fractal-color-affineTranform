window.addEventListener('DOMContentLoaded', function () {
    let grid_size = 20;
    let x_axis_distance_grid_lines = 15;
    let y_axis_distance_grid_lines = 15;
    let x_axis_starting_point = { number: 1, suffix: '' };
    let y_axis_starting_point = { number: 1, suffix: '' };

    let canvas = document.getElementById("canvasAffineTransform");
    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");

    let canvas_width = canvas.width;
    let canvas_height = canvas.height;



    function redrawCoordinates() {
        // Store the current transformation matrix

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let num_lines_x = Math.floor(canvas_height/grid_size);
        let num_lines_y = Math.floor(canvas_width/grid_size);

        // Draw grid lines along X-axis
        for(let i=0; i<=num_lines_x; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            
            // If line represents X-axis draw in different color
            if(i == x_axis_distance_grid_lines) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#e9e9e9";
            
            if(i == num_lines_x) {
                ctx.moveTo(0, grid_size*i);
                ctx.lineTo(canvas_width, grid_size*i);
            }
            else {
                ctx.moveTo(0, grid_size*i+0.5);
                ctx.lineTo(canvas_width, grid_size*i+0.5);
            }
            ctx.stroke();
        }

        // Draw grid lines along Y-axis
        for(i=0; i<=num_lines_y; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            
            // If line represents X-axis draw in different color
            if(i == y_axis_distance_grid_lines) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#e9e9e9";
            
            if(i == num_lines_y) {
                ctx.moveTo(grid_size*i, 0);
                ctx.lineTo(grid_size*i, canvas_height);
            }
            else {
                ctx.moveTo(grid_size*i+0.5, 0);
                ctx.lineTo(grid_size*i+0.5, canvas_height);
            }
            ctx.stroke();
        }

        // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
        ctx.translate(y_axis_distance_grid_lines*grid_size, x_axis_distance_grid_lines*grid_size);

        // Ticks marks along the positive X-axis
        for(i=1; i<(num_lines_y - y_axis_distance_grid_lines); i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            // Draw a tick mark 6px long (-3 to 3)
            ctx.moveTo(grid_size*i+0.5, -3);
            ctx.lineTo(grid_size*i+0.5, 3);
            ctx.stroke();

            // Text value at that point
            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(x_axis_starting_point.number*i + x_axis_starting_point.suffix, grid_size*i-2, 15);
        }

        // Ticks marks along the negative X-axis
        for(i=1; i<y_axis_distance_grid_lines; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            // Draw a tick mark 6px long (-3 to 3)
            ctx.moveTo(-grid_size*i+0.5, -3);
            ctx.lineTo(-grid_size*i+0.5, 3);
            ctx.stroke();

            // Text value at that point
            ctx.font = '9px Arial';
            ctx.textAlign = 'end';
            ctx.fillText(-x_axis_starting_point.number*i + x_axis_starting_point.suffix, -grid_size*i+3, 15);
        }

        // Ticks marks along the positive Y-axis
        // Positive Y-axis of graph is negative Y-axis of the canvas
        for(i=1; i<(num_lines_x - x_axis_distance_grid_lines); i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            // Draw a tick mark 6px long (-3 to 3)
            ctx.moveTo(-3, grid_size*i+0.5);
            ctx.lineTo(3, grid_size*i+0.5);
            ctx.stroke();

            // Text value at that point
            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(-y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, grid_size*i+3);
        }

        // Ticks marks along the negative Y-axis
        // Negative Y-axis of graph is positive Y-axis of the canvas
        for(i=1; i<x_axis_distance_grid_lines; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";

            // Draw a tick mark 6px long (-3 to 3)
            ctx.moveTo(-3, -grid_size*i+0.5);
            ctx.lineTo(3, -grid_size*i+0.5);
            ctx.stroke();

            // Text value at that point
            ctx.font = '9px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, -grid_size*i+3);
        }
    }

    redrawCoordinates();

    let triangleArray = [[],[],[]];

    function getCordinates() {
        let triangleX1 = parseFloat($('#triangleX1').val());
        let triangleY1 = parseFloat($('#triangleY1').val());
        let triangleX2 = parseFloat($('#triangleX2').val());
        let triangleY2 = parseFloat($('#triangleY2').val());
        let triangleX3 = parseFloat($('#triangleX3').val());
        let triangleY3 = parseFloat($('#triangleY3').val());

        triangleArray[0][0] = triangleX1;
        triangleArray[0][1] = triangleY1;
        triangleArray[1][0] = triangleX2;
        triangleArray[1][1] = triangleY2;
        triangleArray[2][0] = triangleX3;
        triangleArray[2][1] = triangleY3;

        console.log(triangleArray);
        return triangleArray;
    }

    function drawTriangle() {
        ctx.beginPath();
        ctx.moveTo(triangleArray[0][0]/x_axis_starting_point.number*grid_size,-triangleArray[0][1]/y_axis_starting_point.number*grid_size);
        ctx.lineTo(triangleArray[1][0]/x_axis_starting_point.number*grid_size,-triangleArray[1][1]/y_axis_starting_point.number*grid_size);
        ctx.lineTo(triangleArray[2][0]/x_axis_starting_point.number*grid_size,-triangleArray[2][1]/y_axis_starting_point.number*grid_size);
        ctx.closePath();
        ctx.stroke();
    }


    function applyTranslation() {
        let translationX = parseFloat($('#TranslationX').val());
        let translationY = parseFloat($('#TranslationY').val());
        for (let i = 0; i < triangleArray.length; i++) {
            triangleArray[i][0]+=translationX;
            triangleArray[i][1]+=translationY;
        }
        return triangleArray;
    }


    function applyAngle(){
        let angle = parseFloat($('#Angle').val());
        let angleRadians = angle * Math.PI /180;

        let angleMatrix = [
            [Math.cos(angleRadians), -Math.sin(angleRadians)],
            [Math.sin(angleRadians), Math.cos(angleRadians)]
        ]

        triangleArray = multiplyMatrix(triangleArray, angleMatrix);
        return triangleArray;
    }

    function multiplyMatrix(triangleArrayInput, angleMatrix){
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




    function redrawTriangle() {
        redrawCoordinates();
        getCordinates();
        applyTranslation();
        applyAngle();
        drawTriangle();
    }

    $('.numberAngle').keyup(() => {
        redrawTriangle();
    }
    )

    $('.numberTranslation').keyup(() => {
        redrawTriangle();

    }
    )

    $('.triangleCordinate').keyup(() => {
        redrawTriangle();
    }
    )

    redrawTriangle();

    function mouseWheel(event) {
        if(event.originalEvent.wheelDelta /120 > 0) {
            grid_size = (grid_size+3).between(1,200)?(grid_size+3):grid_size;
            x_axis_distance_grid_lines = canvas_width/grid_size/2;
            y_axis_distance_grid_lines = canvas_height/grid_size/2;
            x_axis_starting_point.number = (x_axis_starting_point.number - 2).between(1,10,true) ? (x_axis_starting_point.number - 2): x_axis_starting_point.number;
            y_axis_starting_point.number = (y_axis_starting_point.number - 2).between(1,10,true) ? (y_axis_starting_point.number - 2): y_axis_starting_point.number;
        }
        else{
            grid_size = (grid_size-3).between(1,200)?(grid_size-3):grid_size;;
            x_axis_distance_grid_lines = canvas_width/grid_size/2;
            y_axis_distance_grid_lines = canvas_height/grid_size/2;
            x_axis_starting_point.number = (x_axis_starting_point.number + 2).between(1,10,true) ? (x_axis_starting_point.number + 2): x_axis_starting_point.number;
            y_axis_starting_point.number = (y_axis_starting_point.number + 2).between(1,10,true) ? (y_axis_starting_point.number + 2): y_axis_starting_point.number;
        }
        redrawTriangle();
        return false;
    }

    function animateDrow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, -canvas.width, canvas.height);
        ctx.clearRect(0, 0, -canvas.width, -canvas.height);
        ctx.clearRect(0, 0, canvas.width, -canvas.height);
        ctx.save();
        redrawTriangle();

        window.requestAnimationFrame(animateDrow);

    }



    $(document).ready(function(){
        $('#canvasAffineTransform').bind('mousewheel', mouseWheel);
    });

    Number.prototype.between = function(a, b, inclusive) {
        let min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    };
});