import { useMemo, useState } from 'react';
import { ArrowLeft,  CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Sparkles } from 'lucide-react';
import {Link} from 'react-router-dom';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import type { CustomComponents } from 'react-day-picker';
import Card from '../HelperClasses/Card';
import { useJournals } from '../queryHook';
import { useAuth } from '../AuthContext';
import { formatDisplayDate } from '../utils/date';
import type { JournalEntry } from '../types/journal';
import UpdateEntry from '../HelperClasses/UpdateEntry';
import DisplayEntry from '../HelperClasses/DisplayEntry';
import DeleteEntry from '../HelperClasses/DeleteEntry';

function Calendar() {
  const {user,loading} = useAuth();
  const {data:entries, isLoading, refetch} = useJournals(!loading&&!!user);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selected, setSelected]=useState(false);
  const [cardInfo, setCardInfo] = useState<JournalEntry|null>(null);
  const [edit,setEdit]=useState(false);
  const [del, setDel]= useState(false);

  const entriesForSelectedDate = useMemo(() => {
    if (!entries || !selectedDate) return [];
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      if (Number.isNaN(entryDate.getTime())) return false;
      return entryDate.toDateString() === selectedDate.toDateString();
    });
  }, [entries, selectedDate,refetch]);

  const datesWithEntries = useMemo(() => {
    if (!entries) return [];
    const uniqueDates = new Map<string, Date>();
    entries.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      if (Number.isNaN(entryDate.getTime())) return;
      const key = entryDate.toDateString();
      if (!uniqueDates.has(key)) {
        uniqueDates.set(key, new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate()));
      }
    });
    return Array.from(uniqueDates.values());
  }, [entries,refetch]);

  const AmberChevron: CustomComponents['Chevron'] = ({  orientation = 'right', }) => {
  const Icon =
    orientation === 'left' ? ChevronLeft :
    orientation === 'up' ? ChevronUp :
    orientation === 'down' ? ChevronDown :
    ChevronRight;

  return (
    <Icon
      strokeWidth={2.5}
      className={` text-amber-800 dark:text-amber-500/70 dark:hover:text-amber-400/80 hover:text-amber-700`}
    />
  );
};
  return (
    <div className="cormorant-sc-regular w-full flex items-center flex-col bg-linear-to-r  from-amber-100/60 via-amber-100/90 to-amber-100/60 min-h-dvh dark:from-stone-950/90 dark:via-stone-950 dark:to-black/90 ">
      
      {selected &&del?(
        <DeleteEntry entry={cardInfo} onDel={()=>{setDel(false); setEdit(false); setSelected(false); refetch();}}onClose={()=>setDel(false)}  />
      ):selected &&edit?(
        <UpdateEntry entry={cardInfo} onUpdate={(updated)=>{setCardInfo(updated); setEdit(false); refetch();}} onClose={()=>setEdit(false)}/>
      ):selected&&
      (
        <DisplayEntry entry={cardInfo} onEdit={()=>setEdit(true)} onDel={()=>setDel(true)} onClose={()=>setSelected(false)}/>
      )}
    <Link to={"/me"} className=" flex flex-row items-center space-x-[1%] w-[25%] mt-[2%] text-amber-800 font-bold rounded-2xl text-xl cursor-pointer mr-[41%] 
    hover:text-amber-700/70 dark:text-amber-200 dark:hover:text-amber-400/80 transition-colors duration-150 ease-in-out"> 
      <ArrowLeft size={19} strokeWidth={2.5}/>
      <p>Back to Journal</p>
     </Link>
    {/**Top Section */}
    <div className=" mt-[2%] flex flex-col 
            justify-center items-center w-[70%] rounded-4xl space-y-[2%] py-[1%]">
          <div className=" mr-[2.5%] flex flex-row w-full items-center justify-center">
            <hr className="w-[13%] border-0 h-[0.1rem] bg-linear-to-r from-transparent to-amber-400/50 mx-[1%]"/>
            <div className="mr-[1%] p-[0.7%] rounded-xl bg-linear-to-br from-amber-100 to-amber-300/60 dark:from-amber-200/40 dark:to-amber-700/30 border-2 border-amber-400/50 dark:border-amber-600/30 shadow-md">
                      <CalendarDays size={30} className="  text-amber-800/80 dark:text-amber-400" strokeWidth={2.0} />
            </div>
            <div className=" flex flex-col justify-center items-center">
              <h1 className="font-semibold text-amber-950/80 text-2xl dark:text-amber-400">Calendar View</h1>
              <p className=" text-sm text-amber-600/90 italic dark:text-amber-200">Manage your account preferences</p>
            </div>
            <hr className="w-[13%] border-0 h-[0.1rem] bg-linear-to-l from-transparent to-amber-400/50 mx-[1%]"/>
          </div>
          <div className=" flex flex-row space-x-[1%] w-full justify-center">
          
          <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
              <div className="w-1 h-1 rounded-full bg-amber-500/20" />
            </div>
            
            <Sparkles size={14} className=" text-amber-500/50 " />
          
            <div className="flex items-center justify-center gap-2 mb-6 scale-x-[-1]">
              <div className="w-2 h-2 rounded-full bg-amber-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
              <div className="w-1 h-1 rounded-full bg-amber-500/20" />
            </div>
            
          </div>
        </div>

        {/**Body Section */}

        <div className='flex flex-row w-[95%] justify-around h-120'>

          <div className='w-[30%]  rounded-2xl flex flex-col items-center py-[1.5%] '>

          <div className=' flex flex-row w-full items-center justify-center'>
                <hr  className=' w-[40%] border-0 h-[0.05rem] bg-linear-to-l from-transparent to-amber-700/30 mx-[1%] dark:to-amber-400/80 '/>
                <Sparkles size={14} className=' text-amber-900 dark:text-amber-400'/>
                <hr  className=' w-[40%] border-0 h-[0.05rem] bg-linear-to-r from-transparent to-amber-700/30 mx-[1%] dark:to-amber-400/80'/>
          </div>
          <p className=' text-amber-900 font-semibold text-lg dark:text-amber-200/80'>Select a Date</p>
          <p className=' text-amber-600 italic  mb-[2%] dark:text-amber-500/80'> Days with entries are highlighted</p>

              <DayPicker
              navLayout='around'
                animate
                
                mode='single'
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ hasEntry: datesWithEntries }}
                className=' bg-amber-100 px-[3%] p-[1%] border-2 rounded-2xl items-center flex justify-center text-amber-900 dark:bg-stone-900 dark:border-amber-200 dark:text-amber-200/80 '
                classNames={{
                  day:'hover:bg-amber-300/70 rounded-full transition-all duration-150 ease-in-out dark:hover:bg-amber-500 dark:hover:text-amber-100 hover:font-bold dark:hover:border-none'
                  
  
                }}
                modifiersClassNames={{
                    hasEntry: 'bg-amber-300/70 text-amber-900 font-semibold dark:bg-amber-400',
                    selected: ' !bg-amber-800 !text-amber-500 rounded-full font-bold transition-all duration-150 ease-in-out dark:!text-amber-100/90 ',
                      today: ' rounded-full font-extrabold  dark:text-amber-700 ',
                     }}
               components={
                {
                  Chevron:AmberChevron,
                }
               }
                
              />
          </div>
          <div className='w-[70%] border-2 border-amber-800 py-[1.5%] rounded-2xl   items-center flex flex-col dark:border-amber-500/30'>
              <div className=' flex flex-row w-full items-center justify-center'>
                <hr  className=' w-[40%] border-0 h-[0.05rem] bg-linear-to-l from-transparent to-amber-700/30 mx-[1%] dark:to-amber-400/80  '/>
                <Sparkles size={14} className=' text-amber-900 dark:text-amber-400 '/>
                <hr  className=' w-[40%] border-0 h-[0.05rem] bg-linear-to-r from-transparent to-amber-700/30 mx-[1%] dark:to-amber-400/80 '/>
              </div>
               
              <p className=' mx-[1%] my-[1%] text-amber-900 font-semibold text-lg dark:text-amber-200/80'>
                {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
              </p>
              <div className='w-full flex flex-col items-center max-h-full overflow-y-auto p-[3%]'>
                {isLoading && <p className='text-amber-800'>Loading entries...</p>}
                {!isLoading && entriesForSelectedDate.length === 0 && (
                  <p className='text-amber-700 italic dark:text-amber-100/80'>No entries for this date.</p>
                )}
                {entriesForSelectedDate.map((entry) => (
                  <Card key={entry.id} entry={entry} width={85} onSelect={()=>{setSelected(true);setCardInfo(entry)}}/>
                ))}
              </div>
          </div>

        </div>
    </div>
  )
}

export default Calendar
