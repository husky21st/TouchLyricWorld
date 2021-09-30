import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { WebfontLoaderPlugin } from 'pixi-webfont-loader';

export class Manager {
  private constructor() {}

  private static app: PIXI.Application;
  private static currentScene: IScene;

  private static _width: number;
  private static _height: number;

  //for TextAliveApp
  public static isSafari: boolean;
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

  public static initialize(
    canvas: HTMLCanvasElement,
    mediaElement: HTMLDivElement,
    width: number,
    height: number,
  ): void {
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
    const _userAgent: string = window.navigator.userAgent.toLowerCase();
    this.isSafari = false;
    if (_userAgent.indexOf('edge') != -1) {
    } else if (_userAgent.indexOf('chrome') != -1) {
    } else if (_userAgent.indexOf('safari') != -1) {
      this.isSafari = true;
    } else if (_userAgent.indexOf('firefox') != -1) {
    } else if (_userAgent.indexOf('opera') != -1) {
    } else {
      this.isSafari = true;
    }
    if (this.isSafari) {
      PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;
    }
  }

  //resize Event
  public static _onResize(WIDTH: number, HEIGHT: number): void {
    Manager._width = WIDTH;
    Manager._height = HEIGHT;

    Manager.app.renderer.resize(Manager.width, Manager.height);
    if (Manager.currentScene) {
      Manager.currentScene.resize();
    }
    Manager.app.render();
    //for ios safari
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 200);
  }

  public static changeScene(newScene: IScene): void {
    if (Manager.currentScene) {
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
