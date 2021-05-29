import classes from './Header.module.css';
import { useContext, useState } from 'react';
import StageContext from '../store/stage-context';
import SaveModal from './SaveModal';
import LoadModal from './LoadModal';
import axios from 'axios';
import Backdrop from './Backdrop';

const Header = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const stageContext = useContext(StageContext);
  const { walls, setWalls, setIsStageVisable, setScale, history, setHistory } =
    stageContext;
  const [savedStateId, setSavedStateId] = useState(null);
  //const [isLoading, setIsLoading] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const saveStateHandler = async () => {
    setIsStageVisable(false);
    // setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = '{"walls":' + JSON.stringify(walls) + '}';
    try {
      const res = await axios.post('/api/savedState', data, config);
      setIsSaveModalOpen(true);
      //  setIsLoading(false);
      setSavedStateId(res.data);
    } catch (err) {}
  };

  const loadStateHandler = async id => {
    setIsStageVisable(false);
    setIsLoadModalOpen(true);
  };

  const setDrawWallAction = () => {
    stageContext.setAction('WALL');
  };
  const setSelectAction = () => {
    stageContext.setAction('SELECT');
  };
  const setWindowAction = () => {
    stageContext.setAction('WINDOW');
  };

  const closeModalHandler = () => {
    setIsSaveModalOpen(false);
    setIsLoadModalOpen(false);
    setIsStageVisable(true);
  };

  const clearStateHandler = () => {
    setHistory(walls);
    setWalls([]);
  };

  const resetScaleHandler = () => {
    setScale(1);
  };

  const undoHandler = () => {
    if (walls.length === 0) {
      setWalls(history);
      return;
    }
    setHistory(walls);
    setWalls(walls.slice(0, walls.length - 1));
  };

  const redoHandler = () => {
    if (history.length === 0) return;
    setWalls(history);
  };

  return (
    <header className={classes.header}>
      <h1 className={classes.h1}>Floor planner</h1>
      <ul>
        <button className={classes.button} onClick={setSelectAction}>
          Select
        </button>
        <button className={classes.button} onClick={setDrawWallAction}>
          Draw Wall
        </button>
        <button className={classes.button} onClick={setWindowAction}>
          Window
        </button>
        <button className={classes.button} onClick={saveStateHandler}>
          Save
        </button>
        <button className={classes.button} onClick={loadStateHandler}>
          Load
        </button>
        <button className={classes.button} onClick={clearStateHandler}>
          Clear project
        </button>
        <button className={classes.button} onClick={resetScaleHandler}>
          Reset zoom
        </button>
        <button className={classes.button} onClick={undoHandler}>
          Undo
        </button>
        <button className={classes.button} onClick={redoHandler}>
          Redo
        </button>
      </ul>
      {isSaveModalOpen && (
        <SaveModal
          text='Kod projektu:'
          onConfirm={closeModalHandler}
          id={savedStateId}
        />
      )}
      {isSaveModalOpen && <Backdrop onCancel={closeModalHandler} />}
      {isLoadModalOpen && (
        <LoadModal
          text='Wprowadź kod projektu: '
          onCancel={closeModalHandler}
        />
      )}
      {isLoadModalOpen && <Backdrop onCancel={closeModalHandler} />}
    </header>
  );
};

export default Header;
