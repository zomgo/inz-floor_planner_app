import { createContext, useState } from 'react';

const StageContext = createContext({
  action: null,
  walls: [],
  isStageVisable: true,
  scale: 1,
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

  const context = {
    action: action,
    walls: walls,
    isStageVisable: isStageVisable,
    scale: scale,
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
