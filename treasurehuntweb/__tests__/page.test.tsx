import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import PagePrix from "../src/app/price/page";

test("smokescreen", () => {
  render(<PagePrix />);
  expect(document.getElementById("prices-section")).toBeDefined();
});
