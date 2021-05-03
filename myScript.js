var canvas = document.getElementById('myCanvas'),
fgx = document.getElementById('gx'),
fhx = document.getElementById('hx'),
fix = document.getElementById('ix'),
vRangeK = document.getElementById('rangeK'),
vRangeL = document.getElementById('rangeL'),
outputK = document.getElementById('outputK'),
outputL = document.getElementById('outputL'),
cbgx = document.getElementById('cbShowGX'),
cbhx = document.getElementById('cbShowHX'),
cbix = document.getElementById('cbShowIG'),

c = canvas.getContext('2d'),
grid = true,
gx = false,
hx = false,
ix = false,
showfxv = true,
showgxv = true,
showhxv = true,
showixv = true,
rangeK = false,
rangeL = false,
variableK = 0,
variableL = 0,


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
expr,
exprgx,
exprhx,
exprix,
scope = { x : 0};


c.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawAxis();
initTextField();
outputK.innerHTML = variableK;
outputL.innerHTML = variableL;

function draw(){
  console.log(showgxv);
  if(!rangeK)
    variableK = 0;
  if(!rangeL)
    variableL = 0;
  // calcRoots(expr);
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawAxis();
  if(showfxv){
  drawCurve(expr,"red");
  drawLimits(expr);
  }
  if(showgxv){
  drawCurve(exprgx,"blue");
  drawLimits(exprgx);
  }
  if(showhxv){
  drawCurve(exprhx,"green");
  drawLimits(exprhx);
  } 
  if(showixv){
  drawCurve(exprix,"yellow");
  drawLimits(exprix);
  }
}


// function calcRoots(val){
//   try {
//     var sol = nerdamer.solveEquations(val,'x');
//     outputRoot.textContent = sol.toString();
//   }
//   catch(err) {
//     outputRoot.textContent = 'f(x) has no zeros';
//   }
// }

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



function drawCurve(val,color){
    tree = math.parse(val.replace(/k/gi,variableK).replace(/l/gi,variableL),scope);


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
    c.lineWidth = 2.5;
    c.strokeStyle = color;

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

function drawLimits(val){
  tree = math.parse(val.replace(/k/gi,variableK).replace(/l/gi,variableL),scope);
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
    var inputFX = $('#inputFieldFunctionFX');
    var inputGX = $('#inputFieldFunctionGX');
    var inputHX = $('#inputFieldFunctionHX');
    var inputIX = $('#inputFieldFunctionIX');
    

      // Set the initial text value programmatically using jQuery.
      inputFX.val(expr);
      
      // Listen for changes using jQuery.
      inputFX.keyup(function (event) {
        expr = inputFX.val();
        draw();
      });

      inputGX.keyup(function (event) {
        exprgx = inputGX.val();
        draw();
      });

      inputHX.keyup(function (event) {
        exprhx = inputHX.val();
        draw();
      });

      inputIX.keyup(function (event) {
        exprix = inputIX.val();
        draw();
      });
}



function cbGridFunction() {
  var gridCB = document.getElementById('cbShowGrid');
  if (gridCB.checked == true){
        grid = true;
  } else {
     grid = false;
  }
  draw();
}

function showFX(){
  if(!showfxv){
    showfxv = true;
  }else if(showfxv){
    showfxv = false;
  }
  draw();
}

function showGX(){
  if(!showgxv){
    showgxv = true;
  }else if(showgxv){
    showgxv = false;
  }
  draw();
}

function showHX(){
  if(!showhxv){
    showhxv = true;
  }else if(showhxv){
    showhxv = false;
  }
  draw();
}

function showIX(){
  if(!showixv){
    showixv = true;
  }else if(showixv){
    showixv = false;
  }
  draw();
}

function addFunctionInput(){
  if(gx == false){
    fgx.style.visibility = "visible";
    gx = true;
    showgxv = true;
    if (!cbgx.checked)
      showgxv = false;
  }else if(hx == false){
    fhx.style.visibility = "visible";
    hx = true;
    showhxv = true;
    if (!cbhx.checked)
      showhxv = false;
  }else if(ix == false){
    fix.style.visibility = "visible";
    ix = true;
    showixv = true;
    if (!cbix.checked)
      showixv = false;
  }
  draw();
}

function removeFunctionInput(){
  if(ix){
    fix.style.visibility = "hidden";
    ix = false;
    showixv = false;
  }else if(hx){
    fhx.style.visibility = "hidden";
    hx = false;
    showhxv = false;
  }else if(gx){
    fgx.style.visibility = "hidden";
    gx = false;
    showgxv = false;
  }
  draw();
}

function addVariableInput(){
  if(rangeK == false){
    vRangeK.style.visibility = "visible";
    rangeK = true;
  }else if(rangeL == false){
    vRangeL.style.visibility = "visible";
    rangeL = true;
  }
  draw();
}

function removeVariableInput(){
  if(rangeL){
    vRangeL.style.visibility = "hidden";
    rangeL = false;
  }else if(rangeK){
    vRangeK.style.visibility = "hidden";
    rangeK = false;
  }
  draw();
}

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

function changeVariableK(val){
  variableK = val;
  outputK.innerHTML = variableK;
  draw();
}

function changeVariableL(val){
  variableL = val;
  outputL.innerHTML = variableL;
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




