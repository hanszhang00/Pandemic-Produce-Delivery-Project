import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { App } from "./App";
//commenting
it("renders correctly", () => {
  const MockFunction = () => {};

  const MockProps = {
    id: "2XGqN0k31F7T12SV2",
    privilege: false,
    email: "TEST@gmail.com",
    createdAt: { seconds: 1597934755, nanoseconds: 995000000 },
    displayName: "A GUY WHO'S PRACTICING TESTING LOL",
  };
  const wrapper = shallow(
    <App user={MockProps} setCurrentUser={MockFunction} />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
