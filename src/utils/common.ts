/* eslint-disable @typescript-eslint/no-explicit-any */

export const formatTo12Hour = (timeStr: string) => {
  if (!timeStr) return "";
  const [hourStr, minStr = "00"] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const min = minStr.padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${min} ${ampm}`;
};

export const getValueFromKeyValue = (key: string, nodeData: { [key: string]: any } | undefined) => {
  return nodeData?.properties.find((property: { key: string; value: string }) => property.key === key)
    ?.value;
};