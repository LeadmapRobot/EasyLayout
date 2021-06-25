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
        // lazy: true,//在请求某个包时才会编译
        // filename: "bundle.js",//lazy模式下必须设置filename
        port: 8080,
        //mock server test
        before(app, server, compiler) {
            app.get("/api/mock.json", (req, res) => {
                console.log("res:",res);
                res.json([{name: "tom", age: 10}, {name: "jack", age: 20}]);
            })
        }
      },
    output: {
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        path: path.resolve("./dist")
    },
    //resolve配置可以帮助webpack快速查找依赖
    //extensions: 解析扩展名的配置
    //alias: 名字可以使用@ ！ ~等这些特殊字符
    resolve: {
        extensions: [".js", ".jsx", ".json", ".css", ".less"],
        alias: {
            // src: path.resolve(_dirname, "src"),
            // "@lib": path.resolve(_dirname, "src/lib")
            "@assets": path.resolve(__dirname,"../assets")
        },
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": false,
            "stream": false,
            "os": false,
            "util": false,
            "assert": require.resolve("assert"),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    //可以直接把babel配置写进option中，也可以单独创建babelIrc文件
                    // options: {
                    //     presets: [
                    //         '@babel/preset-env',
                    //         {
                    //             useBuiltIns: 'usage'
                    //         }
                    //     ]
                    // }
                }]
            },
            {
                // test: /\.css$/,
                test: /\.less$/,
                //使js在引入css文件时能解析css语法
                // use: ["css-loader"]
                //升级：加入style-loader,顺序在css-loader之后，css文件便能以<style>标签的形式插入到html中了
                // use: ["style-loader", "css-loader"]      
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
            // {
            //     test:/\.(eot|woff|ttf|woff2)(\?|$)/,
            //     loader: "file-loader",
            //     query: {
            //         // 这么多文件，ext不同，所以需要使用[ext]
            //         name: "fonts/[name].[hash:7].[ext]"
            //     }
            // },
        ]
    },

    //优化设置
    optimization: {

        runtimeChunk: "single" //把runtimeChunk部分的代码单独打包,runtime和manifest在每次构建都会变换，无论module有没有修改

    },

     //添加plugin
     plugins: [
        // new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({  // Also generate a test.html
            // filename: "test.html",
            template: "./public/index.html"
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.HotModuleReplacementPlugin() //控制全局模块的热跟新，(否则需要在更新模块中加入module.hot.accepted处理程序)
    ]
}