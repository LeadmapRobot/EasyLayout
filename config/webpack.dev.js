const { path } = require('./config.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {

    entry: {
        main: "./src/index.jsx",

    },
    mode: "development",
    devtool: "inline-source-map",
    target: "web",//配置target,避免使用HMR时，页面无法自动更新
    devServer: {
        // contentBase: '../dist',
        compress: true,
        hot: true,
        open: true,//打开默认浏览器
        stats: {
            colors: true
        },

        port: 9000,

      },
    output: {
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        path: path.resolve("./dist")
    },

    resolve: {
        extensions: [".js", ".jsx", ".json", ".css", ".less"],
        alias: {
            "@assets": path.resolve(__dirname,"../assets")
        },
        fallback: {
            "path": require.resolve("path-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }]
            },
            {
                test: /\.less$/, 
                oneOf: [
                    {
                        resourceQuery: /css_modules/,//判断css文件是否有后缀
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    modules: true, //开启 css modules选项
                                    modules: {
                                        localIdentName: "[name]__[local]--[hash:base64:5]",//自定义modules名
                                    },
                                    importLoaders: 2 //处理@import引入的css代码
                                }
                            },
                            "less-loader", // 将 Less 编译为 css
                            "postcss-loader",
                        ]
                    },
                    {
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 2 //处理@import引入的css代码
                                }
                            },
                            "less-loader", // 将 Less 编译为 css
                            "postcss-loader",
                        ]
                    }
                ]
            },
            {
                test:/\.(jpe?g|png|gif|svg)$/,
                loader: "image-webpack-loader",//图片优化
                // 保证优先级                
                enforce: "pre"
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "url-loader",//url-loader默认是优先将资源Base64引入
                    options: {
                        limit: 3 * 1024,
                        // esModule: false,
                        name: "imgs/[name].[hash:6].[ext]"
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule: false,
                    sources: {
                        list: [
                            // All default supported tags and attributes
                            '...',
                        ],
                    },
                },
            },
        ]
    },

    //优化设置
    optimization: {

        runtimeChunk: "single" //把runtimeChunk部分的代码单独打包,runtime和manifest在每次构建都会变换，无论module有没有修改

    },

     //添加plugin
     plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",

        }),
        // new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({  // Also generate a test.html
            template: "./public/index.html"
        }),
        new webpack.HotModuleReplacementPlugin() //控制全局模块的热跟新
    ]
}