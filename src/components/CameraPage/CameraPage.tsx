import { useEffect, useRef, useState } from "react";
import {
  Data,
  drawConnectors,
  drawLandmarks,
  lerp,
  NormalizedLandmark,
} from "@mediapipe/drawing_utils";
import "./index.scss";
import { Results as PoseResults, Pose } from "@mediapipe/pose";
import { NavLink } from "react-router-dom";

export const CameraPage = () => {
  const [inputVideoReady, setInputVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inputVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const leftElbowAngleLengthRef = useRef<HTMLDivElement>(null);
  const rightElbowAngleLengthRef = useRef<HTMLDivElement>(null);
  const leftElbowAngleDegreeRef = useRef<HTMLDivElement>(null);
  const rightElbowAngleDegreeRef = useRef<HTMLDivElement>(null);

  const posOnResults = (results: PoseResults) => {
    if (!canvasRef.current || !contextRef.current) {
      return;
    }
    setLoaded(true);
    if (
      !leftElbowAngleLengthRef.current ||
      !rightElbowAngleLengthRef.current ||
      !leftElbowAngleDegreeRef.current ||
      !rightElbowAngleDegreeRef.current
    ) {
      return;
    }

    if (!results.poseLandmarks) {
      return;
    }

    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];

    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const leftElbowAngle = Math.atan2(
      leftWrist.y - leftElbow.y,
      leftWrist.x - leftElbow.x
    );
    const rightElbowAngle = Math.atan2(
      rightWrist.y - rightElbow.y,
      rightWrist.x - rightElbow.x
    );

    leftElbowAngleLengthRef.current.innerHTML = leftElbowAngle
      .toFixed(2)
      .toString();
    rightElbowAngleLengthRef.current.innerHTML = rightElbowAngle
      .toFixed(2)
      .toString();

    leftElbowAngleDegreeRef.current.innerHTML = (
      (leftElbowAngle * 180) /
      Math.PI
    )
      .toFixed(2)
      .toString();
    rightElbowAngleDegreeRef.current.innerHTML = (
      (rightElbowAngle * 180) /
      Math.PI
    )
      .toFixed(2)
      .toString();

    drawConnectors(
      contextRef.current,
      results.poseLandmarks,
      [
        [15, 13],
        [13, 11],
        [16, 14],
        [14, 12],
      ],
      {
        color: "#FF0000",
      }
    );
    drawLandmarks(
      contextRef.current,
      [
        leftElbow,
        rightElbow,
        leftWrist,
        rightWrist,
        leftShoulder,
        rightShoulder,
      ],
      {
        color: (data) => {
          return getColor(data, leftElbow, rightElbow);
        },
        fillColor: (data) => {
          return getColor(data, leftElbow, rightElbow);
        },
        radius: (data) => {
          return lerp(data.from!.z!, -0.15, 0.1, 5, 1);
        },
      }
    );

    contextRef.current.restore();
  };

  const getColor = (
    data: Data,
    leftElbow: NormalizedLandmark,
    rightElbow: NormalizedLandmark
  ) => {
    if (
      data.from?.visibility === leftElbow.visibility ||
      data.to?.visibility === leftElbow.visibility ||
      data.from?.visibility === rightElbow.visibility ||
      data.to?.visibility === rightElbow.visibility
    ) {
      return "blue";
    } else {
      return "yellow";
    }
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement?.getContext("2d");

    if (!inputVideoReady || !canvasElement || !canvasCtx) {
      return;
    }

    if (!inputVideoRef.current && !canvasRef.current) {
      return;
    }

    contextRef.current = canvasRef.current.getContext("2d");

    const constraints = {
      video: { width: { min: 1280 }, height: { min: 720 } },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (inputVideoRef.current) {
        inputVideoRef.current.srcObject = stream;
      }
      sendToMediaPipe();
    });

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.onResults((results) => {
      posOnResults(results);
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const sendToMediaPipe = async () => {
      if (inputVideoRef.current) {
        if (!inputVideoRef.current.videoWidth) {
          requestAnimationFrame(sendToMediaPipe);
        } else {
          await pose.send({ image: inputVideoRef.current });
          requestAnimationFrame(sendToMediaPipe);
        }
      }
    };
  }, [inputVideoReady]);

  return (
    <div className="hands-container">
      <video
        className="input_video"
        autoPlay
        ref={(el) => {
          inputVideoRef.current = el;
          setInputVideoReady(!!el);
        }}
      />
      <canvas ref={canvasRef} width={1280} height={720} />

      {!loaded ? (
        <div className="loading">
          <div className="spinner"></div>
          <div className="message">Загрузка</div>
        </div>
      ) : (
        <>
          <div className="left-elbow-angle">
            <div className="label"> Угол левого локтя </div>
            <div className="value" ref={leftElbowAngleLengthRef} />

            <div className="label">Градус левого локтя</div>
            <div className="value" ref={leftElbowAngleDegreeRef} />

            <div className="label">Угол правого локтя</div>
            <div className="value" ref={rightElbowAngleLengthRef} />

            <div className="label">Градус правого локтя</div>
            <div className="value" ref={rightElbowAngleDegreeRef} />
          </div>
          <NavLink className="button" to="/">
            Стоп
          </NavLink>
        </>
      )}
    </div>
  );
};
