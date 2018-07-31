pragma solidity 0.4.20;


// we first want to make a facotry to store and deploy campaigns
contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign (uint minimum) public {
        //this creates a new contract instance which is deployed to the blockchain
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
        
    }
    // we want a function which returns entire array of deployed campaigns
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
    
}


contract Campaign {
    //we define our struct does not create an instance it is a new type we use semicolen to seperate
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping (address => bool) approvals;
       
    }
    
    // we make new array with type Request
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    //we want to use mapping with key of address and return bool public called approvals
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    // we want new modifier whic will only let manager call caertain functions
    // where we add restricted to a function there code will be applied where the _ lies
    // which will let only the manager call selected functions
    modifier restricted() {
        require(msg.sender == manager);
        _;
        
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        
    }
    
    // we want to be able to send money to the contract payable
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        // adds new key to approvers and gives a value of true
        // the address odes not get stored inside the mapping
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    // we want new struct  of type request and add it to the requests array
    function createRequest(string description, uint value, address recipient)
        public restricted {
            // to make sue the contributer has donated to campaign
            //require (approvers[msg.sender])
            Request memory newRequest = Request({
                // we want to set up key value pairs
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            });
            
            //we want to add the above request into our request array
            requests.push(newRequest);
        
        }
    
    function approveRequest(uint index) public {
        
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        // if this person has voted we want it to return true
        //if false we want to kick out
        require(!request.approvals[msg.sender]);
        
        //we want to add to approvals mapping and count
        // and make sure if person has voted he cannot approve again
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    } 
    
    //add function which only manager can call  once there are enough votes
    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index]; 
        
         //we want to make sure over 50% have votes 
        require(request.approvalCount > (approversCount / 2));
        
         // they need to specify which index he wants to finalize
        require(!request.complete);
        
        //we now want to take requested funds and send to reciepient
        request.recipient.transfer(request.value);
        
        request.complete = true;
    }

    // we want  to return statistics about the campaign
    function getSummary() public view returns (
        // the properties of the return values
        uint, uint, uint, uint, address

    ) {
        return (
            minimumContribution,  //uint
            this.balance,           //uint
            requests.length,        //uint
            approversCount,         //uint
            manager                //address

        );

    }

    function getRequestCount() public view returns (uint) {
        return requests.length;



    }
    
}