import React from "react";
import ReactDOM from "react-dom";
import App from "./App Component/App";
import "./index.css";
import { StateProvider } from "./StateProvider/StateProvider";
import reducer from "./StateProvider/reducer";
import { initialState } from "./StateProvider/reducer";
ReactDOM.render(
  <React.StrictMode>
    {/*
    To manage the state of the application, insted of using Redux, i am using useReducer hook combined with context api , both of them are native
    to ReactJs.

    To access all data from each and every component of the tree, i am wraping aroung the root of the component tree inside the Provider.
    Now by doing that all the value stored in the state can be accessed by all the child of App component.
*/}
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
