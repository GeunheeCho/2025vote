import React from "react";
import { useEffect, useState } from "react";

const Card = ({ state}) => {
  const [register, setRegister] = useState();
  const [voted, setVoted] = useState();
  const [voterId,SetVoterId] = useState()

  const voterRegisteredCheck= async ()=> {
    try {
      const check = await state.contract.checkVoterRegistered();
      setRegister(check);
    } catch (error) {
      console.log(error);
    }
  }

  const votedOrNot = async()=> {
    try {
      const check = await state.contract.checkVotedOrNot();
      setVoted(check);
    } catch (error) {
      console.log(error);
    }
  }

  const checkVoterid= async ()=>{
    try {
      // const id = await state.contract.checkVoterID();
      const id = Number(await state.contract.checkVoterID());
      // console.log(id)
      SetVoterId(id);
    } catch (error) {
      console.log(error);
    }
  }
  
  const seNullVoterId = ()=>{
    return "N/A"
  }

  useEffect(() => {
    voterRegisteredCheck();
    votedOrNot();
    register ? checkVoterid():seNullVoterId();
  }, [voted,register,voterId]);

  return (
    <div className="w-[90%]  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
      <div className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900">

        <div className="grid grid-flow-col grid-rows-4 gap-4 items-center justify-start">

          <div className="col-span-3 ">
                <p className="ml-[36%] text-md font-semibold tracking-wide ">투표자 상태</p>
          </div> 

          <div className="col-span-3 flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-600  dark:text-gray-400 tracking-wide">
                    등록 여부:
                </h3>
                {register ? (
                <span className="text-sm font-light tracking-wide text-[#2ABB94]">
                    투표자 등록 
                </span>
                ) : (
                <span className="text-sm font-light tracking-wide text-[#F784AD]">
                    투표자 등록 안됨
                </span>
                )}
          </div>


          <div className="col-span-3 flex  items-center gap-2 ">
                <h3 className="text-sm font-medium text-gray-600  dark:text-gray-400 tracking-wide">
                 투표 여부:
                </h3>
                {voted ? (
                <span className="text-sm font-light tracking-wide text-[#2ABB94]">
                    O
                </span>
                ) : (
                <span className="text-sm font-light tracking-wide text-[#F784AD]">
                    X
                </span>
                )}
          </div>



        </div>
      </div>
    </div>
  );
};

export default Card;
