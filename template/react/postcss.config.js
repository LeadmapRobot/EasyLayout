
//postcss后处理器配置
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");//该插件与css-loader的importLoaders配置作用相同
module.exports = {
    plugins: [
        postcssImport(),
        autoprefixer(['IE 10'])
    ]
};