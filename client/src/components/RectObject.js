import { Rect } from 'react-konva';
const RectObject = props => {
  return props.objects.map(
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
          draggable
          onDragEnd={e => props.onDragEnd(e, object)}
          onDblClick={e => props.onDblClick(e, object)}
        />
      )
  );
};

export default RectObject;
