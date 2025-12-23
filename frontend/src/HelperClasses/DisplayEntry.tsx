import { Edit, Trash2, X } from "lucide-react";
import type { JournalEntry } from "../types/journal";
import { formatDisplayDate } from "../utils/date";
interface props{
  entry:JournalEntry | null;
  onEdit:()=>void;
  onDel:()=>void;
  onClose: ()=>void;
}



function DisplayEntry({entry, onEdit, onDel, onClose}:props) {
  

  return (
    <div className="fixed inset-0 w-full bg-black/50 bg-blend-color-burn z-10 min-h-dvh flex justify-center items-start ">
      <div className="flex flex-col mt-[12%] border-2 rounded-2xl border-amber-200 w-[50%] bg-amber-200 p-[1.5%] space-y-[0.5%] dark:bg-stone-950">
        <div className="flex flex-row items-center space-x-[2%] relative">
          <h1 className=" text-2xl pr-[10%] dark:text-amber-100">{entry?.title}</h1>
          <X onClick={onClose} className="absolute right-[0%] cursor-pointer hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-500/80"  />
        </div>
        <p className=" mb-[2%] italic text-amber-800 dark:text-amber-500">
          {formatDisplayDate(entry!.created_at)??""}
        </p>

        <p className="whitespace-pre-line leading-relaxed text-stone-900 dark:text-amber-100"> {entry?.description}</p>

        <div className="flex flex-row justify-end items-center space-x-[2%]">
          <button
            className="transition-all duration-150 ease-in-out flex flex-row items-center space-x-[5%] w-[20%] border-2 rounded-xl p-[1%] cursor-pointer 
            border-red-900/60 text-red-900/60 hover:bg-red-900/80 hover:text-amber-100/90 disabled:opacity-40 disabled:cursor-not-allowed dark:text-red-400/90 
            dark:border-red-500/90 dark:hover:bg-red-500/90 "
           onClick={onDel}
          >
            <Trash2 size={15} />
            <p>Delete</p>
          </button>
          <button
            className="transition-all duration-150 ease-in-out border-2 border-amber-900 text-amber-900 rounded-xl p-[1%] cursor-pointer flex flex-row items-center 
            space-x-[7%] w-[18%] hover:bg-amber-800 hover:text-amber-100/90 disabled:opacity-40 disabled:cursor-not-allowed dark:text-amber-400 dark:border-amber-500 
            dark:hover:bg-amber-500 dark:hover:text-amber-100"
            onClick={onEdit}
          >
            <Edit size={15} />
            <p>Edit</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayEntry;
