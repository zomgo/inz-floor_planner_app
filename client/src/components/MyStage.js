import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { v4 as uuidv4 } from 'uuid';
import {
  findClosestEndPoint,
  calculateDegreeBetweenPoints,
  findClosestWall,
  pointToSnapWall,
  generateGrdiLayer,
  calculateLineLength,
} from '../functions.js';

const SIZE = 50;
const stageWidth = 2000;
const stageHeight = 2000;
const onMouseDownSnapDistance = 30;
const wallWidth = 18;
const zoomScaleBy = 1.02;
const zoomLimitUp = 2;
const zoomLimitDown = 0.3;
const windowWidth = 114;
const doorWidth = 80;
const wallSnapDistance = 30;
const wallSnapDegree = 10;

const MyStage = () => {
  const stageContext = useContext(StageContext);
  const {
    action,
    objects,
    setObjects,
    isStageVisable,
    scale,
    setScale,
    history,
    setHistory,
    setHistoryPosition,
  } = stageContext;
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
              index: uuidv4(),
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
          index: uuidv4(),
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
          index: uuidv4(),
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
          index: uuidv4(),
        },
      ]);
    }
    if (action === 'TEXT') {
      setObjects([
        ...objects,
        {
          x: Math.round(pointerPosition.x),
          y: Math.round(pointerPosition.y),
          text: 'click to edit',
          type: action,
          index: uuidv4(),
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
      if (
        degreesBetweenStartAndEnd < wallSnapDegree ||
        degreesBetweenStartAndEnd > 180 - wallSnapDegree
      ) {
        currentObject.endPointX = Math.round(point.x);
        const pointToSnap = pointToSnapWall(point.x, objects);
        if (
          Math.abs(pointToSnap - currentObject.endPointX) < wallSnapDistance
        ) {
          currentObject.endPointX = pointToSnap;
        }
        currentObject.endPointY = Math.round(currentObject.startPointY);
      } else if (
        degreesBetweenStartAndEnd > 90 - wallSnapDegree &&
        degreesBetweenStartAndEnd < 90 + wallSnapDegree
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
      let closestEndPoint = findClosestWall(point, objects);

      if (event.target.getClassName() === Line) {
        closestEndPoint.x = event.target.getPoints()[0];
        closestEndPoint.y = event.target.getPoints()[1];
        closestEndPoint.endPointX = event.target.getPoints()[2];
        closestEndPoint.endPointY = event.target.getPoints()[3];
      }
      currentObject.endPointX = Math.round(point.x) + windowWidth / 2;
      currentObject.endPointY = Math.round(point.y);
      currentObject.startPointX = Math.round(point.x) - windowWidth / 2;
      currentObject.startPointY = Math.round(point.y);

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
      let closestEndPoint = findClosestWall(point, objects);

      if (event.target.getClassName() === Line) {
        closestEndPoint.x = event.target.getPoints()[0];
        closestEndPoint.y = event.target.getPoints()[1];
        closestEndPoint.endPointX = event.target.getPoints()[2];
        closestEndPoint.endPointY = event.target.getPoints()[3];
      }
      currentObject.endPointX = Math.round(point.x) + doorWidth / 2;
      currentObject.endPointY = Math.round(point.y);
      currentObject.startPointX = Math.round(point.x) - doorWidth / 2;
      currentObject.startPointY = Math.round(point.y);

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

  const onDragEndTextHandler = currentObject => e => {
    let state = [...objects];
    let [updatedText] = state.filter(o => o.index === currentObject.index);
    updatedText.x = e.currentTarget.position().x;
    updatedText.y = e.currentTarget.position().y;
    state[currentObject.index] = updatedText;
    setObjects(state);
  };

  const onMouseUpHandler = event => {
    if (
      isDrawing &&
      (history.length > objects.length || history.length === objects.length)
    ) {
      const updatedHistory = [...history.slice(0, objects.length - 1), objects];
      setHistory(updatedHistory);
      setHistoryPosition(objects.length - 1);
      setIsDrawing(false);
      return;
    }
    if (isDrawing) {
      const updatedHistory = [...history, objects];
      setHistory(updatedHistory);
      setHistoryPosition(objects.length - 1);
    }
    setIsDrawing(false);
  };

  const handleTextareaKeyDown = currentObject => e => {
    if (e.keyCode === 13) {
      let state = [...objects];
      let [updatedText] = state.filter(o => o.index === currentObject.index);
      updatedText.textEditVisible = false;
      state[currentObject.index] = updatedText;
      setObjects(state);
    }
  };

  const handleTextEdit = currentObject => e => {
    let state = [...objects];
    let [updatedText] = state.filter(o => o.index === currentObject.index);
    updatedText.text = e.target.value;
    state[currentObject.index] = updatedText;
    setObjects(state);
  };

  const onClickTextHandler = currentObject => e => {
    const position = e.currentTarget.getAbsolutePosition();
    let state = [...objects];
    let [updatedText] = state.filter(o => o.index === currentObject.index);
    updatedText.textEditVisible = true;
    updatedText.textAreaX = position.x;
    updatedText.textAreaY = position.y;
    state[currentObject.index] = updatedText;
    setObjects(state);
  };
  const onDbClickTextHandler = currentObject => e => {
    let state = [...objects].filter(o => o.index !== currentObject.index);
    setHistory(objects);
    setObjects(state);
  };

  const onMouseDownTextHandler = object => e => {
    console.log(e.evt.button);
  };
  return (
    <div>
      <Stage
        onContextMenu={e => e.evt.preventDefault()}
        on
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
                  stroke='#4c4c4c'
                  strokeWidth={wallWidth}
                  onDblClick={onDbClickTextHandler(object)}
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
                  onDblClick={onDbClickTextHandler(object)}
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
                  lineJoin='bevel'
                  //onDragEnd={onDragEndHandler}
                  // draggable={action === 'SELECT' ? true : false}
                  stroke='#d4d4d4'
                  strokeWidth={wallWidth / 1.5}
                  onDblClick={onDbClickTextHandler(object)}
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
                  onDragEnd={onDragEndTextHandler(object)}
                  onClick={onClickTextHandler(object)}
                  onDblClick={onDbClickTextHandler(object)}
                  onMouseDown={onMouseDownTextHandler(object)}
                />
              )
          )}
          {objects.map(
            (object, i) =>
              object.type === 'WALL' && (
                <Text
                  key={i}
                  x={
                    (object.endPointX + object.startPointX) / 2 +
                    wallWidth / 1.5
                  }
                  y={
                    (object.endPointY + object.startPointY) / 2 +
                    wallWidth / 1.5
                  }
                  text={calculateLineLength(
                    object.startPointX,
                    object.endPointX,
                    object.startPointY,
                    object.endPointY,
                    'meters'
                  )}
                />
              )
          )}
          <Line></Line>
        </Layer>
      </Stage>
      {objects.map(
        (object, i) =>
          object.type === 'TEXT' && (
            <textarea
              key={i}
              value={object.text}
              style={{
                display: object.textEditVisible ? 'block' : 'none',
                position: 'absolute',
                left: object.textAreaX,
                top: object.textAreaY,
                backgroundColor: '#f2eee5',
              }}
              onChange={handleTextEdit(object)}
              onKeyDown={handleTextareaKeyDown(object)}
            />
          )
      )}
    </div>
  );
};

export default MyStage;
