import classes from './Header.module.css';
import { useContext, useState } from 'react';
import StageContext from '../store/stage-context';
import LoadModal from './LoadModal';
import axios from 'axios';
import Backdrop from './Backdrop';
import Modal from './Modal';

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
  const [isClearConfirmationModalOpen, setIsClearConfirmationModalOpen] =
    useState(false);

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

  const clearStateButtonHandler = () => {
    setIsStageVisable(false);
    setIsClearConfirmationModalOpen(true);
  };

  const loadStateHandler = async id => {
    setIsStageVisable(false);
    setIsLoadModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsClearConfirmationModalOpen(false);
    setIsSaveModalOpen(false);
    setIsLoadModalOpen(false);
    setIsStageVisable(true);
  };

  const clearStateHandler = () => {
    setIsClearConfirmationModalOpen(false);
    setIsStageVisable(true);
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
          <button className={classes.button} onClick={clearStateButtonHandler}>
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
        <Modal
          text='Kod projektu:'
          confirmHandler={closeModalHandler}
          id={savedStateId}
          loading={isLoading}
        />
      )}
      {isLoadModalOpen && (
        <LoadModal
          text='Wprowadź kod projektu: '
          onCancel={closeModalHandler}
        />
      )}
      {isClearConfirmationModalOpen && (
        <Modal
          confirmHandler={clearStateHandler}
          text='Jesteś pewien ?'
          cancelHandler={closeModalHandler}
        />
      )}
      {(isLoadModalOpen || isClearConfirmationModalOpen || isSaveModalOpen) && (
        <Backdrop onCancel={closeModalHandler} />
      )}
    </header>
  );
};

export default Header;
