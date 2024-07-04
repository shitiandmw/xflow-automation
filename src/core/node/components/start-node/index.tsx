import { useEffect, useState } from "react";
import Svg from './svg'
import mata from './meta'
export interface StartNodeProps {
    label?: string;
    selected?: boolean;
}

const StartNode = ({ label = "开始节点", selected = false }: StartNodeProps) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue(label)
    }, [label]);
    return <div className={`x-w-full x-h-full x-border x-border-slate-300 x-rounded-full x-shadow-md x-bg-white x-flex x-items-center x-justify-center x-gap-x-2 x-cursor-pointer  x-text-gray-600 x-outline-sky-600  ${selected ? "x-outline" : ""}`}>
        <div className="x-text-green-500"><Svg className=" x-w-4 x-h-4 " /></div>{value}
    </div>;
};

const StartNodeMeta = mata
export { StartNode, StartNodeMeta };