import './App.css'
import XFlowAutomation, { registerSetter, FLowMetaData, registerDataChangeHandler, unregisterDataChangeHandler, registerNodeProps } from './core'
import { StringSetter, BooleanSetter, RadioGroupSetter } from './core/setter'

import React, { useEffect } from 'react';

import { nodeProps } from './nodeDatas';


// 注册自定义的设置器
registerSetter("StringSetter", StringSetter)
registerSetter("BooleanSetter", BooleanSetter)
registerSetter("RadioGroupSetter", RadioGroupSetter)


type FlowRefType = {
  getFlowData: () => any;
  setFlowData: (data: any) => void;
};
const App = () => {
  const [mode, setMode] = React.useState('desgin')
  const handleFLowDataChange = (data: FLowMetaData) => {
    console.log('流程数据变化', data)
    localStorage.setItem('flowData', JSON.stringify(data))
  }
  const flowRef = React.useRef<FlowRefType>();
  const getFlowData = () => {
    const flowData = flowRef.current?.getFlowData()
    localStorage.setItem('flowData', JSON.stringify(flowData))
    console.log('获取数据', flowData)
  }
  const setFlowData = () => {
    const flowData = JSON.parse(localStorage.getItem('flowData') || '{}')
    console.log("flowData*********", flowData)
    if (flowData?.edges)
      flowData.edges = flowData.edges.map((edge: any) => {
        edge.shape = "ignore_edge"
        if (edge?.label) {
          edge.label.attrs.text.opacity = 0.2
        }
        return edge
      })
    flowRef.current?.setFlowData(flowData)
    console.log('设置数据', flowData)
  }
  const handleMode = () => {
    setMode(mode === 'view' ? 'desgin' : 'view')
  }
  useEffect(() => {
    // 测试延迟注册节点（模拟后端获取数据）
    setTimeout(() => {
      registerNodeProps(nodeProps)
    }, 1000);
    registerDataChangeHandler(handleFLowDataChange)
    return () => {
      unregisterDataChangeHandler(handleFLowDataChange)
    }
  }, [])
  return <div className='x-w-screen x-h-screen x-bg-gray-400 x-flex x-justify-center x-items-center x-flex-col'>
    <div className='x-w-full x-h-14 x-pl-2 x-border-b x-bg-white x-flex x-items-center x-gap-1 '>
      <div onClick={getFlowData} className=' x-rounded x-border x-bg-blue-500  x-text-gray-50 x-p-4 x-w-32 x-h-10 x-cursor-pointer x-flex x-justify-center x-items-center '>
        获取数据
      </div>
      <div onClick={setFlowData} className=' x-rounded x-border x-bg-green-500  x-text-gray-50 x-p-4 x-w-32 x-h-10 x-cursor-pointer x-flex x-justify-center x-items-center '>
        设置数据
      </div>
      <div onClick={handleMode} className=' x-rounded x-border x-bg-gray-500  x-text-gray-50 x-p-4 x-w-32 x-h-10 x-cursor-pointer x-flex x-justify-center x-items-center '>
        修改状态
      </div>
    </div>

    <div className='x-w-full x-flex-1 x-bg-white x-overflow-hidden'>
      <XFlowAutomation mode={mode} ref={flowRef} />
    </div>
  </div>
}

export default App
