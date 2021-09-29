import { Container, Texture, Sprite, Graphics, Loader, Text, BitmapFont, utils } from 'pixi.js';
import { gsap } from 'gsap';
import { assets } from 'libs/asset/assets';
import { IScene, Manager } from 'libs/manages/Manager';
import { SuggestLandscapeModeScene } from 'libs/scenes/SuggestLandscapeModeScene';
import { GameMenuScene } from 'libs/scenes/GameMenuScene';

export class LoaderScene extends Container implements IScene {
  private _LoadingFlower: LoadingFlower;
  private loadingText: Text;
  private tick: number;
  constructor() {
    super();
    console.log('resolution', window.devicePixelRatio);
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    utils.destroyTextureCache();
    this.sortableChildren = true;
    this.tick = 0;

    this.loadingText = new Text('Loading.', {
      fontFamily: 'RocknRoll One',
      fill: 0x000000,
      fontSize: 64,
    });
    this.loadingText.resolution = 2;
    this.loadingText.anchor.y = 0.5;
    this.loadingText.position.set(WR * 35, HR * 50);
    this.loadingText.scale.set(TR * 2);
    this.loadingText.zIndex = 100;
    this.addChild(this.loadingText);

    this._LoadingFlower = new LoadingFlower();
    this._LoadingFlower.position.set(WR * 50, HR * 50);
    this._LoadingFlower.scale.set(WR < HR? HR * 0.15: WR * 0.1);
    this._LoadingFlower.alpha = 0.5;
    this.addChild(this._LoadingFlower);

    Loader.shared.add(assets);
    
    Loader.shared.onProgress.add(this.downloadProgress, this);
    Loader.shared.onComplete.once(this.gameLoaded, this);
    Loader.shared.onError.once(this.errorHandle, this);

    Loader.shared.load();
  }

  private downloadProgress(loader: Loader): void {
    this._LoadingFlower.flowermask.y = - (loader.progress * 4);
  }

  private gameLoaded(): void {
    this.initSetting();
    this._LoadingFlower.flowermask.visible = false;
    gsap.to(this, {
      pixi: { alpha: 0 },
      duration: 0.5,
      delay: 0.2,
      onComplete: this.changeScene,
    });
  }

  private errorHandle(): void {
    setTimeout(() => {
      if(window !== undefined){
        window.location.reload();
      }else{
        location.reload();
      }
    }, 1000);
  }

  private initSetting(): void {
    //this.setAssetsVolume();
    let CustomResolution: number = 2;
    if(utils.isMobile.any)CustomResolution = 1;
    BitmapFont.from(
      'BasicRocknRoll',
      {
        fontFamily: 'RocknRoll One',
        fill: '#ffffff',
        fontSize: 96,
      },
      {
        resolution: CustomResolution,
        chars:
          Loader.shared.resources['fontText'].data.required.join('') +
          Loader.shared.resources['fontText'].data.text.join(''),
      },
    );

    BitmapFont.from(
      'ScoreRocknRoll',
      {
        fontFamily: 'RocknRoll One',
        fontSize: 48,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#039393'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
      },
      {
        resolution: CustomResolution,
        chars:
          Loader.shared.resources['fontText'].data.required.join(''),
      },
    );
  }

  private changeScene() {
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (screenWidth < screenHeight || false) {
      Manager.changeScene(new SuggestLandscapeModeScene());
    } else {
      Manager.changeScene(new GameMenuScene());
    }
  }

  public update(): void {
    this.tick += 1;
    if (this.tick === 90) this.tick = 0;
    if (this.tick < 30) {
      this.loadingText.text = 'Loading.';
    } else if (this.tick < 60) {
      this.loadingText.text = 'Loading..';
    } else {
      this.loadingText.text = 'Loading...';
    }
  }

  public resize(): void {}
}

class LoadingFlower extends Container {
  private flower: Texture;
  private flowerBGSprite: Sprite;
  private flowerSprite: Sprite;
  public flowermask: Graphics;

  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.flower = Texture.from('LoadingMiku.png');

    this.flowerSprite = Sprite.from(this.flower);
    this.addChild(this.flowerSprite);

    this.flowerBGSprite = Sprite.from(this.flower);
    this.addChild(this.flowerBGSprite);

    this.flowermask = new Graphics()
      .beginFill(0x000000, 1)
      .drawRect(0, 0, 400, 400)
      .endFill();
    this.addChild(this.flowermask);

    this.flowermask.mask = this.flowerBGSprite;

    this.pivot.set(400 / 2, 400 / 2);
  }
}
