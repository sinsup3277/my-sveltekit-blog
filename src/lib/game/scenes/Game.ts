import { Scene } from 'phaser';

export default class GameScene extends Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add.text(400, 300, 'Hello Phaser!', {
      color: '#FFF',
      fontSize: '32px'
    }).setOrigin(0.5);
  }
}