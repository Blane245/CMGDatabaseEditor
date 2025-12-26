import CMG2 from "assets/CGM2.svg";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useEffect } from "react";
import { Attribute, EDITMODE, PARTITIONTYPE, RESPONSETYPE } from "types";

interface HeaderProps {
  name: string;
  version: string;
}
export default function Header(props: HeaderProps): JSX.Element {
  const { setSequenceType, partition, setPartition, setEditMode, setMessage } = useEditorContext();
  const { name, version } = props;
  useEffect(()=> {
    if (partition == PARTITIONTYPE.none) {
      setEditMode(EDITMODE.None);
      setMessage({type:RESPONSETYPE.info, message:''});
    }
  },[partition])
  return (
    <>
      <div className="menu">
        <button
          className="ensemble"
          onClick={() => {setPartition(PARTITIONTYPE.ensemble);}}
        >
          Ensemble
        </button>
        <div className="navbar">
          <div className="dropdown">
            <div className="dropbtn">
              Sequencers
              <i className="fa fa-caret-down"></i>
            </div>
            <div className="dropdown-one">
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.note)}}
              >
                Pitch
              </div>
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.speed)}}
              >
                Speed
              </div>
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.attack)}}
              >
                Attack
              </div>
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.duration)}}
              >
                Duration
              </div>
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.volume)}}
              >
                Volume
              </div>
              <div
                className="dItem"
                onClick={() => {setPartition(PARTITIONTYPE.sequencer); setSequenceType(Attribute.pan)}}
              >
                Pan
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="icon">
        <img
          src={CMG2}
          alt="CGM"
          style={{ width: 70, height: 70, margin: "0", padding: "0" }}
        />
      </div>
      <div className="title">{`${name}: ${version} `}</div>
    </>
  );
}
