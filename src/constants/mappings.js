export const PROGRAM_MAP = {
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_APP: "Mobile App",
};

export const SHIFT_MAP = {
  MORNING: "វេនព្រឹក",
  AFTERNOON: "វេនរសៀល",
};

export const SHIFT_SHORT_MAP = {
  MORNING: "ព្រឹក",
  AFTERNOON: "រសៀល",
};

export const GENDER_MAP = {
  MALE: "ប្រុស",
  FEMALE: "ស្រី",
};

export const YEAR_MAP = {
  YEAR_1: "ឆ្នាំទី 1",
  YEAR_2: "ឆ្នាំទី 2",
  YEAR_3: "ឆ្នាំទី 3",
  YEAR_4: "ឆ្នាំទី 4",
  YEAR_5: "ឆ្នាំទី 5",
};

export function formatKhmerDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("km-KH");
  } catch {
    return dateStr;
  }
}
