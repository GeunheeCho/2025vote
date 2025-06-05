import React from 'react'
import Navigation from "./Navigation"
import  { toast } from 'sonner';


const ElectionCommission = ({state}) => {

  
    const handleElection = async(event)=>{
        event.preventDefault()
        const start = 1
        const end = document.querySelector("#endT").value
        const date  = new Date()
        try{
          const tx =  await state.contract.voteTime.send(start, end)
          await tx.wait()
          toast.success("투표가 시작되었습니다" ,{description:`${date.toString().slice(0,3)}, ${date.toString().slice(4,7)} ${date.getDate()} at ${date.toLocaleTimeString()} `})
        
        }catch(error){
          console.error(error)
          toast.error(error.reason)
        }

        console.log(start, end)
    }

    const handleEmergency = async()=>{
      try{
        await state.contract.emergency()
        toast.success("긴급 상황이 발생했습니다")
      }catch(error){
        console.error(error)
        toast.error(error.reason)
      }
    }


    const handleResult = async()=>{
      try{
        await state.contract.result()
        toast.success("결과가 공개되었습니다")
      }catch(error){
        console.error(error)
        toast.error(error.reason)
      }
    }

return (
    <div className='flex  h-[100%]  space-x-12 '>
        <Navigation />
        
        <div className="w-[60%] h-[70%]">


            <div className="flex flex-col justify-center items-center mt-[10%]">
                <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">
                    투표 시간 입력 (초)
                </h1>
                {/* Form starts of Vote time */}
                <form className="grid grid-rows-2 grid-flow-col gap-10" onSubmit={handleElection}>

                    <div className="grid grid-rows-2 grid-flow-col gap-10">
                        {/* <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                            <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder="몇 초 후 투표 시작" name="" id="startT" ></input>
                        </div> */}

                        <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                            <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder="몇 초 후 투표 종료" name="" id="endT"  ></input>
                        </div>
                    </div>

                    <div className='rounded-3xl '>
                        <button className="relative inline-flex ml-32 items-center justify-center  p-0.5 rounded-full  mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900  group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all  duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]" type='submit'>
                          <span className="relative px-5 py-2 transition-all rounded-calc(1.5rem- 1px)] ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                              투표 시작
                          </span>
                        </button> 
                    </div>
                </form>

                {/* Form ends here Of Vote Time  */}

                {/* Emergency and Result buttons starts here */}

                <div className='flex justify-around items-center'>
                  <button onClick={handleEmergency} className=" text-red-600 hover:text-white border border-red-600  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 hover:bg-red-600 shadow-2xl transition-all ease-in-out" type='submit'>Emergency</button>

                  <div className='rounded-3xl '>
                          <button onClick={handleResult} className="relative inline-flex ml-32 items-center justify-center  p-0.5 rounded-full  mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900  group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all  duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]" type='submit'>
                            <span className="relative px-5 py-2 transition-all rounded-calc(1.5rem- 1px)] ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                              결과 공개
                            </span>
                          </button> 
                    </div>
                </div>

                {/* Emergency and Result buttons ends here */}
            
            </div>
            {/* voting  time ends */}

            
        </div>
      </div>
  )
}

export default ElectionCommission