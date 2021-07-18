import { useState, ReactNode, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
  children: ReactNode;
}

// custom hook for getting previous value 
function usePrevious(prevProps: any) { // any - para receber qualquer props.
  const ref = useRef();
  useEffect(() => {
    ref.current = prevProps; // recebe o parâmetro da função para armazenar o valor anterior.
  });
  //console.log('antes prevProps: ' + ref.current)
  return ref.current;
}

export default function Modal(props: Props) {

  const { isOpen, setIsOpen, children } = props;
  const [modalStatus, setModalStatus] = useState(isOpen);

  const isOpenPrev = usePrevious(modalStatus) // custom hook para pegar os props antes de ser renderizados pelo componente.

  useEffect(() => {
    //console.log('depois isOpen: ' + isOpen)
    if (isOpenPrev !== isOpen) {
      setModalStatus(isOpen)
    }
  }, [isOpen, isOpenPrev]) // executa quando o isOpen props é alterado em outro componente. Ver Componente "Dashboard".

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {children}
    </ReactModal>
  );
}
