import { useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import { v4 as uuidv4 } from 'uuid';
import {
  findClosestEndPoint,
  calculateDegreeBetweenPoints,
  findClosestWall,
  pointToSnapWall,
  generateGrdiLayer,
} from './stageHelpers.js';
import ScaleBar from './ScaleBar';
import LineObject from './LineObject';
import TextObject from './TextObject';
import useImage from 'use-image';
import RectObject from './RectObject';

const gridSize = 50;
const stageWidth = 2000;
const stageHeight = 2000;
const onMouseDownSnapDistance = 30;
const wallWidth = 10;
const zoomScaleBy = 1.02;
const zoomLimitUp = 2;
const zoomLimitDown = 0.5;
const windowWidth = 116;
const doorWidth = 80;
const wallSnapDistance = 10;
const wallSnapDegree = 10;
const stairsWidth = 80;
const stairsHeight = 150;

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
    setAction,
    stagePosition,
    setStagePosition,
  } = stageContext;
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
  const [stairsFill] = useImage('https://i.imgur.com/TWT3IGM.jpg');

  useEffect(() => {
    const gridLayer = generateGrdiLayer(
      stageWidth,
      stageHeight,
      stagePosition,
      scale,
      gridSize
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
              listening: true,
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
    if (action === 'WINDOW' || action === 'DOOR') {
      setObjects([
        ...objects,
        {
          startPointX:
            Math.round(pointerPosition.x) -
            (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4),
          startPointY: Math.round(pointerPosition.y),
          endPointX:
            Math.round(pointerPosition.x) +
            (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4),
          endPointY: Math.round(pointerPosition.y),
          type: action,
          listening: false,
          index: uuidv4(),
        },
      ]);
    }
    // if (action === 'DOOR') {
    //   setObjects([
    //     ...objects,
    //     {
    //       startPointX: Math.round(pointerPosition.x) - doorWidth / 2,
    //       startPointY: Math.round(pointerPosition.y),
    //       endPointX: Math.round(pointerPosition.x) + doorWidth / 2,
    //       endPointY: Math.round(pointerPosition.y),
    //       type: action,
    //       listening: false,
    //       index: uuidv4(),
    //     },
    //   ]);
    // }
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
    if (action === 'STAIRS') {
      setObjects([
        ...objects,
        {
          x: Math.round(pointerPosition.x),
          y: Math.round(pointerPosition.y),
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

      updateObjectsState(currentObject);
    }
    if (action === 'WINDOW' || action === 'DOOR') {
      const closestEndPoint = findClosestWall(point, objects);
      if (event.target.getClassName() === Line) {
        closestEndPoint.x = event.target.getPoints()[0];
        closestEndPoint.y = event.target.getPoints()[1];
        closestEndPoint.endPointX = event.target.getPoints()[2];
        closestEndPoint.endPointY = event.target.getPoints()[3];
      }
      currentObject.endPointX =
        Math.round(point.x) +
        (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4);
      currentObject.endPointY = Math.round(point.y);
      currentObject.startPointX =
        Math.round(point.x) -
        (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4);
      currentObject.startPointY = Math.round(point.y);

      currentObject.endPointY = closestEndPoint.y;
      currentObject.startPointY = closestEndPoint.y;

      if (
        Math.abs(
          calculateDegreeBetweenPoints(
            closestEndPoint.x,
            closestEndPoint.y,
            closestEndPoint.endPointX,
            closestEndPoint.endPointY
          )
        ) === 90
      ) {
        currentObject.startPointX = closestEndPoint.x;
        currentObject.endPointX = closestEndPoint.x;
        currentObject.startPointY =
          point.y + (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4);
        currentObject.endPointY =
          point.y - (action === 'WINDOW' ? windowWidth / 4 : doorWidth / 4);
      }
      updateObjectsState(currentObject);
    }
    // if (action === 'DOOR') {
    //   const closestEndPoint = findClosestWall(point, objects);

    //   if (event.target.getClassName() === Line) {
    //     closestEndPoint.x = event.target.getPoints()[0];
    //     closestEndPoint.y = event.target.getPoints()[1];
    //     closestEndPoint.endPointX = event.target.getPoints()[2];
    //     closestEndPoint.endPointY = event.target.getPoints()[3];
    //   }
    //   currentObject.endPointX = Math.round(point.x) + doorWidth / 2;
    //   currentObject.endPointY = Math.round(point.y);
    //   currentObject.startPointX = Math.round(point.x) - doorWidth / 2;
    //   currentObject.startPointY = Math.round(point.y);

    //   currentObject.endPointY = closestEndPoint.y;
    //   currentObject.startPointY = closestEndPoint.y;

    //   if (
    //     Math.abs(
    //       calculateDegreeBetweenPoints(
    //         closestEndPoint.x,
    //         closestEndPoint.y,
    //         closestEndPoint.endPointX,
    //         closestEndPoint.endPointY
    //       )
    //     ) === 90
    //   ) {
    //     currentObject.startPointX = closestEndPoint.x;
    //     currentObject.endPointX = closestEndPoint.x;
    //     currentObject.startPointY = Math.round(point.y + doorWidth / 2);
    //     currentObject.endPointY = Math.round(point.y - doorWidth / 2);
    //   }

    //   updateObjectsState(currentObject);
    // }

    if (action === 'STAIRS') {
      let newAngle = Math.round(
        calculateDegreeBetweenPoints(
          currentObject.x,
          currentObject.y,
          point.x,
          point.y
        )
      );
      if (newAngle > 180 - wallSnapDegree || newAngle < -180 + wallSnapDegree) {
        newAngle = 180;
      } else if (
        newAngle < 90 + wallSnapDegree &&
        newAngle > 90 - wallSnapDegree
      ) {
        newAngle = 90;
      } else if (
        newAngle > -90 - wallSnapDegree &&
        newAngle < -90 + wallSnapDegree
      ) {
        newAngle = -90;
      } else if (
        newAngle > 0 - wallSnapDegree &&
        newAngle < 0 + wallSnapDegree
      ) {
        newAngle = 0;
      }

      currentObject.angle = newAngle;
      updateObjectsState(currentObject);
    }
  };

  const onMouseUpHandler = event => {
    let currentObject = objects[objects.length - 1];
    const updateObjectsState = currentObject => {
      currentObject.listening = true;
      objects.splice(objects.length - 1, 1, currentObject);
      setObjects(objects.concat());
    };
    if (
      isDrawing &&
      (history.length > objects.length || history.length === objects.length)
    ) {
      const updatedHistory = [...history.slice(0, objects.length - 1), objects];
      setHistory(updatedHistory);
      setHistoryPosition(objects.length - 1);
      setIsDrawing(false);
      currentObject && updateObjectsState(currentObject);
      return;
    }
    if (isDrawing) {
      const updatedHistory = [...history, objects];
      setHistory(updatedHistory);
      setHistoryPosition(objects.length - 1);
      currentObject && updateObjectsState(currentObject);
    }

    setIsDrawing(false);
    if (action === 'TEXT') {
      setAction('SELECT');
    }
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

  function onDragEndHandler(e, currentObject) {
    let state = [...objects];
    let [updatedText] = state.filter(o => o.index === currentObject.index);
    updatedText.x = e.currentTarget.position().x;
    updatedText.y = e.currentTarget.position().y;
    state[currentObject.index] = updatedText;
    setObjects(state);
  }

  function onClickTextHandler(e, currentObject) {
    const position = e.currentTarget.getAbsolutePosition();
    let state = [...objects];
    let [updatedText] = state.filter(o => o.index === currentObject.index);
    updatedText.textEditVisible = true;
    updatedText.textAreaX = position.x;
    updatedText.textAreaY = position.y;
    state[currentObject.index] = updatedText;
    setObjects(state);
  }

  function onDblClickHandler(e, currentObject) {
    if (action === 'SELECT') {
      let state = [...objects].filter(o => o.index !== currentObject.index);
      setHistoryPosition(history.length);
      setObjects(state);
    }
  }
  return (
    <div>
      <Stage
        onContextMenu={e => e.evt.preventDefault()}
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
          <LineObject
            objects={objects}
            type='WALL'
            color='#4c4c4c'
            width={wallWidth}
            onDblClick={onDblClickHandler}
          />
          <LineObject
            objects={objects}
            type='WINDOW'
            opacity={0.9}
            color='white'
            width={wallWidth / 3}
            onDblClick={onDblClickHandler}
          />
          <LineObject
            objects={objects}
            type='DOOR'
            color='#d4d4d4'
            width={wallWidth / 1.5}
            onDblClick={onDblClickHandler}
          />
          <RectObject
            objects={objects}
            type='STAIRS'
            width={stairsWidth}
            height={stairsHeight}
            fillPatternImage={stairsFill}
            onDblClick={onDblClickHandler}
            onDragEnd={onDragEndHandler}
          />
          <TextObject
            objects={objects}
            type='TEXT'
            fontSize={20}
            align='left'
            width={300}
            onDragEnd={onDragEndHandler}
            onClick={onClickTextHandler}
            onDblClick={onDblClickHandler}
          />
          {/* <TextObject
            objects={objects}
            type='WALL'
            fontSize={10}
            wallWidth={wallWidth}
          /> */}
        </Layer>
      </Stage>
      )
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
      {isStageVisable && <ScaleBar gridSize={gridSize} />}
    </div>
  );
};

export default MyStage;
