import { Container, BitmapText } from "pixi.js"

export type CharInfo = {
  TextBox: Container; //character graphic data
  Duration: number;
  Place: number; //appearance place - 0, 1, 2, 3
  PhraseIndexOf: number; //number of character in the phrase
  Reached: boolean;
  Touched: boolean;
}

export type PhraseInfo = {
  TextBox: Container;
  Duration: number;
  NextDuration: number;
  PhrasePlace: number;
  PhraseCharCount: number;
}

export type POINT = {
  x: number;
  y: number;
}