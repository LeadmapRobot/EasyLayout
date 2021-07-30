import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import "./index.less";
//（仅检查 props 变更）
export function SelectItem(props) {

    const [, drag, preview] = useDrag(() => ({
        type: props.type,
        item: { type: props.type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            item: monitor.getItem()
        }),
        canDrag: (monitor) => {

            return true;
        }
    }), []);

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    },[]);

    return (
        <div className="item" ref={drag}>{props.children}</div>
    );
};