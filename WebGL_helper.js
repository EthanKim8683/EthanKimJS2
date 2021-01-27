var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true, antialias:false})

var EKGL = function() {
    
this.createShader = function(type,code) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader,code);
	gl.compileShader(shader);
	return shader;
};
    
this.createProgram = function(vertexCode,fragmentCode) {
	var vertexShader = createShader(gl.VERTEX_SHADER,vertexCode);
	var fragmentShader = createShader(gl.FRAGMENT_SHADER,fragmentCode);
	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	gl.detachShader(program, vertexShader);
	gl.deleteShader(vertexShader);
	gl.detachShader(program, fragmentShader);
	gl.deleteShader(fragmentShader);
	return program;
}

this.rotate3D = function(rx,ry) {
    var 
    cx = Math.cos(ry),
    sx = Math.sin(ry),
    cy = Math.cos(rx),
    sy = Math.sin(rx);
    return [
        cy,-sy*sx,-sy*cx,
        0,cx,-sx,
        sy,sx*cy,cx*cy,
    ];
};
	
};
