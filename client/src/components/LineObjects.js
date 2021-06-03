import React from 'react';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { Line } from 'react-konva';
const LineObjects = props => {
  const stageContext = useContext(StageContext);
  const { objects } = stageContext;

  return objects.map(
    (object, i) =>
      object.type === props.type && (
        <Line
          key={i}
          points={[
            object.startPointX,
            object.startPointY,
            object.endPointX,
            object.endPointY,
          ]}
          stroke={props.color}
          strokeWidth={props.width}
          opacity={props.opacity}
          onDblClick={e => props.onDblClick(e, object)}
        />
      )
  );
};

export default LineObjects;
