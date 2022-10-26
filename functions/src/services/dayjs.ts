import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as tz from "dayjs/plugin/timezone";

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.tz.setDefault("Asia/Tokyo");

export const getNow = () => dayjs.tz(dayjs());
export default dayjs;
