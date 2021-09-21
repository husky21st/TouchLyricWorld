import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader } from 'pixi.js';
import { IBeat, IChar, IPlayer, IPlayerApp, IVideo, Player, Timer } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';

class Lyric {
  public text: string;
  public startTime: number;
  public endTime: number;
  public duration: number;
  constructor(data: IChar) {
    this.text = data.text; // 歌詞文字
    this.startTime = data.startTime; // 開始タイム [ms]
    this.endTime = data.endTime; // 終了タイム [ms]
    this.duration = data.duration; // 開始から終了迄の時間 [ms]
  }
}

export class GameScene extends Container implements IScene {
  //for Pixi
  private _TestText: TestText | null;
  private isGameNow: boolean;
  private fontLoaded: boolean;
  //for TextAlive
  private _player: Player;
  private charBuffer: IChar | null;
  private beatBuffer: IBeat | null;
  //private lyrics: Array<Lyric>;
  constructor() {
    super();
    //Pixi Init Setting
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this.sortableChildren = true;

    this._TestText = null;
    this.isGameNow = false;
    this.fontLoaded = false;

    const bg: Graphics = new Graphics()
      .beginFill(0x000000)
      .drawRect(0, 0, WR * 100, HR * 100)
      .endFill();
    bg.alpha = 0;
    bg.zIndex= -10;
    bg.interactive = true;
    bg.on('pointertap', this.debug, this);
    this.addChild(bg);

    //TextAlive Init Setting
    this._player = new Player({
      app: { token: process.env.NEXT_PUBLIC_API_TOKEN || '' },
      fontFamilies: [{ key: 'Yusei Magic', en: 'Yusei Magic', google: true }],
      mediaElement: Manager._media as HTMLElement,
      mediaBannerPosition: null,
      valenceArousalEnabled: true,
      vocalAmplitudeEnabled: true,
    });

    this._player.addListener({
      onAppReady: (app: IPlayerApp) => this._onAppReady(app),
      onVideoReady: (v: IVideo) => this._onVideoReady(v),
      onTimerReady: (timer: Timer) => this._onTimerReady(timer),
      onPlay: () => this._onPlay(),
      onPause: () => this._onPause(),
      onTimeUpdate: (pos: number) => this._onTimeUpdate(pos),
    });

    this.charBuffer = null;
    this.beatBuffer = null;
  }

  private _onAppReady(app: IPlayerApp): void {
    //check -> Player.app.managed
    console.log('%c!AppReady', 'color: aqua');
    if (!app.songUrl) {
      this._player.createFromSongUrl('http://www.youtube.com/watch?v=Ch4RQPG1Tmo', {
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

    this._player.volume = 30;
  }

  private _onVideoReady(v: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady', 'color: aqua');
    console.log('v', v);
    this.changeStyle();
    this.fontLoad();
  }

  private _onTimerReady(timer: Timer): void {
    console.log('%c!TimerReady', 'color: aqua');
    console.log('timer', timer);
    console.log('DBANNER', this._player.banner);   
    console.log('DATA', this._player.data);
    console.log('listAvailableFonts', this._player.data.fonts.listAvailableFonts());
    console.log('lyricsBody', this._player.data.lyricsBody);
    console.log('songmap', this._player.data.songMap);
    console.log('songstatus', this._player.data.songStatus);
    console.log('getBeats', this._player.data.getBeats());
    console.log('getChords', this._player.data.getChords());
    console.log('getChoruses', this._player.data.getChoruses());
    console.log('VIDEO', this._player.video);
    console.log('-----------------------------');
    //this._player.requestPlay();
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
    //accuracy : position < Player.timer.position
    if(!this._TestText) return;
    const ACposition: number = this._player.timer.position;
    const charNow: IChar = this._player.video.findChar(ACposition);
    if(charNow && charNow !== this.charBuffer){
      console.log('char.text', charNow.text);
      this._TestText._text1.text = charNow.text;
      this.charBuffer = charNow;
    }
    //console.log('position', position);
    const beatNow: IBeat = this._player.findBeat(ACposition);
    if(beatNow && beatNow !== this.beatBuffer){
      console.log('beat', beatNow.position);
      this._TestText._text2.text = beatNow.position.toString();
      this.beatBuffer = beatNow;
    }
  }





  private _requestPlay(): void {
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

  private fontLoad(): void {
    console.log(this._player.data.text.replace(/\n/g, ''));
    Loader.shared.add(
      {
        name: 'Yusei Magic',
        url: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
        metadata: {
          font: {
            testString: this._player.data.text.replace(/\n/g, ''),
          },
        },
      }
    );
    
    Loader.shared.onComplete.once(this.fontLoadEnd, this);

    Loader.shared.load();
  }

  private fontLoadEnd(): void {
    this.fontLoaded = true;
    console.log('%c!fontLoaded', 'color: green');
    this._TestText = new TestText();
    this._TestText._text1.interactive = true;
    this._TestText._text1.on('pointertap', this._requestPlay, this);
    this.addChild(this._TestText);
  }

  public update(): void {
    if(!this.isGameNow) return;
    //const startTime = performance.now();
    //const position = this._player.timer.position;
    //const char = this._player.video.findChar(position);
    //if(char && this.charBuffer !== char){
    //  console.log('char.text', char.text);
    //  this.charBuffer = char;
    //}
    ////console.log('position', position);
    ////this._TestText._text1.text = char;
    //const beatNow: IBeat = this._player.findBeat(position);
    //if(beatNow){
    //  this._TestText._text2.text = beatNow.position.toString();
    //}else{
    //  console.log('%cnull BEAT', 'color: yellow');
    //}
    //const endTime = performance.now();
    //console.log(endTime - startTime);
  }

  public resize(): void {}
}

class TestText extends Container {
  public _text1: Text;
  public _text2: BitmapText;
  private centerLine: Graphics;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this._text1 = new Text('aaa', {fontFamily: 'Yusei Magic', fill: 0x000000, fontSize: 128 });
    this._text1.anchor.set(0.5);
    this._text1.position.set(WR * 50, HR * 50);
    this._text1.scale.set(TR);
    this.addChild(this._text1);

    this._text2 = new BitmapText('0', { fontName: 'RocknRoll', tint: 0x000000, fontSize: 64 });
    this._text2.anchor.set(0.5);
    this._text2.position.set(WR * 10, HR * 90);
    this._text2.scale.set(TR);
    this.addChild(this._text2);

    this.centerLine = new Graphics()
      .lineStyle(2, 0xff0000)
      .moveTo(WR * 50, 0)
      .lineTo(WR * 50, HR * 100);
    this.addChild(this.centerLine);
  }
}
