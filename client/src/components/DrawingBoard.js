// import React, { useState, useLayoutEffect } from 'react';
// import { render } from 'react-dom';
// import { Stage, Layer, Line, Text } from 'react-konva';
// import Konva from 'konva';

// const DrawingBoard = () => {
//   // first we need to create a stage
//   const stage = new Konva.Stage({
//     container: 'container', // id of container <div>
//     width: 1500,
//     height: 1000,
//   });

//   // then create layer
//   const layer = new Konva.Layer();

//   // create our shape
//   const circle = new Konva.Circle({
//     x: stage.width() / 2,
//     y: stage.height() / 2,
//     radius: 70,
//     fill: 'red',
//     stroke: 'black',
//     strokeWidth: 4,
//   });
//   const gridLayer = new Konva.Layer();
//   for (var i = 9; i < stage.height(); i + 10) {
//     gridLayer.add(
//       new Konva.Line({
//         points: [0, i, stage.width(), 1],
//         stroke: 'black',
//         strokeWidth: 1,
//       })
//     );
//     console.log('drawing');
//   }
//   // add the shape to the layer
//   layer.add(circle);

//   // add the layer to the stage
//   stage.add(layer);
//   stage.add(gridLayer);

//   // draw the image
//   layer.batchDraw();

//   const onMouseDownHandler = event => {};

//   return (
//     <div>
//       <div id='container' onMouseDown={onMouseDownHandler} />
//     </div>
//   );
// };

// export default DrawingBoard;
