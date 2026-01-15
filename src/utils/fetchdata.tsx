import { FSResponse, RESPONSETYPE } from "types";
// issue the fetch request for file list or specific file
export async function fetchFSData(
  uri: string,
  method: string,
  body?: object | string
): Promise<FSResponse> {
  try {
    const url: string = `http://localhost:${import.meta.env.FSPORT}`;
    let thisBody: string | null = null;
    if (body && typeof body === "object") {
      thisBody = JSON.stringify(body);
    } else if (typeof body === "string") {
      thisBody = body;
    }
    const response: Response = await fetch(`${url}${uri}`, {
      method: method,
      headers: {
        Accept: "*/*",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": `http://localhost:${
          import.meta.env.PORT
        }`,
      },
      body: thisBody,
    });
    if (!response.ok) return { error: true, status: response.statusText };

    // return either a response from the filesystem or from the database
    const json: FSResponse = await response.json();
    return json;
  } catch (e: any) {
    console.log(`fetch exception ${e} on port ${import.meta.env.FSPORT}`);
    return { error: true, status: `${e}` };
  }
}

export default function fetchData(
  uri: string,
  method: string,
  body: object | null,
  setMessage: Function
) {
  const url: string = `${import.meta.env.SERVERNAME}:${
    import.meta.env.SERVERPORT
  }`;
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
