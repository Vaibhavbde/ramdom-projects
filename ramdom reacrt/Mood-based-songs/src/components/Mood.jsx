import React from 'react'
import music from  '../../public/songs/songone.mp3'


const moods =[
    {
    name:"😄",
    color:"blue",
    message:"You are happy",
    music:music,
    },
         
  {
   name:" 😢",
  color:"grey",
   message:"You are sad",
   music:music,
        },

{
   name:"😡",
   color:"red",
   message:"You are angry",
   music:music,
        },
]
const Mood = ({onMoodChange}) => {
  return (
    <div className='flex gap-5 justify-center mt-5 items-center'>
     {moods.map((mood)=>(
        <button key={mood.name} onClick={()=> onMoodChange(mood)} className={`bg-${mood.color} p-5 rounded-full text-white hover:scale-110 hover:shadow-lg transition-all duration-300` }>
            {mood.name}
        </button>
     ))}
    </div>
  )
}

export default Mood