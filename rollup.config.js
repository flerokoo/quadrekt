import babel from "rollup-plugin-babel";

module.exports = {
    input: "src/index.js",
    output: [{
        file: "dist/quadrekt.js",
        format: "umd",
        name: "Quadrekt"
    }, {
        file: "dist/quadrekt.module.js",
        format: "es"            
    }], 
    plugins: [babel()]
};
  