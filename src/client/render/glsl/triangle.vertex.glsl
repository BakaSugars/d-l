#define FILL
precision {precision} float;

attribute vec3 a_pos;
attribute float a_infos;
attribute vec4 a_color;

uniform mat4 u_matrix_array[25];
uniform int u_coord_id;
varying vec4 v_color;

void main() {
    float infos = float(a_infos);
    float offsetY = mod(a_infos, 2.) - 0.5;
    infos = (infos - mod(a_infos, 2.)) / 2.;
    float offsetX = mod(infos, 2.) - 0.5;
    float size = (infos - mod(infos, 2.)) / 2.;
    vec2 offset = vec2(offsetX, offsetY) * size;
    vec3 pos = a_pos + vec3(offset, 0);
    
    // float color = float(a_color);
    // float a = mod(color, 256.) / 255.;
    // color = (color - a) / 256.;
    // float b = mod(color, 256.) / 255.;
    // color = (color - a) / 256.;
    // float g = mod(color, 256.) / 255.;
    // float r = color = (color - a) / 256.;

    v_color = a_color / 255.;

    // posProcess
    gl_Position = u_matrix_array[u_coord_id] * vec4(pos, 1);
}
