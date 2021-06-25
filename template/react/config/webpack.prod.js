const { path } = require('./config.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");//Js代码压缩工具，webpack默认
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; //打包后的canvas可视化分析插件

module.exports = {
    // entry: "./src/test-12/index.js",//缓存相关，需改为对象形式
    entry: {
        // main: "./src/test-01/index.js"
        a: "./src/test-19/components/a.js",
        b: "./src/test-19/components/b.js",
    },
    output: {
        publicPath: "",
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "../dist")
      },
    mode: "production",
    target: "web",
    devtool: false,
    //resolve配置可以帮助webpack快速查找依赖
    //extensions: 解析扩展名的配置
    //alias: 名字可以使用@ ！ ~等这些特殊字符
    resolve: {
        extensions: [".js", ".jsx", "json", ".css", ".less"],
        alias: {
            // src: path.resolve(_dirname, "src"),
            // "@lib": path.resolve(_dirname, "src/lib")
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
                
                //使js在引入css文件时能解析css语法
                // use: ["css-loader"]

                //升级：加入style-loader,顺序在css-loader之后，css文件便能以<style>标签的形式插入到html中了
                // use: ["style-loader", "css-loader"]

                //再升级：使用 mini-css-extract-plugin插件把CSS以<link>的方式通过URL引入进来
                oneOf: [
                    {
                        resourceQuery: /css_modules/,//判断css文件是否有后缀
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options:  {
                                    // publicPath: "/css/"
                                }
                            },
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
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options:  {
                                    // publicPath: "/css/"
                                }
                            },
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
                        esModule: false,
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
                            {
                                tag: "img",
                                attribute: "src",
                                type: "src",
                            }
                        ],
                    },
                },
            },
        ],
    },

    //优化设置
    optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,//开启多线程压缩
            // sourceMap: true, // 如果在生产环境中使用 source-maps，必须设置为 true
          }),
        ],
        // splitChunks: {
        //     chunks: "async",
        //     cacheGroups: {
                
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all',
        //         }
        //     }

        // },
        runtimeChunk: "single"//把runtimeChunk部分的代码单独打包

    },

    //添加plugin
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        // new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: "./public/index.html"
        }),
        new BundleAnalyzerPlugin()
    ]
}