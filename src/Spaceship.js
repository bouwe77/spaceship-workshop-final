import React from "react";
import Cockpit from "./Cockpit";

export default function Spaceship() {
  const spaceshipId = "Terigon";

  return (
    <div>
      <h1>{spaceshipId}</h1>
      <Cockpit spaceshipId={spaceshipId} />
    </div>
  );
}
