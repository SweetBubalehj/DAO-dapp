export const Address = "0xAdF129A5b54cE5Bc35B860992D0517F3605167c6";

export const ABI = [
  {
    inputs: [{ internalType: "address", name: "_sbtAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "_title", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "_chairPerson",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_votingAddress",
        type: "address",
      },
    ],
    name: "VotingsDeployed",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_addr", type: "address" }],
    name: "changeAddrContr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string[]", name: "proposalNames", type: "string[]" },
      { internalType: "uint256", name: "durationMinutes", type: "uint256" },
      { internalType: "bool", name: "isKYC", type: "bool" },
      { internalType: "bool", name: "isPrivate", type: "bool" },
    ],
    name: "createVoting",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeployedVotings",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSBTAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "votingAddress", type: "address" },
    ],
    name: "getVotiongWinnerName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
