import { colors } from '@/shared/const/colors';
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { FC } from 'react';

const AnimatedSVGEdge: FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} className="edge-line" />
      <circle r="6" fill={colors.megenta}>
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
};

export default AnimatedSVGEdge;
