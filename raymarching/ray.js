ray = {};

(function() 
{
	var vsSource = `
		attribute vec4 position;

		void main()
		{
			gl_Position = position;
		}
	`;

	var fsSource = `
		precision highp float;
		uniform vec4 frameParams; // { screen_width, scree_height, 0, 0 }

		float sphere(vec3 pos, vec3 o, float r)
		{
			return length(pos - o) - r;
		}

		float distance_field(vec3 pos)
		{
			float dist = min(
				sphere(pos, vec3(1.0, 0.0, 5.0), 2.0), 
				sphere(pos, vec3(-1.0, 0.0, 5.0), 2.0));

			dist = min(dist,
				sphere(pos, vec3(0.0, 1.0, 5.0), 2.0));

			dist = min(dist,
				sphere(pos, vec3(0.0, -1.0, 5.0), 2.0));

			return dist;
		}

		vec3 calc_normal(vec3 pos)
		{
			const float offset = 0.001;
			vec3 delta = vec3(
				distance_field(vec3(pos.x + offset, pos.y, pos.z)) - distance_field(vec3(pos.x - offset, pos.y, pos.z)),
				distance_field(vec3(pos.x, pos.y + offset, pos.z)) - distance_field(vec3(pos.x, pos.y - offset, pos.z)),
				distance_field(vec3(pos.x, pos.y, pos.z + offset)) - distance_field(vec3(pos.x, pos.y, pos.z - offset))
				);
			return normalize(delta);
		}

		float sample(vec3 origin, vec3 dir)
		{
			float t = 0.0;
			for (int i = 0; i < 20; i++)
			{
				float dist = distance_field(origin + dir * t);

				if (dist < 0.01)
				{
					return t;
				}

				t += dist;

				if (t > 100.0) // far most
				{
					return 100.0;
				}
			}

			return 100.0;
		}

		vec4 image(vec2 pos)
		{
			vec3 origin = vec3(0, 0, 0);
			vec3 dir = normalize(vec3(pos.x, pos.y, 1)); // left-handed?
			float dist = sample(origin, dir);
			vec3 normal = calc_normal(origin + dist * dir);
			float value = 1.0 - dist / 100.0;

			//vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
			vec3 lightDir = vec3(0, 0, -1);

			value = value * (pow(dot(normal, lightDir), 4.0) + 0.1);

			return vec4(value, value, value, 1.0);
		}

		void main()
		{
			vec2 pos = (gl_FragCoord.xy - 0.5) / frameParams.xy;
			pos = pos * 2.0 - 1.0;
			pos.x *= (frameParams.x / frameParams.y);
			gl_FragColor = image(pos);
		}
	`;

	function compileShader(gl, type, source)
	{
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			var log = gl.getShaderInfoLog(shader);
			console.log('shader compile error: ' + log);

			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	function linkProgram(gl, vsSource, fsSource)
	{
		var vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
		var fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) 
		{
			gl.deleteProgram(program);
			return null;
		}

		var ret = {
			program: program,
			vs: vs,
			fs: fs,
		};
		return ret;
	}

	ray.init = function(gl, width, height)
	{
		ray.width = width;
		ray.height = height;

		ray.program = linkProgram(gl, vsSource, fsSource);

		ray.vbo = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, ray.vbo);
		const positions = [
			1.0, 1.0,
			-1.0, 1.0,
			1.0, -1.0,
			-1.0, -1.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array(positions), 
			gl.STATIC_DRAW);

		var pos_loc = gl.getAttribLocation(
			ray.program.program, 
			'position'
			);

		gl.vertexAttribPointer(
			pos_loc, 		// location
			2,				// num of components
			gl.FLOAT,		// type
			false,			// normalize
			0,				// stride
			0);				// offset

		gl.enableVertexAttribArray(pos_loc);

		gl.useProgram(ray.program.program);

		ray.param_loc = gl.getUniformLocation(
			ray.program.program,
			'frameParams'
			);
	};

	ray.draw = function(gl)
	{
		gl.uniform4fv(ray.param_loc, [ray.width, ray.height, 0, 0]);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

}) ();
