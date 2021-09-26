import { Container, Texture, Sprite, Graphics, BitmapText, Text, Loader, ILineStyleOptions, LINE_JOIN, LINE_CAP } from 'pixi.js';

/**
 * TouchLine Class
 */
export class TouchLine extends Container {
  private readonly basedWidth: number = 1920;
  private readonly basedHeight: number = 1080;
  private readonly PI: number = Math.PI;
  constructor() {
    super();
  }

  //based on 1920/1080 and change the scale later.
  public makeLine(type: number, indexOf: number, reverse: boolean = false): void {
    const W: number = this.basedWidth;
    const H: number = this.basedHeight;
    const P: number = this.PI;
    const LS: ILineStyleOptions = {width: 5, color: 0x111111, alpha: 1, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND};
    const newLine: Graphics = new Graphics();
    if(type === 0){
      //MAX : 5
      const count: number = Math.min(indexOf, 5);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 154.8 + 25.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc(W * 1.05, W * 0.04, W, P * 154.8 / 180, P * radian / 180); //P * 25.2 / 180
      }else{
        const radian: number = 180 - 25.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc(W * 1.05, W * 0.04, W, P * 180 / 180, P * radian / 180, true); //P * 25.2 / 180
      }
    }else if(type === 1){
      //MAX : 5
      const count: number = Math.min(indexOf, 5);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 11 + 26.2 * (5 - count) / 5;
        newLine
          .lineStyle(LS)
          .arc( - W * 0.65, - W * 0.14, W, P * 37.2 / 180, P * radian / 180, true); //P * 26.2 / 180
      }else{
        const radian: number = 11 + 26.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc( - W * 0.65, - W * 0.14, W, P * 11 / 180, P * radian / 180); //P * 26.2 / 180
      }
    }else if(type === 2){
      //MAX : 5
      const count: number = Math.min(indexOf, 5);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 142.8 + 26.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc(W * 1.65, - W * 0.14, W, P * 142.8 / 180, P * radian / 180); //P * 26.2 / 180
      }else{
        const radian: number = 169 - 26.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc(W * 1.65, - W * 0.14, W, P * 169 / 180, P * radian / 180, true); //P * 26.2 / 180
      }
    }else if(type === 3){
      //MAX : 5
      const count: number = Math.min(indexOf, 5);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 25.2 * (5 - count) / 5;
        newLine
          .lineStyle(LS)
          .arc( - W * 0.05, W * 0.04, W, P * 25.2 / 180, P * radian / 180, true); //P * 25.2 / 180
      }else{
        const radian: number = 25.2 * count / 5;
        newLine
          .lineStyle(LS)
          .arc( - W * 0.05, W * 0.04, W, 0, P * radian / 180); //P * 25.2 / 180
      }
    }else if(type === 4){
      //MAX : 7
      const count: number = Math.min(indexOf, 7);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 118 + 39.1 * count / 7;
        newLine
          .lineStyle(LS)
          .arc(W * 0.9715, - W * 0.3515, W, P * 118 / 180, P * radian / 180); //P * 39.1 / 180
      }else{
        const radian: number = 157.1 - 39.1 * count / 7;
        newLine
          .lineStyle(LS)
          .arc(W * 0.9715, - W * 0.3515, W, P * 157.1 / 180, P * radian / 180, true); //P * 39.1 / 180
      }
    }else if(type === 5){
      //MAX : 7
      const count: number = Math.min(indexOf, 7);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 62 - 39.1 * count / 7;
        newLine
          .lineStyle(LS)
          .arc(W * 0.0285, - W * 0.3515, W, P * 62 / 180, P * radian / 180, true); //P * 39.1 / 180
      }else{
        const radian: number = 22.9 + 39.1 * count / 7;
        newLine
          .lineStyle(LS)
          .arc(W * 0.0285, - W * 0.3515, W, P * 22.9 / 180, P * radian / 180); //P * 39.1 / 180
      }
    }else if(type === 6){
      //MAX : 4
      const count: number = Math.min(indexOf, 4);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 90 + 20.8 * count / 4;
        newLine
          .lineStyle(LS)
          .arc(W * 0.5, - W * 0.469, W, P * 90 / 180, P * radian / 180); //P * 20.8 / 180
      }else{
        const radian: number = 110.8 - 20.8 * count / 4;
        newLine
          .lineStyle(LS)
          .arc(W * 0.5, - W * 0.469, W, P * 110.8 / 180, P * radian / 180, true); //P * 20.8 / 180
      }
    }else if(type === 7){
      //MAX : 4
      const count: number = Math.min(indexOf, 4);
      if(count <= 0) {
        newLine.destroy();
        return;
      }
      if(reverse){
        const radian: number = 90 - 20.8 * count / 4;
        newLine
          .lineStyle(LS)
          .arc(W * 0.5, - W * 0.469, W, P * 90 / 180, P * radian / 180, true); //P * 20.8 / 180
      }else{
        const radian: number = 69.2 + 20.8 * count / 4;
        newLine
          .lineStyle(LS)
          .arc(W * 0.5, - W * 0.469, W, P * 69.2 / 180, P * radian / 180); //P * 20.8 / 180
      }
    }
    newLine.alpha = 0;
    this.addChild(newLine);
  }
}