import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MACHINE_DEFINITIONS } from './constants';
import { MachineNodeData, ResourceNodeData, Summary, SaveFile, CustomNode } from './types';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import EditModal from './components/modals/EditModal';

let idCounter = 1;
const getId = () => `node_${idCounter++}`;

const initialNodes: CustomNode[] = [
  {
    id: 'input_1',
    type: 'resource',
    position: { x: 50, y: 50 },
    data: { type: 'input', resource: 'Iron Ore' },
  },
  {
    id: 'output_1',
    type: 'resource',
    position: { x: 800, y: 450 },
    data: { type: 'output', resource: 'Iron Ingot' },
  },
];

function FlowchartEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [summary, setSummary] = useState<Summary>({ power: 0, balance: new Map() });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setViewport, getViewport } = useReactFlow();

  const [editingNode, setEditingNode] = useState<CustomNode | null>(null);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: CustomNode) => {
    setEditingNode(node);
  }, []);

  const handleUpdateNode = (updatedData: MachineNodeData | ResourceNodeData) => {
    if (!editingNode) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === editingNode.id) {
          return { ...n, data: { ...n.data, ...updatedData } };
        }
        return n;
      })
    );
    setEditingNode(null);
  };

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addMachineNode = useCallback((machineType: string) => {
    const machineDef = MACHINE_DEFINITIONS[machineType];
    if (!machineDef) return;

    const newNode: Node<MachineNodeData> = {
      id: getId(),
      type: 'machine',
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400,
      },
      data: JSON.parse(JSON.stringify(machineDef)), // Deep copy to avoid reference issues
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const addResourceNode = useCallback((type: 'input' | 'output') => {
    const resource = prompt(`Enter ${type} resource name:`, 'Water');
    if (!resource) return;

    const newNode: Node<ResourceNodeData> = {
      id: getId(),
      type: 'resource',
      position: {
        x: type === 'input' ? Math.random() * 100 : Math.random() * 200 + 600,
        y: Math.random() * 400,
      },
      data: { type, resource },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const handleSave = useCallback(() => {
    const saveData: SaveFile = {
        nodes: nodes,
        edges: edges,
        viewport: getViewport(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flowchart.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [nodes, edges, getViewport]);

  const handleLoad = () => {
    fileInputRef.current?.click();
  };
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content !== 'string') throw new Error("Invalid file content");
          const loadedData: SaveFile = JSON.parse(content);
          
          if (loadedData.nodes && loadedData.edges && loadedData.viewport) {
            // Re-initialize idCounter to avoid collisions
            let maxId = 0;
            loadedData.nodes.forEach(n => {
                const numId = parseInt(n.id.replace('node_', ''), 10);
                if (!isNaN(numId) && numId > maxId) {
                    maxId = numId;
                }
            });
            idCounter = maxId + 1;

            setNodes(loadedData.nodes);
            setEdges(loadedData.edges);
            setViewport(loadedData.viewport);
          } else {
            alert('Error: Invalid file format.');
          }
        } catch (error) {
          console.error("Failed to load file:", error);
          alert('Error: Could not parse file. Is it a valid flowchart save?');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  useEffect(() => {
    const newSummary: Summary = { power: 0, balance: new Map() };
    nodes.forEach(node => {
        if (node.type === 'machine') {
            const data = node.data as MachineNodeData;
            newSummary.power += data.power;
            const operationsPerSecond = data.speed;
            
            data.inputs.forEach(input => {
                const current = newSummary.balance.get(input.name) || 0;
                newSummary.balance.set(input.name, current - (input.amount * operationsPerSecond));
            });
            data.outputs.forEach(output => {
                const current = newSummary.balance.get(output.name) || 0;
                newSummary.balance.set(output.name, current + (output.amount * operationsPerSecond));
            });
        }
    });

    setSummary(newSummary);
  }, [nodes, edges]);

  return (
    <div className="flex h-screen w-screen font-sans text-white bg-gray-900">
      <Sidebar 
        addMachineNode={addMachineNode} 
        addResourceNode={addResourceNode}
        onSave={handleSave}
        onLoad={handleLoad}
        summary={summary}
      />
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
      />
      {editingNode && (
        <EditModal
          node={editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleUpdateNode}
        />
      )}
      <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".json" />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowchartEditor />
    </ReactFlowProvider>
  );
}