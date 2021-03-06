import React from 'react';
import { useContext } from 'react';
import StageContext from '../store/stage-context';
import classes from './ToolBar.module.css';

const ToolBar = () => {
  const stageContext = useContext(StageContext);
  const { setAction, isStageVisable, objects } = stageContext;

  const noWalls = () => {
    if (objects.filter(object => object.type === 'WALL').length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const setDrawWallAction = () => {
    setAction('WALL');
  };
  const setSelectAction = () => {
    setAction('SELECT');
  };
  const setWindowAction = () => {
    if (noWalls()) {
      setAction('SELECT');
      return;
    }
    setAction('WINDOW');
  };
  const setDoorAction = () => {
    if (noWalls()) {
      setAction('SELECT');
      return;
    }
    setAction('DOOR');
  };
  const setTextAction = () => {
    setAction('TEXT');
  };
  const SetStairsAction = () => {
    setAction('STAIRS');
  };
  return (
    <div className={classes.toolBar}>
      {isStageVisable && (
        <ul className={classes.list}>
          <li>
            <button className={classes.button} onClick={setSelectAction}>
              Zaznacz
            </button>
          </li>
          <li>
            <button className={classes.button} onClick={setDrawWallAction}>
              Ściana
            </button>
          </li>
          <li>
            <button className={classes.button} onClick={setWindowAction}>
              Okno
            </button>
          </li>
          <li>
            <button className={classes.button} onClick={setDoorAction}>
              Drzwi
            </button>
          </li>
          <li>
            <button className={classes.button} onClick={SetStairsAction}>
              Schody
            </button>
          </li>
          <li>
            <button className={classes.button} onClick={setTextAction}>
              Tekst
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ToolBar;
