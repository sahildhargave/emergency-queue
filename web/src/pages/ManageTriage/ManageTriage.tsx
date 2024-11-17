import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
  OnConnect,
  OnEdgesChange,
  MarkerType,
  Controls,
  MiniMap,
  BackgroundVariant,
  Background,
  ConnectionLineType
} from '@xyflow/react';
 

import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

import { CustomNodeTypes, StepTypes } from '../../types';
import { EmptyTriage } from './components/EmptyTriage';
import { TriageStep } from './components/TriageStep/TriageStep';
import { triageOption } from './components/TriageOption/TriageOption';

const nodeTypes = {
  triageStep: TriageStep,
  triageOption: triageOption
};


const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black'},
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
  zIndex: 1,
  animated: true
};

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black'
};


 
export default function ManageTraiage() {
  const [nodes , setNodes ] = useState<Node[]>([]);
  const [edges, setEdges ] = useState<Edge[]>([]);

  //😎😎😋😉 add the customaization logic 

  const [savingChanges, setSavingChanges ] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt ] = useState<number | null>(null); 
 
   const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => {
      setSavingChanges(true);
      setLastUpdatedAt(performance.now());
      setNodes((nodes: Node[]) => applyNodeChanges(changes, nodes));
    }, []
  );

    const onEdgesChange: OnEdgesChange<Edge> = useCallback(
    (changes: any) => {
        setSavingChanges(true);
      setLastUpdatedAt(performance.now());
        setEdges((edges: Edge[]) => applyEdgeChanges(changes, edges))
    },[]
  );
  
  const onConnect: OnConnect = useCallback(
    (params: any) =>{
      setSavingChanges(true);
      setLastUpdatedAt(performance.now());
      setEdges((eds :any) => addEdge(params, eds));
    },
    [setEdges],
  );

 const createRootNode = useCallback(() => {
    setNodes([{
      id: crypto.randomUUID(),
      type: CustomNodeTypes.TriageStep,
      position: { x: 100, y: 100 },
      data: { value: '', isRoot: true, stepType: StepTypes.Step }
    }]);
  }, []);


  useDebouncedCallback(() => {
    if(!lastUpdatedAt) return;

    // TODO: Save chaning to the db
    setSavingChanges(false);

  },[lastUpdatedAt], 3000);
 
  if(!nodes.length) return <EmptyTriage onClick={createRootNode}/> ;

  return (
  <>
    <div style={{ width: '100vw', height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        className='bg-red-50'
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
      >
      <Controls/>
      <MiniMap/>
      <Background variant={BackgroundVariant.Cross} />
      </ReactFlow>
    </div>
    <div className={clsx(
    'absolute top-[78px] left-2 p-2 rounded-lg text-sm z-10',
    savingChanges ? 'bg-black text-white': 'bg-white text-black'  
  )}>
   {savingChanges ? '⏳ Saving Changes' : '✅ Changes saved!'}
  </div>
    </>
  );
};