import React, { memo, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Title } from "../title/index";
import { ItemTypes } from "../../../itemTypes";

function getStyles(left, top, isDragging, minWidth, minHeight, width, height) {
    const transform = `translate(${left}px, ${top}px)`;

    return {
        position: "absolute",
        transform,
        WebkitTransform: transform,
        opacity: isDragging ? 0 : 1,
        minWidth: minWidth,
        minHeight: minHeight,
        width: width,
        height: height,
    };
}

export const DraggableTitle = memo(function DraggableTitle(props) {
    const { 
        id, 
        link,
        left, 
        top,
        minWidth,
        minHeight,
        width, 
        height, 
    } = props;

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: `${link ? ItemTypes.CONTAINERTITLE : ItemTypes.PAGETITLE}`,// 区分是放置在页面上还是放置在容器内的title类型
        item: { ...props },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }), [id, left, top, width, height]);

    useEffect(() => {
        // preview(getEmptyImage(), { captureDraggingState: true });
        // console.log("Dragging item:",item);
    },[]);

    return (
        <div ref={drag} style={getStyles(left, top, isDragging, minWidth, minHeight, width, height)} role="DraggableTitle">
            <Title {...props} />
        </div>
    );
});
