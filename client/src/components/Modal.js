import { Fragment } from 'react';
import classes from './Modal.module.css';

const Modal = props => {
  return (
    <div className={classes.modal}>
      <label htmlFor='id'>{props.text}</label>
      <br />
      {props.id && (
        <Fragment>
          <input
            className={classes.input}
            type='text'
            id='id'
            defaultValue={props.id}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(props.id);
            }}
          >
            Kopiuj
          </button>
        </Fragment>
      )}
      <br />
      {props.cancelHandler && (
        <button className={classes.button} onClick={props.cancelHandler}>
          Anuluj
        </button>
      )}
      <button className={classes.button} onClick={props.confirmHandler}>
        Ok
      </button>
    </div>
  );
};

export default Modal;
