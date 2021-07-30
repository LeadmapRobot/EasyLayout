import React, { memo, useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { addContainerTitle, dragContainerTitleAction } from "../../../redux/slice";
import { ItemTypes } from "../../../itemTypes";

function getStyles(bgColor, bgImg) {

    return {
        width: "100%",
        height: "100%",
        // padding: '0.5rem 1rem',
        // cursor: "move",
        backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a} )`,
        backgroundImage: `url(../../../../assets/img/${bgImg}.png)`,
        backgroundSize: "100% 100%"
    };
}

//（仅检查 props 变更）
export const Box = memo(function Box({ id, bgColor, bgImg, children, isPreview }) {

    const measureRef = useRef(null);
    const dispatch = useDispatch();

    let  addTitle = (id) => {
        dispatch(addContainerTitle(id));
    }

    //返回回调函数的memoized版本
    const moveTitle = useCallback((item, left, top) => {
    
        let validLeft = 0, validTop = 0;
        //处理left属性的逻辑
        if (left < 0) {
            validLeft = 0;
        } else if (left > measureRef.current.clientWidth - item.width) {
            validLeft = measureRef.current.clientWidth - item.width;
        } else validLeft = left;
        
        //处理top属性的逻辑
        if (top < 0) {
            validTop = 0;
        } else if (top > measureRef.current.clientHeight - item.height) {
            validTop = measureRef.current.clientHeight - item.height;

        } else validTop = top;

        dispatch(dragContainerTitleAction({
            id: item.id,
            left: validLeft,
            top: validTop
        }))
    },[]);

    const [ , drop] = useDrop(() => {

        return ({
            accept: [ItemTypes.TITLEITEM, ItemTypes.CONTAINERTITLE],
            drop: (item, monitor) => {
                if (monitor.getItemType() === ItemTypes.TITLEITEM) {
                    addTitle(id);
                }

                if (monitor.getItemType() === ItemTypes.CONTAINERTITLE) {
                    const delta = monitor.getDifferenceFromInitialOffset();//每次拖动时与当前item的位置差
                    let computeLeft = Math.round(item.left + delta.x);
                    let computeTop = Math.round(item.top + delta.y);

                    moveTitle(item, computeLeft, computeTop);
                
                }
            }
        })
    }, [addTitle, moveTitle]);

    return (
        <div ref={drop} style={getStyles(bgColor, bgImg)}>
            <div ref={measureRef} style={{ position: "relative",width: "100%", height: "100%" }}>
                {children}
            </div>
			{/* {title} */}
            
		</div>
    );
});
