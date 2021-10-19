import {
  Container,
  Texture,
  Sprite,
  Graphics,
  BitmapText,
  filters,
  Loader,
  DisplayObject,
} from 'pixi.js';
import {
  IBeat,
  IChar,
  IPhrase,
  IPlayerApp,
  IVideo,
  Player,
  Timer,
  ValenceArousalValue,
} from 'textalive-app-api';
import gsap from 'gsap';
import { IScene, Manager } from 'libs/manages/Manager';
import { LoadingGame } from 'libs/tools/containers/LoadingGame';
import { TouchLine } from 'libs/tools/containers/TouchLine';
import { LyricText } from 'libs/tools/containers/LyricText';
import { Result } from 'libs/tools/containers/Result';
import { MoveTextTypes } from 'libs/tools/others/MoveTextTypes';
import { CharInfo, PhraseInfo, POINT } from 'libs/tools/others/types';

const fixScore7Text = (score: number): string => {
  const newScore: number = Math.round(score);
  return ('0000000' + newScore).slice(-7);
};

const fixScore5Text = (score: number): string => {
  const newScore: number = Math.round(score);
  return ('00000' + newScore).slice(-5);
};

const getRandomArbitraryInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export class GameScene extends Container implements IScene {
  //for Pixi
  private phraseLineNumber: number;
  private isGameNow: boolean;
  private fontLoaded: boolean;
  private _LoadingGame: LoadingGame;
  private _Result: Result;
  private _LyricText: LyricText | null = null;
  private _BeatSprite: BeatSprite | null = null;
  private _ScoreText: ScoreText | null = null;
  private _SomeSprite: SomeSprite;
  private _TouchLine: TouchLine;
  private fakeBG: Graphics;
  private playButton: Sprite;
  private pauseButton: Sprite;
  private backToMenu: BitmapText;
  private bg: Graphics;
  //for TextAlive
  private _player: Player;
  private SONGURL: number;
  private isFirst: boolean;
  private charBuffer: IChar | null = null;
  private phraseBuffer: IPhrase | null = null;
  private beatBuffer: IBeat | null = null;
  private beatDuration: number;
  private basedScore: number;
  private bonusScore: number;
  private beatTouched: boolean;
  private beatOnce: boolean;
  private maxCombo: number;
  private _tick: number = 0;
  private tickInterval: number = 20;
  //Others
  private _MoveTextTypes: MoveTextTypes | null = null;
  constructor(songURL: number = 1) {
    super();
    /**
     * PIXI Init Setting
     */
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;

    this.phraseLineNumber = 0;
    this.isGameNow = false;
    this.fontLoaded = false;

    this._LoadingGame = new LoadingGame();
    this._LoadingGame.pivot.set(800, 400);
    this._LoadingGame.position.set(WR * 50, HR * 50);
    this._LoadingGame.scale.set(HR * 0.08);
    this._LoadingGame.zIndex = 10000;
    this.addChild(this._LoadingGame);
    gsap.to(this._LoadingGame.loadingCycle, {
      pixi: { rotation: -359 },
      duration: 2,
      repeat: -1,
      ease: 'none',
    });

    this._Result = new Result();
    this._Result.pivot.set(800, 400);
    this._Result.position.set(WR * 50, HR * 50);
    this._Result.scale.set(HR * 0.09);
    this._Result.zIndex = 9999;
    this._Result.alpha = 0;
    this._Result.visible = false;
    this.addChild(this._Result);

    this._SomeSprite = new SomeSprite(songURL);
    this._SomeSprite.zIndex = -999;
    this.addChild(this._SomeSprite);

    this._TouchLine = new TouchLine();
    this._TouchLine.scale.set((WR * 100) / 1920, (HR * 100) / 1080);
    this.addChild(this._TouchLine);

    /**
     * Screen Event
     */
    this.bg = new Graphics()
      .beginFill(0x000000)
      .drawRect(0, 0, WR * 100, HR * 100)
      .endFill();
    this.bg.alpha = 0;
    this.bg.zIndex = -10;
    this.bg.interactive = true;
    this.bg.buttonMode = false;
    this.bg.visible = false;
    this.addChild(this.bg);

    this.fakeBG = new Graphics()
      .beginFill(0x000000, 0.3)
      .drawRect(0, 0, WR * 100, HR * 100)
      .endFill();
    this.fakeBG.zIndex = 999;
    this.addChild(this.fakeBG);

    this.playButton = Sprite.from('gamePlayButton');
    this.playButton.anchor.set(0.5);
    this.playButton.position.set(WR * 50, HR * 50);
    this.playButton.scale.set(WR * 0.03);
    this.playButton.alpha = 0.5;
    this.playButton.zIndex = 1500;
    this.playButton.interactive = true;
    this.playButton.buttonMode = true;
    this.playButton.visible = false;
    this.playButton.on('pointertap', this._requestPlay, this);
    this.addChild(this.playButton);

    this.pauseButton = Sprite.from('gamePauseButton');
    this.pauseButton.anchor.set(0.5);
    this.pauseButton.position.set(WR * 50, HR * 2.5);
    this.pauseButton.scale.set(WR * 0.007);
    this.pauseButton.alpha = 0.5;
    this.pauseButton.zIndex = 500;
    this.pauseButton.interactive = true;
    this.pauseButton.buttonMode = true;
    this.pauseButton.visible = true;
    this.pauseButton.on('pointertap', this._requestPause, this);
    this.addChild(this.pauseButton);

    this.backToMenu = new BitmapText('Back to Menu', {
      fontName: 'BasicRocknRoll',
      tint: 0x333333,
      fontSize: 64,
    });
    this.backToMenu.anchor.set(0.5);
    this.backToMenu.position.set(WR * 50, HR * 75);
    this.backToMenu.scale.set(TR * 1.4);
    this.backToMenu.interactive = true;
    this.backToMenu.buttonMode = true;
    this.backToMenu.visible = false;
    this.backToMenu.on('pointertap', this._backToMenu, this);
    this.addChild(this.backToMenu);

    /**
     * TextAlive Init Setting
     */
    this.SONGURL = songURL;
    this.isFirst = true;
    this._player = new Player({
      app: { token: process.env.NEXT_PUBLIC_API_TOKEN || '' },
      // V : due to unknown font loading timing -> pixi-webfont-loader
      //fontFamilies: [{ key: 'Yusei Magic', en: 'Yusei Magic', google: true }],
      mediaElement: Manager._media as HTMLElement,
      mediaBannerPosition: null,
      valenceArousalEnabled: true,
      vocalAmplitudeEnabled: true,
    });

    this._player.addListener({
      onAppReady: (app: IPlayerApp) => this._onAppReady(app),
      onVideoReady: (video: IVideo) => this._onVideoReady(video),
      onTimerReady: (timer: Timer) => this._onTimerReady(timer),
      onPlay: () => this._onPlay(),
      onPause: () => this._onPause(),
      onTimeUpdate: (pos: number) => this._onTimeUpdate(pos),
    });

    this.beatDuration = 3000;
    this.basedScore = 0;
    this.bonusScore = 0;
    this.beatTouched = false;
    this.beatOnce = false;
    this.maxCombo = 0;
  }

  private _onAppReady(app: IPlayerApp): void {
    //check -> Player.app.managed
    console.log('%c!AppReady', 'color: aqua');
    if (!app.songUrl) {
      if (this.SONGURL === 1) {
        // blues / First Note
        // https://piapro.jp/t/FDb1/20210213190029
        this._player.createFromSongUrl('https://piapro.jp/t/FDb1/20210213190029', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
            beatId: 3996956,
            chordId: 2130399,
            repetitiveSegmentId: 2099561,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
            lyricId: 52065,
            lyricDiffId: 5093,
          },
        });
      } else if (this.SONGURL === 2) {
        // 真島ゆろ / 嘘も本当も君だから
        this._player.createFromSongUrl('https://www.youtube.com/watch?v=Se89rQPp5tk', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121405/history
            beatId: 3953908,
            chordId: 2130374,
            repetitiveSegmentId: 2099661,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYW_d%2F20210206123357
            lyricId: 52061,
            lyricDiffId: 5123,
          },
        });
      } else if (this.SONGURL === 3) {
        // ラテルネ / その心に灯る色は
        this._player.createFromSongUrl('http://www.youtube.com/watch?v=bMtYf3R0zhY', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121404/history
            beatId: 3953902,
            chordId: 2130383,
            repetitiveSegmentId: 2099660,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=bMtYf3R0zhY
            lyricId: 52093,
            lyricDiffId: 5177,
          },
        });
      } else if (this.SONGURL === 4) {
        // シロクマ消しゴム / 夏をなぞって
        this._player.createFromSongUrl('https://www.youtube.com/watch?v=3wbZUkPxHEg', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121406/history
            beatId: 3953764,
            chordId: 2130372,
            repetitiveSegmentId: 2099662,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FR6EN%2F20210222075543
            lyricId: 52062,
            lyricDiffId: 5133,
          },
        });
      } else if (this.SONGURL === 5) {
        // 濁茶 / 密かなる交信曲
        this._player.createFromSongUrl('http://www.youtube.com/watch?v=Ch4RQPG1Tmo', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121407/history
            beatId: 3953917,
            chordId: 2130385,
            repetitiveSegmentId: 2099665,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=Ch4RQPG1Tmo
            lyricId: 52063,
            lyricDiffId: 5149,
          },
        });
      } else {
        // chiquewa / Freedom!
        this._player.createFromSongUrl('https://www.youtube.com/watch?v=pAaD4Hta0ns', {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121403/history
            beatId: 3953761,
            chordId: 2130375,
            repetitiveSegmentId: 2099586,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FN--x%2F20210204215604
            lyricId: 52094,
            lyricDiffId: 5171,
          },
        });
      }
    }
    this._player.volume = 50;
  }

  private _onVideoReady(video: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady', 'color: aqua');
    const beatAveData: IBeat = this._player.findBeat(video.firstPhrase.endTime);
    let lastBeat: IBeat = beatAveData;
    while (lastBeat.next !== null) {
      lastBeat = lastBeat.next;
    }
    this.beatDuration = beatAveData.duration;
    this._BeatSprite = new BeatSprite();
    this._BeatSprite.zIndex = -100;
    this.addChild(this._BeatSprite);
    this.maxCombo = video.charCount;
    this.basedScore = 1000000 / video.charCount;
    this.bonusScore = 10000 / (lastBeat.index + 1);
    this._ScoreText = new ScoreText(this.basedScore, this.bonusScore);
    this.addChild(this._ScoreText);
    this._MoveTextTypes = new MoveTextTypes(this._ScoreText);
    this.changeStyle();
    setTimeout(() => {
      this.fontLoad(video.firstPhrase);
    }, 300);
  }

  private _onTimerReady(timer: Timer): void {
    console.log('%c!TimerReady', 'color: aqua');
    setTimeout(() => {
      this.showStartButton();
    }, 300);
  }

  private showStartButton(): void {
    const showStartTL: gsap.core.Timeline = gsap.timeline();
    showStartTL
      .to(this._LoadingGame.loadingNow, {
        pixi: { alpha: 0 },
        duration: 0.5,
      })
      .to(this._LoadingGame.startButton, {
        pixi: { alpha: 1 },
        duration: 0.5,
        onComplete: () => {
          this._LoadingGame.startButton.on('pointertap', this.handleStartButton, this);
        },
      });
  }

  private handleStartButton(): void {
    if (!this.fontLoaded) return;
    const startButtonTL: gsap.core.Timeline = gsap.timeline();
    startButtonTL.to([this._LoadingGame, this.fakeBG], {
      pixi: { alpha: 0 },
      duration: 0.3,
      onComplete: () => {
        this.startInitSetting();
      },
    });
  }

  private startInitSetting(): void {
    gsap.killTweensOf(this._LoadingGame);
    this._LoadingGame.visible = false;
    this.fakeBG.visible = false;
    this.pauseButton.visible = true;
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keyEvent(event);
    });
    this.bg.on('touchstart', this._beatTocuh, this);
    Manager._media.style.visibility = 'visible';
    console.log('%c!StartGame', 'color: aqua');
    this.playButton.visible = true;
  }

  private _requestPlay(): void {
    if (this.isFirst) {
      this.charBuffer = null;
      this.phraseBuffer = null;
      this.beatBuffer = null;
      this.isFirst = false;
    }
    setTimeout(() => {
      this._player.requestPlay();
    }, 100);
  }

  private _requestPause(): void {
    this._player.requestPause();
  }

  private _onPlay(): void {
    //check -> Player.isPlaying
    if (this.isFirst) return;
    console.log('%c!Play', 'color: aqua');
    this.hidePauseScreen();
    this.isGameNow = true;
    this.bg.visible = true;
    this.playButton.visible = false;
  }

  private _onPause(): void {
    //check -> Player.isPlaying
    if (this.isFirst) return;
    console.log('%c!Pause', 'color: aqua');
    if (this._player.video.endTime < this._player.timer.position) {
      this.handleResultScreen();
    } else if (10 < this._player.timer.position) {
      this.showPauseScreen();
    }
    this.isGameNow = false;
    this.bg.visible = false;
  }

  private showPauseScreen(): void {
    this.fakeBG.alpha = 1;
    this.fakeBG.visible = true;
    this.playButton.visible = true;
    this.backToMenu.visible = true;
  }

  private hidePauseScreen(): void {
    this.fakeBG.visible = false;
    this.playButton.visible = false;
    this.backToMenu.visible = false;
  }

  private _onTimeUpdate(pos: number): void {
    if (!this._LyricText || !this._BeatSprite) return;
    //new Phrase
    const phraseNow: IPhrase = this._player.video.findPhrase(pos + 2000);
    if (phraseNow && phraseNow !== this.phraseBuffer) {
      // @ts-ignore Avoid type checking : Phrase -> RenderingUnit
      const phraseIndex: number = this._player.video.findIndex(phraseNow);
      const phraseTextBox: PhraseInfo = this._LyricText.phraseTexts[phraseIndex];
      this.showPhrase(phraseTextBox);
      this.touchLineAnimation(
        this._TouchLine.children.slice(this.phraseLineNumber),
        phraseNow.duration,
      );
      this.showStartCharPlace(phraseTextBox.PhrasePlace);
      this.phraseBuffer = phraseNow;
    }
    //new Char
    const charNow: IChar = this._player.video.findChar(pos + 1000);
    if (charNow && charNow !== this.charBuffer) {
      this.showChar(charNow);
      this.charBuffer = charNow;
    }
    //new Beat
    const beatNow: IBeat = this._player.findBeat(pos);
    if (beatNow && beatNow !== this.beatBuffer) {
      this._BeatSprite.newBeat(beatNow.position - 1, beatNow.duration);
      this.beatBuffer = beatNow;
      if (!this.beatTouched && !this.beatOnce) this._BeatSprite.iloveMiku.alpha = 0.3;
      this.beatOnce = false;
    }
    //beat Check
    const beatNowProgress: number = beatNow.progress(pos);
    if (0.6 < beatNowProgress && beatNowProgress < 0.8) {
      this.beatTouched = false;
    }
    //add tick
    this._tick++;
    if (this._tick % this.tickInterval === 0) {
      const isChorus: boolean = !!this._player.findChorus(pos + 700);
      this._SomeSprite.showRose(isChorus);
      if (isChorus) {
        this.tickInterval = 5;
      } else {
        this.tickInterval = getRandomArbitraryInt(13, 18);
      }
      this._tick = 0;
    }
  }

  private showChar(charNow: IChar): void {
    if (!this._LyricText || !this._MoveTextTypes) return;
    //countermeasures for 0 duration
    if (charNow.previous && charNow.previous !== this.charBuffer) this.showChar(charNow.previous);
    // @ts-ignore Avoid type checking : Char -> RenderingUnit
    const charIndex: number = this._player.video.findIndex(charNow);
    const charTextBoxNow: CharInfo = this._LyricText.charTextBoxs[charIndex];
    this._MoveTextTypes.moveCharText(charTextBoxNow);
  }

  private showPhrase(phraseTextBox: PhraseInfo): void {
    if (!this._MoveTextTypes) return;
    this._MoveTextTypes.movePhraseText(phraseTextBox, this.beatDuration, this._TouchLine);
  }

  private touchLineAnimation(Lines: Array<DisplayObject>, Duration: number): void {
    this.phraseLineNumber = this._TouchLine.children.length;
    const phraseTouchLineTL: gsap.core.Timeline = gsap.timeline();
    phraseTouchLineTL
      .to(Lines, {
        pixi: {
          alpha: 1,
        },
        duration: 0.1,
        delay: 0.4,
        yoyo: true,
        repeat: 4,
      })
      .to(Lines, {
        pixi: {
          alpha: 0.2,
        },
        duration: 1,
        delay: 1,
      })
      .to(Lines, {
        pixi: {
          alpha: 0,
        },
        duration: 0.1,
        delay: (Duration - 1000) / 1000,
      });
  }

  private showStartCharPlace(placeNumber: number): void {
    if (!this._MoveTextTypes) return;
    const placeType: number = Math.floor(placeNumber / 10);
    //based on 1920/1080 and change the position with ratio.
    const placePoint: POINT = this._MoveTextTypes.startCharPlace(placeType);
    placePoint.x *= Manager.width;
    placePoint.y *= (Manager.height * 1920) / 1080;
    this._SomeSprite.showStartCharAnimation(placePoint);
  }

  private keyEvent(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.isGameNow) return;
    if (event.code === 'Space' || event.key === ' ') this._beatTocuh(true);
  }

  private _beatTocuh(isKeyBoard: boolean = false): void {
    if ((this.isGameNow && this.beatTouched) || !this._BeatSprite || !this._ScoreText) return;
    const positionNow: number = this._player.timer.position;
    const beatNow: IBeat = this._player.findBeat(positionNow);
    if (!beatNow) return;
    const beatNowProgress: number = beatNow.progress(positionNow);
    if (beatNowProgress < 0.4 || 0.8 < beatNowProgress) {
      this._BeatSprite.iloveMiku.alpha = 1;
      this._ScoreText.changeBonus();
      this.beatTouched = true;
      this.beatOnce = true;
    } else {
      if (isKeyBoard) {
        this._BeatSprite.iloveMiku.alpha = 0.3;
        this._ScoreText.changeBonus(true);
      }
    }
  }

  private changeStyle(): void {
    const leftSize: number = (Manager.wr * (100 - 19.2)) / 2;
    if (Manager.isSafari) {
      Manager._media.style.left = `${leftSize}px`;
    } else {
      Manager._media.style.transform = `translate(-50%, 0%)`;
    }
  }

  private fontLoad(firstPhrase: IPhrase): void {
    const allLyricText: string = this._player.data.text.replace(/\n/g, '');
    Loader.shared.add({
      name: 'Yusei Magic',
      url: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
      metadata: {
        font: {
          testString: allLyricText,
        },
      },
    });

    Loader.shared.onComplete.once(() => this.fontLoadEnd(firstPhrase, allLyricText), this);

    Loader.shared.load();
  }

  private fontLoadEnd(firstPhrase: IPhrase, allLyricText: string): void {
    if (!this._ScoreText) return;
    console.log('%c!fontLoaded', 'color: red');
    const vocalAmplitudes: Array<number> = new Array();
    const valenceArousals: Array<ValenceArousalValue> = new Array();
    let c = firstPhrase.firstChar;
    while (c !== null) {
      vocalAmplitudes.push(this._player.getVocalAmplitude(c.endTime));
      valenceArousals.push(this._player.getValenceArousal(c.endTime));
      c = c.next;
    }
    this._LyricText = new LyricText(
      this._ScoreText,
      firstPhrase,
      allLyricText,
      vocalAmplitudes,
      valenceArousals,
      this._player.getMaxVocalAmplitude(),
      this._player.getMedianValenceArousal(),
    );
    this.addChild(this._LyricText);
    this.fontLoaded = true;
  }

  private _backToMenu(): void {
    window.location.reload();
  }

  private handleResultScreen(): void {
    if (!this._ScoreText || !this._BeatSprite) return;
    Manager._media.style.visibility = 'hidden';
    this._Result.songTitle.text = this._player.data.song.name;
    this._Result.songArtist.text = '- ' + this._player.data.song.artist.name;
    gsap.to([this._BeatSprite.iloveMiku, this._ScoreText, this.pauseButton], {
      pixi: { alpha: 0 },
      duration: 1,
    });
    const isFullCombo: boolean = this._ScoreText.combo >= this.maxCombo;
    if (!isFullCombo) {
      this._Result.full.visible = false;
      this._Result.combo.visible = false;
    }
    const totalScore: number = this._ScoreText.score + this._ScoreText.bonus;
    const tickBasedValue: number = totalScore / 240;
    let tickValue: number = tickBasedValue;
    this._Result.visible = true;
    const resultScreenTL: gsap.core.Timeline = gsap.timeline();
    resultScreenTL
      .to(this._Result, {
        pixi: { alpha: 1 },
        duration: 0.5,
      })
      .to([this._Result.scoreText, this._Result.scoreNumber], {
        pixi: { alpha: 1 },
        duration: 0.5,
      });
    const resultScoreTL: gsap.core.Timeline = gsap.timeline();
    resultScoreTL
      .to(this._Result.scoreNumber, {
        onUpdate: () => {
          this._Result.scoreNumber.text = fixScore7Text(tickValue);
          tickValue += tickBasedValue;
        },
        onComplete: () => {
          this._Result.scoreNumber.text = fixScore7Text(totalScore);
        },
        duration: 4,
      })
      .to(this._Result.full, {
        pixi: {
          y: 400,
          alpha: 1,
        },
        duration: 2,
        delay: 1,
        ease: 'power3',
      })
      .to(this._Result.combo, {
        pixi: {
          y: 400,
          alpha: 1,
        },
        duration: 2,
        delay: -2,
        ease: 'power3',
      });
  }

  public update(): void {}

  public resize(): void {}
}

/**
 *
 * MoveLyricText Class
 *
 */
//based on 1920/1080 and change the position with ratio.
export class MoveLyricText {
  private readonly basedWidth: number = 1920;
  private readonly basedHeight: number = 1080;
  private readonly W: number = Manager.width;
  private readonly H: number = Manager.height;
  private readonly TR: number = Manager.textScale;
  private readonly WtoH: number = (Manager.height * this.basedWidth) / this.basedHeight; // change ratio
  constructor(private _ScoreText: ScoreText) {}

  //for CharText
  public moveTextBasic(
    charTextBox: CharInfo,
    Duration: number,
    radian: number,
    from: POINT,
    to: POINT,
  ): void {
    charTextBox.TextBox.position.set(from.x * this.W, from.y * this.WtoH);
    const charTextTL: gsap.core.Timeline = gsap.timeline();
    charTextBox.TextBox.visible = true;
    charTextTL
      .to(charTextBox.TextBox, {
        pixi: {
          x: (to.x + Math.cos(radian)) * this.W,
          y: (to.y - Math.sin(radian)) * this.WtoH,
        },
        duration: 0.7,
        ease: 'none',
        onComplete: () => {
          charTextBox.Reached = true;
        },
      })
      .to(charTextBox.TextBox, {
        pixi: {
          alpha: 0,
        },
        duration: 0.5,
        delay: (Duration + 150) / 1000,
        ease: 'none',
        onComplete: () => {
          charTextBox.TextBox.visible = false;
          if (!charTextBox.Touched) this._ScoreText.cancelCombo();
        },
      });
  }

  //for PhraseText
  public movePhraseText(phraseTextBox: PhraseInfo, beatDuration: number): void {
    const phraseText: Container = phraseTextBox.TextBox;
    const Duration: number = phraseTextBox.Duration;
    const NextDuration: number = phraseTextBox.NextDuration;
    const basedW: number = phraseTextBox.TextBox.width;
    const basedH: number = phraseTextBox.TextBox.height;
    phraseText.position.set(this.W * 0.5, this.H * 0.39);
    const phraseTextTL: gsap.core.Timeline = gsap.timeline();
    phraseText.visible = true;
    phraseTextTL
      .to(phraseText, {
        pixi: {
          y: '-=' + this.H * 0.03,
          alpha: 1,
        },
        duration: beatDuration / 1000,
        delay: 1.6,
      })
      .to(phraseText, {
        pixi: {
          y: '-=' + this.H * 0.05,
          width: basedW * 0.5,
          height: basedH * 0.5,
          alpha: 0.2,
        },
        duration: beatDuration / 1000,
        delay: (Duration - beatDuration - 200) / 1000,
      })
      .to(phraseText, {
        pixi: {
          alpha: 0,
        },
        duration: beatDuration / 1000,
        delay: (NextDuration - beatDuration) / 1000,
        onComplete: () => {
          phraseText.visible = false;
        },
      });
  }
}

/**
 *
 * SomeSprite Class
 *
 */
class SomeSprite extends Container {
  private flower: Texture;
  private roseTextures: Array<Texture>;
  private roseOrange: Texture;
  private roseSky: Texture;
  private roseMelon: Texture;
  private rosePink: Texture;
  private showStartCharFlower: Sprite;
  private normalRainVecs: Array<number>;
  private chorusRainVecs: Array<number>;
  private normalRosesC: Container;
  private chorusRosesC: Container;
  private normalRoseNow: number = 0;
  private chorusRoseNow: number = 0;
  private roseModeBuffer: boolean = false;
  private baseW: number = Manager.wr;
  private baseH: number = Manager.hr;
  constructor(songURL: number) {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;

    let basicRose: number = 0;
    if (songURL === 5) {
      basicRose = 0;
    } else if (songURL === 3 || songURL === 4) {
      basicRose = 1;
    } else if (songURL === 1) {
      basicRose = 2;
    } else {
      basicRose = 3;
    }

    this.normalRainVecs = new Array(25);
    for (let i = 0; i < 25; i++) {
      let radian: number = getRandomArbitraryInt(40, 140);
      if (i !== 0) {
        if (Math.abs(this.normalRainVecs[i] - radian) < 10) {
          radian = getRandomArbitraryInt(20, 160);
        }
      }
      this.normalRainVecs[i] = radian;
    }

    this.chorusRainVecs = new Array(25);
    for (let i = 0; i < 25; i++) {
      let radian: number = getRandomArbitraryInt(-70, 250);
      if (i !== 0) {
        if (Math.abs(this.chorusRainVecs[i] - radian) < 10) {
          radian = getRandomArbitraryInt(-70, 250);
        }
      }
      this.chorusRainVecs[i] = radian;
    }

    this.flower = Texture.from('mainFlower');
    this.roseTextures = new Array();
    this.roseOrange = Texture.from('roseOrange'); //0
    this.roseTextures.push(this.roseOrange);
    this.roseSky = Texture.from('roseSky'); //1
    this.roseTextures.push(this.roseSky);
    this.roseMelon = Texture.from('roseMelon'); //2
    this.roseTextures.push(this.roseMelon);
    this.rosePink = Texture.from('rosePink'); //3
    this.roseTextures.push(this.rosePink);

    this.showStartCharFlower = Sprite.from(this.flower);
    this.showStartCharFlower.anchor.set(0.5);
    this.showStartCharFlower.alpha = 0;
    this.showStartCharFlower.scale.set(WR * 0.06);
    this.addChild(this.showStartCharFlower);

    this.normalRosesC = new Container();

    for (let i = 0; i < 25; i++) {
      const rose = Sprite.from(this.roseTextures[basicRose]);
      rose.anchor.set(0.5);
      rose.alpha = 0.8;
      rose.scale.set(WR * 0.015);
      rose.position.set(-WR * 10, -HR * 10);
      this.normalRosesC.addChild(rose);
    }
    this.addChild(this.normalRosesC);

    this.chorusRosesC = new Container();

    for (let i = 0; i < 25; i++) {
      const rose = Sprite.from(this.roseTextures[i % 4]);
      rose.anchor.set(0.5);
      rose.alpha = 1;
      rose.scale.set(WR * 0.015);
      rose.position.set(-WR * 10, -HR * 10);
      this.chorusRosesC.addChild(rose);
    }
    this.addChild(this.chorusRosesC);
  }

  public showRose(isChorus: boolean): void {
    if (this.roseModeBuffer !== isChorus) this.changeRose(isChorus);
    if (isChorus) {
      this.chorusRoseNow++;
      if (this.chorusRoseNow >= 25) this.chorusRoseNow = 0;
      const targetRose: Sprite = this.chorusRosesC.children[this.chorusRoseNow] as Sprite;
      const vec: number = (Math.PI * this.chorusRainVecs[this.chorusRoseNow]) / 180;
      gsap.killTweensOf(targetRose);
      targetRose.position.set(this.baseW * 50, this.baseH * 50);
      gsap.to(targetRose, {
        pixi: {
          x: '+=' + this.baseW * 100 * Math.cos(vec),
          y: '+=' + this.baseH * 100 * Math.sin(vec),
          rotation: '-=' + 720,
        },
        duration: 3,
        ease: 'none',
      });
    } else {
      this.normalRoseNow++;
      if (this.normalRoseNow >= 25) this.normalRoseNow = 0;
      const targetRose: Sprite = this.normalRosesC.children[this.normalRoseNow] as Sprite;
      const vec: number = (Math.PI * this.normalRainVecs[this.normalRoseNow]) / 180;
      gsap.killTweensOf(targetRose);
      targetRose.position.set(this.baseW * 50, -this.baseH * 15);
      gsap.to(targetRose, {
        pixi: {
          x: '+=' + this.baseW * 150 * Math.cos(vec),
          y: '+=' + this.baseH * 150 * Math.sin(vec),
          rotation: '-=' + 720,
        },
        duration: 6,
        ease: 'none',
      });
    }
  }

  private changeRose(isChorus: boolean): void {
    this.roseModeBuffer = isChorus;
    let oldContainer: Container = this.chorusRosesC;
    let newContainer: Container = this.normalRosesC;
    if (isChorus) {
      oldContainer = this.normalRosesC;
      newContainer = this.chorusRosesC;
    }
    gsap.to(oldContainer, {
      pixi: { alpha: 0 },
      duration: 0.5,
    });
    gsap.to(newContainer, {
      pixi: { alpha: 1 },
      duration: 0.5,
    });
  }

  public showStartCharAnimation(point: POINT): void {
    gsap.killTweensOf(this.showStartCharFlower);
    this.showStartCharFlower.alpha = 0;
    this.showStartCharFlower.scale.set(Manager.wr * 0.06);
    this.showStartCharFlower.position.set(point.x, point.y);
    const showStartCharTL: gsap.core.Timeline = gsap.timeline();
    showStartCharTL.to(this.showStartCharFlower, {
      pixi: {
        alpha: 1.2,
        scale: 0,
        rotation: '+=' + 400,
      },
      duration: 2.5,
    });
  }
}

/**
 *
 * ScoreText Class
 *
 */
export class ScoreText extends Container {
  public score: number;
  public combo: number;
  public bonus: number;
  private scoreText: BitmapText;
  private scoreNumber: BitmapText;
  private comboText: BitmapText;
  private comboNumber: BitmapText;
  private bonusText: BitmapText;
  private bonusNumber: BitmapText;
  private scoreHR: number = Manager.hr;
  constructor(private normalAddScore: number, private bonusAddScore: number) {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.score = 0;
    this.combo = 0;
    this.bonus = 0;

    this.scoreText = new BitmapText('SCORE', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 48,
    });
    this.scoreText.anchor.set(1);
    this.scoreText.position.set(WR * 88, HR * 97.5);
    this.scoreText.scale.set(TR);
    this.addChild(this.scoreText);

    this.scoreNumber = new BitmapText(fixScore7Text(0), {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 48,
    });
    this.scoreNumber.anchor.set(1);
    this.scoreNumber.position.set(WR * 101, HR * 97.5);
    this.scoreNumber.scale.set(TR);
    this.addChild(this.scoreNumber);

    this.comboText = new BitmapText('COMBO', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 32,
    });
    this.comboText.anchor.set(1);
    this.comboText.position.set(WR * 96, HR * 85.5);
    this.comboText.scale.set(TR);
    this.comboText.alpha = 0;
    this.addChild(this.comboText);

    this.comboNumber = new BitmapText('0', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 32,
    });
    this.comboNumber.anchor.set(1);
    this.comboNumber.position.set(WR * 100.5, HR * 85.5);
    this.comboNumber.scale.set(TR);
    this.comboNumber.alpha = 0;
    this.addChild(this.comboNumber);

    this.bonusText = new BitmapText('BONUS', {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 48,
    });
    this.bonusText.anchor.set(1);
    this.bonusText.position.set(WR * 92, HR * 91.5);
    this.bonusText.scale.set(TR);
    this.addChild(this.bonusText);

    this.bonusNumber = new BitmapText(fixScore5Text(0), {
      fontName: 'ScoreRocknRoll',
      tint: 0xabffff,
      fontSize: 48,
    });
    this.bonusNumber.anchor.set(1);
    this.bonusNumber.position.set(WR * 101, HR * 91.5);
    this.bonusNumber.scale.set(TR);
    this.addChild(this.bonusNumber);
  }

  public changeScore(): void {
    const backScore: number = this.score;
    this.score += this.normalAddScore;
    const backCombo: number = this.combo;
    this.combo += 1;
    const tickBasedValue: number = this.normalAddScore / 60;
    let tickValue: number = tickBasedValue;
    gsap.killTweensOf(this.scoreNumber);
    this.scoreNumber.text = fixScore7Text(backScore);
    //onUpdate : 60tick / second
    gsap.to(this.scoreNumber, {
      onUpdate: () => {
        this.scoreNumber.text = fixScore7Text(backScore + tickValue);
        tickValue += tickBasedValue;
      },
      onComplete: () => {
        this.scoreNumber.text = fixScore7Text(this.score);
      },
      duration: 1,
    });

    //set combo
    if (this.combo > 9) {
      gsap.killTweensOf(this.comboNumber);
      this.comboNumber.text = backCombo.toString();
      this.comboText.alpha = 1;
      this.comboNumber.alpha = 1;
      this.comboNumber.y = Manager.hr * 85.5;
      gsap.to(this.comboNumber, {
        pixi: {
          y: '-=' + this.scoreHR,
          alpha: 0,
        },
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        onRepeat: () => {
          this.comboNumber.text = this.combo.toString();
        },
        onComplete: () => {
          this.comboNumber.text = this.combo.toString();
          this.comboText.alpha = 1;
          this.comboNumber.alpha = 1;
          this.comboNumber.y = Manager.hr * 85.5;
        },
      });
    }
  }

  public changeBonus(minus: boolean = false): void {
    let changeValue: number = this.bonusAddScore;
    if (minus) changeValue *= -0.5;
    const backBonus: number = this.bonus;
    this.bonus += changeValue;
    if (this.bonus < 0) this.bonus = 0;
    gsap.killTweensOf(this.bonusNumber);
    this.bonusNumber.text = fixScore5Text(backBonus);
    this.bonusText.alpha = 1;
    this.bonusNumber.alpha = 1;
    this.bonusNumber.y = Manager.hr * 91.5;
    gsap.to(this.bonusNumber, {
      pixi: {
        y: '-=' + this.scoreHR,
        alpha: 0,
      },
      duration: 0.05,
      yoyo: true,
      repeat: 1,
      onRepeat: () => {
        this.bonusNumber.text = fixScore5Text(this.bonus);
      },
      onComplete: () => {
        this.bonusNumber.text = fixScore5Text(this.bonus);
        this.bonusText.alpha = 1;
        this.bonusNumber.alpha = 1;
        this.bonusNumber.y = Manager.hr * 91.5;
      },
    });
  }

  public cancelCombo(): void {
    gsap.killTweensOf(this.comboNumber);
    this.combo = 0;
    this.comboText.alpha = 0;
    this.comboNumber.alpha = 0;
  }
}

/**
 *
 * BeatSprite Class
 *
 */
class BeatSprite extends Container {
  public iloveMiku: Container;
  private dancingMiku: Array<Sprite>;
  private beatLight: Graphics;
  private mikuTypeBuffer: number;
  private basedH: number = Manager.hr;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;
    this.iloveMiku = new Container();
    this.dancingMiku = new Array();

    const leftMiku: Sprite = Sprite.from('leftMiku');
    leftMiku.anchor.set(0.5);
    leftMiku.scale.set(WR * 0.018);
    leftMiku.position.set(WR * 50, HR * 63);
    leftMiku.alpha = 0;
    this.iloveMiku.addChild(leftMiku);
    this.dancingMiku.push(leftMiku);

    const centerMiku: Sprite = Sprite.from('centerMiku');
    centerMiku.anchor.set(0.49, 0.49);
    centerMiku.scale.set(WR * 0.018);
    centerMiku.position.set(WR * 50, HR * 63);
    centerMiku.alpha = 1;
    this.iloveMiku.addChild(centerMiku);
    this.dancingMiku.push(centerMiku);

    const rightMiku: Sprite = Sprite.from('rightMiku');
    rightMiku.anchor.set(0.5);
    rightMiku.scale.set(WR * 0.018);
    rightMiku.position.set(WR * 50, HR * 63);
    rightMiku.alpha = 0;
    this.iloveMiku.addChild(rightMiku);
    this.dancingMiku.push(rightMiku);

    this.dancingMiku.push(centerMiku);

    this.iloveMiku.alpha = 0.3;
    this.addChild(this.iloveMiku);
    this.mikuTypeBuffer = 1;

    this.beatLight = new Graphics()
      .beginFill(0x4ffbdf)
      .drawRect(0, HR * 90, WR * 100, HR * 80)
      .endFill();
    this.beatLight.zIndex = -100;
    const blurFilter2 = new filters.BlurFilter();
    blurFilter2.blur = 40;
    this.beatLight.filters = [blurFilter2];
    this.beatLight.alpha = 0.6;
    this.addChild(this.beatLight);
  }

  public newBeat(beatPos: number, beatDuration: number): void {
    const dancingMikuTL: gsap.core.Timeline = gsap.timeline();
    dancingMikuTL
      .to(this.dancingMiku[this.mikuTypeBuffer], {
        pixi: {
          y: this.basedH * 51,
          alpha: 0,
        },
        duration: beatDuration / 8000,
      })
      .to(this.dancingMiku[beatPos], {
        pixi: {
          y: this.basedH * 63,
          alpha: 1,
        },
        duration: beatDuration / 8000,
        onComplete: () => {
          this.mikuTypeBuffer = beatPos;
        },
      });
  }
}
