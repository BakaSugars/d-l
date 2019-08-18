import triangle_vertex from './glsl/triangle.vertex.glsl';
import triangle_fragment from './glsl/triangle.fragment.glsl';
import circle_vertex from './glsl/circle.vertex.glsl';
import circle_fragment from './glsl/circle.fragment.glsl';

export const shaderLib: { [x: string]: string } = {
};

export const includeStore: { [name: string]: string } = {};

export function registerShader(name: string, source: string) {
    shaderLib[name] = source;
}

export function registerIncludes(name: string, source: string) {
    includeStore[name] = source;
}

registerShader('triangle_vertexSource', triangle_vertex);
registerShader('triangle_fragmentSource', triangle_fragment);

registerShader('circle_vertexSource', circle_vertex);
registerShader('circle_fragmentSource', circle_fragment);


