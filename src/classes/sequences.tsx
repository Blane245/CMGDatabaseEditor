import {
    AttackValue,
    Attribute,
    DurationValue,
    ErrorMessages,
    NoteValue,
    PanValue,
    SpeedValue,
    VolumeValue,
} from "types";
import {
    AttackItem,
    DurationItem,
    NoteItem,
    PanItem,
    SpeedItem,
    VolumeItem
} from "classes/items";

export class Sequence {
  name: string = "";
  type: Attribute;
  tags: string = "";
  constructor(type: Attribute) {
    this.type = type;
  }
//   add(_item: Item) {}
//   delete(_item: Item) {}
//   modify(_item: Item) {}
//   list(): Item[] {
//     return [];
//   }
  validate(): ErrorMessages {
    return ["Invalid sequence type"];
  }
  encode(): string {
    return "";
  }
  decode(_input: string) {
    return;
  }
}
export class NoteSequence extends Sequence {
  items: NoteItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: NoteItem) {
//     this.items.push(item);
//   }
//   override delete(item: NoteItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: NoteItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): NoteItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: NoteValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, note: i.note, beats: i.beats });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: NoteValue[]} {
    try {
    const values: NoteValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new NoteItem(v.note, v.beats));
    })
    // TODO make sure what is read are proper note items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
export class SpeedSequence extends Sequence {
  items: SpeedItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: SpeedItem) {
//     this.items.push(item);
//   }
//   override delete(item: SpeedItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: SpeedItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): SpeedItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: SpeedValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, BPM: i.BPM, time: i.time });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: SpeedValue[]} {
    try {
    const values: SpeedValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new SpeedItem(v.BPM, v.time));
    })
    // TODO make sure what is read are proper speed items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
export class AttackSequence extends Sequence {
  items: AttackItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: AttackItem) {
//     this.items.push(item);
//   }
//   override delete(item: AttackItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: AttackItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): AttackItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: AttackValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, attack: i.attack, time: i.time });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: AttackValue[]} {
    try {
    const values: AttackValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new AttackItem(v.attack, v.time));
    })
    // TODO make sure what is read are proper speed items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
export class DurationSequence extends Sequence {
  items: DurationItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: DurationItem) {
//     this.items.push(item);
//   }
//   override delete(item: DurationItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: DurationItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): DurationItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: DurationValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, duration: i.duration, time: i.time });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: DurationValue[]} {
    try {
    const values: DurationValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new DurationItem(v.duration, v.time));
    })
    // TODO make sure what is read are proper speed items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
export class VolumeSequence extends Sequence {
  items: VolumeItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: VolumeItem) {
//     this.items.push(item);
//   }
//   override delete(item: VolumeItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: VolumeItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): VolumeItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: VolumeValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, volume: i.volume, time: i.time });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: VolumeValue[]} {
    try {
    const values: VolumeValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new VolumeItem(v.volume, v.time));
    })
    // TODO make sure what is read are proper speed items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
export class PanSequence extends Sequence {
  items: PanItem[] = [];
  constructor() {
    super(Attribute.note);
  }
//   override add(item: PanItem) {
//     this.items.push(item);
//   }
//   override delete(item: PanItem) {
//     this.items = this.items.filter((i) => i.id != item.id);
//   }
//   override modify(item: PanItem) {
//     this.items = this.items.map((i) => (i.id != item.id ? i : item));
//   }
//   override list(): PanItem[] {
//     return this.items;
//   }
  override validate(): ErrorMessages {
    return [];
  }
  override encode(): string {
    const exportItems: PanValue[] = [];
    this.items.map((i) => {
      exportItems.push({ id: i.id, pan: i.pan, time: i.time });
    });
    return JSON.stringify(exportItems);
  }
  override decode(input: string): {error: boolean, values: PanValue[]} {
    try {
    const values: PanValue[] = JSON.parse(input);
    this.items = [];
    values.forEach((v) => {
        this.items.push(new PanItem(v.pan, v.time));
    })
    // TODO make sure what is read are proper speed items
    return {error:false, values: values};
    }  catch(e) {
        return {error: true, values:[]}
    }
  }
}
