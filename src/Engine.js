import React from "react";

export default function Engine(props) {
  return (
    <div className="engine">
      <div className="engineMonitor">
        <h1>Engine mode:</h1> &gt;&gt; {props.engineMode}
      </div>
    </div>
  );
}
