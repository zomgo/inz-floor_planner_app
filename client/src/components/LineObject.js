import { Line } from 'react-konva';

const LineObject = props => {
  return props.objects.map(
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
          listening={object.listening}
          stroke={props.color}
          strokeWidth={props.width}
          opacity={props.opacity}
          onDblClick={e => props.onDblClick(e, object)}
        />
      )
  );
};

export default LineObject;
