import React, { memo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Item, useContextMenu } from "react-contexify";
import { resizeContainerTitleAction, resizePageTitleAction, deleteSingleTitleAction, focusOnAction } from "../../../redux/slice";
import Resize from "../../../lib/resizeLib/index";
import { ResizeTool } from "../resizeTool/index";

const MENU_ID = "menu-id";

function getStyles(fontSize, fontWeight, fontColor, bgImg) {
    return {
        // // padding: '0.5rem 1rem',
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "move",
        width: "100%",
        height: "100%",
        // padding: '0.5rem 1rem',
        // cursor: "move",
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a} )`,
        // backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a} )`,
        backgroundImage: `url(../../../../assets/img/${bgImg}.png)`,
        backgroundSize: "100% 100%"

    };
}

//（仅检查 props 变更）
export const Title = memo(function Title({ id, type, title, width, height, left, top, minWidth, minHeight, fontSize, fontWeight, fontColor, bgColor, bgImg, isPreview }) {
    const currentFocusOn = useSelector((state) => state.setCurrentFocus);
    const dispatch = useDispatch();
    // const backgroundColor = yellow ? "yellow" : "white";

    //用于获取dom节点的实时宽高
    const measureRef = useRef(null);
    //保存resize ref
    const resizeRef = useRef(null);

    const { show } = useContextMenu({
        id: MENU_ID
    })

    //拖拽dom缩放副作用函数
    useEffect(() => {
        //判断是否是preview,且是否为当前选中container
        if (!isPreview && currentFocusOn.id === id) {

            function onResize(width, height) {
                if (type === "pageTitle") {
                    dispatch(resizePageTitleAction({
                        id: id,
                        width: width,
                        height: height
                    }))
                } else {
                    dispatch(resizeContainerTitleAction({
                        id: id,
                        width: width,
                        height: height
                    }))
                }
            }
            resizeRef.current = new Resize(measureRef.current, { 
                Max: true, 
                mxContainer: measureRef.current.parentNode.parentNode, 
                minWidth: minWidth,
                minHeight: minHeight,
                onResize,
                props: {
                    top: top,
                    left: left
                }
            });
    
            resizeRef.current.addListener("rRightDown", "right-down");   
            resizeRef.current.addListener("rRight", "right");
            resizeRef.current.addListener("rDown", "down");
        }
    }, [currentFocusOn, left, top])

    function handleItemClick({ event, props, triggerEvent, data }){
        dispatch(deleteSingleTitleAction({
            type: type,
            id: id
        }));
        //
        dispatch(focusOnAction({
            type: "pageCanvas"
        }));
    }

    function displayMenu(e){

        e.preventDefault()
        if (type === "pageTitle") {
            const x = e.clientX;
            const y = e.clientY;
            show(e, {
                position: {
                    x: x - left - 256,
                    y: y - top - 116,
                },
            });
        } else {
            show(e, {
                position: {
                    x: "50%",
                    y: "50%",
                },
            });
        }
        
    }
    let onMouseDownHandler = (e) => {
        // console.log(e.button)
        // e.preventDefault();
        e.stopPropagation();

        dispatch(focusOnAction({
            id: id,
            type: type
        }));
        
    }

    const showContextMenu = (menuId) => {     
        return currentFocusOn.id === id ? <Menu id={menuId}>
            <Item onClick={handleItemClick}>
                删除
            </Item>
        </Menu> : null;
    }

    return (
        <div ref={measureRef} style={getStyles(fontSize, fontWeight, fontColor, bgImg)} role={isPreview ? "TitlePreview" : "Title"} onMouseDown={onMouseDownHandler} onContextMenu={displayMenu}>
			{title}
            {currentFocusOn.id === id ? <ResizeTool width={width} height={height} /> : null}
            {showContextMenu(MENU_ID)}
		</div>
    );
});
