import fs from "node:fs/promises";
import { Timezone } from "../timezone-data-generator/route";

let timezones: Timezone[];

export async function getTimezones() {
  if (timezones == null) {
    // Read the timezone.json file
    const timezonesRaw = await fs.readFile("constant/timezone.json", "utf-8");
    const timezonesData = JSON.parse(timezonesRaw) as Timezone[];

    // Save the timezones to a variable
    timezones = timezonesData;

    return timezonesData;
  }

  return timezones;
}
