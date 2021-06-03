import { Line } from 'react-konva';

export const calculateDegreeBetweenPoints = (x1, y1, x2, y2) => {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
};

export const calculateLineLength = (x1, x2, y1, y2, option = null) => {
  if (option === 'meters') {
    return (
      Math.round(
        2 * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 100
      ) /
        100 /
        100 +
      ' m'
    );
  }
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const findClosestEndPoint = (point, objects) => {
  if (objects.filter(object => object.type === 'WALL').length === 0) {
    return;
  }
  let res = objects
    .filter(object => object.type === 'WALL')
    .map(object => {
      return {
        dStart: Math.sqrt(
          Math.pow(object.startPointX - point.x, 2) +
            Math.pow(object.startPointY - point.y, 2)
        ),
        dEnd: Math.sqrt(
          Math.pow(object.endPointX - point.x, 2) +
            Math.pow(object.endPointY - point.y, 2)
        ),
        startPointX: object.startPointX,
        startPointY: object.startPointY,
        endPointX: object.endPointX,
        endPointY: object.endPointY,
      };
    });
  const newRes = array => {
    let newResArray = [];
    for (let res of array) {
      newResArray.push(
        {
          dStart: res.dStart,
          startPointX: res.startPointX,
          startPointY: res.startPointY,
          endPointX: res.endPointX,
          endPointY: res.endPointY,
        },
        {
          dEnd: res.dEnd,
          startPointX: res.startPointX,
          startPointY: res.startPointY,
          endPointX: res.endPointX,
          endPointY: res.endPointY,
        }
      );
    }
    return newResArray;
  };
  const helperArray = newRes(res).reduce((prev, curr) => {
    return (prev.dEnd || prev.dStart) <= (curr.dEnd || curr.dStart)
      ? prev
      : curr;
  });
  const closestPoint = helperArray.dStart
    ? {
        distance: helperArray.dStart,
        x: helperArray.startPointX,
        y: helperArray.startPointY,
        endX: helperArray.endPointX,
        endY: helperArray.endPointY,
      }
    : {
        distance: helperArray.dEnd,
        x: helperArray.endPointX,
        y: helperArray.endPointY,
        endX: helperArray.startPointX,
        endY: helperArray.startPointY,
      };
  return closestPoint;
};

export const findClosestWall = (point, objects) => {
  if (objects.filter(o => o.type === 'WALL').length === 0) {
    return;
  }
  let res = objects
    .filter(object => object.type === 'WALL')
    .map(object => {
      return {
        middleX: (object.startPointX + object.endPointX) / 2,
        middleY: (object.startPointY + object.endPointY) / 2,
        x: object.startPointX,
        y: object.startPointY,
        endX: object.endPointX,
        endY: object.endPointY,
      };
    })
    .map(object => {
      return {
        distance: Math.sqrt(
          Math.pow(object.middleX - point.x, 2) +
            Math.pow(object.middleY - point.y, 2)
        ),
        ...object,
      };
    })
    .reduce((prev, curr) => {
      return prev.distance < curr.distance ? prev : curr;
    });
  return res;
};

export const pointToSnapWall = (point, objects, option = 'x') => {
  if (objects.length < 2) {
    return;
  }
  const res = objects
    .slice(0, objects.length - 1)
    .filter(o => o.type === 'WALL')
    .map(o =>
      option === 'x'
        ? [o.startPointX, o.endPointX]
        : [o.startPointY, o.endPointY]
    )
    .flat();

  const pointToSnap =
    res.length > 1
      ? res.reduce((prev, curr) =>
          Math.abs(curr - point) < Math.abs(prev - point) ? curr : prev
        )
      : 0;

  return pointToSnap;
};

export const generateGrdiLayer = (
  stageWidth,
  stageHeight,
  stagePosition,
  scale,
  SIZE
) => {
  const gridLayer = [];
  for (let i = -stageWidth * 3; i < (stageWidth * 6) / scale; i += SIZE) {
    gridLayer.push(
      <Line
        opacity={0.2}
        stroke='black'
        key={gridLayer.length}
        strokeWidth={1}
        points={[
          Math.round((-stageWidth * 2 - stagePosition.x / scale) / SIZE) * SIZE,
          Math.round((0 - stagePosition.y + i) / SIZE) * SIZE,
          Math.round((stageWidth * 5 - stagePosition.x / scale) / SIZE) * SIZE,
          Math.round((i - stagePosition.y) / SIZE) * SIZE,
        ]}
      />
    );
    gridLayer.push(
      <Line
        opacity={0.2}
        stroke='black'
        key={gridLayer.length}
        strokeWidth={1}
        points={[
          Math.round((0 + i - stagePosition.x) / SIZE) * SIZE,
          Math.round((-stageHeight * 2 - stagePosition.y) / SIZE) * SIZE,
          Math.round((i - stagePosition.x) / SIZE) * SIZE,
          Math.round((stageHeight * 5 - stagePosition.y / scale) / SIZE) * SIZE,
        ]}
      />
    );
  }
  return gridLayer;
};
