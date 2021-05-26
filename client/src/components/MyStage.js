import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';

//const SIZE = 100;
const stageWidth = 3000;
const stageHeight = 3000;

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const { action, walls, setWalls, isStageVisable, scale, setScale } =
    stageContext;
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  // const startX =
  //   Math.floor((-stagePosition.x - window.innerWidth) / SIZE) * SIZE;
  // const endX =
  //   Math.floor((-stagePosition.x + window.innerWidth * 2) / SIZE) * SIZE;

  // const startY =
  //   Math.floor((-stagePosition.y - window.innerHeight) / SIZE) * SIZE;
  // const endY =
  //   Math.floor((-stagePosition.y + window.innerHeight * 2) / SIZE) * SIZE;

  // const gridComponents = [];
  // var i = 0;
  // for (var x = startX; x < endX; x += SIZE) {
  //   for (var y = startY; y < endY; y += SIZE) {
  //     if (i === 4) {
  //       i = 0;
  //     }

  //     // const indexX = Math.abs(x / SIZE) % grid.length;
  //     // const indexY = Math.abs(y / SIZE) % grid[0].length;

  //     gridComponents.push(
  //       <Rect x={x} y={y} width={SIZE} height={SIZE} stroke='black' />
  //     );
  //   }
  // }

  function calculateAngleDegrees(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  }

  const onMouseDownHandler = event => {
    if (action === 'SELECT') {
      const stage = event.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      console.log(pointerPosition);
      console.log(stage.getRelativePointerPosition());
    }
    if (action === 'WALL') {
      setIsDrawing(true);
      const stage = event.target.getStage();
      const pointerPosition = stage.getRelativePointerPosition();

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
    const point = stage.getRelativePointerPosition();
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

  const onWheelHandler = event => {
    event.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = event.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale =
      event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setStagePosition({
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
    });
  };

  return (
    <div>
      <Stage
        x={stagePosition.x}
        y={stagePosition.y}
        visible={isStageVisable}
        width={stageWidth}
        height={stageHeight}
        onMouseDown={onMouseDownHandler}
        onMouseMove={onMouseMoveHandler}
        onMouseUp={onMouseUpHandler}
        style={{ backgroundColor: '#f2eee5' }}
        draggable={action === 'SELECT' ? true : false}
        onWheel={onWheelHandler}
        scaleX={scale}
        scaleY={scale}
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
