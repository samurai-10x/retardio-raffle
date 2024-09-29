"use client";

import EnterRaffle from "@/components/EnterRaffle";
import Hero from "@/components/Hero";
import Interact from "@/components/Interact";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <Interact /> */}
      <EnterRaffle />
    </main>
  );
}
