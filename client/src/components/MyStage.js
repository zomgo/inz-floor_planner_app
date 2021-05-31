import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import {
  findClosestEndPoint,
  calculateDegreeBetweenPoints,
  findClosestWall,
  pointToSnapWall,
  generateGrdiLayer,
} from '../functions.js';

const SIZE = 50;
const stageWidth = 2000;
const stageHeight = 2000;
const onMouseDownSnapDistance = 30;
const wallWidth = 12;
const zoomScaleBy = 1.02;
const zoomLimitUp = 2;
const zoomLimitDown = 0.3;
const windowWidth = 114;
const doorWidth = 80;
const wallSnapDistance = 30;

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const { action, objects, setObjects, isStageVisable, scale, setScale } =
    stageContext;
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [grid, setGrid] = useState();
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

  useEffect(() => {
    const gridLayer = generateGrdiLayer(
      stageWidth,
      stageHeight,
      stagePosition,
      scale,
      SIZE
    );
    setGrid(gridLayer);
  }, [stagePosition, scale]);

  const onMouseDownHandler = event => {
    setIsDrawing(true);
    const stage = event.target.getStage();
    const pointerPosition = stage.getRelativePointerPosition();

    if (action === 'WALL') {
      if (objects.filter(o => o.type === 'WALL').length > 0) {
        const closestEndPoint = findClosestEndPoint(pointerPosition, objects);
        if (closestEndPoint.distance < onMouseDownSnapDistance) {
          const angle = Math.round(
            calculateDegreeBetweenPoints(
              closestEndPoint.x,
              closestEndPoint.y,
              closestEndPoint.endX,
              closestEndPoint.endY
            )
          );
          setObjects([
            ...objects,
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
              index: objects.length,
            },
          ]);
          return;
        }
      }
      setObjects([
        ...objects,
        {
          startPointX: Math.round(pointerPosition.x),
          startPointY: Math.round(pointerPosition.y),
          endPointX: Math.round(pointerPosition.x),
          endPointY: Math.round(pointerPosition.y),
          type: action,
          index: objects.length,
        },
      ]);
    }
    if (action === 'WINDOW') {
      setObjects([
        ...objects,
        {
          startPointX: Math.round(pointerPosition.x) - windowWidth / 2,
          startPointY: Math.round(pointerPosition.y),
          endPointX: Math.round(pointerPosition.x) + windowWidth / 2,
          endPointY: Math.round(pointerPosition.y),
          type: action,
          index: objects.length,
        },
      ]);
    }
    if (action === 'DOOR') {
      setObjects([
        ...objects,
        {
          startPointX: Math.round(pointerPosition.x) - doorWidth / 2,
          startPointY: Math.round(pointerPosition.y),
          endPointX: Math.round(pointerPosition.x) + doorWidth / 2,
          endPointY: Math.round(pointerPosition.y),
          type: action,
          index: objects.length,
        },
      ]);
    }
    if (action === 'TEXT') {
      setObjects([
        ...objects,
        {
          x: Math.round(pointerPosition.x),
          y: Math.round(pointerPosition.y),
          text: 'test text',
          type: action,
          index: objects.length,
          DUPA: 'DUPA',
        },
      ]);
    }
  };

  const onMouseMoveHandler = event => {
    const updateObjectsState = currentObject => {
      objects.splice(objects.length - 1, 1, currentObject);
      setObjects(objects.concat());
    };

    if (!isDrawing) {
      return;
    }
    const stage = event.target.getStage();
    const point = stage.getRelativePointerPosition();
    let currentObject = objects[objects.length - 1];
    if (action === 'WALL') {
      const degreesBetweenStartAndEnd = Math.abs(
        calculateDegreeBetweenPoints(
          currentObject.startPointX,
          currentObject.startPointY,
          point.x,
          point.y
        )
      );

      if (degreesBetweenStartAndEnd < 5 || degreesBetweenStartAndEnd > 175) {
        currentObject.endPointX = Math.round(point.x);
        const pointToSnap = pointToSnapWall(point.x, objects);
        if (
          Math.abs(pointToSnap - currentObject.endPointX) < wallSnapDistance
        ) {
          currentObject.endPointX = pointToSnap;
        }
        currentObject.endPointY = Math.round(currentObject.startPointY);
      } else if (
        degreesBetweenStartAndEnd > 85 &&
        degreesBetweenStartAndEnd < 95
      ) {
        currentObject.endPointY = Math.round(point.y);
        const pointToSnap = pointToSnapWall(point.y, objects, 'y');
        if (
          Math.abs(pointToSnap - currentObject.endPointY) < wallSnapDistance
        ) {
          currentObject.endPointY = pointToSnap;
        }

        currentObject.endPointX = Math.round(currentObject.startPointX);
      } else {
        currentObject.endPointX = Math.round(point.x);
        currentObject.endPointY = Math.round(point.y);
      }

      //   currentObject.endPointX =
      //     point.x +
      //     Math.abs(point.x - currentObject.startPointX) *
      //       Math.cos((45 * Math.PI) / 180);
      //   currentObject.endPointY =
      //     point.y +
      //     Math.abs(point.y - currentObject.startPointY) *
      //       Math.cos((45 * Math.PI) / 180);

      updateObjectsState(currentObject);
    }
    if (action === 'WINDOW') {
      currentObject.endPointX = Math.round(point.x) + windowWidth / 2;
      currentObject.endPointY = Math.round(point.y);
      currentObject.startPointX = Math.round(point.x) - windowWidth / 2;
      currentObject.startPointY = Math.round(point.y);
      let closestEndPoint = findClosestWall(point, objects);

      if (event.target.getClassName() === Line) {
        closestEndPoint.x = event.target.getPoints()[0];
        closestEndPoint.y = event.target.getPoints()[1];
        closestEndPoint.endPointX = event.target.getPoints()[2];
        closestEndPoint.endPointY = event.target.getPoints()[3];
      }
      currentObject.endPointY = closestEndPoint.y;
      currentObject.startPointY = closestEndPoint.y;

      if (
        Math.abs(
          calculateDegreeBetweenPoints(
            closestEndPoint.x,
            closestEndPoint.y,
            closestEndPoint.endX,
            closestEndPoint.endY
          )
        ) === 90
      ) {
        currentObject.startPointX = closestEndPoint.x;
        currentObject.endPointX = closestEndPoint.x;
        currentObject.startPointY = point.y + windowWidth / 2;
        currentObject.endPointY = point.y - windowWidth / 2;
      }

      updateObjectsState(currentObject);
    }
    if (action === 'DOOR') {
      currentObject.endPointX = Math.round(point.x) + doorWidth / 2;
      currentObject.endPointY = Math.round(point.y);
      currentObject.startPointX = Math.round(point.x) - doorWidth / 2;
      currentObject.startPointY = Math.round(point.y);
      let closestEndPoint = findClosestWall(point, objects);

      if (event.target.getClassName() === Line) {
        closestEndPoint.x = event.target.getPoints()[0];
        closestEndPoint.y = event.target.getPoints()[1];
        closestEndPoint.endPointX = event.target.getPoints()[2];
        closestEndPoint.endPointY = event.target.getPoints()[3];
      }
      currentObject.endPointY = closestEndPoint.y;
      currentObject.startPointY = closestEndPoint.y;

      if (
        Math.abs(
          calculateDegreeBetweenPoints(
            closestEndPoint.x,
            closestEndPoint.y,
            closestEndPoint.endX,
            closestEndPoint.endY
          )
        ) === 90
      ) {
        currentObject.startPointX = closestEndPoint.x;
        currentObject.endPointX = closestEndPoint.x;
        currentObject.startPointY = Math.round(point.y + doorWidth / 2);
        currentObject.endPointY = Math.round(point.y - doorWidth / 2);
      }

      updateObjectsState(currentObject);
    }
  };

  const onDragEndTextHandler = e => {
    e.currentTarget.setAttrs({ text: 'DUPA' });
    //console.log(e.target);
    // console.log(e.currentTarget);
    // console.log(e.currentTarget);
    //  let state = [...objects];
    // console.log(state);
    // let item = state.filter(o => o.x === e.currentTarget.position().x);
    //console.log(item);
    // item.x = e.currentTarget.position().x;
    // item.y = e.currentTarget.position().y;
    // state[0] = item;
    // setObjects(state);
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
  //   // console.log(objects[event.target.index]);
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
  //   let state = [...objects];
  //   let item = state[0];

  //   item.startPointX += point.x;
  //   item.startPointY += point.y;
  //   item.endPointX += point.x;
  //   item.endPointY += point.y;
  //   state[event.target.index] = item;
  //   setObjects(state);
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
        draggable={action === 'SELECT' ? true : false}
        onDragEnd={e => setStagePosition(e.currentTarget.position())}
        onWheel={onWheelHandler}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer listening={false}>{grid}</Layer>
        <Layer>
          {objects.map(
            (object, i) =>
              object.type === 'WALL' && (
                <Line
                  key={i}
                  points={[
                    object.startPointX,
                    object.startPointY,
                    object.endPointX,
                    object.endPointY,
                  ]}
                  stroke='#3c3c3c'
                  strokeWidth={wallWidth}
                />
              )
          )}
          {objects.map(
            (object, i) =>
              object.type === 'WINDOW' && (
                <Line
                  key={i}
                  points={[
                    object.startPointX,
                    object.startPointY,
                    object.endPointX,
                    object.endPointY,
                  ]}
                  opacity={0.9}
                  //onDragEnd={onDragEndHandler}
                  // draggable={action === 'SELECT' ? true : false}
                  stroke='white'
                  strokeWidth={wallWidth / 3}
                />
              )
          )}
          {objects.map(
            (object, i) =>
              object.type === 'DOOR' && (
                <Line
                  key={i}
                  points={[
                    object.startPointX,
                    object.startPointY,
                    object.endPointX,
                    object.endPointY,
                  ]}
                  opacity={1}
                  //onDragEnd={onDragEndHandler}
                  // draggable={action === 'SELECT' ? true : false}
                  stroke='#8a8a8a'
                  strokeWidth={wallWidth}
                />
              )
          )}
          {objects.map(
            (object, i) =>
              object.type === 'TEXT' && (
                <Text
                  key={i}
                  fontSize={20}
                  align={'left'}
                  fontStyle={20}
                  draggable
                  text={object.text}
                  x={object.x}
                  y={object.y}
                  wrap='word'
                  onDragEnd={onDragEndTextHandler}
                />
              )
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default MyStage;
