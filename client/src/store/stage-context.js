import { createContext, useState } from 'react';

const StageContext = createContext({
  action: 'SELECT',
  objects: [],
  isStageVisable: true,
  scale: 1,
  history: [],
  history2: [],
  historyPosition: 0,
  setHistoryPosition: number => {},
  setHistory: state => {},
  setHistory2: object => {},
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
  const [history2, setHistory2] = useState([]);
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

  const setHistoryHandler = state => {
    setHistory(state);
  };
  const setHistory2Handler = objects => {
    if (history2.length >= objects.length) {
      setHistory2(history2.slice(0, objects.length));
      return;
    }
    if (objects === undefined) {
      setHistory2([]);
      return;
    }
    //setHistory2(null);
    setHistory2([...history2, objects]);
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
    history2: history2,
    historyPosition: historyPosition,
    setHistoryPosition: setHistoryPositionHandler,
    setHistory: setHistoryHandler,
    setHistory2: setHistory2Handler,
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
