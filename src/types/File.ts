import { Restriction } from "./Restriction";

export interface File {
  name: string;
  language: string;
  value: string;
  constrains?: Restriction[];
}

export interface CodeFile {
  name: string;
  language: string;
  source: string;
  constrains?: Restriction[];
}
