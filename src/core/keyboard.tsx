import { useGraphEvent, useGraphStore, useGraphInstance } from '@antv/xflow';
import { useKeyboard, useHistory, useClipboard } from '@antv/xflow';
import { useCallback, useEffect } from 'react';
import React, { forwardRef } from 'react';
import { setFlowDataByName } from './flow';
import { FLowMetaData } from './types';
import { eventEmitter } from './events';

export interface KeyboardProps {
  mode?: string;
}
const Keyboard = forwardRef(({ mode = "desgin" }: KeyboardProps, ref) => {
  const { copy, paste, cut } = useClipboard();
  const { undo, redo } = useHistory();
  const graph = useGraphInstance();
  useEffect(() => {
    console.log("graph edit", graph)
  }, [graph])
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const initData = useGraphStore((state) => state.initData);


  const updateEdge = useGraphStore((state) => state.updateEdge);
  const updateNode = useGraphStore((state) => state.updateNode);

  const removeNodes = useGraphStore((state) => state.removeNodes);
  const removeEdges = useGraphStore((state) => state.removeEdges);

  const selectNodeIds = useCallback(() => {
    const nodeSelected = nodes.filter((node) => node.selected);
    const nodeIds: string[] = nodeSelected.map((node) => node.id!);
    return nodeIds;
  }, [nodes]);

  const selectEdgeIds = useCallback(() => {
    const edgesSelect = edges.filter((edge) => edge.selected);
    const edgeIds: string[] = edgesSelect.map((edge) => edge.id!);
    return edgeIds;
  }, [edges]);

  const selectShapeIds = () => {
    return [...selectEdgeIds(), ...selectNodeIds()];
  };

  const keyboardBase = (fn: (...args: any) => any) => {
    if (mode != "desgin") return
    typeof fn === 'function' && fn();
  }

  useKeyboard(['meta+c', 'ctrl+c'], () => {
    keyboardBase(() => { copy(selectShapeIds()); })
  });

  useKeyboard(['meta+v', 'ctrl+v'], () => {
    keyboardBase(() => {
      console.log('paste');
      paste({ offset: 48 });
    })
  });

  useKeyboard(['meta+x', 'ctrl+x'], () => {
    keyboardBase(() => {
      cut(selectShapeIds());
    })
  });

  useKeyboard(['backspace', 'delete'], () => {
    keyboardBase(() => {
      removeNodes(selectNodeIds());
      removeEdges(selectEdgeIds());
    })
  });

  useKeyboard(['meta+z', 'ctrl+z'], () => {
    keyboardBase(() => {
      undo();
    })
  });
  useKeyboard(['meta+shift+z', 'ctrl+shift+z'], () => {
    keyboardBase(() => {
      redo();
    })
  });

  useKeyboard(['meta+a', 'ctrl+a'], (e) => {
    e.preventDefault();
    keyboardBase(() => {
      nodes.map((node) => updateNode(node.id!, {
        selected: true, data: {
          ...node.data,
          selected: true,
        }
      }));
      edges.map((edge) => updateEdge(edge.id, {
        selected: true, data: {
          ...edge.data,
          selected: true,
        }
      }));
    })

  });

  useGraphEvent('edge:connected', ({ edge }) => {
    updateEdge(edge.id, {
      animated: false,
    });
  });

  // useGraphEvent('edge:selected', ({ edge }) => {
  //   updateEdge(edge.id, {
  //     animated: true,
  //   });
  // });

  // useGraphEvent('edge:unselected', ({ edge }) => {
  //   updateEdge(edge.id, {
  //     animated: false,
  //   });
  // });

  // 同时删除与节点相关的连接线
  useGraphEvent('node:removed', ({ node }) => {
    const edgesToRemove = edges.filter((edge: any) => {
      return edge.target.cell == node.id || edge.source.cell == node.id
    });
    removeEdges(edgesToRemove.map((edge) => edge.id));
  })


  useGraphEvent('node:selected', ({ node }) => {
    console.log('node:selected', node);
    const nodeCopy = {
      id: node.id,
      data: {
        ...node.data,
        selected: true,
      },
    }
    updateNode(node.id!, {
      data: nodeCopy.data
    });
  });
  useGraphEvent('node:unselected', ({ node }) => {
    
    updateNode(node.id!, {
      data: {
        ...node.data,
        selected: false,
      }
    });
  });
  useGraphEvent('node:change:data', ({ node }) => {
    console.log('node:change:data', node.data);
  })
  useGraphEvent('node:added', ({ node}) => {
    console.log('node:added', node.data);
    updateNode(node.id!, {
      data: {
        ...node.data,
        isDrag: false,
        isCanvas: true,
      }
    })
  })
  useGraphEvent('edge:connected', ({ edge, isNew }) => {
    if (isNew) {
      const sourcePortId = edge.getSourcePortId();
      const targetPortId = edge.getTargetPortId();

      const sourceCell = edge.getSourceCell() as any;
      const targetCell = edge.getTargetCell() as any;

      const sourcePort = sourceCell!.port.ports.find((port: any) => port.id === sourcePortId)
      const targetPort = targetCell!.port.ports.find((port: any) => port.id === targetPortId)

      console.log("sourcePort", sourcePort)

      console.log("targetPort", targetPort)

      if (!sourcePort || !targetPort || sourcePort.type !== 'output' || targetPort.type !== 'input' || sourcePort.datatype != targetPort.datatype) {
        edge.remove();
      }
    }
  })
  React.useEffect(() => {
    setFlowDataByName("nodes", nodes);
  }, [nodes]);
  React.useEffect(() => {
    setFlowDataByName("edges", edges);
  }, [edges]);

  React.useImperativeHandle(ref, () => ({
    setFlowData: (data: FLowMetaData) => {
      initData({ nodes: data?.nodes || [], edges: data.edges || [] })
      setTimeout(() => {
        graph?.zoomToFit({ maxScale: 1 });
      }, 0);
    },
  }), [graph]);

  const handleUpdateNode = (id: string, data: any, options:any) => {
    console.log("begin *///////////*",data)
    updateNode(id,data,options)
  }

  React.useEffect(() => {
    console.log("init keyborad ////////////////")
    eventEmitter.on('updateNode', handleUpdateNode)
    return () => {
      eventEmitter.off('updateNode', handleUpdateNode)
    }
  }, []);
  return null;
});

export { Keyboard };