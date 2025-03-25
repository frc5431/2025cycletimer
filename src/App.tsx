import { useState } from 'react'
import './App.css'
import l1coral from './assets/l1coral.png'
import l2coral from './assets/l2coral.png'
import l3coral from './assets/l3coral.png'
import l4coral from './assets/l4coral.png'
import net from './assets/net.png'
import processor from './assets/processor.png'
import { useEffect } from 'react'
import { useRef } from 'react'

function App() {
  const [count, setCount] = useState(0);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const intervalTime = useRef(20); // useEffect interval time

  const [cycles, setCycles] = useState<Array<number>>([]);
  const [cycleMessages, setCycleMessages] = useState<Array<string>>();
  const [endScreen, setEndScreen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!started) {
        return;
      }

      setTimeElapsed(timeElapsed + intervalTime.current);

    }, intervalTime.current);
    return () => clearInterval(interval);
  }, [timeElapsed, started]);

  function roundButGood(num: number): number {
    return (Math.round((num) / 100) / 10);
  }

  function newCycle(type: string) {
    setCycles(prevCycles => (prevCycles ? [...prevCycles, roundButGood(timeElapsed)] : [timeElapsed]));
    setCycleMessages(prevCycleMessages => (prevCycleMessages ? [...prevCycleMessages, type + " at " + timeElapsed] : [type]));
    console.log(cycleMessages)
  }
  return (
    <>
      {!endScreen && <>
        <div className="reef">
          <div className="individualcoral">
            <p>L4 {"-->"}</p>
            <button onClick={() => newCycle("L4")}>
              <img src={l4coral} alt="Coral" style={{ borderTopLeftRadius: '10px' }} />
            </button>
          </div>
          <div className="individualcoral">
            <p>L3 {"-->"}</p>
            <button onClick={() => newCycle("L3")}>
              <img src={l3coral} alt="Coral" />
            </button>
          </div>
          <div className='individualcoral'>
            <p>L2 {"-->"}</p>
            <button onClick={() => newCycle("L2")}>
              <img src={l2coral} alt="Coral" />
            </button>
          </div>
          <div className='individualcoral'>
            <p>L1 {"-->"}</p>
            <button onClick={() => newCycle("L1")}>
              <img src={l1coral} alt="Coral" style={{ borderBottomLeftRadius: '10px' }} />
            </button>
          </div>
        </div>

        <div className="coralstuff">
          <div className="individualcoral">
            <button onClick={() => newCycle("Net")}>
              <img src={net} alt="Coral" style={{ borderTopRightRadius: '10px' }} />
            </button>
            <p>{"<--"} Net</p>
          </div>
          <div className="individualcoral">
            <button onClick={() => newCycle("Processor")}>
              <img src={processor} alt="Coral" style={{ borderBottomRightRadius: '10px' }} />
            </button>
            <p>{"<--"} Processor</p>
          </div>
        </div>

        <div className="statusbuttons">
          <button className="statusbutton" style={{ color: "#931314" }}>MISS</button>
        </div>

        <div className="time">
          <div>Time Since Last Cycle {roundButGood(timeElapsed - cycles[cycles.length - 1])}</div>
          <div>Total Time {roundButGood(timeElapsed)}</div>
          <div></div>
          <button onClick={() => setStarted(!started)} style={{ fontSize: '3rem' }}>
            <span style={{ color: 'green' }}>START</span>/<span style={{ color: 'yellow' }}>PAUSE</span>
          </button>
        </div>
        <div style={{ bottom: 0, position: "absolute", left: 0, textAlign: "center", margin: '3vh' }}>
          <button className="statusbutton" style={{ bottom: 0, backgroundColor: "white", color: 'black' }} onClick={() => setEndScreen(true)}>End</button>
        </div>
      </>
      }
      {endScreen && <>
        <div style={{ bottom: 0, position: "absolute", left: 0, textAlign: "center", margin: '3vh' }}>
          <button className="statusbutton" style={{ bottom: 0, backgroundColor: "white", color: 'black' }} onClick={() => setEndScreen(false)}>Return</button>
        </div>
        <div style={{overflowY: 'scroll', height: '80vh', width:'40vw', fontSize:"1.5rem"}}>
        {cycleMessages ? cycleMessages.map((cycleMessage, i) => (
          <div key={i.toString()}>
            {cycleMessages[i]}
          </div>
        )) : null}
        </div>
      </>}
    </>
  )
}

export default App
