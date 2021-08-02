import React, { useEffect, useState, useCallback } from "react";

import config from "../assets/config.json";//配置文件
import "./app.less";


export default function App() {
    const [page, setPage] = useState({});
    const [tpl, setTpl] = useState([]);

    const [componentsDynamic, addComponentsDynamic] = useState([]);

    useEffect(() => {

        const { pageConfig, componentTpl } = config;
        
        // 设置页面title
        document.title = "自定义容器"//pageConfig.title || "自定义容器";

        setPage(pageConfig);
        setTpl(componentTpl);
    
        Promise.all(importDynamic(tpl)).then((wrapComponents) => {
            if (wrapComponents) {
                let componentsDynamic = [];
                wrapComponents.forEach((wrapComponent) => {
                    const { component, config } = wrapComponent;
                    componentsDynamic.push(renderComponentDynamic(component, config));
                })
                //更新要渲染的动态组件
                addComponentsDynamic(componentsDynamic);
            }
        })
      },[page, tpl]);

    //动态import组件
    const importDynamic = useCallback(
        (componentTpl) => {
            let promises = [];
            if (componentTpl) {
                for (let componentConfig of componentTpl) {
                    const { componentName } = componentConfig;
        
                    let promise = import(`./components/${componentName}/index.jsx`).then((component) => {
                        return {
                            component: component.default, 
                            config: {...componentConfig}
                        }
                    });
                    promises.push(promise);
                }
                return promises;
    
            } else return promises;
    
        },[tpl]);

    //渲染动态组件
    let renderComponentDynamic = (ComponentDynamic, componentConfig ) => {
        // console.log(componentConfig)
        return <ComponentDynamic key={componentConfig.componentId} {...componentConfig}/>
    }

    return <div style={{ 
            position: "relative", 
            margin: "0 auto",
            width: `${page.autoLayout ? "100vw" : page.width  + "px"}`, 
            height: `${page.autoLayout ? "100vh" : page.height + "px"}`,
            backgroundColor: page.backgroundColor,
            backgroundImage: `url(../assets/imgs/${page.backgroundImage}.jpg)`,
            backgroundSize: "100% 100%",
        }}
    >
        {!!page.title ? page.title.map((title) => (
            <div key={title.id} className="title" style={{
                ...title.style,
                backgroundImage: `url(../assets/imgs/titleImgs/${title.style.backgroundImage}.png)`,
                backgroundSize: "100% 100%"
            }}>{title.title}</div>
        )) : null}
        {componentsDynamic}

    </div>
}
