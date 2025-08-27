import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 여기에 에셋 로딩 코드를 작성합니다.
    // this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}