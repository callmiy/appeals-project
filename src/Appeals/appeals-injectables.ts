import { csvParse } from "d3-dsv";

// KPI1:Number of beneficiaries supported by the project (of which women and youths%)
// KPI2:Number of farmers adopting improved technologies with project support (disaggregated by gender)
// KPI3:Number of farmers reached with agricultural assets under the project (disaggregated by gender)
// KPI4: Total number of technologies, demonstrated and disseminated under the project (of which 50% climate and/or nutrition sensitive)

// The table to take care of KPIs 1-3 can look like: Name(ibrahim akinola), Age(31), Gender(male/female),improved tech(yes/no),received agricultural assets(yes/no)

// another table can take care of KPI4. May look like Technology Title(improved seedlings/fertilizer application/etc), Category(climate sensitive,nutrition sensitive,others)

export const headerMapping: HeaderMapping = {
  NAME: "name",
  GENDER: "gender",
  AGE: "age",
  SEGMENT: "segment",
  "RECEIVED ASSETS": "receivedAssets",
  "IMPROVED TECH": "improvedTech",
  "RECEIVED TRAINING": "receivedTraining"
};

export const GENDER_FEMALE_DATA = "Female";
export const GENDER_MALE_DATA = "Male";

export async function getCSVData() {
  try {
    const rawBinaries = await fetch("/lagos-appeals.csv");
    const textData = await rawBinaries.text();
    return csvParse(textData, d => {
      const data = Object.entries(d).reduce((acc, currentValue) => {
        const [k, value] = currentValue;
        const v = value as string;

        const newKey = headerMapping[k];
        const vLower = v.toLowerCase();

        let newValue = v as ValueOfMappedData;

        if (vLower === "yes") {
          newValue = true;
        } else if (vLower === "no") {
          newValue = false;
        }

        Object.defineProperty(acc, newKey, {
          value: newValue,
          writable: true
        });

        return acc;
      }, {} as MappedData);

      data.age = +data.age;
      return data;
    });
  } catch (e) {
    return [];
  }
}

////////////////////////// TYPES ////////////////////////////

export interface MappedData {
  name: string;
  gender: string;
  segment: string;
  receivedAssets: boolean;
  improvedTech: boolean;
  receivedTraining: boolean;
  age: number;
}

type KeyOfMappedData = keyof MappedData;
type ValueOfMappedData = MappedData[KeyOfMappedData];
type HeaderMapping = { [k: string]: KeyOfMappedData };