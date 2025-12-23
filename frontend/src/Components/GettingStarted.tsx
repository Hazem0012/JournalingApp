
import { BookOpen, Feather, PenLine, Hourglass, Book } from 'lucide-react';
import GettingStartedCard from '../HelperClasses/GettingStartedCard';
import {useNavigate} from 'react-router-dom';


function GettingStarted() {

  const penLine=<div className=' flex items-center justify-center rounded-full bg-amber-200 h-12 w-12 mt-[2%] mb-[1%] '>
                  <PenLine className=' text-amber-800' strokeWidth={2.5}/>
                  </div>

  const hourGlass=<div className=' flex items-center justify-center rounded-full bg-amber-200 h-12 w-12 mt-[2%] mb-[1%] '>
                  <Hourglass className=' text-amber-800' strokeWidth={2.5}/>
                  </div>

  const book=<div className=' flex items-center justify-center rounded-full bg-amber-200 h-12 w-12 mt-[2%] mb-[1%] '>
                  <Book className=' text-amber-800' strokeWidth={2.5}/>
                  </div>


const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); 

  };
  const handleSignUp = () => {
    navigate('/signup'); 
  };
  return (
    <div className='relative min-h-dvh cormorant-sc-regular flex flex-col justify-center items-center w-full'>
        <div className='absolute -z-10 inset-0 bg-linear-to-br from-amber-100/80 via-amber-50 to-amber-100/80'></div>
        <div className=' flex items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-amber-400 bg-amber-300 h-18 w-18 mt-[2%] mb-[1%] '>
            <BookOpen size={36} className=' text-amber-700 z-10' strokeWidth={2} />
        </div>
        
        <p className=' text-amber-800 font-semibold text-2xl '>Echos of Ink</p>
        <div className=' flex flex-row justify-center w-full my-[1%] items-center text-amber-700'>
            <hr className=' w-[7%] '/>
            <Feather size={26} className='mx-[1%]'/>
             <hr className=' w-[7%]'/>
        </div>
        
        <p className=' text-amber-900 text-lg italic'>Write what time cannot erase.</p>
        
        <div className=' flex flex-row space-x-[3%] justify-center w-[85%] my-[3%]'>
          <GettingStartedCard element={penLine} text1='Chronicle your days' text2='document your journey with elegance and grace.'/>
          <GettingStartedCard element={hourGlass} text1='Preserve Your Memories' text2='Keep your thoughts safe in a personal archive' />
          <GettingStartedCard element={book} text1='Reflect & Discover' text2='Search and revisit moments from your past'/>

        </div>
    

      <div className=' w-[50%] flex flex-col justify-center items-center p-[1%] border-2 rounded-3xl border-amber-900 shadow-lg shadow-amber-900 '>
        <p className='text-amber-7F00 text-2xl font-bold'>Begin Your Journey</p>
        <p className=' text-amber-900 italic '>Join fellow chroniclers in preserving the art of thoughtful reflection</p>
        <div className=' flex flex-row justify-center w-[80%] items-center space-x-[1%] py-[2%]'>
          <button onClick={handleSignUp}className=' w-[45%]  bg-amber-800 rounded-2xl p-[1.8%] text-amber-50 
          cursor-pointer hover:bg-amber-700 shadow-gray-400 shadow'> Begin Your Chronicles</button>

          <hr className=' w-[15%] text-amber-900'/>
          <p> or</p>
          <hr className=' w-[15%] text-amber-900'/>
          <button onClick={handleLogin} className='w-[45%]  bg-stone-800 rounded-2xl p-[1.8%] text-amber-50 cursor-pointer
           hover:bg-stone-700 hover:text-amber-100 shadow-gray-400 shadow'> Return to Archives</button>

        </div>
      </div>

      <p className=' italic text-amber-800 my-[1%]'>est. 2025</p>
    </div>
  )
}

export default GettingStarted
