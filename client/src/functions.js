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

export const findClosestEndPoint = (point, walls) => {
  if (walls.filter(wall => wall.type === 'WALL').length === 0) {
    return;
  }
  let res = walls
    .filter(wall => wall.type === 'WALL')
    .map(wall => {
      return {
        dStart: Math.sqrt(
          Math.pow(wall.startPointX - point.x, 2) +
            Math.pow(wall.startPointY - point.y, 2)
        ),
        dEnd: Math.sqrt(
          Math.pow(wall.endPointX - point.x, 2) +
            Math.pow(wall.endPointY - point.y, 2)
        ),
        startPointX: wall.startPointX,
        startPointY: wall.startPointY,
        endPointX: wall.endPointX,
        endPointY: wall.endPointY,
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

export const findClosestWall = (point, walls) => {
  if (walls.length === 0) {
    return;
  }
  let res = walls
    .filter(wall => wall.type === 'WALL')
    .map(wall => {
      return {
        middleX: (wall.startPointX + wall.endPointX) / 2,
        middleY: (wall.startPointY + wall.endPointY) / 2,
        x: wall.startPointX,
        y: wall.startPointY,
        endX: wall.endPointX,
        endY: wall.endPointY,
      };
    })
    .map(wall => {
      return {
        distance: Math.sqrt(
          Math.pow(wall.middleX - point.x, 2) +
            Math.pow(wall.middleY - point.y, 2)
        ),
        ...wall,
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
