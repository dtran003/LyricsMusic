import React, {useState, useRef} from 'react';
import logo from './logo.svg';
import './App.css';

function LyricsField(props){
  const [text, setText]=useState(props.text);
  const inputField= useRef(null);
  if (props.focused){
    inputField.current.focus();
  }
  return(
  <span>
    <input type="text" ref={inputField} value={text} onChange={(e)=>{e.preventDefault();setText(e.target.value)}}></input>
  </span>)
}
function TimeStampList(props){
  
  return(
  <div style={{border: "1px solid black", overflowY: "scroll", height:"200px"}}>
    {props.timestamps.map((t,i)=><p><span 
    style={{fontWeight: props.check===t?"bold":"normal"}}
    onClick={(e)=>{
      e.preventDefault(); 
      props.setTime(t);
      }
    }
    >{t}</span>: <LyricsField text={props.lyrics[i]} focused={props.check===t} time={t} editLyrics={props.editLyrics} />
    </p>)}
  </div>
  )
}
function App() {
  const lyricsFile = useRef(null);
  const [lyrics, setLyrics] = useState('');
  const [editStatus, setEditStatus]=useState(0);
  const musicFile = useRef(null);
  const musicStream = useRef(null);
  const [fileURL, setURL]=useState(null);
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
    lyricsFileInput=<div><input type="file" ref={lyricsFile}></input>
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
    
  let timestamp=<div style={{border: "1px solid black", overflowY: "scroll", height:"200px"}}></div>;
  if (fileURL && lyrics){
    let keys = Object.keys(lyrics);
    let lyricsList = Object.values(lyrics);
    timestamp=<TimeStampList check={time2} timestamps={keys} lyrics={lyricsList} setTime={skipTime} editLyrics={editLyrics} />
  }
  
  
  return(<div>Hello World<br></br>
    <input type="file" accept="audio\*"ref={musicFile}></input>
    <button onClick={fileSubmit}>Load music</button><br></br>
    {lyricsFileInput}
    <div>{time2}</div>

    <div>{timestamp}</div>
    <div><audio src={fileURL} controls ref={musicStream} onTimeUpdate={getTime} style={{"width":"1000px"}}></audio></div>
  </div> 
  )
}

export default App;
