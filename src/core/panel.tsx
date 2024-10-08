import { useDnd, useGraphInstance } from '@antv/xflow';
import { nanoid } from 'nanoid'
import React, { useEffect, useState } from "react";
import { NodeRegistryProps, NodeScale } from "./types";
import { getNodes } from "./node";
import { AutoNode } from './node';
import { eventEmitter } from './events';


const Panel = () => {
    const [nodes, setNodes] = useState<Array<NodeRegistryProps>>([]);
    const { startDrag } = useDnd();
    const graph = useGraphInstance();

    const handleMouseDown = (e: React.MouseEvent<Element, MouseEvent>, node: NodeRegistryProps) => {
        const scale = graph?.scale()
        const id = nanoid()
        let data = node
        data.id = id
        data.scale = (scale as NodeScale) || { sx: 1, sy: 1 }
        // data.props = node.meta.props
        data.isDrag = true
        let width = data.width || 500
        let height = data.height || 500
        // node.meta.props?.forEach(prop => {
        //     if ("defaultValue" in prop)
        //         data[prop.name] = prop.defaultValue
        //     else data[prop.name] = ""
        // })
        // // const { width, height } = nodeRef.current!?.getBoundingClientRect();
        // // console.log(width, height)
        startDrag(
            {
                id: id,
                shape: node.shape,
                data: data,
                height: height,
                width: width,
                node: {
                    getData: () => {
                        return data
                    },
                }
            },
            e,
        );
    }
    const initPanelNodes = () => {
        const nodes_ = []
        const nodeMaps = getNodes()
        console.log("nodeMaps /////////////", nodeMaps)
        for (const key in nodeMaps) {
            nodes_.push(nodeMaps[key])
        }
        setNodes(nodes_)
    }

    useEffect(() => {
        initPanelNodes();
        eventEmitter.on('node.registry.changed', initPanelNodes);
        return () => {
            eventEmitter.off('node.registry.changed', initPanelNodes);
        }
    }, [])



    return <div className="x-w-full x-h-full x-box-border x-p-3 x-flex x-flex-col x-gap-y-2">
        {nodes.map(node => {
            return <div className="x-w-full x-h-8" onMouseDown={(e) => handleMouseDown(e, node)} key={node.type}>
                <AutoNode node={{
                    getData: () => {
                        return { label: node.label, }
                    },
                }} />
            </div>
        })}
    </div>;
};

export default Panel;