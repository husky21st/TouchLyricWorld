import { Container, Texture, Sprite, Graphics, Loader, Text, BitmapFont } from 'pixi.js';
import { sound } from '@pixi/sound';
import { gsap } from 'gsap';
import { assets } from 'libs/asset/assets';
import { IScene, Manager } from 'libs/manages/Manager';
import { SuggestLandscapeModeScene } from 'libs/scenes/SuggestLandscapeModeScene';
import { GameMenuScene } from 'libs/scenes/GameMenuScene';

export class LoaderScene extends Container implements IScene {
  private loadingFlower: Container;
  private loadingText: Text;
  private tick: number;
  constructor() {
    super();
    console.log('Loader_cons');
    console.log('resolution', window.devicePixelRatio);
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;
    this.tick = 0;

    this.loadingText = new Text('Loading.', {
      fontFamily: 'RocknRoll One',
      fill: 0x000000,
      fontSize: 128,
    });
    this.loadingText.resolution = 4;
    console.log('loadingTEXTRESOLUTION', this.loadingText.resolution);
    this.loadingText.anchor.y = 0.5;
    this.loadingText.position.set(WR * 35, HR * 50);
    this.loadingText.scale.set(TR);
    this.loadingText.zIndex = 100;
    this.addChild(this.loadingText);

    this.loadingFlower = new LoadingFlower();
    this.loadingFlower.position.set(WR * 50, HR * 50);
    this.loadingFlower.scale.set(HR * 0.1);
    this.loadingFlower.alpha = 0.7;
    this.addChild(this.loadingFlower);

    Loader.shared.add(assets);

    Loader.shared.onProgress.add(this.downloadProgress, this);
    Loader.shared.onComplete.once(this.gameLoaded, this);

    Loader.shared.load();

    //gsap.to(LoadingFlower.flowermask, {
    //  pixi: {y: -575}, duration: 10,
    //});
  }

  private downloadProgress(loader: Loader): void {
    LoadingFlower.flowermask.y = -(loader.progress * 5.75);
  }

  private gameLoaded(): void {
    this.initSetting();
    LoadingFlower.flowermask.visible = false;
    gsap.to(this, {
      pixi: { alpha: 0 },
      duration: 0.8,
      delay: 0.2,
      onComplete: this.changeScene,
    });
  }

  private initSetting(): void {
    //this.setAssetsVolume();
    BitmapFont.from(
      'RocknRoll',
      {
        fontFamily: 'RocknRoll One',
        fill: '#ffffff',
        fontSize: 96,
      },
      {
        resolution: 4,
        chars: Loader.shared.resources['fontText'].data.text,
      },
    );
  }

  private setAssetsVolume(): void {
    //sound.volume('highPointSE', 100);
    //sound.volumeAll = 0.5;
  }

  private changeScene() {
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (screenWidth < screenHeight || true) {
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
  public static flowermask: Graphics;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.flower = Texture.from('Shapes/redTarget.png');

    this.flowerSprite = Sprite.from(this.flower);
    this.addChild(this.flowerSprite);

    this.flowerBGSprite = Sprite.from(this.flower);
    this.addChild(this.flowerBGSprite);

    LoadingFlower.flowermask = new Graphics()
      .beginFill(0x000000, 0.8)
      .drawRect(0, 0, 575, 575)
      .endFill();
    this.addChild(LoadingFlower.flowermask);

    LoadingFlower.flowermask.mask = this.flowerBGSprite;

    this.pivot.set(575 / 2, 575 / 2);
  }
}
