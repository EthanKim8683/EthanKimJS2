# EthanKimJS
### Welcome to my JS library!
Here you will find all sorts of random JS junk that I use in my programs (accessible [here](https://www.khanacademy.org/profile/I2I0/projects).)

Here are the contents, and then the contents of *those* contents:
#### [WebGL_helper.js](https://github.com/EthanKim8683/EthanKimJS2/blob/main/WebGL_helper.js)
  - **createShader**: Creates a shader given an string.
  - **createProgram**: Creates program given a vertex and fragment shader.
  - **setAttrib**: Locates and supplies an attribute with a buffer.
  - **rotationMatrix**: Produces a rotation matrix given rotations about the x and y axes.
  - **projectionMatrix**: Produces a projection matrix given the FOV, aspect, near and far.
  - **cube**: Creates a cube with texcoords, positions and normals. (todo: color)
  - **createTex**: Creates a texture given pixel data, dimensions (optional: type, data type, internal type)
  - **bindUniformProgram**: Binds a program for uniforms to be located from
  - **getUniformLocation**: Locates uniforms
  - **EKGL**: A prefix that provides access to short names, here are their equivalents:
    - *Cshader*: createShader
    - *Cprogram*: createProgram
    - *Ctex*: createTex
    - *Buni*: bindUniformProgram
    - *Sattrib*: setAttrib
    - *Guni*: getUniformLocation
    - *Mrot*: rotationMatrix
    - *Mpro*: projectionMatrix
    - *cube*: cube
  
### Todo:
- [x] Check this box
- [ ] Simplify importing .obj files
- [ ] Improve cube function
- [ ] Refine and add parser

###### (Description last updated 2/20/21)
