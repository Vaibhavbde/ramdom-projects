import { Copy, Trash2 } from 'lucide-react'

const DataCard = ({data,deleteObj,hiddenpassword,copyPassword}) => {
  return(
        <div className='flex bg-[#1e293b] border border-slate-700 px-5 py-3 justify-between w-[100%]' key={data.webName}>
            <div className="flex-7/8 bg-slate-800 p-4 rounded-xl shadow-md w-60">
                <p>
                    <span className="text-blue-400 font-semibold">Website:</span>{" "}
                    <span className="text-white">{data.webName}</span>
                </p>
                <p>
                    <span className="text-green-400 font-semibold">Username:</span>{" "}
                    <span className="text-gray-200">{data.webUserName}</span>
                </p>
                <div className='flex justify-between items-center'>
                    <p className='flex'>
                    <span className="text-orange-400 font-semibold">Password:</span>{" "}
                    <span className="text-gray-200 ml-1">{hiddenpassword(data.webPassword.length)}{data.webPassword.slice(-2)}</span>
                    </p>
                    <Copy size={25} onClick={() => copyPassword(data.webPassword)} className='p-1 rounded-md cursor-pointer hover:bg-gray-700'/>
                </div>
            </div>
            <Trash2 onClick={() => deleteObj(data)} className=' mt-4 p-1 right-0 h-8 rounded-sm bg-red-500 hover:bg-red-700 text-[#ffffff]'/>
        </div>
                )
}

export default DataCard