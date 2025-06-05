import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Abi from "../contracts/Abi.json";
import { toast } from "sonner";


const contractAdd = "0x35862ecaae19f8fe988c8c43f0c3f8bdca21b56f";

const Login = ({ wallet }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    // console.log(window.ethereum.chainId)
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      if (window.ethereum.chainId === "0xaa36a7") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAdd, Abi.abi, signer);
          toast.success("Metamask 연결됨");
          setWalletConnected(true);
          wallet(provider, contract, signer.address);
          navigate("/Dashboard");
        } catch (error) {
          toast.error(error.message);
        }
      } else {
        toast.error("Sepolia 테스트 네트워크 선택 필요");
      }
    } else {
      toast.error("Metamask 설치 필요");
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-auto bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="invisible md:visible w-[80%] min-h-screen py-20 flex flex-col justify-center items-center flex-wrap">
        <div className="grid grid-rows-2 gap-8 w-[70%] max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-[#4263EB] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
             2025 Vote
            </h1>
            <div className="h-1 w-24 bg-[#4263EB] rounded-full"></div>
          </div>
          <div className="space-y-6">
            <p className="font-light text-xl md:text-2xl lg:text-3xl leading-relaxed text-slate-700 dark:text-slate-200">
              블록체인 기술을 활용한{" "}
              <span className="font-bold text-[#4263EB] dark:text-cyan-400">탈중앙화 투표 시스템</span>
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              2025 1학기 HKNU 블록체인 프로젝트
            </p>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen py-20 md:py-0 md:w-[48%] flex justify-center items-center absolute md:relative">
        <div className="bg-white w-[90%] md:w-[75%] p-8 md:p-12 flex flex-col justify-center items-center space-y-16 rounded-2xl dark:bg-slate-900 shadow-2xl dark:shadow-cyan-500/20 backdrop-blur-sm my-8">
          <div className="space-y-6 text-center">
           
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vote-icon lucide-vote mx-auto w-32 h-32 md:w-40 md:h-40"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
            
          </div>

          <div className="w-full max-w-xs">
            {walletConnected ? (
              <button className="w-full bg-[#4263EB] py-4 px-6 text-xl md:text-2xl rounded-xl text-white hover:bg-[#4e6dec] shadow-lg shadow-[#4e6dec]/30 transition-all duration-300 hover:shadow-[#4e6dec]/50 dark:hover:shadow-cyan-500/30 font-medium">
                지갑 연결됨
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="w-full bg-[#4263EB] py-4 px-6 text-xl md:text-2xl rounded-xl text-white hover:bg-[#4e6dec] shadow-lg shadow-[#4e6dec]/30 transition-all duration-300 hover:shadow-[#4e6dec]/50 dark:hover:shadow-cyan-500/30 font-medium"
              >
                지갑 연결
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;