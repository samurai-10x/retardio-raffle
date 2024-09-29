"use client";

import { FC, useEffect, useState } from "react";
import { useAccount, useReadContract, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { raffleAbi, raffleAddress } from "@/constants";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { parseEther, formatEther } from "viem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EnterRaffleProps {}

const schema = z.object({ amount: z.string().min(1, "Please enter a value!") });

type FormData = z.infer<typeof schema>;

const EnterRaffle: FC<EnterRaffleProps> = ({}) => {
  const [entranceFee, setEntranceFee] = useState<any>();
  const [players, setPlayers] = useState<any>();
  const [recentWinner, setRecentWinner] = useState<any>();
  const [raffleCurrentState, setRaffleCurrentState] = useState<any>();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isConnected } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Use the hook directly in the component

  //   get entranceFee
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
  const { data: raffleState } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "getRaffleState",
  });

  useEffect(() => {
    if (fee) {
      setEntranceFee(formatEther(BigInt(fee)));
    }
    if (playerCount) {
      setPlayers(playerCount);
    }
    if (winner) {
      setRecentWinner(winner);
    }
    if (raffleState) {
      setRaffleCurrentState(raffleState);
    }
  }, [fee, playerCount, winner, raffleState]);

  const onSubmit = (data: FormData) => {
    console.log(data.amount);
    console.log(parseEther(data.amount));

    try {
      writeContract({
        address: raffleAddress,
        abi: raffleAbi,
        functionName: "enterRaffle",
        args: [parseEther(data.amount)], // Convert to BigInt after parsing to Ether
      });

      //   toast.success("Successfully entered Raffle!");
    } catch (error: any) {
      toast.error("Transaction Failed: " + error);
      console.log("Transaction Failed: " + error);
    }
  };

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
    <div className="flex flex-col gap-8">
      <span className="text-[24px] leading-[43.2px] font-light tracking-[6%] text-white font-laila">
        {`it cost ${entranceFee} ETH to enter Raffle`}
      </span>

      <span className="text-[24px] leading-[43.2px] font-light tracking-[6%] text-white font-laila">
        {`${recentWinner} is the previous Raffle winner`}
      </span>
      <span className="text-[24px] leading-[43.2px] font-light tracking-[6%] text-white font-laila">
        {`There're ${players} players in the Raffle`}
      </span>
      <span className="text-[24px] leading-[43.2px] font-light tracking-[6%] text-white font-laila">
        {`the Raffle is currently ${raffleCurrentState}`}
      </span>

      <div className="flex flex-col gap-8">
        <span className="text-[24px] leading-[43.2px] font-light tracking-[6%] text-white font-laila">Enter Raffle</span>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="0.01" type="text" {...register("amount")} />
            {errors.amount && <p className="text-red-500 mt-2">{errors.amount.message}</p>}
            <Button type="submit">Enter</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterRaffle;
