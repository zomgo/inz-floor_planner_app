export const calculateDegreeBetweenPoints = (x1, y1, x2, y2) => {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
};

export const findClosestEndPoint = (point, walls) => {
  if (walls.length === 0) {
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
  const aaa = newRes(res).reduce((prev, curr) => {
    return (prev.dEnd || prev.dStart) <= (curr.dEnd || curr.dStart)
      ? prev
      : curr;
  });
  const closestPoint = aaa.dStart
    ? {
        distance: aaa.dStart,
        x: aaa.startPointX,
        y: aaa.startPointY,
        endX: aaa.endPointX,
        endY: aaa.endPointY,
      }
    : {
        distance: aaa.dEnd,
        x: aaa.endPointX,
        y: aaa.endPointY,
        endX: aaa.startPointX,
        endY: aaa.startPointY,
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
