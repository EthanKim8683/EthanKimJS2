parse = (program, file) => {
    
    const data = {
        
        "v"  : [], // Vertex positions
        "vt" : [], // Vertex texcoords
        "vn" : [], // Vertex normals
        "f"  : []  // Face indices
    }
    
    // Parse by line
    
    file.split("\n").forEach(i => {
        
        // If comment or blank line, return
        
        // If object, group, material or shading,
        // return (will add functionality later)
        
        const i0 = i[0]
        
        if(i0 == "#" ||  
            i0 == " " || 
            
            i0 == "u" || // usemtl
            i0 == "m" || // mtllib
            
            i0 == "o" || // object
            i0 == "s" || // smooth
            i0 == "g" || // group
            
            !i) return
        
        // Split along spaces
        
        i = i.trim().split(/\s+/g)
        
        // Add data to specified array
        
        data[i.splice(0,1)].push(i)
    })
    
    // Convert keyed list to ordered list
    
    const ordered = [
        
        data.v,
        data.vt,
        data.vn
    ]
    
    // Final array would include vertex data in
    // such a way that the entire object could be
    // drawn using gl.drawArrays
    
    // - Considering adding gl.drawElements
    //      functionality
    
    const final = [
        
        [], // Vertex positions
        [], // Vertex texcoords
        []  // Vertex normals
    ]
    
    // For each face, add associated vertex data
    // to final arrays
    
    data.f.forEach(i => {
        
        const il = i.length
        const v0 = i[0]       // Data of first vertex
        const t = Array(il-2) // Triangles from face
        
        // Converts polygons into triangles
        
        for(let n = 1; n < il-1; n ++) {
            
            t[n-1] = [v0, i[n], i[n+1]]
        }
        
        // For each triangle...
        
        t.forEach(o => {
            
            // For each vertex...
            
            o.forEach(k => {
                
                // Add vertex data to associated list
                // in final array
                
                k.split("/").forEach((p, l) => {
                    
                    final[l] = final[l].concat(ordered[l][p-1])
                })
            })
        })
    })
    
    const v = final[0]
    const len = v.length
    const tlen = len/3
    
    // Default arrays
    
    final[1] = final[1].length ? final[1] : Array(tlen*2).fill(0)
    final[2] = final[2].length ? final[2] : (() => {
        
        // Calculate normals
        
        let vn = []
        
        for(let n = 0; n < len; n += 9) {
            
            const p0x = v[n]
            const p0y = v[n+1]
            const p0z = v[n+2]
            
            const lex = v[n+3]-p0x
            const ley = v[n+4]-p0y
            const lez = v[n+5]-p0z
            
            const nex = v[n+6]-p0x
            const ney = v[n+7]-p0y
            const nez = v[n+8]-p0z
            
            let cpx = ley*nez-lez*ney
            let cpy = lez*nex-lex*nez
            let cpz = lex*ney-ley*nex
            
            const h = 1/Math.sqrt(cpx*cpx+cpy*cpy+cpz*cpz)
            
            cpx *= h
            cpy *= h
            cpz *= h
            
            vn = vn.concat([
                
                cpx, cpy, cpz,
                cpx, cpy, cpz,
                cpx, cpy, cpz
            ])
        }
        
        return vn
    })()
    
    // Create and bind vertex array object
    
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    
    // Set attributes
    
    setAttrib(program, "a_position", new Float32Array(v))
    setAttrib(program, "a_texcoord", new Float32Array(final[1]), 2)
    setAttrib(program, "a_normal", new Float32Array(final[2]))
    
    // Unbind for safety
    
    gl.bindVertexArray(null)
    
    return () => {
        
        // Draw function
        
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES,0,tlen);
        gl.bindVertexArray(null)
    }
}
