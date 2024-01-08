import Image from "next/image";
import TimeCalculator from "./time-calculator";

const target = "Sat Jan 6, 2024 12:59 AM CET";

export default async function Home() {
  // await getTimezones();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full md:w-1/2 mx-auto">
        <TimeCalculator />
      </div>
    </main>
  );
}
