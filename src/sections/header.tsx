import { JSX } from "react";
import { Attribute } from "types";
import CMG2 from "assets/CGM2.svg";

interface HeaderProps {
  name: string;
  version: string;
  setSequenceType:Function;
}
export default function Header(props: HeaderProps): JSX.Element {
  const { name, version, setSequenceType } = props;
  return (
    <>
      <div className="icon">
                  <img
            src={CMG2}
            alt="CGM"
            style={{ width: 70, height: 70, margin: "0", padding: "0" }}
          />

      </div>
      <div className="menu">
        <button className="note" onClick={()=> setSequenceType(Attribute.note)}>Note</button>
        <button className="speed"  onClick={()=> setSequenceType(Attribute.speed)}>Speed</button>
        <button className="attack"  onClick={()=> setSequenceType(Attribute.attack)}>Attack</button>
        <button className="duration"  onClick={()=> setSequenceType(Attribute.duration)}>Duration</button>
        <button className="volume"  onClick={()=> setSequenceType(Attribute.volume)}>Volume</button>
        <button className="pan"  onClick={()=> setSequenceType(Attribute.pan)}>Pan</button>
      </div>
      <div className="title">{`${name}: ${version} `}</div>
    </>
  );
}
