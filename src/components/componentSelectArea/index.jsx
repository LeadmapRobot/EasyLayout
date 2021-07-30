import React, { memo } from "react";
import { SelectItem } from "./selectItem/index";
import "./index.less";
//（仅检查 props 变更）
export const ComponentSelectArea = memo(function ComponentSelectArea(props) {
    const { componentsList } = props;
    return (
        <div className="selectContainer">
            <div className="componentsItemList">
                {componentsList.map((component) => {
                //    return <div className="item" key={component.id}><span>{component.name}</span></div>
                   return <SelectItem key={component.id} type={component.type}><span>{component.name}</span></SelectItem>
                })}
            </div>
		</div>
    );
});