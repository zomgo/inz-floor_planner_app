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
  const { walls, setWalls } = stageContext;
  const [savedStateId, setSavedStateId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const saveStateHandler = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = '{"walls":' + JSON.stringify(walls) + '}';
    try {
      const res = await axios.post('/api/savedState', data, config);
      setSavedStateId(res.data);
      setIsLoading(false);
      setIsSaveModalOpen(true);
    } catch (err) {}
  };

  const loadStateHandler = async id => {
    setIsLoadModalOpen(true);
  };

  const setDrawWallAction = () => {
    stageContext.setAction('WALL');
  };
  const setSelectAction = () => {
    stageContext.setAction('SELECT');
  };

  const closeModalHandler = () => {
    setIsSaveModalOpen(false);
    setIsLoadModalOpen(false);
  };

  const clearStateHandler = () => {
    setWalls([]);
  };

  return (
    <header className={classes.header}>
      <button className={classes.button} onClick={setSelectAction}>
        Select
      </button>
      <button className={classes.button} onClick={setDrawWallAction}>
        Draw Wall
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
      {isSaveModalOpen && (
        <SaveModal
          text='Kod projektu:'
          onConfirm={closeModalHandler}
          id={isLoading ? 'Trwa zapisywanie' : savedStateId}
        />
      )}
      {isSaveModalOpen && <Backdrop onCancel={closeModalHandler} />}
      {isLoadModalOpen && (
        <LoadModal
          text='Wprowadź kod projektu: '
          onCancel={closeModalHandler}
          // id={isLoading ? 'Trwa wczytywanie' : savedStateId}
        />
      )}
      {isLoadModalOpen && <Backdrop onCancel={closeModalHandler} />}
    </header>
  );
};

export default Header;
