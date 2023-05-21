import React, { createContext, useReducer, useContext } from "react";

export const StateContext = createContext(); //creating context. This context will provide me the Provider component.
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext); //using the useContext hook we will be able to use the created contex. Upon invoking the useStateValue we will be provided with an array that will hold the state and the setter function.
