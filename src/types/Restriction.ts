export interface Restriction {
  range: number[];
  label: string;
  allowMultiline?: boolean;
  validate?: (currentlyTypedValue: string, newRange: number[], info: any) => boolean;
}
