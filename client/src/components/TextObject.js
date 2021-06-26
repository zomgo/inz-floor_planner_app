import { Text } from 'react-konva';
import { calculateLineLength } from './stageHelpers.js';

const TextObject = props => {
  return props.objects.map(
    (object, i) =>
      object.type === props.type && (
        <Text
          key={i}
          fontSize={props.fontSize}
          align={props.align}
          draggable
          text={
            props.type === 'TEXT'
              ? object.text
              : calculateLineLength(
                  object.startPointX,
                  object.endPointX,
                  object.startPointY,
                  object.endPointY,
                  'meters'
                )
          }
          x={
            props.type === 'TEXT'
              ? object.x
              : (object.endPointX + object.startPointX) / 2 +
                props.wallWidth / 1.5
          }
          y={
            props.type === 'TEXT'
              ? object.y
              : (object.endPointY + object.startPointY) / 2 +
                props.wallWidth / 1.5
          }
          wrap='word'
          width={props.width}
          onDragEnd={e => props.onDragEnd(e, object)}
          onClick={e => props.onClick(e, object)}
          onDblClick={e => props.onDblClick(e, object)}
        />
      )
  );
};

export default TextObject;
