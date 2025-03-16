import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const Main = () => {
  const gameRef = useRef(null);
  const phaserGame = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scene: { preload, create },
      parent: gameRef.current,
    };

    phaserGame.current = new Phaser.Game(config);

    function preload() {
      this.load.image('image1', '/assets/image1.png');
      this.load.image('image2', '/assets/image2.png');
    }

    function create() {
      const { width, height } = this.scale;

      this.background = this.add.image(width / 2, height / 2, 'image1');
      resizeBackground(this.background, width, height);

      this.smallImg = this.add.image(width / 2, height / 2, 'image2').setDisplaySize(100, 100);

      this.scale.on('resize', (gameSize) => {
        const { width, height } = gameSize;

        this.cameras.resize(width, height);
        this.background.setPosition(width / 2, height / 2);
        resizeBackground(this.background, width, height);

        this.smallImg.setPosition(width / 2, height / 2);
      });
    }

    function resizeBackground(image, width, height) {
      const scaleX = width / image.width;
      const scaleY = height / image.height;
      const scale = Math.max(scaleX, scaleY);
      image.setScale(scale).setScrollFactor(0);
    }

    return () => {
      phaserGame.current?.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default Main;
