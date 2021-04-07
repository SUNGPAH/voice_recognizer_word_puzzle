import './App.css';
import {useRecognizer} from './useRecognizer';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [step, setStep] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [outputText, interim, startRecognizer, endRecognizer, error] = useRecognizer();

  const arr = [
    {
      word: "come along with",
      options: [
        "함께 가다",
        "따로 가다"
      ],
      answer: "함께 가다",
    },
    {
      word: "speculative",
      options: [
        "심사하기 좋아하는",
        "심사 숙고 하는",
      ],
      answer: "심사 숙고 하는",
    },
    {
      word: "hungry",
      options: [
        "배가 고픈",
        "잠이 오는",
      ],
      answer: "배가 고픈",
    }
  ]

  useEffect(() => {
    if(!outputText){
      return  
    }

    if(outputText === ""){
      return
    }

    const options = arr[step].options
    
    if(outputText.includes('left')){
      onCardClick(options[0])
    }else if(outputText.includes('right')){
      onCardClick(options[1])
    }        
  }, [outputText])

  const start = () => {
    startRecognizer();
    setStep(0);
    setGameState('started');
  }

  const onCardClick = (option) => {
    const el = arr[step]
    if(!el){
      return 
    }

    if(el.answer === option){
      const nextEl = arr[step + 1]
      if (nextEl){

        toast('🦄 Wow so easy!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step => step + 1);
      }else{
        toast.dark('🦄 Completed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        endRecognizer();
        setGameState('ended');
      }
    }else{
      toast.warn('🦄 Wrong!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });        
    }
  }

  const renderCard = () => {    
    const el = arr[step]
    if (!el){
      return <></>
    }

    return <div className="flex aic fdc">
      <div className="fl">{el.word}</div>
      <br/>
      <div className="flex fdr">
        {el.options.map((option,index) => 
          <div className="card aic jcc flex" key={index} onClick={e => {onCardClick(option)}}>{option}</div>
        )}
      </div>
    </div>
  }

  return (
    <div className="flex vw100 vh100 fdc aic p16">
      {
        (gameState === "idle" || gameState === "ended") &&
        <div onClick={start} className="btn btn-success">Start</div>
      }            
      {
        gameState === "started" &&
        <div className="pt16">
          {renderCard()}
        </div>
      }
      <ToastContainer/>
    </div>
  );
}

export default App;
