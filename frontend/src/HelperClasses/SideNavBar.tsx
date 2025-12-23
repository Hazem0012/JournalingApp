import { Library, Sparkles,BookMarked, CalendarDays, ArrowRight, PenLine, User, LogOut} from 'lucide-react';
import { logout } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';


interface props{
    openNewEntry : ()=>void;
    length:number;

}
function SideNavBar({length,openNewEntry}:props){
    const {user, setUser} = useAuth();

    const navigate = useNavigate();
        const handleLogout = async () => {
        await logout();
        setUser(null);
        navigate("/");
};

  return (
    <aside className="cormorant-sc-regular w-[20%] border-r-4 min-h-dvh items-center pt-[1%] border-amber-800/40 dark:border-stone-700/50 bg-linear-to-b from-amber-950 via-stone-900 to-neutral-950 
    dark:from-stone-950 dark:via-neutral-950 dark:to-stone-950 text-stone-100 flex flex-col shadow-2xl ">
    
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,119,6,0.15),0transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(120,53,15,0.1),transparent_50%)] pointer-events-none" />

        <div className="w-[90%] p-[5%] space-y-[15%]">
            <div className='  flex flex-row justify-start space-x-[7%] '>
                <div className="flex justify-center items-center w-[20%]  rounded-xl bg-linear-to-br from-amber-700/60 to-amber-900/40 border-2 border-amber-500/40 shadow-lg">
                    <Library className="w-7 h-7 text-amber-200" />
                </div>
                <div className='flex flex-col'>
                    <p>Personal Archive</p>
                    <p className='italic text-amber-400'>Echos of Ink</p>
                </div>
                

            </div>
           <div className='bg-stone-900 flex flex-col justify-start border-2 border-stone-950 rounded-2xl p-[6%]'>
                <p>Welcome, {user?.firstName}</p>
                <p className='italic text-amber-400 text-sm'>Continue your journey</p>
            </div>
        </div>
        

        <div className=' flex flex-row justify-center items-center my-[3%] w-[90%] text-amber-900 '>
            <hr className=' w-[20%] mx-[3%]' />
            <Sparkles className='text-amber-400' size={12}/>
            <p className=' text-amber-400 mx-[1%]'> ARCHIVES</p>
            <Sparkles className='text-amber-400 scale-x-[-1]' size={12} />
            <hr className=' w-[20%] mx-[3%]' />
        </div>

        
        {/** Total Entries */}
        <Link to={'/TotalEntries'} className='transition-all duration-100 ease-in-out border-2 border-transparent flex flex-row w-[90%] items-center space-x-[3%] py-[3%] rounded-2xl hover:bg-amber-800 cursor-pointer hover:text-amber-300 hover:border-2'>
            <div className=' ml-[7%] flex justify-center items-center w-[15%] py-[4%] rounded-xl bg-linear-to-br from-amber-700/60 to-amber-900/40 border-2 border-amber-500/40 shadow-lg '>
                <BookMarked className='text-amber-200' size={18}/>
            </div>
            <p className=' mr-[20%]'>
                Total Entries
            </p>
            <p className='bg-amber-900/40 border-2 border-amber-500/40 rounded-2xl py-[3%] w-[19%] items-center text-center text-amber-300'>
                {length}
            </p>
        </Link>

           {/** Calendar*/}
        <Link to={'/Calendar'} className='transition-all duration-100 ease-in-out border-2 border-transparent my-[2%] flex flex-row w-[90%] items-center space-x-[3%] py-[3%] rounded-2xl hover:bg-amber-800 cursor-pointer hover:text-amber-300 hover:border-2'>
            <div className='ml-[7%] flex justify-center items-center w-[15%] py-[4%] rounded-xl bg-linear-to-br from-amber-700/60 to-amber-900/40 border-2 border-amber-500/40 shadow-lg '>
                <CalendarDays className='text-amber-200' size={18}/>
            </div>
            <p className=' mr-[15.8%]'>
                Calendar View
            </p>
            <div className=' flex bg-amber-900/40 border-2 border-amber-500/40 rounded-2xl py-[4%] justify-center w-[19%] items-center text-amber-300'>
                <ArrowRight size={18}/>
            </div>
        </Link>

        <div className=' flex flex-row justify-center items-center mt-[10%] w-[90%] text-amber-900 '>
            <hr className=' w-[24.5%] mx-[3%]' />
            <Sparkles className='text-amber-400' size={12}/>
            <p className=' text-amber-400 mx-[1%]'> OTHER</p>
            <Sparkles className='text-amber-400 scale-x-[-1]' size={12} />
            <hr className=' w-[24.5%] mx-[3%]' />
        </div>

        <button onClick={openNewEntry} className='transition-all ease-in-out duration-100  focus:shadow-amber-300 flex flex-row justify-center items-center border-2 space-x-[5%] rounded-2xl w-[90%] py-[3%] my-[8%] cursor-pointer bg-amber-700 text-amber-200
         hover:bg-amber-600/90 '> 
            <PenLine  size={18}/>
            <p>New Entry</p>
         </button>

        <Link to={"/Settings"} className='transition-all ease-in-out duration-100  flex flex-row items-center justify-center space-x-[5%] border-2 rounded-2xl w-[90%] py-[3%] hover:bg-stone-700/90 cursor-pointer'> 
            <User size={18}/>
            <p >Profile and Settings</p>
        </Link>
        

        <button onClick={handleLogout} className='transition-all ease-in-out duration-100  flex flex-row justify-center items-center space-x-[3%] mt-[25%] border-amber-400 border-2 w-[90%] rounded-2xl py-[3%] font-extrabold text-amber-300 hover:bg-stone-800/70 cursor-pointer'>
            <LogOut size={18} />
            <p>LogOut</p> 
            </button>
    </aside>
  )
}

export default SideNavBar
