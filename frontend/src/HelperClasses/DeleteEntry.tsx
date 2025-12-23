import {  Trash2, X } from "lucide-react";

import api from "../api";
import type { JournalEntry } from "../types/journal";
interface props{
  onDel:()=>void;
  onClose: ()=>void;
  entry:JournalEntry | null;

}

function DeleteEntry({ entry, onDel, onClose}:props) {
    const handleDelete=async()=>{
        try{
            await api.delete(`journals/${entry!.id}`);
            onDel();
        }
        catch(error){
            console.log(error)
        }
    }

  return (
    <div className="fixed inset-0 w-full bg-black/50 bg-blend-color-burn z-10 min-h-dvh flex justify-center items-start">
      <div className="flex flex-col mt-[12%] border-2 rounded-2xl border-amber-200 w-[40%] bg-amber-200 p-[1.5%] space-y-[0.5%] dark:bg-stone-950">
        <div className="flex flex-row items-center space-x-[2%] relative">
          <h1 className=" text-2xl pr-[10%] dark:text-amber-100/80">Are you sure you want to delete this entry?</h1>
          <X onClick={onClose} className="absolute right-[0%] cursor-pointer hover:text-amber-800 dark:text-amber-100/80 dark:hover:text-red-700/80"  />
        </div>
        

        <p className="whitespace-pre-line leading-relaxed mt-[3%] text-red-500/70  dark:text-red-400/80"> Deleting this entry will remove it permenantly from your chronicles!</p>

        <div className="flex flex-row justify-end items-center space-x-[2%]">
          <button
            className="transition-all duration-150 ease-in-out flex flex-row items-center space-x-[5%] w-[20%] border-2 rounded-xl p-[1%] cursor-pointer 
            border-red-900/60 text-red-900/60 hover:bg-red-900/80 hover:text-amber-100/90 disabled:opacity-40 disabled:cursor-not-allowed dark:text-red-400/90
             dark:border-red-500/90 dark:hover:bg-red-500/90"
           onClick={handleDelete}
          >
            <Trash2 size={15} />
            <p>Delete</p>
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default DeleteEntry;
