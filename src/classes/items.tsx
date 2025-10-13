import { randomId } from "@mui/x-data-grid-generator";
import {
  AttackValue,
  Attribute,
  AttributeValue,
  ErrorMessages,
  ItemProperties,
  NoteValue,
  PanValue,
  SpeedValue,
  VolumeValue,
} from "../types";
import checkNote from "utils/checknote";

export class Item {
  id: string;
  type: Attribute = Attribute.none;
  constructor(type: Attribute, id?: string) {
    if (id) this.id = id;
    else this.id = randomId();
    this.type = type;
  }
  validate(_item: AttributeValue): ErrorMessages {
    return [];
  }
  copy(): Item {
    return new Item(this.type);
  }
  setAttribute(name: string, value: string) {
    if (name == "id") this.id = value;
    if (name == "type") this.type = Attribute[value];
  }
  static getProperties(): ItemProperties {
    return {
      type: Attribute.none,
      class: Item,
      name: "Item",
      attributes: [],
    };
  }
  getAttributes(): {} {
    return {};
  }
}
export class NoteItem extends Item {
  note: string;
  beats: number;
  constructor(note: string, beats: number, id?: string) {
    super(Attribute.note, id);
    this.note = note;
    this.beats = beats;
  }

  override validate(item: NoteValue): ErrorMessages {
    const errors: string[] = [];
    if (!checkNote(item.note)) errors.push("note is not in proper format");
    if (item.beats <= 0) errors.push("note duration must be greater than zero");
    return errors;
  }
  override copy(): NoteItem {
    const n: NoteItem = new NoteItem(this.note, this.beats, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "note") this.note = value;
    if (name == "beat") this.beats = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "note",
      class: NoteItem,
      type: Attribute.note,
      attributes: [
        { name: "note", dataType: "string", title: "Note", units: "" },
        {
          name: "beats",
          dataType: "number",
          title: "Beats",
          units: "",
          min: 0 + Number.EPSILON,
        },
      ],
    };
  }
}

export class SpeedItem extends Item {
  BPM: number;
  time: number;
  constructor(BPM: number, time: number, id?: string) {
    super(Attribute.speed, id);
    this.BPM = BPM;
    this.time = time;
  }

  static validate(item: SpeedValue): string[] {
    const errors: string[] = [];
    if (item.BPM <= 0) errors.push("BPM must be greater than zero");
    if (item.time < 0)
      errors.push("time must be greater than or equal to zero");
    return errors;
  }
  override copy(): SpeedItem {
    const n: SpeedItem = new SpeedItem(this.BPM, this.time, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "BPM") this.BPM = parseFloat(value);
    if (name == "time") this.time = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "speed",
      class: SpeedItem,
      type: Attribute.speed,
      attributes: [
        {
          name: "BPM",
          dataType: "number",
          title: "BPM",
          units: "BPM",
          min: 0 + Number.EPSILON,
        },
        {
          name: "time",
          dataType: "number",
          title: "Time",
          units: "sec",
          min: 0,
        },
      ],
    };
  }
}
export class AttackItem extends Item {
  attack: number;
  time: number;
  constructor(attack: number, time: number, id?: string) {
    super(Attribute.attack, id);
    this.attack = attack;
    this.time = time;
  }
  static validate(item: AttackValue): string[] {
    const errors: string[] = [];
    if (item.attack < 0 || item.attack > 127)
      errors.push("attack must be in the range (0, 127)");
    if (item.time < 0)
      errors.push("time must be greater than or equal to zero");
    return errors;
  }
  override copy(): AttackItem {
    const n: AttackItem = new AttackItem(this.attack, this.time, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "attack") this.attack = parseFloat(value);
    if (name == "time") this.time = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "attack",
      class: AttackItem,
      type: Attribute.attack,
      attributes: [
        {
          name: "attack",
          dataType: "number",
          title: "Attack",
          units: "[0-127]",
          min: 0,
          max: 127,
        },
        {
          name: "time",
          dataType: "number",
          title: "Time",
          units: "sec",
          min: 0,
        },
      ],
    };
  }
}
export class DurationItem extends Item {
  duration: number;
  time: number;
  constructor(duration: number, time: number, id?: string) {
    super(Attribute.duration, id);
    this.duration = duration;
    this.time = time;
  }
  static validate(item: DurationItem): string[] {
    const errors: string[] = [];
    if (item.duration < 0 || item.duration > 100)
      errors.push("duration must be in the range (0, 100)");
    if (item.time < 0)
      errors.push("time must be greater than or equal to zero");
    return errors;
  }
  override copy(): DurationItem {
    const n: DurationItem = new DurationItem(this.duration, this.time, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "duration") this.duration = parseFloat(value);
    if (name == "time") this.time = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "duration",
      class: DurationItem,
      type: Attribute.duration,
      attributes: [
        {
          name: "duration",
          dataType: "number",
          title: "Duration",
          units: "(0-100]%",
          min: 0 + Number.EPSILON,
          max: 100,
        },
        {
          name: "time",
          dataType: "number",
          title: "Time",
          units: "sec",
          min: 0,
        },
      ],
    };
  }
}
export class VolumeItem extends Item {
  volume: number;
  time: number;
  constructor(volume: number, time: number, id?: string) {
    super(Attribute.volume, id);
    this.volume = volume;
    this.time = time;
  }
  static validate(item: VolumeValue): string[] {
    const errors: string[] = [];
    if (item.volume < -10 || item.volume > 10)
      errors.push("duration must be in the range (-10, 10)");
    if (item.time < 0)
      errors.push("time must be greater than or equal to zero");
    return errors;
  }
  override copy(): VolumeItem {
    const n: VolumeItem = new VolumeItem(this.volume, this.time, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "volume") this.volume = parseFloat(value);
    if (name == "time") this.time = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "volume",
      class: VolumeItem,
      type: Attribute.volume,
      attributes: [
        {
          name: "volume",
          dataType: "number",
          title: "Volume",
          units: "[-10,+10]",
          min: -10,
          max: 10,
        },
        {
          name: "time",
          dataType: "number",
          title: "Time",
          units: "sec",
          min: 0,
        },
      ],
    };
  }
}
export class PanItem extends Item {
  pan: number;
  time: number;
  constructor(pan: number, time: number, id?: string) {
    super(Attribute.pan, id);
    this.pan = pan;
    this.time = time;
  }
  static validate(item: PanValue): string[] {
    const errors: string[] = [];
    if (item.pan < -1 || item.pan > 1)
      errors.push("pan must be in the range (-1, 1)");
    if (item.time < 0)
      errors.push("time must be greater than or equal to zero");
    return errors;
  }
  override copy(): PanItem {
    const n: PanItem = new PanItem(this.pan, this.time, this.id);
    return n;
  }
  override setAttribute(name: string, value: string): void {
    super.setAttribute(name, value);
    if (name == "pan") this.pan = parseFloat(value);
    if (name == "time") this.time = parseFloat(value);
  }
  static override getProperties(): ItemProperties {
    return {
      name: "pan",
      class: PanItem,
      type: Attribute.pan,
      attributes: [
        {
          name: "pan",
          dataType: "number",
          title: "Pan",
          units: "[-1,+1]",
          min: -1,
          max: 1,
        },
        {
          name: "time",
          dataType: "number",
          title: "Time",
          units: "sec",
          min: 0,
        },
      ],
    };
  }
}
