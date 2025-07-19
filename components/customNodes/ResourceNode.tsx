// components/customNodes/ResourceNode.tsx

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ResourceNodeData } from '../../src/types';
import { FaCog, FaPlus } from 'react-icons/fa';

const ResourceNode: React.FC<NodeProps<ResourceNodeData>> = ({ data }) => {
  const isInput = data.type === 'input';

  const defaultInputColor = '#facc15';
  const outputColor = '#a855f7';
  const backgroundColor = isInput ? (data.color || defaultInputColor) : outputColor;
  
  const opacityClass = (isInput && data.isStocked) ? 'opacity-80' : 'opacity-100';

  // JAVÍTVA: Létrehozunk egy változót a feltételes stílushoz
  const inputLabelClass = (isInput && data.isStocked) ? 'line-through' : '';

  return (
    <div 
      className={`rounded-lg shadow-lg text-white w-40 transition-opacity ${opacityClass}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <Handle type="target" position={Position.Left} id="input_handle" className="!bg-gray-400" />
      <Handle type="source" position={Position.Right} id="output_handle" className="!bg-gray-400" />
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-baseline">
            {/* JAVÍTVA: A 'INPUT' felirat megkapja a feltételes class-t */}
            <span className={`text-xs font-bold uppercase ${inputLabelClass}`}>{data.type}</span>
            
            {/* A "(Stocked)" felirat külön van, így nem lesz áthúzva */}
            {isInput && data.isStocked && (
              <span className="text-xs ml-1">(Stocked)</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button onMouseDown={(e) => e.stopPropagation()} data-action="edit" className="p-1 rounded-full hover:bg-black/20 transition-colors" title="Edit Resource">
              <FaCog size={12} />
            </button>
            {!(isInput && data.isStocked) && (
              <button onMouseDown={(e) => e.stopPropagation()} data-action="add-machine" className="p-1 rounded-full hover:bg-black/20 transition-colors" title="Add Connected Machine">
                <FaPlus size={12} />
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-lg font-semibold truncate">{data.resource}</p>
      </div>
    </div>
  );
};

export default memo(ResourceNode);