import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader, ILineStyleOptions, LINE_JOIN, LINE_CAP, Point, DisplayObject } from 'pixi.js';
import { IBeat, IChar, IPhrase, IPlayer, IPlayerApp, IRenderingUnit, IVideo, IWord, Player, RenderingUnitFunction, Timer } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';
import { SoundLoader } from '@pixi/sound';
import { TouchLine } from 'libs/tools/containers/TouchLine';
import { LyricText } from 'libs/tools/containers/LyricText';
import { CharInfo, PhraseInfo, POINT } from 'libs/tools/others/types';
import { MoveTextTypes } from 'libs/tools/others/MoveTextTypes';

export class GameScene extends Container implements IScene {
  //for Pixi
  private phraseLineNumber: number;
  private isGameNow: boolean;
  private fontLoaded: boolean;
  private _TestText: TestText | null;
  private _LyricText: LyricText | null;
  private _BeatSprite: BeatSprite | null;
  private _ScoreText: ScoreText | null;
  private _SomeSprite: SomeSprite;
  private _TouchLine: TouchLine;
  private bg: Graphics;
  //for TextAlive
  private _player: Player;
  private SONGURL: number;
  private charBuffer: IChar | null;
  private phraseBuffer: IPhrase | null;
  private beatBuffer: IBeat | null;
  private beatDuration: number;
  private beatLength: number;
  private basedScore: number;
  private bonusScore: number;
  private beatTouched: boolean;
  //Others
  private _MoveTextTypes: MoveTextTypes | null;
  constructor(songURL: number = 3) {
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
    this._TestText = null;
    this._LyricText = null;
    this._BeatSprite = null;

    this._SomeSprite = new SomeSprite();
    this.addChild(this._SomeSprite);

    this._TouchLine = new TouchLine();
    this._TouchLine.scale.set(WR * 100 / 1920, HR * 100 / 1080);
    this.addChild(this._TouchLine);

    this._ScoreText = null;
    //this._ScoreText = new ScoreText();
    //this.addChild(this._ScoreText);

    /**
     * Screen Event
     */
    this.bg = new Graphics()
      .beginFill(0x000000)
      .drawRect(0, 0, WR * 100, HR * 100)
      .endFill();
    this.bg.alpha = 0;
    this.bg.zIndex= -10;
    this.bg.interactive = true;
    this.bg.buttonMode = false;
    this.bg.visible = false;
    this.addChild(this.bg);

    window.addEventListener('keyup', (event: KeyboardEvent) => {this.keyEvent(event)});


    /**
     * TextAlive Init Setting
     */
    this.SONGURL = songURL;
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

    this.charBuffer = null;
    this.phraseBuffer = null;
    this.beatBuffer = null;
    this.beatDuration = 3000;
    this.beatLength = 4;
    this.basedScore = 0;
    this.bonusScore = 0;
    this.beatTouched = false;

    /**
     * Others Init Setting
     */
    this._MoveTextTypes = null;
    //this._MoveTextTypes = new MoveTextTypes(this._ScoreText);
  }

  private _onAppReady(app: IPlayerApp): void {
    //check -> Player.app.managed
    console.log('%c!AppReady', 'color: aqua');
    if (!app.songUrl) {
      if(this.SONGURL === 0){
        // blues / First Note
        // https://piapro.jp/t/FDb1/20210213190029
        this._player.createFromSongUrl("https://piapro.jp/t/FDb1/20210213190029", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
            beatId: 3953882,
            repetitiveSegmentId: 2099561,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
            lyricId: 52065,
            lyricDiffId: 5093,
          },
        });
      }else if(this.SONGURL === 1){
        // chiquewa / Freedom!
        this._player.createFromSongUrl("https://www.youtube.com/watch?v=pAaD4Hta0ns", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121403/history
            beatId: 3953761,
            repetitiveSegmentId: 2099586,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FN--x%2F20210204215604
            lyricId: 52094,
            lyricDiffId: 5171,
          },
        });
      }else if(this.SONGURL === 2){
        // ラテルネ / その心に灯る色は
        this._player.createFromSongUrl("http://www.youtube.com/watch?v=bMtYf3R0zhY", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121404/history
            beatId: 3953902,
            repetitiveSegmentId: 2099660,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=bMtYf3R0zhY
            lyricId: 52093,
            lyricDiffId: 5177,
          },
        });
      }else if(this.SONGURL === 3){
        // 真島ゆろ / 嘘も本当も君だから
        this._player.createFromSongUrl("https://www.youtube.com/watch?v=Se89rQPp5tk", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121405/history
            beatId: 3953908,
            repetitiveSegmentId: 2099661,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYW_d%2F20210206123357
            lyricId: 52061,
            lyricDiffId: 5123,
          },
        });
      }else if(this.SONGURL === 4){
        // シロクマ消しゴム / 夏をなぞって
        this._player.createFromSongUrl("https://www.youtube.com/watch?v=3wbZUkPxHEg", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121406/history
            beatId: 3953764,
            repetitiveSegmentId: 2099662,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FR6EN%2F20210222075543
            lyricId: 52062,
            lyricDiffId: 5133,
          },
        });
      }else{
        // 濁茶 / 密かなる交信曲
        this._player.createFromSongUrl("http://www.youtube.com/watch?v=Ch4RQPG1Tmo", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121407/history
            beatId: 3953917,
            repetitiveSegmentId: 2099665,
          
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=Ch4RQPG1Tmo
            lyricId: 52063,
            lyricDiffId: 5149,
          },
        });
      }
    }
    this._player.volume = 50;
  }

  private _onVideoReady(video: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady', 'color: aqua');
    console.log('v', video);
    const beatAveData: IBeat = this._player.data.getBeats()[10] || this._player.data.getBeats()[0];
    const Beats: Array<IBeat> = this._player.getBeats();
    const lastBeat: IBeat = Beats[Beats.length - 1];
    this.beatDuration = beatAveData.duration;
    console.log('beatAveData', beatAveData);
    console.log('lastbeat', lastBeat);
    this._BeatSprite = new BeatSprite();
    this._BeatSprite.zIndex = -100;
    this.addChild(this._BeatSprite);
    this.basedScore = 1000000 / video.charCount;
    this.bonusScore = 10000 / (lastBeat.index + 1);
    this._ScoreText = new ScoreText(this.basedScore, this.bonusScore);
    this.addChild(this._ScoreText);
    this._MoveTextTypes = new MoveTextTypes(this._ScoreText);
    this.bg.on('touchstart', this._beatTocuh, this);
    this.changeStyle();
    this.fontLoad(video);
  }

  private _onTimerReady(timer: Timer): void {
    console.log('%c!TimerReady', 'color: aqua');
    //console.log('timer', timer);
    //console.log('DBANNER', this._player.banner);   
    //console.log('DATA', this._player.data);
    //console.log('listAvailableFonts', this._player.data.fonts.listAvailableFonts());
    //console.log('lyricsBody', this._player.data.lyricsBody);
    //console.log('songmap', this._player.data.songMap);
    //console.log('songstatus', this._player.data.songStatus);
    //console.log('getBeats', this._player.data.getBeats());
    //console.log('getChords', this._player.data.getChords());
    //console.log('getChoruses', this._player.data.getChoruses());
    //console.log('VIDEO', this._player.video);
    //console.log('-----------------------------');
    //console.log('Char1', this._player.video.firstChar.text);
    //console.log('Char2', this._player.video.firstChar.next.text);
    //console.log('Char3', this._player.video.firstChar.next.next);
    //console.log('Word1', this._player.video.firstWord.text);
    //console.log('Word2', this._player.video.firstWord.next.text);
    //console.log('Word3', this._player.video.firstWord.next.next);
    //console.log('Phrase1', this._player.video.firstPhrase.text);
    //console.log('Phrase2', this._player.video.firstPhrase.next.text);
    //console.log('Phrase3', this._player.video.firstPhrase.next.next);
    //const a = this._player.video.firstChar.next.next;
    //const c = this._player.video.firstPhrase.next.next;
    //const startTime = performance.now();
    //// @ts-ignore Avoid type checking : Char -> RenderingUnit
    //console.log('cccc', this._player.video.findIndex(this._player.video.lastChar));
    //const endTime1 = performance.now();
    //// @ts-ignore Avoid type checking : Phrase -> RenderingUnit
    //console.log('cccc', this._player.video.findIndex(this._player.video.lastPhrase));
    //const endTime2 = performance.now();
    //console.log(endTime1 - startTime);
    //console.log(endTime2 - endTime1);
  }

  private _onPlay(): void {
    //check -> Player.isPlaying
    console.log('%c!Play', 'color: aqua');
    this.isGameNow = true;
    this.bg.visible = true;
  }

  private _onPause(): void {
    //check -> Player.isPlaying
    console.log('%c!Pause', 'color: aqua');
    if(this._player.video.endTime < this._player.timer.position){
      console.log('END');
    }else{
      console.log('NOT END');
    }
    this.isGameNow = false;
    this.bg.visible = false;
  }

  private _onTimeUpdate(pos: number): void {
    if(!this._TestText || !this._LyricText || !this._BeatSprite) return;
    //EarlyPhrase
    //const phraseEarly:

    //new Phrase
    const phraseNow: IPhrase = this._player.video.findPhrase(pos + 2000);
    if(phraseNow && phraseNow !== this.phraseBuffer){
      // @ts-ignore Avoid type checking : Phrase -> RenderingUnit
      const phraseIndex: number = this._player.video.findIndex(phraseNow);
      const phraseTextBox: PhraseInfo = this._LyricText.phraseTexts[phraseIndex];
      this.showPhrase(phraseTextBox);
      this.touchLineAnimation(this._TouchLine.children.slice(this.phraseLineNumber), phraseNow.duration);
      this.showStartCharPlace(phraseTextBox.PhrasePlace);
      this.phraseBuffer = phraseNow;
    }
    //new Char
    const charNow: IChar = this._player.video.findChar(pos + 1000);
    if(charNow && charNow !== this.charBuffer){
      this.showChar(charNow);
      this.charBuffer = charNow;
    }
    //new Bbeat
    //console.log('position', position);
    const beatNow: IBeat = this._player.findBeat(pos);
    if(beatNow && beatNow !== this.beatBuffer){
      //console.log('beat', beatNow.position);
      this._TestText._text2.text = beatNow.position.toString();
      this._BeatSprite.newBeat(beatNow);
      this.beatBuffer = beatNow;
      if(!this.beatTouched)this._BeatSprite.iloveMiku.alpha = 0.3;
    }
    const beatNowProgress: number = beatNow.progress(pos);
    if(0.3 < beatNowProgress && beatNowProgress < 0.8){
      this.beatTouched = false;
    }
  }

  private showChar(charNow: IChar): void {
    if(!this._LyricText || !this._MoveTextTypes) return;
    //countermeasures for 0 duration
    if(charNow.previous && charNow.previous !== this.charBuffer)this.showChar(charNow.previous);
    // @ts-ignore Avoid type checking : Char -> RenderingUnit
    const charIndex: number = this._player.video.findIndex(charNow);
    const charTextBoxNow: CharInfo = this._LyricText.charTextBoxs[charIndex];
    console.log('V:', charIndex);
    console.log('char.text', charNow.text);
    this._MoveTextTypes.moveCharText(charTextBoxNow);
  }

  //private addScore(charTextBox: CharInfo): void{
  //  if(!charTextBox.Reached || charTextBox.Touched) return;
  //  console.log('TOUCHED', charTextBox);
  //  charTextBox.Touched = true;
  //  this._ScoreText.changeScore(1000);
  //}

  private showPhrase(phraseTextBox: PhraseInfo): void {
    if(!this._MoveTextTypes) return;
    this._MoveTextTypes.movePhraseText(phraseTextBox, this.beatDuration, this._TouchLine);
  }


  private touchLineAnimation(Lines: Array<DisplayObject>, Duration: number): void{
    this.phraseLineNumber = this._TouchLine.children.length;
    const phraseTouchLineTL: gsap.core.Timeline = gsap.timeline();
    phraseTouchLineTL
      .to(Lines, {
        pixi: {
          alpha: 1
        },
        duration: 0.1,
        delay: 0.4,
        yoyo: true,
        repeat: 4,
      })
      .to(Lines, {
        pixi: {
          alpha: 0.2
        },
        duration: 1,
        delay: 1
      })
      .to(Lines, {
        pixi: {
          alpha: 0
        },
        duration: 0.1,
        delay: (Duration - 1000) / 1000
      });
  }

  private showStartCharPlace(placeNumber: number): void {
    if(!this._MoveTextTypes) return;
    const placeType: number = Math.floor(placeNumber / 10);
    //based on 1920/1080 and change the position with ratio.
    const placePoint: POINT = this._MoveTextTypes.startCharPlace(placeType);
    placePoint.x *= Manager.width;
    placePoint.y *= Manager.height * 1920 / 1080;
    this._SomeSprite.showStartCharAnimation(placePoint);
  }

  private keyEvent(event: KeyboardEvent): void {
    event.preventDefault();
    if(!this.isGameNow) return;
    if(event.code === 'Space' || event.key === ' ')this._beatTocuh(true);
  }

  private _beatTocuh(isKeyBoard: boolean = false): void{
    if(this.isGameNow && this.beatTouched || !this._BeatSprite || !this._ScoreText) return;
    const positionNow: number = this._player.timer.position;
    const beatNow: IBeat = this._player.findBeat(positionNow);
    if(!beatNow) return;
    const beatNowProgress: number = beatNow.progress(positionNow);
    console.log(beatNowProgress);
    if(beatNowProgress < 0.3 || 0.8 < beatNowProgress){
      this._BeatSprite.iloveMiku.alpha = 1;
      this._ScoreText.changeBonus();
      this.beatTouched = true;
    }else{
      if(isKeyBoard){
        this._BeatSprite.iloveMiku.alpha = 0.3;
        this._ScoreText.changeBonus(true);
      }
    }
  }

  private _requestPlay(): void {
    //debug
    //this._player.requestMediaSeek(80000);
    this._player.requestPlay();
  }

  private debug(): void {
    console.log('%c!tap', 'color: red');
    //console.log(this._player);
  }

  private changeStyle(): void {
    const leftSize: number = Manager.wr * (100 - 19.2) / 2;
    if (Manager.isSafari) {
      Manager._media.style.left = `${leftSize}px`;
    }else {
      Manager._media.style.transform = `translate(-50%, 0%)`;
    }
  }

  private fontLoad(video: IVideo): void {
    const allLyricText: string = this._player.data.text.replace(/\n/g, '');
    console.log(allLyricText);
    Loader.shared.add(
      {
        name: 'Yusei Magic',
        url: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
        metadata: {
          font: {
            testString: allLyricText
          },
        },
      }
    );
    
    Loader.shared.onComplete.once(() => this.fontLoadEnd(video, allLyricText), this);

    Loader.shared.load();
  }

  private fontLoadEnd(video: IVideo, allLyricText: string): void {
    if(!this._ScoreText) return;
    this.fontLoaded = true;
    console.log('%c!fontLoaded', 'color: green');
    this._TestText = new TestText();
    this._TestText._text2.interactive = true;
    this._TestText._text2.buttonMode = true;
    this._TestText._text2.on('pointertap', this._requestPlay, this);
    this.addChild(this._TestText);
    const STime = performance.now();
    this._LyricText = new LyricText(video, this._ScoreText, allLyricText);
    this.addChild(this._LyricText);
    const ETime = performance.now();
    console.log('!!!3rd', ETime - STime);
  }

  public update(): void {}

  public resize(): void {}
}



/**
 * 
 * TestText Class
 * 
 */
class TestText extends Container {
  public _text2: BitmapText;
  private centerLine: Graphics; 
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this._text2 = new BitmapText('0', { fontName: 'BasicRocknRoll', tint: 0x000000, fontSize: 64 });
    this._text2.anchor.set(0.5);
    this._text2.position.set(WR * 10, HR * 90);
    this._text2.scale.set(TR);
    this.addChild(this._text2);

    this.centerLine = new Graphics()
      .lineStyle(2, 0xff0000)
      .moveTo(WR * 50, 0)
      .lineTo(WR * 50, HR * 100)
      .moveTo(0, HR * 50)
      .lineTo(WR * 100, HR * 50);
    this.addChild(this.centerLine);
  }
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
  //private readonly WtoW: number = Manager.width; // change ratio
  private readonly WtoH: number = Manager.height * this.basedWidth / this.basedHeight; // change ratio
  constructor(private _ScoreText: ScoreText) {}

  //for CharText
  public moveTextBasic(charTextBox: CharInfo, Duration: number, radian: number, from: POINT, to: POINT): void {
    charTextBox.TextBox.position.set(from.x * this.W, from.y * this.WtoH);
    const charTextTL: gsap.core.Timeline = gsap.timeline();
    charTextBox.TextBox.visible = true;
    charTextTL
      .to(charTextBox.TextBox, {
        pixi: {
          x: (to.x + Math.cos(radian) ) * this.W,
          y: (to.y - Math.sin(radian) ) * this.WtoH,
        },
        duration: 0.8,
        ease: 'none',
        onComplete: () => {charTextBox.Reached = true;}
      })
      .to(charTextBox.TextBox, {
        pixi: {
          alpha: 0
        },
        duration: 0.5,
        delay: (Duration + 50) / 1000,
        ease: 'none',
        onComplete: () => {
          charTextBox.TextBox.visible = false;
          if(!charTextBox.Touched)this._ScoreText.cancelCombo();
        }
      });
  }

  //for PhraseText
  public movePhraseText(phraseTextBox: PhraseInfo, beatDuration: number): void {
    const phraseText: BitmapText = phraseTextBox.TextBox;
    const Duration: number = phraseTextBox.Duration;
    const NextDuration: number = phraseTextBox.NextDuration;
    phraseText.position.set(this.W * 0.5, this.H * 0.39);
    const phraseTextTL: gsap.core.Timeline = gsap.timeline();
    phraseText.visible = true;
    phraseTextTL
      .to(phraseText, {
        pixi: {
          y: '-=' + this.H * 0.03,
          alpha: 1
        },
        duration: beatDuration / 1000,
        delay: 1.6
      })
      .to(phraseText, {
        pixi: {
          y: '-=' + this.H * 0.07,
          scale: this.TR * 0.7,
          alpha: 0.2
        },
        duration: beatDuration / 1000,
        delay: ( Duration - beatDuration - 200 ) / 1000
      })
      .to(phraseText, {
        pixi: {
          alpha: 0
        },
        duration: beatDuration / 1000,
        delay: ( NextDuration - beatDuration ) / 1000,
        onComplete: () => {phraseText.visible = false;}
      })
  }
}



/**
 * 
 * SomeSprite Class
 * 
 */
class SomeSprite extends Container {
  private flower: Texture;
  private showStartCharFlower: Sprite;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.flower = Texture.from('mainFlower');

    this.showStartCharFlower = Sprite.from(this.flower);
    this.showStartCharFlower.anchor.set(0.5);
    this.showStartCharFlower.alpha = 0;
    this.showStartCharFlower.scale.set(WR * 0.06);
    this.addChild(this.showStartCharFlower);

    gsap.to(this.showStartCharFlower,{
      pixi: {
        rotation: 359
      }, 
      duration: 3,
      repeat: -1,
      ease: 'none'
    })
  }

  public showStartCharAnimation(point: POINT): void{
    gsap.killTweensOf(this.showStartCharFlower);
    this.showStartCharFlower.alpha = 0;
    this.showStartCharFlower.scale.set(Manager.wr * 0.06);
    this.showStartCharFlower.position.set(point.x, point.y);
    const showStartCharTL: gsap.core.Timeline = gsap.timeline();
    showStartCharTL
      .to(this.showStartCharFlower, {
        pixi:{
          alpha: 1.2,
          scale: 0
        }, 
        duration:2.5
      });
  }
}



const fixScore7Text = (score: number):string => {
  const newScore: number = Math.round(score);
  return ('0000000' + newScore).slice(-7)
}

const fixScore5Text = (score: number):string => {
  const newScore: number = Math.round(score);
  return ('00000' + newScore).slice(-5)
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

    this.scoreText = new BitmapText('SCORE', { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 48 });
    this.scoreText.anchor.set(1);
    this.scoreText.position.set(WR * 88, HR * 98.5);
    this.scoreText.scale.set(TR);
    this.addChild(this.scoreText);

    this.scoreNumber = new BitmapText(fixScore7Text(0), { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 48 });
    this.scoreNumber.anchor.set(1);
    this.scoreNumber.position.set(WR * 101, HR * 98.5);
    this.scoreNumber.scale.set(TR);
    this.addChild(this.scoreNumber);

    this.comboText = new BitmapText('COMBO', { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 32 });
    this.comboText.anchor.set(1);
    this.comboText.position.set(WR * 96, HR * 88.5);
    this.comboText.scale.set(TR);
    this.comboText.alpha = 0;
    this.addChild(this.comboText);

    this.comboNumber = new BitmapText('0', { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 32 });
    this.comboNumber.anchor.set(1);
    this.comboNumber.position.set(WR * 100.5, HR * 88.5);
    this.comboNumber.scale.set(TR);
    this.comboNumber.alpha = 0;
    this.addChild(this.comboNumber);

    this.bonusText = new BitmapText('BONUS', { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 48 });
    this.bonusText.anchor.set(1);
    this.bonusText.position.set(WR * 92, HR * 93.5);
    this.bonusText.scale.set(TR);
    this.addChild(this.bonusText);

    this.bonusNumber = new BitmapText(fixScore5Text(0), { fontName: 'ScoreRocknRoll', tint: 0x02cccc, fontSize: 48 });
    this.bonusNumber.anchor.set(1);
    this.bonusNumber.position.set(WR * 101, HR * 93.5);
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
    gsap
      .to(this.scoreNumber, {
        onUpdate: () => {
          this.scoreNumber.text = fixScore7Text(backScore + tickValue);
          tickValue += tickBasedValue;
        },
        onComplete: () => {this.scoreNumber.text = fixScore7Text(this.score)},
        duration: 1,
      });

    //set combo
    if(this.combo > 9){
      gsap.killTweensOf(this.comboNumber);
      this.comboNumber.text = backCombo.toString();
      this.comboText.alpha = 1;
      this.comboNumber.alpha = 1;
      this.comboNumber.y = Manager.hr * 88.5;
      gsap
        .to(this.comboNumber, {
          pixi: {
            y: '-=' + this.scoreHR,
            alpha: 0
          },
          duration: 0.05,
          yoyo: true,
          repeat: 1,
          onRepeat: () => {this.comboNumber.text = this.combo.toString();},
          onComplete: () => {
            this.comboNumber.text = this.combo.toString();
            this.comboText.alpha = 1;
            this.comboNumber.alpha = 1;
            this.comboNumber.y = Manager.hr * 88.5;
          }
        });
    }
  }

  public changeBonus(minus: boolean = false): void {
    console.log('%cBOUNUS', 'color: aqua');
    let changeValue: number = this.bonusAddScore;
    if(minus)changeValue *= -0.1;
    const backBonus: number = this.bonus;
    this.bonus += changeValue;
    gsap.killTweensOf(this.bonusNumber);
    this.bonusNumber.text = fixScore5Text(backBonus);
    this.bonusText.alpha = 1;
    this.bonusNumber.alpha = 1;
    this.bonusNumber.y = Manager.hr * 93.5;
    gsap
      .to(this.bonusNumber, {
        pixi: {
          y: '-=' + this.scoreHR,
          alpha: 0
        },
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        onRepeat: () => {this.bonusNumber.text = fixScore5Text(this.bonus);},
        onComplete: () => {
          this.bonusNumber.text = fixScore5Text(this.bonus);
          this.bonusText.alpha = 1;
          this.bonusNumber.alpha = 1;
          this.bonusNumber.y = Manager.hr * 93.5;
        }
      });
  }

  public cancelCombo():void {
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
  private mikuTypeBuffer: number;
  private scoreHR: number = Manager.hr * 3;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.iloveMiku = new Container();
    this.dancingMiku = new Array();

    const leftMiku: Sprite = Sprite.from('leftMiku');
    leftMiku.anchor.set(0.5);
    leftMiku.scale.set(WR * 0.02);
    leftMiku.position.set(WR * 50, HR * 60);
    leftMiku.alpha = 0;
    this.iloveMiku.addChild(leftMiku);
    this.dancingMiku.push(leftMiku);

    const centerMiku: Sprite = Sprite.from('centerMiku');
    centerMiku.anchor.set(0.49, 0.45);
    centerMiku.scale.set(WR * 0.02);
    centerMiku.position.set(WR * 50, HR * 60);
    centerMiku.alpha = 1;
    this.iloveMiku.addChild(centerMiku);
    this.dancingMiku.push(centerMiku);


    const rightMiku: Sprite = Sprite.from('rightMiku');
    rightMiku.anchor.set(0.5);
    rightMiku.scale.set(WR * 0.02);
    rightMiku.position.set(WR * 50, HR * 60);
    rightMiku.alpha = 0;
    this.iloveMiku.addChild(rightMiku);
    this.dancingMiku.push(rightMiku);

    this.iloveMiku.alpha = 0.3;
    this.addChild(this.iloveMiku);
    this.mikuTypeBuffer = 1;
  }

  public newBeat(beatNow: IBeat): void{
    let mikuType: number = 0;
    if(beatNow.length === 3){
      //1, 2, 3
      if(beatNow.index % 2){
        mikuType = beatNow.position - 1;
      }else{
        mikuType = 3 - beatNow.position;
      }
    }else{
      //1, 2, 3, 4
      if(beatNow.position % 2){
        mikuType = beatNow.position - 1;
      }else{
        mikuType = 1;
      }
    }
    
    const dancingMikuTL: gsap.core.Timeline = gsap.timeline();
    dancingMikuTL
      .to(this.dancingMiku[this.mikuTypeBuffer], {
        pixi: {
          y: '-=' + this.scoreHR,
          alpha: 0,
        },
        duration: (beatNow.duration - 200) / 2000,
      })
      .to(this.dancingMiku[mikuType], {
        pixi: {
          y: '+=' + this.scoreHR,
          alpha: 1,
        },
        duration: (beatNow.duration - 200 ) / 2000,
        onComplete: () => {this.mikuTypeBuffer = mikuType},
      });
  }
}