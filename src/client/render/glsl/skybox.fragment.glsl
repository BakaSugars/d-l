#define FILL
precision {precision} float;

uniform samplerCube u_sky_cube;
uniform vec4 u_color;
uniform mat4 u_matrix_array[25];
// uniform int u_coord_id;

varying vec4 v_pos;

void main() {
    vec4 texture_loc = u_matrix_array[24] * v_pos;
    gl_FragColor = textureCube(u_sky_cube, texture_loc.xyz / texture_loc.w);
}