"use client";

import { timezoneList } from "@/constant/timezone";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { useState } from "react";
import { TimezoneStaticInfo } from "./model";
import CloseIcon from "./close-icon";

export default function TimeCalculator() {
  const [time, setTime] = useState("");

  function renderResult() {
    const detectedDatetimeResult = detectDatetime(time);
    const status = detectedDatetimeResult.status;

    // Display idle message when the input is empty
    if (time === "") {
      return (
        <div>
          <div className="mt-2">
            <p className="text-slate-600">Example:</p>
            <ul className="list-disc list-inside">
              <li>
                <button
                  className="cursor-pointer hover:font-semibold"
                  onClick={() => setTime("Sat Jan 6, 2024 12:59 AM CET")}
                >
                  Sat Jan 6, 2024 12:59 AM CET
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer hover:font-semibold"
                  onClick={() => setTime("21/02/1999")}
                >
                  21/02/1999
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer hover:font-semibold"
                  onClick={() => setTime("2024/12/12")}
                >
                  {" "}
                  2024/12/12
                </button>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    // Display error message if the datetime is invalid
    if (status === "error") {
      return <p className="text-lg mt-4">Invalid datetime</p>;
    }

    // Display error message if the datetime is invalid (NaN)
    const date = detectedDatetimeResult.data;

    if (date == null || isNaN(date.getTime())) {
      return <p className="text-lg mt-4">Invalid datetime</p>;
    }

    // Display the result (calcualte some variables first)
    const timezoneInfo = detectedDatetimeResult.timezoneInfo;

    const duration = intervalToDuration({
      start: new Date(),
      end: date,
    });

    const durationFromNow = formatDuration(duration, {
      format: ["years", "months", "days", "hours", "minutes"],
    });

    const distanceFromNow = formatDistanceToNow(date, {
      addSuffix: true,
      includeSeconds: true,
    });

    return (
      <div className="mt-10">
        <p className="text-green-700 font-bold text-2xl">Time Detected!</p>

        {/* The time with it's detail */}
        <div>
          {timezoneInfo?.timezone ? (
            <span>
              The time is in&nbsp;
              <span className="font-bold">
                {timezoneInfo?.timezone} ({timezoneInfo?.abbreviation})
              </span>
            </span>
          ) : (
            <span>The time contains no timezone information</span>
          )}
        </div>

        {/* In my local time */}
        <div className="mt-4 text-slate-500">In your local time:</div>
        <div className="text-2xl">
          <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {date.toLocaleDateString(undefined, { dateStyle: "full" })}
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">{date.toLocaleTimeString()}</p>
        </div>

        {/* Relative to me */}
        <div className="mt-4 ">
          <p className="text-slate-500">Relative to you:</p>
          <p className="text-2xl font-bold">Around {distanceFromNow}</p>
          <p>Exactly {durationFromNow}</p>
        </div>
      </div>
    );
  }
  return (
    <section>
      <div className="relative">
        <input
          className="p-4 rounded-xl border-slate-300 border w-full"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Input your datetime here..."
        />
        {true && (
          <button
            className="group absolute rounded-lg bg-slate-400 hover:bg-slate-600 active:scale-90 transition w-[30px] h-[30px] flex items-center justify-center top-[14px] right-[14px]"
            onClick={() => setTime("")}
          >
            <CloseIcon className="text-slate-600 group-hover:text-white" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">{renderResult()}</div>
    </section>
  );
}

type DetectDateTimeResult =
  | {
      status: "success";
      data: Date;
      timezoneInfo?: TimezoneStaticInfo;
    }
  | { status: "error"; data: null };

// Detect datetime from a random string format
function detectDatetime(str: string): DetectDateTimeResult {
  try {
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

    if (!timezoneCode) {
      return { status: "error", data: null };
    }

    // 2. convert the timezone code to timezone offset
    const timezoneInfo = getTimezoneInfoFromCode(timezoneCode);

    // 3. use zonedTimeToUtc to convert to utc
    const utcDate = new Date(
      dateStringWithoutTimezoneCode.concat(timezoneInfo.utc_offset)
    );

    // 4. return the utc date
    return { status: "success", data: utcDate, timezoneInfo };
  } catch (e) {
    return { status: "error", data: null };
  }
}

const timezoneCodeToInfoMap: Record<string, TimezoneStaticInfo> = {};
function initializeTimezoneCodeToInfoMap() {
  for (const timezone of timezoneList) {
    timezoneCodeToInfoMap[timezone.abbreviation] = timezone;
  }
}

function getTimezoneInfoFromCode(timezoneCode: string) {
  initializeTimezoneCodeToInfoMap();
  return timezoneCodeToInfoMap[timezoneCode];
}
