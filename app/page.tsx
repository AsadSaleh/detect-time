import Image from "next/image";
import TimeCalculator from "./time-calculator";

const target = "Sat Jan 6, 2024 12:59 AM CET";

export default async function Home() {
  // await getTimezones();
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-10 md:pt-32 pb-10 bg-slate-300">
      <section className="text-center">
        <h1 className="text-2xl md:text-5xl">Global Time Detector</h1>
        <p className="text-lg mt-2 text-slate-700">
          Input your datetime in the input below. It will autodetect the result!
        </p>
      </section>
      <section className="mt-10 w-full md:w-1/2 mx-auto">
        <TimeCalculator />
      </section>
    </main>
  );
}
