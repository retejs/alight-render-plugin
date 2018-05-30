import pug from 'rollup-plugin-pug';
import sass from 'rollup-plugin-sass';

export default {
    input: 'index.js',
    output: {
        file: 'build/index.js',
        name: 'AlightRenderPlugin',
        format: 'umd',
        sourcemap: true,
        globals: {
            'alight': 'alight'
        }
    },
    external: ['alight'],
    plugins: [
        pug({
            pugRuntime: false
        }),
        sass({
            insert: true
        })
    ]
}