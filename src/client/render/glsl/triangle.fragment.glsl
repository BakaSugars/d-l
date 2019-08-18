#define FILL
precision {precision} float;

varying vec4 v_color;

void main() {
    vec4 color = v_color;

    gl_FragColor = color;
}