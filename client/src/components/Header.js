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
  const {
    objects,
    setObjects,
    setIsStageVisable,
    setScale,
    history,
    setHistory,
    history2,
    historyPosition,
    setHistoryPosition,
    setHistory2,
  } = stageContext;
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
    const data = '{"objects":' + JSON.stringify(objects) + '}';
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
  const setDoorAction = () => {
    stageContext.setAction('DOOR');
  };
  const setTextAction = () => {
    stageContext.setAction('TEXT');
  };

  const closeModalHandler = () => {
    setIsSaveModalOpen(false);
    setIsLoadModalOpen(false);
    setIsStageVisable(true);
  };

  const clearStateHandler = () => {
    setHistory(objects);
    setObjects([]);
    setHistory2();
    setHistoryPosition(0);
  };

  const resetScaleHandler = () => {
    setScale(1);
  };

  const undoHandler = () => {
    if (historyPosition > history2.length) {
      setObjects(history2[0]);
    }
    if (historyPosition <= 0) {
      setObjects([]);
      setHistoryPosition(-1);
      return;
    }
    setObjects(history2[historyPosition - 1]);

    setHistoryPosition(historyPosition - 1);
  };

  const redoHandler = () => {
    if (historyPosition >= history2.length - 1) {
      return;
    }
    setObjects(history2[historyPosition + 1]);
    setHistoryPosition(historyPosition + 1);
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
        <button className={classes.button} onClick={setDoorAction}>
          Door
        </button>
        <button className={classes.button} onClick={setTextAction}>
          Text
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
