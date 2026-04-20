// 游戏对象基类
export class GameObject {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  vx: number = 0; // x方向速度
  vy: number = 0; // y方向速度
  mass: number = 1;
  isActive: boolean = true;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // 检测与另一个对象的碰撞
  isColliding(other: GameObject): boolean {
    return this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.y + this.height > other.y;
  }

  // 获取中心点
  getCenterX(): number {
    return this.x + this.width / 2;
  }

  getCenterY(): number {
    return this.y + this.height / 2;
  }
}

// 小鸟类
export class Bird extends GameObject {
  radius: number = 20;
  color: string = '#FF4444';
  isLaunched: boolean = false;
  trail: Array<{x: number, y: number}> = []; // 轨迹点

  constructor(x: number, y: number) {
    super(x, y, 40, 40);
    this.radius = 20;
    this.mass = 1;
  }

  // 更新位置
  update(gravity: number, deltaTime: number) {
    if (this.isLaunched) {
      // 应用重力
      this.vy += gravity * deltaTime;
      
      // 更新位置
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
      
      // 记录轨迹
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > 30) {
        this.trail.shift();
      }
    }
  }

  // 重置小鸟
  reset(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.isLaunched = false;
    this.trail = [];
    this.isActive = true;
  }
}

// 障碍物类（木块、石块等）
export class Block extends GameObject {
  type: 'wood' | 'stone' | 'glass' = 'wood';
  health: number = 100;
  maxHealth: number = 100;
  color: string = '#8B4513';

  constructor(x: number, y: number, width: number, height: number, type: 'wood' | 'stone' | 'glass') {
    super(x, y, width, height);
    this.type = type;
    
    switch(type) {
      case 'wood':
        this.health = 100;
        this.color = '#8B4513';
        this.mass = 1;
        break;
      case 'stone':
        this.health = 200;
        this.color = '#808080';
        this.mass = 2;
        break;
      case 'glass':
        this.health = 50;
        this.color = '#87CEEB';
        this.mass = 0.5;
        break;
    }
    this.maxHealth = this.health;
  }

  // 受到伤害
  takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.isActive = false;
    }
  }

  // 获取损坏程度（用于显示裂纹）
  getDamageLevel(): number {
    return 1 - (this.health / this.maxHealth);
  }
}

// 猪类（目标）
export class Pig extends GameObject {
  radius: number = 25;
  health: number = 100;
  maxHealth: number = 100;
  color: string = '#90EE90';
  expression: 'normal' | 'worried' | 'dead' = 'normal';

  constructor(x: number, y: number) {
    super(x, y, 50, 50);
    this.radius = 25;
    this.mass = 1.5;
  }

  // 受到伤害
  takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.isActive = false;
      this.expression = 'dead';
    } else if (this.health < this.maxHealth * 0.5) {
      this.expression = 'worried';
    }
  }

  // 更新表情
  updateExpression() {
    if (this.health <= 0) {
      this.expression = 'dead';
    } else if (this.health < this.maxHealth * 0.5) {
      this.expression = 'worried';
    } else {
      this.expression = 'normal';
    }
  }
}

// 弹弓类
export class Slingshot {
  x: number;
  y: number;
  width: number = 30;
  height: number = 100;
  pullX: number = 0;
  pullY: number = 0;
  maxPullDistance: number = 100;
  isPulling: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.pullX = x;
    this.pullY = y;
  }

  // 开始拉动
  startPull() {
    this.isPulling = true;
  }

  // 更新拉动位置
  updatePull(x: number, y: number) {
    if (this.isPulling) {
      const dx = x - this.x;
      const dy = y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 限制最大拉动距离
      if (distance > this.maxPullDistance) {
        const ratio = this.maxPullDistance / distance;
        this.pullX = this.x + dx * ratio;
        this.pullY = this.y + dy * ratio;
      } else {
        this.pullX = x;
        this.pullY = y;
      }
    }
  }

  // 释放，计算发射速度
  release(): {vx: number, vy: number} {
    this.isPulling = false;
    const dx = this.x - this.pullX;
    const dy = this.y - this.pullY;
    
    // 速度系数
    const power = 0.15;
    return {
      vx: dx * power,
      vy: dy * power
    };
  }

  // 重置
  reset() {
    this.pullX = this.x;
    this.pullY = this.y;
    this.isPulling = false;
  }
}

// 关卡数据
export class Level {
  id: number;
  name: string;
  birds: number;
  blocks: Array<{x: number, y: number, width: number, height: number, type: 'wood' | 'stone' | 'glass'}>;
  pigs: Array<{x: number, y: number}>;
  
  constructor(id: number, name: string, birds: number, 
              blocks: Array<{x: number, y: number, width: number, height: number, type: 'wood' | 'stone' | 'glass'}>,
              pigs: Array<{x: number, y: number}>) {
    this.id = id;
    this.name = name;
    this.birds = birds;
    this.blocks = blocks;
    this.pigs = pigs;
  }
}

// 预定义关卡
export const Levels: Array<Level> = [
  new Level(1, '第一关', 3, 
    [
      {x: 500, y: 450, width: 60, height: 20, type: 'wood'},
      {x: 500, y: 430, width: 20, height: 60, type: 'wood'},
      {x: 560, y: 430, width: 20, height: 60, type: 'wood'},
      {x: 500, y: 370, width: 80, height: 20, type: 'wood'},
    ],
    [{x: 520, y: 400}]
  ),
  new Level(2, '第二关', 4,
    [
      {x: 450, y: 450, width: 20, height: 80, type: 'wood'},
      {x: 550, y: 450, width: 20, height: 80, type: 'wood'},
      {x: 450, y: 370, width: 120, height: 20, type: 'stone'},
      {x: 480, y: 350, width: 20, height: 60, type: 'glass'},
      {x: 540, y: 350, width: 20, height: 60, type: 'glass'},
      {x: 480, y: 290, width: 80, height: 20, type: 'wood'},
    ],
    [{x: 500, y: 420}, {x: 510, y: 320}]
  ),
  new Level(3, '第三关', 5,
    [
      {x: 400, y: 450, width: 20, height: 100, type: 'stone'},
      {x: 500, y: 450, width: 20, height: 100, type: 'stone'},
      {x: 600, y: 450, width: 20, height: 100, type: 'stone'},
      {x: 400, y: 350, width: 220, height: 20, type: 'stone'},
      {x: 420, y: 330, width: 20, height: 60, type: 'wood'},
      {x: 480, y: 330, width: 20, height: 60, type: 'wood'},
      {x: 540, y: 330, width: 20, height: 60, type: 'wood'},
      {x: 420, y: 270, width: 140, height: 20, type: 'wood'},
      {x: 450, y: 250, width: 20, height: 40, type: 'glass'},
      {x: 510, y: 250, width: 20, height: 40, type: 'glass'},
      {x: 450, y: 210, width: 80, height: 20, type: 'glass'},
    ],
    [{x: 450, y: 400}, {x: 510, y: 400}, {x: 480, y: 290}]
  )
];
