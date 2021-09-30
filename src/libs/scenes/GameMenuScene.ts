import { Container, Sprite, Graphics, BitmapText, Texture } from 'pixi.js';
import gsap from 'gsap';
import { IScene, Manager } from 'libs/manages/Manager';
import { GameScene } from 'libs/scenes/GameScene';

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

const getRandomArbitraryInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export class GameMenuScene extends Container implements IScene {
  private BG: Graphics;
  private _BackGround: BackGround;
  private _Buttons: Buttons;
  private _CreditScreen: CreditScreen;
  private songSelectURL: number = 1;
  private _tick: number = 0;
  private tickInterval: number = 60;
  private loadEnd: boolean = false;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;

    this.sortableChildren = true;

    window.addEventListener('resize', resizeCheck);

    this._Buttons = new Buttons();
    this.addChild(this._Buttons);

    const maxW: number = Math.max(screen.availWidth, document.documentElement.clientWidth);
    const maxH: number = Math.max(screen.availHeight, document.documentElement.clientHeight);
    const maxWH: number = Math.max(maxW, maxH) + 200;

    this.BG = new Graphics().beginFill(0x000000, 0.3).drawRect(0, 0, maxWH, maxWH).endFill();
    this.BG.pivot.set(maxWH / 2, maxWH / 2);
    this.BG.position.set(WR * 50, HR * 50);
    this.BG.interactive = true;
    this.BG.visible = false;
    this.addChild(this.BG);

    this._BackGround = new BackGround();
    this._BackGround.pivot.set(WR * 50, HR * 50);
    this._BackGround.position.set(WR * 50, HR * 50);
    this._BackGround.zIndex = -10000;
    this.addChild(this._BackGround);

    this._CreditScreen = new CreditScreen();
    this._CreditScreen.pivot.set(800, 400);
    this._CreditScreen.position.set(WR * 50, HR * 50);
    this._CreditScreen.scale.set(HR * 0.07);
    this._CreditScreen.alpha = 0;
    this._CreditScreen.visible = false;
    this._CreditScreen.interactive = true;
    this.addChild(this._CreditScreen);

    this._Buttons.song1Button.on('pointertap', () => this.selectSong(1), this);
    this._Buttons.song2Button.on('pointertap', () => this.selectSong(2), this);
    this._Buttons.song3Button.on('pointertap', () => this.selectSong(3), this);
    this._Buttons.song4Button.on('pointertap', () => this.selectSong(4), this);
    this._Buttons.song5Button.on('pointertap', () => this.selectSong(5), this);
    this._Buttons.song6Button.on('pointertap', () => this.selectSong(6), this);

    this._Buttons.playButton.on('pointertap', this.handlePlayButton, this);
    this._Buttons.creditButton.on('pointertap', this.showCredit, this);
    this.BG.on('pointertap', this.hideCredit, this);

    this.loadGameMenu();
  }

  private loadGameMenu(): void {
    const WR: number = Manager.wr;
    const gameMenuTL: gsap.core.Timeline = gsap.timeline();
    gameMenuTL
      .to(this._Buttons.song1Button, {
        pixi: {
          x: WR * 77,
        },
        duration: 2,
        ease: 'elastic.out(1, 0.4)',
      })
      .to(this._Buttons.song2Button, {
        pixi: {
          x: WR * 80,
        },
        duration: 2,
        delay: -1.8,
        ease: 'elastic.out(1, 0.4)',
      })
      .to(this._Buttons.song3Button, {
        pixi: {
          x: WR * 80,
        },
        duration: 2,
        delay: -1.8,
        ease: 'elastic.out(1, 0.4)',
      })
      .to(this._Buttons.song4Button, {
        pixi: {
          x: WR * 80,
        },
        duration: 2,
        delay: -1.8,
        ease: 'elastic.out(1, 0.4)',
      })
      .to(this._Buttons.song5Button, {
        pixi: {
          x: WR * 80,
        },
        duration: 2,
        delay: -1.8,
        ease: 'elastic.out(1, 0.4)',
      })
      .to(this._Buttons.song6Button, {
        pixi: {
          x: WR * 80,
        },
        duration: 2,
        delay: -1.8,
        ease: 'elastic.out(1, 0.4)',
        onComplete: () => {
          this.loadEnd = true;
        },
      });
  }

  private selectSong(songURL: number): void {
    const WR: number = Manager.wr;
    this.songSelectURL = songURL;
    for (let i = 0; i < 6; i++) {
      this._Buttons.songButtons[i].alpha = 0.5;
      this._Buttons.songButtons[i].x = WR * 80;
    }
    this._Buttons.songButtons[songURL - 1].alpha = 1;
    this._Buttons.songButtons[songURL - 1].x = WR * 77;
  }

  private showCredit(): void {
    this.BG.visible = true;
    this._CreditScreen.visible = true;
    this._CreditScreen.alpha = 1;
  }

  private hideCredit(): void {
    this.BG.visible = false;
    this._CreditScreen.visible = false;
    this._CreditScreen.alpha = 0;
  }

  private handlePlayButton(): void {
    this._Buttons.playButton.interactive = false;
    window.removeEventListener('resize', resizeCheck);
    gsap.to(this, {
      pixi: { alpha: 0 },
      duration: 0.5,
      onComplete: () => Manager.changeScene(new GameScene(this.songSelectURL)),
    });
  }

  public update(): void {
    this._tick++;
    if (this._tick % this.tickInterval === 0) {
      this._BackGround.rainRose();
      this.tickInterval = getRandomArbitraryInt(30, 80);
      this._tick = 0;
    }
  }

  public resize(): void {
    if (!this.loadEnd) return;
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const BasedScale: number = WR / 25;

    this.BG.position.set(WR * 50, HR * 50);

    this._CreditScreen.position.set(WR * 50, HR * 50);
    this._CreditScreen.scale.set(HR * 0.07);

    this._Buttons.title.position.set(WR * 25, HR * 43);
    this._Buttons.title.scale.set(BasedScale * 1.3);

    this._Buttons.playButton.position.set(WR * 86, HR * 90);
    this._Buttons.playButton.scale.set(BasedScale);

    this._Buttons.creditButton.position.set(WR * 59, HR * 90);
    this._Buttons.creditButton.scale.set(BasedScale);

    this._Buttons.song1Button.position.set(WR * 80, HR * 11);
    this._Buttons.song1Button.scale.set(BasedScale);

    this._Buttons.song2Button.position.set(WR * 80, HR * 23);
    this._Buttons.song2Button.scale.set(BasedScale);

    this._Buttons.song3Button.position.set(WR * 80, HR * 35);
    this._Buttons.song3Button.scale.set(BasedScale);

    this._Buttons.song4Button.position.set(WR * 80, HR * 47);
    this._Buttons.song4Button.scale.set(BasedScale);

    this._Buttons.song5Button.position.set(WR * 80, HR * 59);
    this._Buttons.song5Button.scale.set(BasedScale);

    this._Buttons.song6Button.position.set(WR * 80, HR * 71);
    this._Buttons.song6Button.scale.set(BasedScale);

    this._BackGround.position.set(WR * 50, HR * 50);
    this.selectSong(this.songSelectURL);
  }
}

//based 1600/800 screen
class CreditScreen extends Container {
  private frame: Sprite;
  private creditTitle: BitmapText;
  private credit1: BitmapText;
  private credit2: BitmapText;
  private specialTitle: BitmapText;
  private SP1: BitmapText;
  private SP2: BitmapText;
  constructor() {
    super();

    this.frame = Sprite.from('frame');
    this.addChild(this.frame);

    this.creditTitle = new BitmapText('Credit', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 112,
    });
    this.creditTitle.anchor.set(0.5);
    this.creditTitle.position.set(800, 130);
    this.addChild(this.creditTitle);

    this.credit1 = new BitmapText('Plan&Program:huskyB4ll', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 48,
    });
    this.credit1.anchor.set(0.5);
    this.credit1.position.set(800, 260);
    this.addChild(this.credit1);

    this.credit2 = new BitmapText(
      'Cheering Miku Picture:ねこみん(@nukotun)   Menu&Result Graphic:つぼ(@tsubo_pi)',
      { fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 32 },
    );
    this.credit2.anchor.set(0.5);
    this.credit2.position.set(800, 330);
    this.addChild(this.credit2);

    this.specialTitle = new BitmapText('Special Thanks', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 112,
    });
    this.specialTitle.anchor.set(0.5);
    this.specialTitle.position.set(800, 456);
    this.addChild(this.specialTitle);

    this.SP1 = new BitmapText('All Vocaloid fans', {
      fontName: 'BasicRocknRoll',
      tint: 0x000000,
      fontSize: 48,
    });
    this.SP1.anchor.set(0.5);
    this.SP1.position.set(800, 590);
    this.addChild(this.SP1);

    this.SP2 = new BitmapText('You', { fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 48 });
    this.SP2.anchor.set(0.5);
    this.SP2.position.set(800, 655);
    this.addChild(this.SP2);
  }
}

class Buttons extends Container {
  public title: Sprite;
  public playButton: Sprite;
  public creditButton: Sprite;
  public songButtons: Array<Sprite>;
  public song1Button: Sprite;
  public song2Button: Sprite;
  public song3Button: Sprite;
  public song4Button: Sprite;
  public song5Button: Sprite;
  public song6Button: Sprite;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const BasedScale: number = WR / 25;

    this.title = Sprite.from('title');
    this.title.anchor.set(0.5);
    this.title.position.set(WR * 25, HR * 43);
    this.title.scale.set(BasedScale * 1.3);
    this.addChild(this.title);

    this.playButton = Sprite.from('titlePlayButton');
    this.playButton.anchor.set(0.5);
    this.playButton.position.set(WR * 86, HR * 90);
    this.playButton.scale.set(BasedScale);
    this.playButton.interactive = true;
    this.playButton.buttonMode = true;
    this.addChild(this.playButton);

    this.creditButton = Sprite.from('titleCreditButton');
    this.creditButton.anchor.set(0.5);
    this.creditButton.position.set(WR * 59, HR * 90);
    this.creditButton.scale.set(BasedScale);
    this.creditButton.interactive = true;
    this.creditButton.buttonMode = true;
    this.addChild(this.creditButton);

    this.songButtons = new Array();

    this.song1Button = Sprite.from('songTitle1');
    this.song1Button.anchor.set(0.5);
    this.song1Button.position.set(WR * 130, HR * 11);
    this.song1Button.scale.set(BasedScale);
    this.song1Button.alpha = 1;
    this.song1Button.interactive = true;
    this.song1Button.buttonMode = true;
    this.addChild(this.song1Button);
    this.songButtons.push(this.song1Button);

    this.song2Button = Sprite.from('songTitle2');
    this.song2Button.anchor.set(0.5);
    this.song2Button.position.set(WR * 130, HR * 23);
    this.song2Button.scale.set(BasedScale);
    this.song2Button.alpha = 0.5;
    this.song2Button.interactive = true;
    this.song2Button.buttonMode = true;
    this.addChild(this.song2Button);
    this.songButtons.push(this.song2Button);

    this.song3Button = Sprite.from('songTitle3');
    this.song3Button.anchor.set(0.5);
    this.song3Button.position.set(WR * 130, HR * 35);
    this.song3Button.scale.set(BasedScale);
    this.song3Button.alpha = 0.5;
    this.song3Button.interactive = true;
    this.song3Button.buttonMode = true;
    this.addChild(this.song3Button);
    this.songButtons.push(this.song3Button);

    this.song4Button = Sprite.from('songTitle4');
    this.song4Button.anchor.set(0.5);
    this.song4Button.position.set(WR * 130, HR * 47);
    this.song4Button.scale.set(BasedScale);
    this.song4Button.alpha = 0.5;
    this.song4Button.interactive = true;
    this.song4Button.buttonMode = true;
    this.addChild(this.song4Button);
    this.songButtons.push(this.song4Button);

    this.song5Button = Sprite.from('songTitle5');
    this.song5Button.anchor.set(0.5);
    this.song5Button.position.set(WR * 130, HR * 59);
    this.song5Button.scale.set(BasedScale);
    this.song5Button.alpha = 0.5;
    this.song5Button.interactive = true;
    this.song5Button.buttonMode = true;
    this.addChild(this.song5Button);
    this.songButtons.push(this.song5Button);

    this.song6Button = Sprite.from('songTitle6');
    this.song6Button.anchor.set(0.5);
    this.song6Button.position.set(WR * 130, HR * 71);
    this.song6Button.scale.set(BasedScale);
    this.song6Button.alpha = 0.5;
    this.song6Button.interactive = true;
    this.song6Button.buttonMode = true;
    this.addChild(this.song6Button);
    this.songButtons.push(this.song6Button);
  }
}

class BackGround extends Container {
  private rainPlace: Array<number>;
  private basicRose: Texture;
  private roses: Array<Sprite>;
  private roseNow: number = 0;
  private baseW: number = Manager.wr;
  private baseH: number = Manager.hr;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;

    const baseSpaceW: number = (WR * 100) / 15;

    this.rainPlace = new Array(30);
    for (let i = 0; i < 30; i++) {
      let pointW: number = getRandomArbitraryInt(baseSpaceW, baseSpaceW * 20);
      if (i !== 0) {
        if (Math.abs(this.rainPlace[i] - pointW) < baseSpaceW) {
          pointW = getRandomArbitraryInt(baseSpaceW, baseSpaceW * 20);
        }
      }
      this.rainPlace[i] = pointW;
    }

    this.basicRose = Texture.from('rosePink');

    this.roses = new Array();

    for (let i = 0; i < 30; i++) {
      const rose = Sprite.from(this.basicRose);
      rose.anchor.set(0.5);
      rose.alpha = 0.8;
      rose.scale.set(WR * 0.015);
      rose.position.set(-WR * 10, -HR * 10);
      this.addChild(rose);
      this.roses.push(rose);
    }
  }

  public rainRose(): void {
    this.roseNow++;
    if (this.roseNow >= 30) this.roseNow = 0;
    const rainTarget: Sprite = this.roses[this.roseNow];
    gsap.killTweensOf(rainTarget);
    rainTarget.position.set(this.rainPlace[this.roseNow], -this.baseH * 20);
    gsap.to(rainTarget, {
      pixi: {
        x: '-=' + this.baseW * 30,
        y: '+=' + this.baseH * 140,
        rotation: '-=' + 720,
      },
      duration: 10,
      ease: 'none',
    });
  }
}
