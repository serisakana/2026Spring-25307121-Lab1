import { Bird, Block, Pig } from '../model/GameModels';
import { GameEngine, GameState } from '../utils/GameEngine';

@Component
export struct GameCanvas {
  @Prop gameEngine: GameEngine;
  @State private lastTime: number = 0;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  
  build() {
    Column() {
      Canvas(this.context)
        .width('100%')
        .height(500)
        .backgroundColor('#87CEEB')
        .onReady(() => {
          this.startGameLoop();
        })
        .onTouch((event: TouchEvent) => {
          this.handleTouch(event);
        })
    }
  }
  
  // 启动游戏循环
  startGameLoop() {
    this.lastTime = Date.now();
    this.gameLoop();
  }
  
  // 游戏循环
  gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // 更新游戏状态
    this.gameEngine.update(deltaTime);
    
    // 渲染
    this.render();
    
    // 继续循环
    setTimeout(() => {
      this.gameLoop();
    }, 16); // 约60fps
  }
  
  // 处理触摸事件
  handleTouch(event: TouchEvent) {
    const touch = event.touches[0];
    const x = touch.x;
    const y = touch.y;
    
    switch (event.type) {
      case TouchType.Down:
        this.gameEngine.startAiming(x, y);
        break;
      case TouchType.Move:
        this.gameEngine.updateAiming(x, y);
        break;
      case TouchType.Up:
        this.gameEngine.launchBird();
        break;
    }
  }
  
  // 渲染游戏
  render() {
    const ctx = this.context;
    const engine = this.gameEngine;
    
    // 清空画布
    ctx.clearRect(0, 0, 800, 500);
    
    // 绘制背景
    this.drawBackground(ctx);
    
    // 绘制地面
    this.drawGround(ctx);
    
    // 绘制弹弓（后部分）
    this.drawSlingshotBack(ctx);
    
    // 绘制障碍物
    for (const block of engine.blocks) {
      if (block.isActive) {
        this.drawBlock(ctx, block);
      }
    }
    
    // 绘制猪
    for (const pig of engine.pigs) {
      if (pig.isActive) {
        this.drawPig(ctx, pig);
      }
    }
    
    // 绘制弹弓橡皮筋
    this.drawSlingshotRubber(ctx);
    
    // 绘制小鸟轨迹
    this.drawBirdTrail(ctx);
    
    // 绘制小鸟
    this.drawBird(ctx, engine.bird);
    
    // 绘制弹弓（前部分）
    this.drawSlingshotFront(ctx);
    
    // 绘制发射预测轨迹
    if (engine.state === GameState.AIMING) {
      this.drawPredictionTrajectory(ctx);
    }
  }
  
  // 绘制背景
  drawBackground(ctx: CanvasRenderingContext2D) {
    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);
    
    // 远山
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.moveTo(0, 450);
    ctx.lineTo(100, 380);
    ctx.lineTo(200, 420);
    ctx.lineTo(300, 360);
    ctx.lineTo(400, 400);
    ctx.lineTo(500, 350);
    ctx.lineTo(600, 390);
    ctx.lineTo(700, 370);
    ctx.lineTo(800, 410);
    ctx.lineTo(800, 450);
    ctx.closePath();
    ctx.fill();
  }
  
  // 绘制地面
  drawGround(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 490, 800, 10);
    
    // 草地
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 485, 800, 8);
  }
  
  // 绘制弹弓后部分
  drawSlingshotBack(ctx: CanvasRenderingContext2D) {
    const slingshot = this.gameEngine.slingshot;
    
    // 左支架
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(slingshot.x - 20, slingshot.y - 60, 8, 80);
    
    // 叉子左分支
    ctx.beginPath();
    ctx.moveTo(slingshot.x - 16, slingshot.y - 60);
    ctx.lineTo(slingshot.x - 25, slingshot.y - 90);
    ctx.lineTo(slingshot.x - 17, slingshot.y - 90);
    ctx.lineTo(slingshot.x - 12, slingshot.y - 60);
    ctx.closePath();
    ctx.fill();
  }
  
  // 绘制弹弓前部分
  drawSlingshotFront(ctx: CanvasRenderingContext2D) {
    const slingshot = this.gameEngine.slingshot;
    
    // 右支架
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(slingshot.x + 12, slingshot.y - 60, 8, 80);
    
    // 叉子右分支
    ctx.beginPath();
    ctx.moveTo(slingshot.x + 12, slingshot.y - 60);
    ctx.lineTo(slingshot.x + 17, slingshot.y - 90);
    ctx.lineTo(slingshot.x + 25, slingshot.y - 90);
    ctx.lineTo(slingshot.x + 16, slingshot.y - 60);
    ctx.closePath();
    ctx.fill();
  }
  
  // 绘制弹弓橡皮筋
  drawSlingshotRubber(ctx: CanvasRenderingContext2D) {
    const slingshot = this.gameEngine.slingshot;
    const bird = this.gameEngine.bird;
    
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    
    // 左边橡皮筋
    ctx.beginPath();
    ctx.moveTo(slingshot.x - 20, slingshot.y - 85);
    ctx.lineTo(bird.x + bird.radius, bird.y);
    ctx.stroke();
    
    // 右边橡皮筋
    ctx.beginPath();
    ctx.moveTo(slingshot.x + 20, slingshot.y - 85);
    ctx.lineTo(bird.x + bird.radius, bird.y);
    ctx.stroke();
  }
  
  // 绘制小鸟
  drawBird(ctx: CanvasRenderingContext2D, bird: Bird) {
    if (!bird.isActive) return;
    
    const x = bird.x + bird.radius;
    const y = bird.y + bird.radius;
    const r = bird.radius;
    
    // 身体
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    
    // 肚子
    ctx.fillStyle = '#FFCCCC';
    ctx.beginPath();
    ctx.arc(x, y + 5, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 8, y - 5, 8, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 瞳孔
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 6, y - 5, 4, 0, Math.PI * 2);
    ctx.arc(x + 10, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 眉毛（愤怒的表情）
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 15);
    ctx.lineTo(x - 3, y - 10);
    ctx.moveTo(x + 15, y - 15);
    ctx.lineTo(x + 3, y - 10);
    ctx.stroke();
    
    // 嘴巴
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(x + r - 5, y);
    ctx.lineTo(x + r + 10, y + 3);
    ctx.lineTo(x + r - 5, y + 6);
    ctx.closePath();
    ctx.fill();
    
    // 尾巴
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x - r - 15, y - 10);
    ctx.lineTo(x - r - 15, y + 10);
    ctx.closePath();
    ctx.fill();
  }
  
  // 绘制小鸟轨迹
  drawBirdTrail(ctx: CanvasRenderingContext2D) {
    const trail = this.gameEngine.bird.trail;
    if (trail.length < 2) return;
    
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trail[0].x + 20, trail[0].y + 20);
    
    for (let i = 1; i < trail.length; i++) {
      ctx.lineTo(trail[i].x + 20, trail[i].y + 20);
    }
    ctx.stroke();
  }
  
  // 绘制预测轨迹
  drawPredictionTrajectory(ctx: CanvasRenderingContext2D) {
    const slingshot = this.gameEngine.slingshot;
    const dx = slingshot.x - slingshot.pullX;
    const dy = slingshot.y - slingshot.pullY;
    
    if (dx === 0 && dy === 0) return;
    
    const power = 0.15;
    let vx = dx * power;
    let vy = dy * power;
    let x = slingshot.pullX + 20;
    let y = slingshot.pullY + 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    for (let i = 0; i < 30; i++) {
      vy += this.gameEngine.gravity * 0.02;
      x += vx * 0.02;
      y += vy * 0.02;
      
      if (y > 490) break;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 绘制障碍物
  drawBlock(ctx: CanvasRenderingContext2D, block: Block) {
    ctx.save();
    
    // 根据类型设置颜色
    switch (block.type) {
      case 'wood':
        ctx.fillStyle = '#DEB887';
        break;
      case 'stone':
        ctx.fillStyle = '#A9A9A9';
        break;
      case 'glass':
        ctx.fillStyle = 'rgba(135, 206, 250, 0.7)';
        break;
    }
    
    // 绘制主体
    ctx.fillRect(block.x, block.y, block.width, block.height);
    
    // 绘制边框
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(block.x, block.y, block.width, block.height);
    
    // 绘制纹理
    if (block.type === 'wood') {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = block.y + block.height * (i + 1) / 4;
        ctx.beginPath();
        ctx.moveTo(block.x, y);
        ctx.lineTo(block.x + block.width, y);
        ctx.stroke();
      }
    } else if (block.type === 'stone') {
      ctx.fillStyle = '#696969';
      for (let i = 0; i < 3; i++) {
        const x = block.x + block.width * Math.random();
        const y = block.y + block.height * Math.random();
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 绘制损坏效果
    const damageLevel = block.getDamageLevel();
    if (damageLevel > 0.3) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      const cracks = Math.floor(damageLevel * 5);
      for (let i = 0; i < cracks; i++) {
        const startX = block.x + Math.random() * block.width;
        const startY = block.y + Math.random() * block.height;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + (Math.random() - 0.5) * 20, startY + (Math.random() - 0.5) * 20);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
  
  // 绘制猪
  drawPig(ctx: CanvasRenderingContext2D, pig: Pig) {
    const x = pig.x + pig.radius;
    const y = pig.y + pig.radius;
    const r = pig.radius;
    
    // 身体
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 耳朵
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.ellipse(x - 15, y - 20, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15, y - 20, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 8, y - 5, 8, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 瞳孔
    ctx.fillStyle = '#000000';
    if (pig.expression === 'dead') {
      // 死亡表情 - X眼睛
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 9);
      ctx.lineTo(x - 4, y - 1);
      ctx.moveTo(x - 4, y - 9);
      ctx.lineTo(x - 12, y - 1);
      ctx.moveTo(x + 4, y - 9);
      ctx.lineTo(x + 12, y - 1);
      ctx.moveTo(x + 12, y - 9);
      ctx.lineTo(x + 4, y - 1);
      ctx.stroke();
    } else {
      ctx.beginPath();
      if (pig.expression === 'worried') {
        ctx.arc(x - 8, y - 3, 4, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 3, 4, 0, Math.PI * 2);
      } else {
        ctx.arc(x - 8, y - 5, 4, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 5, 4, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    
    // 鼻子
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 鼻孔
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(x - 4, y + 8, 3, 0, Math.PI * 2);
    ctx.arc(x + 4, y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 受伤效果
    if (pig.expression === 'worried') {
      // 眉毛
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 14);
      ctx.lineTo(x - 4, y - 12);
      ctx.moveTo(x + 14, y - 14);
      ctx.lineTo(x + 4, y - 12);
      ctx.stroke();
    }
  }
}
