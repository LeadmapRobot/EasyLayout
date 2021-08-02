import React, { useState, useMemo, useCallback } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import update from "immutability-helper";
import { ComponentSelectArea } from "../componentSelectArea/index";
import { ContainerArea } from "../dragableDemo/container/index";
import { PageConfigArea } from "../configArea/pageConfig/index";
import { ContainerConfigArea } from "../configArea/containerConfig/index";
import { TitleConfigArea } from "../configArea/titleConfig/index";
import { ItemTypes } from "../../itemTypes";
import "./index.less";

const componentsList = [{
	id: 1,
	name: "容器",
	type: ItemTypes.BOXITEM

},{
	id: 2,
	name: "标题",
	type: ItemTypes.TITLEITEM
}]

const downLoadUrl = "http://192.168.1.224:9021/";

export const Example = () => {
	const containersConfig = useSelector((state) => state.containersConfig);
	const pageConfig = useSelector((state) => state.pageConfig);
	const titlesConfig = useSelector((state) => state.titlesConfig);
	const currentFocusOn = useSelector((state) => state.setCurrentFocus);

    const [snapToGridAfterDrop, setSnapToGridAfterDrop] = useState(true);
    const [snapToGridWhileDragging, setSnapToGridWhileDragging] = useState(false);

    const handleSnapToGridAfterDropChange = useCallback(() => {
        setSnapToGridAfterDrop(!snapToGridAfterDrop);
    }, [snapToGridAfterDrop]);

    const handleSnapToGridWhileDraggingChange = useCallback(() => {
        setSnapToGridWhileDragging(!snapToGridWhileDragging);
    }, [snapToGridWhileDragging]);

	const configData = useMemo(() =>
	handleConfigData(containersConfig, pageConfig, titlesConfig),
	[containersConfig, pageConfig, titlesConfig]);

	const downLoadHandler = () => {
		
		axios({
			method: "post",
			url: downLoadUrl + "receive_config",
			data: {
			  type: "react",
			  data: configData
			}
		}).then((response) => {
			const id = response.data.uuid;
			// let responseData = {error: "File not exists."};
			axios({
				method: "get",
				url: `${downLoadUrl}get_project/${id}/react`,
			}).then((response) => { 
				// console.log(response.data);
				setTimeout(() => {
					window.location.href =  `${downLoadUrl}get_project/${id}/react`
				}, 300)
			})
		})
	}

	//处理包装配置信息
	function handleConfigData(containersConfig, pageConfig, titlesConfig) {

		if (!containersConfig || !pageConfig || !titlesConfig) {
			return;
		}

		const { minHeight, minWidth, autoLayout } = pageConfig;
		let newContainersConfig = containersConfig;//创建容器配置数据副本
		let newContainerTitlesConfig = titlesConfig.containerTitle;//创建容器标题配置数据副本
        let newPageTitlesConfig = titlesConfig.pageTitle;//创建页面标题配置数据副本
		//判断是否设置了自适应布局
		if (autoLayout) {
			//容器标题的定位和大小转换为百分比形式
			titlesConfig.containerTitle.forEach((title, key) => {
				newContainerTitlesConfig = update(newContainerTitlesConfig, {
					[key]: {
						$merge: {
							top: `${title.top / (containersConfig[title.link].height - containersConfig[title.link].borderWidth * 2) * 100}%`,
							left: `${title.left / (containersConfig[title.link].width - containersConfig[title.link].borderWidth * 2) * 100}%`,
							width: `${title.width / (containersConfig[title.link].width - containersConfig[title.link].borderWidth * 2) * 100}%`,
							height: `${title.height / (containersConfig[title.link].height - containersConfig[title.link].borderWidth * 2) * 100}%`,
						}
					}
				})
			})

			//页面标题的定位和大小转换为百分比形式
			titlesConfig.pageTitle.forEach((title, key) => {
				newPageTitlesConfig = update(newPageTitlesConfig, {
					[key]: {
						$merge: {
							top: `${title.top / minHeight * 100}%`,
							left: `${title.left / minWidth * 100}%`,
							width: `${title.width / minWidth * 100}%`,
							height: `${title.height / minHeight * 100}%`
						}
					}
				})
			})
			
			//容器的定位和大小转换为百分比形式
			Object.keys(containersConfig).forEach((key) => {
				newContainersConfig = update(newContainersConfig, {//更新数据副本
					[key]: {
						$merge: {
							top: `${containersConfig[key].top / minHeight * 100}%`, 
							left: `${containersConfig[key].left / minWidth * 100}%`,
							width: `${containersConfig[key].width / minWidth * 100}%`,
							height: `${containersConfig[key].height / minHeight * 100}%`,
						}
					}
				})
			})
		}

		let componentTpl = Object.keys(newContainersConfig).map((key, index) => {
			const titleConfigArr = newContainerTitlesConfig.filter((titleConfig) => titleConfig.link === key);//获取各个container的标题配置
			const { bgColor: {r, g, b, a} } = newContainersConfig[key];
			return {
				componentName: key,
				config: {
					...newContainersConfig[key]
				},
				style: {
					position: "absolute",
					top: newContainersConfig[key].top,
					left: newContainersConfig[key].left,
					width: newContainersConfig[key].width,
					height: newContainersConfig[key].height,
					border: newContainersConfig[key].border,
					borderWidth: newContainersConfig[key].borderWidth,
					borderStyle: newContainersConfig[key].borderStyle,
					borderColor: newContainersConfig[key].borderColor,
					borderImage: newContainersConfig[key].borderImage,
					backgroundColor: `rgba(${r},${g},${b},${a})`,
					backgroundImage: newContainersConfig[key].bgImg
				},
				title: titleConfigArr.map((titleConfig) => {
					const { r, g, b, a } = titleConfig.fontColor;
					return {
						id: titleConfig.id,
						title: titleConfig.title,
						style: {
							top: titleConfig.top,
							left: titleConfig.left,
							minWidth: titleConfig.minWidth,
							minHeight: titleConfig.minHeight,
							width: titleConfig.width,
							height: titleConfig.height,
							fontSize: titleConfig.fontSize,
							fontWeight: titleConfig.fontWeight,
							color: `rgba(${r},${g},${b},${a})`,
							// bgColor: {
							// r: "0",
							// g: "0",
							// b: "0",
							// a: "1"
							// },
							backgroundImage: titleConfig.bgImg,
						}
					}
				})
			}
		})

		const configData = {
			componentTpl: componentTpl,
			pageConfig: {
				autoLayout: pageConfig.autoLayout,
				backgroundColor: `rgba(${pageConfig.bgColor.r},${pageConfig.bgColor.g},${pageConfig.bgColor.b},${pageConfig.bgColor.a} )`,
				backgroundImage: pageConfig.bgImg,
				width: pageConfig.width,
				height: pageConfig.height,
				minWidth: pageConfig.minWidth,
				minHeight: pageConfig.minHeight,
				title: newPageTitlesConfig.map((title) => {
					const { r, g, b, a } = title.fontColor;
					return {
						id: title.id,
						title: title.title,
						style: {
							top: title.top,
							left: title.left,
							minWidth: title.minWidth,
							minHeight: title.minHeight,
							width: title.width,
							height: title.height,
							fontSize: title.fontSize,
							fontWeight: title.fontWeight,
							color: `rgba(${r},${g},${b},${a})`,
							backgroundImage: title.bgImg
						}
					}
				}),
				type: pageConfig.type,
			}
		}
		console.log(configData);
		return configData;
	}


	//选择渲染配置区
	const renderConfigArea = (currentFocusOn) => {
		const { type, id } = currentFocusOn;
		switch (type) {

			case "container":
				return <ContainerConfigArea id={id} />;
			case "containerTitle":
				return <TitleConfigArea type={type} id={id} />;
			case "pageTitle": 
			    return <TitleConfigArea type={type} id={id} />;
			default: 
				return <PageConfigArea />;
		}
	}

    return (
        <div>
			<div className="download-btn">
				<Button type="primary" size="large" onClick={downLoadHandler}>下载</Button>
			</div>
			<ComponentSelectArea componentsList={componentsList}></ComponentSelectArea>

			<ContainerArea snapToGridAfterDrop={snapToGridAfterDrop} snapToGridWhileDragging={snapToGridWhileDragging} />
			{renderConfigArea(currentFocusOn)}
		</div>
    );
};
