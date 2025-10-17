import { Attribute, AttributeProperty, itemProperties } from "types";

export default function getItemProperties(
  sequenceType: Attribute
): AttributeProperty[] {
  const attributeProperties: AttributeProperty[] = itemProperties[sequenceType];
  return attributeProperties;
}
