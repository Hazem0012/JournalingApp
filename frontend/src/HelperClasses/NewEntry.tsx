import { Feather, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAuth } from '../AuthContext';
import api from '../api';
import type { JournalEntry } from '../types/journal';

interface props{
    onPublish :(entry: JournalEntry)=>void;
    onClose :()=>void;
}

function NewEntry({onPublish, onClose}:props) {
    const {user}=useAuth();
    const [title,setTitle]=useState("");
    const [description, setDescription] = useState("");    
    const [error, setError] =useState("");
    const handleCreate= async(e:FormEvent)=>{
        e.preventDefault()
        if (!user) return;
        if (!title || !description){
            setError("Incomplete Entry!");
            return;
        }
        try{
             const { data } = await api.post<JournalEntry>('/journals', {"title":title, "description":description, "created_at": new Date(), "updated_at":new Date()});
            onPublish(data);
            setTitle("");
            setDescription("");
            
        }
        catch(error){
            console.log(error);
        }
    }

  return (
    <div className='absolute inset-0 w-full bg-black/50 bg-blend-color-burn z-10 min-h-dvh'>
        <div className='flex flex-col mt-[12%] ml-[32%] border-2 rounded-2xl border-amber-200 
        w-[40%] bg-amber-200  p-[1%] space-y-[0.5%] dark:bg-stone-900 dark:border-amber-500 dark:shadow-[0_0_17px] dark:shadow-amber-500'>
            <div className='flex flex-row items-center space-x-[2%] relative dark:text-amber-400'>
                <Feather  /> 
                <h1 className=' text-2xl '>Compose Your Thoughts</h1>
                <X onClick={onClose} className='absolute right-[2%] cursor-pointer hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-500'/>
            </div>
            <p className=' mb-[6%] italic text-amber-800 dark:text-amber-100'>Record this moment in your personal chronicle</p>

            <form onSubmit={handleCreate} onChange={()=>setError("")} className=' flex flex-col relative '>
            <label className="text-amber-900 font-semibold ml-[0.6%] mb-[0.7%] dark:text-amber-100">
                    Entry Title               
                </label>
                <input className="border-2 border-amber-700 rounded-lg px-[1%] bg-amber-100 transition-all duration-300 ease-in-out focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 
                focus:outline-none dark:placeholder:text-amber-200/60 dark:text-amber-200 dark:bg-transparent dark:border-amber-500/70 dark:focus:border-amber-400 dark:focus:shadow-[0_0_8px] dark:focus:shadow-amber-400" placeholder='Give your entry a title...' value={title} onChange={(e)=>setTitle(e.target.value)}/>

                <label className="text-amber-900 font-semibold ml-[0.6%] mt-[2%] mb-[0.7%] dark:text-amber-100">
                Your Reflections
                </label>
                <textarea className="resize-none h-48 border-2 border-amber-700 rounded-lg px-[1%] bg-amber-100 transition-all duration-200 ease-in-out focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 
                focus:outline-none dark:placeholder:text-amber-200/60 dark:text-amber-200 dark:bg-transparent dark:border-amber-500/70 dark:focus:border-amber-400 dark:focus:shadow-[0_0_8px] dark:focus:shadow-amber-400" placeholder='Let your thoughts flow onto the page...' value={description} onChange={(e)=>setDescription(e.target.value)}/> 
                

                <div className=' flex flex-row justify-between items-center mt-[2%]'>
                    <p
                        className={`text-red-900/60 dark:text-red-400/90 ml-[1%] transition-opacity duration-250 ease-in-out ${
                            error ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {error}
                    </p>
                <button className='w-[15%] font-semibold text-amber-950 p-[1.2%] bg-amber-100 border-amber-900 border-2 rounded-2xl px-[3%] 
                    hover:bg-amber-900 hover:text-amber-100 cursor-pointer transition-all duration-200 ease-in-out dark:bg-transparent dark:border-amber-500 
                    dark:text-amber-400 dark:hover:bg-amber-500/80 dark:hover:text-amber-100 '
                    type='submit'>Publish</button>

                </div>
                
            </form>      
             
        </div>

    </div>
  )
}

export default NewEntry;
