# TouchLyricWorld
![demoOutPut](https://user-images.githubusercontent.com/68993961/135465467-e0b4f60d-939b-42bb-b1d9-5fd3a01a4d3f.gif)

**歌詞と触れ合う**をコンセプトにしたリズムゲームです.

## 内容

歌詞が歌われるタイミングに合わせて歌詞をなぞっていくゲームです.  
また，曲自体にも積極性を持たせるためにビートに合わせて操作し，リズムに乗って楽しむ要素もあります.

URLにクエリパラメータ `ta_song_url={楽曲のURL}` を追記することでTextAlive対応曲なら全て遊べます.

パソコンでもスマホでも同じ体験が得られるように，できるだけ幅広い機種でのレスポンシブ対応をしています.

## 開発

### 環境

- [Node.js](https://nodejs.org/)
  - v12.\*
- [npm](https://www.npmjs.com/)
  - v7.\*

### ローカルで起動

```
git clone git@github.com:husky21st/TouchLyricWorld.git
cd TouchLyricWorld
touch .env
echo 'NEXT_PUBLIC_API_TOKEN = YourToken' >> .env
npm i .
npm run dev
```

\* GitHub PagesではGitHub上でSecrets情報の登録を行なっています

### ビルド

```
npm run build
```

## 主要ライブラリ

```
PixiJS
GSAP 3
TextAlive App API
```

## TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。

## クレジット

- Cheering Miku Picture : [ねこみん](https://twitter.com/nukotun)
- Menu&Result Graphic: [つぼ](https://twitter.com/tsubo_pi)
- Roses and Flower: AukAwIt

## 注意事項

画像素材の改変，二次配布は固く禁じます.