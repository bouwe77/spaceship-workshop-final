import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { getSpaceship } from "./api";

const useServer = (spaceshipId) => {
  const [currentPosition, setCurrentPosition] = useState({});
  //const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  function setCourse(destination, speed) {
    socketRef.current.emit("setCourse", { spaceshipId, destination, speed });
  }

  const getCourse = useCallback(async () => {
    const spaceship = await getSpaceship(spaceshipId);
    return {
      spaceshipId: spaceship.spaceshipId,
      destinationX: spaceship.destinationX,
      destinationY: spaceship.destinationY,
      speed: spaceship.speed,
      location: spaceship.location,
    };
  }, [spaceshipId]);

  // Fetch the currentPosition when the component initially renders.
  useEffect(() => {
    async function fetch() {
      const spaceship = await getSpaceship(spaceshipId);
      const pos = {
        x: spaceship.positionX,
        y: spaceship.positionY,
        location: spaceship.location,
        destinationReached:
          spaceship.positionX === spaceship.destinationX &&
          spaceship.positionY === spaceship.destinationY,
      };
      console.log("currentPosition", pos);
      setCurrentPosition(pos);
    }
    fetch();
  }, [spaceshipId]);

  // Connect to the socket server when the spaceshipId changes.
  useEffect(() => {
    try {
      socketRef.current = io("https://spaceship-server.herokuapp.com", {
        forceNew: true,
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }

    socketRef.current.emit("registerSpaceship", spaceshipId);
    console.log(`${spaceshipId} successfully registered`);

    socketRef.current.on("disconnect", () => {
      console.log("disconnected...");
      socketRef.current.connect();
    });

    socketRef.current.on("CurrentPositionUpdated", (currentPosition) => {
      const pos = {
        x: currentPosition.position.x,
        y: currentPosition.position.y,
        location: currentPosition.location,
        destinationReached: currentPosition.destinationReached,
      };
      console.log("currentPosition", pos);
      setCurrentPosition(pos);
    });

    //socketRef.current.on("MessageSentFromServer", message =>
    //  setMessages(messages => [message, ...messages])
    //);

    return () => {
      socketRef.current.off("CurrentPositionUpdated");
      socketRef.current.off("MessageSentFromServer");
    };
  }, [spaceshipId]);

  return [setCourse, currentPosition, getCourse];
};

export default useServer;
