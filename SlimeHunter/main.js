enchant();

//変数宣言 キャラ用
var knight;    //騎士
var enemy;    //赤い人
var takara;    //宝箱
var kuro; //黒騎士
var flower;    //フラワー
var stone;    //石
var slime;    //スライム
var mimikku;　　//ミミック
var catsle;    //城
var qween;    //女王
var lastboss; //ラスボス
var gyokuza;    //玉座
var seas = new Array(400);　//海

//変数宣言 ゲーム制御用
var game, input;          //
var scoreLabel;           //スコア
var result_1, result_2, result_4;   //クリア文字、ゲームオーバー文字、コンプリート文字
var re_1, re_2, re_4;           //"もう一度遊ぶ"
var re_on_1=0, re_on_2=0, re_on_4=0 ;//1:クリア文字、ゲームオーバー文字済
var game_level = 0;       //ゲームレベル
var touch_x=0, touch_y=0; //ゲームレベルのクリック座標
var col_flag=0;           //1:フラワーの横/上に衝突、2:フラワーの下に衝突
var sea_flag=0;           //1:騎士が海の位置まで移動
var end_flag=0;           //1:ゲームクリア、2:ゲームオーバー、3:画面クリック済、4:コンプリート
var sound_title;          //タイトル画面のBGM
var sound_bgm;            //ゲーム中のBGM
var sound_cut;            //敵を倒した時の効果音
var sound_attack;         //敵から攻撃を受けた時の効果音
var sound_clear;          //クリアの音楽
var sound_over;           //ゲームオーバーの音楽
var sound_last;           //ラスボスの音楽
var sound_cut_last;       //ラスボスを倒した時の効果音


function createKnight() {
  //騎士の初期化処理
  knight = new Sprite(32, 32);
  knight.image = game.assets["blue_knight.png"];
  knight.frame = [27, 28, 29];
  knight.x = 140;
  knight.y = 290;
  knight.onenterframe = knight_enterfame;
  game.rootScene.addChild(knight);
}

function knight_enterfame() {
  //騎士の毎フレーム処理
　//左に移動
    if ((input.left === true) && (col_flag != 1)) {
        if (this.x >= 0) {
            this.x -= 4;
            this.frame = [9, 9, 10, 10, 11, 11];
        }
    }
    //右に移動
    if ((input.right === true) && (col_flag != 1)) {
        if (this.x <= 290) {
            this.x += 4;
            this.frame = [18, 18, 19, 19, 20, 20];
        }
    }
    //上に移動
    if ((input.up === true) && (col_flag == 0)) {
        if (this.y >= 180) {
            this.y -= 4;
            this.frame = [27, 27, 28, 28, 29, 29];
        }
    }
    //下に移動
    if ((input.down === true) && (col_flag == 0)) {
        if (this.y <= 290) {
            this.y += 4;
            this.frame = [0, 0, 1, 1, 2, 2];
        }
    }
    //フラワーに衝突して下に移動
    if (col_flag == 2) {
        this.y += 1;
        this.frame = [0, 0, 1, 1, 2, 2];
        //フラワーと画面の下に挟まれる判定
        if ((this.y >= 290) && (end_flag!=3)){
          end_flag = 2;
          ending_scene();
          sound_bgm.stop();//音楽再生
          sound_over.play();//音楽再生
       }
    }
    col_flag = 0;
}


function createEnemy(){
//赤い人の初期化処理
  enemy = new Sprite(32,32);
  enemy.image = game.assets["chara8.png"];
  enemy.frame = [3,3,3,4,4,4,5,5,5];
  enemy.x = rand(320-16);
  enemy.y = -rand(640);
  enemy.onenterframe = enemy_enterframe;
  game.rootScene.addChild(enemy);
}

function enemy_enterframe(){
  //赤い人の毎フレーム処理
  //移動
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      knight.frame = [33, 34, 35, 27];
      game.rootScene.removeChild(this);
      scoreLabel.score += 300;
      sound_cut.play();//音楽再生
  }
}

function createTakara(){
//宝箱の初期化処理
  takara = new Sprite(32,32);
  takara.image = game.assets["chara6.png"];
  takara.frame = [3,3,3,4,4,4,5,5,5];
  takara.x = rand(320-16);
  takara.y = -rand(640);
  takara.onenterframe = takara_enterframe;
  game.rootScene.addChild(takara);
}

function takara_enterframe(){
  //宝箱の毎フレーム処理
  //移動
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      knight.frame = [33, 34, 35, 27];
      game.rootScene.removeChild(this);
      scoreLabel.score += 300;
      sound_cut.play();//音楽再生
  }
}

function createKuro(){
　//黒騎士の初期化処理
  kuro = new Sprite(32,32);
  kuro.image = game.assets["chara7.png"];
  kuro.frame = [0,0,0,1,1,1,2,2,2];
  kuro.x = rand(320-16);
  kuro.y = -rand(640);
  kuro.onenterframe = kuro_enterframe;
  game.rootScene.addChild(kuro);
}

function kuro_enterframe(){
  //黒騎士の毎フレーム処理
　//移動
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      this.frame = [6,6,7,7,8,8];
      scoreLabel.score -= 10;
      sound_attack.play();//音楽再生
  }
}


function createFlower(){
  //フラワーの初期化処理
  flower = new Sprite(32,32);
  flower.image = game.assets["plant.png"];
  flower.frame = 106;
  flower.x = rand(320-16);
  flower.y = -rand(640);
  flower.onenterframe = flower_enterframe;
  game.rootScene.addChild(flower);
}

 function flower_enterframe(){
  //フラワーの毎フレーム処理
  //移動
  this.y++;
  //衝突判定
  //フラワーの下に衝突する場合
  if ( (knight.x >= (this.x - 24)) && (knight.x <= (this.x + 24)) &&
       (knight.y >= (this.y + 32)) && (knight.y <= (this.y + 36)) ) {
     col_flag = 2;
  }
  //フラワーの横/上に衝突する場合
  else {
     if (this.within(knight)) {
       col_flag = 1;
     }
   }
 }

function createHuman(){
  //城の人の初期化処理
  human = new Sprite(22,25);
  human.image = game.assets["meido.png"];
  human.frame = [0, 0, 0, 1, 1, 1, 2, 2, 2];
  human.x = rand(320-16);
  human.y = -rand(640);
  human.onenterframe = human_enterframe;
  game.rootScene.addChild(human);
}

 function human_enterframe(){
  //城の人の毎フレーム処理
  //移動
  this.y++;
  //衝突判定
  //城の人の下に衝突する場合
  if ( (knight.x >= (this.x - 24)) && (knight.x <= (this.x + 24)) &&
       (knight.y >= (this.y + 32)) && (knight.y <= (this.y + 36)) ) {
     col_flag = 2;
  }
  //城の人の横/上に衝突する場合
  else {
     if (this.within(knight)) {
       col_flag = 1;
     }
   }
 }

function createStone(){
  //石の初期化処理
  stone = new Sprite(16,16);
  stone.image = game.assets["stone.png"];
  stone.frame = 106;
  stone.scaleX=1.5;
  stone.scaleY=1.5;
  stone.x = rand(320-16);
  stone.y = -rand(640);
  stone.onenterframe = stone_enterframe;
  game.rootScene.addChild(stone);
}

 function stone_enterframe(){
  //石の毎フレーム処理
  //移動
  this.y++;
  //衝突判定
  //石の下に衝突する場合
  if ( (knight.x >= (this.x - 24)) && (knight.x <= (this.x + 24)) &&
       (knight.y >= (this.y + 24)) && (knight.y <= (this.y + 24)) ) {
     col_flag = 2;
  }
  //石の横/上に衝突する場合
  else {
     if (this.within(knight)) {
       col_flag = 1;
     }
   }
 }

function createSlime() {
  //スライムの初期化処理
  slime = new Sprite(32, 32);
  slime.image = game.assets["chara6.png"];
  slime.frame = [6, 6, 6, 7, 7, 7, 8, 8, 8];
  slime.x = rand(320-16);
  slime.y = -rand(640);
  slime.onenterframe = slime_enterframe;
  game.rootScene.addChild(slime);
  return slime;
}

function slime_enterframe() {
  //スライムの毎フレーム処理
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      knight.frame = [33, 34, 35, 27];
      game.rootScene.removeChild(this);
      scoreLabel.score += 100;
      sound_cut.play();//音楽再生
  }
}

function createMimikku() {
  //ミミックの初期化処理
  mimikku = new Sprite(32, 32);
  mimikku.image = game.assets["chara6.png"];
  mimikku.frame = [0, 0, 0, 1, 1, 1, 2 ,2 ,2];
  mimikku.x = rand(320-16);
  mimikku.y = -rand(640);
  mimikku.onenterframe = mimikku_enterframe;
  game.rootScene.addChild(mimikku);
  return mimikku;
}

function mimikku_enterframe() {
    //ミミックの毎フレーム処理
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      knight.frame = [33, 34, 35, 27];
      game.rootScene.removeChild(this);
      scoreLabel.score += 100;
      sound_cut.play();//音楽再生
  }
}

/*
function createXXX() {
  //HARDの敵の初期化処理
  xxx = new Sprite(32, 32);
  xxx.image = game.assets["xxx.png"];
  xxx.frame = [6, 6, 6, 7, 7, 7, 8, 8, 8];
  xxx.x = rand(320-16);
  xxx.y = -rand(640);
  xxx.onenterframe = xxx_enterframe;
  game.rootScene.addChild(xxx);
  return xxx;
}

function xxx_enterframe() {
  //HARDの敵の毎フレーム処理
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      knight.frame = [33, 34, 35, 27];
      game.rootScene.removeChild(this);
      scoreLabel.score += 100;
  }
}
*/

function rand(n) {
　//乱数の生成
  return Math.floor(Math.random() * n);
}

function createSea(x,y){
　 //海の初期化処理
  sea = new Sprite(16,16);
  sea.image = game.assets["map0.png"];
  sea.frame = 1;
  sea.x = x;
  sea.y = y;
  sea.onenterframe = sea_enterframe;
  game.rootScene.addChild(sea);
}

function sea_enterframe(){
  //海の毎フレーム処理
　//移動
  this.y++;
  //ゲームオーバー判定
  if ((sea_flag==0) && (this.y >=210) && (end_flag==0)) {
   sea_flag = 1;
   end_flag = 2;
   ending_scene();
   sound_bgm.stop();//音楽停止
   sound_over.play();//音楽再生
  }
}

function createGyokuza(){
　 //玉座の初期化処理
  gyokuza = new Sprite(320,196);
  gyokuza.image = game.assets["goal.png"];
  gyokuza.x = 0;
  gyokuza.y = -900;
  gyokuza.onenterframe = gyokuza_enterframe;
  game.rootScene.addChild(gyokuza);
}

function gyokuza_enterframe(){
  //玉座の毎フレーム処理
　//移動
  if(this.y < 50){
  this.y++;
  }
}


function createCatsle(){
  //城の初期化処理
  catsle = new Sprite(32,32);
  catsle.image = game.assets["siro.png"];
  catsle.x = 140;
  catsle.y = -(140+640);
  catsle.scaleX=3;
  catsle.scaleY=3;
  catsle.onenterframe = catsle_enterframe;
  game.rootScene.addChild(catsle);
  return catsle;
}

function catsle_enterframe(){
　//城の毎フレーム処理
　//移動
  this.y++;
  //衝突判定
  if (this.within(knight)) {
      game.rootScene.removeChild(knight);
      if(scoreLabel.score == 3800){
          //complete
        end_flag = 4;
        ending_scene();
        sound_bgm.stop();//音楽停止
        sound_clear.play();//音楽再生
      } else {
        if(scoreLabel.score >= 3000){
　　　　  //ゲームクリア
          end_flag = 1;
          ending_scene();
          sound_bgm.stop();//音楽停止
          sound_clear.play();//音楽再生
        }else{
          //ゲームオーバー
          end_flag = 2;
          ending_scene();
          sound_bgm.stop();//音楽停止
         sound_over.play();//音楽再生
        }
      }
  }
}



function createQween(){
  //女王の初期化処理
  qween = new Sprite(52,81);
  qween.image = game.assets["qween.png"];
  qween.x = 130;
  qween.y = -840;
  qween.onenterframe = qween_enterframe;
  game.rootScene.addChild(qween);
  return qween;
}

function qween_enterframe(){
　//女王の毎フレーム処理
　//移動
  if(this.y < 110){
  this.y++;
  }
  //衝突判定
  if (this.within(knight)) {
      game.rootScene.removeChild(knight);
      if(scoreLabel.score >= 3800){
          //complete
        end_flag = 4;
        ending_scene();
        sound_bgm.stop();//音楽停止
        sound_clear.play();//音楽再生
      } else {
        if(scoreLabel.score >= 2500){
　　　　  //ゲームクリア
          end_flag = 1;
          ending_scene();
          sound_bgm.stop();//音楽停止
          sound_clear.play();//音楽再生
        }else{
          //ゲームオーバー
          end_flag = 2;
          ending_scene();
          sound_bgm.stop();//音楽停止
          sound_over.play();//音楽再生
        }
      }
  }
}



function createLastboss(){
  //ラスボスの初期化処理
  lastboss = new Sprite(96,96);
  lastboss.image = game.assets["lastboss.png"];
  lastboss.x = 110;
  lastboss.y = -840;
  lastboss.frame = [0, 0, 0, 1, 1, 1];
  lastboss.onenterframe = lastboss_enterframe;
  game.rootScene.addChild(lastboss);
  return lastboss;
}

function lastboss_enterframe(){
　//ラスボスの毎フレーム処理
　//移動
  if(this.y < 110){
    this.y++;
  }
  if(this.y == -100){
    sound_bgm.stop();//音楽停止
    sound_last.play();//音楽再生
  }

  //衝突判定
  if (this.within(knight)) {
      game.rootScene.removeChild(lastboss);
      game.rootScene.removeChild(knight);
      sound_cut_last.play();//音楽再生
      if(scoreLabel.score == 3800){
          //complete
        end_flag = 4;
        ending_scene();
        sound_last.stop();//音楽停止
        sound_clear.play();//音楽再生
      } else {
        if(scoreLabel.score >= 3000){
　　　　  //ゲームクリア
          end_flag = 1;
          ending_scene();
          sound_last.stop();//音楽停止
          sound_clear.play();//音楽再生
        }else{
          //ゲームオーバー
          end_flag = 2;
          ending_scene();
          sound_last.stop();//音楽停止
          sound_over.play();//音楽再生
        }
      }
  }
}



function createLevel(){
  //レベルの表示
  l = new Sprite(16,16);
  l.image = game.assets["font0.png"];
  l.frame = 44;
  l.x = 5;
  l.y = 5;
  game.rootScene.addChild(l);
  e = new Sprite(16,16);
  e.image = game.assets["font0.png"];
  e.frame = 37;
  e.x = 21;
  e.y = 5;
  game.rootScene.addChild(e);
  v = new Sprite(16,16);
  v.image = game.assets["font0.png"];
  v.frame = 54;
  v.x = 37;
  v.y = 5;
  game.rootScene.addChild(v);
  e = new Sprite(16,16);
  e.image = game.assets["font0.png"];
  e.frame = 37;
  e.x = 53;
  e.y = 5;
  game.rootScene.addChild(e);
  l = new Sprite(16,16);
  l.image = game.assets["font0.png"];
  l.frame = 44;
  l.x = 69;
  l.y = 5;
  game.rootScene.addChild(l);
  koron = new Sprite(16,16);
  koron.image = game.assets["font0.png"];
  koron.frame = 26;
  koron.x = 85;
  koron.y = 5;
  game.rootScene.addChild(koron);
  if(game_level == 1){
    e = new Sprite(16,16);
    e.image = game.assets["font0.png"];
    e.frame = 37;
    e.x = 100;
    e.y = 5;
    game.rootScene.addChild(e);
    a = new Sprite(16,16);
    a.image = game.assets["font0.png"];
    a.frame = 33;
    a.x = 115;
    a.y = 5;
    game.rootScene.addChild(a);
    s = new Sprite(16,16);
    s.image = game.assets["font0.png"];
    s.frame = 51;
    s.x = 130;
    s.y = 5;
    game.rootScene.addChild(s);
    y = new Sprite(16,16);
    y.image = game.assets["font0.png"];
    y.frame = 57;
    y.x = 145;
    y.y = 5;
    game.rootScene.addChild(y);
  }
  if(game_level == 2){
    n = new Sprite(16,16);
    n.image = game.assets["font0.png"];
    n.frame = 46;
    n.x = 100;
    n.y = 5;
    game.rootScene.addChild(n);
    o = new Sprite(16,16);
    o.image = game.assets["font0.png"];
    o.frame = 47;
    o.x = 115;
    o.y = 5;
    game.rootScene.addChild(o);
    r = new Sprite(16,16);
    r.image = game.assets["font0.png"];
    r.frame = 50;
    r.x = 130;
    r.y = 5;
    game.rootScene.addChild(r);
    m = new Sprite(16,16);
    m.image = game.assets["font0.png"];
    m.frame = 45;
    m.x = 145;
    m.y = 5;
    game.rootScene.addChild(m);
    a = new Sprite(16,16);
    a.image = game.assets["font0.png"];
    a.frame = 33;
    a.x = 160;
    a.y = 5;
    game.rootScene.addChild(a);
    l = new Sprite(16,16);
    l.image = game.assets["font0.png"];
    l.frame = 44;
    l.x = 175;
    l.y = 5;
    game.rootScene.addChild(l);
    }
  if(game_level == 4){
    h = new Sprite(16,16);
    h.image = game.assets["font0.png"];
    h.frame = 40;
    h.x = 100;
    h.y = 5;
    game.rootScene.addChild(h);
    a = new Sprite(16,16);
    a.image = game.assets["font0.png"];
    a.frame = 33;
    a.x = 115;
    a.y = 5;
    game.rootScene.addChild(a);
    r = new Sprite(16,16);
    r.image = game.assets["font0.png"];
    r.frame = 50;
    r.x = 130;
    r.y = 5;
    game.rootScene.addChild(r);
    d = new Sprite(16,16);
    d.image = game.assets["font0.png"];
    d.frame = 36;
    d.x = 145;
    d.y = 5;
    game.rootScene.addChild(d);
    }
}
function ending_scene(){
  //エンディング画面処理
  if (end_flag==1) {
    //クリア画面の表示
    if (re_on_1==0) {
      result_1 = new Sprite(266,48);
      result_1.image = game.assets["clear.png"];
      result_1.x = 30;
      result_1.y = 140;
      game.rootScene.addChild(result_1);
      re_1 = new Label();
      re_1.text = "もう一度遊ぶ";
      re_1.font = "16px serif";
      re_1.x = 120;
      re_1.y = 260;
      game.rootScene.addChild(re_1);
      re_on_1 = 1;
    }
    //クリア画面表示後の画面クリック待ち
    re_1.addEventListener(Event.TOUCH_START, function(){
      game.rootScene.removeChild(result_1);
      game.rootScene.removeChild(re_1);
      if(game_level == 1){
        game.rootScene.removeChild(catsle);
      }
      if(game_level == 2){
        game.rootScene.removeChild(gyokuza);
        game.rootScene.removeChild(qween);
      }
      if(game_level == 4){
        //game.rootScene.removeChild(lastboss);
      }
      scoreLabel.score = 0;
      end_flag = 3;
    });
  }
  if (end_flag==2) {
    //ゲームオーバー画面の表示
    if (re_on_2==0) {
      result_2 = new Sprite(187,95);
      result_2.image = game.assets["end.png"];
      result_2.x = 60;
      result_2.y = 120;
      game.rootScene.addChild(result_2);
      re_2 = new Label();
      re_2.text = "もう一度遊ぶ";
      re_2.font = "16px serif";
      re_2.x = 120;
      re_2.y = 260;
      game.rootScene.addChild(re_2);
      re_on_2 = 1;
    }
     //ゲームオーバー画面表示後の画面クリック待ち
　    re_2.addEventListener(Event.TOUCH_START, function(){
      game.rootScene.removeChild(result_2);
      game.rootScene.removeChild(re_2);
      if(game_level == 1){
        game.rootScene.removeChild(catsle);
      }
      if(game_level == 2){
        game.rootScene.removeChild(gyokuza);
        game.rootScene.removeChild(qween);
      }
      if(game_level == 4){
        //game.rootScene.removeChild(lastboss);
      }
      scoreLabel.score = 0;
      end_flag = 3;
    });
  }
  if (end_flag==4) {
    //コンプリート画面の表示
    if (re_on_4==0) {
      result_4 = new Sprite(255,70);
      result_4.image = game.assets["Perfect.png"];
      result_4.x = 35;
      result_4.y = 120;
      game.rootScene.addChild(result_4);
      re_4 = new Label();
      re_4.text = "もう一度遊ぶ";
      re_4.font = "16px serif";
      re_4.x = 120;
      re_4.y = 260;
      game.rootScene.addChild(re_4);
      re_on_4 = 1;
    }
     //コンプリート画面表示後の画面クリック待ち
　    re_4.addEventListener(Event.TOUCH_START, function(){
      game.rootScene.removeChild(result_4);
      game.rootScene.removeChild(re_4);
      if(game_level == 1){
        game.rootScene.removeChild(catsle);
      }
      if(game_level == 2){
        game.rootScene.removeChild(gyokuza);
        game.rootScene.removeChild(qween);
      }
      if(game_level == 4){
        //game.rootScene.removeChild(lastboss);
      }
      scoreLabel.score = 0;
      end_flag = 3;
    });
  }
}

 /* タイトル画面 */
 var createTitleScene = function() {
   //タイトル画面のBGM
   sound_title = game.assets["title.mp3"].clone();

   var scene = new Scene();
   var label_1 = new Label('Slime Hunter');
   label_1.x = 60;
   label_1.y = 60;
   label_1.font = "32px Palatino";
   label_1.color = "blue";
   scene.addChild(label_1);
   var label_2 = new Label('☆ レベルをクリックして選択してください ☆');
   label_2.x = 30;
   label_2.y = 160;
   label_2.font = "12px Palatino";
   label_2.color = "yellow";
   scene.addChild(label_2);
   var label_3 = new Label('EASY      　　   NORMAL  　　       HARD');
   label_3.x = 50;
   label_3.y = 210;
   label_3.font = "12px Palatino";
   label_3.color = "red";
   scene.addChild(label_3);
   scene.backgroundColor = 'rgba(120, 200, 100, 11)';

   sound_title.play();//音楽再生

   //レベルクリック待ち
   scene.addEventListener(Event.TOUCH_START, function(e){
     touch_x = e.x;
     touch_y = e.y;
     if ((touch_y > 200) && (touch_y < 220)){
     if (touch_x < 105) {
       game_level = 1;
     }
     else{
       if (touch_x < 210) {
         game_level = 2;
       }
       else {
         game_level = 4;
       }
     }

     sound_title.stop();//音楽停止

     //ゲーム画面に切り替え
     game.replaceScene(createGameScene());
     }
     });
   return scene;
}


/* ゲーム画面 */
var createGameScene = function() {
  sound_cut    = game.assets["cut.mp3"].clone();
  sound_attack = game.assets["attack.mp3"].clone();
  sound_clear  = game.assets["clear.mp3"].clone();
  sound_over   = game.assets["gameover.mp3"].clone();
  sound_last   = game.assets["last.mp3"].clone();
  sound_cut_last = game.assets["cut_last.mp3"].clone();

  if(game_level == 1){
    //EASYの時のゲーム中のBGM
    sound_bgm    = game.assets["game_bgm1.mp3"].clone();
    //EASYの時の背景
    map = new Sprite(320,320);
    map.image = game.assets["prairie.png"];
    map.x = 0;
    map.y = 0;
    game.rootScene.addChild(map);
    //海生成
   var i = 0, y = -800, x = 0;
   while(i < 400){
     seas[i++] = createSea(x,y);
     x += 16;
      if(x > 310){
        x = 0;
         y -= 16;
      }
   }
    //キャラ生成
   for (var i = 0; i < 30; i++) {
       createSlime();
   }　
   for (var i = 0; i < (game_level * 10); i++) {
     createFlower();
   }　
   for (var i = 0; i < 3; i++) {
     createEnemy();
   }　
   for (var i = 0; i < 3; i++) {
     createKuro();
   }　
   createCatsle();
   createKnight();
  }
  if(game_level == 2){
    //NORMALの時のゲーム中のBGM
    sound_bgm    = game.assets["game_bgm2.mp3"].clone();
    //NORMALの時の背景
    map = new Sprite(320,320);
    map.image = game.assets["城内.png"];
    map.x = 0;
    map.y = 0;
    game.rootScene.addChild(map);
     //キャラ生成
   for (var i = 0; i < 30; i++) {
       createMimikku();
   }　
   for (var i = 0; i < (game_level * 10); i++) {
     createHuman();
   }　
   for (var i = 0; i < 3; i++) {
     createTakara();
   }　
   for (var i = 0; i < 3; i++) {
     createKuro();
   }　
   createGyokuza();
   createQween();
   createKnight();
  }
  if(game_level == 4){
    //HARDの時のゲーム中のBGM
    sound_bgm    = game.assets["game_bgm3.mp3"].clone();
    //HARDの時の背景
    map = new Sprite(320,320);
    map.image = game.assets["Maoucastle.png"];
    map.x = 0;
    map.y = 0;
    game.rootScene.addChild(map);
      //キャラ生成
   for (var i = 0; i < 30; i++) {
       createMimikku();
   }　
   for (var i = 0; i < (game_level * 10); i++) {
     createStone();
   }　
   for (var i = 0; i < 3; i++) {
     createTakara();
   }　
   for (var i = 0; i < 3; i++) {
     createKuro();
   }　
    createLastboss();
    createKnight();
    //createXXX(); HARDの敵
  }

   createLevel();

   //スコア表示
   scoreLabel = new ScoreLabel(5,20);
   scoreLabel.score = 0;
   game.rootScene.addChild(scoreLabel);

   sound_bgm.play();//音楽再生
}


window.onload = function() {
    game = new Game(320, 320);
    game.preload("title.mp3","game_bgm1.mp3","game_bgm2.mp3","game_bgm3.mp3","cut.mp3","attack.mp3","clear.mp3","gameover.mp3","last.mp3","cut_last.mp3","lastboss.png","qween.png","stone.png","goal.png","meido.png","start.png","end.png","clear.png","blue_knight.png", "chara6.png", "chara7.png","map0.png","plant.png","siro.png","Perfect.png","城内.png","prairie.png","human.png","chara8.png","Maoucastle.png");
    input = game.input;
    game.fps = 20;
    game_level = 0;

    game.onload = function() {
　　　//最初のタイトル画面
      game.replaceScene(createTitleScene());

　　　//ゲームのリトライ
      game.rootScene.onenterframe = function() {
        if (end_flag==3) {
           location.reload();
         }
       };
    }
    game.start();
}
