import classes from './SaveModal.module.css';

const SaveModal = props => {
  function confirmHandler() {
    props.onConfirm();
  }

  return (
    <div className={classes.modal}>
      <label htmlFor='id'>{props.text}</label>
      <br />
      <input
        className={classes.input}
        type='text'
        id='id'
        defaultValue={props.id ? props.id : 'saving'}
      />
      <button
        onClick={() => {
          navigator.clipboard.writeText(props.id);
        }}
      >
        Kopiuj
      </button>
      <br />
      <button className={classes.button} onClick={confirmHandler}>
        Ok
      </button>
    </div>
  );
};

export default SaveModal;
