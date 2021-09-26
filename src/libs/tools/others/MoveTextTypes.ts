import { Container } from 'pixi.js';
import { CharInfo, PhraseInfo, POINT} from 'libs/tools/others/types';
import { MoveLyricText } from 'libs/scenes/GameScene';
import { TouchLine } from 'libs/tools/containers/TouchLine';

export class MoveTextTypes {
  private _MoveLyricText: MoveLyricText;
  constructor() {
    this._MoveLyricText = new MoveLyricText();
  }

  public moveCharText(charTextBox: CharInfo): void{
    const placeNumber: number = charTextBox.Place;
    //const placeNumber: number = 65;
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
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType4(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 1){
      //Max : 29
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 29){
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
    }else if(placeNumber === 10){
      //Max : 32
      if(indexOf < 5){
        this.moveTextType3(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType6(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType0(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType4(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType5(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 11){
      //Max : 29
      if(indexOf < 5){
        this.moveTextType3(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType6(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType0(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType4(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 29){
        this.moveTextType7(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 12){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType3(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 13){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType3(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 14){
      //Max : 10
      if(indexOf < 5){
        this.moveTextType3(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 10){
        this.moveTextType2(charTextBox.TextBox, indexOf - 5, charTextBox.Duration, true);
      }
    }else if(placeNumber === 20){
      //Max : 32
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType4(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 21){
      //Max : 29
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 29){
        this.moveTextType6(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 22){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 23){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 24){
      //Max : 10
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 10){
        this.moveTextType0(charTextBox.TextBox, indexOf - 5, charTextBox.Duration, true);
      }
    }else if(placeNumber === 30){
      //Max : 32
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType6(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType0(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType4(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType5(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 31){
      //Max : 29
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType6(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType0(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType4(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 29){
        this.moveTextType7(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }else if(placeNumber === 32){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 33){
      //Max : 16
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType7(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }
    }else if(placeNumber === 34){
      //Max : 10
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 10){
        this.moveTextType3(charTextBox.TextBox, indexOf - 5, charTextBox.Duration, true);
      }
    }else if(placeNumber === 40){
      //Max : 30
      if(indexOf < 7){
        this.moveTextType4(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType7(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType3(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }else if(indexOf < 23){
        this.moveTextType5(charTextBox.TextBox, indexOf - 16, charTextBox.Duration);
      }else if(indexOf < 30){
        this.moveTextType4(charTextBox.TextBox, indexOf - 23, charTextBox.Duration, true);
      }
    }else if(placeNumber === 41){
      //Max : 27
      if(indexOf < 7){
        this.moveTextType4(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType7(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType3(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }else if(indexOf < 23){
        this.moveTextType5(charTextBox.TextBox, indexOf - 16, charTextBox.Duration);
      }else if(indexOf < 27){
        this.moveTextType6(charTextBox.TextBox, indexOf - 23, charTextBox.Duration, true);
      }
    }else if(placeNumber === 42){
      //Max : 16
      if(indexOf < 7){
        this.moveTextType4(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType7(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType2(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }
    }else if(placeNumber === 43){
      //Max : 14
      if(indexOf < 7){
        this.moveTextType4(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 14){
        this.moveTextType5(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }
    }else if(placeNumber === 50){
      //Max : 30
      if(indexOf < 7){
        this.moveTextType5(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType6(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType0(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }else if(indexOf < 23){
        this.moveTextType4(charTextBox.TextBox, indexOf - 16, charTextBox.Duration);
      }else if(indexOf < 30){
        this.moveTextType5(charTextBox.TextBox, indexOf - 23, charTextBox.Duration, true);
      }
    }else if(placeNumber === 51){
      //Max : 27
      if(indexOf < 7){
        this.moveTextType5(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType6(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType0(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }else if(indexOf < 23){
        this.moveTextType4(charTextBox.TextBox, indexOf - 16, charTextBox.Duration);
      }else if(indexOf < 27){
        this.moveTextType7(charTextBox.TextBox, indexOf - 23, charTextBox.Duration, true);
      }
    }else if(placeNumber === 52){
      //Max : 16
      if(indexOf < 7){
        this.moveTextType5(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType6(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType1(charTextBox.TextBox, indexOf - 11, charTextBox.Duration, true);
      }
    }else if(placeNumber === 53){
      //Max : 14
      if(indexOf < 7){
        this.moveTextType5(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 14){
        this.moveTextType4(charTextBox.TextBox, indexOf - 7, charTextBox.Duration, true);
      }
    }else  if(placeNumber === 60){
      //Max : 29
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType7(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType3(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }else if(indexOf < 20){
        this.moveTextType5(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 24){
        this.moveTextType6(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }else if(indexOf < 29){
        this.moveTextType0(charTextBox.TextBox, indexOf - 24, charTextBox.Duration, true);
      }
    }else if(placeNumber === 61){
      //Max : 27
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType7(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType3(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }else if(indexOf < 20){
        this.moveTextType5(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 27){
        this.moveTextType4(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }
    }else if(placeNumber === 62){
      //Max : 13
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType7(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType2(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }
    }else if(placeNumber === 63){
      //Max : 11
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType5(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else if(placeNumber === 64){
      //Max : 11
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType4(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else if(placeNumber === 65){
      //Max : 5
      if(indexOf < 5){
        this.moveTextType1(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }
    }else if(placeNumber === 70){
      //Max : 29
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType6(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType0(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }else if(indexOf < 20){
        this.moveTextType4(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 24){
        this.moveTextType7(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }else if(indexOf < 29){
        this.moveTextType3(charTextBox.TextBox, indexOf - 24, charTextBox.Duration, true);
      }
    }else if(placeNumber === 71){
      //Max : 27
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType6(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType0(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }else if(indexOf < 20){
        this.moveTextType4(charTextBox.TextBox, indexOf - 13, charTextBox.Duration);
      }else if(indexOf < 27){
        this.moveTextType5(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }
    }else if(placeNumber === 72){
      //Max : 13
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 8){
        this.moveTextType6(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 13){
        this.moveTextType1(charTextBox.TextBox, indexOf - 8, charTextBox.Duration, true);
      }
    }else if(placeNumber === 73){
      //Max : 11
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType4(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else if(placeNumber === 74){
      //Max : 11
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 11){
        this.moveTextType5(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else if(placeNumber === 75){
      //Max : 5
      if(indexOf < 5){
        this.moveTextType2(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }
    }else  if(placeNumber === 80){
      //Max : 32
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType3(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration);
      }else if(indexOf < 20){
        this.moveTextType6(charTextBox.TextBox, indexOf - 16, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType0(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }else if(indexOf < 32){
        this.moveTextType4(charTextBox.TextBox, indexOf - 25, charTextBox.Duration);
      }
    }else if(placeNumber === 81){
      //Max : 23
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType3(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType5(charTextBox.TextBox, indexOf - 9, charTextBox.Duration);
      }else if(indexOf < 23){
        this.moveTextType4(charTextBox.TextBox, indexOf - 16, charTextBox.Duration, true);
      }
    }else if(placeNumber === 82){
      //Max : 9
      if(indexOf < 4){
        this.moveTextType7(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType2(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else if(placeNumber === 83){
      //Max : 7
      if(indexOf < 7){
        this.moveTextType5(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }
    }else if(placeNumber === 84){
      //Max : 7
      if(indexOf < 7){
        this.moveTextType4(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }
    }else if(placeNumber === 90){
      //Max : 32
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType0(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration);
      }else if(indexOf < 20){
        this.moveTextType7(charTextBox.TextBox, indexOf - 16, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType3(charTextBox.TextBox, indexOf - 20, charTextBox.Duration, true);
      }else if(indexOf < 32){
        this.moveTextType5(charTextBox.TextBox, indexOf - 25, charTextBox.Duration);
      }
    }else if(placeNumber === 91){
      //Max : 23
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType0(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }else if(indexOf < 16){
        this.moveTextType4(charTextBox.TextBox, indexOf - 9, charTextBox.Duration);
      }else if(indexOf < 23){
        this.moveTextType5(charTextBox.TextBox, indexOf - 16, charTextBox.Duration, true);
      }
    }else if(placeNumber === 92){
      //Max : 9
      if(indexOf < 4){
        this.moveTextType6(charTextBox.TextBox, indexOf, charTextBox.Duration, true);
      }else if(indexOf < 9){
        this.moveTextType1(charTextBox.TextBox, indexOf - 4, charTextBox.Duration, true);
      }
    }else{
      console.log('%c!PhraseNumber error!', 'color: red');
      //Max : 32
      if(indexOf < 5){
        this.moveTextType0(charTextBox.TextBox, indexOf, charTextBox.Duration);
      }else if(indexOf < 9){
        this.moveTextType6(charTextBox.TextBox, indexOf - 5, charTextBox.Duration);
      }else if(indexOf < 13){
        this.moveTextType7(charTextBox.TextBox, indexOf - 9, charTextBox.Duration, true);
      }else if(indexOf < 18){
        this.moveTextType3(charTextBox.TextBox, indexOf - 13, charTextBox.Duration, true);
      }else if(indexOf < 25){
        this.moveTextType5(charTextBox.TextBox, indexOf - 18, charTextBox.Duration);
      }else if(indexOf < 32){
        this.moveTextType4(charTextBox.TextBox, indexOf - 25, charTextBox.Duration, true);
      }
    }
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:1.05, y:0.04});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:-0.15, y:0}, {x:-0.65, y:-0.14});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:1.15, y:0}, {x:1.65, y:-0.14});
  }

  //Max : 5
  private moveTextType3(TextBox: Container, indexOf: number, Duration: number , reverse: boolean = false): void{
    //arc( - W * 0.05, W * 0.04, W, 0, P * 25.2 / 180); //P * 25.2 / 180
    let radian: number = 0;
    if(!reverse){
      radian = Math.PI * (360 - 25.2 + (25.2 * (5 - indexOf)) / 5 ) / 180;
    }else{
      radian = Math.PI * (360 - 25.2 + (25.2 * indexOf) / 5 ) / 180;
    }
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:-0.05, y:0.04});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.9715, y:-0.3515});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.0285, y:-0.3515});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.5, y:-0.469});
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
    this._MoveLyricText.moveTextBasic(TextBox, Duration, radian, {x:0.5, y:-0.05}, {x:0.5, y:-0.469});
  }

  public movePhraseText(phraseTextBox: PhraseInfo, beatDuration: number, _TouchLine: TouchLine): void {
    this._MoveLyricText.movePhraseText(phraseTextBox, beatDuration);
    const placeNumber: number = phraseTextBox.PhrasePlace;
    const count: number = phraseTextBox.PhraseCharCount - 1;
    if(placeNumber === 0){
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(7, count - 9, true);
      _TouchLine.makeLine(3, count - 13, true);
      _TouchLine.makeLine(5, count - 18);
      _TouchLine.makeLine(4, count - 25, true);
    }else if(placeNumber === 1){
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(7, count - 9, true);
      _TouchLine.makeLine(3, count - 13, true);
      _TouchLine.makeLine(5, count - 18);
      _TouchLine.makeLine(6, count - 25, true);
    }else if(placeNumber === 2){
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(5, count - 9, true);
    }else if(placeNumber === 3){
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(4, count - 9, true);
    }else if(placeNumber === 4){
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(1, count - 5, true);
    }else if(placeNumber === 10){
      _TouchLine.makeLine(3, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(6, count - 9, true);
      _TouchLine.makeLine(0, count - 13, true);
      _TouchLine.makeLine(4, count - 18);
      _TouchLine.makeLine(5, count - 25, true);
    }else if(placeNumber === 11){
      _TouchLine.makeLine(3, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(6, count - 9, true);
      _TouchLine.makeLine(0, count - 13, true);
      _TouchLine.makeLine(4, count - 18);
      _TouchLine.makeLine(7, count - 25, true);
    }else if(placeNumber === 12){
      _TouchLine.makeLine(3, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(4, count - 9, true);
    }else if(placeNumber === 13){
      _TouchLine.makeLine(3, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(5, count - 9, true);
    }else if(placeNumber === 14){
      _TouchLine.makeLine(3, count);
      _TouchLine.makeLine(2, count - 5);
    }else if(placeNumber === 20){
      _TouchLine.makeLine(1, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(7, count - 9, true);
      _TouchLine.makeLine(3, count - 13, true);
      _TouchLine.makeLine(5, count - 18);
      _TouchLine.makeLine(4, count - 25, true);
    }else if(placeNumber === 21){
      _TouchLine.makeLine(1, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(7, count - 9, true);
      _TouchLine.makeLine(3, count - 13, true);
      _TouchLine.makeLine(5, count - 18);
      _TouchLine.makeLine(6, count - 25, true);
    }else if(placeNumber === 22){
      _TouchLine.makeLine(1, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(5, count - 9, true);
    }else if(placeNumber === 23){
      _TouchLine.makeLine(1, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(4, count - 9, true);
    }else if(placeNumber === 24){
      _TouchLine.makeLine(1, count);
      _TouchLine.makeLine(0, count - 5, true);
    }else if(placeNumber === 30){
      _TouchLine.makeLine(2, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(6, count - 9, true);
      _TouchLine.makeLine(0, count - 13, true);
      _TouchLine.makeLine(4, count - 18);
      _TouchLine.makeLine(5, count - 25, true);
    }else if(placeNumber === 31){
      _TouchLine.makeLine(2, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(6, count - 9, true);
      _TouchLine.makeLine(0, count - 13, true);
      _TouchLine.makeLine(4, count - 18);
      _TouchLine.makeLine(7, count - 25, true);
    }else if(placeNumber === 32){
      _TouchLine.makeLine(2, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(4, count - 9, true);
    }else if(placeNumber === 33){
      _TouchLine.makeLine(2, count);
      _TouchLine.makeLine(7, count - 5);
      _TouchLine.makeLine(5, count - 9, true);
    }else if(placeNumber === 34){
      _TouchLine.makeLine(2, count);
      _TouchLine.makeLine(3, count - 5, true);
    }else if(placeNumber === 40){
      _TouchLine.makeLine(4, count);
      _TouchLine.makeLine(7, count - 7, true);
      _TouchLine.makeLine(3, count - 11, true);
      _TouchLine.makeLine(5, count - 16);
      _TouchLine.makeLine(4, count - 23, true);
    }else if(placeNumber === 41){
      _TouchLine.makeLine(4, count);
      _TouchLine.makeLine(7, count - 7, true);
      _TouchLine.makeLine(3, count - 11, true);
      _TouchLine.makeLine(5, count - 16);
      _TouchLine.makeLine(6, count - 23, true);
    }else if(placeNumber === 42){
      _TouchLine.makeLine(4, count);
      _TouchLine.makeLine(7, count - 7, true);
      _TouchLine.makeLine(2, count - 11, true);
    }else if(placeNumber === 43){
      _TouchLine.makeLine(4, count);
      _TouchLine.makeLine(5, count - 7, true);
    }else if(placeNumber === 50){
      _TouchLine.makeLine(5, count);
      _TouchLine.makeLine(6, count - 7, true);
      _TouchLine.makeLine(0, count - 11, true);
      _TouchLine.makeLine(4, count - 16);
      _TouchLine.makeLine(5, count - 23, true);
    }else if(placeNumber === 51){
      _TouchLine.makeLine(5, count);
      _TouchLine.makeLine(6, count - 7, true);
      _TouchLine.makeLine(0, count - 11, true);
      _TouchLine.makeLine(4, count - 16);
      _TouchLine.makeLine(7, count - 23, true);
    }else if(placeNumber === 52){
      _TouchLine.makeLine(5, count);
      _TouchLine.makeLine(6, count - 7, true);
      _TouchLine.makeLine(1, count - 11, true);
    }else if(placeNumber === 53){
      _TouchLine.makeLine(5, count);
      _TouchLine.makeLine(4, count - 7, true);
    }else if(placeNumber === 60){
      _TouchLine.makeLine(6, count);
      _TouchLine.makeLine(7, count - 4, true);
      _TouchLine.makeLine(3, count - 8, true);
      _TouchLine.makeLine(5, count - 13);
      _TouchLine.makeLine(6, count - 20, true);
      _TouchLine.makeLine(0, count - 24, true);
    }else if(placeNumber === 61){
      _TouchLine.makeLine(6, count);
      _TouchLine.makeLine(7, count - 4, true);
      _TouchLine.makeLine(3, count - 8, true);
      _TouchLine.makeLine(5, count - 13);
      _TouchLine.makeLine(4, count - 20, true);
    }else if(placeNumber === 62){
      _TouchLine.makeLine(6, count);
      _TouchLine.makeLine(7, count - 4, true);
      _TouchLine.makeLine(2, count - 8, true);
    }else if(placeNumber === 63){
      _TouchLine.makeLine(6, count);
      _TouchLine.makeLine(5, count - 4, true);
    }else if(placeNumber === 64){
      _TouchLine.makeLine(6, count);
      _TouchLine.makeLine(4, count - 4, true);
    }else if(placeNumber === 65){
      _TouchLine.makeLine(1, count, true);
    }else if(placeNumber === 70){
      _TouchLine.makeLine(7, count);
      _TouchLine.makeLine(6, count - 4, true);
      _TouchLine.makeLine(0, count - 8, true);
      _TouchLine.makeLine(4, count - 13);
      _TouchLine.makeLine(7, count - 20, true);
      _TouchLine.makeLine(3, count - 24, true);
    }else if(placeNumber === 71){
      _TouchLine.makeLine(7, count);
      _TouchLine.makeLine(6, count - 4, true);
      _TouchLine.makeLine(0, count - 8, true);
      _TouchLine.makeLine(4, count - 13);
      _TouchLine.makeLine(5, count - 20, true);
    }else if(placeNumber === 72){
      _TouchLine.makeLine(7, count);
      _TouchLine.makeLine(6, count - 4, true);
      _TouchLine.makeLine(1, count - 8, true);
    }else if(placeNumber === 73){
      _TouchLine.makeLine(7, count);
      _TouchLine.makeLine(4, count - 4, true);
    }else if(placeNumber === 74){
      _TouchLine.makeLine(7, count);
      _TouchLine.makeLine(5, count - 4, true);
    }else if(placeNumber === 75){
      _TouchLine.makeLine(2, count, true);
    }else  if(placeNumber === 80){
      _TouchLine.makeLine(7, count, true);
      _TouchLine.makeLine(3, count - 4, true);
      _TouchLine.makeLine(5, count - 9);
      _TouchLine.makeLine(6, count - 16, true);
      _TouchLine.makeLine(0, count - 20, true);
      _TouchLine.makeLine(4, count - 25);
    }else if(placeNumber === 81){
      _TouchLine.makeLine(7, count, true);
      _TouchLine.makeLine(3, count - 4, true);
      _TouchLine.makeLine(5, count - 9);
      _TouchLine.makeLine(4, count - 16, true);
    }else if(placeNumber === 82){
      _TouchLine.makeLine(7, count, true);
      _TouchLine.makeLine(2, count - 4, true);
    }else if(placeNumber === 83){
      _TouchLine.makeLine(5, count, true);
    }else if(placeNumber === 84){
      _TouchLine.makeLine(4, count, true);
    }else if(placeNumber === 90){
      _TouchLine.makeLine(6, count, true);
      _TouchLine.makeLine(0, count - 4, true);
      _TouchLine.makeLine(4, count - 9);
      _TouchLine.makeLine(7, count - 16, true);
      _TouchLine.makeLine(3, count - 20, true);
      _TouchLine.makeLine(5, count - 25);
    }else if(placeNumber === 91){
      _TouchLine.makeLine(6, count, true);
      _TouchLine.makeLine(0, count - 4, true);
      _TouchLine.makeLine(4, count - 9);
      _TouchLine.makeLine(5, count - 16, true);
    }else if(placeNumber === 92){
      _TouchLine.makeLine(6, count, true);
      _TouchLine.makeLine(1, count - 4, true);
    }else{
      _TouchLine.makeLine(0, count);
      _TouchLine.makeLine(6, count - 5);
      _TouchLine.makeLine(7, count - 9, true);
      _TouchLine.makeLine(3, count - 13, true);
      _TouchLine.makeLine(5, count - 18);
      _TouchLine.makeLine(4, count - 25, true);
    }
  }


  public startCharPlace(placeType: number): POINT {
    const PI: number = Math.PI;
    const placePoint: POINT = {x:0, y:0};
    if(placeType === 0 || placeType === 4){
      placePoint.x = 1.05 + Math.cos(PI);
      placePoint.y = 0.04 + Math.sin(PI);
    }else if(placeType === 1 || placeType === 5){
      placePoint.x = -0.05 + Math.cos(0);
      placePoint.y = 0.04 + Math.sin(0);
    }else if(placeType === 2){
      placePoint.x = -0.65 + Math.cos(PI * 11 / 180);
      placePoint.y = -0.14 + Math.sin(PI * 11 / 180);
    }else if(placeType === 3){
      placePoint.x =  1.65 + Math.cos(PI * 169 / 180);
      placePoint.y = -0.14 + Math.sin(PI * 169 / 180);
    }else if(placeType === 6){
      placePoint.x = -0.65 + Math.cos(PI * 37.2 / 180);
      placePoint.y = -0.14 + Math.sin(PI * 37.2 / 180);
    }else if(placeType === 7){
      placePoint.x = 1.65 + Math.cos(PI * 142.8 / 180);
      placePoint.y = -0.14 + Math.sin(PI * 142.8 / 180);
    }else{
      placePoint.x = 0.5 + Math.cos(PI * 90 / 180);
      placePoint.y = -0.469 + Math.sin(PI * 90 / 180);
    }
    return  placePoint;
  }
}
