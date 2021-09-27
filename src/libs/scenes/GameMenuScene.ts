import { Container, Graphics, BitmapText, InteractionEvent } from 'pixi.js';
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';

export class GameMenuScene extends Container implements IScene {
  private text: BitmapText;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.text = new BitmapText("aaa", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 64 });
    this.text.anchor.set(0.5);
    this.text.position.set(WR * 50, HR * 50);
    this.text.scale.set(TR);
    this.addChild(this.text);
  }


  public update(): void {}

  public resize(): void {}
}