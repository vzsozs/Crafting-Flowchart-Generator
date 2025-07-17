import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Edge,
} from 'reactflow';
import MachineNode from './customNodes/MachineNode';
import ResourceNode from './customNodes/ResourceNode';
import { CustomNode } from '../types';

interface FlowCanvasProps {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeDoubleClick }) => {
  const nodeTypes = useMemo(() => ({ 
    machine: MachineNode,
    resource: ResourceNode 
  }), []);

  return (
    <div className="flex-grow h-full" style={{ background: '#111827' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-900"
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#4b5563" />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;