import GenerateLinearGradient from './GenerateLinearGradient';

export default class GenerateStarField {
  constructor(width, height, colors = []) {
    let config = {};

    config.width = width;
    config.height = height;

    let gradientComplexity = Math.round(Math.random() * 4);
    let gradientConfig = new GenerateLinearGradient(
      width,
      height,
      gradientComplexity,
      colors.reverse()
    );
    config.gradientConfig = gradientConfig;

    let stars = [];

    let xlStarSizeMax = width / 4;
    let xlStarSizeMin = width / 30;

    for (let i = 0; i < 5; i++) {
      let ranSize = Math.round(xlStarSizeMin + Math.random() * xlStarSizeMax);
      let ranX = Math.round(-100 + Math.random() * width + 100);
      let ranY = Math.round(-100 + Math.random() * height + 100);

      let star = {
        x: ranX,
        y: ranY,
        size: ranSize,
        image: 'star-large'
      };

      stars.push(star);
    }

    let largeStarSizeMax = width / 7;
    let largeStarSizeMin = width / 200;

    for (let i = 0; i < 50; i++) {
      let ranSize = Math.round(largeStarSizeMin + Math.random() * largeStarSizeMax);
      let ranX = Math.round(-100 + Math.random() * width + 100);
      let ranY = Math.round(-100 + Math.random() * height + 100);

      let star = {
        x: ranX,
        y: ranY,
        size: ranSize,
        image: 'star-large'
      };

      stars.push(star);
    }

    let mediumStarSizeMax = width / 100;
    let mediumStarSizeMin = width / 3000;

    for (let i = 0; i < 200; i++) {
      let ranSize = Math.round(mediumStarSizeMin + Math.random() * mediumStarSizeMax);
      let ranX = Math.round(-100 + Math.random() * width + 100);
      let ranY = Math.round(-100 + Math.random() * height + 100);

      let star = {
        x: ranX,
        y: ranY,
        size: ranSize,
        image: 'star-small'
      };

      stars.push(star);
    }

    let smallStarChance = Math.random();
    let smallStarAmount;

    if (smallStarChance < 0.7) {
      smallStarAmount = 5000;
    } else if (smallStarChance > 0.7 && smallStarChance < 0.9) {
      smallStarAmount = Math.round(50 + Math.random() * 200);
    } else {
      smallStarAmount = Math.round(5000 + Math.random() * 100000);
    }

    config.smallStarAmount = smallStarAmount;

    config.stars = stars;

    return config;
  }
}
