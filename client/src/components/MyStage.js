import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import {
  findClosestEndPoint,
  calculateDegreeBetweenPoints,
} from '../functions.js';
//import classes from './MyStage.module.css';

//const SIZE = 100;
const stageWidth = 2000;
const stageHeight = 2000;
const onMouseDownSnapDistance = 30;
const wallWidth = 10;
const zoomScaleBy = 1.04;
const zoomLimitUp = 2;
const zoomLimitDown = 0.3;
const windowWidth = 114;

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const { action, walls, setWalls, isStageVisable, scale, setScale } =
    stageContext;
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const onWheelHandler = event => {
    event.evt.preventDefault();

    const stage = event.target.getStage();
    const oldScale = stage.scaleX();
    const scaleBy = zoomScaleBy;

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale =
      event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale > zoomLimitUp || newScale < zoomLimitDown) return;

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
    console.log(event.currentTarget.getRelativePointerPosition());

    setIsDrawing(true);
    const stage = event.target.getStage();
    const pointerPosition = stage.getRelativePointerPosition();
    const point = { x: pointerPosition.x, y: pointerPosition.y };
    //console.log(findClosestEndPoint(point, walls));
    if (action === 'WALL') {
      if (walls.length > 0) {
        const closestEndPoint = findClosestEndPoint(pointerPosition, walls);
        console.log(closestEndPoint);
        if (closestEndPoint.distance < onMouseDownSnapDistance) {
          const angle = Math.round(
            calculateDegreeBetweenPoints(
              closestEndPoint.x,
              closestEndPoint.y,
              closestEndPoint.endX,
              closestEndPoint.endY
            )
          );
          setWalls([
            ...walls,
            {
              startPointX: Math.round(
                angle === 180
                  ? closestEndPoint.x - wallWidth / 2
                  : angle === 0
                  ? closestEndPoint.x + wallWidth / 2
                  : closestEndPoint.x
              ),
              startPointY: Math.round(
                angle === 90
                  ? closestEndPoint.y + wallWidth / 2
                  : angle === -90
                  ? closestEndPoint.y - wallWidth / 2
                  : closestEndPoint.y
              ),
              endPointX: Math.round(pointerPosition.x),
              endPointY: Math.round(pointerPosition.y),
              type: action,
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
          type: action,
        },
      ]);
    }
    if (action === 'WINDOW') {
      setWalls([
        ...walls,
        {
          startPointX: Math.round(pointerPosition.x) - windowWidth / 2,
          startPointY: Math.round(pointerPosition.y),
          endPointX: Math.round(pointerPosition.x) + windowWidth / 2,
          endPointY: Math.round(pointerPosition.y),
          type: action,
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
    if (action === 'WALL') {
      const degreeBetweenStartAndEnd = Math.abs(
        calculateDegreeBetweenPoints(
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
      } else if (
        degreeBetweenStartAndEnd > 85 &&
        degreeBetweenStartAndEnd < 95
      ) {
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
    }
    if (action === 'WINDOW') {
      currentWall.endPointX = Math.round(point.x) + windowWidth / 2;
      currentWall.endPointY = Math.round(point.y);
      currentWall.startPointX = Math.round(point.x) - windowWidth / 2;
      currentWall.startPointY = Math.round(point.y);
      const closestEndPoint = findClosestEndPoint(point, walls);
      console.log(closestEndPoint);

      walls.splice(walls.length - 1, 1, currentWall);
      setWalls(walls.concat());
    }
  };

  // const onDragEndHandler = event => {
  //   // console.log(event.target);
  //   const stage = event.target.getStage();
  //   console.log('x=', event.target.x(), 'y=', event.target.y());
  //   // const pointer = stage.absolutePosition();
  //   // console.log(event.target.absolutePosition(stage));
  //   const point = { x: event.target.x(), y: event.target.y() };
  //   // const index = event.target.index;
  //   // console.log(event.target);
  //   //  console.log(point);
  //   // console.log(point);
  //   //console.log(event.currentTarget.position());
  //   // console.log('index =', index);
  //   //const pos = event.target.attrs.points;
  //   // console.log(walls[event.target.index]);
  //   // console.log(event.target);
  //   // wall.startPointX = Math.round(pointerPosition.x) - windowWidth / 2;
  //   // wall.startPointY = Math.round(pointerPosition.y);
  //   // wall.endPointX = Math.round(pointerPosition.x) + windowWidth / 2;
  //   // wall.endPointY = Math.round(pointerPosition.y);
  //   //  const newPos = {
  //   //    endPointX: Math.round(point.x) + windowWidth / 2,
  //   //    endPointY: Math.round(point.y),
  //   //    startPointX: Math.round(point.x) - windowWidth / 2,
  //   //    startPointY: Math.round(point.y),
  //   // };
  //   // // // console.log(newPos);
  //   let state = [...walls];
  //   let item = state[0];

  //   item.startPointX += point.x;
  //   item.startPointY += point.y;
  //   item.endPointX += point.x;
  //   item.endPointY += point.y;
  //   state[event.target.index] = item;
  //   setWalls(state);
  //   event.target.getLayer().draw();
  // };

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
        // draggable={action === 'SELECT' ? true : false}
        // onDragEnd={e => setStagePosition(e.currentTarget.position())}
        onWheel={onWheelHandler}
        scaleX={scale}
        scaleY={scale}
      >
        {/* <Layer listening={false}>{gridComponents}</Layer> */}

        <Layer>
          {walls.map(
            (wall, i) =>
              wall.type === 'WALL' && (
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
              )
          )}
          {walls.map(
            (wall, i) =>
              wall.type === 'WINDOW' && (
                <Line
                  key={i}
                  points={[
                    wall.startPointX,
                    wall.startPointY,
                    wall.endPointX,
                    wall.endPointY,
                  ]}
                  opacity={1}
                  //onDragEnd={onDragEndHandler}
                  // draggable={action === 'SELECT' ? true : false}
                  stroke='red'
                  strokeWidth={wallWidth}
                />
              )
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default MyStage;
