import type { Interaction } from "./interaction";
import type { PseudoClassesQuery } from "../../types";

export function testPseudoClasses(
  interaction: Interaction,
  meta: PseudoClassesQuery
) {
  if (meta.active && !interaction.active.get()) {
    return false;
  }

  if (meta.hover && !interaction.hover.get()) {
    return false;
  }

  if (meta.focus && !interaction.focus.get()) {
    return false;
  }

  return true;
}
