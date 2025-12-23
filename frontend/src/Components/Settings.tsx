import  { type FormEvent, useEffect } from 'react';
import { SettingsIcon, Sparkles, User, Sun, ArrowLeft, Moon, Trash2,X } from "lucide-react";
import Switch from '@mui/material/Switch';
import { Link, useNavigate } from "react-router-dom";
import { useAuth, } from '../AuthContext';
import { useState } from "react";
import api from '../api';
import { useTheme } from '../ThemeContext';

function Settings() {
  const {setUser, user,refreshUser} = useAuth();

 
    const [firstName,setFirstName]=useState<string>(user?.firstName ?? "");
    const [lastName,setLastName]=useState<string>(user?.lastName ?? "");
    const [email,setEmail]=useState<string>(user?.email ?? "");
    const [username,setUsername]=useState<string>(user?.username ?? "");
    const { isDark, setTheme, toggleTheme } = useTheme();
    const [locked, setLocked] = useState(true);
    const [del, setDel] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
      setFirstName(user?.firstName ?? "");
      setLastName(user?.lastName ?? "");
      setEmail(user?.email ?? "");
      setUsername(user?.username ?? "");
    },[user]);

    const handleSubmit = async(e: FormEvent) => { 
      e.preventDefault();
      
      
      try{
        const {data} = await api.put(`/users`,{"firstName":firstName,"lastName":lastName,"email":email});
        console.log(data)
        setUser(data);
        await refreshUser();
      }   
      
      catch (error){
        console.log(error);
      }
  }

  const handleDelete=async()=>{
    try{
      let response=await api.delete(`/users`);
      console.log(response.data);
      navigate('/');
    }
    catch(error){
      console.log(error);
    }
  }
  
  return (
    <div className=" w-full flex items-center flex-col bg-linear-to-r  from-amber-100/60 via-amber-100/90 to-amber-100/60 dark:from-stone-950 dark:via-stone-950 dark:to-black cormorant-sc-regular min-h-dvh">
      {/** Account deletion pop up*/}
      {del&&(
            <div className="fixed inset-0 w-full bg-black/50 bg-blend-color-burn z-10 min-h-dvh flex justify-center items-start">
      <div className="flex flex-col mt-[12%] border-2 rounded-2xl border-amber-200 w-[40%] bg-amber-200 p-[1.5%] space-y-[0.5%] dark:bg-stone-950">
        <div className="flex flex-row items-center space-x-[2%] relative">
          <h1 className=" text-2xl pr-[10%] dark:text-amber-100/80">Are you sure you want to delete this account?</h1>
          <X onClick={()=>setDel(false)} className="absolute right-[0%] cursor-pointer hover:text-amber-800 dark:text-amber-100/80 dark:hover:text-red-700/80"  />
        </div>
        

        <p className="whitespace-pre-line leading-relaxed mt-[3%] text-red-500/70  dark:text-red-400/80"> Deleting this account is would remove all entries permenantly</p>

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
        )
      }
      
    <Link to={"/me"} className=" flex flex-row items-center space-x-[1%] w-[25%] mt-[2%] text-amber-800 dark:text-amber-200 font-bold rounded-2xl text-xl cursor-pointer mr-[34%] hover:text-amber-700/70 dark:hover:text-amber-100/80 transition-colors duration-150 ease-in-out"> 
      <ArrowLeft size={19} strokeWidth={2.5}/>
      <p>Back to Journal</p>
     </Link>    
     
     {/**Top Section */}
    <div className=" mt-[2%] flex flex-col 
            justify-center items-center w-[70%] rounded-4xl space-y-[2%] py-[2%]">
          <div className=" mr-[2.5%] flex flex-row w-full items-center justify-center">
            <hr className="w-[13%] border-0 h-[0.1rem] bg-linear-to-r from-transparent to-amber-400/50 mx-[1%]"/>
            <div className="mr-[1%] p-[0.7%] rounded-xl bg-linear-to-br from-amber-100 to-amber-300/60 dark:from-amber-900/40 dark:to-amber-800/30 border-2 border-amber-400/50 dark:border-amber-600/30 shadow-md">
                      <SettingsIcon size={30} className="  text-amber-800/80 dark:text-amber-400" strokeWidth={2.0} />
            </div>
            <div className=" flex flex-col justify-center items-center">
              <h1 className="font-semibold text-amber-950/80 text-2xl dark:text-amber-500">Profile & Settings</h1>
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


        {/** Personal Information */}
         <div className=" border-[0.15rem] border-amber-800/80 dark:border-amber-200/40 rounded-2xl p-[3%] w-[60%] my-[2%] bg-white/70 dark:bg-stone-900/70 ">
            <div className=" flex flex-row space-x-[3%] items-center text-amber-900 dark:text-amber-100 font-semibold">
                <User size={24} strokeWidth={2.5}/>
                <h1 className="text-xl dark:text-amber-100">Personal Information</h1>    
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col my-[2%] ">
                <label className=" text-amber-950/80 dark:text-amber-100 ml-[0.2%] mb-[0.4%] font-semibold" >First Name</label>
                <input  disabled={locked} className="disabled:opacity-60  transition-all ease-in-out duration-200 focus:outline-0 focus:border-amber-400/80 focus:shadow focus:shadow-amber-300 px-[1.2%] border-2  border-amber-700/80 dark:border-amber-200/50 dark:bg-stone-800 dark:text-amber-100 rounded-lg mb-[1%]" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                <label className=" text-amber-950/80 dark:text-amber-100 ml-[0.2%] mb-[0.4%] font-semibold">Last Name</label>
                <input disabled={locked} className="disabled:opacity-60 transition-all ease-in-out duration-200 focus:outline-0 focus:border-amber-400/80 focus:shadow focus:shadow-amber-300 px-[1.2%] border-2  border-amber-700/80 dark:border-amber-200/50 dark:bg-stone-800 dark:text-amber-100 rounded-lg mb-[1%]" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                <label className=" text-amber-950/80 dark:text-amber-100 ml-[0.2%] mb-[0.4%] font-semibold">Email Address</label>
                <input disabled className="disabled:opacity-60 transition-all ease-in-out duration-200 focus:outline-0 focus:border-amber-400/80 focus:shadow focus:shadow-amber-300 px-[1.2%] border-2  border-amber-700/80 dark:border-amber-200/50 dark:bg-stone-800 dark:text-amber-100 rounded-lg mb-[1%]" value={email}/>
                <label className=" text-amber-950/80 dark:text-amber-100 ml-[0.2%] mb-[0.4%] font-semibold">Username</label>
                <input disabled className="disabled:opacity-60 transition-all ease-in-out duration-200 focus:outline-0 focus:border-amber-400/80 focus:shadow focus:shadow-amber-300 px-[1.2%] border-2  border-amber-700/80 dark:border-amber-200/50 dark:bg-stone-800 dark:text-amber-100 rounded-lg mb-[1%]" value={username}/>
                
                <div className=" flex flex-row justify-center items-center mt-[4%] space-x-[2%] ">
                    <hr className="border-0 w-[80%] h-[0.1rem] bg-linear-to-r from-transparent to-amber-900 dark:to-amber-400" />
                    <button onClick={()=>setLocked(!locked)}type='submit' className=" bg-amber-900 text-amber-100 cursor-pointer p-[1%] w-[17%] rounded-xl 
                     hover:bg-amber-800 hover:text-amber-100/90 dark:bg-amber-400 dark:text-amber-900 dark:hover:bg-amber-500 dark:hover:text-amber-950"> {locked?"Make Changes":"Save Changes"} </button>

                </div>
            </form>  
        </div>


        {/**Appearance */}
        <div className=" border-[0.15rem] border-amber-800/80 dark:border-amber-200/40 rounded-2xl w-[60%] p-[3%]  bg-white/70 dark:bg-stone-900/70">
            <div className="flex flex-row space-x-[3%] items-center text-amber-900 dark:text-amber-100 font-semibold">
              {isDark?
                <Moon size={20} strokeWidth={2.5}/>
              :
                <Sun size={20} strokeWidth={2.5}/>}
                <h1 className="text-xl"> Appearance</h1>
            </div>
            <div className=" flex flex-row my-[2%] p-[1%]  rounded-2xl justify-between items-center px-[3%] bg-stone-500/50 dark:bg-stone-800/70 text-amber-900 dark:text-amber-100">
                <p className=" text-lg">{isDark ? "Dark mode is on" : "Switch to dark mode"}</p>  
                <Switch
                  sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': 
                        {
                          color: '#ff9900',      
                        },'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff9900',   // track color when checked
                        },
                  }}  
                  checked={isDark}
                  onChange={(_, checked)=>setTheme(checked ? "dark" : "light")}
                  onKeyDown={(event)=>{
                    if(event.key === "Enter" || event.key === " "){
                      event.preventDefault();
                      toggleTheme();
                    }
                  }}
                />      
            </div>
        </div>

        {/** Delete User */}

        <div className=" border-[0.15rem] border-amber-800/80 dark:border-amber-200/40 rounded-2xl p-[3%] w-[60%] my-[2%] bg-white/70 dark:bg-stone-900/70 ">
            <div className=" flex flex-row space-x-[3%] items-center text-amber-900 dark:text-amber-100 font-semibold">
                <Trash2 size={24} strokeWidth={2.5}/>
                <h1 className="text-xl dark:text-amber-100">Delete Account</h1>    
            </div>
            <p className=' text-amber-800/70 dark:text-stone-100/70 text-light italic mt-[1%] mx-[5%]'>This action is irreversible</p>
                 <div className=" flex flex-row justify-center items-center mt-[1%] space-x-[2%] ">
                    <hr className="border-0 w-[80%] h-[0.1rem] bg-linear-to-r from-transparent to-amber-900 dark:to-red-400" />
                    <button onClick={()=>setDel(true)}type='submit' className=" bg-amber-900 text-amber-100 cursor-pointer p-[1%] w-[17%] rounded-xl 
                     hover:bg-amber-800 hover:text-amber-100/90 dark:bg-red-400 dark:text-amber-900 dark:hover:bg-red-500 dark:hover:text-red-900"> Delete </button>

                </div>
        </div>

    </div>
  )
}

export default Settings
