import React, { useState, useEffect, useCallback } from "react";
import { Image } from 'antd';
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { setAutoLayout, setCustomLayout, setBgImg, setBgColor } from "../../../redux/slice";
import "./index.less";

export function PageConfigArea() {

    const dispatch = useDispatch();
    const pageConfig = useSelector((state) => state.pageConfig);

    const { autoLayout, width, height, bgColor, bgImg } = pageConfig;

    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    function onRadioChangeHandler(e) {
        const value = e.target.value;

        if (value === "auto") dispatch(setAutoLayout(true));
        else dispatch(setAutoLayout(false));
    }

    let onSetCustomLayout = (current) => {
        return (e) => {
            // e.preventDefault()
            let value = e.target.value;
            dispatch(setCustomLayout({
                current,
                value:Number(value)

            }));
        }
    }

    let colorPickClickHandler = () => {
        setDisplayColorPicker((prevColor) => !prevColor);
    };
    
    let colorPickCloseHandler = () => {
        setDisplayColorPicker(false);
    };

    /**
     * 颜色选择回调
     */
    let changePickedColorHandler = (color) => {
        dispatch(setBgColor(color.rgb))
    };

    return(
        <div className="bg-config-Container">
            <div className="title"><span>画布配置</span></div>
            <div className="content">
                <div className="layout-config-item">
                    <div className="item-title"><span>布局设置:</span></div>
                    <div className="radio">
                        <input type="radio" value="auto" checked={autoLayout===true} onChange={onRadioChangeHandler} />
                        <label className="radio-label">自适应</label>
                    </div>

                    <div className="radio">
                        <input type="radio" value="custom" checked={autoLayout===false} onChange={onRadioChangeHandler} />
                        <label className="radio-label">自定义宽高</label>
                    </div>
                </div>
                {
                    !autoLayout ? <div className="custom-layout-item">
                    <div className="config-item">
                        <div className="config-item-title"><span>宽度:</span></div>
                        <div>
                            <input style={{ width: 90, height: 18 }} type="text" defaultValue={width} onBlur={onSetCustomLayout("width")} />
                        </div>
                    </div>
                    <div className="config-item">
                        <div className="config-item-title"><span>高度:</span></div>
                        <div>
                            <input style={{ width: 90, height: 18 }} type="text" defaultValue={height} onBlur={onSetCustomLayout("height")} />
                        </div>
                    </div>
                </div> : null
                }
                <div className="bg-color-config-item">
                    <div className="item-title"><span>背景颜色:</span></div>
                    <div className="color-pick-content" onClick={colorPickClickHandler}>
                        <div className="color-pick-item" style={{ backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` }} />
                    </div>
                    {displayColorPicker ? 
                        <div className="color-pick-popover">
                            <div className="color-pick-cover" onClick={colorPickCloseHandler}/>
                            <SketchPicker color={bgColor} onChange={changePickedColorHandler} />
                        </div> : null
                    }
                </div>
                <div className="bg-img-config-item">
                    <div className="item-title"><span>主题设置:</span></div>
                    <Image
                        width={120}
                        src={`../../../../assets/img/${bgImg}.jpg`}
                    />

                </div>
                <div className="name-config-item">
                    <div className="item-title"><span>大屏名称:</span></div>
                    <div>
                        <input style={{ width: 140, height: 18 }} type="text" />
                    </div>

                </div>
            </div>
        </div>
    )

}