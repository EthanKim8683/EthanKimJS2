
/**
 * Parses .obj files. Returns data as following:
 * v  - Vertex positions
 * vt - Texture coordinates
 * vn - Vertex normals
 * f  - Arrays containing object, group and index data. Objects contain groups, which contain indices.
 * @param {string} file - Obj file
 */
parse = file => {
    
    const data = {
        
        "v"  : [], 			 		  // Vertex positions
        "vt" : [], 			 		  // Vertex texcoords
        "vn" : [], 			 		  // Vertex normals
        "f"  : []   		 	      // Face indices
    }
    
    data.f.push([[]])
    
    data.f[0].name = "Object 0"
    data.f[0][0].name = "Group 0"
    
    let this_object = 0
    let this_group = 0
    
    file.split("\n").forEach(i => {   // Parse by line
        
        const i0 = i[0]
        
        if(i0 == "#" ||               // comment
            i0 == " " || 			  // blank
            
            i0 == "u" ||	  	      // usemtl
            i0 == "m" || 	  	      // mtllib
            
            !i) return                // return if useless
        
        i = i.trim().split(/\s+/g)    // Split along spaces
        const t = i.splice(0, 1)[0]   // Get type
        
        switch (t) {
        
        	case "o" : 	  	          // new object
            
            	this_object = data.f.length
                
                data.f.push([[]])
                data.f[this_object].name = i.join(" ")
            break
            
            case "g" : 	  	          // new group
            
        		this_group = data.f[this_object].length
        
        		data.f[this_object].push([])
            	data.f[this_object][this_group].name = i.join(" ")
            break
            
            case "f" : 	  	          // new face
            
            	data.f[this_object][this_group].push(i)
            break
            
            case "s" : 	  	          // enable/disable smooth
            	
                const i0 = i[0]
                
                data.f[this_object][this_group].smooth = i0 != "off" && +i0
            break
            
            default :	 		      // Add data to proper array
            
            	data[t].push(i)
        }
    }) 
    
    const objects = []
    
    data.f.forEach(i => {             // Get rid of empty lists
        
        const object = []
        object.name = i.name
        
        i.forEach(o => {
        
        	if(o.length) object.push(o)
        })
        
        if(object.length) objects.push(object)
    })
    
    data.f = objects
    
    return data
}

/**
 * Constructs a VAO using data from parser.
 * @param {program} program - gl program
 * @param {keyed list} data - Data from parser
 * @param {keyed list} config - Transforms
 */
construct = (program, data, config) => {

	let normcoeff = 1

	if(config) {

		const scale = config.scale
		const xyz = config.xyz
		const flip_face = config.flip_face
		const flip_normal = config.flip_normal

		if(scale) {                   // Scale model

			const scaler = scale.length ? scale : Array(3).fill(scale)

			data.v = data.v.map(i => i.map((o, p) => o *= scaler[p]))
		}

		if(xyz) {					  // Switch x, y and z's

			data.v = data.v.map(i => {

				const rearr = []
				const order = "xyz"

				i.forEach((o, p) => {

					rearr[order.indexOf(xyz[p])] = o
				})

				return rearr
			})
		}

		if(flip_face) {				  // Flip faces inside-out

			data.f = data.f.map(i => {
				
				const oname = i.name
				const ooutput = i.map(o => {

					const gname = o.name
					const gsmooth = o.smooth
					const goutput = o.map(p => p.reverse())

					goutput.name = gname
					goutput.smooth = gsmooth

					return goutput
				})

				ooutput.name = oname

				return ooutput
			})
		}

		if(flip_normal) {			  // Flip normals

			normcoeff = -1
		}
	}
	
	// Convert keyed list to ordered list

	const ordered = [

		data.v,
		data.vt,
		data.vn
	]

	return data.f.map(i => {		  // For each object...

		return i.map(o => {			  // For each group...
			
			const gdata = [
				
				[],                   // Vertex positions
				[],                   // Texture coordinates
				[]                    // Vertex normals
			]

			let ix = []

			o.forEach(p => {	      // For each polygon...

				const pl = p.length
        		const v0 = p[0]
        		const t = Array(pl - 2)

				// Convert polygons into triangles

        		for(let n = 1; n < pl - 1; n ++) {

        		    t[n-1] = [v0, p[n], p[n + 1]]
        		}
        
				t.forEach(j => {      // For each triangle...
					
					j.forEach(k => {  // For each vertex...
						
						// Add vertex data to associated list
						// in final array
						
						k.split("/").forEach((p, l) => {
							
							gdata[l].push(...ordered[l][p - 1])
						})
					})
				})

				ix.push(...t)
			})

			let v = gdata[0]
    		const len = v.length
    		const tlen = len / 3

			// Default values

			gdata[1] = gdata[1].length ? gdata[1] : Array(tlen * 2).fill(0)
			gdata[2] = gdata[2].length ? gdata[2] : (() => {

				// If normals array is empty, calculate
				// normals

				const nv = []

				if(o.smooth) {

					// Extract vertex position data from
					// index data recorded previously

					ix = ix.map(w => w.map(b => {

						return [].concat(b.split("/"))[0]
					}))

					// If group has smoothing enabled
					// Calculate for smooth normals

					let nn = []

					ix.forEach(b => {

						const b0 = b[0] - 1
						const b1 = b[1] - 1
						const b2 = b[2] - 1
						
						const p0 = data.v[b0]
						const p1 = data.v[b1]
						const p2 = data.v[b2]

						const p0x = p0[0]
						const p0y = p0[1]
						const p0z = p0[2]

						const lex = p1[0] - p0x
						const ley = p1[1] - p0y
						const lez = p1[2] - p0z

						const nex = p2[0] - p0x
						const ney = p2[1] - p0y
						const nez = p2[2] - p0z

						const cpx = ley * nez - lez * ney
						const cpy = lez * nex - lex * nez
						const cpz = lex * ney - ley * nex

						nn[b0] ||= [0, 0, 0]
						nn[b1] ||= [0, 0, 0]
						nn[b2] ||= [0, 0, 0]

						const nn0 = nn[b0]
						const nn1 = nn[b1]
						const nn2 = nn[b2]

						nn0[0] += cpx
						nn0[1] += cpy
						nn0[2] += cpz

						nn1[0] += cpx
						nn1[1] += cpy
						nn1[2] += cpz

						nn2[0] += cpx
						nn2[1] += cpy
						nn2[2] += cpz
					})

					nn = nn.map(k => {

						if(!k) return

						const kx = k[0]
						const ky = k[1]
						const kz = k[2]

						const h = normcoeff / Math.sqrt(kx * kx + ky * ky + kz * kz)

						return [

							kx * h,
							ky * h,
							kz * h
						]
					})

					ix.forEach(b => {

						const b0 = b[0] - 1
						const b1 = b[1] - 1
						const b2 = b[2] - 1

						const nn0 = nn[b0]
						const nn1 = nn[b1]
						const nn2 = nn[b2]

						nv.push(

							nn0[0], nn0[1], nn0[2],
							nn1[0], nn1[1], nn1[2],
							nn2[0], nn2[1], nn2[2]
						)
					})
				}else{

					// If no smoothing, calculate normal
					// For each face

					for(let n = 0; n < len; n += 9) {
						
						const p0x = v[n]
						const p0y = v[n + 1]
						const p0z = v[n + 2]
						
						const lex = v[n + 3] - p0x
						const ley = v[n + 4] - p0y
						const lez = v[n + 5] - p0z
						
						const nex = v[n + 6] - p0x
						const ney = v[n + 7] - p0y
						const nez = v[n + 8] - p0z
						
						let cpx = ley * nez - lez * ney
						let cpy = lez * nex - lex * nez
						let cpz = lex * ney - ley * nex
						
						const h = normcoeff / Math.sqrt(cpx * cpx + cpy * cpy + cpz * cpz)
						
						cpx *= h
						cpy *= h
						cpz *= h
						
						nv.push(
							
							cpx, cpy, cpz,
							cpx, cpy, cpz,
							cpx, cpy, cpz
						)
					}
				}

				return nv
			})()

			// Create and bind vertex array object
			
			const vao = gl.createVertexArray()
			gl.bindVertexArray(vao)
			
			// Set attributes
			
			setAttrib(program, "a_position", new Float32Array(v))
			setAttrib(program, "a_texcoord", new Float32Array(gdata[1]), 2)
			setAttrib(program, "a_normal", new Float32Array(gdata[2]))
			
			// Unbind for safety
			
			gl.bindVertexArray(null)
			
			return () => {
				
				// Draw function
				
				gl.bindVertexArray(vao)
				gl.drawArrays(gl.TRIANGLES, 0, tlen)
				gl.bindVertexArray(null)
			}
		})
	})
}
