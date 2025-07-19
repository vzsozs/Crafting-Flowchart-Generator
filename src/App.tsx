// Teljes, komplett App.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, useReactFlow, Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { MachineNodeData, ResourceNodeData, Summary, CustomNode, RecipeItem, SummaryItem } from './types';
import Sidebar from '../components/Sidebar';
import FlowCanvas from '../components/FlowCanvas';
import EditModal from '../components/modals/EditModal';

let idCounter = 1;
const getId = (prefix: string = 'node') => `${prefix}_${idCounter++}`;
const getRecipeItemId = () => `item_${Date.now()}_${Math.random()}`;

const initialNodes: CustomNode[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [summary, setSummary] = useState<Summary>({ power: 0, balance: new Map(), nodeCount: 0, edgeCount: 0 });
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [summaryItems, setSummaryItems] = useState<SummaryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getViewport, getNode, setViewport } = useReactFlow();
  const [editingNode, setEditingNode] = useState<CustomNode | null>(null);

  useEffect(() => {
    const nameSet = new Set<string>();
    const totals = new Map<string, { totalInput: number, totalOutput: number }>();
    const overallSummary: Summary = { power: 0, balance: new Map(), nodeCount: nodes.length, edgeCount: edges.length };

    nodes.forEach(node => {
      if (node.type === 'machine') {
        const data = node.data as MachineNodeData;
        nameSet.add(data.label);
        overallSummary.power += data.power;
        const operationsPerSecond = data.speed;

        data.inputs.forEach(input => {
          nameSet.add(input.name);
          const currentItem = totals.get(input.name) || { totalInput: 0, totalOutput: 0 };
          currentItem.totalInput += input.amount * operationsPerSecond;
          totals.set(input.name, currentItem);
        });
        
        data.outputs.forEach(output => {
          nameSet.add(output.name);
          const currentItem = totals.get(output.name) || { totalInput: 0, totalOutput: 0 };
          currentItem.totalOutput += output.amount * operationsPerSecond;
          totals.set(output.name, currentItem);
        });
      } else if (node.type === 'resource') {
        const data = node.data as ResourceNodeData;
        if (data.resource) {
          nameSet.add(data.resource);
        }
      }
    });

    setNameSuggestions(Array.from(nameSet).sort());
    setSummary(overallSummary);
    const newSummaryItems = Array.from(totals, ([name, { totalInput, totalOutput }]) => ({ name, totalInput, totalOutput })).sort((a, b) => a.name.localeCompare(b.name));
    setSummaryItems(newSummaryItems);
  }, [nodes]);

  const openEditModal = useCallback((node: Node) => setEditingNode(node as CustomNode), []);

  const addMachineFromResource = useCallback((resourceNodeId: string) => {
    const resourceNode = getNode(resourceNodeId) as Node<ResourceNodeData> | undefined;
    if (!resourceNode) return;
    const isInputNode = resourceNode.data.type === 'input';
    const newRecipeItem: RecipeItem = { id: getRecipeItemId(), name: resourceNode.data.resource, amount: 1 };
    const newMachineNode: Node<MachineNodeData> = {
      id: getId('machine'), type: 'machine',
      position: { x: resourceNode.position.x + (isInputNode ? -350 : 350), y: resourceNode.position.y },
      data: {
        label: `${isInputNode ? 'Producer' : 'Consumer'} for ${resourceNode.data.resource}`,
        power: 10, speed: 1,
        inputs: isInputNode ? [] : [newRecipeItem],
        outputs: isInputNode ? [newRecipeItem] : [],
      },
    };
    const newEdge: Edge = {
      id: `edge_${isInputNode ? newMachineNode.id : resourceNode.id}-${isInputNode ? resourceNode.id : newMachineNode.id}`,
      source: isInputNode ? newMachineNode.id : resourceNode.id,
      target: isInputNode ? resourceNode.id : newMachineNode.id,
      sourceHandle: !isInputNode ? newRecipeItem.id : 'output_handle',
      targetHandle: isInputNode ? 'input_handle' : newRecipeItem.id,
      label: newRecipeItem.amount.toString(),
      labelBgStyle: { fill: '#2d3748', fillOpacity: 0.9 },
      labelBgPadding: [4, 8], labelBgBorderRadius: 4,
      labelStyle: { fill: '#e2e8f0' },
    };
    setNodes(nds => [...nds, newMachineNode]);
    setEdges(eds => addEdge(newEdge, eds));
  }, [getNode, setNodes, setEdges]);
  
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.type === 'machine') {
          return { ...node, data: { ...node.data, onEdit: () => openEditModal(node) } };
        }
        if (node.type === 'resource') {
          return { ...node, data: { ...node.data, onEdit: () => openEditModal(node), onAddMachine: () => addMachineFromResource(node.id) } };
        }
        return node;
      })
    );
  }, [nodes.length, openEditModal, addMachineFromResource, setNodes]);
  
  const addMachineNode = useCallback(() => {
    const newNode: Node<MachineNodeData> = {
      id: getId('machine'), type: 'machine',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 },
      data: { label: 'New Machine', power: 10, speed: 1, inputs: [], outputs: [] },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const handleUpdateNode = (updatedData: MachineNodeData | ResourceNodeData) => {
    if (!editingNode) return;
    if (editingNode.type === 'machine') {
      const oldNode = getNode(editingNode.id) as Node<MachineNodeData>;
      const oldMachineData = oldNode.data;
      const newMachineData = updatedData as MachineNodeData;
      const nodesToDelete = new Set<string>();
      const edgesToDelete = new Set<string>();
      oldMachineData.inputs.forEach(oldInput => {
        if (!newMachineData.inputs.some(newInput => newInput.id === oldInput.id)) {
          const edge = edges.find(e => e.target === oldNode.id && e.targetHandle === oldInput.id);
          if (edge) { nodesToDelete.add(edge.source); edgesToDelete.add(edge.id); }
        }
      });
      oldMachineData.outputs.forEach(oldOutput => {
        if (!newMachineData.outputs.some(newOutput => newOutput.id === oldOutput.id)) {
          const edge = edges.find(e => e.source === oldNode.id && e.sourceHandle === oldOutput.id);
          if (edge) { nodesToDelete.add(edge.target); edgesToDelete.add(edge.id); }
        }
      });
      const edgesToUpdate: Edge[] = [];
      newMachineData.inputs.forEach(newInput => {
        const oldInput = oldMachineData.inputs.find(i => i.id === newInput.id);
        if (oldInput && oldInput.amount !== newInput.amount) {
          const edge = edges.find(e => e.target === oldNode.id && e.targetHandle === newInput.id);
          if (edge) { edgesToUpdate.push({ ...edge, label: newInput.amount.toString() }); }
        }
      });
      newMachineData.outputs.forEach(newOutput => {
        const oldOutput = oldMachineData.outputs.find(o => o.id === newOutput.id);
        if (oldOutput && oldOutput.amount !== newOutput.amount) {
          const edge = edges.find(e => e.source === oldNode.id && e.sourceHandle === newOutput.id);
          if (edge) { edgesToUpdate.push({ ...edge, label: newOutput.amount.toString() }); }
        }
      });
      const newNodesToAdd: CustomNode[] = [];
      const newEdgesToAdd: Edge[] = [];
      newMachineData.inputs.forEach((newInput) => {
        if (!oldMachineData.inputs.some(oldInput => oldInput.id === newInput.id)) {
          const resourceNodeId = getId('resource');
          newNodesToAdd.push({ id: resourceNodeId, type: 'resource', position: { x: oldNode.position.x - 250, y: oldNode.position.y - 20 + (newMachineData.inputs.indexOf(newInput) * 80) }, data: { type: 'input', resource: newInput.name, isStocked: false, color: '#facc15' }});
          newEdgesToAdd.push({ id: `edge_${resourceNodeId}-${oldNode.id}`, source: resourceNodeId, target: oldNode.id, targetHandle: newInput.id, label: newInput.amount.toString(), labelBgStyle: { fill: '#2d3748' }, labelBgPadding: [4, 8], labelBgBorderRadius: 4, labelStyle: { fill: '#e2e8f0' } });
        }
      });
      newMachineData.outputs.forEach((newOutput) => {
        if (!oldMachineData.outputs.some(oldOutput => oldOutput.id === newOutput.id)) {
          const resourceNodeId = getId('resource');
          newNodesToAdd.push({ id: resourceNodeId, type: 'resource', position: { x: oldNode.position.x + 250, y: oldNode.position.y - 20 + (newMachineData.outputs.indexOf(newOutput) * 80) }, data: { type: 'output', resource: newOutput.name }});
          newEdgesToAdd.push({ id: `edge_${oldNode.id}-${resourceNodeId}`, source: oldNode.id, target: resourceNodeId, sourceHandle: newOutput.id, label: newOutput.amount.toString(), labelBgStyle: { fill: '#2d3748' }, labelBgPadding: [4, 8], labelBgBorderRadius: 4, labelStyle: { fill: '#e2e8f0' } });
        }
      });
      setNodes(nds => nds.map(n => (n.id === editingNode.id ? { ...n, data: updatedData } : n)).filter(n => !nodesToDelete.has(n.id)).concat(newNodesToAdd));
      setEdges(eds => eds.map(e => edgesToUpdate.find(ue => ue.id === e.id) || e).filter(e => !edgesToDelete.has(e.id)).concat(newEdgesToAdd));
    }
    if (editingNode.type === 'resource') {
      const newResourceData = updatedData as ResourceNodeData;
      const newResourceName = newResourceData.resource;
      const connectedEdges = edges.filter(e => e.source === editingNode.id || e.target === editingNode.id);
      setNodes(currentNodes => 
        currentNodes.map(node => {
          if (node.id === editingNode.id) {
            return { ...node, data: { ...newResourceData, onEdit: () => openEditModal(node), onAddMachine: () => addMachineFromResource(node.id) } };
          }
          const relevantEdge = connectedEdges.find(edge => (edge.source === node.id || edge.target === node.id));
          if (node.type === 'machine' && relevantEdge) {
            const machineData = node.data as MachineNodeData;
            const newInputs = machineData.inputs.map(input => (input.id === relevantEdge.targetHandle) ? { ...input, name: newResourceName } : input);
            const newOutputs = machineData.outputs.map(output => (output.id === relevantEdge.sourceHandle) ? { ...output, name: newResourceName } : output);
            return { ...node, data: { ...machineData, inputs: newInputs, outputs: newOutputs } };
          }
          return node;
        })
      );
    }
    setEditingNode(null);
  };
  
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const handleSave = useCallback(() => {
    // A getViewport() lekéri a vászon aktuális pozícióját és nagyítását.
    const saveData = {
      nodes: nodes,
      edges: edges,
      viewport: getViewport(),
    };
    
    // Létrehozunk egy "Blob"-ot, ami egy fájlszerű objektum a memóriában,
    // a tartalmát pedig a szépen formázott JSON string adja.
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    
    // Létrehozunk egy láthatatlan link (<a>) elemet.
    const a = document.createElement('a');
    
    // A link "célja" a memóriában lévő Blob lesz.
    a.href = URL.createObjectURL(blob);
    
    // Beállítjuk a letöltendő fájl nevét.
    a.download = 'flowchart.json';
    
    // Szimulálunk egy kattintást a linken, ami elindítja a böngésző letöltési folyamatát.
    a.click();
    
    // A letöltés után felszabadítjuk a memóriát, amit a Blob URL-je foglalt.
    URL.revokeObjectURL(a.href);
    
  }, [nodes, edges, getViewport]);
  const handleLoad = () => fileInputRef.current?.click();
   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error("Invalid file content type");
        }
        
        // Itt már a SaveFile típust újra kell használnunk, amit korábban töröltünk
        // Helyezzük vissza az importba!
        const loadedData: { nodes: CustomNode[], edges: Edge[], viewport: any } = JSON.parse(content);
        
        if (loadedData.nodes && loadedData.edges && loadedData.viewport) {
          let maxId = 0;
          loadedData.nodes.forEach(n => {
              const numId = parseInt(n.id.replace(/^(node|machine|resource)_/, ''), 10);
              if (!isNaN(numId) && numId > maxId) {
                maxId = numId;
              }
          });
          idCounter = maxId + 1;

          setNodes(loadedData.nodes);
          setEdges(loadedData.edges);
          // A setViewport-ot is vissza kell vennünk a useReactFlow hook-ból
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

    // Fontos, hogy a végén kiürítsük az inputot, hogy ugyanazt a fájlt újra be lehessen tölteni
    event.target.value = '';
  };


  return (
    <div className="flex h-screen w-screen bg-gray-800 text-white">
      <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} accept=".json"/>
      <Sidebar addMachineNode={addMachineNode} onSave={handleSave} onLoad={handleLoad} summary={summary} summaryItems={summaryItems} />
      <main className="flex-grow h-screen">
        <FlowCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeDoubleClick={(_, node) => openEditModal(node)} />
      </main>
      {editingNode && <EditModal node={editingNode} onClose={() => setEditingNode(null)} onSave={handleUpdateNode} suggestions={nameSuggestions}/>}
    </div>
  );
}

export default function AppWrapper() {
  return <ReactFlowProvider><App /></ReactFlowProvider>;
}