import { BookOpen,Feather } from 'lucide-react';

import { useState, type FormEvent } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../api';
import axios from 'axios';

function SignUpPage() {
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const[errorMessage,setErrorMessage] = useState("")

  const navigate=useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();


    if (!firstName.trim() ||!lastName.trim() || !email.trim() || !username.trim() || !password.trim()){
        setErrorMessage("No Empty Values are Allowed!");
        return;
      }
    
    try{
      let response= await api.post('/users', {"firstName":firstName, "lastName":lastName, "email":email,"username":username, "password":password}, { skipAuth: true })
      console.log(response);
      navigate('/login');
    }
    catch (error){
      
      if (axios.isAxiosError(error) && error.response){
        setErrorMessage(error.response?.data.detail ?? "Something Went Wrong.");
      }
      else{
        setErrorMessage("Network Error, please try again.")
        console.log(error);
      }
    }

  }

  return (
    <div className="relative min-h-dvh flex flex-col justify-center items-center cormorant-sc-regular">
      {/**Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1615800098746-73af8261e3df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcGFwZXIlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MTkzOTk4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      <div className=" absolute inset-0 bg-linear-to-b from-amber-950/75 via-amber-900/65 to-stone-900/75 -z-10" />

        {/**Header */}
        
        <div className=' flex flex-row justify-center w-full mb-[1%] items-center text-amber-500 mt-[1%]'>
            <hr className=' w-[7%] '/>
            <Feather size={26} className='mx-[1%]'/>
             <hr className=' w-[7%]'/>
        </div>
        <p className=' text-amber-100 font-semibold text-2xl '>Echos of Ink</p>


        {/**Form Section */}
      <div className="flex flex-col space-y-[1%] w-[25%] mt-[1%] justify-center items-center border-2 bg-linear-to-b
       from-amber-100  to-amber-50 rounded-2xl border-amber-700 py-[2%] shadow-md shadow-amber-950 ">
        
        <div className=' flex items-center justify-center rounded-full bg-amber-600 h-16 w-16 mt-[2%] mb-[1%] '>
            <BookOpen size={32} className=' text-amber-900 z-10' strokeWidth={2} />
        </div>
        <h1 className=' text-2xl  text-amber-950'>Create Your Account</h1>
        <form onSubmit={handleSubmit} onChange={()=>setErrorMessage("")} className='flex flex-col w-[80%] my-[3%]'>
                <label className=' text-amber-950'>First Name</label>
                <input className="border-2 rounded-xl border-amber-700 mb-[3%] px-[2%]" 
                placeholder='Enter Your First Name...' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label className=' text-amber-950'>Last Name</label>
                <input className="border-2 rounded-xl border-amber-700 px-[2%] mb-[3%]" placeholder='Enter Your Last Name...' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
           
                <label className=' text-amber-950'>Email</label>
                <input className="border-2 rounded-xl border-amber-700 px-[2%] mb-[3%]" placeholder='Enter Your Email...' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className=' text-amber-950'>Username</label>
                <input className="border-2 rounded-xl border-amber-700 mb-[3%] px-[2%]" placeholder='Enter Your Username...' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <label className=' text-amber-950'>Password</label>
                <input className="border-2 rounded-xl border-amber-700 mb-[3%] px-[2%]" placeholder='Enter Your Password...' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                
                  <p className={` my-[1%] text-red-600/60 transition-opacity duration-250 ease-in-out ${
                            errorMessage ? "opacity-100" : "opacity-0"
                        }`}> {errorMessage}</p>
                
                
                <button type='submit' className=' border-2 rounded-lg mt-[4%] cursor-pointer bg-amber-950 hover:bg-amber-900 text-amber-50 hover:text-amber-100 py-[2%]'> Submit</button>
        </form>

        <hr className='w-[80%] text-amber-700'/>
        <span className=' flex flex-row w-[80%] justify-center '>
            <p> Already have an account? </p>
            <Link to='/login' className='text-amber-950 underline ml-[2%] hover:text-amber-800 cursor-pointer '> SignIn</Link>
        </span>
        
       
      </div>
    </div>
  )
}

export default SignUpPage
