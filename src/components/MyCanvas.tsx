import React, { VFC, useEffect, useRef } from 'react';
import cacheData from 'memory-cache';
import { Manager } from 'libs/manages/Manager';
import { LoaderScene } from 'libs/scenes/LoaderScene';

const MyCanvas: VFC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const handleDummyButton = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    event.currentTarget.style.display = 'none';
    setTimeout(() => {
      const nowTarget = event.target as Element & HTMLButtonElement;
      nowTarget.style.display = 'none';
    }, 100);
  }
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const media: HTMLDivElement | null = mediaRef.current;
    if (!canvas || !media) return;
    cacheData.clear();
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    Manager.initialize(canvas, media, screenWidth, screenHeight);
    const loady: LoaderScene = new LoaderScene();
    Manager.changeScene(loady);
  }, [canvasRef, mediaRef]);
  return (
    <>
      <canvas ref={canvasRef} />
      <button type='button' id='dummyButton' onClick={handleDummyButton}>Please<br />Touch Display<br /><br /><br /><br /></button>
      <div ref={mediaRef} id='media' />
    </>
  );
};

export default MyCanvas;
