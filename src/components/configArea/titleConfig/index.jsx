import React, { memo, useState } from "react";
import { Input, Image, Checkbox, InputNumber, Modal } from 'antd';
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { setTitleContentAction, setFontSizeAction, setFontWeightAction, setFontColorAction, setTitleBgImgAction } from "../../../redux/slice";
import "./index.less";

export const TitleConfigArea = memo(function TitleConfigArea(props) {
    const { id, type } = props;

    const dispatch = useDispatch();
    //当前选择container的配置信息
    const titlesConfig = useSelector((state) => state.titlesConfig);

    const { title, fontSize, fontWeight, fontColor, bgImg } = titlesConfig[type].find((titleConfig) => titleConfig.id === id);

    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    let fontColorPickClickHandler = () => {
        setDisplayColorPicker((prevColor) => !prevColor);
      };
    
    let fontColorPickCloseHandler = () => {
        setDisplayColorPicker(false);
    };

    let onTitleContentChange = (e) => {
        const value = e.target.value;
        dispatch(setTitleContentAction({
            id: id,
            type: type,
            title: value
        }))
    }

    let onFontSizeChange = (fontSize) => {
        if (isNaN(fontSize)) {
            return;
        }
        
        dispatch(setFontSizeAction({
            id: id,
            type: type,
            fontSize: fontSize
        }))

    }

    let onFontWeightChange = (e) => {
        dispatch(setFontWeightAction({
            id: id,
            type: type,
            fontWeight: e.target.checked ? "bold" : "normal"
        }))
    }

    let onPickedFontColorChange = (color) => {
        dispatch(setFontColorAction({
            id: id,
            type: type,
            fontColor: color.rgb
        }))
    }

    let showModal = () => {
        setIsModalVisible(true);
    }

    let handleBgImgClick = (bgImg) => {
        setIsModalVisible(false);
        dispatch(setTitleBgImgAction({
            id: id,
            type: type,
            bgImg: bgImg
        }))
    }

    let handleModalCancel = () => {
        setIsModalVisible(false);
    }

    return(
        <div className="title-config-Container">
            <div className="title"><span>标题配置</span></div>
            <div className="content">
                <div className="title-config-item">
                    <div className="item-title"><span>标题设置:</span></div>
                    <div>
                        <Input style={{ width: 140 }} placeholder={"请输入标题"} value={title} onChange={onTitleContentChange} />
                    </div>
                </div>
                <div className="fontsize-config-item">
                    <div className="item-title"><span>字体大小:</span></div>
                    <div>
                        <InputNumber
                            min={12}
                            style={{ width: 70 }}
                            step={1}
                            value={fontSize}
                            onChange={onFontSizeChange}
                        />
                    </div>
                    <div><Checkbox style={{ marginLeft: 12 }} checked={fontWeight === "bold"} onChange={onFontWeightChange}>加粗</Checkbox></div>
                </div>

                <div className="fontcolor-config-item">
                    <div className="item-title"><span>字体颜色:</span></div>
                    <div className="color-pick-content" onClick={fontColorPickClickHandler}>
                        <div className="color-pick-item" style={{ backgroundColor: `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a})` }} />
                    </div>
                    {displayColorPicker ? 
                        <div className="color-pick-popover">
                            <div className="color-pick-cover" onClick={fontColorPickCloseHandler}/>
                            <SketchPicker color={fontColor} onChange={onPickedFontColorChange} />
                        </div> : null
                    }
                </div>
                <div className="bg-img-config-item">
                    <div className="item-title"><span>主题设置:</span></div>
                    <div className="imgWarp" onClick={showModal}>
                        <img src={`../../../../assets/img/${bgImg}.png`} alt={`${bgImg}`} width="120" />
                    </div>
                    <Modal title="主题设置" footer={null} visible={isModalVisible} onCancel={handleModalCancel}>
                        <Image.PreviewGroup >
                            <Image
                                width={220}
                                height={10}
                                preview={false}
                                src="../../../../assets/img/titlebg1.png"
                                onClick={() => {
                                    handleBgImgClick("titlebg1")
                                }}
                            />
                            <Image
                                width={220}
                                height={10} 
                                src="../../../../assets/img/titlebg2.png"
                                preview={false}
                                onClick={() => {
                                    handleBgImgClick("titlebg2")
                                }}
                            />
                            <Image
                                width={220}
                                height={10}
                                src="../../../../assets/img/titlebg3.png"
                                preview={false}
                                onClick={() => {
                                    handleBgImgClick("titlebg3")
                                }}
                                
                            />
                        </Image.PreviewGroup>
                    </Modal>
                    
                </div>
            </div>
        </div>
    )
})