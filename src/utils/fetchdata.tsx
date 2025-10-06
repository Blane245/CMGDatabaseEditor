import { RESPONSETYPE } from "../types";

const url: string = `http://localhost:${import.meta.env.SERVERPORT}`;
export default function fetchData(
  uri: string,
  method: string,
  body: object | null,
  setMessage: Function
) {
  fetch(`${url}${encodeURI(uri)}`, {
    method: method,
    body: body ? JSON.stringify(body) : null,
  }).then((response: Response) => {
    if (!response.ok) {
      setMessage({
        type: RESPONSETYPE.error,
        message: { message: response.statusText },
      });
      return;
    }
    try {
      response.json().then((json: any) => {
        setMessage(json);
      });
    } catch (e) {
      setMessage({
        type: RESPONSETYPE.error,
        message: `error decoding database response ${e}`,
      });
    }
  });
}
