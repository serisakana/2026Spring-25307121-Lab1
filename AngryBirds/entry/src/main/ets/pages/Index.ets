import { GameEngine, GameState } from '../utils/GameEngine';
import { GameCanvas } from '../components/GameCanvas';
import { Levels } from '../model/GameModels';

@Entry
@Component
struct Index {
  @State private gameEngine: GameEngine = new GameEngine();
  @State private score: number = 0;
  @State private birdsRemaining: number = 3;
  @State private currentLevel: number = 1;
  @State private gameState: GameState = GameState.READY;
  @State private showMenu: boolean = false;
  
  aboutToAppear() {
    // 设置回调
    this.gameEngine.onScoreChange = (score: number) => {
      this.score = score;
    };
    
    this.gameEngine.onStateChange = (state: GameState) => {
      this.gameState = state;
    };
    
    this.gameEngine.onBirdsChange = (birds: number) => {
      this.birdsRemaining = birds;
    };
    
    this.currentLevel = this.gameEngine.currentLevel + 1;
  }
  
  build() {
    Column() {
      // 顶部信息栏
      this.TopBar()
      
      // 游戏画布
      GameCanvas({ gameEngine: this.gameEngine })
      
      // 底部控制栏
      this.BottomBar()
      
      // 游戏结束弹窗
      if (this.gameState === GameState.WIN || this.gameState === GameState.LOSE) {
        this.GameOverDialog()
      }
      
      // 菜单弹窗
      if (this.showMenu) {
        this.MenuDialog()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#87CEEB')
  }
  
  // 顶部信息栏
  @Builder
  TopBar() {
    Row() {
      // 分数
      Column() {
        Text('分数')
          .fontSize(14)
          .fontColor('#FFFFFF')
        Text(this.score.toString())
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFD700')
      }
      .width('25%')
      
      // 关卡
      Column() {
        Text('关卡')
          .fontSize(14)
          .fontColor('#FFFFFF')
        Text(this.currentLevel.toString() + ' / ' + Levels.length)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
      }
      .width('25%')
      
      // 剩余小鸟
      Column() {
        Text('小鸟')
          .fontSize(14)
          .fontColor('#FFFFFF')
        Row() {
          ForEach([1, 2, 3, 4, 5], (item: number) => {
            if (item <= this.birdsRemaining) {
              Text('🐦')
                .fontSize(20)
            } else {
              Text('')
                .fontSize(20)
            }
          })
        }
      }
      .width('25%')
      
      // 菜单按钮
      Column() {
        Button('菜单')
          .fontSize(16)
          .backgroundColor('#8B4513')
          .onClick(() => {
            this.showMenu = true;
          })
      }
      .width('25%')
    }
    .width('100%')
    .height(80)
    .padding(10)
    .backgroundColor('rgba(0, 0, 0, 0.5)')
  }
  
  // 底部控制栏
  @Builder
  BottomBar() {
    Row() {
      // 重新开始按钮
      Button('重新开始')
        .fontSize(16)
        .width('30%')
        .height(40)
        .backgroundColor('#FF6347')
        .onClick(() => {
          this.gameEngine.restartLevel();
          this.currentLevel = this.gameEngine.currentLevel + 1;
        })
      
      Blank()
      
      // 提示文字
      if (this.gameState === GameState.READY) {
        Text('拖动小鸟瞄准，松开发射！')
          .fontSize(16)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
      } else if (this.gameState === GameState.FLYING) {
        Text('飞行中...')
          .fontSize(16)
          .fontColor('#FFD700')
          .fontWeight(FontWeight.Bold)
      }
      
      Blank()
      
      // 下一关按钮
      Button('下一关')
        .fontSize(16)
        .width('30%')
        .height(40)
        .backgroundColor('#32CD32')
        .enabled(this.gameState === GameState.WIN)
        .onClick(() => {
          this.gameEngine.nextLevel();
          this.currentLevel = this.gameEngine.currentLevel + 1;
        })
    }
    .width('100%')
    .height(60)
    .padding({ left: 20, right: 20 })
    .backgroundColor('rgba(0, 0, 0, 0.5)')
  }
  
  // 游戏结束弹窗
  @Builder
  GameOverDialog() {
    Column() {
      // 标题
      if (this.gameState === GameState.WIN) {
        Text('🎉 恭喜过关！')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFD700')
          .margin({ bottom: 20 })
      } else {
        Text('😢 游戏失败')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FF6347')
          .margin({ bottom: 20 })
      }
      
      // 分数
      Text('得分: ' + this.score)
        .fontSize(24)
        .fontColor('#FFFFFF')
        .margin({ bottom: 30 })
      
      // 按钮
      Row() {
        Button('重新开始')
          .fontSize(18)
          .width(120)
          .height(50)
          .backgroundColor('#FF6347')
          .onClick(() => {
            this.gameEngine.restartLevel();
            this.currentLevel = this.gameEngine.currentLevel + 1;
          })
        
        if (this.gameState === GameState.WIN) {
          Button('下一关')
            .fontSize(18)
            .width(120)
            .height(50)
            .backgroundColor('#32CD32')
            .margin({ left: 20 })
            .onClick(() => {
              this.gameEngine.nextLevel();
              this.currentLevel = this.gameEngine.currentLevel + 1;
            })
        }
      }
    }
    .width('80%')
    .padding(30)
    .backgroundColor('rgba(0, 0, 0, 0.8)')
    .borderRadius(20)
    .position({ x: '10%', y: '30%' })
  }
  
  // 菜单弹窗
  @Builder
  MenuDialog() {
    Column() {
      Text('愤怒的小鸟')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFD700')
        .margin({ bottom: 30 })
      
      // 关卡选择
      Text('选择关卡')
        .fontSize(20)
        .fontColor('#FFFFFF')
        .margin({ bottom: 15 })
      
      Row() {
        ForEach(Levels, (level: any, index: number) => {
          Button((index + 1).toString())
            .fontSize(20)
            .width(60)
            .height(60)
            .backgroundColor(this.currentLevel === index + 1 ? '#FFD700' : '#8B4513')
            .margin(5)
            .onClick(() => {
              this.gameEngine.loadLevel(index);
              this.currentLevel = index + 1;
              this.showMenu = false;
            })
        })
      }
      .margin({ bottom: 30 })
      
      // 关闭按钮
      Button('关闭')
        .fontSize(18)
        .width(150)
        .height(50)
        .backgroundColor('#FF6347')
        .onClick(() => {
          this.showMenu = false;
        })
    }
    .width('80%')
    .padding(30)
    .backgroundColor('rgba(0, 0, 0, 0.9)')
    .borderRadius(20)
    .position({ x: '10%', y: '20%' })
  }
}
