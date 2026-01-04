import tinycolor from 'tinycolor2';

export default class GenerateLinearGradient {
  constructor(width, height, complexity = 0, colors = []) {
    let config = {};

    config.width = width;
    config.height = height;

    // set the gradient direction

    let ranDirection = Math.random();
    if (ranDirection > 0.5) {
      config.gradientDirection = {
        x1: 0,
        y1: Math.round(Math.random() * height),
        x2: width,
        y2: Math.round(Math.random() * height)
      };
    } else {
      config.gradientDirection = {
        x1: Math.round(Math.random() * width),
        y1: 0,
        x2: Math.round(Math.random() * width),
        y2: height
      };
    }

    // set the colors

    config.colors = [];

    if (colors.length > 0) {
      if (colors.length === 1) {
        let colorChance = Math.random();
        if (colorChance > 0.5) {
          let ranGrayScale = Math.round(Math.random() * 255);
          let newColor = tinycolor({ r: ranGrayScale, g: ranGrayScale, b: ranGrayScale });
          let colorOrderChance = Math.random();
          if (colorOrderChance > 0.5) {
            config.colors.push(colors[0]);
            config.colors.push(newColor);
          } else {
            config.colors.push(newColor);
            config.colors.push(colors[0]);
          }
        } else {
          let ranSpin = -20 + Math.random() * 40;
          let newColor = tinycolor(colors[0]).spin(ranSpin).toHexString();
          let colorOrderChance = Math.random();
          if (colorOrderChance > 0.5) {
            config.colors.push(colors[0]);
            config.colors.push(newColor);
          } else {
            config.colors.push(newColor);
            config.colors.push(colors[0]);
          }
        }
      } else {
        config.colors = colors;
      }
    } else {
      let colorAmount = 2 + complexity;

      let gradientType = Math.random();

      if (gradientType > 0.5) {
        let colorStart = Math.random() * 360;
        let colorDistance = Math.random() * 50;
        for (let i = 0; i < colorAmount; i++) {
          config.colors.push(
            tinycolor('#CCFF00')
              .spin(colorStart + colorDistance * i)
              .toHexString()
          );
        }
      } else {
        let colorType = Math.random();

        for (let i = 0; i < colorAmount; i++) {
          if (colorType > 0.8) {
            config.colors.push(tinycolor.random().toHexString());
          } else {
            config.colors.push(
              tinycolor('#CCFF00')
                .spin(Math.round(Math.random() * 360))
                .toHexString()
            );
          }
        }
      }
    }

    return config;
  }
}
