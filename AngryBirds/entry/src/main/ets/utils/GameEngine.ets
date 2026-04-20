import { Bird, Block, Pig, Slingshot, Level, Levels, GameObject } from '../model/GameModels';

// 游戏状态
export enum GameState {
  READY = 'ready',
  AIMING = 'aiming',
  FLYING = 'flying',
  WIN = 'win',
  LOSE = 'lose'
}

// 游戏引擎
export class GameEngine {
  // 游戏配置
  gravity: number = 500; // 重力加速度
  groundY: number = 490; // 地面高度
  canvasWidth: number = 800;
  canvasHeight: number = 500;
  
  // 游戏对象
  bird: Bird;
  blocks: Block[] = [];
  pigs: Pig[] = [];
  slingshot: Slingshot;
  
  // 游戏状态
  state: GameState = GameState.READY;
  score: number = 0;
  currentLevel: number = 0;
  birdsRemaining: number = 3;
  
  // 回调函数
  onScoreChange: ((score: number) => void) | null = null;
  onStateChange: ((state: GameState) => void) | null = null;
  onBirdsChange: ((birds: number) => void) | null = null;
  
  constructor() {
    this.slingshot = new Slingshot(120, 400);
    this.bird = new Bird(120, 400);
    this.loadLevel(0);
  }
  
  // 加载关卡
  loadLevel(levelIndex: number) {
    if (levelIndex >= Levels.length) {
      levelIndex = 0;
    }
    
    this.currentLevel = levelIndex;
    const level = Levels[levelIndex];
    
    // 重置游戏对象
    this.blocks = [];
    this.pigs = [];
    
    // 创建障碍物
    for (const blockData of level.blocks) {
      this.blocks.push(new Block(
        blockData.x, blockData.y, 
        blockData.width, blockData.height, 
        blockData.type
      ));
    }
    
    // 创建猪
    for (const pigData of level.pigs) {
      this.pigs.push(new Pig(pigData.x, pigData.y));
    }
    
    // 重置小鸟
    this.birdsRemaining = level.birds;
    this.resetBird();
    this.slingshot.reset();
    
    // 重置状态
    this.state = GameState.READY;
    this.notifyStateChange();
    this.notifyBirdsChange();
  }
  
  // 重置小鸟位置
  resetBird() {
    this.bird.reset(this.slingshot.x, this.slingshot.y);
  }
  
  // 开始瞄准
  startAiming(x: number, y: number) {
    if (this.state === GameState.READY && this.birdsRemaining > 0) {
      // 检查是否点击在小鸟附近
      const dx = x - this.bird.x;
      const dy = y - this.bird.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 50) {
        this.state = GameState.AIMING;
        this.slingshot.startPull();
        this.notifyStateChange();
      }
    }
  }
  
  // 更新瞄准
  updateAiming(x: number, y: number) {
    if (this.state === GameState.AIMING) {
      this.slingshot.updatePull(x, y);
      this.bird.x = this.slingshot.pullX;
      this.bird.y = this.slingshot.pullY;
    }
  }
  
  // 发射小鸟
  launchBird() {
    if (this.state === GameState.AIMING) {
      const velocity = this.slingshot.release();
      
      if (velocity.vx !== 0 || velocity.vy !== 0) {
        this.bird.vx = velocity.vx;
        this.bird.vy = velocity.vy;
        this.bird.isLaunched = true;
        this.state = GameState.FLYING;
        this.notifyStateChange();
      } else {
        // 没有拉动，取消发射
        this.slingshot.reset();
        this.resetBird();
        this.state = GameState.READY;
        this.notifyStateChange();
      }
    }
  }
  
  // 更新游戏状态
  update(deltaTime: number) {
    if (this.state !== GameState.FLYING) {
      return;
    }
    
    // 更新小鸟位置
    this.bird.update(this.gravity, deltaTime);
    
    // 检测与障碍物的碰撞
    for (const block of this.blocks) {
      if (block.isActive && this.bird.isColliding(block)) {
        this.handleBlockCollision(block);
      }
    }
    
    // 检测与猪的碰撞
    for (const pig of this.pigs) {
      if (pig.isActive && this.bird.isColliding(pig)) {
        this.handlePigCollision(pig);
      }
    }
    
    // 检测是否出界或落地
    if (this.bird.x > this.canvasWidth + 50 || 
        this.bird.y > this.groundY + 50 ||
        this.bird.x < -50) {
      this.onBirdStopped();
    }
    
    // 更新障碍物物理
    this.updateBlocks(deltaTime);
    
    // 检查游戏结束条件
    this.checkGameEnd();
  }
  
  // 处理与障碍物的碰撞
  handleBlockCollision(block: Block) {
    const speed = Math.sqrt(this.bird.vx * this.bird.vx + this.bird.vy * this.bird.vy);
    const damage = speed * this.bird.mass * 0.5;
    block.takeDamage(damage);
    
    // 简单的反弹
    const dx = this.bird.getCenterX() - block.getCenterX();
    const dy = this.bird.getCenterY() - block.getCenterY();
    
    if (Math.abs(dx) > Math.abs(dy)) {
      this.bird.vx = -this.bird.vx * 0.5;
    } else {
      this.bird.vy = -this.bird.vy * 0.5;
    }
    
    // 减速
    this.bird.vx *= 0.8;
    this.bird.vy *= 0.8;
    
    this.score += 10;
    this.notifyScoreChange();
  }
  
  // 处理与猪的碰撞
  handlePigCollision(pig: Pig) {
    const speed = Math.sqrt(this.bird.vx * this.bird.vx + this.bird.vy * this.bird.vy);
    const damage = speed * this.bird.mass;
    pig.takeDamage(damage);
    
    if (!pig.isActive) {
      this.score += 500;
      this.notifyScoreChange();
    }
    
    // 反弹
    this.bird.vx *= 0.5;
    this.bird.vy *= 0.5;
  }
  
  // 更新障碍物物理
  updateBlocks(deltaTime: number) {
    for (const block of this.blocks) {
      if (!block.isActive) continue;
      
      // 简单的重力效果
      if (block.y + block.height < this.groundY) {
        block.vy += this.gravity * deltaTime * 0.5;
        block.y += block.vy * deltaTime;
        
        // 落地
        if (block.y + block.height > this.groundY) {
          block.y = this.groundY - block.height;
          block.vy = 0;
        }
      }
      
      // 检测障碍物之间的碰撞
      for (const other of this.blocks) {
        if (block !== other && other.isActive && block.isColliding(other)) {
          // 简单的碰撞响应
          const dx = block.getCenterX() - other.getCenterX();
          if (dx > 0) {
            block.x += 1;
          } else {
            block.x -= 1;
          }
        }
      }
      
      // 检测障碍物与猪的碰撞
      for (const pig of this.pigs) {
        if (pig.isActive && block.isColliding(pig)) {
          const speed = Math.sqrt(block.vx * block.vx + block.vy * block.vy);
          if (speed > 50) {
            pig.takeDamage(speed * 0.3);
            if (!pig.isActive) {
              this.score += 500;
              this.notifyScoreChange();
            }
          }
        }
      }
    }
  }
  
  // 小鸟停止
  onBirdStopped() {
    this.bird.isLaunched = false;
    this.birdsRemaining--;
    this.notifyBirdsChange();
    
    if (this.birdsRemaining > 0) {
      // 准备下一只小鸟
      setTimeout(() => {
        this.resetBird();
        this.slingshot.reset();
        this.state = GameState.READY;
        this.notifyStateChange();
      }, 500);
    } else {
      // 没有小鸟了，检查是否失败
      this.checkGameEnd();
    }
  }
  
  // 检查游戏结束
  checkGameEnd() {
    // 检查是否所有猪都被消灭
    const allPigsDead = this.pigs.every(pig => !pig.isActive);
    
    if (allPigsDead) {
      this.state = GameState.WIN;
      this.score += this.birdsRemaining * 1000; // 剩余小鸟加分
      this.notifyScoreChange();
      this.notifyStateChange();
      return;
    }
    
    // 检查是否失败
    if (this.birdsRemaining <= 0 && !this.bird.isLaunched) {
      this.state = GameState.LOSE;
      this.notifyStateChange();
    }
  }
  
  // 下一关
  nextLevel() {
    if (this.currentLevel < Levels.length - 1) {
      this.loadLevel(this.currentLevel + 1);
      this.score = 0;
      this.notifyScoreChange();
    }
  }
  
  // 重新开始当前关卡
  restartLevel() {
    this.loadLevel(this.currentLevel);
    this.score = 0;
    this.notifyScoreChange();
  }
  
  // 通知分数变化
  notifyScoreChange() {
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }
  
  // 通知状态变化
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
  
  // 通知小鸟数量变化
  notifyBirdsChange() {
    if (this.onBirdsChange) {
      this.onBirdsChange(this.birdsRemaining);
    }
  }
}
