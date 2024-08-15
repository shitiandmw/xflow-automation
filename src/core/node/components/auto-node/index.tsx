
import { useEffect, useRef, useState } from 'react';
import React, { } from 'react';
import mata from './meta'
import { eventEmitter } from '../../../events';
import SvgMore from "./svg-more"
import { isEqual } from "lodash"
import { NodeRegistryProps, MetaColumn } from "../../../types"
import { useCreation } from 'ahooks';
import { getSetter } from "../../../setter/setterRegistry";

import { createPromiseWrapper } from "../../../utils"

const OutputRow = ({ item }: { item: MetaColumn }) => {
    return <div className='x-flex x-flex-col x-gap-y-2'>
        <div className='x-flex x-items-center  x-gap-x-1'  >
            {item.label}<div className='x-px-2 x-py-1 x-text-xs x-rounded x-bg-gray-200'>{item.column_type}</div>
           
        </div> {item.children && item.children.length > 0 && <div className='x-pl-6 x-flex x-flex-col x-gap-y-2'>
                {item.children.map((child, index) => <OutputRow key={`output-child-${index}-${child.id}`} item={child} />)}
            </div>}
    </div>
}

const AutoNode = (props: any) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inputRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const outputRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const [data, updData] = useState<NodeRegistryProps>()
    const dataRef = useRef<NodeRegistryProps>();
    const setData = (data: NodeRegistryProps) => {
        dataRef.current = data
        updData(data)
    }
    const inputPromiseRef = useCreation(() => {
        return createPromiseWrapper();
    }, []);
    const outPromiseRef = useCreation(() => {
        return createPromiseWrapper();
    }, []);
    useEffect(() => {
        if (typeof props.node?.getData === 'function') {
            const nodeData = props.node.getData() as NodeRegistryProps
            if (!nodeData.scale) nodeData.scale = {
                "sx": 1,
                "sy": 1,
            }
            if (isEqual(nodeData, data)) return
            setData(nodeData)
        }
    }, [props])

    const inputChangeHandler = (e: any) => {
        // const data = props.node.getData()
        // console.log("data", data)
        props.node.setData({ ...dataRef.current, label: e.target.value })
    };

    const computePoints = async () => {
        if (!data || !data?.isCanvas) return
        let width = data.width || 500
        const ports_items = []
        const parent_rect = containerRef.current?.getBoundingClientRect()
        data.outputTypes = data.outputTypes || []
        if (data.outputTypes.length > 0 && data.outputTypes.findIndex(item => item.is_point) >= 0) {
            await outPromiseRef.promise
            for (let i = 0; i < data.outputTypes.length; i++) {
                if (data.outputTypes[i].is_point) {
                    let ref = outputRefs.current[i]
                    if (ref) {
                        const rect = ref.getBoundingClientRect()
                        let x = width
                        let y = (rect?.y - parent_rect!?.y + rect?.height / 2) / (data.scale?.sy || 1);
                        ports_items.push({
                            id: data.outputTypes[i].id,
                            group: 'custom_output',
                            args: { x, y },
                            type: 'output',
                            is_point: true,
                        })
                    }
                }
            }
        }
        else ports_items.push({ id: 'default_output', group: 'output', type: 'output' })
        ports_items.push({ id: 'default_input', group: 'input', type: 'input' })
        eventEmitter.emit('updateNode', data.id, {
            ports: {
                items: ports_items,
            },
        })
    }
    const updateRect = () => {
        if (!data || !data?.isCanvas) return
        setTimeout(() => {
            let width = data.width || 500
            const rect = containerRef.current?.getBoundingClientRect();
            const height = (rect?.height || 300) / (data.scale?.sy || 1)

            const nodeRect = {
                width: width,
                height: height,
            }
            eventEmitter.emit('updateNode', data.id, nodeRect)
            computePoints()
        }, 0);
    }

    const handInputSettleChange = (propName: string, value: any) => {
        const oldInputSettle = data?.inputSettles || {}
        const updatedInputSettle = {
            ...oldInputSettle,
            [propName]: value
        };
        props.node.setData({ ...dataRef.current, inputSettles: updatedInputSettle })
    }
    const handleChangeOutputTypes = (outputTypes: MetaColumn[]) => {
        props.node.setData({ ...dataRef.current, outputTypes: outputTypes })
    }
    // useEffect(() => {
    //     if (data?.isCanvas && containerRef.current) {
    //         let width = data.width || 500
    //         props?.node.removePorts();
    //         eventEmitter.emit('updateNode', data.id, {
    //             width: width
    //         })
    //     }
    // }, [data?.isCanvas, containerRef.current])
    useEffect(() => {
        // if (data?.isCanvas && containerRef.current) updateRect();
    }, [data])

    useEffect(() => {
        updateRect()
    }, [data?.inputTypes, data?.outputTypes])

    useEffect(() => {
        if (data?.isCanvas && inputRefs.current) {
            // console.log("inputRefs.current ///////////////////////////", inputRefs.current)
            if (Array.isArray(inputRefs.current)) {
                let isLoad = true
                for (let i = 0; i < inputRefs.current.length; i++) {
                    if (!inputRefs.current[i]) {
                        isLoad = false
                        break;
                    }
                }
                if (isLoad) {
                    console.log("inputPromiseRef isload")
                    inputPromiseRef?.resolve?.(true)
                }
            }
        }
    }, [data?.isCanvas, inputRefs.current])
    useEffect(() => {
        if (data?.isCanvas && outputRefs.current) {
            // console.log("outputRefs.current ///////////////////////////", outputRefs.current)
            if (Array.isArray(outputRefs.current)) {
                let isLoad = true
                for (let i = 0; i < outputRefs.current.length; i++) {
                    if (!outputRefs.current[i]) {
                        isLoad = false
                        break;
                    }
                }
                if (isLoad) {
                    console.log("outPromiseRef isload")
                    outPromiseRef?.resolve?.(true)
                }
            }
        }
    }, [data?.isCanvas, outputRefs.current])
    if (!data) return <>未知节点</>
    if ((!data?.isCanvas && !data?.isDrag)) return <div className='x-select-none x-w-full x-h-full x-flex x-items-center x-justify-center x-bg-white x-rounded-md x-border-slate-300  x-shadow-md ' onClick={() => { inputChangeHandler({ target: { value: '自动化节点' } }) }}>
        {data.label || '未知节点'}
    </div>

    return <>
        <div ref={containerRef} className={` x-p-3  x-w-full x-bg-white x-flex x-flex-col x-rounded-md  x-border x-border-slate-300  x-shadow-lg x-outline-blue-500 x-text-sm  ${data.selected ? 'x-outline  x-outline-2' : ''}`}>
            <div className=' x-flex x-flex-col  x-gap-1 x-mb-5'>
                <div className='x-flex x-items-center x-text-gray-900 x-text-base'>
                    <div className='x-flex-1'> {data.label || '未知节点'}</div>
                    <SvgMore className=" x-w-4 x-h-4 " />
                </div>
                <div className='x-text-gray-500'>{data.description || '自动化节点描述'}</div>
            </div>
            <div className='x-flex x-flex-col x-gap-y-2 x-cursor-pointer '>
                {data?.inputTypes && Array.isArray(data.inputTypes) && data.inputTypes.length > 0 &&
                    <div className=' x-bg-gray-50 x-rounded-md x-p-3 x-flex x-flex-col'>
                        <div className='x-h-6 x-flex x-items-center x-font-bold x-text-gray-900 x-mb-4'>输入</div>
                        <div className='x-flex x-flex-col x-gap-y-2'>
                            {data?.inputTypes.map((item, index) => {
                                console.log("item", item)
                                const SetterComponent = getSetter(item.setter);
                                let setterProps = {}
                                if (!SetterComponent) return null;
                                if (typeof item.setter == 'object') {
                                    setterProps = item.setter.props || {}
                                }
                                return <div className='x-flex x-flex-col  x-gap-2' key={`input-${index}`} ref={el => inputRefs.current[index] = el}>
                                    <div className=' x-overflow-hidden x-flex x-items-center x-gap-x-1'>
                                        <div title={item.label} className='x-whitespace-nowrap x-overflow-hidden x-text-ellipsis x-max-w-xs'>{item.label}</div>
                                        <div className='x-px-2 x-py-1 x-text-xs x-rounded x-bg-gray-200'>{item.column_type}</div>
                                        {item.required && <div className=' x-text-red-500'>*</div>}
                                    </div>
                                    <div className='x-flex-1 x-overflow-hidden'>
                                        <SetterComponent {...setterProps} refInputs={data.refInputs} onChangeOutputTypes={handleChangeOutputTypes} key={`${item.id}-${index}`} onChange={(value: any) => {
                                            handInputSettleChange(item.id, value)
                                        }} value={typeof data.inputSettles?.[item.id] == "undefined" ? item.default_value : data.inputSettles?.[item.id]} />
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>
                }
                {data?.outputTypes && Array.isArray(data.outputTypes) && data.outputTypes.length > 0 &&
                    <div className=' x-bg-gray-50 x-rounded-md x-p-3 x-flex x-flex-col x-select-none '>
                        <div className='x-h-6 x-flex x-items-center x-font-bold x-text-gray-900 x-mb-4'>输出</div>
                        <div className='x-flex x-flex-col x-gap-y-2 x-max-h-96 x-overflow-y-auto'>
                            {data?.outputTypes.map((item, index) => {
                                return <div key={`output-${index}`} ref={el => outputRefs.current[index] = el}><OutputRow item={item} /></div>
                            })}

                        </div>
                    </div>
                }
            </div>
        </div>
    </>
}

const AutoNodeMeta = mata;

export { AutoNode, AutoNodeMeta };