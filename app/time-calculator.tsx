"use client";

import { useState } from "react";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";

export default function TimeCalculator() {
  const [time, setTime] = useState("Sat Jan 6, 2024 12:59 AM CET");

  function renderResult() {
    const detectedDatetimeResult = detectDatetime(time);
    const status = detectedDatetimeResult.status;
    if (status === "error") {
      return <p className="text-2xl font-bold">Invalid datetime</p>;
    }
    const date = detectedDatetimeResult.data;

    if (date == null || isNaN(date.getTime())) {
      return <p className="text-2xl font-bold">Invalid datetime</p>;
    }

    const duration = intervalToDuration({
      start: new Date(),
      end: date,
    });

    const message = formatDuration(duration, {
      format: ["years", "months", "days", "hours", "minutes", "seconds"],
    });

    const distance = formatDistanceToNow(date, {
      addSuffix: true,
      includeSeconds: true,
    });

    return (
      <div>
        <p className="text-green-700 font-bold">Detected!</p>
        <div>
          In your local time: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
        <div>
          <p className="text-2xl font-bold">
            date: {date.toLocaleDateString(undefined, { dateStyle: "full" })}
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">
            time: {date.toLocaleTimeString()}
          </p>
        </div>
        <div>
          <p>Relative to you:</p>
          <p className="text-2xl font-bold">Around {distance}</p>
          <p>Exactly {message}</p>
        </div>
      </div>
    );
  }
  return (
    <section>
      <input
        className="p-4 rounded-xl border-slate-300 border w-full"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <div className="flex flex-col gap-2">{renderResult()}</div>
    </section>
  );
}

type DetectDateTimeResult =
  | {
      status: "success";
      data: Date;
    }
  | { status: "error"; data: null };

// Detect datetime from a random string format
function detectDatetime(str: string): DetectDateTimeResult {
  try {
    console.log("STARTED");
    const date = new Date(str);
    if (date instanceof Date && !isNaN(date.getTime())) {
      return { status: "success", data: date };
    }

    // Try to detect date from a string with regex (YYYY-MM-DD)
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const dateMatch = str.match(dateRegex);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return { status: "success", data: new Date(`${year}-${month}-${day}`) };
    }

    // Try to detect date from a string with regex (DD/MM/YYYY)
    const dateRegex2 = /(\d{2})\/(\d{2})\/(\d{4})/;
    const dateMatch2 = str.match(dateRegex2);
    if (dateMatch2) {
      const [, day, month, year] = dateMatch2;
      return { status: "success", data: new Date(`${year}-${month}-${day}`) };
    }

    // Custom matcher for "Sat Jan 6, 2024 12:59 AM CET"
    // do it this way:
    // 1. match the timezone code
    const splittedString = str.split(" ");
    const dateStringWithoutTimezoneCode = splittedString.slice(0, -1).join(" ");
    const timezoneCode = splittedString.at(-1);

    console.log({
      dateStringWithoutTimezoneCode,
      timezoneCode,
    });

    if (!timezoneCode) {
      return { status: "error", data: null };
    }

    // 2. convert the timezone code to timezone offset
    const offset = getTimezoneOffsetFromCode(timezoneCode);
    console.log(offset);

    // 3. use zonedTimeToUtc to convert to utc
    const utcDate = new Date(dateStringWithoutTimezoneCode.concat(offset));

    console.log({ utcDate });

    // 4. return the utc date
    return { status: "success", data: utcDate };
  } catch (e) {
    console.log("errornya ini: ", e);
    return { status: "error", data: null };
  }
}

function getTimezoneOffsetFromCode(timezoneCode: string) {
  const timezoneMap: Record<string, string> = {
    CET: "+01:00",
    CEST: "+02:00",
    EST: "-05:00",
    EDT: "-04:00",
  };
  return timezoneMap[timezoneCode];
}
