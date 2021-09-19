import { Container, Texture, Sprite, Graphics, BitmapText } from 'pixi.js';
import { IPlayer, IPlayerApp, IVideo, Player, Timer } from "textalive-app-api";
import { IScene, Manager } from 'libs/manages/Manager';
import gsap from 'gsap';

export class GameScene extends Container implements IScene {
  //for Pixi
  private _TestText: TestText;
  //for TextAlive
  private _player: Player;
  constructor() {
    super();
    //Pixi Init Setting
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;


    this._TestText = new TestText();
    this._TestText._text.interactive = true;
    this._TestText._text.on('pointertap', this._requestPlay, this);
    this.addChild(this._TestText);
    
    
    
    
    
    
    //TextAlive Init Setting
    this._player = new Player({
      app: { token: process.env.NEXT_PUBLIC_API_TOKEN || ''},
      fontFamilies: [{ key: "Yusei Magic", en: "Yusei Magic", google: true }],
      mediaElement: document.getElementById('media') || undefined,
      mediaBannerPosition: null,
      valenceArousalEnabled: true,
      vocalAmplitudeEnabled: true
    });

    this._player.addListener({
      onAppReady: (app: IPlayerApp) => this._onAppReady(app),
      onPause: () => this._onPause(),
      onPlay: () => this._onPlay(),
      onTimerReady: (timer: Timer) => this._onTimerReady(timer),
      onVideoReady: (v: IVideo) => this._onVideoReady(v),
    });

    








  }

  private _onAppReady(app: IPlayerApp): void {
    //check -> Player.app.managed
    console.log('%c!AppReady','color: aqua');
    if(!app.songUrl){
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

    this._player.volume = 10;
    
  }

  private _onPause(): void {
    //check -> Player.isPlaying
    console.log('%c!Pause','color: aqua');
  }

  private _onPlay(): void {
    //check -> Player.isPlaying
    console.log('%c!Play','color: aqua');
  }

  private _onTimerReady(timer: Timer): void {
    console.log('%c!TimerReady','color: aqua');
    //this._player.requestPlay();
    this.debug();
  }

  private _onVideoReady(v: IVideo): void {
    //check -> Player.isLoading
    console.log('%c!VideoReady','color: aqua');
    const _media = document.getElementById('media');
    if(_media){
      const scaleRatio: number = Math.floor(100 * Manager.wr / 15) / 100;
      //for safari
      if(Manager.isSafari){
        _media.style.left = `${(Manager.width - 256 * scaleRatio) / 2}px`;
        _media.style.transformOrigin = 'top left';
        _media.style.transform = `scale(${scaleRatio})`;
      }else {
        _media.style.transformOrigin = 'top left';
        _media.style.transform = `scale(${scaleRatio}) translate(-50%, 0%)`;
      }
    }
  }

  private _requestPlay(): void {
    this._player.requestPlay();
  }
  
  private debug(): void{
    console.log(this._player);
  }






  public update(): void {}

  public resize(): void {}
}

class TestText extends Container {
  public _text: BitmapText;
  private centerLine: Graphics;
  constructor() {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;

    this._text = new BitmapText("aaa", {fontName: 'RocknRoll', tint: 0x000000, fontSize: 128 });
    this._text.anchor.set(0.5);
    this._text.position.set(WR * 50, HR * 50);
    this._text.scale.set(TR);
    this.addChild(this._text);

    this.centerLine = new Graphics()
      .lineStyle(2, 0xff0000)
      .moveTo(WR * 50, 0)
      .lineTo(WR * 50, HR * 100);
    this.addChild(this.centerLine);
  }
}
