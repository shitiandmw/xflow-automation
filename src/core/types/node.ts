import React from "react";
import { ObjectMetaProps } from "./object";

export interface NodeMeta {
    title: string;
    category: string;
    props?: Array<ObjectMetaProps>;
}
export interface Node {
    name: string;
    meta: NodeMeta,
    component: React.FC<any>;
    warpper: React.FC<any>;
    props: any;
}

// export interface NodeRegistryProps {
//     component: React.FC<any>
//     meta: NodeMeta
//     props?: any
//     warpper: React.FC<any>
//     // warpper: ReturnType<typeof NodeWarpper>
// }
export interface NodeData {
    id: string;
    data: any;
}

export interface NodeRef {
    getBoundingClientRect: () => {
        width: number;
        height: number;
    }
}



export interface MetaSettle {
    name: string,
    props: any
}
export interface MetaColumn {
    id: string,
    component_name: string,
    label: string,
    column_type: string,
    required: boolean,
    children: MetaColumn[] | null
    setter: any,
    default_value?: any,
    is_point: boolean,
}

export interface NodeScale{
    "sx": number,
    "sy": number,
}
export interface MetaRefInput {
    [name: string]: NodeRegistryProps
}
export interface NodeRegistryProps {
    id?: string;
    isDrag?: boolean;
    isCanvas?: boolean;
    selected?: boolean;
    width?: number;
    height?: number;
    label?: string;
    group: string;
    shape: string,
    type: string;
    description?: string;
    inputTypes?: MetaColumn[] | null,  // 输入参数类型结构
    inputSettles?: any,
    outputTypes?: MetaColumn[] | null, // 输出参数类型结构
    refInputs?: MetaRefInput ,  // 可用的引用参数
    scale?: NodeScale 
}