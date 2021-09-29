import FontPreloadingText from '../../../public/Texts/FontPreloadingText.json';

export const assets = [
  {
    name: 'RocknRoll One',
    url: 'https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap',
    metadata: {
      font: {
        testString: FontPreloadingText.required.join('') + FontPreloadingText.text.join(''),
      },
    },
  },
  { name: 'fontText', url: 'Texts/FontPreloadingText.json' },
  { name: 'leftMiku', url: 'DancingMiku/left.png' },
  { name: 'rightMiku', url: 'DancingMiku/right.png' },
  { name: 'centerMiku', url: 'DancingMiku/center.png' },
  { name: 'mainFlower', url: 'Shapes/mainFlower.png'},
  { name: 'frame', url: 'Shapes/frame.png'},
  { name: 'rose1', url: 'Shapes/rose1.png'},
  { name: 'rose2', url: 'Shapes/rose2.png'},
  { name: 'rose3', url: 'Shapes/rose3.png'},
  { name: 'rose4', url: 'Shapes/rose4.png'},
  { name: 'titlePlayButton', url: 'TitleMaterials/playButton.png'},
  { name: 'titleCreditButton', url: 'TitleMaterials/creditButton.png'},
  { name: 'title', url: 'TitleMaterials/title.png'},
  { name: 'songTitle1', url: 'TitleMaterials/songTitle1.png'},
  { name: 'songTitle2', url: 'TitleMaterials/songTitle2.png'},
  { name: 'songTitle3', url: 'TitleMaterials/songTitle3.png'},
  { name: 'songTitle4', url: 'TitleMaterials/songTitle4.png'},
  { name: 'songTitle5', url: 'TitleMaterials/songTitle5.png'},
  { name: 'songTitle6', url: 'TitleMaterials/songTitle6.png'},
  { name: 'loopBack', url: 'Shapes/cycle.svg'},
  { name: 'gamePlayButton', url: 'Shapes/play.svg'},
  { name: 'gamePauseButton', url: 'Shapes/pause.svg'}
];
