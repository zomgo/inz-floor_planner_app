import classess from './SaveModal.module.css';
import { useContext, useRef, useState } from 'react';
import StageContext from '../store/stage-context';
import axios from 'axios';
import mongoose from 'mongoose';

const LoadModal = props => {
  const stageContext = useContext(StageContext);
  const { setObjects } = stageContext;
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
      props.onCancel();
    } catch (err) {
      props.onCancel();
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className={classess.modal}>
        <label htmlFor='id'>{props.text}</label>
        <br />
        <input type='text' required id='id' ref={idInputRef} />
        <br />
        {!isIdValid && <p style={{ color: 'red' }}>Nieprawidłowy kod</p>}
        <button
          type='button'
          className={classess.button}
          onClick={confirmHandler}
        >
          Anuluj
        </button>
        <button type='submit' className={classess.button}>
          Wczytaj
        </button>
      </div>
    </form>
  );
};

export default LoadModal;
