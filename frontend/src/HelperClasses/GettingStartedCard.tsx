import type { ReactElement } from "react";

interface props{
    element:ReactElement;
    text1:string;
    text2:string;
}
function GettingStartedCard({element,text1, text2}:props) {
  return (
    <div className=' border-2 rounded-full flex flex-col justify-center items-center w-[50%] px-[3%] pb-[3%] pt-[1%] border-amber-300 shadow-md shadow-amber-700 space-y-[4%] '>
            {element}
            <p className=" text-2xl font-semibold text-amber-700 mt-[4%] mb-[3%]">{text1}</p>
            <p className=" font-extralight text-amber-950">{text2}</p>

          </div>
  )
}

export default GettingStartedCard