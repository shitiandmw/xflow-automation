
import { useEffect, useState } from 'react';
import React, { useImperativeHandle } from 'react';
import mata from './meta'
import { eventEmitter } from '../../../events';
// import { debounce } from 'lodash';
export interface AutoNodeProps {
    id: string;
    isDrag?: boolean;
    isCanvas?: boolean;
    selected?: boolean;
    label?: string;
    inputs: any[],
    outputs: any[],
}
// 输出参数类型结构
const outputTypes = [
    { label: "用户名称", id: "user_name", column_type: "String", required: false, component_name: "Field.Input" },
    {
        label: "所属部门", id: "user_depts", column_type: "Array<User>", required: false, component_name: "Field.Input", children: [
            { label: "部门id", id: "dept_id", column_type: "Number", required: false, component_name: "Field.Input" },
            { label: "部门名称", id: "dept_name", column_type: "String", required: false, component_name: "Field.Input" },
        ]
    },
]
const inputTypes = [
    {
        label: "用户名称", id: "user_name", column_type: "String", required: false, component_name: "Field.Input", setter: {
            name: "StringSetter",
            props: {}
        }
    },
]

const AutoNode = (props: any) => {

    
    const [data, setData] = useState<AutoNodeProps>()
    useEffect(() => {
        const nodeData = props.node.getData()
        nodeData.input
        typeof props.node?.getData === 'function' && setData(nodeData)
    }, [props])

    // useEffect(()=>{
    //     if (props.isCanvas) {
    //         props.updateNode({width:600})
    //     }
    // },[props.isCanvas])


    const inputChangeHandler = (e: any) => {
        // const data = props.node.getData()
        // console.log("data", data)
        props.node.setData({ ...data, label: e.target.value })

    };
    // const updateInput = ()=>{
    //     if (!props.isCanvas) return 
    //     eventEmitter.emit('updateNode', props.id, { data:{ ...props, label: props.label + "1"}})
    //     setTimeout(() => {
    //         updateInput()
    //     }, 4000);
    // }

    // useEffect(()=>{
    //     updateInput()
    // },[])
    useEffect(() => {
        if (data && data?.isCanvas) {
            eventEmitter.emit('updateNode', data.id, {
                width: 300,
                ports: {
                    items: [
                        {
                            id: 'port1',
                            group: 'input',
                            args: { x: 0, y: 20 },
                            type: 'input',
                            datatype: "string",
                        },
                        {
                            id: 'port2',
                            group: 'input',
                            args: { x: 0, y: 40 },
                            type: 'input',
                            datatype: "number"
                        },
                        {
                            id: 'port3',
                            group: 'output',
                            args: { x: 300, y: 20 },
                            type: 'output',
                            datatype: "string"
                        },
                        {
                            id: 'port4',
                            group: 'output',
                            args: { x: 300, y: 40 },
                            type: 'output',
                            datatype: "number"
                        },
                    ],
                    groups: {
                        input: {
                            position: 'absolute',
                            attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#31d0c6',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        },
                        output: {
                            position: 'absolute',
                            attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#0284c7',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        },
                    },
                },
            })
        }
    }, [data])

    if (!data || !data?.isCanvas) return <div className='x-w-full x-h-full x-flex x-items-center x-justify-center x-bg-white  x-border x-border-slate-300 ' onClick={() => { inputChangeHandler({ target: { value: '自动化节点' } }) }}>
        自动化节点
    </div>

    return <>
        <div className={` x-w-full x-bg-white x-flex x-flex-col x-rounded-md  x-border x-border-slate-300  x-shadow-md x-outline-blue-500 x-text-base  ${data.selected ? 'x-outline  x-outline-1' : ''}`}>
            <div className='x-h-10 x-flex x-items-center x-justify-center x-text-slate-500'>
                <input className='x-w-full' value={data.label || '自动化节点'} onChange={inputChangeHandler} ></input>
            </div>
            <div className='x-px-2 x-flex x-flex-col x-gap-y-2 x-py-2'>
                <div className='x-flex x-flex-col x-cursor-pointer '>
                    <div className=' x-bg-gray-50 x-rounded-md x-px-2 x-flow x-gap-y-2 x-text-sm '>
                        <div className='x-h-8 x-flex x-items-center -x-mx-2 x-border-b x-px-2 '>inputs</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b x-border-gray-100 x-text-gray-500 x-h-6 '>sdfsdfsd f 1</div>
                    </div>
                </div>
                <div className='x-flex x-flex-col x-cursor-pointer '>
                    <div className=' x-bg-gray-50 x-rounded-md x-px-2 x-gap-y-2 '>
                        <div className='x-h-8 x-flex x-items-center  x-text-ms '>outputs</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f 1</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f2</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f3</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f4</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f5</div>
                        <div className=' x-flex x-items-center x-border-b '>sdfsdfsd f6</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const AutoNodeMeta = mata;

export { AutoNode, AutoNodeMeta };