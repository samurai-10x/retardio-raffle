"use client";

import { FC, useEffect, useState } from "react";
import { useAccount, useReadContract, useSendTransaction, useWaitForTransactionReceipt, useWriteContract, usePrepareTransactionRequest } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
// import { ethers } from 'ethers';
import { raffleAbi, raffleAddress } from "@/constants";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { parseEther } from "viem";

interface InteractProps {}

const Interact: FC<InteractProps> = ({}) => {
  const [entranceFee, setEntranceFee] = useState(0);
  const [players, setPlayers] = useState([]);
  const [recentWinner, setRecentWinner] = useState("");
  const [raffleState, setRaffleState] = useState("");

  const { data, isPending, writeContract } = useWriteContract();
  const { sendTransaction, data: hash } = useSendTransaction();
  const { isConnected } = useAccount();

  // Fetch entrance fee
  const { data: fee } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "getEntranceFee",
  });

  // Fetch players
  const { data: playerCount } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "getLengthOfPlayers",
  });

  // Fetch recent winner
  const { data: winner } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "getRecentWinner",
  });

  // Fetch raffle state
  const { data: state } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "getRaffleState",
  });

  //   useEffect(() => {
  //     if (fee) setEntranceFee(ethers.utils.formatEther(fee));
  //     if (playerCount) {
  //       const playersArray = [];
  //       for (let i = 0; i < playerCount; i++) {
  //         const player = await contract.methods.getPlayer(i).call();
  //         playersArray.push(player);
  //       }
  //       setPlayers(playersArray);
  //     }
  //     if (winner) setRecentWinner(winner);
  //     if (state) setRaffleState(state);
  //   }, [fee, playerCount, winner, state]);

  //   Enter Raffle Function





  async function enterRaffle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!isConnected) {
        toast.error("Wallet isn't connected, Please connect your wallet!");
        return;
      }
      const formData = new FormData(e.target as HTMLFormElement);
      const amount = formData.get("amount") as string;
      console.log(amount);

      
        writeContract({
          address: raffleAddress,
          abi: raffleAbi,
          functionName: "enterRaffle",
          args: [BigInt(amount)],
        });

    //   sendTransaction({
    //     to: raffleAddress,
    //     value: parseEther(amount),
    //   });
    } catch (error) {
      console.log(error);
      toast.error("Transaction Failed=>   " + error);
    }
  }

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending");
    }
    if (isConfirmed) {
      toast.success("Transaction Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/address/${hash}`);
          },
        },
      });
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirming, isConfirmed, error, hash]);

  return (
    <div>
      <h1>Interact with Raffle</h1>
      <p>Entrance Fee: {entranceFee} ETH</p>
      {/* <button onClick={enterRaffle}>Enter Raffle</button> */}
      <h2>Players:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <h2>Recent Winner: {recentWinner}</h2>
      <h2>Raffle State: {raffleState}</h2>

      <div className="flex flex-col gap-8">
        <span className="">Enter Raffle</span>

        <form onSubmit={enterRaffle}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input name="amount" placeholder="0.01" required />
            <Button disabled={isPending || isConfirming} type="submit">
              {isPending ? "Confirming..." : "Enter Raffle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Interact;
