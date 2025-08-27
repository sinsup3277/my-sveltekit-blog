import Phaser from 'phaser';
import BootScene from './scenes/Boot';
import GameScene from './scenes/Game';

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: [BootScene, GameScene]
  });
}

export { launch };