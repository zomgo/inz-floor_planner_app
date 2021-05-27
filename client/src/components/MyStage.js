import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { findClosestEndPoint, calculateAngleDegrees } from '../functions.js';
//import classes from './MyStage.module.css';

//const SIZE = 100;
const stageWidth = 2000;
const stageHeight = 2000;
const DELTA = 30;
const wallWidth = 10;

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const { action, walls, setWalls, isStageVisable, scale, setScale } =
    stageContext;
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

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

  // const startX =
  //   Math.floor((-stagePosition.x - window.innerWidth) / SIZE) * SIZE;
  // const endX =
  //   Math.floor((-stagePosition.x + window.innerWidth * 2) / SIZE) * SIZE;

  // const startY =
  //   Math.floor((-stagePosition.y - window.innerHeight) / SIZE) * SIZE;
  // const endY =
  //   Math.floor((-stagePosition.y + window.innerHeight * 2) / SIZE) * SIZE;

  // const gridComponents = [];
  // for (var x = startX; x < endX; x += SIZE) {
  //   for (var y = startY; y < endY; y += SIZE) {
  //     // const indexX = Math.abs(x / SIZE) % grid.length;
  //     // const indexY = Math.abs(y / SIZE) % grid[0].length;
  //     // console.log(x);
  //     gridComponents.push(
  //       <Rect
  //         key={Math.random()}
  //         x={x}
  //         y={y}
  //         width={SIZE}
  //         height={SIZE}
  //         stroke='black'
  //       />
  //     );
  //   }
  // }
  const onMouseDownHandler = event => {
    if (action === 'WALL') {
      setIsDrawing(true);
      const stage = event.target.getStage();
      const pointerPosition = stage.getRelativePointerPosition();
      if (walls.length > 0) {
        const closestEndPoint = findClosestEndPoint(pointerPosition, walls);
        if (closestEndPoint.distance < DELTA) {
          const angle = calculateAngleDegrees(
            closestEndPoint.x,
            closestEndPoint.y,
            closestEndPoint.endX,
            closestEndPoint.endY
          );
          setWalls([
            ...walls,
            {
              startPointX: Math.round(
                angle === 180
                  ? closestEndPoint.x - 5
                  : angle === 0
                  ? closestEndPoint.x + 5
                  : closestEndPoint.x
              ),
              startPointY: Math.round(
                angle === 90
                  ? closestEndPoint.y + 5
                  : angle === -90
                  ? closestEndPoint.y - 5
                  : closestEndPoint.y
              ),
              endPointX: Math.round(pointerPosition.x),
              endPointY: Math.round(pointerPosition.y),
            },
          ]);
          return;
        }
      }
      setWalls([
        ...walls,
        {
          startPointX: Math.round(pointerPosition.x),
          startPointY: Math.round(pointerPosition.y),
          endPointX: Math.round(pointerPosition.x),
          endPointY: Math.round(pointerPosition.y),
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
    // if (walls.length > 0){
    // const closestEndPoint = findClosestEndPoint(point);
    // // console.log(closestEndPoint);

    // if (closestEndPoint < DELTA) {
    //   currentWall.endPointX = Math.round(closestEndPoint.x);
    //   currentWall.endPointY = Math.round(closestEndPoint.y);
    // }
    if (degreeBetweenStartAndEnd < 5 || degreeBetweenStartAndEnd > 175) {
      currentWall.endPointX = Math.round(point.x);
      currentWall.endPointY = Math.round(currentWall.startPointY);
    } else if (degreeBetweenStartAndEnd > 85 && degreeBetweenStartAndEnd < 95) {
      currentWall.endPointX = Math.round(currentWall.startPointX);
      currentWall.endPointY = Math.round(point.y);
    } else {
      currentWall.endPointX = Math.round(point.x);
      currentWall.endPointY = Math.round(point.y);
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
        onDragEnd={e => setStagePosition(e.currentTarget.position())}
        onWheel={onWheelHandler}
        scaleX={scale}
        scaleY={scale}
      >
        {/* <Layer listening={false}>{gridComponents}</Layer> */}

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
              strokeWidth={wallWidth}
              //draggable={action === 'SELECT' ? true : false}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MyStage;
