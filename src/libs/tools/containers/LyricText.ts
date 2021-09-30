import { Container, Texture, Sprite, Graphics, BitmapText, BitmapFont, Point, ILineStyleOptions, LINE_JOIN, LINE_CAP, Circle, filters, InteractionEvent, utils } from 'pixi.js';
import { IBeat, IChar, IPhrase, IPlayer, IPlayerApp, IRenderingUnit, IVideo, IWord, Player, RenderingUnitFunction, Timer, ValenceArousalValue } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import { ScoreText } from 'libs/scenes/GameScene';
import { CharInfo, PhraseInfo } from 'libs/tools/others/types';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

const getDistance = (x: number, y: number) : number => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/**
 * LyricText Class
 */
export class LyricText extends Container {
  public charTextBoxs: Array<CharInfo>;
  public phraseTexts: Array<PhraseInfo>;
  //for mobile
  private baseWR: number = Manager.wr * 6;
  constructor(video: IVideo, private _ScoreText :ScoreText, private allLyricText: string, private _player: Player, private maxVocalAmplitude: number, private medianValenceArousal: ValenceArousalValue) {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;
    const startTime = performance.now();
    let CustomResolution: number = 2;
    if(utils.isMobile.any)CustomResolution = 1;

    BitmapFont.from(
      'BasicYuseiMagic',
      {
        fontFamily: 'Yusei Magic',
        fill: '#ffffff',
        fontSize: 96,
      },
      {
        resolution: CustomResolution,
        chars: this.allLyricText,
      },
    );
    const endTime1 = performance.now();
    console.log('!!!1st', endTime1 - startTime);

    this.sortableChildren = true;
    this.charTextBoxs = new Array();
    this.phraseTexts = new Array();
    
    this.createTexts(video, WR, HR, TR);
  }

  private createTexts(video: IVideo, WR: number, HR: number, TR: number): void{
    const endTime2 = performance.now();
    //decide place number
    const max28up: Array<number> = [0, 1, 10, 11, 20, 21, 30, 31, 40, 50, 60, 70, 80, 90]; // 17 ~
    const max16up: Array<number> = max28up.concat([2, 3, 12, 13, 22, 23, 32, 33, 41, 42, 51, 52, 61, 71, 81, 91]); // 11 ~ 16
    const max10up: Array<number> = max16up.concat([4, 14, 24, 34, 43, 53, 62, 63, 64, 72, 73, 74]); // 6 ~ 10
    const max5up: Array<number> = max10up.concat([65, 75, 82, 83, 84, 92]); // ~5
    let p: IPhrase = video.firstPhrase;
    const placeNumbers: Array<number> = new Array();
    let select: Array<number>;
    for (let i = 0; p !== null; i++) {
      const count: number = p.charCount;
      if(count < 5){
        select = max5up;
      }else if(count < 10){
        select = max10up;
      }else if(count < 16){
        select = max16up;
      }else{
        select = max28up;
      }
      let placeIndex: number = getRandomInt(select.length);
      let place: number = select[placeIndex];
      if(i !== 0){
        if(placeNumbers[i - 1] === place){
          placeIndex = getRandomInt(select.length);
          place = select[placeIndex];
        }
      }
      placeNumbers.push(place);
      p = p.next;
    }


    console.log(this.maxVocalAmplitude);
    p = video.firstPhrase;
    for(let i = 0; p !== null; i++){
      let c: IChar = p.firstChar;
      for(let j = 0; j < p.charCount; j++){
        //console.log(this._player.getVocalAmplitude(c.startTime), this._player.getValenceArousal(c.startTime));
        const volumeLevel: number = 2.7 + (0.6 * this._player.getVocalAmplitude(c.startTime) / this.maxVocalAmplitude);
        const valenceA: number = this._player.getValenceArousal(c.endTime).a - this.medianValenceArousal.a;
        const valenceV: number = this._player.getValenceArousal(c.endTime).v - this.medianValenceArousal.v;
        console.log(valenceA, valenceV);
        const bgColor: number = utils.rgb2hex([valenceA * 0.9 + 0.1, valenceA * valenceV * 80 + 0.82, valenceV * 0.9 + 0.8]);

        const charTextBox: Container = new Container();

        charTextBox.sortableChildren = true;
  
        const charText: BitmapText = new BitmapText(c.text, {fontName: 'BasicYuseiMagic', tint: 0x000000, fontSize: 64 });
        charText.anchor.set(0.5, 0.65);
        charText.scale.set(TR * 2.6);
        //charText.zIndex = 10000 - i;
        charText.zIndex = 100 * (i + 1) + j;
        charTextBox.addChild(charText);

        const charTextBG: BitmapText = new BitmapText(c.text, {fontName: 'BasicYuseiMagic', tint: bgColor, fontSize: 64 });
        charTextBG.anchor.set(0.5, 0.65);
        charTextBG.scale.set(TR * volumeLevel);
        charTextBG.zIndex = 100 * (i + 1) + j - 100000;
        charTextBG.alpha = 0;
        charTextBox.addChild(charTextBG);

        const blurFilter1 = new filters.BlurFilter();
        blurFilter1.blur = 4;
        charTextBG.filters = [blurFilter1];
  
        const textBG1: Graphics = new Graphics()
          .beginFill(0x0000ff)
          .drawCircle(0, 0, WR * 5)
          .endFill();
        textBG1.alpha = 0;
        charTextBox.addChild(textBG1);
        const textBG2: Graphics = new Graphics()
          .beginFill(0x00ff00)
          .drawCircle(0, 0, WR * 4)
          .endFill();
        textBG2.alpha = 0;
        charTextBox.addChild(textBG2);
        const textBG3: Graphics = new Graphics()
          .beginFill(0xff0000)
          .drawCircle(0, 0, WR * 3)
          .endFill();
        textBG3.alpha = 0;
        charTextBox.addChild(textBG3);
        const textBG4: Graphics = new Graphics()
          .beginFill(0xff0000)
          .drawCircle(0, 0, WR * 2)
          .endFill();
        textBG4.alpha = 0;
        charTextBox.addChild(textBG4);
        const textBG5: Graphics = new Graphics()
          .beginFill(0xff0000)
          .drawCircle(0, 0, WR * 1)
          .endFill();
        textBG5.alpha = 0;
        charTextBox.addChild(textBG5);

        charTextBox.visible = false;
        this.addChild(charTextBox);
        const newCharTextBox: CharInfo = {
          TextBox: charTextBox,
          Duration: c.duration + 50 || 50,
          Place: placeNumbers[i],
          PhraseIndexOf: j,
          Reached: false,
          Touched: false,
        };
        //charTextBox.scale.set(1.5);

        textBG1.interactive = true;
        textBG1.buttonMode = true;
        textBG1.on('pointerout', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG1.on('pointerover', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG1.on('touchstart', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG1.on('touchmove', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG2.interactive = true;
        textBG2.buttonMode = true;
        textBG2.on('pointerout', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG2.on('pointerover', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG2.on('touchstart', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG2.on('touchmove', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG3.interactive = true;
        textBG3.buttonMode = true;
        textBG3.on('pointerout', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG3.on('pointerover', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG3.on('touchstart', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG3.on('touchmove', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG4.interactive = true;
        textBG4.buttonMode = true;
        textBG4.on('pointerout', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG4.on('pointerover', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG4.on('touchstart', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG4.on('touchmove', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG5.interactive = true;
        textBG5.buttonMode = true;
        textBG5.on('pointerout', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG5.on('pointerover', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG5.on('touchstart', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);
        textBG5.on('touchmove', (event: InteractionEvent) => {this.addScore(event, newCharTextBox)}, this);


        this.charTextBoxs.push(newCharTextBox);
  
        c = c.next;
  
        //debug
        //charTextBox.position.set(WR * 50, HR * 50);
      }



      //set phraseText
      const phraseTextBox: Container = new Container();
      phraseTextBox.sortableChildren = true;
      
      const phraseText: BitmapText = new BitmapText(p.text, {fontName: 'BasicYuseiMagic', tint: 0xfa0fd3, fontSize: 68 });
      phraseText.anchor.set(0.5);
      phraseText.scale.set(TR);
      phraseText.zIndex = i;
      phraseTextBox.addChild(phraseText);

      const phraseTextBG: BitmapText = new BitmapText(p.text, {fontName: 'BasicYuseiMagic', tint: 0xffffff, fontSize: 68 });
      phraseTextBG.anchor.set(0.495, 0.495);
      phraseTextBG.scale.set(TR);
      phraseTextBG.zIndex = i - 1000;
      phraseTextBox.addChild(phraseTextBG);

      const blurFilter2 = new filters.BlurFilter();
      blurFilter2.blur = 2;
      phraseTextBG.filters = [blurFilter2];

      phraseTextBox.alpha = 0;
      phraseTextBox.visible = false;
      this.addChild(phraseTextBox);

      this.phraseTexts.push({
        TextBox: phraseTextBox,
        Duration: p.duration,
        NextDuration: p.next ? p.next.duration : 3000,
        PhrasePlace: placeNumbers[i],
        PhraseCharCount: p.charCount
      });

      p = p.next;
      //debug
      //phraseText.position.set(WR * 100, HR * 100);
    }
    //console.log('charTextBoxs', this.charTextBoxs);
    //console.log('phraseTexts', this.phraseTexts);
    const endTime3 = performance.now();
    console.log('!2nd', endTime3 - endTime2);
  }

  private addScore(event: InteractionEvent, charTextBox: CharInfo): void{
    if(!charTextBox.Reached || charTextBox.Touched) return;
    const position: Point = event.data.getLocalPosition(event.currentTarget);
    if(getDistance(position.x, position.y) > this.baseWR) return;
    charTextBox.TextBox.interactive = false;
    charTextBox.Touched = true;
    charTextBox.TextBox.children[0].alpha = 1;
    this._ScoreText.changeScore();
  }
}