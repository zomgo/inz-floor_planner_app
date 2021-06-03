import { useContext } from 'react';
import StageContext from '../store/stage-context';

const ScaleBar = props => {
  const stageContext = useContext(StageContext);
  const { scale } = stageContext;
  return (
    <div
      style={{
        boxShadow: '2px 2px 3px #ccc',
        width: `${props.gridSize * scale}px`,
        height: '20px',
        color: 'white',
        backgroundColor: '#ff73fd',
        borderRadius: '4px',
        marginRight: '10px',
        position: 'absolute',
        left: window.innerWidth - 110,
        top: window.innerHeight - 50,
        textAlign: 'center',
      }}
    >
      1 m
    </div>
  );
};

export default ScaleBar;
