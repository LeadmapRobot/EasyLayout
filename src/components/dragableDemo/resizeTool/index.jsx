import React from "react";
import "./index.less";

export function ResizeTool(props) {
    const { width, height } = props;
    return (
        <>
            <div id="rRightDown" className="rRightDown"> </div>
            <div id="rLeftDown" className="rLeftDown"> </div>
            <div id="rRightUp" className="rRightUp"> </div>
            <div id="rLeftUp" className="rLeftUp"> </div>
            <div id="rRight" className="rRight"> </div>
            <div id="rLeft" className="rLeft"> </div>
            <div id="rUp" className="rUp"> </div>
            <div id="rDown" className="rDown"></div>
        </>
    )
}