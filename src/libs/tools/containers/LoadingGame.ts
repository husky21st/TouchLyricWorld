import { Container, Texture, Sprite, Graphics, BitmapText, Text, LINE_JOIN, LINE_CAP, ILineStyleOptions, utils } from 'pixi.js';

//based 1600/800 screen
export class LoadingGame extends Container {
  private frame: Sprite;
  private spaceLine: Graphics;
  private explainJP1: BitmapText;
  private explainJP2: BitmapText;
  private explainJP3: BitmapText;
  private explainJP4: BitmapText;
  private explainEN1: BitmapText;
  private explainEN2: BitmapText;
  private explainEN3: BitmapText;
  public loadingNow: Container;
  private loadingText: BitmapText;
  public loadingCycle: Sprite;
  public startButton: BitmapText;
  constructor() {
    super();

    this.frame = Sprite.from('frame');
    this.addChild(this.frame);

    const LS: ILineStyleOptions = {width: 5, color: 0x111111, alpha: 1, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND};
    this.spaceLine = new Graphics()
      .lineStyle(LS)
      .moveTo(100, 400)
      .lineTo(1500, 400);
    this.addChild(this.spaceLine);

    this.explainJP1 = new BitmapText("歌詞が線のところまで来たらタイミング良くなぞろう！", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 48 });
    this.explainJP1.anchor.set(0.5);
    this.explainJP1.position.set(800, 130);
    this.addChild(this.explainJP1);

    this.explainJP2 = new BitmapText("ビートに合わせて", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 48 });
    this.explainJP2.anchor.set(0.5);
    this.explainJP2.position.set(800, 220);
    this.addChild(this.explainJP2);

    this.explainJP3 = new BitmapText("スペースキーを押すと / 他の指で画面をタップすると", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 48 });
    this.explainJP3.anchor.set(0.5);
    this.explainJP3.position.set(800, 275);
    this.addChild(this.explainJP3);

    this.explainJP4 = new BitmapText("得点アップ！", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 48 });
    this.explainJP4.anchor.set(0.5);
    this.explainJP4.position.set(800, 330);
    this.addChild(this.explainJP4);

    this.explainEN1 = new BitmapText("When the lyrics come to the line, trace them with good timing!", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 42 });
    this.explainEN1.anchor.set(0.5);
    this.explainEN1.position.set(800, 450);
    this.addChild(this.explainEN1);

    this.explainEN2 = new BitmapText("Press the spacebar / Tap the screen with your other finger", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 42 });
    this.explainEN2.anchor.set(0.5);
    this.explainEN2.position.set(800, 540);
    this.addChild(this.explainEN2);

    this.explainEN3 = new BitmapText("on the beat to increase your score!", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 42 });
    this.explainEN3.anchor.set(0.5);
    this.explainEN3.position.set(800, 590);
    this.addChild(this.explainEN3);

    this.loadingNow = new Container();

    this.loadingText = new BitmapText("Loading", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 64 });
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.set(780, 670);
    this.loadingNow.addChild(this.loadingText);

    this.loadingCycle = Sprite.from('loopBack');
    this.loadingCycle.anchor.set(0.5);
    this.loadingCycle.position.set(960, 685);
    this.loadingCycle.scale.set(0.15);
    this.loadingNow.addChild(this.loadingCycle);

    this.addChild(this.loadingNow);

    this.startButton = new BitmapText("> Start <", {fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 64 });
    this.startButton.anchor.set(0.5);
    this.startButton.position.set(800, 670);
    this.startButton.alpha = 0;
    this.startButton.interactive = true;
    this.startButton.buttonMode = true;
    this.addChild(this.startButton);
  }
}