import {  useEffect, useState } from "react";
import { BookOpen, Sparkles} from "lucide-react";
import SideNavBar from "../HelperClasses/SideNavBar";
import Card from "../HelperClasses/Card";
import NewEntry from "../HelperClasses/NewEntry";
import { useAuth } from "../AuthContext";
import { useJournals } from "../queryHook";
import DisplayEntry from "../HelperClasses/DisplayEntry";
import { type JournalEntry } from "../types/journal";
import UpdateEntry from "../HelperClasses/UpdateEntry";
import DeleteEntry from "../HelperClasses/DeleteEntry";


function MainPage() {
  const { user, loading } = useAuth();
  const [showNewEntry, setShowNewEntry] = useState(false);

  const { data: entries = [], isLoading: entriesLoading, error, refetch } = useJournals(!loading && !!user);
  const[selected, setSelected]=useState(false);
  const [cardInfo, setCardInfo] = useState<JournalEntry|null>(null);
  const [edit,setEdit]=useState(false);
  const [del, setDel]= useState(false);
  const [searchTerm, setSearchTerm]= useState("");

  const filteredEntries = entries?.filter((e)=>{
    const query = searchTerm.toLowerCase();
    return (e.title.toLowerCase().includes(query));
  })??[];

  const orderedEntries = [...filteredEntries].sort((a, b) => {
    const aTime = new Date(a.updated_at).getTime();
    const bTime = new Date(b.updated_at).getTime();
    return bTime - aTime;
  
  });


  useEffect(()=>{
    if(!cardInfo) return;
    const fresh = entries.find((e)=> e.id === cardInfo.id);
    if(fresh) setCardInfo(fresh);
  },[entries, cardInfo?.id]);
 
  
  return (
    <div className="flex flex-row w-full bg-linear-to-r  from-amber-100/60 via-amber-100/90 to-amber-100/60 
    dark:from-stone-950/90 dark:via-stone-950 dark:to-black/90 cormorant-sc-regular text-amber-950 dark:text-amber-100
     min-h-dvh transition-colors duration-300">
      {/** Entry Handling*/}
      {selected &&del?(
        <DeleteEntry entry={cardInfo} onDel={()=>{setDel(false); setEdit(false); setSelected(false); refetch();}}onClose={()=>setDel(false)} />
      ):selected &&edit?(
        <UpdateEntry entry={cardInfo} onUpdate={(updated)=>{setCardInfo(updated); setEdit(false); refetch();}} onClose={()=>setEdit(false)}/>
      ):selected&&
      (
        <DisplayEntry entry={cardInfo} onEdit={()=>setEdit(true)} onDel={()=>setDel(true)} onClose={()=>setSelected(false)}/>
      )}
      
      <SideNavBar length={entries.length} openNewEntry={()=>setShowNewEntry(true)}/>
        {showNewEntry &&
          <NewEntry onPublish={()=>{setShowNewEntry(false); refetch();}} onClose={()=>setShowNewEntry(false)}/>
        }
     
      <div className=" flex flex-col items-center w-[80%] my-[2%]">
        {/**Header*/}
        <div className=" relative   flex flex-col 
        justify-center items-center w-[80%]  rounded-xl space-y-[1.5%] py-[1%]">
          <div className=" mr-[2.5%] flex flex-row w-full items-center justify-center">
            <hr className="w-[13%] border-0 h-[3%] bg-linear-to-r from-transparent to-amber-400/50 mx-[1%]"/>
            <div className="mr-[1%] p-[0.7%] rounded-xl bg-linear-to-br from-amber-100 to-amber-300/60 dark:from-amber-200/40 dark:to-amber-700/30  border-2 border-amber-400/50 dark:border-amber-600/30 shadow-md">
                      <BookOpen size={30} className="  text-amber-800/80 dark:text-amber-400" strokeWidth={2.0} />
            </div>
            <div className=" flex flex-col justify-center items-center">
              <p className="font-semibold text-amber-950/80 dark:text-amber-400 text-2xl">My Journal Entries</p>
              <p className=" text-sm text-amber-600/90 dark:text-amber-200 italic">Explore your Archives</p>
            </div>
            <hr className="w-[13%] border-0 h-[3%] bg-linear-to-l from-transparent to-amber-400/50 mx-[1%]"/>
          </div>

          
          <div className=" flex flex-row space-x-[1%] w-[70%] justify-center">
            <div className="flex items-center justify-center gap-2 ">
                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                <div className="w-1 h-1 rounded-full bg-amber-500/20" />
              </div>
              
              <Sparkles size={14} className=" text-amber-500/50 " />

              <div className="flex items-center justify-center gap-2 scale-x-[-1]">
                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                <div className="w-1 h-1 rounded-full bg-amber-500/20" />
              </div>
          </div>

          <input type="text" className=" placeholder:text-amber-800/80 dark:placeholder:text-amber-100/80 transition-all duration-250 ease-in-out text-amber-800/80
           dark:text-amber-50 placeholder:opacity-65 border-2 border-amber-600/60 dark:border-amber-600/40 rounded-xl dark:shadow-[0px_0px_12px] dark:shadow-amber-600
           bg-stone-50 dark:bg-stone-900 px-[1.4%] py-[0.4%] w-[60%] shadow shadow-amber-500 focus:outline-0 focus:shadow-amber-400 
           focus:border-amber-300" placeholder="Search..." 
           value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} 
           /> 
          
        </div>


      {/**Recent Entries */}
        <div className=" flex flex-row justify-center items-center my-[3%] w-[80%] ">
          <div className="flex items-center justify-center gap-2  scale-x-[-1] mr-[5%]">
                <div className="w-2 h-2 rounded-full bg-amber-600/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600/30" />
                <div className="w-1 h-1 rounded-full bg-amber-600/20" />
          </div>
          <hr className="w-[16%] border-0 h-[3%] bg-linear-to-r from-transparent to-amber-600/50 mx-[5%]"/>
          <div className="bg-amber-500/50 flex flex-row space-x-[3%] w-[20%] justify-center border-2 border-amber-500/50 text-xl items-center rounded-lg py-[0.5%]
           text-amber-700/50 dark:text-amber-100 font-semibold  dark:bg-amber-700/90 dark:border-amber-600/80">
            <p>RECENT ENTRIES</p>
            
          </div>
          
          <hr className="w-[16%] border-0 h-[3%] bg-linear-to-l from-transparent to-amber-600/50 mx-[5%]"/>
          <div className="flex items-center justify-center gap-2 ml-[5%]">
                <div className="w-2 h-2 rounded-full bg-amber-600/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600/30" />
                <div className="w-1 h-1 rounded-full bg-amber-600/20" />
          </div>
          
        </div>


        {/**Entries */}

        {(loading ||entriesLoading)?(<p className=" text-xl text-amber-900 dark:text-amber-100">
          Loading content...
        </p>): error ? (<p className=" text-xl text-amber-900 dark:text-amber-100">
          Failed to load entries.
        </p>): filteredEntries.length>0 ?
        orderedEntries.slice(0,2).map((entry)=>(
          <Card onSelect={()=>{setSelected(true); setCardInfo(entry);}} key={entry.id} entry={entry} width={70}/>
        )):
        entries.length>0?(          
        <p className="text-amber-800 dark:text-amber-100 text-lg">No Entries found with "{searchTerm}" in it</p>):
          (
            <p className="text-amber-800 dark:text-amber-100 text-lg">No entries yet, create your first journal!</p>
          )
        }
 

      </div>
    </div>
  )
}

export default MainPage
