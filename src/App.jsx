
import { useContext } from "react";
import Loader from "./components/loader";
import Robot from "./components/Robot";

import { FaMicrophone } from "react-icons/fa";
import { UserContext } from "./context/userContext";

import "./App.css";

function App() {
  const { recognition, listening, setListening, speak, loaderstate, aispeaking,error } =
    useContext(UserContext);

  return (
    <>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div id="full-div">
        <Robot speaking={aispeaking} />


        <p id="intro-text">
          Hi, I am your <b>Agha AI</b>, to talk to.
        </p>

        {loaderstate ? (
          <Loader />
        ) : listening ? (
          <img
            id="mic-img"
            src="/images/mic-listening.gif"
            alt="Listening..."
          />
        ) : (
          <button
            id="speak-btn"
            onClick={() => {
              recognition.start();
              setListening(true);
            }}
          >
            <FaMicrophone size={24} color="#ef4444" />
            Click to speak
          </button>
        )}
      </div>
    </>
  );
}

export default App;
