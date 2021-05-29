import { createContext, useState } from 'react';

const StageContext = createContext({
  action: null,
  objects: [],
  isStageVisable: true,
  scale: 1,
  history: [],
  setHistory: state => {},
  setAction: action => {},
  setObjects: currentWall => {},
  setIsStageVisable: value => {},
  setScale: scale => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState([]);
  const [objects, setObjects] = useState([]);
  const [isStageVisable, setIsStageVisable] = useState(true);
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);

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

  const context = {
    action: action,
    objects: objects,
    isStageVisable: isStageVisable,
    scale: scale,
    history: history,
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
