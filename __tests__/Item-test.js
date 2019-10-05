import React from "react";
import Items from "../components/Items";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<Items />).toJSON();
  expect(tree).toMatchSnapshot();
});
