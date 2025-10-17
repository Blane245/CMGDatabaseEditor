import {
  Attribute
} from "types";
import Item from "./item";

// contains the name, type, tags, and items that define a sequence
export default class Sequence {
  name: string = "";
  type: Attribute;
  tags: string = "";
  items: Item[] = [];
  constructor(type: Attribute) {
    this.type = type;
  }
  encode(): string {
    return JSON.stringify(this.items);
  }
  decode(input: string) {
    this.items = JSON.parse(input);
  }
}