import React, { memo, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Menu, Item, useContextMenu } from "react-contexify";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "../box/index";
import { ItemTypes } from "../../../itemTypes";
import { resizeAction, deleteContainerAction, deleteBundleTitlesAction, focusOnAction } from "../../../redux/slice";
import { ResizeTool } from "../resizeTool/index";
import Resize from "../../../lib/resizeLib/index";

const MENU_ID = "menu-id";

function getInnerStyles(borderWidth, borderColor, borderStyle, borderImage) {
    return {
        
        width: "100%",
        height: "100%",
        borderWidth: borderWidth,
        borderStyle: borderStyle,
        borderColor: borderColor,
        cursor: "move",
        borderImage: `url(../../../../assets/img/${borderImage}.png) 20 round`
    };
}

function getOuterStyles(left, top, isDragging, width, height) {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        position: "absolute",
        transform,
        WebkitTransform: transform,
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        width: width,
        height: height,
    };
}

export const DraggableBox = memo(function DraggableBox(props) {

    const { 
        id, 
        type,
        left, 
        top, 
        width, 
        height,
        minWidth,
        minHeight,
        borderWidth, 
        borderColor, 
        borderStyle, 
        borderImage,
    } = props;

    const currentFocusOn = useSelector((state) => state.setCurrentFocus);
    const dispatch = useDispatch();

    //用于获取dom节点的实时宽高
    const measureRef = useRef(null);
    //保存resize ref
    const resizeRef = useRef(null);

    const { show } = useContextMenu({
        id: MENU_ID
    })

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.BOX,
        item: { ...props },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }), [id, left, top, width, height]);

    useEffect(() => {
        // preview(getEmptyImage(), { captureDraggingState: true });
        // console.log("Dragging item:",item);
    },[]);

    //拖拽dom缩放副作用函数
    useEffect(() => {
        if (currentFocusOn.id === id) {

            function onResize(width, height) {
                dispatch(resizeAction({
                    id: id,
                    width: width,
                    height: height
                }))
            }
            resizeRef.current = new Resize(measureRef.current, { 
                Max: false, 
                mxContainer: "", 
                minWidth: minWidth,
                minHeight: minHeight,
                onResize
            });

            resizeRef.current.addListener("rRightDown", "right-down");

            resizeRef.current.addListener("rRight", "right");

            resizeRef.current.addListener("rDown", "down");
        }
    }, [currentFocusOn])

    let onMouseDownHandler = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        dispatch(focusOnAction({
            id: id,
            type: type
        }));
    }

    function handleItemClick({ event, props, triggerEvent, data }){
        
        dispatch(deleteContainerAction(id));
        dispatch(deleteBundleTitlesAction(id))
        //
        dispatch(focusOnAction({
            type: "pageCanvas"
        }));
    }

    function displayMenu(e) {

        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        show(e, {
            position: {
                x: x - left - 256,
                y: y - top - 116
            },
        });
    }

    const showContextMenu = (menuId) => {     
        return currentFocusOn.id === id ? <Menu id={menuId}>
            <Item onClick={handleItemClick}>
                删除
            </Item>
        </Menu> : null;
    }

    return (
        <div ref={drag} style={getOuterStyles(left, top, isDragging, width, height)} role="DraggableBox" onMouseDown={onMouseDownHandler} onContextMenu={displayMenu}>
            <div ref={measureRef} style={getInnerStyles(borderWidth, borderColor, borderStyle, borderImage)}>
                {currentFocusOn.id === id ? <ResizeTool width={width} height={height} /> : null}
                <Box {...props} />
                {showContextMenu(MENU_ID)}
            </div>
        </div>
    );
});
