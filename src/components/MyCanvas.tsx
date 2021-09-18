import { VFC, useEffect, useRef } from "react";
import { Manager } from "libs/manages/Manager";
import { LoaderScene } from "libs/scenes/LoaderScene";

const MyCanvas: VFC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() =>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    Manager.initialize(canvas, screenWidth, screenHeight);
    const loady: LoaderScene = new LoaderScene();
    Manager.changeScene(loady);
  },[canvasRef]);
  return <canvas ref={canvasRef} />;
};

export default MyCanvas;