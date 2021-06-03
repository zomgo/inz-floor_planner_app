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
    historyPosition,
    setHistoryPosition,
    setHistory,
  } = stageContext;
  const [savedStateId, setSavedStateId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const saveStateHandler = async () => {
    setIsSaveModalOpen(true);
    setIsStageVisable(false);
    setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = '{"objects":' + JSON.stringify(objects) + '}';
    try {
      const res = await axios.post('/api/savedState', data, config);

      setIsLoading(false);
      setSavedStateId(res.data);
    } catch (err) {}
  };

  const loadStateHandler = async id => {
    setIsStageVisable(false);
    setIsLoadModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsSaveModalOpen(false);
    setIsLoadModalOpen(false);
    setIsStageVisable(true);
  };

  const clearStateHandler = () => {
    setObjects([]);
    setHistory([]);
    setHistoryPosition(0);
  };

  const resetScaleHandler = () => {
    setScale(1);
  };

  const undoHandler = () => {
    if (historyPosition > history.length) {
      setObjects(history[0]);
    }
    if (historyPosition <= 0) {
      setObjects([]);
      setHistoryPosition(-1);
      return;
    }
    setObjects(history[historyPosition - 1]);

    setHistoryPosition(historyPosition - 1);
  };

  const redoHandler = () => {
    if (historyPosition >= history.length - 1) {
      return;
    }
    setObjects(history[historyPosition + 1]);
    setHistoryPosition(historyPosition + 1);
  };

  return (
    <header className={classes.header}>
      <div>
        <ul>
          <button className={classes.button} onClick={clearStateHandler}>
            Nowy Projekt
          </button>
          <button className={classes.button} onClick={saveStateHandler}>
            Zapisz
          </button>
          <button className={classes.button} onClick={loadStateHandler}>
            Wczytaj
          </button>
        </ul>
      </div>
      <ul>
        <button className={classes.button} onClick={resetScaleHandler}>
          Resetuj zoom
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
          loading={isLoading}
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
