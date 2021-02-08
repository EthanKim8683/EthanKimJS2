var canvas = document.getElementById("canvas")
var gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true, antialias:false})
    
function createShader(type,code) {
	
	var shader = gl.createShader(type);
	gl.shaderSource(shader,code);
	gl.compileShader(shader);
	return shader;
};
    
function createProgram(vID,fID) {
	
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

function setAttrib(program,name,array,count,buffer,type) {
        
        var buf = gl.createBuffer();
        var _buffer = buffer || gl.ARRAY_BUFFER;
        var _type = type || gl.FLOAT;
        var _count = count || 3;
        gl.bindBuffer(_buffer,buf);
        gl.bufferData(_buffer,array,gl.STATIC_DRAW);
	
	if(program.length) {
		
		for(let i=0;i<program.length;i++) {
			
        		var loc = gl.getAttribLocation(program[i],name);
        		gl.enableVertexAttribArray(loc);
        		gl.vertexAttribPointer(loc,_count,_type,false,0,0);
		}
	}else{
		
        	var loc = gl.getAttribLocation(program,name);
        	gl.enableVertexAttribArray(loc);
        	gl.vertexAttribPointer(loc,_count,_type,false,0,0);
	}
};

function rotationMatrix(rx,ry) {
	
	var cx = Math.cos(ry),
	    sx = Math.sin(ry),
	    cy = Math.cos(rx),
	    sy = Math.sin(rx);
	return [
		cy,   -sy*sx, -sy*cx, 0,
		0,     cx,    -sx,    0,
		sy,    sx*cy,  cx*cy, 0,
		0,     0,      0,     1
	];
};

function projectionMatrix(fov,aspect,near,far) {
	
	var f = 1/Math.tan(fov*0.5);
	var irange = 1/(near-far);
	
	return [
		f/aspect, 0, 0,                  0,
		0,        f, 0,                  0,
		0,        0, (near+far)*irange, -1,
		0,        0, 2*near*far*irange,  0
	];
};

function cube(program,x,y,z,l,h,w) {
        
        const data = {};
        data.vao = gl.createVertexArray();
        gl.bindVertexArray(data.vao);
        
        const normals = [];
        
        const positions = [
		
		// x
		
		x,  y+h,z,
		x,  y,  z,
		x,  y+h,z+w,
		
		x,  y+h,z+w,
		x,  y,  z,
		x,  y,  z+w,
		
		x+l,y,  z,
		x+l,y+h,z,
		x+l,y+h,z+w,
		
		x+l,y,  z+w,
		x+l,y,  z,
		x+l,y+h,z+w,
		
		// y
		
		x,  y,  z,
		x+l,y,  z,
		x+l,y,  z+w,
		
		x,  y,  z+w,
		x,  y,  z,
		x+l,y,  z+w,
		
		x+l,y+h,z,
		x,  y+h,z,
		x+l,y+h,z+w,
		
		x+l,y+h,z+w,
		x,  y+h,z,
		x,  y+h,z+w,
		
		// z
		
		x+l,y+h,z,
		x,  y,  z,
		x,  y+h,z,
		
		x+l,y,  z,
		x,  y,  z,
		x+l,y+h,z,
		
		x,  y+h,z+w,
		x,  y,  z+w,
		x+l,y+h,z+w,
		
		x,  y,  z+w,
		x+l,y,  z+w,
		x+l,y+h,z+w,
        ];
        
        const texcoords = [
		
		// x
		
		0,1,0,0,1,1,
		1,1,0,0,1,0,
		
		0,0,1,0,1,1,
		0,1,0,0,1,1,
		
		// y 
		
		0,0,1,0,1,1,
		0,1,0,0,1,1,
		
		1,0,0,0,1,1,
		1,1,0,0,0,1,
		
		// z
		
		1,1,0,0,0,1,
		1,0,0,0,1,1,
		
		0,1,0,0,1,1,
		0,0,1,0,1,1,
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

function createTex(data,width,height,type,dtype,itype) {
	
	var _dtype = dtype || gl.UNSIGNED_BYTE;
	var _type = type || gl.RGB;
	var _itype = itype || _type;
	
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,tex);
	gl.texImage2D(gl.TEXTURE_2D,0,_itype,width,height,0,_type,_dtype,data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	return tex;
};
