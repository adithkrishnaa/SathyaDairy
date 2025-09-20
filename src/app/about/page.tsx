"use client"

import Image from "next/image";

export default function About() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold">About</h1>
      <Image
        src="/logo (4).png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </div>
  );
}
