/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import style from "./page.module.css";
import { Replay } from "@mui/icons-material";
import Navbar from "./Navbar/navbar";

const keyboardLayout: { [key: string]: { x: number; y: number } } = {
  a: { x: 69, y: 95 },
  s: { x: 102, y: 95 },
  d: { x: 135, y: 95 },
  f: { x: 168, y: 95 },
  j: { x: 267, y: 95 },
  k: { x: 300, y: 95 },
  l: { x: 333, y: 95 },
  ";": { x: 367, y: 95 },
};

const handsLayout: { [key: string]: { x: number; y: number } } = {
  a: { x: 88, y: 85 },
  s: { x: 122, y: 63 },
  d: { x: 152, y: 50 },
  f: { x: 173, y: 65 },
  j: { x: 405, y: 65 },
  k: { x: 428, y: 50 },
  l: { x: 458, y: 63 },
  ";": { x: 490, y: 85 },
};

const typingCharacters = "asdfjkl;";

export default function Home() {
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [nextKey, setNextKey] = useState("");
  const [highlightedKey, setHighlightedKey] = useState("");

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [text]);

  const handleKeyPress = (e: any) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (!endTime) {
      const typedKey = e.key.toLowerCase();
      if (typingCharacters.includes(typedKey)) {
        setText((prevText) => prevText + typedKey);
      }
    }
  };

  const calculateTypingSpeed = () => {
    const keysTyped = text.trim().length;
    setTypingSpeed(keysTyped);
  };

  const calculateAccuracy = () => {
    const totalKeys = text.length;
    let errors = 0;

    for (let i = 0; i < totalKeys; i++) {
      if (text[i] !== typingCharacters[i % typingCharacters.length]) {
        errors++;
      }
    }

    const accuracy = Math.round(((totalKeys - errors) / totalKeys) * 100);
    setAccuracy(accuracy);
  };

  const highlightNextKey = () => {
    const index = text.length;
    const nextKey = typingCharacters[index % typingCharacters.length];
    setNextKey(nextKey.toUpperCase());
    setHighlightedKey(nextKey);
  };

  useEffect(() => {
    highlightNextKey();
  }, [text]);

  const reset = () => {
    setText("");
    setStartTime(null);
    setEndTime(null);
    setTypingSpeed(0);
    setAccuracy(0);
    highlightNextKey();
  };

  return (
    <div className={style.page}>
      <div>
        <Navbar />
      </div>
      <div className={style.content}>
        <div className={style.reset} onClick={reset}>
          Reset
          <Replay />
        </div>
        <div className={style.keyboard}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              margin: "10px",
              backgroundImage: "url(/images/keyboard.jpg)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "500px",
              height: "200px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: keyboardLayout[highlightedKey]?.y,
                left: keyboardLayout[highlightedKey]?.x,
                width: "26px",
                height: "26px",
                backgroundColor: "lightblue",
                opacity: 0.7,
                // borderRadius: "50%",
              }}
            />
          </div>
          <div className={style.clock}>
            {endTime === null ? (
              <div>
                <CountdownCircleTimer
                  isPlaying={startTime !== null && endTime === null}
                  duration={300}
                  size={130}
                  strokeWidth={6}
                  colors={["#2fa855", "#F7B801", "#f06429", "#A30000"]}
                  colorsTime={[300, 200, 100, 0]}
                  onComplete={() => {
                    setEndTime(Date.now());
                    calculateTypingSpeed();
                    calculateAccuracy();
                    return;
                  }}
                >
                  {({ remainingTime }) => (
                    <div className={style.timerComponent}>
                      <p className={style.timer}>{remainingTime}</p>
                      seconds
                    </div>
                  )}
                </CountdownCircleTimer>
              </div>
            ) : (
              <p>Time&apos;s up!</p>
            )}
          </div>
        </div>
        <div className={style.results}>
          <p className={style.accuracy}>Accuracy: {accuracy}%</p>
          <p>Total Keys Typed: {typingSpeed} keys </p>
        </div>
        <div className={style.handsDiv}>
          <div className={style.hands}>
            <img src="/images/left_hand.png" alt="left hand" width={"300px"} />
            <img src="/images/right_hand.png" alt="left hand" width={"300px"} />
          </div>
          <div
            style={{
              position: "absolute",
              top: handsLayout[highlightedKey]?.y,
              left: handsLayout[highlightedKey]?.x,
              width: "20px",
              height: "20px",
              backgroundColor: "lightblue",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className={style.textareaContainer}>
          <textarea
            className={style.textarea}
            rows={5}
            cols={50}
            value={text}
            readOnly={endTime !== null}
          />
        </div>
      </div>
    </div>
  );
}
