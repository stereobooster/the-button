import React from "react";
import "./Button.css";

const Button = ({ children }) => {
  const [activated, setActivated] = React.useState(false);
  return (
    <button
      className={"button" + (activated ? " active" : "")}
      onMouseDown={() => setActivated(false)}
      onMouseUp={() => setActivated(true)}
    >
      {children}
    </button>
  );
};

function App() {
  return (
    <div className="screenshot">
      <Button>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{" "}
        Button
      </Button>
    </div>
  );
}

export default App;
