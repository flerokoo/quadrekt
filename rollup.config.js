import babel from 'rollup-plugin-babel';

module.exports = {
    input: 'src/index.js',
    output: [{
        file: 'dist/rect-pack-async.js',
        format: 'umd',
        name: "RectPackAsync"
    }, {
        file: 'dist/rect-pack-async.module.js',
        format: "es"            
    }], 
    plugins: [babel()]
};
  