import { createContext, useState } from 'react';

const StageContext = createContext({
  action: null,
  walls: [],
  setAction: action => {},
  setWalls: currentWall => {},
});

export function StageContextProvider(props) {
  const [action, setAction] = useState([]);
  const [walls, setWalls] = useState([]);

  function setActionHandler(action) {
    setAction(action);
  }

  const setWallsHandler = currentWall => {
    setWalls(currentWall);
  };

  const context = {
    action: action,
    walls: walls,
    setWalls: setWallsHandler,
    setAction: setActionHandler,
  };

  return (
    <StageContext.Provider value={context}>
      {props.children}
    </StageContext.Provider>
  );
}

export default StageContext;
