import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader, ILineStyleOptions, LINE_JOIN, LINE_CAP } from 'pixi.js';
import { IBeat, IChar, IPhrase, IPlayer, IPlayerApp, IRenderingUnit, IVideo, IWord, Player, RenderingUnitFunction, Timer } from 'textalive-app-api';
import { IScene, Manager } from 'libs/manages/Manager';
import { CharInfo, PhraseInfo } from 'libs/tools/others/types';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/**
 * LyricText Class
 */
export class LyricText extends Container {
  public charTextBoxs: Array<CharInfo>;
  public phraseTexts: Array<PhraseInfo>;

  constructor(video: IVideo) {
    super();
    const WR: number = Manager.wr;
    const HR: number = Manager.hr;
    const TR: number = Manager.textScale;
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
        //0-0, 1-1, 2-2 or 3-3
        if(placeNumbers[i - 1] === place){
          placeIndex = getRandomInt(select.length);
          place = select[placeIndex];
        }
      }
      placeNumbers.push(place);
      p = p.next;
    }
    console.log('placeNmbers', placeNumbers);

    this.charTextBoxs = new Array();
    this.phraseTexts = new Array();
    p = video.firstPhrase;
    for(let i = 0; p !== null; i++){
      let c: IChar = p.firstChar;
      for(let j = 0; j < p.charCount; j++){
        const charTextBox: Container = new Container();
  
        const charText: Text = new Text(c.text, {fontFamily: 'Yusei Magic', fill: 0x000000, fontSize: 128 });
        charText.resolution = 2;
        charText.anchor.set(0.5, 0.55);
        charText.scale.set(TR * 1.3);
        //charText.zIndex = 10000 - i;
        charText.zIndex = 10000 + i;
        charTextBox.addChild(charText);
  
        const textBG: Graphics = new Graphics()
          .beginFill(0xffffff)
          .drawCircle(0, 0, WR * 6)
          .endFill();
        textBG.alpha = 0;
        charTextBox.addChild(textBG);
  
        charTextBox.visible = false;
        this.addChild(charTextBox);
        //charTextBox.scale.set(1.5);
        this.charTextBoxs.push({
          TextBox: charTextBox,
          Duration: c.duration + 50 || 50,
          Place: placeNumbers[i],
          PhraseIndexOf: j,
          PhraseCharCount: p.charCount
        });
  
        c = c.next;
  
        //debug
        //charTextBox.position.set(WR * 50, HR * 50);
      }

      //set phraseText
      const phraseText: Text = new Text(p.text, {fontFamily: 'Yusei Magic', fill: 0x000000, fontSize: 64 });
      phraseText.resolution = 2;
      phraseText.anchor.set(0.5);
      phraseText.scale.set(TR);
      phraseText.zIndex = i;
      phraseText.alpha = 0;
      phraseText.visible = false;
      this.addChild(phraseText);
      this.phraseTexts.push({
        TextBox: phraseText,
        Duration: p.duration,
        NextDuration: p.next ? p.next.duration : 3000
      });

      p = p.next;
      //debug
      //phraseText.position.set(WR * 100, HR * 100);
    }
    //console.log('charTextBoxs', this.charTextBoxs);
    console.log('phraseTexts', this.phraseTexts);
  }
}