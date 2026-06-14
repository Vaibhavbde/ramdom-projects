import React from 'react';

export default function Header({ onStart }){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
      <div>
        <h1 style={{margin:0,fontSize:20}}>Soundboard of Emotions</h1>
        <p style={{margin:0,color:'#64748b'}}>Click an emoji to play a matching generated sound</p>
      </div>
      <div>
        <button onClick={onStart} style={{background:'#0ea5a4',color:'white',border:'none',padding:'8px 12px',borderRadius:8,cursor:'pointer'}}>Enable Audio</button>
      </div>
    </div>
  );
}
