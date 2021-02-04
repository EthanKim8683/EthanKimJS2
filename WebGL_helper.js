var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true, antialias:false})
    
var createShader = function(type,code) {
	
	var shader = gl.createShader(type);
	gl.shaderSource(shader,code);
	gl.compileShader(shader);
	return shader;
};
    
var createProgram = function(vID,fID) {
	
	var vertexCode = document.getElementById(vID).text.trim()
	var fragmentCode = document.getElementById(fID).text.trim()
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
};

var setAttrib = function(program,name,array,count,buffer,type) {
        
        var loc = gl.getAttribLocation(program,name);
        var buf = gl.createBuffer();
        var _buffer = buffer || gl.ARRAY_BUFFER;
        var _type = type || gl.FLOAT;
        var _count = count || 3;
        gl.bindBuffer(_buffer,buf);
        gl.bufferData(_buffer,array,gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc,_count,_type,false,0,0);
};

var rotate3D = function(rx,ry) {
	
	var cx = Math.cos(ry),
	    sx = Math.sin(ry),
	    cy = Math.cos(rx),
	    sy = Math.sin(rx);
	return [
		cy,-sy*sx,-sy*cx,
		0,cx,-sx,
		sy,sx*cy,cx*cy,
	];
};

function cube(program,x,y,z,l,h,w) {
        
        const data = {};
        data.vao = gl.createVertexArray();
        gl.bindVertexArray(data.vao);
        
        const normals = [];
        
        const positions = [
		
		// x
		
		x,  y,  z,
		x,  y+h,z,
		x,  y+h,z+w,
		
		x,  y,  z,
		x,  y+h,z+w,
		x,  y,  z+w,
		
		x+l,y+h,z,
		x+l,y,  z,
		x+l,y+h,z+w,
		
		x+l,y,  z,
		x+l,y,  z+w,
		x+l,y+h,z+w,
		
		// y
		
		x+l,y,  z,
		x,  y,  z,
		x+l,y,  z+w,
		
		x,  y,  z,
		x,  y,  z+w,
		x+l,y,  z+w,
		
		x,  y+h,z,
		x+l,y+h,z,
		x+l,y+h,z+w,
		
		x,  y+h,z,
		x+l,y+h,z+w,
		x,  y+h,z+w,
		
		// z
		
		x,  y,  z,
		x+l,y+h,z,
		x,  y+h,z,
		
		x,  y,  z,
		x+l,y,  z,
		x+l,y+h,z,
		
		x,  y,  z+w,
		x,  y+h,z+w,
		x+l,y+h,z+w,
		
		x+l,y,  z+w,
		x,  y,  z+w,
		x+l,y+h,z+w,
        ];
	
	
        
        const texcoords = [
		
		// x
		
		0,0,0,1,1,1,
		0,0,1,1,1,0,
		
		1,0,0,0,1,1,
		0,0,0,1,1,1,
		
		// y 
		
		1,0,0,0,1,1,
		0,0,0,1,1,1,
		
		0,0,1,0,1,1,
		0,0,1,1,0,1,
		
		// z
		
		0,0,1,1,0,1,
		0,0,1,0,1,1,
		
		0,0,0,1,1,1,
		1,0,0,0,1,1,
        ];
        
        for(let i=0;i<3;i++) {
		const t = [0,0,0];
		for(let o=0;o<2;o++) {
			for(let p=0;p<6;p++) {
				t[i] = (o-1)*2+1;
				normals.push(t[0],t[1],t[2]);
			}
		}
        }
        
        setAttrib(program,"a_position",new Float32Array(positions));
        setAttrib(program,"a_texcoord",new Float32Array(texcoords),2);
        setAttrib(program,"a_normal",new Float32Array(normals));
        
        gl.bindVertexArray(null);
        
        data.draw = function() {
		
		gl.bindVertexArray(data.vao);
		gl.drawArrays(gl.TRIANGLES,0,36);
		gl.bindVertexArray(null);
        };
        
        return data;
};
