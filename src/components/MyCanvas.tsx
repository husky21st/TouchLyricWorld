import { VFC, useEffect, useRef } from 'react';
import { Manager } from 'libs/manages/Manager';
import { LoaderScene } from 'libs/scenes/LoaderScene';

const MyCanvas: VFC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const media = mediaRef.current;
    if (!canvas || !media) return;
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    Manager.initialize(canvas, media, screenWidth, screenHeight);
    const loady: LoaderScene = new LoaderScene();
    Manager.changeScene(loady);
  }, [canvasRef, mediaRef]);
  return (
    <>
      <canvas ref={canvasRef} />
      <div ref={mediaRef} id='media' />
    </>
  );
};

export default MyCanvas;
