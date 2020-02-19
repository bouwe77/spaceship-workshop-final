import React, { useState, useEffect } from "react";
import useServer from "./server/useServer";
import { getSpaceObjects } from "./server/api";

export default function Cockpit({ engineMode, setEngineMode }) {
  const [setCourse, currentPosition, getCourse] = useServer("Defiant");
  const [spaceObjects, setSpaceObjects] = useState([]);
  const [selectedSpaceObjectName, setSelectedSpaceObjectName] = useState();
  const [destinationX, setDestinationX] = useState();
  const [destinationY, setDestinationY] = useState();
  const [speed, setSpeed] = useState();

  useEffect(() => {
    async function fetch() {
      const result = await getSpaceObjects();
      setSpaceObjects(result);
    }
    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      const result = await getCourse();
      setDestinationX(result.destinationX);
      setDestinationY(result.destinationY);
      setSpeed(result.speed);
    }
    fetch();
  }, [getCourse]);

  function handleSpaceObjectChanged(event) {
    // Determine the value of the selected item, which is the space object name.
    const selectedSpaceObjectName = event.target.value;
    setSelectedSpaceObjectName(selectedSpaceObjectName);

    // If nothing was selected, quit further processing.
    if (!selectedSpaceObjectName) return;

    // A space object was selected, find it in the spaceObjects array.
    const selectedSpaceObject = spaceObjects.find(
      s => s.name === selectedSpaceObjectName
    );

    // Update the destination according to the selected space object's destination.
    setDestinationX(selectedSpaceObject.destinationX);
    setDestinationY(selectedSpaceObject.destinationY);
  }

  const IDLE = "idle";
  const THRUSTERS = "thrusters";
  const IMPULSE = "impulse";

  function go(event) {
    event.preventDefault();
    setCourse({ x: destinationX, y: destinationY }, speed);
  }

  return (
    <div className="cockpit">
      <div className="engineModePanel">
        <div>Engine mode:</div>
        <div>
          <input
            type="radio"
            value={IDLE}
            checked={engineMode === IDLE}
            id={IDLE}
            onChange={() => setEngineMode(IDLE)}
          />
          <label htmlFor={IDLE}>{IDLE}</label>
        </div>
        <div>
          <input
            type="radio"
            value={THRUSTERS}
            checked={engineMode === THRUSTERS}
            id={THRUSTERS}
            onChange={() => setEngineMode(THRUSTERS)}
          />
          <label htmlFor={THRUSTERS}>Thrusters</label>
        </div>
        <div>
          <input
            type="radio"
            value={IMPULSE}
            checked={engineMode === IMPULSE}
            id={IMPULSE}
            onChange={() => setEngineMode(IMPULSE)}
          />
          <label htmlFor={IMPULSE}>Impulse</label>
        </div>
      </div>
      <div className="navigationPanel">
        <div>
          <select
            onChange={handleSpaceObjectChanged}
            value={selectedSpaceObjectName}
          >
            <option key="-" value=""></option>
            {spaceObjects.map(spaceObject => (
              <option key={spaceObject.name} value={spaceObject.name}>
                {spaceObject.name} ({spaceObject.type})
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={go}>
          <input
            type="text"
            placeholder="x"
            value={destinationX}
            onChange={event => setDestinationX(event.target.value)}
          />
          <input
            type="text"
            placeholder="y"
            value={destinationY}
            onChange={event => setDestinationY(event.target.value)}
          />
          <input
            type="text"
            placeholder="speed"
            value={speed}
            onChange={event => setSpeed(event.target.value)}
          />
          <div>
            <button type="submit">Go</button>
          </div>
        </form>
      </div>
      <div className="locationPanel">
        <div>
          Pos: {currentPosition.x},{currentPosition.y}
        </div>
        <div>Loc.: {currentPosition.location}</div>
        <div>Arrived: {currentPosition.destinationReached ? "Yes" : "No"}</div>
      </div>
    </div>
  );
}
