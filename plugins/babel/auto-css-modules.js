//功能： 根据样式文件引入方式不同,用于自动转换 css modules
const { extname } = require("path");
const CSS_FILE_EXTENSIONS = [".css", ".scss", ".sass", ".less"];
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { specifiers, source } = path.node;
        const { value } = source;
        if (
          specifiers.length > 0 //如果有值，则在文件名后面加上后缀?css_modules
          && CSS_FILE_EXTENSIONS.includes(extname(value))
        ) {
          source.value = `${value}?css_modules`;
        }
      },
    },
  };
};