import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader, ILineStyleOptions, LINE_JOIN, LINE_CAP, Point, DisplayObject } from 'pixi.js';
import { IBeat, IChar, IPhrase, IPlayer, IPlayerApp, IRenderingUnit, IVideo, IWord, Player, RenderingUnitFunction, Timer } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';
import { SoundLoader } from '@pixi/sound';
import { count } from 'console';
import { TouchLine } from 'libs/tools/containers/TouchLine';
import { LyricText } from 'libs/tools/containers/LyricText';
import { CharInfo, PhraseInfo, POINT } from 'libs/tools/others/types';
import { MoveTextTypes } from 'libs/tools/others/MoveTextTypes';

export class GameScene extends Container implements IScene {
  //for Pixi
  private _TestText: TestText | null;
  private _LyricText: LyricText | null;
  private _MoveTextTypes: MoveTextTypes;
  private _TouchLine: TouchLine;
  private phraseLineNumber: number;
  private isGameNow: boolean;
  private fontLoaded: boolean;
  //for TextAlive
  private _player: Player;
  private SONGURL: number;
  private charBuffer: IChar | null;
  private wordBuffer: IWord | null;
  private phraseBuffer: IPhrase | null;
  private beatBuffer: IBeat | null;
  private beatDuration: number;
  private beatLength: number;
  constructor(songURL: number = 2) {
    super();
    //Pixi Init Setting
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;

    this._TestText = null;
    this._LyricText = null;
    this._MoveTextTypes = new MoveTextTypes();
    this.phraseLineNumber = 0;
    this.isGameNow = false;
    this.fontLoaded = false;

    const bg: Graphics = new Graphics()
      .beginFill(0x000000)
      .drawRect(0, 0, WR * 100, HR * 100)
      .endFill();
    bg.alpha = 0;
    bg.zIndex= -10;
    bg.interactive = true;
    bg.on('pointerdown', this.debug, this);
    this.addChild(bg);

    this._TouchLine = new TouchLine();
    this._TouchLine.scale.set(WR * 100 / 1920, HR * 100 / 1080);
    this.addChild(this._TouchLine);

    //TextAlive Init Setting
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
    this.wordBuffer = null;
    this.phraseBuffer = null;
    this.beatBuffer = null;
    this.beatDuration = 3000;
    this.beatLength = 4;
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
    this._player.volume = 5;
  }

  private _onVideoReady(video: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady', 'color: aqua');
    console.log('v', video);
    const beatAveData: IBeat = this._player.data.getBeats()[10] || this._player.data.getBeats()[0];
    this.beatDuration = beatAveData.duration;
    this.beatLength = beatAveData.index;
    console.log('beatAveData', beatAveData);
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
    const a = this._player.video.firstChar.next.next;
    const c = this._player.video.firstPhrase.next.next;
    const startTime = performance.now();
    // @ts-ignore Avoid type checking : Char -> RenderingUnit
    console.log('cccc', this._player.video.findIndex(this._player.video.lastChar));
    const endTime1 = performance.now();
    // @ts-ignore Avoid type checking : Phrase -> RenderingUnit
    console.log('cccc', this._player.video.findIndex(this._player.video.lastPhrase));
    const endTime2 = performance.now();
    console.log(endTime1 - startTime);
    console.log(endTime2 - endTime1);
  }

  private _onPlay(): void {
    //check -> Player.isPlaying
    console.log('%c!Play', 'color: aqua');
    this.isGameNow = true;
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
  }

  private _onTimeUpdate(pos: number): void {
    if(!this._TestText || !this._LyricText) return;
    //EarlyPhrase
    //const phraseEarly:

    //phrase
    const phraseNow: IPhrase = this._player.video.findPhrase(pos + 2000);
    if(phraseNow && phraseNow !== this.phraseBuffer){
      this.showPhrase(phraseNow);
      this.phraseBuffer = phraseNow;
    }
    //char
    const charNow: IChar = this._player.video.findChar(pos + 1000);
    if(charNow && charNow !== this.charBuffer){
      this.showChar(charNow);
      this.charBuffer = charNow;
    }
    //beat
    //console.log('position', position);
    const beatNow: IBeat = this._player.findBeat(pos);
    if(beatNow && beatNow !== this.beatBuffer){
      //console.log('beat', beatNow.position);
      this._TestText._text2.text = beatNow.position.toString();
      this.beatBuffer = beatNow;
    }
  }

  private showChar(charNow: IChar): void {
    if(!this._LyricText) return;
    //countermeasures for 0 duration
    if(charNow.previous && charNow.previous !== this.charBuffer)this.showChar(charNow.previous);
    console.log('char.text', charNow.text);
    // @ts-ignore Avoid type checking : Char -> RenderingUnit
    const charIndex: number = this._player.video.findIndex(charNow);
    const charTextBoxNow: CharInfo = this._LyricText.charTextBoxs[charIndex];
    this._MoveTextTypes.moveCharText(charTextBoxNow);
  }

  private showPhrase(phraseNow: IPhrase): void {
    if(!this._LyricText)return;
    // @ts-ignore Avoid type checking : Phrase -> RenderingUnit
    const phraseIndex: number = this._player.video.findIndex(phraseNow);
    const phraseTextBox: PhraseInfo = this._LyricText.phraseTexts[phraseIndex];
    this._MoveTextTypes.movePhraseText(phraseTextBox, this.beatDuration, this._TouchLine);
    this.touchLineAnimation(this._TouchLine.children.slice(this.phraseLineNumber), phraseNow.duration);
    this.phraseLineNumber = this._TouchLine.children.length;
  }


  private touchLineAnimation(Lines: Array<DisplayObject>, Duration: number): void{
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
    console.log(this._player.data.text.replace(/\n/g, ''));
    Loader.shared.add(
      {
        name: 'Yusei Magic',
        url: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
        metadata: {
          font: {
            testString: this._player.data.text.replace(/\n/g, '')
          },
        },
      }
    );
    
    Loader.shared.onComplete.once(() => this.fontLoadEnd(video), this);

    Loader.shared.load();
  }

  private fontLoadEnd(video: IVideo): void {
    this.fontLoaded = true;
    console.log('%c!fontLoaded', 'color: green');
    this._TestText = new TestText();
    this._TestText._text2.interactive = true;
    this._TestText._text2.on('pointertap', this._requestPlay, this);
    this.addChild(this._TestText);

    this._LyricText = new LyricText(video);
    this.addChild(this._LyricText);
  }

  public update(): void {}

  public resize(): void {}
}

/**
 * TestText Class
 */
class TestText extends Container {
  public _text2: BitmapText;
  private centerLine: Graphics; 
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this._text2 = new BitmapText('0', { fontName: 'RocknRoll', tint: 0x000000, fontSize: 64 });
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
 * MoveLyricText Class
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
  constructor() {}

  //for CharText
  public moveTextBasic(TextBox: Container, Duration: number, radian: number, from: POINT, to: POINT): void {
    TextBox.position.set(from.x * this.W, from.y * this.WtoH);
    const charTextTL: gsap.core.Timeline = gsap.timeline();
    TextBox.visible = true;
    charTextTL
      .to(TextBox, {
        pixi: {
          x: (to.x + Math.cos(radian) ) * this.W,
          y: (to.y - Math.sin(radian) ) * this.WtoH,
        },
        duration: 0.9,
        ease: 'none',
      })
      .to(TextBox, {
        pixi: {
          alpha: 0
        },
        duration: 0.5,
        delay: Duration / 1000,
        ease: 'none',
        onComplete: () => {TextBox.visible = false;}
      });
  }

  //for PhraseText
  public movePhraseText(phraseTextBox: PhraseInfo, beatDuration: number): void {
    const phraseText: Text = phraseTextBox.TextBox;
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
        delay: 1.8
      })
      .to(phraseText, {
        pixi: {
          y: '-=' + this.H * 0.07,
          scale: this.TR * 0.7,
          alpha: 0.2
        },
        duration: beatDuration / 1000,
        delay: ( Duration - beatDuration ) / 1000
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
