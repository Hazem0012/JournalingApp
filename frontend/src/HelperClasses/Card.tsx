import { Calendar, Clock, Edit,  Scroll } from "lucide-react";

import type { JournalEntry } from "../types/journal";
import { formatDisplayDate, formatDisplayTime } from "../utils/date";

interface CardProps {
  entry?: JournalEntry;
  width:Number;
  onSelect: ()=> void;
  
}

function Card({ entry,width, onSelect}: CardProps) {
  
  const title =  entry?.title?? "Title";
  const formattedCreateDate = formatDisplayDate(entry?.created_at??new Date());
  const formattedCreateTime = formatDisplayTime(entry?.created_at??new Date());
  const formattedUpdateDate = formatDisplayDate(entry?.updated_at??new Date());
  const formattedUpdateTime = formatDisplayTime(entry?.updated_at??new Date());
  const preview = entry?.description?? "Description";

  const handleClick = () => {
    if (entry ) {
      onSelect();
      
    }
  };

  const previewText = preview.length > 180 ? `${preview.slice(0, 177)}...` : preview;

  return (
    <div
      className={`bg-amber-300/20 dark:bg-stone-900/70 my-[0.7%] border-2 w-[${width}%] rounded-4xl
       border-amber-700/50 dark:border-amber-500/30 shadow shadow-amber-900/80  dark:hover:shadow-[0_0_3rem] dark:shadow-amber-700/80 px-[3%] py-[0.5%] 
       hover:shadow-xl cursor-pointer hover:scale-[102%] transition transform duration-150 ease-in-out hover:bg-amber-100/50 dark:hover:bg-stone-800`}
      onClick={handleClick}
      
    >
      <div className=" flex flex-row justify-center items-center">
        <hr className="w-[26%] border-0 h-[0.1rem] bg-linear-to-r from-transparent to-amber-700/50 mx-[5%] dark:to-amber-200/50" />
        <Scroll className=" text-amber-800/70 dark:text-amber-200/70 " />
        <hr className="w-[26%] border-0 h-[0.1rem] bg-linear-to-l from-transparent to-amber-700/50 mx-[5%] dark:to-amber-200/50" />
      </div>
      <p className=" text-2xl my-[1%] mx-[0.5%] truncate text-amber-900 dark:text-amber-50">{title}</p>
      <div className=" flex flex-row w-full text-amber-200 space-x-[2%]">
        <div className=" border-2 bg-amber-600 rounded-2xl p-[1%] flex flex-row space-x-[3%] w-[17%] items-center dark:bg-amber-200/90 dark:text-amber-800 ">
          <Calendar size={15} />
          <p className="truncate text-sm">{formattedCreateDate}</p>
        </div>
        <div className=" border-2 bg-amber-600 rounded-2xl p-[1%] flex flex-row space-x-[3%] w-[13%] items-center dark:bg-amber-200/90 dark:text-amber-800 ">
          <Clock size={15} />
          <p className=" truncate text-sm">{formattedCreateTime}</p>
        </div>
        {entry?.created_at!==entry?.updated_at&&(
            <div className=" border-2 bg-amber-900 rounded-2xl p-[1%] flex flex-row space-x-[3%] w-[36%] items-center dark:bg-amber-400/80 dark:text-amber-900 ">
            <Edit size={15} />
            <p className=" truncate text-sm">Updated On: {formattedUpdateDate} at {formattedUpdateTime}</p>
        </div>
        )}
        
      </div>

      <p className=" text-md my-[2%] mx-[0.5%] overflow-hidden text-ellipsis text-amber-900 dark:text-amber-100">{previewText}</p>
    </div>
  );
}

export default Card;
