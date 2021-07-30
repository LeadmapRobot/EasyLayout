import React from "react";
import { useDragLayer } from "react-dnd";
import { BoxDragPreview } from "../boxDragPreview/index";
import { ItemTypes } from "../../../itemTypes";
import { snapToGrid } from "../../../snapToGrid";

const layerStyles = {
    position: "fixed",
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    // width: '100%',
    // height: '100%',
};

function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none",
        };
    }
    let { x, y } = currentOffset;

    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;
    }
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
}

export const CustomDragLayer = (props) => {

    const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => {
        return {
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),

        }
    });

    function renderItem() {
        switch (itemType) {
            // case ItemTypes.BOX:
            //     return <BoxDragPreview id={item.id} title={item.title} width={item.width} height={item.height} borderWidth={item.borderWidth} borderColor={item.borderColor} borderStyle={item.borderStyle} borderImage={item.borderImage} bgColor={item.bgColor} />;
            case ItemTypes.BOXITEM:
                return <div style={{ width: 160, height: 160, backgroundColor: "white" }}></div>
            case ItemTypes.TITLEITEM:
                return <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    color: "white", 
                    width: 150, 
                    height: 38, 
                    backgroundImage: "url(../../../../assets/img/titlebg1.png)", 
                    backgroundSize: "100% 100%"
                }}>title</div>
            
        }
    }
    if (!isDragging) {

        return null;
    }

    return (
        <div style={layerStyles}>
			<div style={getItemStyles(initialOffset, currentOffset, props.snapToGridWhileDragging)}>
				{renderItem()}
			</div>
		</div>
    );
};
