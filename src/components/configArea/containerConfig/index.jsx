import React, { memo, useState } from "react";
import { Image, Slider, InputNumber, Modal } from 'antd';
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { setBgColorAction, setOpacityAction, setContainerBgImgAction, setBorderAction } from "../../../redux/slice";
import "./index.less";

export const ContainerConfigArea = memo(function ContainerConfigArea(props) {
    const { id } = props;
    const dispatch = useDispatch();
    //当前选择container的配置信息
    const containerConfig = useSelector((state) => state.containersConfig[id]);

    const { width, height, borderImage, bgColor, bgImg } = containerConfig;
    const alpha = Number(bgColor.a);
    //背景颜色拾取器状态
    const [displayBgColorPicker, setDisplayBgColorPicker] = useState(false);

    const [title, setTitle] = useState("");

    const [isBgImgModalVisible, setIsBgImgModalVisible] = useState(false);
    const [isBorderImgModalVisible, setIsBorderImgModalVisible] = useState(false);

    let onSliderValueChange = (value) => {
        if (isNaN(value)) {
            return;
        }

        dispatch(setOpacityAction({
            id: id,
            opacity: value
        }))
    }

    let bgColorPickClickHandler = () => {
        setDisplayBgColorPicker((prevColor) => !prevColor);
    };
    
    let bgColorPickCloseHandler = () => {
        setDisplayBgColorPicker(false);
    };


    let changePickedBgColorHandler = (color) => {
        dispatch(setBgColorAction({
            id: id,
            color: color.rgb
        }))
    };

    let showBgImgModal = () => {
        setIsBgImgModalVisible(true);
    }
    let showBorderImgModal = () => {
        setIsBorderImgModalVisible(true);
    }
    let handleBGImgClick = (bgImg) => {
        setIsBgImgModalVisible(false);
        dispatch(setContainerBgImgAction({
            id: id,
            bgImg: bgImg
        }))
    }

    let handleBorderImgClick =(borderImg) => {
        setIsBorderImgModalVisible(false);
        dispatch(setBorderAction({
            id: id,
            borderImage: borderImg
        }))
    }


    let handleBgImgModalCancel = () => {

        setIsBgImgModalVisible(false)
    };

    let handleBorderImgModalCancel = () => {

        setIsBorderImgModalVisible(false);
    };
    
    return(
        <div className="box-config-Container">
            <div className="title"><span>容器配置</span></div>
            <div className="content">
                <div className="title-config-item">
                    <div className="item-title"><span>名称:</span></div>
                    <div>
                        <input style={{ width: 140 }} type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                    </div>
                </div>
                <div className="custom-layout-item">
                    <div className="config-item">
                        <div className="config-item-title"><span>宽度:</span></div>
                        <div>
                            {/* <input style={{ width: 100 }} type="text" value={widthClone} onChange={(e) => {setWidthClone(e.target.value)}} onBlur={onSetCustomLayout("width")} /> */}
                            <input style={{ width: 100 }} type="text" value={width} disabled />
                        </div>
                    </div>
                    <div className="config-item">
                        <div className="config-item-title"><span>高度:</span></div>
                        <div>
                            <input style={{ width: 100 }} type="text" value={height} disabled />
                        </div>
                    </div>
                </div>

                <div className="bg-color-config-item">
                    <div className="item-title"><span>背景颜色:</span></div>
                    <div className="color-pick-content" onClick={bgColorPickClickHandler}>
                        <div className="color-pick-item" style={{ backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` }} />
                    </div>
                    {displayBgColorPicker ? 
                        <div className="color-pick-popover">
                            <div className="color-pick-cover" onClick={bgColorPickCloseHandler}/>
                            <SketchPicker color={bgColor} onChange={changePickedBgColorHandler} />
                        </div> : null
                    }
                </div>
                <div className="bg-img-config-item">
                    <div className="item-title"><span>主题设置:</span></div>
                    {/* <Image
                        width={120}
                        src="../../../../../assets/img/bg.jpg"
                    /> */}
                    <div className="imgWarp" onClick={showBgImgModal}>
                        <img src={`../../../../assets/img/${bgImg}.png`} alt={`${bgImg}`} width="120" />
                    </div>
                    <Modal title="主题设置" footer={null} visible={isBgImgModalVisible} onCancel={handleBgImgModalCancel}>
                        <Image.PreviewGroup>
                            <Image
                                width={200}
                                height={160}
                                preview={false}
                                src="../../../../assets/img/containerImg1.png"
                                onClick={() => {
                                    handleBGImgClick("containerImg1")
                                }}
                            />
                            <Image
                                width={200}
                                height={160}
                                src="../../../../assets/img/containerImg2.png"
                                preview={false}
                                onClick={() => {
                                    handleBGImgClick("containerImg2")
                                }}
                            />
                            <Image
                                width={200}
                                height={160}
                                src="../../../../assets/img/containerImg3.png"
                                preview={false}
                                onClick={() => {
                                    handleBGImgClick("containerImg3")
                                }}
                            />
                        </Image.PreviewGroup>
                    </Modal>
                </div>
                <div className="opacity-config-item">
                    <div className="item-title"><span>透明度:</span></div>
                    <div className="slider">
                        <Slider
                            min={0}
                            max={1}
                            onChange={onSliderValueChange}
                            value={typeof alpha === "number" ? alpha : 1}
                            step={0.01}
                        />
                    </div>
                    <div>
                        <InputNumber
                            min={0}
                            max={1}
                            style={{ marginLeft: 4, width: 70 }}
                            step={0.01}
                            value={alpha}
                            onChange={onSliderValueChange}
                        />
                    </div>
                </div>
                <div className="border-config-item">
                    <div className="item-title"><span>边框:</span></div>
                    <div className="imgWarp" onClick={showBorderImgModal}>
                        <img src={`../../../../assets/img/${borderImage}.png`} alt={`${borderImage}`} width="80" />
                    </div>
                    <Modal title="Basic Modal" footer={null} visible={isBorderImgModalVisible} onCancel={handleBorderImgModalCancel}>
                        <Image.PreviewGroup>
                            <Image
                                width={200}
                                
                                preview={false}
                                src="../../../../assets/img/borderImg1.png"
                                onClick={() => {
                                    handleBorderImgClick("borderImg1")
                                }}
                            />
                            <Image
                                width={200}
                                src="../../../../assets/img/borderImg2.png"
                                preview={false}
                                onClick={() => {
                                    handleBorderImgClick("borderImg2")
                                }}
                            />
                        </Image.PreviewGroup>
                    </Modal>
                </div>
            </div>
        </div>
    )
})