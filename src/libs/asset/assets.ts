import FontPreloadingText from '../../../public/Texts/FontPreloadingText.json';

export const assets = [
  {
    name: 'RocknRoll One',
    url: 'https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap',
    metadata: { font: { testString: FontPreloadingText.text.join('').replace(/\s/g, '') } },
  },
  { name: "fontText", url: 'Texts/FontPreloadingText.json' },
  { name: 'leftMiku', url: 'DancingMiku/left.png' },
  { name: 'rightMiku', url: 'DancingMiku/right.png' },
  { name: 'centerMiku', url: 'DancingMiku/center.png' },
];
