export const getSecondsDifferenceFromNow = (prevDate: Date) => {
  const currDate = new Date();
  const diffInMilliseconds = Math.abs(currDate.getTime() - prevDate.getTime());
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  return diffInSeconds;
};
