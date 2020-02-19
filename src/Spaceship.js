import React, { useState } from "react";
import Cockpit from "./Cockpit";
import Engine from "./Engine";

export default function Spaceship() {
  const [engineMode, setEngineMode] = useState("idle");

  return (
    <div>
      <h1>My Spaceship!</h1>
      <Cockpit engineMode={engineMode} setEngineMode={setEngineMode} />
      <Engine engineMode={engineMode} />
    </div>
  );
}
