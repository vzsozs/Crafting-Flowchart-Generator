// components/customNodes/ResourceNode.tsx

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ResourceNodeData } from '../../src/types';
import { FaCog, FaPlus } from 'react-icons/fa';

const ResourceNode: React.FC<NodeProps<ResourceNodeData>> = ({ data }) => {
  const isInput = data.type === 'input';

  // Alapértelmezett színek
  const defaultInputColor = '#facc15'; // Tailwind yellow-400
  const outputColor = '#a855f7';     // Tailwind purple-600

  // JAVÍTVA: A háttérszín most már dinamikus
  const backgroundColor = isInput ? (data.color || defaultInputColor) : outputColor;
  
  // JAVÍTVA: Az átlátszóságot egy class-szal kezeljük
  const opacityClass = (isInput && data.isStocked) ? 'opacity-70' : 'opacity-100';

  return (
    // JAVÍTVA: A színt a 'style' attribútummal, az átlátszóságot a 'className'-nel adjuk meg
    <div 
      className={`rounded-lg shadow-lg text-white w-40 transition-opacity ${opacityClass}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <Handle type="target" position={Position.Left} id="input_handle" className="!bg-gray-400" />
      <Handle type="source" position={Position.Right} id="output_handle" className="!bg-gray-400" />
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-baseline">
            <span className="text-xs font-bold uppercase">{data.type}</span>
            {isInput && data.isStocked && (
              <span className="text-xs ml-1">(Stocked)</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); data.onEdit?.(); }} className="p-1 rounded-full hover:bg-black/20 transition-colors" title="Edit Resource">
              <FaCog size={12} />
            </button>
            {!(isInput && data.isStocked) && (
              <button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); data.onAddMachine?.(); }} className="p-1 rounded-full hover:bg-black/20 transition-colors" title="Add Connected Machine">
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