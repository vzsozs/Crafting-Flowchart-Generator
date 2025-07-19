import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MachineNodeData } from '../../src/types';
import { FaCog } from 'react-icons/fa';

const MachineNode: React.FC<NodeProps<MachineNodeData>> = ({ data }) => {
  return (
    <div className="bg-gray-800 border-2 border-teal-500 rounded-lg shadow-lg w-48 text-white">
      
      {/* JAVÍTVA: A hiányzó stílusosztályok (szín, padding, stb.) visszaállítva */}
      <div className="custom-drag-handle flex justify-between items-center bg-teal-600 p-2 rounded-t-md font-bold cursor-move">
        <span className="truncate">{data.label}</span>
        
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          data-action="edit" 
          className="p-1 rounded-full hover:bg-teal-700 transition-colors"
          title="Edit Node"
        >
          <FaCog />
        </button>
      </div>
      
      <div className="p-3 text-sm">
        {data.inputs.length > 0 && <div className="text-left text-gray-400 text-xs mb-1">INPUTS</div>}
        {data.inputs.map((input) => (
          <div key={input.id} className="relative my-1 text-left">
            <Handle type="target" position={Position.Left} id={input.id} style={{ top: '50%' }} className="!bg-cyan-500"/>
            <span className="ml-4">{input.name} ({input.amount})</span>
          </div>
        ))}
        
        {data.outputs.length > 0 && <div className="text-right text-gray-400 text-xs mt-3 mb-1">OUTPUTS</div>}
        {data.outputs.map((output) => (
          <div key={output.id} className="relative my-1 text-right">
             <Handle type="source" position={Position.Right} id={output.id} style={{ top: '50%' }} className="!bg-fuchsia-500"/>
            <span className="mr-4">{output.name} ({output.amount})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MachineNode);