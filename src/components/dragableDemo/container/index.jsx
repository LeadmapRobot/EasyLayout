import React, { useCallback, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { addContainerAction, dragAction, dragPageTitleAction, focusOnAction, addPageTitleAction } from "../../../redux/slice";
import { ItemTypes } from "../../../itemTypes";
import { DraggableBox } from "../draggableBox/index";
import { DraggableTitle } from "../draggableTitle/index";
import { snapToGrid as doSnapToGrid } from "../../../snapToGrid";
import { CustomDragLayer } from "../customDragLayer/index";

const style = {
    boxSizing: "border-box",
    position: "absolute",
    width: 1340,
    height: "86%",
    backgroundColor: "#e2dbd8",
    top: 100,
    left: 240,
    padding: 16,
    overflow: "auto"
}

export const ContainerArea = ({ snapToGridAfterDrop, snapToGridWhileDragging }) => {

    const calcDomRef = useRef(null);

    const itemTypes = Object.values(ItemTypes);

    const containersConfig = useSelector((state) => state.containersConfig);
    const titleConfig = useSelector((state) => state.titlesConfig);
    const { containerTitle, pageTitle } = titleConfig;
    const pageConfig = useSelector((state) => state.pageConfig);

    const { type, width, height, bgColor: { r, g ,b, a }, bgImg } = pageConfig;
    const pageStyle = {
        width: width,
        height: height,
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${a} )`,
        backgroundImage: `url(../../../../assets/img/${bgImg}.jpg)`,
        backgroundSize: "100% 100%"
    }

    const dispatch = useDispatch();

    const onMouseDownHandler = (e) => {
        // e.preventDefault();
        dispatch(focusOnAction({
            type: type
        }));
    }
    //返回回调函数的memoized版本
    const moveBox = useCallback((item, left, top) => {
        const { minHeight, minWidth, width, height, autoLayout } = pageConfig;
        let validLeft = 0, validTop = 0;
        if (autoLayout) {//自适应布局
            //处理left属性的逻辑
            if (left < 0) {
                validLeft = 0;
            } else if (left > minWidth - item.width) {
                validLeft = minWidth - item.width;
            } else validLeft = left;
            
            //处理top属性的逻辑
            if (top < 0) {
                validTop = 0;
            } else if (top > minHeight - item.height) {
                validTop = minHeight - item.height;

            } else validTop = top;

        } else { //自定义长宽布局
            //处理left属性的逻辑
            if (left < 0) {
                validLeft = 0;
            } else if (left > width - item.width) {
                validLeft =  width - item.width;
            } else validLeft = left;
            
            //处理top属性的逻辑
            if (top < 0) {
                validTop = 0;
            } else if (top > height - item.height) {
                validTop = height - item.height;

            } else validTop = top;
        }
        
        dispatch(dragAction({
            id: item.id,
            left: validLeft,
            top: validTop
        }))
    },[pageConfig]);//如果不提供依赖项数组，每次更新时都会执行

    const addBox = useCallback((left, top) => {
        let validLeft = 0, validTop = 0;
        if (left < 0) {
            validLeft = 0;
        } else validLeft = left;

        if (top < 0) {
            validTop = 0;
        } else validTop = top;

        dispatch(addContainerAction({
            left: validLeft,
            top: validTop
        }));
    }, [])

    const addTitle = useCallback((left, top) => {
        let validLeft = 0, validTop = 0;
        if (left < 0) {
            validLeft = 0;
        } else validLeft = left;

        if (top < 0) {
            validTop = 0;
        } else validTop = top;

        dispatch(addPageTitleAction({
            left: validLeft,
            top: validTop
        }));
    }, [])

    const moveTitle = useCallback((item, left, top) => {
        const { minHeight, minWidth, width, height, autoLayout } = pageConfig;
        let validLeft = 0, validTop = 0;
        if (autoLayout) {//自适应布局
            //处理left属性的逻辑
            if (left < 0) {
                validLeft = 0;
            } else if (left > minWidth - item.width) {
                validLeft = minWidth - item.width;
            } else validLeft = left;
            
            //处理top属性的逻辑
            if (top < 0) {
                validTop = 0;
            } else if (top > minHeight - item.height) {
                validTop = minHeight - item.height;

            } else validTop = top;

        } else { //自定义长宽布局
            //处理left属性的逻辑
            if (left < 0) {
                validLeft = 0;
            } else if (left > width - item.width) {
                validLeft =  width - item.width;
            } else validLeft = left;
            
            //处理top属性的逻辑
            if (top < 0) {
                validTop = 0;
            } else if (top > height - item.height) {
                validTop = height - item.height;

            } else validTop = top;
        }
        
        dispatch(dragPageTitleAction({
            id: item.id,
            left: validLeft,
            top: validTop
        }))
    })

    const [ , drop] = useDrop(() => {

        return ({
            accept: itemTypes,//字符串数组
            drop: (item, monitor) => {

                if (monitor.getItemType() === ItemTypes.BOXITEM) {
                    const currentOffset = monitor.getSourceClientOffset();
                    let { x, y } = currentOffset;
                    //计算box的drop位置
                    const { top, left, padding } = calcDomRef.current.style;
                    let computeLeft = x - parseInt(left) - parseInt(padding);
                    let computeTop = y - parseInt(top) - parseInt(padding);
                    if (snapToGridAfterDrop) {
        
                        [computeLeft, computeTop] = doSnapToGrid(computeLeft, computeTop);
                    }
                    addBox(computeLeft, computeTop);
                }
                if (monitor.getItemType() === ItemTypes.BOX) {
                    const delta = monitor.getDifferenceFromInitialOffset();//每次拖动时与当前item的位置差
                    let computeLeft = Math.round(item.left + delta.x);
                    let computeTop = Math.round(item.top + delta.y);
                    if (snapToGridAfterDrop) {
        
                        [computeLeft, computeTop] = doSnapToGrid(computeLeft, computeTop);
                    }
                    moveBox(item, computeLeft, computeTop);

                }
                //
                if (monitor.getItemType() === ItemTypes.TITLEITEM) {
                    const didDrop = monitor.didDrop();
                    if (didDrop) return;

                    const currentOffset = monitor.getSourceClientOffset();
                    let { x, y } = currentOffset;
                    //计算box的drop位置
                    const { top, left, padding } = calcDomRef.current.style;
                    let computeLeft = x - parseInt(left) - parseInt(padding);
                    let computeTop = y - parseInt(top) - parseInt(padding);
                    if (snapToGridAfterDrop) {
                        [computeLeft, computeTop] = doSnapToGrid(computeLeft, computeTop);
                    }
                    addTitle(computeLeft, computeTop);
                }
                if (monitor.getItemType() === ItemTypes.PAGETITLE) {
                    // const didDrop = monitor.didDrop();
                    // if (didDrop) return;

                    const delta = monitor.getDifferenceFromInitialOffset();//每次拖动时与当前item的位置差
                    let computeLeft = Math.round(item.left + delta.x);
                    let computeTop = Math.round(item.top + delta.y);
                    if (snapToGridAfterDrop) {
        
                        [computeLeft, computeTop] = doSnapToGrid(computeLeft, computeTop);
                    }
                    moveTitle(item, computeLeft, computeTop);
                }
    
            },
            canDrop :(item, monitor) => {
                if (monitor.getItemType() === ItemTypes.CONTAINERTITLE) {
                    return false;
                } else return true;
            }
            // canDrop: (item, monitor) => {
            //     const delta = monitor.getDifferenceFromInitialOffset();
            //     if (delta.x < -item.left || delta.y < -item.top) {
            //         return false;
            //     } else return true;
            // },
            // collect: (monitor) => ({
            //     canDrop: !!monitor.canDrop(),
            // })
        })
    }, [moveBox, addBox]);

    //标题容器渲染
    let renderContainerTitle = (key) => {
        let titleConfigArray = containerTitle.filter((title) => title.link === key);
        if (titleConfigArray.length) {
            return titleConfigArray.map((titleConfig) => 
                <DraggableTitle key={titleConfig.id} {...titleConfig} />
            )
        } else return null;
    }

    return (
        <div style={style} ref={calcDomRef}>
           
            <div ref={drop} style={pageStyle} onMouseDown={onMouseDownHandler}>
                {pageTitle.map((titleConfig) => {
                    return (<DraggableTitle key={titleConfig.id} {...titleConfig}></DraggableTitle>)
                })}
                {Object.keys(containersConfig).map((key) => (
                    <DraggableBox key={key} id={key} {...containersConfig[key]}>
                        {renderContainerTitle(key)}
                    </DraggableBox>
                ))}
            </div>
            <CustomDragLayer snapToGridWhileDragging={snapToGridWhileDragging} />
        </div>
    );
};
