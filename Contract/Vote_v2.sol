// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Vote {
    address owner;
    address public electionCommission;
    address public winner;
    string public  votingStatus = "Voting has not started";


    event candidate(string _name,uint _candidateId,address _electionCommission, uint _pollId); //ADDED candiadate Id while emitting in this event
    event voter(string _name,uint _votedTo,address _voterAdd,address _electionCommission,uint _pollId);
    event EcWinner(PollInfo _info,address _electionCommission);
    
    struct Voter {
        string name;
        uint256 voterId;
        uint256 voteCandidateId;
        address voterAddress;
        uint256 pollID;     //ADDED
    }

    struct Candidate {
        string name;
        uint256 candidateId;
        address candidateAddress;
        uint256 votes;
        uint256 pollID;     //ADDED
    }

    struct PollInfo{
        uint pollId;
        string winnerName;
        address winnerAdd;
    }

    uint public nextPollId ;
    uint256 nextVoterId = 1;
    uint256 nextCandidateId = 1;
    uint256 public startTime;   //CHANGE:-have to change it to public cause i have to fetch time and show if voting has ended or not        //ADDED
    uint256 public endTime;      //CHANGE:- have to change to public same above reason      //ADDED
    mapping(uint256 => mapping(uint=>Voter)) voterDetails;    //ADDED 
    mapping(uint256 => mapping(uint => Candidate))  candidateDetails; //ADDED
    mapping(uint256 => mapping(address => bool)) checkVoting;       //ADDED
    mapping(uint256 => mapping(address => uint)) checkVoterId;       //ADDED
    mapping(uint => PollInfo[]) EcPolls;  //CHANGED ADDED instead of mapping(address => PollInfo[]) i did mapping(uint => PollInfo[]) cause i want to show previous poll id winner
    bool  stopVoting;
    // true means voting is on false means voting is in off

    constructor() {
        owner = msg.sender;
    }

    modifier isVotingOver() {
        require(endTime > block.timestamp || stopVoting == true, "Voting is over");
        _;
    }

    modifier votingNotStarted(){
        // require(endTime > block.timestamp,"Voting has not started or previous voting has ended"); //Oringinal
        require(endTime > block.timestamp,"Voting has not started, start a new Voting poll."); //CHANGE Voting already  //ADDED
        _;
    }

    function EcPollInfo()public view returns(uint,string memory,address){
    // function EcPollInfo()public view returns(uint){
        PollInfo storage poll = EcPolls[nextPollId][0];
        return (poll.pollId,
                poll.winnerName,
                poll.winnerAdd);
    }
    function candidateRegister(string calldata _name) votingNotStarted external  {
        candidateDetails[nextPollId][nextCandidateId] = Candidate(_name,nextCandidateId,msg.sender,0,nextPollId);
        emit candidate(_name,nextCandidateId,electionCommission,nextPollId);
        nextCandidateId++;
    }

    function candidateList() public view   returns(Candidate[] memory) {
        Candidate[] memory arr = new Candidate[](nextCandidateId - 1);

        for (uint256 i = 1; i < nextCandidateId; i++) {
            arr[i - 1] = candidateDetails[nextPollId][i];
        }
        return arr;
    }


    function voterRegister(string calldata _name) external  votingNotStarted returns (bool) {
        require(voterVerification(msg.sender), "You have already registered");
        voterDetails[nextPollId][nextVoterId] = Voter(_name,nextVoterId,0,msg.sender,nextPollId);  //ADDED
        checkVoterId[nextPollId][msg.sender] = nextVoterId;
        nextVoterId++;
        return true;
    }

    function voterVerification(address _person) internal view returns (bool) {
        Voter[] memory arr = new Voter[](nextVoterId - 1);

        for (uint256 i = 1; i < nextVoterId; i++) {
            arr[i - 1] = voterDetails[nextPollId][i];       //ADDED
        }
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i].voterAddress == _person) {
                return false;
            }
        }
        return true;
    }

    // function voterList() external view  returns (Voter[] memory) {
    //     Voter[] memory arr = new Voter[](nextVoterId - 1);
    //     for (uint256 i = 1; i < nextVoterId; i++) {
    //         arr[i - 1] = voterDetails[nextPollId][i];       //ADDED
    //     }
    //     return arr;
    // }

    function vote(uint256 _voterId, uint256 _id) external votingNotStarted  isVotingOver {
        require(block.timestamp > startTime,"Voting time has not begun yet");
        require(voterDetails[nextPollId][_voterId].voteCandidateId == 0,"You have already voted");
        require(voterDetails[nextPollId][_voterId].voterAddress == msg.sender,"You are not a voter");
        require(startTime != 0, "Voting has not started");
        voterDetails[nextPollId][_voterId].voteCandidateId = _id;
        checkVoting[nextPollId][msg.sender] = true;
        emit voter(voterDetails[nextPollId][_voterId].name, _id,msg.sender, electionCommission, nextPollId);
        candidateDetails[nextPollId][_id].votes++;
    }
// to check wheter i can vote once the time has been declared before the the starttime ;



    function result() external {
		    require(msg.sender == electionCommission,"You are not election commission");
        Candidate[] memory arr = new Candidate[](nextCandidateId - 1);
        arr = candidateList();
        
        // 최다 득표자 찾기
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        
        for(uint256 i = 0; i < arr.length; i++) {
            if(arr[i].votes > maxVotes) {
                maxVotes = arr[i].votes;
                winnerIndex = i;
            }
        }
        
        // 당선자 정보 저장
        winner = arr[winnerIndex].candidateAddress;
        EcPolls[nextPollId].push(PollInfo(
            nextPollId,
            arr[winnerIndex].name,
            arr[winnerIndex].candidateAddress
        ));
        
        // 이벤트 발생
        emit EcWinner(
            PollInfo(
                nextPollId,
                arr[winnerIndex].name,
                arr[winnerIndex].candidateAddress
            ),
            electionCommission
        );

        // 초기화
        electionCommission = address(0);
        nextVoterId = 1;
        nextCandidateId = 1;
        for(uint i=1;i<nextCandidateId;i++){
            delete candidateDetails[nextPollId][i];
        }   
        for(uint i=1;i<nextVoterId;i++){
            delete voterDetails[nextPollId][i];
        }    
        stopVoting = false;
        votingStatus = "Voting has ended";
    }

    function emergency() public {
        require(msg.sender == electionCommission,"You are not election commission");
        votingStatus = "Voting is ended";
        stopVoting = false; //Voting has off
        electionCommission = address(0);
        nextVoterId = 1;
        nextCandidateId = 1;
        for(uint i=1;i<nextCandidateId;i++){
            delete candidateDetails[nextPollId][i];     //ADDED [nextPollId]
        }
        for(uint i=1;i<nextVoterId;i++){
            delete voterDetails[nextPollId][i];     //ADDED [nextPollId]
        }  
    }
    // Checking if the person has voted and also registred 

    function checkVotedOrNot()public view returns(bool) {
        
        return checkVoting[nextPollId][msg.sender];
    }
    function checkVoterRegistered() public view returns(bool){
        for(uint i=1;i<nextVoterId;i++){
            if(msg.sender == voterDetails[nextPollId][i].voterAddress) {
                return true;
            }
        }
        return false;
    }
    function checkVoterID() public view returns(uint){            //ADDED
        if(checkVoterRegistered()==true ){
           return checkVoterId[nextPollId][msg.sender];
        }
        return 0;
    }

    function voteTime(uint256 _startTime, uint256 _endTime) external {
        // require(msg.sender == electionCommission,"You are not from Election Commision");
        // resetElectionCommission;
        // require(block.timestamp > endTime || stopVoting == false ,"Voting in progress");  //require checking if voting is over
        require(resetElectionCommission() == true);
        uint totalTime = _startTime + _endTime;
        require(totalTime <= 3600,"Time should be less than an hour, so that other developers could also use the Dapp");
        // require((_startTime>0 && _endTime > 0 || msg.sender == owner) ,"Time should be greater than 0");
        require((_startTime>0 && _endTime > 0 ) ,"Time should be greater than 0");
        electionCommission = msg.sender;

        for(uint i=1;i<nextCandidateId;i++){
            delete candidateDetails[nextPollId][i];     //ADDED [nextPollId]
        }
        for(uint i=1;i<nextVoterId;i++){
            delete voterDetails[nextPollId][i];     //ADDED [nextPollId]
        }  
        // for(uint i=0;i<nextPollId;i++){
            delete EcPolls[nextPollId];             //ADDED 
        // }
        stopVoting = true;  //Voting has begun
        startTime = block.timestamp + _startTime;
        endTime = startTime + _endTime;
        votingStatus = "Voting in progress";
        nextPollId ++;

    }


       function resetElectionCommission()public returns(bool) {
        require(stopVoting == false || block.timestamp > endTime || msg.sender == owner,"Previous voting in progress");
        electionCommission = address(0);
        stopVoting = false;
        votingStatus = "Voting has ended";
        startTime = 0;
        endTime = 0;
        nextVoterId = 1;
        nextCandidateId = 1;
        for(uint i=1;i<nextCandidateId;i++){
            delete candidateDetails[nextPollId][i]; //ADDED [nextPollId]
        }
        for(uint i=1;i<nextVoterId;i++){
            delete voterDetails[nextPollId][i];     //ADDED [nextPollId]
        } 
        return true; 
    }

}