import { Container, BitmapText } from 'pixi.js';
import gsap from 'gsap';
import { IScene, Manager } from 'libs/manages/Manager';
import { GameMenuScene } from 'libs/scenes/GameMenuScene';

let resizeTimer: number = 0;
const resizeCheck = (): void => {
  if (resizeTimer > 0) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = window.setTimeout(function (): void {
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    Manager._onResize(screenWidth, screenHeight);
  }, 300);
};

export class SuggestLandscapeModeScene extends Container implements IScene {
  private suggestText1: BitmapText;
  private suggestText2: BitmapText;
  private suggestText3: BitmapText;
  private continueButton: BitmapText;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    window.addEventListener('resize', resizeCheck);

    this.suggestText1 = new BitmapText('横画面推奨です', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 64,
    });
    this.suggestText1.anchor.set(0.5);
    this.suggestText1.position.set(WR * 50, HR * 40);
    this.suggestText1.scale.set(TR * 2);
    this.addChild(this.suggestText1);

    this.suggestText2 = new BitmapText('please play the game in landscape mode', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 64,
    });
    this.suggestText2.anchor.set(0.5);
    this.suggestText2.position.set(WR * 50, HR * 50);
    this.suggestText2.scale.set(TR);
    this.addChild(this.suggestText2);

    this.suggestText3 = new BitmapText('パソコンの場合は画面を横に長くしてから遊んでください', {
      fontName: 'BasicRocknRoll',
      tint: 0x707070,
      fontSize: 72,
    });
    this.suggestText3.anchor.set(0.5);
    this.suggestText3.position.set(WR * 50, HR * 60);
    this.suggestText3.scale.set(TR);
    this.addChild(this.suggestText3);

    this.continueButton = new BitmapText('> Continue <', {
      fontName: 'BasicRocknRoll',
      tint: 0x707070,
      fontSize: 64,
    });
    this.continueButton.anchor.set(0.5);
    this.continueButton.position.set(WR * 50, HR * 80);
    this.continueButton.scale.set(TR);
    this.continueButton.alpha = 0;
    this.continueButton.interactive = true;
    this.continueButton.buttonMode = true;
    this.continueButton.on('pointertap', this.goGameMenuScene, this);
    this.addChild(this.continueButton);

    gsap.to(this.continueButton, {
      pixi: { alpha: 1 },
      duration: 0.2,
      delay: 1.5,
    });
  }

  private goGameMenuScene(): void {
    this.continueButton.interactive = false;
    window.removeEventListener('resize', resizeCheck);
    gsap.to(this, {
      pixi: { alpha: 0 },
      duration: 0.5,
      onComplete: () => Manager.changeScene(new GameMenuScene()),
    });
  }

  public update(): void {}

  public resize(): void {
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.suggestText1.position.set(WR * 50, HR * 37);
    this.suggestText1.scale.set(TR * 1.6);

    this.suggestText2.position.set(WR * 50, HR * 50);
    this.suggestText2.scale.set(TR * 0.8);

    this.suggestText3.position.set(WR * 50, HR * 60);
    this.suggestText3.scale.set(TR * 0.8);

    this.continueButton.position.set(WR * 50, HR * 80);
    this.continueButton.scale.set(TR * 0.8);
  }
}
