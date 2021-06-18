import { createContext, useState } from 'react';

const StageContext = createContext({
  action: 'SELECT',
  objects: [],
  isStageVisable: true,
  scale: 1,
  history: [],
  historyPosition: 0,
  stagePosition: { x: 0, y: 0 },
  setHistoryPosition: number => {},
  setHistory: object => {},
  setAction: action => {},
  setObjects: currentWall => {},
  setIsStageVisable: value => {},
  setScale: scale => {},
  setStagePosition: position => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState('SELECT');
  const [objects, setObjects] = useState([]);
  const [isStageVisable, setIsStageVisable] = useState(true);
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyPosition, setHistoryPosition] = useState(0);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

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
    setHistory(objects);
  };

  const setHistoryPositionHandler = number => {
    setHistoryPosition(number);
  };

  const setStagePositionHandler = position => {
    setStagePosition(position);
  };

  const context = {
    action: action,
    objects: objects,
    isStageVisable: isStageVisable,
    scale: scale,
    history: history,
    historyPosition: historyPosition,
    stagePosition: stagePosition,
    setHistoryPosition: setHistoryPositionHandler,
    setHistory: setHistoryHandler,
    setScale: setScaleHandler,
    setObjects: setObjectsHandler,
    setAction: setActionHandler,
    setIsStageVisable: setIsStageVisableHandler,
    setStagePosition: setStagePositionHandler,
  };

  return (
    <StageContext.Provider value={context}>
      {props.children}
    </StageContext.Provider>
  );
}

export default StageContext;
