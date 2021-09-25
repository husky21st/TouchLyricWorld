import { Container, Text } from "pixi.js"

export type CharInfo = {
  TextBox: Container; //character graphic data
  Duration: number;
  Place: number; //appearance place - 0, 1, 2, 3
  PhraseIndexOf: number; //number of character in the phrase
  PhraseCharCount: number;
}

export type PhraseInfo = {
  TextBox: Text;
  Duration: number;
  NextDuration: number;
}

export type POINT = {
  x: number;
  y: number;
}