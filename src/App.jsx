import React from "react";

import Routes from "./RoutesComponent";

function App() {
  //Remove console.log in production
  if (import.meta.env.MODE !== "development") console.log = () => {};

  return <Routes />;
}

export default App;