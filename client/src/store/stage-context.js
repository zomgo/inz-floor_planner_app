import { createContext, useState } from 'react';

const StageContext = createContext({
  action: null,
  walls: [],
  isStageVisable: true,
  setAction: action => {},
  setWalls: currentWall => {},
  setIsStageVisable: value => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState([]);
  const [walls, setWalls] = useState([]);
  const [isStageVisable, setIsStageVisable] = useState(true);

  function setActionHandler(action) {
    setAction(action);
  }

  const setWallsHandler = currentWall => {
    setWalls(currentWall);
  };

  const setIsStageVisableHandler = value => {
    setIsStageVisable(value);
  };

  const context = {
    action: action,
    walls: walls,
    isStageVisable: isStageVisable,
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
