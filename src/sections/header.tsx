import { JSX } from "react";
import CMG2 from "/src/assets/CGM2.svg";

interface HeaderProps {
  name: string;
  version: string;
}
export default function Header(props: HeaderProps): JSX.Element {
  const { name, version } = props;
  return (
    <>
      <div className="icon">
                  <img
            src={CMG2}
            alt="CGM"
            style={{ width: 70, height: 70, margin: "0", padding: "0" }}
          />

      </div>
      <div className="title">{`${name} (notes only): ${version} `}</div>
    </>
  );
}
