import { renderRouter, screen } from "../testing-library";

it("displays the tutorial when no routes exists", async () => {
  renderRouter({});

  expect(
    await screen.findByText("Start by creating a file in the app directory.")
  ).toBeDefined();
});
