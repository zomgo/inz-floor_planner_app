import classess from './SaveModal.module.css';

const SaveModal = props => {
  function confirmHandler() {
    props.onConfirm();
  }

  return (
    <div className={classess.modal}>
      <label htmlFor='id'>{props.text}</label>
      <br />
      <input type='text' id='id' defaultValue={props.id} />
      <button
        onClick={() => {
          navigator.clipboard.writeText(props.id);
        }}
      >
        Copy
      </button>
      <br />
      <button className={classess.button} onClick={confirmHandler}>
        Ok
      </button>
    </div>
  );
};

export default SaveModal;
