import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

export class Manager {
  private constructor() {}

  private static app: PIXI.Application;
  private static currentScene: IScene;

  private static _width: number;
  private static _height: number;

  //for TextAliveApp
  public static _media: HTMLElement;

  //getter
  public static get width(): number {
    return Manager._width;
  }
  public static get height(): number {
    return Manager._height;
  }
  public static get wr(): number {
    return Manager._width / 100;
  }
  public static get hr(): number {
    return Manager._height / 100;
  }
  public static get textScale(): number {
    return Manager._width / 2000;
  }

  public static initialize(canvas: HTMLCanvasElement, mediaElement: HTMLDivElement, width: number, height: number): void {
    console.log('Manager_init');
    // store our width and height
    Manager._width = width;
    Manager._height = height;

    // Create our pixi app
    Manager.app = new PIXI.Application({
      view: canvas,
      resolution: window.devicePixelRatio || 1,
      backgroundColor: 0xf8fcfb,
      autoDensity: false, //apply in css file
      antialias: true,
      width: width,
      height: height,
    });

    console.log(PIXI.utils.isMobile);
    //plugin entry for gsap
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    
    //pixi-webfont-loader
    PIXI.Loader.registerPlugin(WebfontLoaderPlugin);

    //other setting
    PIXI.TextMetrics.BASELINE_SYMBOL += 'あぽ｜';



    // Add the ticker
    Manager.app.ticker.stop();
    gsap.ticker.fps(60);
    gsap.ticker.add(() => {
      Manager.app.ticker.update();
    });
    Manager.app.ticker.add(Manager.update);
    
    Manager._media = mediaElement as HTMLElement;
    Manager._media.style.visibility = 'hidden';
    
    Manager.ManagerInitSetting();
  }

  //browser Check
  private static ManagerInitSetting(): void {
    PIXI.Loader.shared.destroy();
    if (PIXI.utils.isMobile.apple.device) {
      PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;
    }
  }

  //resize Event
  public static _onResize(WIDTH: number, HEIGHT: number): void {
    Manager._width = WIDTH;
    Manager._height = HEIGHT;

    Manager.app.renderer.resize(Manager.width, Manager.height);
    if(Manager.currentScene){
      Manager.currentScene.resize();
    }
    Manager.app.render();
    //for ios safari
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 200);
  }

  //public static resizeToFullscreen(): void {
  //  // current screen size
  //  console.log(
  //    'width',
  //    window.innerWidth,
  //    screen.width,
  //    screen.availWidth,
  //    document.documentElement.clientWidth,
  //  );
  //  console.log(
  //    'height',
  //    window.innerHeight,
  //    screen.height,
  //    screen.availHeight,
  //    document.documentElement.clientHeight,
  //  );
  //  Manager._scaleRatioX = screen.availWidth / Manager.width;
  //  Manager._scaleRatioY = screen.availHeight / Manager.height;
  //  if (Manager.scaleRatioX === 1 && Manager.scaleRatioY === 1) return;
  //  Manager.currentScene.pivot.set(Manager.width / 2, Manager.height / 2);
  //  Manager._width = screen.availWidth;
  //  Manager._height = screen.availHeight;

  //  Manager.app.renderer.resize(Manager.width, Manager.height);
  //  Manager.currentScene.scale.set(Manager.scaleRatioX);
  //  Manager.currentScene.position.set(Manager.width / 2, Manager.height / 2);
  //  //Manager.currentScene.transform.position.set(Manager.scaleRatioX, Manager.scaleRatioY);
  //  Manager.app.render();

  //  //// uniform scale for our game
  //  //const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

  //  //// the "uniformly englarged" size for our game
  //  //const enlargedWidth = Math.floor(scale * Manager.width);
  //  //const enlargedHeight = Math.floor(scale * Manager.height);

  //  //// margins for centering our game
  //  //const horizontalMargin = (screenWidth - enlargedWidth) / 2;
  //  //const verticalMargin = (screenHeight - enlargedHeight) / 2;

  //  //// now we use css trickery to set the sizes and margins
  //  //Manager.app.view.style.width = `${enlargedWidth}px`;
  //  //Manager.app.view.style.height = `${enlargedHeight}px`;
  //  //Manager.app.view.style.marginLeft = Manager.app.view.style.marginRight = `${horizontalMargin}px`;
  //  //Manager.app.view.style.marginTop = Manager.app.view.style.marginBottom = `${verticalMargin}px`;
  //}

  public static changeScene(newScene: IScene): void {
    if (Manager.currentScene) {
      console.log('Manager_destroy');
      Manager.app.stage.removeChild(Manager.currentScene);
      Manager.currentScene.destroy();
    }
    Manager.currentScene = newScene;
    Manager.currentScene.alpha = 0;
    Manager.app.stage.addChild(Manager.currentScene);
    gsap.to(Manager.currentScene, {
      pixi: { alpha: 1 },
      duration: 0.3,
    });
  }

  private static update(): void {
    if (Manager.currentScene) {
      Manager.currentScene.update();
    }
  }
}

export interface IScene extends PIXI.DisplayObject {
  update(): void;
  resize(): void;
}
