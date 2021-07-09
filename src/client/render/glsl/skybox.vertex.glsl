#define FILL
precision {precision} float;

attribute vec2 a_pos;

uniform mat4 u_matrix_array[25];
uniform int u_coord_id;

varying vec4 v_pos;

void main() {
    vec4 pos = vec4(a_pos, 1., 1.);
    v_pos = pos;

    gl_Position = pos;
}
