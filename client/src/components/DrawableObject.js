import React from 'react';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { Line } from 'react-konva';
const DrawableObject = props => {
  const stageContext = useContext(StageContext);
  const { objects, setObjects, setHistoryPosition } = stageContext;

  const onDbClickHandler = currentObject => e => {
    let state = [...objects].filter(o => o.index !== currentObject.index);
    setHistoryPosition(prevState => prevState - 1);
    setObjects(state);
  };

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
          onDblClick={onDbClickHandler(object)}
        />
      )
  );
};

export default DrawableObject;
