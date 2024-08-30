#version 330 compatibility

uniform float uA, uB, uC, uD;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;

const float PI = 3.14159265359;

void
main( )
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	float r = sqrt((gl_Vertex.x)*(gl_Vertex.x)+(gl_Vertex.y)*(gl_Vertex.y));
	newVertex.z = uA * ( cos(2.*PI*uB*r+uC) * exp(-uD*r) );

	vec4 ECposition = gl_ModelViewMatrix * newVertex;
	float dzdr = uA * ( -sin(2.*PI*uB*r+uC) * 2.*PI*uB * exp(-uD*r) + cos(2.*PI*uB*r+uC) * -uD * exp(-uD*r) );
	float drdx = gl_Vertex.x/r;
	float drdy = gl_Vertex.y/r;
	float dzdx = dzdr * drdx; 
	float dzdy = dzdr * drdy;
	vec3 xtangent = vec3(1., 0., dzdx );
	vec3 ytangent = vec3(0., 1., dzdy);

	vec3 newNormal = normalize( gl_NormalMatrix * cross(xtangent, ytangent) ); // normal vector
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}
