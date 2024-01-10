/**
 * {
    "abbreviation": "WIB",
    "client_ip": "140.213.7.177",
    "datetime": "2024-01-10T11:51:27.544314+07:00",
    "day_of_week": 3,
    "day_of_year": 10,
    "dst": false,
    "dst_from": null,
    "dst_offset": 0,
    "dst_until": null,
    "raw_offset": 25200,
    "timezone": "Asia/Jakarta",
    "unixtime": 1704862287,
    "utc_datetime": "2024-01-10T04:51:27.544314+00:00",
    "utc_offset": "+07:00",
    "week_number": 2
}
 */

export type Timezone = {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: null;
  dst_offset: number;
  dst_until: null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
};

export type TimezoneStaticInfo = Pick<
  Timezone,
  "abbreviation" | "raw_offset" | "utc_offset" | "timezone"
>;
