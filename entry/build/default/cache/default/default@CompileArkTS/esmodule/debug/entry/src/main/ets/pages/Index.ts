if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    score?: number;
    birdsRemaining?: number;
    currentLevel?: number;
    gameState?: string;
    showMenu?: boolean;
    birdX?: number;
    birdY?: number;
    birdVX?: number;
    birdVY?: number;
    birdLaunched?: boolean;
    pullX?: number;
    pullY?: number;
    isPulling?: boolean;
    settings?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    lastTime?: number;
    GRAVITY?: number;
    MAX_PULL?: number;
    POWER?: number;
    levels?: LevelData[];
    blocks?: BlockData[];
    pigs?: PigData[];
    trail?: TrailPoint[];
}
// 愤怒的小鸟游戏 - 鸿蒙横屏版
// 定义类型接口
interface BlockData {
    x: number;
    y: number;
    w: number;
    h: number;
    type: string;
    health: number;
    active: boolean;
}
interface PigData {
    x: number;
    y: number;
    health: number;
    active: boolean;
    expression: string;
}
interface LevelData {
    birds: number;
    blocks: BlockData[];
    pigs: PigData[];
}
interface TrailPoint {
    x: number;
    y: number;
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__score = new ObservedPropertySimplePU(0, this, "score");
        this.__birdsRemaining = new ObservedPropertySimplePU(3, this, "birdsRemaining");
        this.__currentLevel = new ObservedPropertySimplePU(1, this, "currentLevel");
        this.__gameState = new ObservedPropertySimplePU('ready', this, "gameState");
        this.__showMenu = new ObservedPropertySimplePU(false, this, "showMenu");
        this.__birdX = new ObservedPropertySimplePU(100, this, "birdX");
        this.__birdY = new ObservedPropertySimplePU(300, this, "birdY");
        this.__birdVX = new ObservedPropertySimplePU(0, this, "birdVX");
        this.__birdVY = new ObservedPropertySimplePU(0, this, "birdVY");
        this.__birdLaunched = new ObservedPropertySimplePU(false, this, "birdLaunched");
        this.__pullX = new ObservedPropertySimplePU(100, this, "pullX");
        this.__pullY = new ObservedPropertySimplePU(300, this, "pullY");
        this.__isPulling = new ObservedPropertySimplePU(false, this, "isPulling");
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.lastTime = 0;
        this.GRAVITY = 400;
        this.MAX_PULL = 200;
        this.POWER = 50;
        this.levels = this.initLevels();
        this.__blocks = new ObservedPropertyObjectPU([], this, "blocks");
        this.__pigs = new ObservedPropertyObjectPU([], this, "pigs");
        this.__trail = new ObservedPropertyObjectPU([], this, "trail");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.score !== undefined) {
            this.score = params.score;
        }
        if (params.birdsRemaining !== undefined) {
            this.birdsRemaining = params.birdsRemaining;
        }
        if (params.currentLevel !== undefined) {
            this.currentLevel = params.currentLevel;
        }
        if (params.gameState !== undefined) {
            this.gameState = params.gameState;
        }
        if (params.showMenu !== undefined) {
            this.showMenu = params.showMenu;
        }
        if (params.birdX !== undefined) {
            this.birdX = params.birdX;
        }
        if (params.birdY !== undefined) {
            this.birdY = params.birdY;
        }
        if (params.birdVX !== undefined) {
            this.birdVX = params.birdVX;
        }
        if (params.birdVY !== undefined) {
            this.birdVY = params.birdVY;
        }
        if (params.birdLaunched !== undefined) {
            this.birdLaunched = params.birdLaunched;
        }
        if (params.pullX !== undefined) {
            this.pullX = params.pullX;
        }
        if (params.pullY !== undefined) {
            this.pullY = params.pullY;
        }
        if (params.isPulling !== undefined) {
            this.isPulling = params.isPulling;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.lastTime !== undefined) {
            this.lastTime = params.lastTime;
        }
        if (params.GRAVITY !== undefined) {
            this.GRAVITY = params.GRAVITY;
        }
        if (params.MAX_PULL !== undefined) {
            this.MAX_PULL = params.MAX_PULL;
        }
        if (params.POWER !== undefined) {
            this.POWER = params.POWER;
        }
        if (params.levels !== undefined) {
            this.levels = params.levels;
        }
        if (params.blocks !== undefined) {
            this.blocks = params.blocks;
        }
        if (params.pigs !== undefined) {
            this.pigs = params.pigs;
        }
        if (params.trail !== undefined) {
            this.trail = params.trail;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__score.purgeDependencyOnElmtId(rmElmtId);
        this.__birdsRemaining.purgeDependencyOnElmtId(rmElmtId);
        this.__currentLevel.purgeDependencyOnElmtId(rmElmtId);
        this.__gameState.purgeDependencyOnElmtId(rmElmtId);
        this.__showMenu.purgeDependencyOnElmtId(rmElmtId);
        this.__birdX.purgeDependencyOnElmtId(rmElmtId);
        this.__birdY.purgeDependencyOnElmtId(rmElmtId);
        this.__birdVX.purgeDependencyOnElmtId(rmElmtId);
        this.__birdVY.purgeDependencyOnElmtId(rmElmtId);
        this.__birdLaunched.purgeDependencyOnElmtId(rmElmtId);
        this.__pullX.purgeDependencyOnElmtId(rmElmtId);
        this.__pullY.purgeDependencyOnElmtId(rmElmtId);
        this.__isPulling.purgeDependencyOnElmtId(rmElmtId);
        this.__blocks.purgeDependencyOnElmtId(rmElmtId);
        this.__pigs.purgeDependencyOnElmtId(rmElmtId);
        this.__trail.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__score.aboutToBeDeleted();
        this.__birdsRemaining.aboutToBeDeleted();
        this.__currentLevel.aboutToBeDeleted();
        this.__gameState.aboutToBeDeleted();
        this.__showMenu.aboutToBeDeleted();
        this.__birdX.aboutToBeDeleted();
        this.__birdY.aboutToBeDeleted();
        this.__birdVX.aboutToBeDeleted();
        this.__birdVY.aboutToBeDeleted();
        this.__birdLaunched.aboutToBeDeleted();
        this.__pullX.aboutToBeDeleted();
        this.__pullY.aboutToBeDeleted();
        this.__isPulling.aboutToBeDeleted();
        this.__blocks.aboutToBeDeleted();
        this.__pigs.aboutToBeDeleted();
        this.__trail.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 游戏状态
    private __score: ObservedPropertySimplePU<number>;
    get score() {
        return this.__score.get();
    }
    set score(newValue: number) {
        this.__score.set(newValue);
    }
    private __birdsRemaining: ObservedPropertySimplePU<number>;
    get birdsRemaining() {
        return this.__birdsRemaining.get();
    }
    set birdsRemaining(newValue: number) {
        this.__birdsRemaining.set(newValue);
    }
    private __currentLevel: ObservedPropertySimplePU<number>;
    get currentLevel() {
        return this.__currentLevel.get();
    }
    set currentLevel(newValue: number) {
        this.__currentLevel.set(newValue);
    }
    private __gameState: ObservedPropertySimplePU<string>;
    get gameState() {
        return this.__gameState.get();
    }
    set gameState(newValue: string) {
        this.__gameState.set(newValue);
    }
    private __showMenu: ObservedPropertySimplePU<boolean>;
    get showMenu() {
        return this.__showMenu.get();
    }
    set showMenu(newValue: boolean) {
        this.__showMenu.set(newValue);
    }
    // 游戏对象状态
    private __birdX: ObservedPropertySimplePU<number>;
    get birdX() {
        return this.__birdX.get();
    }
    set birdX(newValue: number) {
        this.__birdX.set(newValue);
    }
    private __birdY: ObservedPropertySimplePU<number>;
    get birdY() {
        return this.__birdY.get();
    }
    set birdY(newValue: number) {
        this.__birdY.set(newValue);
    }
    private __birdVX: ObservedPropertySimplePU<number>;
    get birdVX() {
        return this.__birdVX.get();
    }
    set birdVX(newValue: number) {
        this.__birdVX.set(newValue);
    }
    private __birdVY: ObservedPropertySimplePU<number>;
    get birdVY() {
        return this.__birdVY.get();
    }
    set birdVY(newValue: number) {
        this.__birdVY.set(newValue);
    }
    private __birdLaunched: ObservedPropertySimplePU<boolean>;
    get birdLaunched() {
        return this.__birdLaunched.get();
    }
    set birdLaunched(newValue: boolean) {
        this.__birdLaunched.set(newValue);
    }
    private __pullX: ObservedPropertySimplePU<number>;
    get pullX() {
        return this.__pullX.get();
    }
    set pullX(newValue: number) {
        this.__pullX.set(newValue);
    }
    private __pullY: ObservedPropertySimplePU<number>;
    get pullY() {
        return this.__pullY.get();
    }
    set pullY(newValue: number) {
        this.__pullY.set(newValue);
    }
    private __isPulling: ObservedPropertySimplePU<boolean>;
    get isPulling() {
        return this.__isPulling.get();
    }
    set isPulling(newValue: boolean) {
        this.__isPulling.set(newValue);
    }
    // 画布设置
    private settings: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private lastTime: number;
    // 游戏常量
    private readonly GRAVITY: number; // 降低重力
    private readonly MAX_PULL: number; // 增加最大拉动距离
    private readonly POWER: number; // 超级大力！
    // 关卡数据
    private levels: LevelData[];
    // 当前关卡数据
    private __blocks: ObservedPropertyObjectPU<BlockData[]>;
    get blocks() {
        return this.__blocks.get();
    }
    set blocks(newValue: BlockData[]) {
        this.__blocks.set(newValue);
    }
    private __pigs: ObservedPropertyObjectPU<PigData[]>;
    get pigs() {
        return this.__pigs.get();
    }
    set pigs(newValue: PigData[]) {
        this.__pigs.set(newValue);
    }
    private __trail: ObservedPropertyObjectPU<TrailPoint[]>;
    get trail() {
        return this.__trail.get();
    }
    set trail(newValue: TrailPoint[]) {
        this.__trail.set(newValue);
    }
    // 初始化关卡数据
    private initLevels(): LevelData[] {
        const levels: LevelData[] = [];
        // 第一关 - 简单
        const level1: LevelData = {
            birds: 3,
            blocks: [
                { x: 250, y: 280, w: 80, h: 20, type: 'wood', health: 100, active: true },
                { x: 250, y: 230, w: 20, h: 50, type: 'wood', health: 100, active: true },
                { x: 310, y: 230, w: 20, h: 50, type: 'wood', health: 100, active: true }
            ],
            pigs: [{ x: 270, y: 250, health: 100, active: true, expression: 'normal' }]
        };
        levels.push(level1);
        // 第二关 - 中等
        const level2: LevelData = {
            birds: 4,
            blocks: [
                { x: 220, y: 280, w: 20, h: 70, type: 'wood', health: 100, active: true },
                { x: 320, y: 280, w: 20, h: 70, type: 'wood', health: 100, active: true },
                { x: 220, y: 210, w: 120, h: 20, type: 'stone', health: 200, active: true },
                { x: 250, y: 160, w: 20, h: 50, type: 'glass', health: 50, active: true },
                { x: 310, y: 160, w: 20, h: 50, type: 'glass', health: 50, active: true }
            ],
            pigs: [
                { x: 270, y: 250, health: 100, active: true, expression: 'normal' },
                { x: 280, y: 180, health: 100, active: true, expression: 'normal' }
            ]
        };
        levels.push(level2);
        // 第三关 - 困难
        const level3: LevelData = {
            birds: 5,
            blocks: [
                { x: 200, y: 280, w: 20, h: 80, type: 'stone', health: 200, active: true },
                { x: 300, y: 280, w: 20, h: 80, type: 'stone', health: 200, active: true },
                { x: 400, y: 280, w: 20, h: 80, type: 'stone', health: 200, active: true },
                { x: 200, y: 200, w: 220, h: 20, type: 'stone', health: 200, active: true },
                { x: 220, y: 150, w: 20, h: 50, type: 'wood', health: 100, active: true },
                { x: 280, y: 150, w: 20, h: 50, type: 'wood', health: 100, active: true },
                { x: 340, y: 150, w: 20, h: 50, type: 'wood', health: 100, active: true },
                { x: 220, y: 100, w: 140, h: 20, type: 'wood', health: 100, active: true }
            ],
            pigs: [
                { x: 250, y: 240, health: 100, active: true, expression: 'normal' },
                { x: 310, y: 240, health: 100, active: true, expression: 'normal' },
                { x: 280, y: 120, health: 100, active: true, expression: 'normal' }
            ]
        };
        levels.push(level3);
        return levels;
    }
    aboutToAppear() {
        this.loadLevel(0);
    }
    // 深拷贝数组
    private copyBlocks(blocks: BlockData[]): BlockData[] {
        const result: BlockData[] = [];
        for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];
            result.push({
                x: b.x, y: b.y, w: b.w, h: b.h,
                type: b.type, health: b.health, active: b.active
            });
        }
        return result;
    }
    private copyPigs(pigs: PigData[]): PigData[] {
        const result: PigData[] = [];
        for (let i = 0; i < pigs.length; i++) {
            const p = pigs[i];
            result.push({
                x: p.x, y: p.y, health: p.health,
                active: p.active, expression: p.expression
            });
        }
        return result;
    }
    // 加载关卡
    loadLevel(levelIndex: number) {
        if (levelIndex >= this.levels.length) {
            levelIndex = 0;
        }
        this.currentLevel = levelIndex + 1;
        const level = this.levels[levelIndex];
        // 重置所有游戏数据
        this.blocks = this.copyBlocks(level.blocks);
        this.pigs = this.copyPigs(level.pigs);
        this.birdsRemaining = level.birds;
        this.score = 0;
        this.trail = [];
        this.gameState = 'ready';
        // 重置小鸟
        this.birdX = 100;
        this.birdY = 300;
        this.birdVX = 0;
        this.birdVY = 0;
        this.birdLaunched = false;
        this.pullX = 100;
        this.pullY = 300;
        this.isPulling = false;
    }
    // 重置小鸟
    resetBird() {
        this.birdX = 100;
        this.birdY = 300;
        this.birdVX = 0;
        this.birdVY = 0;
        this.birdLaunched = false;
        this.pullX = 100;
        this.pullY = 300;
        this.isPulling = false;
        this.trail = [];
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部信息栏
            Row.create();
            // 顶部信息栏
            Row.width('100%');
            // 顶部信息栏
            Row.height(70);
            // 顶部信息栏
            Row.backgroundColor('rgba(0, 0, 0, 0.6)');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧：分数
            Row.create();
            // 左侧：分数
            Row.margin({ left: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分数: ');
            Text.fontSize(18);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.score.toString());
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFD700');
        }, Text);
        Text.pop();
        // 左侧：分数
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 中间：关卡和提示
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关卡 ' + this.currentLevel + ' / ' + this.levels.length);
            Text.fontSize(20);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.gameState === 'ready') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('拖动小鸟瞄准，松开发射！');
                        Text.fontSize(16);
                        Text.fontColor('#FFD700');
                        Text.margin({ top: 5 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.gameState === 'flying') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('飞行中...');
                        Text.fontSize(16);
                        Text.fontColor('#FFD700');
                        Text.margin({ top: 5 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        // 中间：关卡和提示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：小鸟和控制按钮
            Row.create();
            // 右侧：小鸟和控制按钮
            Row.margin({ right: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 剩余小鸟
            Row.create();
            // 剩余小鸟
            Row.margin({ right: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (item <= this.birdsRemaining) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('🐦');
                                Text.fontSize(24);
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3, 4, 5], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 剩余小鸟
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 菜单按钮
            Button.createWithLabel('菜单');
            // 菜单按钮
            Button.fontSize(16);
            // 菜单按钮
            Button.width(70);
            // 菜单按钮
            Button.height(40);
            // 菜单按钮
            Button.backgroundColor('#8B4513');
            // 菜单按钮
            Button.onClick(() => {
                this.showMenu = true;
            });
        }, Button);
        // 菜单按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 重新开始按钮
            Button.createWithLabel('重玩');
            // 重新开始按钮
            Button.fontSize(16);
            // 重新开始按钮
            Button.width(70);
            // 重新开始按钮
            Button.height(40);
            // 重新开始按钮
            Button.backgroundColor('#FF6347');
            // 重新开始按钮
            Button.margin({ left: 10 });
            // 重新开始按钮
            Button.onClick(() => {
                this.loadLevel(this.currentLevel - 1);
            });
        }, Button);
        // 重新开始按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 下一关按钮
            Button.createWithLabel('下一关');
            // 下一关按钮
            Button.fontSize(16);
            // 下一关按钮
            Button.width(80);
            // 下一关按钮
            Button.height(40);
            // 下一关按钮
            Button.backgroundColor(this.gameState === 'win' ? '#32CD32' : '#666666');
            // 下一关按钮
            Button.margin({ left: 10 });
            // 下一关按钮
            Button.enabled(this.gameState === 'win');
            // 下一关按钮
            Button.onClick(() => {
                this.loadLevel(this.currentLevel);
            });
        }, Button);
        // 下一关按钮
        Button.pop();
        // 右侧：小鸟和控制按钮
        Row.pop();
        // 顶部信息栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 游戏画布
            Stack.create();
            // 游戏画布
            Stack.layoutWeight(1);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.backgroundColor('#87CEEB');
            Canvas.onReady(() => {
                this.startGameLoop();
            });
            Canvas.onTouch((event: TouchEvent) => {
                this.handleTouch(event);
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 游戏结束弹窗
            if (this.gameState === 'win' || this.gameState === 'lose') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(400);
                        Column.padding(40);
                        Column.backgroundColor('rgba(0, 0, 0, 0.9)');
                        Column.borderRadius(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.gameState === 'win') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('🎉 恭喜过关！');
                                    Text.fontSize(36);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor('#FFD700');
                                    Text.margin({ bottom: 20 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('😢 游戏失败');
                                    Text.fontSize(36);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor('#FF6347');
                                    Text.margin({ bottom: 20 });
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('得分: ' + this.score);
                        Text.fontSize(28);
                        Text.fontColor('#FFFFFF');
                        Text.margin({ bottom: 30 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重新开始');
                        Button.fontSize(20);
                        Button.width(140);
                        Button.height(60);
                        Button.backgroundColor('#FF6347');
                        Button.onClick(() => {
                            this.loadLevel(this.currentLevel - 1);
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.gameState === 'win') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('下一关');
                                    Button.fontSize(20);
                                    Button.width(140);
                                    Button.height(60);
                                    Button.backgroundColor('#32CD32');
                                    Button.margin({ left: 30 });
                                    Button.onClick(() => {
                                        this.loadLevel(this.currentLevel);
                                    });
                                }, Button);
                                Button.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            // 菜单弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 菜单弹窗
            if (this.showMenu) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(400);
                        Column.padding(40);
                        Column.backgroundColor('rgba(0, 0, 0, 0.95)');
                        Column.borderRadius(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('愤怒的小鸟');
                        Text.fontSize(32);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#FFD700');
                        Text.margin({ bottom: 30 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择关卡');
                        Text.fontSize(24);
                        Text.fontColor('#FFFFFF');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ bottom: 30 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const levelNum = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(levelNum.toString());
                                Button.fontSize(28);
                                Button.width(80);
                                Button.height(80);
                                Button.backgroundColor(this.currentLevel === levelNum ? '#FFD700' : '#8B4513');
                                Button.margin(10);
                                Button.onClick(() => {
                                    this.loadLevel(levelNum - 1);
                                    this.showMenu = false;
                                });
                            }, Button);
                            Button.pop();
                        };
                        this.forEachUpdateFunction(elmtId, [1, 2, 3], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('关闭');
                        Button.fontSize(20);
                        Button.width(180);
                        Button.height(60);
                        Button.backgroundColor('#FF6347');
                        Button.onClick(() => {
                            this.showMenu = false;
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 游戏画布
        Stack.pop();
        Column.pop();
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
        this.update(deltaTime);
        this.render();
        setTimeout(() => {
            this.gameLoop();
        }, 16);
    }
    // 处理触摸
    handleTouch(event: TouchEvent) {
        const touch = event.touches[0];
        const x = touch.x;
        const y = touch.y;
        const slingshotX = 100;
        const slingshotY = 300;
        if (event.type === TouchType.Down) {
            if (this.gameState === 'ready' && this.birdsRemaining > 0) {
                const dx = x - this.birdX;
                const dy = y - this.birdY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 50) {
                    this.gameState = 'aiming';
                    this.isPulling = true;
                }
            }
        }
        else if (event.type === TouchType.Move) {
            if (this.gameState === 'aiming' && this.isPulling) {
                const dx = x - slingshotX;
                const dy = y - slingshotY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > this.MAX_PULL) {
                    const ratio = this.MAX_PULL / distance;
                    this.pullX = slingshotX + dx * ratio;
                    this.pullY = slingshotY + dy * ratio;
                }
                else {
                    this.pullX = x;
                    this.pullY = y;
                }
                this.birdX = this.pullX;
                this.birdY = this.pullY;
            }
        }
        else if (event.type === TouchType.Up) {
            if (this.gameState === 'aiming') {
                this.isPulling = false;
                const dx = slingshotX - this.pullX;
                const dy = slingshotY - this.pullY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 5) {
                    const angle = Math.atan2(dy, dx);
                    const speed = distance * 0.15;
                    this.birdVX = Math.cos(angle) * speed * this.POWER;
                    this.birdVY = Math.sin(angle) * speed * this.POWER;
                    this.birdLaunched = true;
                    this.gameState = 'flying';
                }
                else {
                    this.resetBird();
                    this.gameState = 'ready';
                }
            }
        }
    }
    // 更新游戏状态
    update(deltaTime: number) {
        if (this.gameState !== 'flying') {
            return;
        }
        const groundY = 350;
        // 更新小鸟
        this.birdVY += this.GRAVITY * deltaTime;
        this.birdX += this.birdVX * deltaTime;
        this.birdY += this.birdVY * deltaTime;
        // 记录轨迹
        const newPoint: TrailPoint = { x: this.birdX, y: this.birdY };
        this.trail.push(newPoint);
        if (this.trail.length > 30) {
            this.trail.shift();
        }
        // 碰撞检测 - 障碍物
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.active && this.checkCollision(this.birdX, this.birdY, 20, block.x, block.y, block.w, block.h)) {
                const speed = Math.sqrt(this.birdVX * this.birdVX + this.birdVY * this.birdVY);
                block.health -= speed * 0.5;
                if (block.health <= 0) {
                    block.active = false;
                }
                const dx = (this.birdX + 20) - (block.x + block.w / 2);
                const dy = (this.birdY + 20) - (block.y + block.h / 2);
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.birdVX = -this.birdVX * 0.5;
                }
                else {
                    this.birdVY = -this.birdVY * 0.5;
                }
                this.birdVX *= 0.8;
                this.birdVY *= 0.8;
                this.score += 10;
            }
        }
        // 碰撞检测 - 猪
        for (let i = 0; i < this.pigs.length; i++) {
            const pig = this.pigs[i];
            if (pig.active && this.checkCollision(this.birdX, this.birdY, 20, pig.x, pig.y, 50, 50)) {
                const speed = Math.sqrt(this.birdVX * this.birdVX + this.birdVY * this.birdVY);
                pig.health -= speed;
                if (pig.health <= 0) {
                    pig.active = false;
                    pig.expression = 'dead';
                    this.score += 500;
                }
                else if (pig.health < 50) {
                    pig.expression = 'worried';
                }
                this.birdVX *= 0.5;
                this.birdVY *= 0.5;
            }
        }
        // 检查出界
        if (this.birdX > 900 || this.birdY > groundY + 50 || this.birdX < -50) {
            this.onBirdStopped();
        }
        this.checkGameEnd();
    }
    // 碰撞检测
    checkCollision(x1: number, y1: number, r1: number, x2: number, y2: number, w2: number, h2: number): boolean {
        return x1 < x2 + w2 && x1 + r1 * 2 > x2 && y1 < y2 + h2 && y1 + r1 * 2 > y2;
    }
    // 小鸟停止
    onBirdStopped() {
        this.birdLaunched = false;
        this.birdsRemaining = this.birdsRemaining - 1; // 显式减少
        // 先检查是否所有猪都死了
        const allPigsDead = this.pigs.every((pig: PigData) => !pig.active);
        if (allPigsDead) {
            this.gameState = 'win';
            this.score += this.birdsRemaining * 1000;
            return;
        }
        // 检查是否还有小鸟
        if (this.birdsRemaining > 0) {
            // 还有小鸟，准备下一只
            setTimeout(() => {
                this.resetBird();
                this.gameState = 'ready';
            }, 800);
        }
        else {
            // 没有小鸟了，游戏失败
            this.gameState = 'lose';
        }
    }
    // 检查游戏结束
    checkGameEnd() {
        // 如果游戏已经结束，不再检查
        if (this.gameState === 'win' || this.gameState === 'lose') {
            return;
        }
        const allPigsDead = this.pigs.every((pig: PigData) => !pig.active);
        if (allPigsDead) {
            this.gameState = 'win';
            this.score += this.birdsRemaining * 1000;
        }
        else if (this.birdsRemaining <= 0 && !this.birdLaunched) {
            this.gameState = 'lose';
        }
    }
    // 渲染
    render() {
        const ctx = this.context;
        const width = 800;
        const height = 400;
        const groundY = 350;
        const slingshotX = 100;
        const slingshotY = 300;
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        // 绘制背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // 绘制远山
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(100, groundY - 60);
        ctx.lineTo(200, groundY - 30);
        ctx.lineTo(300, groundY - 80);
        ctx.lineTo(400, groundY - 40);
        ctx.lineTo(500, groundY - 70);
        ctx.lineTo(600, groundY - 50);
        ctx.lineTo(700, groundY - 90);
        ctx.lineTo(800, groundY - 60);
        ctx.lineTo(800, groundY);
        ctx.closePath();
        ctx.fill();
        // 绘制地面
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, groundY - 5, width, 8);
        // 绘制弹弓后部分
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(slingshotX - 20, slingshotY - 60, 8, 80);
        ctx.beginPath();
        ctx.moveTo(slingshotX - 16, slingshotY - 60);
        ctx.lineTo(slingshotX - 25, slingshotY - 90);
        ctx.lineTo(slingshotX - 17, slingshotY - 90);
        ctx.lineTo(slingshotX - 12, slingshotY - 60);
        ctx.closePath();
        ctx.fill();
        // 绘制障碍物
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.active) {
                this.drawBlock(ctx, block);
            }
        }
        // 绘制猪
        for (let i = 0; i < this.pigs.length; i++) {
            const pig = this.pigs[i];
            if (pig.active) {
                this.drawPig(ctx, pig);
            }
        }
        // 绘制弹弓橡皮筋
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(slingshotX - 20, slingshotY - 85);
        ctx.lineTo(this.birdX + 20, this.birdY + 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(slingshotX + 20, slingshotY - 85);
        ctx.lineTo(this.birdX + 20, this.birdY + 20);
        ctx.stroke();
        // 绘制轨迹
        if (this.trail.length > 1) {
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x + 20, this.trail[0].y + 20);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x + 20, this.trail[i].y + 20);
            }
            ctx.stroke();
        }
        // 绘制预测轨迹
        if (this.gameState === 'aiming') {
            this.drawPrediction(ctx, slingshotX, slingshotY);
        }
        // 绘制小鸟
        this.drawBird(ctx, this.birdX + 20, this.birdY + 20);
        // 绘制弹弓前部分
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(slingshotX + 12, slingshotY - 60, 8, 80);
        ctx.beginPath();
        ctx.moveTo(slingshotX + 12, slingshotY - 60);
        ctx.lineTo(slingshotX + 17, slingshotY - 90);
        ctx.lineTo(slingshotX + 25, slingshotY - 90);
        ctx.lineTo(slingshotX + 16, slingshotY - 60);
        ctx.closePath();
        ctx.fill();
    }
    // 绘制小鸟
    drawBird(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const r = 20;
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFCCCC';
        ctx.beginPath();
        ctx.arc(x, y + 5, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - 8, y - 5, 8, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x - 6, y - 5, 4, 0, Math.PI * 2);
        ctx.arc(x + 10, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 15, y - 15);
        ctx.lineTo(x - 3, y - 10);
        ctx.moveTo(x + 15, y - 15);
        ctx.lineTo(x + 3, y - 10);
        ctx.stroke();
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(x + r - 5, y);
        ctx.lineTo(x + r + 10, y + 3);
        ctx.lineTo(x + r - 5, y + 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x - r, y);
        ctx.lineTo(x - r - 15, y - 10);
        ctx.lineTo(x - r - 15, y + 10);
        ctx.closePath();
        ctx.fill();
    }
    // 绘制障碍物
    drawBlock(ctx: CanvasRenderingContext2D, block: BlockData) {
        ctx.save();
        if (block.type === 'wood') {
            ctx.fillStyle = '#DEB887';
        }
        else if (block.type === 'stone') {
            ctx.fillStyle = '#A9A9A9';
        }
        else {
            ctx.fillStyle = 'rgba(135, 206, 250, 0.7)';
        }
        ctx.fillRect(block.x, block.y, block.w, block.h);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.w, block.h);
        if (block.type === 'wood') {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const y = block.y + block.h * (i + 1) / 4;
                ctx.beginPath();
                ctx.moveTo(block.x, y);
                ctx.lineTo(block.x + block.w, y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
    // 绘制猪
    drawPig(ctx: CanvasRenderingContext2D, pig: PigData) {
        const x = pig.x + 25;
        const y = pig.y + 25;
        const r = 25;
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(x - 15, y - 20, 8, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 15, y - 20, 8, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - 8, y - 5, 8, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        if (pig.expression === 'dead') {
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
        }
        else {
            ctx.beginPath();
            if (pig.expression === 'worried') {
                ctx.arc(x - 8, y - 3, 4, 0, Math.PI * 2);
                ctx.arc(x + 8, y - 3, 4, 0, Math.PI * 2);
            }
            else {
                ctx.arc(x - 8, y - 5, 4, 0, Math.PI * 2);
                ctx.arc(x + 8, y - 5, 4, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(x - 4, y + 8, 3, 0, Math.PI * 2);
        ctx.arc(x + 4, y + 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    // 绘制预测轨迹
    drawPrediction(ctx: CanvasRenderingContext2D, slingshotX: number, slingshotY: number) {
        const dx = slingshotX - this.pullX;
        const dy = slingshotY - this.pullY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5)
            return;
        const angle = Math.atan2(dy, dx);
        const speed = distance * 0.15;
        let vx = Math.cos(angle) * speed * this.POWER;
        let vy = Math.sin(angle) * speed * this.POWER;
        let x = this.pullX + 20;
        let y = this.pullY + 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 30; i++) {
            vy += this.GRAVITY * 0.02;
            x += vx * 0.02;
            y += vy * 0.02;
            if (y > 350)
                break;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
