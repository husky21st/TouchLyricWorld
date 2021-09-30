import { Container, Sprite, BitmapText } from 'pixi.js';

//based 1600/800 screen
export class Result extends Container {
  private frame: Sprite;
  private mikuBG: Sprite;
  private resultText: Sprite;
  private twitterLogo: Sprite;
  public scoreText: BitmapText;
  public scoreNumber: BitmapText;
  public songTitle: BitmapText;
  public songArtist: BitmapText;
  private backToMenu: BitmapText;
  private twitterTag: BitmapText;
  public full: BitmapText;
  public combo: BitmapText;
  constructor() {
    super();

    this.frame = Sprite.from('frame');
    this.addChild(this.frame);

    this.mikuBG = Sprite.from('DancingMiku/loadResultMiku.png');
    this.mikuBG.scale.set(1);
    this.mikuBG.position.set(50, 360);
    this.addChild(this.mikuBG);

    this.resultText = Sprite.from('resultText');
    this.resultText.anchor.set(0.5);
    this.resultText.position.set(810, 190);
    this.addChild(this.resultText);

    this.twitterLogo = Sprite.from('twitterLogo');
    this.twitterLogo.scale.set(0.04);
    this.twitterLogo.position.set(1134, 690);
    this.addChild(this.twitterLogo);

    this.scoreText = new BitmapText(' TOTAL SCORE', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 96,
    });
    this.scoreText.anchor.set(0.5);
    this.scoreText.position.set(820, 340);
    this.scoreText.alpha = 0;
    this.addChild(this.scoreText);

    this.scoreNumber = new BitmapText(' 0000000', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 96,
    });
    this.scoreNumber.anchor.set(0.5);
    this.scoreNumber.position.set(815, 470);
    this.scoreNumber.alpha = 0;
    this.addChild(this.scoreNumber);

    this.songTitle = new BitmapText('First Note', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 42,
    });
    this.songTitle.anchor.set(1, 0);
    this.songTitle.position.set(1520, 70);
    this.addChild(this.songTitle);

    this.songArtist = new BitmapText('- blues', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 26,
    });
    this.songArtist.anchor.set(1, 0);
    this.songArtist.position.set(1520, 120);
    this.addChild(this.songArtist);

    this.backToMenu = new BitmapText('> Back to Menu <', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 48,
    });
    this.backToMenu.anchor.set(0.5);
    this.backToMenu.position.set(807, 650);
    this.backToMenu.alpha = 0.5;
    this.backToMenu.interactive = true;
    this.backToMenu.buttonMode = true;
    this.backToMenu.on('pointertap', this._backToMenu, this);
    this.addChild(this.backToMenu);

    this.twitterTag = new BitmapText('#TouchLyricWorld', {
      fontName: 'BasicRocknRoll',
      tint: 0x00acee,
      fontSize: 36,
    });
    this.twitterTag.anchor.set(0.5);
    this.twitterTag.position.set(1350, 700);
    this.addChild(this.twitterTag);

    this.full = new BitmapText('FULL', {
      fontName: 'FullComboRocknRoll',
      tint: 0xe6c422,
      fontSize: 96,
    });
    this.full.anchor.set(0.4, 0.5);
    this.full.position.set(360, 600);
    this.full.angle = -90;
    this.full.alpha = 0;
    this.addChild(this.full);

    this.combo = new BitmapText('COMBO', {
      fontName: 'FullComboRocknRoll',
      tint: 0xe6c422,
      fontSize: 96,
    });
    this.combo.anchor.set(0.4, 0.5);
    this.combo.position.set(1270, 200);
    this.combo.angle = 90;
    this.combo.alpha = 0;
    this.addChild(this.combo);
  }

  private _backToMenu(): void {
    window.location.reload();
  }
}
