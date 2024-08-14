import { Graph, XFlow, Path, XFlowGraph, Clipboard, Control, Background,register } from '@antv/xflow';
import { DAG_CONNECTOR } from './consts';
import Panel from './panel';
// import Setter from './setter';
import { Keyboard } from './keyboard';
import { getEdgeMeta } from './edge';
import React, { forwardRef } from 'react';
import { getFlowData, setFlowData } from './flow'
import { EdgeMeta, FLowMetaData } from './types';

import { StringSetter, BooleanSetter, RadioGroupSetter, registerSetter } from './setter'
import { AutoNode } from './node';

const output_circle = {
    r: 6,
    magnet: true,
    stroke: '#0284c7',
    strokeWidth: 1,
    fill: '#fff',
}
const input_circle = {
    r: 6,
    magnet: true,
    stroke: '#31d0c6',
    strokeWidth: 1,
    fill: '#fff',
}
const point_group = {
    input: {
        position: 'left',
        attrs: {
            circle: input_circle,
        },
    },
    output: {
        position: 'right',
        attrs: {
            circle: output_circle,
        },
    },
    custom_input: {
        position: 'absolute',
        attrs: {
            circle: input_circle,
        },
    },
    custom_output: {
        position: 'absolute',
        attrs: {
            circle: output_circle,
        },
    },
}
// import { getNode } from './node'

 // 注册自定义节点
 register({
    shape: "AutoNode",
    component: AutoNode,
    effect: ['data'],
    ports:{
        items: [
            {
                id: 'default_input',
                group: 'input',
                type: 'input',
            },
            {
                id: 'default_output',
                group: 'output',
                type: 'output',
            },

        ],
        groups: point_group,
    }

});

// 注册设置器
registerSetter("StringSetter", StringSetter)
registerSetter("BooleanSetter", BooleanSetter)
registerSetter("RadioGroupSetter", RadioGroupSetter)

type EventRefType = {
    getFlowData: () => any;
    setFlowData: (data: FLowMetaData) => void
};

Graph.registerConnector(
    DAG_CONNECTOR,
    (s, e) => {
        const offset = 4;
        const deltaX = Math.abs(e.x - s.x);
        const control = Math.floor((deltaX / 3) * 2);

        const v1 = { x: s.x + offset + control, y: s.y };
        const v2 = { x: e.x - offset - control, y: e.y };

        return Path.normalize(
            `M ${s.x} ${s.y}
       L ${s.x + offset} ${s.y}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x - offset} ${e.y}
       L ${e.x} ${e.y}
      `,
        );
    },
    true,
);


export interface XFlowExtendProps {
    mode?: string;
}

// 流程引擎 
const XFlowAutomation = forwardRef(({ mode = "desgin" }: XFlowExtendProps, ref) => {
    const registerEdge = (edgeMeta: EdgeMeta) => {
        try {
            Graph.registerEdge(edgeMeta.id, {
                attrs: {
                    line: {
                        stroke: edgeMeta.color,
                        strokeWidth: edgeMeta.width,
                        targetMarker: {
                            name: 'block',
                            width: 14,
                            height: 10,
                        },
                        opacity: edgeMeta?.opacity || 1,
                    },
                    label: {
                        fill: '#000',
                        fontSize: 14,
                        textAnchor: 'middle',
                        textVerticalAnchor: 'middle',
                        pointerEvents: 'none',
                    },
                    body: {
                        ref: 'label',
                        fill: '#ff3300',
                        stroke: '#ffa940',
                        strokeWidth: 1,
                        rx: 4,
                        ry: 4,
                        refWidth: '140%',
                        refHeight: '140%',
                        refX: '-20%',
                        refY: '-20%',
                    },
                },
            });

        } catch (error) {
        }

    }
    const edgeMeta = getEdgeMeta()
    registerEdge(edgeMeta)
    registerEdge({
        id: "ignore_edge",
        color: edgeMeta.color, // 连接线颜色
        width: edgeMeta.width,// 连接线宽度
        opacity: 0.1
    })
    const eventRef = React.useRef<EventRefType>(null);
    React.useImperativeHandle(ref, () => ({
        getFlowData: getFlowData,
        setFlowData: (data: FLowMetaData) => {
            eventRef.current?.setFlowData(data)
            setFlowData(data)
        },
    }), []);


    return <div className='x-w-full x-h-full  x-text-sm '>
        <XFlow >
            <div className='x-w-full x-h-full x-flex '>
                <div className={'x-w-44 x-h-full x-border-r x-border-gray-200 x-bg-[#f7f7fa] ' + (mode == "desgin" ? '' : 'x-hidden')}>
                    <Panel />
                </div>
                <div className=' x-flex-1 x-relative x-overflow-hidden x-bg-gray-100'>
                    <XFlowGraph
                        pannable
                        zoomable
                        connectionOptions={{
                            snap: true,
                            allowBlank: false,
                            allowLoop: false,
                            allowNode: false,
                            highlight: true,
                            connectionPoint: 'anchor',
                            anchor: 'center',
                            connector: DAG_CONNECTOR,

                            validateMagnet({ magnet }) {
                                return magnet.getAttribute('port-group') !== 'top';
                            },
                        }}
                        connectionEdgeOptions={{
                            shape: edgeMeta.id,
                            animated: true,
                            zIndex: -1,
                        }}
                    />
                    <Background color="#f2f3f5" />
                    <div className=' x-absolute x-top-2 x-left-2 x-shadow x-rounded x-bg-white'>
                        <Control
                            items={['zoomOut', 'zoomTo', 'zoomIn', 'zoomToFit', 'zoomToOrigin']}
                        />
                    </div>
                </div>

                <Keyboard ref={eventRef} mode={mode} />
                <Clipboard />
                {/* <div className='x-w-52'><Setter /></div> */}
                {/* <Transform resizing rotating /> */}
            </div>

        </XFlow>
    </div>;
})

export default XFlowAutomation;

export * from './types'
export * from './setter'
export * from './edge'
export * from './node'
export * from './flow'