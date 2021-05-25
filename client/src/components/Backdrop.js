import classess from './Backdrop.module.css';

const Backdrop = props => {
  return <div className={classess.backdrop} onClick={props.onCancel} />;
};

export default Backdrop;
