import { ArrowLeft, Library, Sparkles } from "lucide-react"
import { Link } from 'react-router-dom';
import Card from "../HelperClasses/Card";
import { useJournals } from "../queryHook";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";
import { useEffect, useState } from "react";
import type { JournalEntry } from "../types/journal";
import DisplayEntry from "../HelperClasses/DisplayEntry";
import UpdateEntry from "../HelperClasses/UpdateEntry";
import DeleteEntry from "../HelperClasses/DeleteEntry";
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";





function TotalEntries() {
    const {user,loading}=useAuth();
    const { isDark } = useTheme();
    const {data:entries=[], isLoading, error, refetch} =useJournals(!loading&& !!user);
    const [selected, setSelected]=useState(false);
    const [cardInfo, setCardInfo] = useState<JournalEntry|null>(null);
    const [edit,setEdit]=useState(false);
    const [del, setDel]= useState(false);

    const [searchTerm, setSearchTerm]= useState("");
    const [sort, setSort] = useState("newest");


  //Get entries filtered by search term
  const filteredEntries = entries?.filter((e)=>{
    const query = searchTerm.toLowerCase();
    return e.title.toLowerCase().includes(query);
  }) ?? [];



   //Order entries
  const orderedEntries = [...filteredEntries].sort((a, b) => {
    const aUpdatedTime = new Date(a.updated_at).getTime();
    const bUpdatedTime = new Date(b.updated_at).getTime();
    const aCreatedTime = new Date(a.created_at).getTime();
    const bCreatedTime = new Date(b.created_at).getTime();
    if (sort==="newest"){
        return bCreatedTime - aCreatedTime;
    }
    else if (sort==="oldest"){
      return aCreatedTime - bCreatedTime;
    }
    else if (sort==="recently_updated"){
      return bUpdatedTime -aUpdatedTime;
    }
    
    return aUpdatedTime -bUpdatedTime;
   
  });



  useEffect(()=>{
    if(!cardInfo) return;
    const fresh = entries?.find((e)=> e.id === cardInfo.id);
    if(fresh) setCardInfo(fresh);
  },[entries, cardInfo?.id]);
 

  return (
    <div className="relative cormorant-sc-regular w-full flex items-center flex-col bg-linear-to-r  from-amber-100/70 via-amber-100/90 
    to-amber-100/70 min-h-dvh dark:from-stone-950/90 dark:via-stone-950 dark:to-black/90">
      {selected &&del?(
        <DeleteEntry entry={cardInfo} onDel={()=>{setDel(false); setEdit(false); setSelected(false); refetch();}}onClose={()=>setDel(false)} />
      ):selected &&edit?(
        <UpdateEntry entry={cardInfo} onUpdate={(updated)=>{setCardInfo(updated); setEdit(false); refetch();}} onClose={()=>setEdit(false)}/>
      ):selected&&
      (
        <DisplayEntry entry={cardInfo} onEdit={()=>setEdit(true)} onDel={()=>setDel(true)} onClose={()=>setSelected(false)}/>
      )}
        <Link to={"/me"} className=" flex flex-row items-center space-x-[1%] w-[25%] mt-[2%] text-amber-800 font-bold rounded-2xl text-xl cursor-pointer mr-[34%]
        hover:text-amber-700/70 dark:text-amber-200 dark:hover:text-amber-100/80 transition-colors duration-150 ease-in-out"> 
        <ArrowLeft size={19} strokeWidth={2.5}/>
        <p>Back to Journal</p>
        </Link>    
        {/**Top Section */}
        <div className=" mt-[2%] flex flex-col 
                justify-center items-center w-[70%] rounded-4xl space-y-[2%] py-[2%]">
            <div className=" mr-[2.5%] flex flex-row w-full items-center justify-center">
                <hr className="w-[13%] border-0 h-[0.1rem] bg-linear-to-r from-transparent to-amber-400/50 mx-[1%]"/>
                <div className="mr-[1%] p-[0.7%] rounded-xl bg-linear-to-br from-amber-100 to-amber-300/60 dark:from-amber-200/40 dark:to-amber-700/30  border-2 border-amber-400/50 dark:border-amber-600/30 shadow-md">
                        <Library size={30} className="  text-amber-800/80 dark:text-amber-400" strokeWidth={2.0} />
                </div>
                <div className=" flex flex-col justify-center items-center">
                <h1 className="font-semibold text-amber-950/80 text-2xl dark:text-amber-500">Total Entries</h1>
                <p className=" text-sm text-amber-600/90 italic dark:text-amber-200">View your Chronicles</p>
                </div>
                <hr className="w-[13%] border-0 h-[0.1rem] bg-linear-to-l from-transparent to-amber-400/50 mx-[1%]"/>
            </div>
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
          <input type="text" className=" placeholder:text-amber-800/80 dark:placeholder:text-amber-100/80 transition-all duration-250 ease-in-out text-amber-800/80
           dark:text-amber-50 placeholder:opacity-65 border-2 border-amber-600/60 dark:border-amber-600/40 rounded-xl dark:shadow-[0px_0px_12px] dark:shadow-amber-600
           bg-stone-50 dark:bg-stone-900 px-[1.4%] py-[0.4%] w-[40%] shadow shadow-amber-500 focus:outline-0 focus:shadow-amber-400 
           focus:border-amber-300 " placeholder="Search..." 
           value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} 
           /> 

             {/**Recent Entries */}
        <div className=" flex flex-row justify-center items-center my-[4%] w-[80%] ">
          <div className="flex items-center justify-center gap-2  scale-x-[-1] mr-[5%]">
                <div className="w-2 h-2 rounded-full bg-amber-600/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600/30" />
                <div className="w-1 h-1 rounded-full bg-amber-600/20" />
          </div>
          <hr className="w-[16%] border-0 h-[0.1rem] bg-linear-to-r from-transparent to-amber-600/50 mx-[5%]"/>
          <div className="bg-amber-500/50 flex flex-row space-x-[3%] w-[20%] justify-center border-2 border-amber-500/50 text-xl items-center rounded-lg 
          py-[0.5%] text-amber-700/50 dark:text-amber-100 font-semibold  dark:bg-amber-700/90 dark:border-amber-600/80">
            <p>TOTAL ENTRIES</p>
            
          </div>
          
          <hr className="w-[16%] border-0 h-[0.1rem] bg-linear-to-l from-transparent to-amber-600/50 mx-[5%]"/>
          <div className="flex items-center justify-center gap-2 ml-[5%]">
                <div className="w-2 h-2 rounded-full bg-amber-600/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600/30" />
                <div className="w-1 h-1 rounded-full bg-amber-600/20" />
          </div>
          
        </div>

        <div className=" flex flex-row justify-end w-[66%] mb-[1%] items-center ">
          <p className=" mr-[2%] text-lg dark:text-amber-200 font-semibold text-amber-900">Sort by:</p>
         
          {/** Sort by dropdown menu*/}
          <Select
          
            value={sort}
            onChange={(e: SelectChangeEvent) => setSort(e.target.value)}
            sx={{
              textAlign:'center',
              width:'20%',
              backgroundColor: isDark ? "#1c1917" : "#fef3c7",
              color: isDark ? "#fde68a" : "#78350f",
              border:3,
              borderRadius: 4,
              borderColor:isDark ? "#fde68a" : "#78350f",
              fontWeight:600,

              "& .MuiSelect-icon": {
                  color: isDark ? "#fde68a" : "#78350f",
                },
              
              
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
                cursor:'pointer'
              },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
              "& .MuiSelect-select:focus": { outline: "none" },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDark ? "#1c1917" : "#fff7ed",
                  color: isDark ? "#fde68a" : "#7c2d12",
                  borderRadius: 3,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                     
                      cursor:'pointer'
                    },
                },
              },
            }}
          >
            <MenuItem
              value="newest"
              sx={{
                "&.Mui-selected": { backgroundColor: isDark ? "#92400e" : "#fbbf24" },
                "&.Mui-selected:hover": { backgroundColor: isDark?"#b45309": "#f59e0b" },
                "&:hover": { backgroundColor: isDark ? "#451a03" : "#fde68a" },
              }}
            >
              Newest to Oldest
            </MenuItem>
            <MenuItem
              value="oldest"
              sx={{
                "&.Mui-selected": { backgroundColor: isDark ? "#92400e" : "#fbbf24" },
                "&.Mui-selected:hover": { backgroundColor: isDark?"#b45309": "#f59e0b" },
                "&:hover": { backgroundColor: isDark ? "#451a03" : "#fde68a" },
              }}
            >
              Oldest to Newest
            </MenuItem>
            <MenuItem
              value="recently_updated"
              sx={{
                "&.Mui-selected": { backgroundColor: isDark ? "#92400e" : "#fbbf24" },
                "&.Mui-selected:hover": { backgroundColor: isDark?"#b45309": "#f59e0b" },
                "&:hover": { backgroundColor: isDark ? "#451a03" : "#fde68a" },
              }}
            >
              Recently Updated
            </MenuItem>

            <MenuItem
              value="last_updated"
              sx={{
                "&.Mui-selected": { backgroundColor: isDark ? "#92400e" : "#fbbf24" },
                "&.Mui-selected:hover": { backgroundColor: isDark?"#b45309": "#f59e0b" },
                "&:hover": { backgroundColor: isDark ? "#451a03" : "#fde68a" },
              }}
            >
              Last Updated
            </MenuItem>
          </Select>
        </div>

        {/** Entries*/}
        {entries?.length===0?(
           <p className=" text-amber-800 text-lg">No entries yet, create your first journal!</p> ):(loading||isLoading)?(
          <p className=" text-xl text-amber-900">
          Loading content...
        </p>
          ): error ? (<p className=" text-xl text-amber-900 dark:text-amber-100">
          Failed to load entries.
        </p>):filteredEntries.length>0?
        orderedEntries.map((entry)=>(
          <Card onSelect={()=>{setSelected(true); setCardInfo(entry);}} key={entry.id} entry={entry} width={70}/>
        )):
        entries!.length>0?(          
        <p className="text-amber-800 text-lg">No Entries found with "{searchTerm}" in it</p>):
          (
            <p className="text-amber-800 text-lg">No entries yet, create your first journal!</p>
          )
        }
        
    </div>
  )
}

export default TotalEntries
