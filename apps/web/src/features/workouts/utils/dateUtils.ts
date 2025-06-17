import dayjs from "dayjs";

export const formatWorkoutDate = (date: string | Date) => {
  return dayjs(date).format('MMMM D, YYYY');
};