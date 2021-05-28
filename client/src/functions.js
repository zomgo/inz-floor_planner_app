export const calculateDegreeBetweenPoints = (x1, y1, x2, y2) => {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
};

export const findClosestEndPoint = (point, walls) => {
  let res = walls
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
    })
    .reduce((prev, curr) => {
      return (prev.dEnd || prev.dStart) < (curr.dEnd || curr.dStart)
        ? prev
        : curr;
    });
  const closestPoint =
    res.dStart < res.dEnd
      ? {
          distance: res.dStart,
          x: res.startPointX,
          y: res.startPointY,
          endX: res.endPointX,
          endY: res.endPointY,
        }
      : {
          distance: res.dEnd,
          x: res.endPointX,
          y: res.endPointY,
          endX: res.startPointX,
          endY: res.startPointY,
        };
  return closestPoint;
};
