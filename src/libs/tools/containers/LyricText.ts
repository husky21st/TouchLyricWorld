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
    const numberOfPhrase: number = video.findIndex(video.lastPhrase) + 1;
    console.log('c', numberOfPhrase);
    const placeNumbers: Array<number> = new Array(numberOfPhrase);
    for (let i = 0; i < numberOfPhrase; i++) {
      let place: number = getRandomInt(4); //0, 1, 2, 3
      if(i !== 0){
        //0-0, 1-1, 2-2 or 3-3
        if(placeNumbers[i - 1] === place){
          place++;
          place %= 4;
        }
      }
      placeNumbers[i] = 0;
    }
    console.log('placeNmbers', placeNumbers);

    this.charTextBoxs = new Array();
    this.phraseTexts = new Array();
    let p: IPhrase = video.firstPhrase;
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
          .beginFill(0x00ffff)
          .drawCircle(0, 0, WR * 6)
          .endFill();
        textBG.alpha = 0.1;
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
    //console.log('phraseTexts', this.phraseTexts);
  }
}