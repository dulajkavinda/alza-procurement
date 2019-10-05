import React from "react";
import renderer from "react-test-renderer";
import App from "../App";

// this test case will check whether oe this this main App compnent has the right amount of
// childs

describe("<App />", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(2);
  });
});
