// thanx to Spenhouet
export function matchWildCard(str: string, rule: string) :boolean{
  // for this solution to work on any string, no matter what characters it has
  const escapeRegex = (str:string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

  // "."  => Find a single character, except newline or line terminator
  // ".*" => Matches any string that contains zero or more characters
  let newRule:string = rule.split("*").map(escapeRegex).join(".*");

  // "^"  => Matches any string with the following at the beginning of it
  // "$"  => Matches any string with that in front at the end of it
  newRule = "^" + newRule + "$"

  //Create a regular expression object for matching string
  var regex:RegExp = new RegExp(newRule);

  //Returns true if it finds a match, otherwise it returns false
  return regex.test(str);
}