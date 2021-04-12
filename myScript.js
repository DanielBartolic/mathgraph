var canvas = document.getElementById('myCanvas'),
outputRoot = document.getElementById("root"),

c = canvas.getContext('2d'),
grid = false,


canvas_height = canvas.height,
canvas_width = canvas.width,

grid_size = 100,
num_lines_x = Math.floor(canvas_height/grid_size),
num_lines_y = Math.floor(canvas_width/grid_size),
x_axis_distance_grid_lines = num_lines_x/2,
y_axis_distance_grid_lines = num_lines_y/2,


n = 1000,

coordinateSystemSizeX = x_axis_distance_grid_lines,
coordinateSystemSizeY = y_axis_distance_grid_lines,

math = mathjs(),
expr = '3*x+2',
scope = { x : 0},
tree = math.parse(expr,scope);

draw();
initTextField();
// initTextFieldLines();

function draw(){
  calcRoots();
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawAxis();
  drawCurve();
  drawLimits();
}




function calcRoots(){
  
  try {
    var sol = nerdamer.solveEquations(expr,'x');
    outputRoot.textContent = sol.toString();
  }
  catch(err) {
    outputRoot.textContent = 'f(x) has no zeros';
  }
}

function drawGrid(){
  if(grid){
  for(var i=0; i<=num_lines_x; i++) {
    c.beginPath();
    c.lineWidth = 1;
    c.strokeStyle = "#e9e9e9";
    
    if(i == num_lines_x) {
        c.moveTo(0, grid_size*i);
        c.lineTo(canvas_width, grid_size*i);
        c.moveTo(grid_size*i, 0);
        c.lineTo(grid_size*i, canvas_height);
    }
    else {
        c.moveTo(0, grid_size*i+0.5);
        c.lineTo(canvas_width, grid_size*i+0.5);
        c.moveTo(grid_size*i+0.5, 0);
        c.lineTo(grid_size*i+0.5, canvas_height);
    }
    c.stroke();
    }
  }
}


function drawAxis(){
  var i = x_axis_distance_grid_lines;
  c.beginPath();
  c.lineWidth = 1;
  c.strokeStyle = "#000000";
  c.moveTo(0, grid_size*i+0.5);
  c.lineTo(canvas_width, grid_size*i+0.5);
  c.moveTo(grid_size*i+0.5, 0);
  c.lineTo(grid_size*i+0.5, canvas_height);
  c.stroke();
}



function drawCurve(){
var
i,xPixel,yPixel,
percentX,percentY,
mathX, mathY,
previousY,
previousX,
dist = 0,

xMin = -1 * coordinateSystemSizeX,
xMax = 1 * coordinateSystemSizeX,
yMin = -1 * coordinateSystemSizeY,
yMax = 1 * coordinateSystemSizeY;



    c.beginPath();
    c.strokeStyle = "red";

    for(i = 0; i < n; i++){
        
        percentX = i / (n-1);
        mathX = percentX * (xMax - xMin) +xMin;
         
        mathY = evaluateMathExpr(mathX);

        percentY = (mathY - yMin) / (yMax - yMin);

        percentY = 1 - percentY;


        xPixel = percentX * canvas.width;
        yPixel = percentY * canvas.height;

          dist = Math.sqrt( Math.pow((previousX-xPixel), 2) + Math.pow((previousY-yPixel), 2) );
          if(dist > canvas_height){
            c.closePath();
          }else{
            c.moveTo(previousX,previousY);
            c.lineTo(xPixel,yPixel);
          }

        previousY = yPixel;
        previousX = xPixel;
        
        

        

    }
    c.stroke();
}

function drawLimits(){
    var
    i,xPixel,yPixel,
    percentX,percentY,
    mathX, mathY,
    previousY,
    previousX,
    dist = 0,
    
    xMin = -1 * coordinateSystemSizeX,
    xMax = 1 * coordinateSystemSizeX,
    yMin = -1 * coordinateSystemSizeY,
    yMax = 1 * coordinateSystemSizeY;
    
    
        for(i = 0; i < n; i++){
            
            percentX = i / (n-1);
            mathX = percentX * (xMax - xMin) +xMin;
             
            mathY = evaluateMathExpr(mathX);
    
    
            percentY = (mathY - yMin) / (yMax - yMin);
    
            percentY = 1 - percentY;
    
            xPixel = percentX * canvas.width;
            yPixel = percentY * canvas.height;


            dist = Math.sqrt( Math.pow((previousX-xPixel), 2) + Math.pow((previousY-yPixel), 2) );
            if(dist > canvas_height/3){
              c.strokeStyle = "green";
              c.beginPath();
              c.setLineDash([5, 15]);
              c.moveTo(previousX,previousY);
              c.lineTo(xPixel,yPixel);
              c.stroke();
              c.setLineDash([0, 0]);
            }else{
              
            }
  
            previousY = yPixel;
            previousX = xPixel;
        }

    }

function evaluateMathExpr(mathX){
    var mathY;
    scope.x = mathX;
    mathY = tree.eval();
    return mathY;
}

function initTextField(){
    var input = $('#inputFieldFunction');
    

      // Set the initial text value programmatically using jQuery.
      input.val(expr);
      
      // Listen for changes using jQuery.
      input.keyup(function (event) {
        expr = input.val();
        tree = math.parse(expr,scope);
        draw();
      });
}

function cbFunction() {
  var gridCB = document.getElementById('cbShowGrid');
  if (gridCB.checked == true){
        grid = true;
  } else {
     grid = false;
  }
  draw();
}

// function initTextFieldLines(){
//     var input = $('#inputFieldLines');

//       // Set the initial text value programmatically using jQuery.
//       input.val(n);
      
//       // Listen for changes using jQuery.
//       input.keyup(function (event) {
//         n = input.val();
//         n++;
//         draw();
//       });
// }

function sliderChange(val) {
  
  switch(val) {
    
            case "1": val= 20 ; break;
            case "2": val = 40 ; break;
            case "3": val = 50 ; break;
            case "4": val = 80 ; break;
            case "5": val = 100 ; break;
            case "6": val = 200 ; break;
            
          }
          variables(val);
          draw();
}

function variables(x){
  grid_size = x;
  num_lines_x = Math.floor(canvas_height/grid_size);
  num_lines_y = Math.floor(canvas_width/grid_size);
  x_axis_distance_grid_lines = num_lines_x/2;
  y_axis_distance_grid_lines = num_lines_y/2;

  coordinateSystemSizeX = x_axis_distance_grid_lines;
  coordinateSystemSizeY = y_axis_distance_grid_lines;
}




