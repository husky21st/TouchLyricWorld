import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader, ILineStyleOptions, LINE_JOIN, LINE_CAP, Point } from 'pixi.js';
import { IBeat, IChar, IPhrase, IPlayer, IPlayerApp, IRenderingUnit, IVideo, IWord, Player, RenderingUnitFunction, Timer } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';
import { SoundLoader } from '@pixi/sound';
import { count } from 'console';
import { TouchLine } from 'libs/tools/containers/TouchLine';
import { LyricText } from 'libs/tools/containers/LyricText';
import { CharInfo, PhraseInfo, POINT } from 'libs/tools/others/types';

export class GameScene extends Container implements IScene {
  //for Pixi
  private _TestText: TestText | null;
  private _LyricText: LyricText | null;
  private _MoveLyricText: MoveLyricText;
  private _TouchLine: TouchLine;
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
  constructor(songURL: number = 4) {
    super();
    //Pixi Init Setting
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;

    this._TestText = null;
    this._LyricText = null;
    this._MoveLyricText = new MoveLyricText();
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
    this._player.volume = 30;
  }

  private _onVideoReady(video: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady', 'color: aqua');
    console.log('v', video);
    const beatAveData: IBeat = this._player.data.getBeats()[10];
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
    this.isGameNow = false;
  }

  private _onTimeUpdate(pos: number): void {
    if(!this._TestText || !this._LyricText) return;
    //EarlyPhrase
    //const phraseEarly:

    //phrase
    const phraseNow: IPhrase = this._player.video.findPhrase(pos + 200);
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
    this._MoveLyricText.moveCharText(charTextBoxNow);
  }

  private showPhrase(phraseNow: IPhrase): void {
    if(!this._LyricText)return;
    // @ts-ignore Avoid type checking : Phrase -> RenderingUnit
    const phraseIndex: number = this._player.video.findIndex(phraseNow);
    const phraseTextBox: PhraseInfo = this._LyricText.phraseTexts[phraseIndex];
    this._MoveLyricText.movePhraseText(phraseTextBox, this.beatDuration);
  }




  private _requestPlay(): void {
    //debug
    this._player.requestMediaSeek(85000);
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
            testString: this._player.data.text.replace(/\n/g, '') + 'a',
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
class MoveLyricText {
  private readonly basedWidth: number = 1920;
  private readonly basedHeight: number = 1080;
  private readonly WtoW: number = Manager.width; // change ratio
  private readonly WtoH: number = Manager.height * this.basedWidth / this.basedHeight; // change ratio
  constructor() {}

  public moveCharText(charTextBox: CharInfo): void {
    //const placeNumber: number = charTextBox.Place;
    const placeNumber: number = 0;
    const indexOf: number = charTextBox.PhraseIndexOf;
    if(placeNumber === 0){
      //Max : 32
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType4(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 1){
      //Max : 30
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 30){
        this.moveTextType6(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 2){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 3){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 4){
      //Max : 10
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 10){
        this.moveTextType1(charTextBox.TextBox, indexOf - 5, charTextBox.Duration, true);
      }
    }
  }

  private moveTextBasic(TextBox: Container, Duration: number, radian: number, from: POINT, to: POINT): void {
    TextBox.position.set(from.x * this.WtoW, from.y * this.WtoH);
    const textTL: gsap.core.Timeline = gsap.timeline();
    TextBox.visible = true;
    textTL
      .to(TextBox, {
        pixi: {
          x: (to.x + Math.cos(radian) ) * this.WtoW,
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

  //Max : 5
  private moveTextType0(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 1.05, W * 0.04, W, P * 154.8 / 180, P); //P * 25.2 / 180
    let radian: number = 0;
    if(reverse){
      radian = Math.PI * (180 + (25.2 * (5 - indexOf)) / 5 ) / 180;
    }else{
      radian = Math.PI * (180 + (25.2 * indexOf) / 5 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:1.05, y:0.04});
  }

  //Max : 5
  private moveTextType1(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc( - W * 0.65, - W * 0.14, W, P * 11 / 180, P * 37.2 / 180); //P * 26.2 / 180
    let radian: number = 0;
    if(!reverse){
      radian = Math.PI * (360 - 37.2 + (26.2 * (5 - indexOf)) / 5 ) / 180;
    }else{
      radian = Math.PI * (360 - 37.2 + (26.2 * indexOf) / 5 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:-0.15, y:0}, {x:-0.65, y:-0.14});
  }

  //Max : 5
  private moveTextType2(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 1.65, - W * 0.14, W, P * 142.8 / 180, P * 169 / 180); //P * 26.2 / 180
    let radian: number = 0;
    if(reverse){
      radian = Math.PI * (360 - 169 + (26.2 * (5 - indexOf)) / 5 ) / 180;
    }else{
      radian = Math.PI * (360 - 169 + (26.2 * indexOf) / 5 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:1.15, y:0}, {x:1.65, y:-0.14});
  }

  //Max : 5
  private moveTextType3(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc( - W * 0.05, W * 0.04, W, 0, P * 25.2 / 180); //P * 25.2 / 180
    let radian: number = 0;
    if(reverse){
      radian = Math.PI * (360 - 25.2 + (25.2 * (5 - indexOf)) / 5 ) / 180;
    }else{
      radian = Math.PI * (360 - 25.2 + (25.2 * indexOf) / 5 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:-0.05, y:0.04});
  }

  //Max : 7
  private moveTextType4(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 0.9715, - W * 0.3515, W, P * 118 / 180, P * 157.1 / 180); //P * 39.1 / 180
    let radian: number = 0;
    if(reverse){
      radian = Math.PI * (360 - 157.1 + (39.1 * (7 - indexOf)) / 7 ) / 180;
    }else{
      radian = Math.PI * (360 - 157.1 + (39.1 * indexOf) / 7 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.9715, y:-0.3515});
  }

  //Max : 7
  private moveTextType5(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 0.0285, - W * 0.3515, W, P * 22.9 / 180, P * 62 / 180); //P * 39.1 / 180
    let radian: number = 0;
    if(!reverse){
      radian = Math.PI * (360 - 62 + (39.1 * (7 - indexOf)) / 7 ) / 180;
    }else{
      radian = Math.PI * (360 - 62 + (39.1 * indexOf) / 7 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.0285, y:-0.3515});
  }

  //Max : 4
  private moveTextType6(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 0.5, - W * 0.469, W, P * 90 / 180, P * 110.8 / 180); //P * 20.8 / 180
    let radian: number = 0;
    if(reverse){
      radian = Math.PI * (360 - 110.8 + (20.8 * (4 - indexOf)) / 4 ) / 180;
    }else{
      radian = Math.PI * (360 - 110.8 + (20.8 * indexOf) / 4 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.5, y:-0.469});
  }

  //Max : 4
  private moveTextType7(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc(W * 0.5, - W * 0.469, W, P * 69.2 / 180, P * 90 / 180); //P * 20.8 / 180
    let radian: number = 0;
    if(!reverse){
      radian = Math.PI * (360 - 90 + (20.8 * (4 - indexOf)) / 4 ) / 180;
    }else{
      radian = Math.PI * (360 - 90 + (20.8 * indexOf) / 4 ) / 180;
    }
    this.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.5, y:-0.469});
  }


  //for PhraseText
  public movePhraseText(phraseTextBox: PhraseInfo, beatDuration: number): void {
    const W: number = Manager.width;
    const H: number = Manager.height;
    const phraseText: Text = phraseTextBox.TextBox;
    const Duration: number = phraseTextBox.Duration;
    const NextDuration: number = phraseTextBox.NextDuration;
    phraseText.position.set(W * 0.5, H * 0.33);
    const textTL: gsap.core.Timeline = gsap.timeline();
    phraseText.visible = true;
    textTL
      .to(phraseText, {
        pixi: {
          y: '-=' + H * 0.03,
          alpha: 1
        },
        duration: beatDuration / 1000,
      })
      .to(phraseText, {
        pixi: {
          y: '-=' + H * 0.04,
          scale: 0.4,
          alpha: 0.5
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
