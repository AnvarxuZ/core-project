import { ref } from "vue";
import { useStore } from ".";
import { createPinia, setActivePinia } from "pinia";
import { useLayoutStore } from "./layout";
import { usePrimeVue } from "primevue/config";

setActivePinia(createPinia());
const default_format_date = useStore().default_format_date;

//-- set storage ---------------------------------------------------------------------
export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getStorage = (key) => {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
  return null;
};
//-- system translate phrase ---------------------------------------------------------
export const $t = (key, object = null) => {
  var phrases = getStorage("phrases") || [];
  if (key && !phrases.find((phrase) => phrase.word.trim() === key?.trim())) {
    let text = key.split("_").join(" ").trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  let obj_key = object ? Object.keys(object)[0] : null;
  let text = phrases.find((phrase) => phrase.word.trim() === key?.trim())?.translation || key;
  if (object && !Object.keys(object).find((k) => k == "no_replace")) {
    Object.keys(object).forEach((key) => {
      text = text.replace(`:${key}`, object[key]);
    });
  } else {
    text = text?.replace(/:[a-zA-Z0-9]+/g, "").trim();
    // text = text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }
  return text;
};
//-- months array --------------------------------------------------------------------
export const months = [
  { name: $t("january"), short: $t("jan"), name_date: $t("january_date") },
  { name: $t("february"), short: $t("feb"), name_date: $t("february_date") },
  { name: $t("march"), short: $t("mar"), name_date: $t("march_date") },
  { name: $t("april"), short: $t("apr"), name_date: $t("april_date") },
  { name: $t("may"), short: $t("may"), name_date: $t("may_date") },
  { name: $t("june"), short: $t("jun"), name_date: $t("june_date") },
  { name: $t("july"), short: $t("jul"), name_date: $t("july_date") },
  { name: $t("august"), short: $t("aug"), name_date: $t("august_date") },
  { name: $t("september"), short: $t("sep"), name_date: $t("september_date") },
  { name: $t("october"), short: $t("oct"), name_date: $t("october_date") },
  { name: $t("november"), short: $t("nov"), name_date: $t("november_date") },
  { name: $t("december"), short: $t("dec"), name_date: $t("december_date") },
];
//-- date time return -------------------------------------------------------------------
export const dateTime = (date) => {
  return new Date(date).toLocaleString(default_format_date, {
    hour: "numeric",
    minute: "numeric",
  });
};
//-- date formatter -------------------------------------------------------------------
export const DateFormatter = (date, format = "date") => {
  let returnDate = "";
  if (!date) return returnDate;
  if (format == "time") returnDate = dateTime(date);
  else if (format == "dateTime") returnDate = `${new Date(date).toLocaleDateString(default_format_date)}, ${dateTime(date)}`;
  else if (format == "month") returnDate = months[new Date(date).getMonth()].name;
  else if (format == "monthYear") returnDate = `${months[new Date(date).getMonth()].name} ${new Date(date).getFullYear()}`;
  else returnDate += new Date(date).toLocaleDateString(default_format_date);
  return returnDate;
};
//-- week array ----------------------------------------------------------------------
export const weeks = [
  { name: $t("sunday"), short: $t("sun"), sht: $t("su"), num: 0 },
  { name: $t("monday"), short: $t("mon"), sht: $t("mo"), num: 1 },
  { name: $t("tuesday"), short: $t("tue"), sht: $t("tu"), num: 2 },
  { name: $t("wednesday"), short: $t("wed"), sht: $t("we"), num: 3 },
  { name: $t("thursday"), short: $t("thu"), sht: $t("th"), num: 4 },
  { name: $t("friday"), short: $t("fri"), sht: $t("fr"), num: 5 },
  { name: $t("saturday"), short: $t("sat"), sht: $t("sa"), num: 6 },
];

//-- system check role and permission -------------------------------------------------
export const $assent = (text) => {
  const roles = useLayoutStore().roles;
  const permissions = useLayoutStore().permissions;
  if (roles.includes("superadmin")) return true;
  return roles.includes(text) || permissions.includes(text);
};

// form validation error message ------------------------------------------------------
export const $errMes = (err) => {
  let message = "";
  // console.log(err);
  if (err && err?.$errors?.length > 0) message = err.$errors[0].$message;
  else if (err && err?.$message) message = err.$message;
  message = message.toLocaleLowerCase().replace(/ /g, "_");
  return $t(message);
};

// convert size to human readable ------------------------------------------------------
export const convertSize = (size) => {
  if (size < 1024) return size + " B";
  else if (size < 1024 * 1024) return parseFloat((size / 1024).toFixed(1)) + " KB";
  else if (size < 1024 * 1024 * 1024) return parseFloat((size / 1024 / 1024).toFixed(1)) + " MB";
  else return parseFloat((size / 1024 / 1024 / 1024).toFixed(1)) + " GB";
};
//-- system check if value is boolean ---------------------------------------------
export const issetBool = (value) => {
  return typeof value === "boolean";
};

export const languages = getStorage("langs") || [];
