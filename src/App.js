import React, {useState, useRef} from 'react';
import logo from './logo.svg';
import './App.css';

function LyricsField(props){
  const [text, setText]=useState('');
  const inputField= useRef(null);
  if (inputField.current && props.focused && (!props.addFocused)){
    inputField.current.focus();
  }
  return(
  <p>
    <span 
    style={{fontWeight: props.focused?"bold":"normal"}}
    onClick={(e)=>{
      e.preventDefault(); 
      props.setTime(props.time);
      }
    }
    >{props.time}: 
    </span>
    {props.text}<br></br>
    <input type="text"
          ref={inputField} 
          value={text} 
          width = "600px"
          onChange={(e)=>{
            e.preventDefault();
            setText(e.target.value)
            }
          }>
    </input>
    <button onClick={(e)=>{
      e.preventDefault();
      props.editLyrics(text, props.time);
      setText('');
      }}>Edit lyrics
    </button>
  </p>)
}


function TimeStampList(props){
  const [newTime, setNewTime] = useState(0);
  let addFocused=false;
  const add = useRef(null);

  if (document.activeElement === add.current){
    addFocused=true;
  }

  return(
  <div className="container" style={{flexDirection:"column"}}>
  <div style={{border: "1px solid black", overflowY: "scroll", height:"200px", width:"800px"}}>
    {Object.keys(props.lyrics).map((t)=>
    <LyricsField 
      text={props.lyrics[t]} 
      focused={t===props.check} 
      addFocused={addFocused} 
      time={t} 
      editLyrics={props.editLyrics} 
      setTime={props.setTime}
    />)}
    
  </div>
  <div>
  <input type="number" value={newTime} ref={add} onChange={(e)=>{e.preventDefault(); setNewTime(e.target.value)}}></input>
  <button onClick={(e)=>{e.preventDefault(); props.addLyrics(newTime); setNewTime(0)}}>Add timestamp</button>
  </div>
  </div>
  )
}
function App() {
 
  const [editStatus, setEditStatus]=useState(0);
  const musicFile = useRef(null);
  const [fileURL, setURL]=useState(null);
  const musicStream = useRef(null);
  const lyricsFile = useRef(null);
  const [lyrics, setLyrics] = useState('');
  const [time2, setTime2]=useState(0);
  const editLyrics=(text, time)=>{
    let bufferLyrics=lyrics;
    bufferLyrics[time]=text;
    setLyrics(bufferLyrics);
    if (editStatus===1){
      setEditStatus(2);
      return
    }
    setEditStatus(1);
  }
  const addLyrics=(t)=>{
    let bufferLyrics=lyrics;
    bufferLyrics[t]=' ';
    setLyrics(bufferLyrics);
    if (editStatus===1){
      setEditStatus(2);
      return
    }
    setEditStatus(1);
  }
  const fileSubmit = (e)=>{
    e.preventDefault();
    alert(`${musicFile.current.files[0].name}`);
    setURL(URL.createObjectURL(musicFile.current.files[0]));
  }
  let lyricsFileInput=null;
  
  const lyricsSubmit = (e)=>{
    e.preventDefault();
    let reader= new FileReader();
    reader.onload = function(e){
      let text = reader.result;
      alert(text);
      const json = JSON.parse(text)
      setLyrics(json);

    }
    reader.readAsText(lyricsFile.current.files[0]);
  }
  if (fileURL){
    lyricsFileInput=<div className="container"><input type="file" accept="text/*"ref={lyricsFile}></input>
    <button onClick={lyricsSubmit}>Load lyrics</button></div>
  }
 
  const getTime=(e)=>{
    e.preventDefault();
    if (!lyrics){
      return
    }
    let i=0;
    let bufferTime2=0;
    while (musicStream.current.currentTime>Object.keys(lyrics)[i]){
      bufferTime2=Object.keys(lyrics)[i];
      i=i+1;
    }
    setTime2(bufferTime2);
  }
  
  function skipTime(t){
    if (!fileURL) {alert("no file"); return}
    musicStream.current.currentTime=t;
  }
    
  let timestamp=<div className="container" style={{border: "1px solid black", overflowY: "scroll", height:"200px", width:"800px"}}></div>;
  if (fileURL && lyrics){
    timestamp=<TimeStampList check={time2} lyrics={lyrics} setTime={skipTime} editLyrics={editLyrics} addLyrics={addLyrics}/>
  }
  
  
  return(<div>
    <div className="container" style={{flexDirection:"row"}}>
      <div className="container">
        <input type="file" accept="audio/*" ref={musicFile}></input>
        <button onClick={fileSubmit}>Load music</button>
      </div>
    {lyricsFileInput}
    </div>
    <div>{time2}</div>

    <div className='container'>{timestamp}</div>
    <div className="container"><audio src={fileURL} controls ref={musicStream} onTimeUpdate={getTime} style={{"width":"800px"}}></audio></div>
  </div> 
  )
}

export default App;
