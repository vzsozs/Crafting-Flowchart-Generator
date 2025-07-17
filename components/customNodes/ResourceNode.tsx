import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { ResourceNodeData } from '../../types';

const ResourceNode: React.FC<NodeProps<ResourceNodeData>> = ({ data, isConnectable }) => {
  const { type, resource } = data;
  const isInput = type === 'input';

  const clipPath = isInput
    ? 'polygon(0% 0%, 100% 50%, 0% 100%)'
    : 'polygon(0% 0%, 100% 0%, 50% 100%)';

  const handleType = isInput ? 'source' : 'target';
  const handlePosition = isInput ? Position.Right : Position.Bottom;

  return (
    <div
      style={{
        width: 144,
        height: 96,
        clipPath: clipPath,
      }}
      className={`${isInput ? 'bg-yellow-500' : 'bg-purple-500'} flex items-center justify-center shadow-lg cursor-move`}
    >
      <Handle
        type={handleType}
        position={handlePosition}
        isConnectable={isConnectable}
        style={{
          transform: isInput ? 'none' : 'translate(-50%, 0%)',
          left: isInput ? 'auto' : '50%',
          width: '12px',
          height: '12px',
          border: '3px solid #fff',
        }}
      />
      <div className={`w-full h-full flex flex-col items-center justify-center text-center text-white p-4 ${isInput ? 'pr-10' : 'pb-10'}`}>
        <div className="font-bold uppercase text-xs opacity-80">
          {type}
        </div>
        <div className="text-sm font-semibold break-words px-1">
          {resource}
        </div>
      </div>
    </div>
  );
};

export default memo(ResourceNode);