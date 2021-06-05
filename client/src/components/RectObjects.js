import React from 'react';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { Rect } from 'react-konva';
const RectObjects = props => {
  const stageContext = useContext(StageContext);
  const { objects } = stageContext;

  return objects.map(
    (object, i) =>
      object.type === props.type && (
        <Rect
          key={i}
          x={object.x}
          y={object.y}
          width={props.width}
          height={props.height}
          listening={object.listening}
          rotation={object.angle}
          fillPatternImage={props.fillPatternImage}
          opacity={props.opacity}
          onDblClick={e => props.onDblClick(e, object)}
        />
      )
  );
};

export default RectObjects;
