//Joanne Afolabi

// Code for Lab3
var gl;
var canvas;
var shader;
var KeyCode;

var alpha;
var beta;
var gamma;
var gammaLoc;
var betaLoc;
var alphaLoc;

var tx;
var ty;
var sx;
var sy;
var Translate;
var Scaling;

function init(){
    alpha = 0.0;
    beta = 0.0;
    gamma = 0.0;
    tx = 0.0;
    ty = 0.0;
    sx = 1.0;
    sy = 1.0;

    //set up canvas
    canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //viewport & color 
    gl.viewport( 0, 0, 512, 512);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    
    //shader program
    shader = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( shader );

    Translate = gl.getUniformLocation(shader,"Translations");
    gl.uniform2f( Translate, tx, ty );

    Scaling = gl.getUniformLocation(shader, "Scaling");
    gl.uniform2f( Scaling, sx, sy );

    // will include depth test to render faces correctly
    gl.enable( gl.DEPTH_TEST );

    setupShape();
    render();
}

function setupShape() {
    // Vertices of Shape
    var vertices = [vec4(   0,    0,  0.5, 1), // p0
                    vec4(   0,  0.5,    0, 1), // p1
                    vec4(-0.5,    0,    0, 1), // p2
                    vec4(   0, -0.5,    0, 1), // p3                    
                    vec4( 0.5,    0,    0, 1), // p4
                    vec4(   0,    0, -0.5, 1)]; // p5

    // Colors at Vertices of Shape
    var vertexColors = [vec4( 0.0, 0.0, 1.0, 1.0), // p0
                        vec4( 0.0, 1.0, 1.0, 1.0), // p1
                        vec4( 0.5, 0.0, 0.5, 1.0), // p2
                        vec4( 0.0, 1.0, 0.0, 1.0), // p3
                        vec4( 1.0, 0.0, 1.0, 1.0), // p4
                        vec4( 1.0, 0.7, 0.3, 1.0),]; // p5

    // each triangle is described by three indices into
    // the array "vertices"
    var indexList = [0, 1, 2,
                     0, 2, 3,
                     0, 3, 4,
                     0, 4, 1,
                     5, 2, 1,
                     5, 3, 2,
                     5, 4, 3,
                     5, 1, 4,];
    
    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var myPosition = gl.getAttribLocation(shader, "myPosition");
    gl.vertexAttribPointer(myPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(myPosition);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    
    var myColor = gl.getAttribLocation(shader, "myColor");
    gl.vertexAttribPointer(myColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(myColor);
    
    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW);
}

function rotateShapeX(){
    alpha += 0.1;
    alphaLoc = gl.getUniformLocation(shader, "alpha")
    gl.uniform1f(alphaLoc, alpha);
}

function rotateShapeY(){
    beta += 0.1;
    betaLoc = gl.getUniformLocation(shader, "beta");
    gl.uniform1f(betaLoc, beta);
}

function rotateShapeZ(){
    gamma += 0.1;
    gammaLoc = gl.getUniformLocation(shader, "gamma")
    gl.uniform1f(gammaLoc, gamma);
}

function translateShape(key){
    if(key == "Left"){ 
        tx -= .05; 
    }
    if(key == "Right"){ 
        tx += .05; 
    }
    if(key == "Up"){ 
        ty += .05; 
    }
    if(key == "Down"){ 
        ty -= .05; 
    }
    gl.uniform2f(Translate, tx, ty);
}

function scaleShape(key) {
    if(key == 'O'){
        sx += .05;
    }
    if(key == 'I'){
        sy += .05;
    }
    gl.uniform2f(Scaling, sx, sy);
}

function Movekeys(event) {
  KeyCode= event.keyCode;
  if(KeyCode == 65) {translateShape("Left");}
  if(KeyCode == 68) {translateShape("Right");}
  if(KeyCode == 87) {translateShape("Up");}
  if(KeyCode == 83) {translateShape("Down");}
  if(KeyCode == 90) {rotateShapeZ();}
  if(KeyCode == 88) {rotateShapeX();}
  if(KeyCode == 89) {rotateShapeY();}
  if(KeyCode == 79) {scaleShape('O');}
  if(KeyCode == 73) {scaleShape('I');}
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var numVertices = 24;
    gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);

    requestAnimFrame(render);
}
