// components/FlowCanvas.tsx

import React from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Edge,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import MachineNode from './customNodes/MachineNode';
import ResourceNode from './customNodes/ResourceNode';

const nodeTypes: NodeTypes = {
  machine: MachineNode,
  resource: ResourceNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void; // JAVÍTVA: Visszahelyezve
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  onNodeClick, 
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-900"
      style={{ width: '100%', height: '100%' }}
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

export default FlowCanvas;