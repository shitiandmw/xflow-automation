// import React from "react";
// import { NodeMeta } from "../types";
// import ports from "./ports";
// import { NodeWarpper } from "./components"
import { NodeRegistryProps } from "../types"
import {eventEmitter} from "../events"
// setterRegistry.js

const nodeRegistry: { [name: string]: NodeRegistryProps } = {};

// const defaultNodeProps = {
//     width: 500,
//     height: 200,
//     // ports: ports,
// }

export function clearNode() {
    Object.keys(nodeRegistry).forEach(key => {
        delete nodeRegistry[key];
    });
}
export function registerNodeProp(node :NodeRegistryProps) {
    nodeRegistry[node.type] = node;
}
export function registerNodeProps(nodes: NodeRegistryProps[]) {
    nodes.forEach(node => {
        nodeRegistry[node.type] = node;
    });
    eventEmitter.emit("node.registry.changed", nodeRegistry);
}

export function getNode(name: string): NodeRegistryProps {
    return nodeRegistry[name];

}

export function getNodes(): { [name: string]: NodeRegistryProps } {
    return nodeRegistry;
}
