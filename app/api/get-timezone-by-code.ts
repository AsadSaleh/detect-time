import fs from "node:fs/promises";
import { Timezone } from "../timezone-data-generator/route";
import { getTimezones } from "../utils/get-timezones";

export async function GET(req: Request) {
  // Read the request query params "code"
  const code = new URLSearchParams(req.url.split("?")[1]).get("code");

  // Read the timezone.json file
  const timezones = await getTimezones();

  // Find the timezone with the given code
  const timezone = timezones.find(
    (tz) => tz.abbreviation.toUpperCase() === code?.toUpperCase()
  );

  return Response.json({ status: "success", data: timezone });
}
