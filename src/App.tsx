import { useState } from 'react'
import './App.css'
// import l1coral from './assets/l1coral.png'
// import l2coral from './assets/l2coral.png'
// import l3coral from './assets/l3coral.png'
// import l4coral from './assets/l4coral.png'
// import net from './assets/net.png'
// import processor from './assets/processor.png'
import { useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook'

function App() {
  const [cycles, setCycles] = useState<Array<number>>([]);
  const [cycleMessages, setCycleMessages] = useState<Array<string>>();
  const [endScreen, setEndScreen] = useState(false);

  const stopwatch = useStopwatch({ autoStart: false, interval: 20 });


  useEffect(() => {

  }, []);

  function ConvertToSec(sec: number, mili: number): number {
    return sec + mili / 1000;
  }

  function averageCycle(): number {
    let accum : number = 0;
    for (let i = 0; i < cycles.length; i++) {
      if (i == 0) {
        accum += cycles[0];
      }
      else {
        accum += cycles[i] - cycles[i-1];
      }
    }
    return accum / cycles.length;
  }

  function deltaCycle(): string {
    if (cycles.length == 0) {
      return "NO CYCLE"
    }

    if(cycles.length == 1) {
      return "ONLY 1 CYCLE"
    }

    return (averageCycle() - (cycles[cycles.length-1] - cycles[cycles.length-2])).toFixed(2);
  }

  const copyToClipboard = () => {
    const values = [averageCycle(), ConvertToSec(stopwatch.seconds, stopwatch.milliseconds), ...cycles];
    const text = values.join("\t");

    navigator.clipboard.writeText(text).then(() => {
      alert("Copied! Now paste into Google Sheets.");
    });
  }

  function newCycle(type: string) {
    if (type === "CLEAR") {
      setCycles([]);
      setCycleMessages([]);
      stopwatch.reset(undefined, false);
      setEndScreen(false);
    }

    else if (stopwatch.isRunning) {
      setCycles(prevCycles => (prevCycles ? [...prevCycles, ConvertToSec(stopwatch.seconds, stopwatch.milliseconds)] :
      [ConvertToSec(stopwatch.seconds, stopwatch.milliseconds)]));
      setCycleMessages(prevCycleMessages => (prevCycleMessages ?
      [...prevCycleMessages, type + " at " + ConvertToSec(stopwatch.seconds, stopwatch.milliseconds) + " seconds"] :
      [type + " at " + ConvertToSec(stopwatch.seconds, stopwatch.milliseconds) + " seconds"]));

      console.log(cycles)
    }
    else {
      alert("Timer is paused! Cannot log while paused.");
    }
  }

  return (
    <>
      {!endScreen && <div className='grid-container'>
        <div className='column-1'>
          <div className="time grid-item">
            <p>
              Current Cycle: {cycles.length > 0 ?
              (ConvertToSec(stopwatch.seconds, stopwatch.milliseconds) - cycles[cycles.length-1]).toFixed(2) :
              (ConvertToSec(stopwatch.seconds, stopwatch.milliseconds)).toFixed(2)}
            </p>
            <p>
              Total Time: {(ConvertToSec(stopwatch.seconds, stopwatch.milliseconds)).toFixed(2)}
            </p>
          </div>
          <div className='grid-item' style={{display:"flex", flexDirection:"column"}}>
            <button onClick={() => stopwatch.isRunning ? stopwatch.pause() : stopwatch.start()} style={{ fontSize: '3rem' }}>
              <span style={{ color: 'green' }}>START</span>/<span style={{ color: 'yellow' }}>PAUSE</span>
            </button>
          </div>
          <div className="coralstuff grid-item">
            <button onClick={() => newCycle("Net")}>
              <div className="individualcoral">
                Net
              </div>
            </button>
            <button onClick={() => newCycle("Processor")}>
              <div className="individualcoral">
                Process
              </div>
            </button>
          </div>
          <div className='grid-item' style={{textAlign: "center"}}>
            <button className="statusbutton" style={{ bottom: 0, backgroundColor: "white", color: 'black' }} onClick={() => { setEndScreen(true); stopwatch.pause() }}>End</button>
          </div>
        </div>
        <div className="column-2">
          <div className='time grid-item'>
            <p>
              Average Cycle: {cycles.length > 0  ? averageCycle().toFixed(2) : "NO CYCLE"}
            </p>
            <p>
              Delta Cycle (Last Cycle From average): {deltaCycle()}
            </p>
          </div>
          <div className='grid-item'>
            <button className="statusbutton" style={{ color: "#931314", fontSize: '8rem' }} onClick={() => newCycle("MISSED")}>MISS</button>
          </div>
        </div>
        <div className="column-3">
            <div className='grid-item'>
            <div className="individualcoral">
              <button onClick={() => newCycle("L4")}>
                L4
              </button>
            </div>
            <div className="individualcoral">
              <button onClick={() => newCycle("L3")}>
                L3
              </button>
            </div>
            <div className='individualcoral'>
              <button onClick={() => newCycle("L2")}>
                L2
              </button>
            </div>
            <div className='individualcoral'>
              <button onClick={() => newCycle("L1")}>
                L1
              </button>
            </div>
          </div>
        </div>
      </div>
      }
      {endScreen && <>
        <div style={{ bottom: 0, position: "absolute", left: 0, textAlign: "center", margin: '3vh' }}>
          <button className="statusbutton" style={{ bottom: 0, backgroundColor: "white", color: 'black' }} onClick={() => setEndScreen(false)}>Return</button>
        </div>
        <div style={{ bottom: 0, position: "absolute", right: 0, textAlign: "center", margin: '3vh' }}>
          <button className="statusbutton" style={{ bottom: 0, backgroundColor: "red", color: 'black' }} onClick={() => newCycle("CLEAR")}>Clear</button>
        </div>
        <div style={{ overflowY: 'scroll', height: '80vh', width: '40vw', fontSize: "1.5rem" }}>
          {cycleMessages ? cycleMessages.map((cycleMessage, i) => (
            <div key={i.toString()}>
              {cycleMessage}
            </div>
          )) : null}
          {cycleMessages &&
          <div>
            <br/>
            <button onClick={copyToClipboard} style={{color: 'bisque'}}>Copy to Clipboard</button>
          </div>
          }
        </div>
      </>}
    </>
  )
}

export default App
