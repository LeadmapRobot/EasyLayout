import React, { useEffect } from "react";
import { Box } from "../box/index";
import { Title } from "../title/index";
import { useSelector } from "react-redux";

function getStyles(width, height, borderWidth, borderColor, borderStyle, borderImage) {
    return {
        borderWidth: borderWidth,
        borderStyle: borderStyle,
        borderColor: borderColor,
        borderImage: `url(../../../../assets/img/${borderImage}.png) 20 round`,
        position: "absolute",
        width: width,
        height: height,
    };
}

export function BoxDragPreview({ id, title, width, height, borderWidth, borderColor, borderStyle, borderImage, bgColor }) {
    const titleConfig = useSelector((state) => state.titlesConfig);
    const { containerTitle } = titleConfig;

    let containerTitleArr = containerTitle.filter((title) => title.link === id);

    useEffect(function subscribeToIntervalTick() {

    }, []);

    return (
        // <div style={style}>
        //     <Box title={title} bgColor={bgColor} preview />
		// </div>
        <div style={getStyles(width, height, borderWidth, borderColor, borderStyle, borderImage)}>
            <Box title={title} bgColor={bgColor} isPreview>
                {containerTitleArr.map((titleConfig) => {
                    return <div key={titleConfig.id} style={{ position: "absolute", transform: `translate(${titleConfig.left}px, ${titleConfig.top}px)`, width: titleConfig.width, height: titleConfig.height }}>
                        <Title {...titleConfig} />
                    </div>
                })}
            </Box>
        </div>
    );
};

