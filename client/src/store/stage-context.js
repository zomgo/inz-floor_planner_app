import { createContext, useState } from 'react';

const StageContext = createContext({
  action: null,
  walls: [],
  isStageVisable: true,
  scale: 1,
  history: [],
  setHistory: state => {},
  setAction: action => {},
  setWalls: currentWall => {},
  setIsStageVisable: value => {},
  setScale: scale => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState([]);
  const [walls, setWalls] = useState([]);
  const [isStageVisable, setIsStageVisable] = useState(true);
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);

  function setActionHandler(action) {
    setAction(action);
  }

  const setWallsHandler = currentWall => {
    setWalls(currentWall);
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
    walls: walls,
    isStageVisable: isStageVisable,
    scale: scale,
    history: history,
    setHistory: setHistoryHandler,
    setScale: setScaleHandler,
    setWalls: setWallsHandler,
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
