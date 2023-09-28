import React, { useState, useEffect } from 'react';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
function Timer() {

    const [sessionLength, setSessionLength] = useState(1500); // Inizializza workLength a 1500 secondi (25 minuti)
    const [breakLength, setBreakLength] = useState(300); // Inizializza breakLength a 300 secondi (5 minuti)

    
  const [activeTimer, setActiveTimer] = useState('Session');
  const [workTimeLeft, setWorkTimeLeft] = useState(breakLength); // 25 minuti in secondi per il lavoro
  const [breakTimeLeft, setBreakTimeLeft] = useState(sessionLength); // 5 minuti in secondi per la pausa

  const [isWorkActive, setIsWorkActive] = useState(false); // Stato per il timer di lavoro
  const [isBreakActive, setIsBreakActive] = useState(false); // Stato per il timer di pausa




  useEffect(() => {
    let workInterval;

    console.log(workTimeLeft);

    if (isWorkActive && workTimeLeft > 0) {

      workInterval = setInterval(() => {
        setWorkTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (workTimeLeft === 0) {
      // Qui puoi gestire la logica quando il timer di lavoro è terminato
      // Ad esempio, puoi cambiare lo stato a "pausa" e riprodurre un suono di notifica.
      const audioElement = document.getElementById('beep');
        audioElement.play();
      setIsWorkActive(false);

    sleep(1000).then(() =>{

        
        setActiveTimer('Break');

        setIsBreakActive(true);

        setWorkTimeLeft(sessionLength)

    })


    }


    return () => {
      clearInterval(workInterval);
    };
  }, [isWorkActive, workTimeLeft, sessionLength]);


  useEffect(() => {

    let breakInterval;

    console.log(breakTimeLeft);

    if (isBreakActive && breakTimeLeft > 0) {
      breakInterval = setInterval(() => {
        setBreakTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (breakTimeLeft === 0) {
      // Qui puoi gestire la logica quando il timer di pausa è terminato
      // Ad esempio, puoi cambiare lo stato a "lavoro" e riprodurre un suono di notifica.
      setIsBreakActive(false);
      const audioElement = document.getElementById('beep');
        audioElement.play();

      sleep(1000).then(() =>{
        setActiveTimer('Session');

        setIsWorkActive(true);

        setBreakTimeLeft(breakLength);

    })

   
    }

    return () => {
      clearInterval(breakInterval);
    };
  }, [isBreakActive, breakTimeLeft, breakLength]);

//   const startWorkTimer = () => {
//     setIsWorkActive(true);
//     setIsBreakActive(false);
//   };

//   const startBreakTimer = () => {
//     setIsBreakActive(true);
//     setIsWorkActive(false);
//   };

  const switchToWorkTimer = () => {
    setActiveTimer('Session');
  };

  const switchToBreakTimer = () => {
    setActiveTimer('Break');
  };



  const startStop = () => {
    if(activeTimer==='Session') {
      if(isWorkActive===false)
        setIsWorkActive(true);
      else
        setIsWorkActive(false);
    }
    else {
      if(isBreakActive===false)
        setIsBreakActive(true);
      else
        setIsBreakActive(false);
    }
};

  const resetTimer = () => {
    setIsWorkActive(false);
    setIsBreakActive(false);
    setSessionLength(1500);
    setBreakLength(300);
    setBreakTimeLeft(300);
    setWorkTimeLeft(1500);
    setActiveTimer('Session');

    const audioElement = document.getElementById('beep');
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };



  const handlePauseLength = (value) => {
    if(value==='+'){
        if(isBreakActive || isWorkActive) return;
      if(breakLength<3600)
        setBreakLength(prevBreakLength => prevBreakLength+60);
    } else {
        if(isBreakActive || isWorkActive) return;
      if(breakLength-60>0)
      setBreakLength(prevBreakLength => prevBreakLength-60);
    }
  };

  const handleWorkLength = (value) => {
    if(value==='+'){

        if(isWorkActive || isBreakActive) return;
      if(sessionLength<3600){
      setSessionLength(prevSessionLength => prevSessionLength+60);

      }

    } else {
        if(isWorkActive || isBreakActive) return;
      if(sessionLength-60>0)
      setSessionLength(prevSessionLength => prevSessionLength-60);

    }
  };

  useEffect(() => {


        setWorkTimeLeft(sessionLength);
    
  }, [sessionLength]);

  useEffect(() => {

   

        setBreakTimeLeft(breakLength);
  }, [breakLength]);

  return (
    <div>
        <div className="box">

          <div className="pauseLength">
          <h2 id="break-label">Break Length</h2>
          <output id="break-length">{Math.floor(breakLength/60)}</output>
          <button id="break-increment" onClick={() => handlePauseLength('+')}>+</button>
          <button id="break-decrement" onClick={() => handlePauseLength('-')}>-</button>

          </div>

          <div className="changeLength">
            <h2 id="session-label">Session Length</h2>
            <output id="session-length">{Math.floor(sessionLength/60)}</output>
            <button id="session-increment" onClick={() => handleWorkLength('+')}>+</button>
            <button id="session-decrement" onClick={() => handleWorkLength('-')}>-</button>
          </div>
        </div>


        <output id="timer-label">{activeTimer}</output>
      <div>
      <p id="time-left">
  {activeTimer === 'Session'
    ? `${Math.floor(workTimeLeft / 60).toString().padStart(2, '0')}:${(workTimeLeft % 60).toString().padStart(2, '0')}`
    : `${Math.floor(breakTimeLeft / 60).toString().padStart(2, '0')}:${(breakTimeLeft % 60).toString().padStart(2, '0')}`}
</p>
      </div>
      <button onClick={activeTimer === 'Session' ? (switchToBreakTimer) : (switchToWorkTimer)}>SWITCH</button>
      <button id="start_stop" onClick={startStop}>START</button>
      <button id="reset" onClick={() => resetTimer()}>Reset</button>
      <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>
  );
}

export default Timer;