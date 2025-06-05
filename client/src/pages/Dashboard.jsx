import React from "react";
import Navigation from "./Navigation";
import List from "../components/List";
import UserCard from "../components/UserCard";
import ElectionCard from "../components/ElectionCard";
import Winner from "../components/Winner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ state, info, details, pIdEc, setinfo }) => {
  const [candidates, setCandidates] = useState([]);
  const [run, setRun] = useState(false);
  const navigate = useNavigate();

  const getPidEc = async () => {
    try {
      if (!state.contract) {
        console.error("컨트랙트가 연결되어 있지 않습니다");
        toast.error("스마트 컨트랙트에 연결되어 있지 않습니다. 로그인 페이지로 이동합니다.");
        navigate("/");
        return;
      }

      const pollId = Number(await state.contract.nextPollId());
      const electionCommission = await state.contract.electionCommission();
      console.log("Current Poll ID:", pollId);
      console.log("Current Election Commission:", electionCommission);
      details(pollId, electionCommission);
    } catch (error) {
      console.error("투표 정보를 가져오는 중 오류 발생:", error);
      if (error.message?.includes("user rejected")) {
        toast.error("트랜잭션이 거부되었습니다");
      } else {
        toast.error("투표 정보를 가져오는데 실패했습니다");
      }
    }
  };

  const getCandidates = async () => {
    try {
      if (!state.contract) {
        console.error("컨트랙트가 연결되어 있지 않습니다");
        return;
      }

      const candidateList = await state.contract.candidateList();
      console.log("Candidate List:", candidateList);
      setCandidates(candidateList);
      setRun(candidateList.length > 0);
    } catch (error) {
      console.error("후보 목록을 가져오는 중 오류 발생:", error);
      toast.error("후보 목록을 가져오는데 실패했습니다");
    }
  };

  useEffect(() => {
    // 컨트랙트 연결 상태 확인
    if (!state.contract || !state.signer) {
      console.error("컨트랙트 또는 지갑이 연결되어 있지 않습니다");
      toast.error("지갑 연결이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/");
      return;
    }

    getPidEc();
    getCandidates();
  }, [state.contract, state.signer]);

  return (
    <div className="flex h-[100%] space-x-12">
      <Navigation />
      <div className="p-4 w-full flex space-x-20 dark:text-slate-50">
        {/* Candidate detail cards starts */}
        <div className="w-[60%] h-[100%] p-4" id="UserVotingStatus">
          <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl">
            등록된 후보
          </h1>
          <div className="w-[100%] gap-4">
            {/* Candidate detail cards start here */}
            {run ? (
              <div className="flex flex-col gap-6 w-[90%] md:mb-10">
                {candidates.map((candidate, index) => {
                  return (
                    <List
                      state={state}
                      key={index}
                      name={candidate.name}
                      // party={candidate.party}
                      id={candidate.candidateId}
                      setValue={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-6 w-[90%] md:mb-10">
                <List setValue={false} />
              </div>
            )}
          </div>

          {/* Winner starts here */}
          <div className="w-[90%]">
            <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl">
              당선
            </h1>
            <Winner state={state} />
          </div>
        </div>

        {/* Election and user detail cards starts */}
        <div className="w-[35%] h-[100%] p-4 flex flex-col space-y-10" id="UserVotingStatus">
          <ElectionCard state={state} info={info} />
          <UserCard state={state} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;