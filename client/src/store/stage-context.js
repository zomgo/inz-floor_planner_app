import { createContext, useState } from 'react';

const StageContext = createContext({
  action: 'SELECT',
  objects: [],
  isStageVisable: true,
  scale: 1,
  history: [],
  historyPosition: 0,
  setHistoryPosition: number => {},
  setHistory: object => {},
  setAction: action => {},
  setObjects: currentWall => {},
  setIsStageVisable: value => {},
  setScale: scale => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState('SELECT');
  const [objects, setObjects] = useState([]);
  const [isStageVisable, setIsStageVisable] = useState(true);
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyPosition, setHistoryPosition] = useState(0);

  function setActionHandler(action) {
    setAction(action);
  }

  const setObjectsHandler = currentWall => {
    setObjects(currentWall);
  };

  const setIsStageVisableHandler = value => {
    setIsStageVisable(value);
  };

  const setScaleHandler = scale => {
    setScale(scale);
  };

  const setHistoryHandler = objects => {
    // if (option === true) {
    //   setHistory(objects);
    //   return;
    // }
    // if (history && history.length >= objects.length) {
    //   let temp = history.slice(0, objects.length - 1);
    //   temp.concat(objects);
    //   setHistory(temp);
    //   return;
    // }
    // if (objects === undefined) {
    //   setHistory([]);
    //   return;
    // }
    // setHistory([...history, objects]);
    setHistory(objects);
  };

  const setHistoryPositionHandler = number => {
    setHistoryPosition(number);
  };

  const context = {
    action: action,
    objects: objects,
    isStageVisable: isStageVisable,
    scale: scale,
    history: history,
    historyPosition: historyPosition,
    setHistoryPosition: setHistoryPositionHandler,
    setHistory: setHistoryHandler,
    setScale: setScaleHandler,
    setObjects: setObjectsHandler,
    setAction: setActionHandler,
    setIsStageVisable: setIsStageVisableHandler,
  };

  return (
    <StageContext.Provider value={context}>
      {props.children}
    </StageContext.Provider>
  );
}

export default StageContext;
