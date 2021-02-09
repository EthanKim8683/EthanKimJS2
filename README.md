# EthanKimJS2
### Welcome to my (**slightly improved**) JS library!
Here you will find all sorts of random JS junk that I use in my programs (accessible [here](https://www.khanacademy.org/profile/I2I0/projects).)

Here are the contents, and then the contents of *those* contents:
#### [WebGL_helper.js](https://github.com/EthanKim8683/EthanKimJS2/blob/main/WebGL_helper.js)
  - **createShader**(*type,code*): Creates a shader given an string.
  - **createProgram**(*vID,fID*): Creates program given a vertex and fragment shader.
  - **setAttrib**(*program,name,array,count,buffer,type*): Locates and supplies an attribute with a buffer.
  - **rotationMatrix**(*rx,ry*): Produces a rotation matrix given rotations about the x and y axes.
  - **projectionMatrix**(*fov,aspect,near,far*): Produces a projection matrix given the FOV, aspect, near and far.
  - **cube**(*program,x,y,z,l,h,w*): Creates a cube with texcoords, positions and normals. (todo: color)
  - **createTex**(*data,width,height,type,dtype,itype*): Creates a texture given pixel data, dimensions (optional: type, data type, internal type)
  
### Todo:
- [x] Check this box
- [ ] Simplify importing .obj files
- [ ] Improve cube function
- [ ] Refine and add parser

###### (Description last updated 2/8/21)
