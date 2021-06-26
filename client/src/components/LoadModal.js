import classes from './Modal.module.css';
import { useContext, useRef, useState } from 'react';
import StageContext from '../store/stage-context';
import axios from 'axios';
import mongoose from 'mongoose';

const LoadModal = props => {
  const stageContext = useContext(StageContext);
  const { setObjects, setHistoryPosition, setHistory } = stageContext;
  const idInputRef = useRef();
  const [isIdValid, setIsIdValid] = useState(true);

  function confirmHandler() {
    props.onCancel();
  }

  const submitHandler = async event => {
    event.preventDefault();
    const enteredId = idInputRef.current.value;
    if (!mongoose.Types.ObjectId.isValid(enteredId)) {
      setIsIdValid(false);
      return;
    }

    setIsIdValid(true);
    try {
      const res = await axios.get(
        `/api/savedState/${idInputRef.current.value}`
      );
      setObjects(res.data.objects);
      setHistory([res.data.objects]);
      setHistoryPosition(0);
      props.onCancel();
    } catch (err) {
      setIsIdValid(false);
    }
  };

  return (
    <div className={classes.modal}>
      <form onSubmit={submitHandler}>
        <label htmlFor='id'>{props.text}</label>
        <br />
        <input
          className={classes.input}
          type='text'
          required
          id='id'
          ref={idInputRef}
        />
        <br />
        {!isIdValid && <div style={{ color: 'red' }}>Nieprawidłowy kod</div>}
        <br />
        <button
          type='button'
          className={classes.button}
          onClick={confirmHandler}
        >
          Anuluj
        </button>
        <button type='submit' className={classes.button}>
          Wczytaj
        </button>
      </form>
    </div>
  );
};

export default LoadModal;
