import { VFC, useEffect, useRef, useState } from 'react';

const WebFontPreloading: VFC = () => {
  const [active, loadFont] = useState<boolean>(true);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;
    loadFont(false);
  }, [active]);
  return (
    <>
      {active &&
        <div id='webfontPreloading'>
          <noscript>
            <h1>JavaScriptを有効にしてね！</h1>
            <br />
            <p>※推奨ブラウザはiPhoneの方はSafari, それ以外の方はChromeです</p>
          </noscript>
          <p ref={paragraphRef} aria-hidden="true">Loading...</p>
        </div>
      }
    </>
  );
};

export default WebFontPreloading;