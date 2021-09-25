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
    for (let i = 0; i < 8; i++) {
      this.makeLine(i);
    }
  }

  //based on 1920/1080 and change the scale later.
  public makeLine(type: number, indexOf: number = 100): void {
    const W: number = this.basedWidth;
    const H: number = this.basedHeight;
    const P: number = this.PI;
    const LS: ILineStyleOptions = {width: 5, color: 0x666666, alpha: 0.5, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND};
    if(type === 0){
      //MAX : 5
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 1.05, W * 0.04, W, P * 154.8 / 180, P); //P * 25.2 / 180
      this.addChild(newLine);
    }else if(type === 1){
      //MAX : 5
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc( - W * 0.65, - W * 0.14, W, P * 11 / 180, P * 37.2 / 180); //P * 26.2 / 180
      this.addChild(newLine);
    }else if(type === 2){
      //MAX : 5
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 1.65, - W * 0.14, W, P * 142.8 / 180, P * 169 / 180); //P * 26.2 / 180
      this.addChild(newLine);
    }else if(type === 3){
      //MAX : 5
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc( - W * 0.05, W * 0.04, W, 0, P * 25.2 / 180); //P * 25.2 / 180
      this.addChild(newLine);
    }else if(type === 4){
      //MAX : 7
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 0.9715, - W * 0.3515, W, P * 118 / 180, P * 157.1 / 180); //P * 39.1 / 180
      this.addChild(newLine);
    }else if(type === 5){
      //MAX : 7
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 0.0285, - W * 0.3515, W, P * 22.9 / 180, P * 62 / 180); //P * 39.1 / 180
      this.addChild(newLine);
    }else if(type === 6){
      //MAX : 4
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 0.5, - W * 0.469, W, P * 90 / 180, P * 110.8 / 180); //P * 20.8 / 180
      this.addChild(newLine);
    }else if(type === 7){
      //MAX : 4
      const newLine: Graphics = new Graphics()
        .lineStyle(LS)
        .arc(W * 0.5, - W * 0.469, W, P * 69.2 / 180, P * 90 / 180); //P * 20.8 / 180
      this.addChild(newLine);
    }
  }
}