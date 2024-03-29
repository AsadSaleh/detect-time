import fs from "node:fs/promises";
import { Timezone } from "../model";

// Create timezone map using the timezoneapi
// https://worldtimeapi.org/api/timezone

export async function POST() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone");
    let timezoneNames = (await res.json()) as string[];

    // Pick the first ten timezonNames
    // timezoneNames = timezoneNames.slice(0, 10);

    // For each timezone, get timezone detial from https://worldtimeapi.org/api/timezone/{timezone}
    const timezones: Timezone[] = [];
    for (const tzName of timezoneNames) {
      const res = await fetch(
        `https://worldtimeapi.org/api/timezone/${tzName}`
      );
      const timezoneDetail = (await res.json()) as Timezone;
      timezones.push(timezoneDetail);
    }

    // Write the timezones to a file
    await fs.mkdir("constant", { recursive: true });
    await fs.writeFile(
      "constant/timezone.json",
      JSON.stringify(timezones, null, 2)
    );

    return Response.json({ status: "success", data: timezones });
  } catch (error) {
    return Response.json({ status: "error", error });
  }
}
