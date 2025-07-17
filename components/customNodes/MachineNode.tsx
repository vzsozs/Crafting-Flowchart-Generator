import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { MachineNodeData } from '../../types';

const handleStyle = {
  width: '12px',
  height: '12px',
  border: '3px solid #14b8a6',
  background: '#1f2937'
};

const MachineNode: React.FC<NodeProps<MachineNodeData>> = ({ data, isConnectable }) => {
  const { label, inputs, outputs, power } = data;

  return (
    <div className="bg-gray-800 border-2 border-teal-500 rounded-lg shadow-xl w-64">
      <div className="bg-teal-700 text-white px-3 py-1 rounded-t-md cursor-move">
        <strong className="text-base">{label}</strong>
      </div>
      <div className="text-xs text-yellow-400 px-3 py-1 bg-gray-700/50">
        Power: {power} kW
      </div>
      <div className="flex justify-between p-3">
        <div className="w-1/2 pr-2 border-r border-gray-600">
          <h4 className="font-bold text-gray-400 text-xs mb-2">INPUTS</h4>
          {inputs.map((input, index) => (
            <div key={input.id || `in-${index}`} className="relative my-2 text-left text-xs h-6 flex items-center">
              <Handle
                type="target"
                position={Position.Left}
                id={input.id || input.name}
                isConnectable={isConnectable}
                style={{ ...handleStyle, top: 'auto'}}
              />
              <span className="pl-4">{input.name} ({input.amount})</span>
            </div>
          ))}
        </div>
        <div className="w-1/2 pl-2">
          <h4 className="font-bold text-gray-400 text-xs mb-2 text-right">OUTPUTS</h4>
          {outputs.map((output, index) => (
            <div key={output.id || `out-${index}`} className="relative my-2 text-right text-xs h-6 flex items-center justify-end">
              <Handle
                type="source"
                position={Position.Right}
                id={output.id || output.name}
                isConnectable={isConnectable}
                style={{ ...handleStyle, top: 'auto'}}
              />
              <span className="pr-4">({output.amount}) {output.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(MachineNode);