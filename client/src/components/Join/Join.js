import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>
      <input
        placeholder="Name"
        onChange={event => setName(event.target.value)}
      />
      <input
        placeholder="Room"
        onChange={event => setRoom(event.target.value)}
      />
      <Link
        onClick={event => (!name || !room) && event.preventDefault}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button type="submit">Sign In</button>
      </Link>
    </div>
  );
};

export default Join;
