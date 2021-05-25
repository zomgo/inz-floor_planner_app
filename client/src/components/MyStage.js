import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const { action, walls, setWalls } = stageContext;
  // const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const stageWidth = 700;
  const stageHeight = 700;

  function calculateAngleDegrees(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  }

  const onMouseDownHandler = event => {
    if (action === 'WALL') {
      setIsDrawing(true);
      const stage = event.target.getStage();
      const pointerPosition = stage.getPointerPosition();

      setWalls([
        ...walls,
        {
          startPointX: pointerPosition.x,
          startPointY: pointerPosition.y,
          endPointX: pointerPosition.x,
          endPointY: pointerPosition.y,
        },
      ]);
    }
  };

  const onMouseMoveHandler = event => {
    if (!isDrawing) {
      return;
    }
    const stage = event.target.getStage();
    const point = stage.getPointerPosition();
    let currentWall = walls[walls.length - 1];
    const degreeBetweenStartAndEnd = Math.abs(
      calculateAngleDegrees(
        currentWall.startPointX,
        currentWall.startPointY,
        point.x,
        point.y
      )
    );
    if (degreeBetweenStartAndEnd < 10 || degreeBetweenStartAndEnd > 170) {
      currentWall.endPointX = point.x;
      currentWall.endPointY = currentWall.startPointY;
    } else if (
      degreeBetweenStartAndEnd > 80 &&
      degreeBetweenStartAndEnd < 100
    ) {
      // console.log(degreeBetweenStartAndEnd)
      currentWall.endPointX = currentWall.startPointX;
      currentWall.endPointY = point.y;
    } else {
      currentWall.endPointX = point.x;
      currentWall.endPointY = point.y;
    }
    //   currentWall.endPointX =
    //     point.x +
    //     Math.abs(point.x - currentWall.startPointX) *
    //       Math.cos((45 * Math.PI) / 180);
    //   currentWall.endPointY =
    //     point.y +
    //     Math.abs(point.y - currentWall.startPointY) *
    //       Math.cos((45 * Math.PI) / 180);

    walls.splice(walls.length - 1, 1, currentWall);
    setWalls(walls.concat());
  };

  const onMouseUpHandler = event => {
    setIsDrawing(false);
  };

  return (
    <div>
      <Stage
        width={stageWidth}
        height={stageHeight}
        onMouseDown={onMouseDownHandler}
        onMouseMove={onMouseMoveHandler}
        onMouseUp={onMouseUpHandler}
        // draggable
        // onDragEnd={e => {
        //   setStagePos(e.currentTarget.position());
        //   console.log(stagePos.x, 0);
        // }}
      >
        <Layer>
          {walls.map((wall, i) => (
            <Line
              key={i}
              points={[
                wall.startPointX,
                wall.startPointY,
                wall.endPointX,
                wall.endPointY,
              ]}
              stroke='#5c5c5c'
              strokeWidth={10}
              draggable={action === 'SELECT' ? true : false}
            />
          ))}

          <Line
            points={[
              0 + 3,
              0,
              stageWidth,
              0,
              stageWidth,
              stageHeight,
              0 + 3,
              stageHeight,
              0 + 3,
              0,
            ]}
            stroke='black'
          ></Line>
        </Layer>
      </Stage>
    </div>
  );
};

export default MyStage;
