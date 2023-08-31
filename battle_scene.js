const testBox = document.getElementById("testbox");

// Game Setup
let gameFrame = 0;
const gameDelayFrame = 5;
const frameWidth = 256; // Width of each frame in the sprite sheet
const frameHeight = 256; // Height of each frame in the sprite sheet
var spriteStand = [];
var spriteStandFrameSet = [];
var spriteMove = [];
var spriteMoveFrameSet = [];
var spriteAttack = [];
var spriteAttackFrameSet = [];
var spriteGetHit = [];
var spriteGetHitFrameSet = [];
var spriteFainted = [];
var spriteFaintedFrameSet = [];

// Music :
var BGMusic = new Audio('sounds/_bgm_battle_0.wav');
BGMusic.volume = 0.2;

// Battle variables :
var battleTurn = 0;
var battleTurnPhase = 0;
var battleCharacter = [];
var battleTurnCurrentCharacter = -1;
var battleCharacterSequence = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load background image
const backgroundImage = new Image();
backgroundImage.src = "/bg/bg1.png";
const shadowImageMedium = new Image();
shadowImageMedium.src = "/others/shadow_medium.png";

// Lấy sprite pack từ thư viện
import { spritePack } from "/sprite_lib.js";
import { effectPack } from "/sprite_lib.js";

// Effect Setup :
var effectActive = [];
var effectSpriteSheet = [];
var effectSpriteFrameNumber = [];
var effectSpriteFrameSize = [];
var effectImageIndex = [];
var effectX = [];
var effectY = [];
var effectFaceDirection = []; 
var effectOriginX = [];
var effectOriginY = [];
var effectDepth = [];
var effectTotalNumber = 20;
createAllEffects(effectTotalNumber);

// Damage Text Setup :
var damageText = {};

// Character setup
var characterActive = [];
var characterState = [];
var characterStateStep = [];
var characterClass = [];
var characterParty = [];
var characterTendency = [];
var characterHPMax = [];
var characterHP = [];
var characterMPMax = [];
var characterMP = [];
var characterATK = [];
var characterDEF = [];
var characterMAG = [];
var characterSPD = [];
var characterSpriteSheet = [];
var characterSpriteFrameSet = [];
var characterFrameIndex = [];
var characterImageIndex = [];
var characterXStart = [];
var characterYStart = [];
var characterXMove = [];
var characterYMove = [];
var characterX = [];
var characterY = [];
var characterHSpeed = [];
var characterVSpeed = [];
var characterImageSpeed = [];
var characterFaceDirection = [];
var characterOriginX = [];
var characterOriginY = [];
var characterDrawHitbox = [];
var characterDrawDepth = [];
var characterShadowSize = [];
var characterHitboxX = [];
var characterHitboxY = [];
var characterHitboxWidth = 38;
var characterHitboxHeight = 68;
var characterAttackTargetID = [];
var characterSoundStart = [];
var characterSoundAttack = [];
var characterSoundGetHit = [];
var characterEffectAttackBasic = [];
var characterAlarm1Tick = [];

// Sprite setup
setSpriteWithClassID(0, 0);
setSpriteWithClassID(1, 1);
setSpriteWithClassID(2, 2);

setSpriteWithClassID(3, 4);
setSpriteWithClassID(4, 3);
setSpriteWithClassID(5, 3);

// Setup Character :
createCharacterBase(0, 1, 164, 364);
setupCharacterInfo(0, 0, 200, 180, 100, 90);
setupCharacterStat(0, 70, 20, 20, 10, 15);
setSoundWithID(0,0);

createCharacterBase(1, 1, 164 - 32, 364 + 64);
setupCharacterInfo(1, 0, 200, 180, 100, 90);
setupCharacterStat(1, 70, 20, 20, 10, 18);

createCharacterBase(2, 1, 164 - 32*2, 364 + 64*2);
setupCharacterInfo(2, 0, 200, 180, 100, 90);
setupCharacterStat(2, 70, 20, 20, 10, 16);

createCharacterBase(3, -1, 636, 364);
setupCharacterInfo(3, 1, 200, 180, 100, 90);
setupCharacterStat(3, 70, 20, 20, 10, 17);
setSoundWithID(3,4);
setBasicEffectOfCharacter(3,15);

createCharacterBase(4, -1, 636 + 32, 364 + 64);
setupCharacterInfo(4, 1, 200, 180, 100, 90);
setupCharacterStat(4, 70, 20, 20, 10, 12);
setSoundWithID(4,3);

createCharacterBase(5, -1, 636 + 64, 364 + 128);
setupCharacterInfo(5, 1, 200, 180, 100, 90);
setupCharacterStat(5, 70, 20, 20, 10, 13);
setSoundWithID(5,3);

setupBattle();

function gameLoop() {
  if (gameFrame < gameDelayFrame) {
    gameFrame += 1;
  } else {
    gameFrame = 0;
    stepGame(); // Continues game process
    drawGame(); // Update game frame
  }

  requestAnimationFrame(gameLoop);
}

function stepGame() {
  // Battle System :
  if (battleTurn >= 0) {
    battleStep();
  }
  
  // Effect System :
  for (let effectID = 0; effectID < effectTotalNumber; effectID++) {
    if (effectActive[effectID]) {
      var finishFrame = nextFrameEffect(effectID);
      if (finishFrame) {
        removeEffect(effectID);
      }
    }
  }

  // Damage Text System :
  damageTextStep();
  
  // STATE MACHINE :
  for (let charID = 0; charID < characterActive.length; charID++) {
    if (characterActive[charID]) {
      switch (characterState[charID]) {
        case "stand":
          nextFramePlayer(charID);
          break;
        case "move to target":
          subStateMoveToTarget(charID, 28);
          break;
        case "get hit":
          if (characterAlarm1Tick[charID] > 0) {
            characterAlarm1Tick[charID] -= 1;
          } else {
            characterAlarm1Tick[charID] = -1; // Turn off
            characterSpriteSheet[charID].src = spriteStand[charID];
            characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
            characterState[charID] = "stand";
            nextFramePlayer(charID);
          }
          break;
        case "attack - normal":
          switch (characterStateStep[charID]) {
            case 0:
              // Considering attack :
              if (consideringAttack(charID)) {
                characterStateStep[charID] = 1;
                characterAttackTargetID[charID] =
                  getAttackedTargetNormal(charID);
                var targetPosition = getFrontPosition(
                  characterAttackTargetID[charID]
                );
                console.log("! "+charID+" go to attack target :");
                console.log(characterAttackTargetID[charID]);
                characterXMove[charID] = targetPosition.positionX;
                characterYMove[charID] = targetPosition.positionY;
                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);

                // Sound :
                var audio = new Audio(characterSoundStart[charID]);
                audio.volume = 0.3;
                audio.play();
              } else {
                characterStateStep[charID] = -1;
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                // .... EFFECT DEFFEND!
              }
              break;
            case 1:
              // Moving to target
              var reach = subStateMoveToTarget(charID, 60);
              if (reach) {
                //characterFaceDirection[charID] *= -1;
                characterStateStep[charID] = 2;
                characterAlarm1Tick[charID] = 2;
                characterSpriteSheet[charID].src = spriteAttack[charID];
                characterSpriteFrameSet[charID] = spriteAttackFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);

                // Sound :
                var audio = new Audio(characterSoundAttack[charID]);
                audio.volume = 0.3;
                audio.play();
              }
              break;
            case 2:
              // Attacking
              var finish = subStateAttackPerform(charID);

              if (characterAlarm1Tick[charID] > 0) {
                characterAlarm1Tick[charID] -= 1;
              } else if (characterAlarm1Tick[charID] == 0) {
                characterAlarm1Tick[charID] = -1;

                // Damage :
                var damage = damageCalculation(charID);

                // Trigger enemy getting hit :
                var enemyID = characterAttackTargetID[charID];
                characterAlarm1Tick[enemyID] = 8;
                characterSpriteSheet[enemyID].src = spriteGetHit[enemyID];
                characterSpriteFrameSet[enemyID] = spriteGetHitFrameSet[enemyID];
                characterState[enemyID] = "get hit";
                nextFramePlayer(enemyID);

                //Effect :
                createNewEffect(
                  characterEffectAttackBasic[charID],
                  characterX[enemyID] + 32*characterFaceDirection[enemyID],
                  characterY[enemyID] - 16,
                  characterFaceDirection[enemyID],
                  characterDrawDepth[enemyID] + 1 
                );
                createNewDamageText(damage,characterX[enemyID],characterY[enemyID],false);

                // Sound :
                var audio = new Audio('sounds/hit_normal.wav');
                audio.volume = 0.3;
                audio.play();
                // Sound :
                var audio = new Audio(characterSoundGetHit[enemyID]);
                audio.volume = 0.3;
                audio.play();
              }

              if (finish) {
                characterStateStep[charID] = 3;
                characterXMove[charID] = characterXStart[charID];
                characterYMove[charID] = characterYStart[charID];

                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);
              }
              break;
            case 3:
              // Moving to starting position
              testBox.innerText = "state step : " + characterStateStep[charID];
              var reach = subStateMoveToTarget(charID, 28);
              if (reach) {
                characterStateStep[charID] = -1;
                characterFaceDirection[charID] *= -1; // flip face dir
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                battleTurnPhase = 2;
              }
              break;
          }
          break;
        case "attack - 1":
          switch (characterStateStep[charID]) {
            case 0:
              // Considering attack :
              if (consideringAttack(charID)) {
                characterStateStep[charID] = 1;
                characterAttackTargetID[charID] =
                  getAttackedTargetNormal(charID);
                var targetPosition = getBehindPosition(
                  characterAttackTargetID[charID]
                );
                characterXMove[charID] = targetPosition.positionX;
                characterYMove[charID] = targetPosition.positionY;
                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);
                // Sound :
                var audio = new Audio('sounds/quick_move.wav');
                audio.volume = 0.3;
                audio.play();
              } else {
                characterStateStep[charID] = -1;
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                // .... EFFECT DEFFEND!
              }
              break;
            case 1:
              // Moving to target
              var reach = subStateMoveToTarget(charID, 90);
              if (reach) {
                characterFaceDirection[charID] *= -1;
                characterStateStep[charID] = 2;
                characterAlarm1Tick[charID] = 2;
                characterSpriteSheet[charID].src = spriteAttack[charID];
                characterSpriteFrameSet[charID] = spriteAttackFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);

                // Sound :
                var audio = new Audio('sounds/attack_dagger.wav');
                audio.volume = 0.3;
                audio.play();
                // Sound :
                console.log(characterSoundGetHit[enemyID]);
                var audio = new Audio(characterSoundGetHit[enemyID]);
                audio.volume = 0.3;
                audio.play();
              }
              break;
            case 2:
              // Attacking
              var finish = subStateAttackPerform(charID);

              if (characterAlarm1Tick[charID] > 0) {
                characterAlarm1Tick[charID] -= 1;
              } else if (characterAlarm1Tick[charID] == 0) {
                characterAlarm1Tick[charID] = -1;

                // Damage :
                var damage = damageCalculation(charID);

                // Trigger enemy getting hit :
                var enemyID = characterAttackTargetID[charID];
                characterAlarm1Tick[enemyID] = 8;
                characterSpriteSheet[enemyID].src = spriteGetHit[enemyID];
                characterSpriteFrameSet[enemyID] = spriteGetHitFrameSet[enemyID];
                characterState[enemyID] = "get hit";
                nextFramePlayer(enemyID);

                //Effect :
                createNewEffect(
                  1,
                  characterX[enemyID] + 32*characterFaceDirection[enemyID],
                  characterY[enemyID] - 16,
                  characterFaceDirection[enemyID],
                  characterDrawDepth[enemyID] + 1 
                );
                createNewDamageText(damage,characterX[enemyID],characterY[enemyID],false);

                // Sound :
                var audio = new Audio('sounds/hit_dagger.wav');
                audio.volume = 0.3;
                audio.play();
              }

              if (finish) {
                characterStateStep[charID] = 3;
                characterXMove[charID] = characterXStart[charID];
                characterYMove[charID] = characterYStart[charID];

                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);
              }
              break;
            case 3:
              // Moving to starting position
              testBox.innerText = "state step : " + characterStateStep[charID];
              var reach = subStateMoveToTarget(charID, 90);
              if (reach) {
                characterStateStep[charID] = -1;
                characterFaceDirection[charID] *= -1; // flip face dir
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                battleTurnPhase = 2;
              }
              break;
          }
          break;
        case "attack - 2":
          switch (characterStateStep[charID]) {
            case 0:
              // Considering attack :
              if (consideringAttack(charID)) {
                characterStateStep[charID] = 1;
                characterAttackTargetID[charID] =
                  getAttackedTargetNormal(charID);
                var targetPosition = getBehindPosition(
                  characterAttackTargetID[charID]
                );
                characterXMove[charID] = targetPosition.positionX;
                characterYMove[charID] = targetPosition.positionY;
                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);
                // Sound :
                var audio = new Audio('sounds/quick_move.wav');
                audio.volume = 0.3;
                audio.play();
              } else {
                characterStateStep[charID] = -1;
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                // .... EFFECT DEFFEND!
              }
              break;
            case 1:
              // Moving to target
              var reach = subStateMoveToTarget(charID, 90);
              if (reach) {
                characterFaceDirection[charID] *= -1;
                characterStateStep[charID] = 2;
                characterAlarm1Tick[charID] = 2;
                characterSpriteSheet[charID].src = spriteAttack[charID];
                characterSpriteFrameSet[charID] = spriteAttackFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);

                // Sound :
                var audio = new Audio('sounds/attack_dagger.wav');
                audio.volume = 0.3;
                audio.play();
                // Sound :
                var audio = new Audio(characterSoundGetHit[enemyID]);
                audio.volume = 0.3;
                audio.play();
              }
              break;
            case 2:
              // Attacking
              var finish = subStateAttackPerform(charID);

              if (characterAlarm1Tick[charID] > 0) {
                characterAlarm1Tick[charID] -= 1;
              } else if (characterAlarm1Tick[charID] == 0) {
                characterAlarm1Tick[charID] = -1;

                // Damage :
                var damage = damageCalculation(charID);

                // Trigger enemy getting hit :
                var enemyID = characterAttackTargetID[charID];
                characterAlarm1Tick[enemyID] = 8;
                characterSpriteSheet[enemyID].src = spriteGetHit[enemyID];
                characterSpriteFrameSet[enemyID] = spriteGetHitFrameSet[enemyID];
                characterState[enemyID] = "get hit";
                nextFramePlayer(enemyID);

                //Effect :
                createNewEffect(
                  1,
                  characterX[enemyID] + 32*characterFaceDirection[enemyID],
                  characterY[enemyID] - 16,
                  characterFaceDirection[enemyID],
                  characterDrawDepth[enemyID] + 1 
                );
                createNewDamageText(damage,characterX[enemyID],characterY[enemyID],false);

                // Sound :
                var audio = new Audio('sounds/hit_dagger.wav');
                audio.volume = 0.3;
                audio.play();
              }

              if (finish) {
                characterStateStep[charID] = 3;
                characterXMove[charID] = characterXStart[charID];
                characterYMove[charID] = characterYStart[charID];

                characterSpriteSheet[charID].src = spriteMove[charID];
                characterSpriteFrameSet[charID] = spriteMoveFrameSet[charID];
                characterFrameIndex[charID] = -1;
                nextFramePlayer(charID);
              }
              break;
            case 3:
              // Moving to starting position
              testBox.innerText = "state step : " + characterStateStep[charID];
              var reach = subStateMoveToTarget(charID, 90);
              if (reach) {
                characterStateStep[charID] = -1;
                characterFaceDirection[charID] *= -1; // flip face dir
                characterSpriteSheet[charID].src = spriteStand[charID];
                characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
                characterState[charID] = "stand";
                nextFramePlayer(charID);
                battleTurnPhase = 2;
              }
              break;
          }
          break;
      }
    }
  }
}

// Draw System
function drawGame() {
  // Update DEPTH :
  updateCharacterDepthFromY();

  // Clear canvas :
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background :
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Draw all shadow :
  for (let char = 0; char < characterActive.length; char++) {
    if (characterActive[char]) {
      drawCharacterShadow(char);
    }
  }

  // Draw depth by depth :
  for (let depthNum = 0; depthNum <= 60; depthNum++) {
    for (let effect = 0; effect < effectTotalNumber; effect++) {
      if (effectActive[effect]) {
        if (effectDepth[effect] == depthNum) {
          drawEffect(effect);
        }
      }
    }
    for (let char = 0; char < characterActive.length; char++) {
      if (characterActive[char]) {
        if (characterDrawDepth[char] == depthNum) {
          drawCharacter(char);
        }
      }
    }
  }

  // Draw damage text :
  drawDamageText();
  
}

// Lắng nghe sự kiện click chuột trái trên canvas
// canvas.addEventListener('click', function(event) {
//   // Lấy tọa độ chuột trong canvas
//   const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//   const mouseY = event.clientY - canvas.getBoundingClientRect().top;

//   // Kiểm tra xem tọa độ chuột có nằm trong hình vuông hay không
//   if (
//     mouseX >= characterHitboxX[0] &&
//     mouseX <= characterHitboxX[0] + characterHitboxWidth &&
//     mouseY >= characterHitboxY[0] &&
//     mouseY <= characterHitboxY[0] + characterHitboxHeight
//   ) {
//     characterSpriteSheet[0].src = spriteMove[0];
//     characterSpriteFrameSet[0] = spriteMoveFrameSet[0];
//     characterState[0] = "move to target";
//     characterFrameIndex[0] = -1;
//   }
// });
canvas.addEventListener("click", function (event) {
  // Lấy tọa độ chuột trong canvas
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  characterXMove[0] = mouseX;
  characterYMove[0] = mouseY;
  characterSpriteSheet[0].src = spriteMove[0];
  characterSpriteFrameSet[0] = spriteMoveFrameSet[0];
  characterState[0] = "move to target";
  characterFrameIndex[0] = -1;
});

// Lắng nghe sự kiện keydown trên document
document.addEventListener("keydown", function (event) {
  // Kiểm tra nếu phím bấm là phím Space (keyCode = 32)
  if (event.key === " ") {
    battleTurn = 0;
    battleTurnPhase = 0;
    // Sound :
    BGMusic.play();
    BGMusic.loop = true;
  }
  if (event.key === "a") {
    characterStateStep[1] = 0;
    characterState[1] = "attack - normal";
  }
});

//-------------- DRAWING FUNCTIONS --------------//

//-- Draw a single character :
function drawCharacter(charID) {
  // Draw hitbox
  if (characterDrawHitbox[charID]) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      characterHitboxX[charID],
      characterHitboxY[charID],
      characterHitboxWidth,
      characterHitboxHeight
    );
  }

  // Draw character
  characterOriginX[charID] = characterX[charID] - frameWidth / 2;
  characterOriginY[charID] = characterY[charID] - frameHeight / 2;
  var originX = -characterOriginX[charID] - frameWidth;
  var originY = characterOriginY[charID];
  if (characterFaceDirection[charID] == -1) {
    originX = characterOriginX[charID];
  }

  const subImg = characterImageIndex[charID] * frameWidth;
  if (characterFaceDirection[charID] == 1) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    characterSpriteSheet[charID],
    subImg,
    0,
    frameWidth,
    frameHeight,
    originX,
    originY,
    frameWidth,
    frameHeight
  );
  if (characterFaceDirection[charID] == 1) {
    ctx.scale(-1, 1);
  }

  // Draw origin spot
  // ctx.beginPath();
  // ctx.arc(characterX[0], characterY[0], 2, 0, Math.PI * 2);
  // ctx.fillStyle = "red"; // Color of the circle
  // ctx.fill();
  // ctx.closePath();
}

//-- Draw a character shadow :
function drawCharacterShadow(charID) {
  switch (characterShadowSize[charID]) {
    case 0:
      characterOriginX[charID] = characterX[charID] - frameWidth / 2;
      characterOriginY[charID] = characterY[charID] - frameHeight / 2;
      var originX = -characterOriginX[charID] - frameWidth;
      var originY = characterOriginY[charID];
      if (characterFaceDirection[charID] == -1) {
        originX = characterOriginX[charID];
      }
      if (characterFaceDirection[charID] == 1) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(
        shadowImageMedium,
        0,
        0,
        frameWidth,
        frameHeight,
        originX,
        originY,
        frameWidth,
        frameHeight
      );
      if (characterFaceDirection[charID] == 1) {
        ctx.scale(-1, 1);
      }
      break;

    default:
      break;
  }
}

//-- Draw an effect :
function drawEffect(effectID) {
  effectOriginX[effectID] = effectX[effectID] - effectSpriteFrameSize[effectID] / 2;
  effectOriginY[effectID] = effectY[effectID] - effectSpriteFrameSize[effectID] / 2;
  var originX = -effectOriginX[effectID] - effectSpriteFrameSize[effectID];
  var originY = effectOriginY[effectID];
  if (effectFaceDirection[effectID] == -1) {
    originX = effectOriginX[effectID];
  }

  const subImg = effectImageIndex[effectID] * effectSpriteFrameSize[effectID];
  if (effectFaceDirection[effectID] == 1) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    effectSpriteSheet[effectID],
    subImg,
    0,
    effectSpriteFrameSize[effectID],
    effectSpriteFrameSize[effectID],
    originX,
    originY,
    frameWidth,
    frameHeight
  );
  if (effectFaceDirection[effectID] == 1) {
    ctx.scale(-1, 1);
  }
}

function drawDamageText() {
  for (let keyname in damageText) {
    // Thiết lập các thông số của mỗi damageText :
    var damageNumber = damageText[keyname].damageNumber;
    var positionX = damageText[keyname].positionX;
    var positionY = damageText[keyname].positionY;
    var critical = damageText[keyname].critical;
    var vspeed = damageText[keyname].vspeed;
    var alpha = damageText[keyname].alpha;
    
    // Thiết lập font và thuộc tính vẽ chữ
    const fontSize = 500;
    ctx.font = `bold 50px 'Kanit', sans-serif`;
    ctx.textAlign = "center";

    // Tạo gradient fill style từ vàng sang cam
    const gradient = ctx.createLinearGradient(
      positionX - 50,
      positionY - 50,
      positionX + 70,
      positionY + 50
    );
    gradient.addColorStop(0, "yellow"); // Màu vàng ở đầu
    gradient.addColorStop(1, "red"); // Màu cam ở cuối

    // Đặt màu fillStyle và strokeStyle
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "black";

    // Vẽ đoạn chữ với gradient màu, border và alpha
    const text = "-" + damageNumber;
    const x = positionX;
    const y = positionY;

    // Lưu lại trạng thái ctx
    ctx.save();

    // Đặt độ trong suốt cho đoạn chữ
    ctx.globalAlpha = alpha;

    // Vẽ border và đoạn chữ với độ trong suốt đã đặt
    ctx.lineWidth = 7; // Độ rộng của border
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    // Khôi phục trạng thái ctx ban đầu
    ctx.restore();
  }
}

//-------------- BATTLE FUNCTIONS --------------//
//-- Setup Battle :
function setupBattle() {
  battleTurn = -1;
  battleTurnPhase = -1;
  battleCharacter = [];
  for (var char = 0; char < characterActive.length; char++) {
    if (characterActive[char]) {
      battleCharacter.push(char);
    }
  }
  
  battleCharacterSequence = [];
  var charArray = battleCharacter;
  // Lượt lượt tìm ra nhân vật có spd cao hơn theo các element, rồi add vào array battleCharacterSequence:
  while (charArray.length > 1) {
    var picked = 0;
    var maxSpd = characterSPD[charArray[picked]];
    for (var element = 0; element < charArray.length; element++) {
      var charID = charArray[element];
      if (characterSPD[charID] > maxSpd) {
        maxSpd = characterSPD[charID];
        picked = element;
      }
    }
    battleCharacterSequence.push(charArray[picked]);
    charArray.splice(picked,1); // vì nhân vật đã được pick vào sequence nên sẽ cần xóa bỏ nó khỏi array.
  }
  battleCharacterSequence.push(charArray[0]); // Add vào element cuối cùng của array
  

  battleTurnCurrentCharacter = battleCharacterSequence[0];
  console.log("battle consequence : ");
  console.log(battleCharacterSequence);
}
//-- Battle Step System :
function battleStep() {
  switch (battleTurnPhase) {
    case 0:
      // Start the turn of a character :
      console.log("Turn of CharID : "+battleTurnCurrentCharacter);
      var currentChar = battleTurnCurrentCharacter;
      if (characterState[currentChar] == "stand") {
        characterStateStep[currentChar] = 0;
        CharacterSkillSet(currentChar);
        characterFrameIndex[currentChar] = -1;
        battleTurnPhase = 1;
      }
      break;
    case 1:
        // During attacking phase :
        // (Drawing skill name)
        break;
    case 2:
        // Ending of attacking phase :
        var currentSlot = battleCharacterSequence.indexOf(battleTurnCurrentCharacter);
        battleTurnCurrentCharacter = getNextElementOfArray(currentSlot,battleCharacterSequence);
        console.log("Change from "+currentSlot+" to "+battleTurnCurrentCharacter);
        battleTurnPhase = 0;
        break;
  }
}

function CharacterSkillSet(charID) {
  switch (characterClass[charID]) {
    case 1:
      characterState[charID] = "attack - 1";
      break;
  
    default:
      characterState[charID] = "attack - normal";
      break;
  }
}


//-------------- SUPPORTIVE FUNCTIONS --------------//

function setSpriteWithClassID(charID, classID) {
  characterClass[charID] = classID;
  spriteStand[charID] = spritePack[classID].stand;
  spriteStandFrameSet[charID] = spritePack[classID].standFrameSet;
  spriteMove[charID] = spritePack[classID].move;
  spriteMoveFrameSet[charID] = spritePack[classID].moveFrameSet;
  spriteAttack[charID] = spritePack[classID].attack;
  spriteAttackFrameSet[charID] = spritePack[classID].attackFrameSet;
  spriteGetHit[charID] = spritePack[classID].getHit;
  spriteGetHitFrameSet[charID] = spritePack[classID].getHitFrameSet;
  spriteFainted[charID] = spritePack[classID].fainted;
  spriteFaintedFrameSet[charID] = spritePack[classID].faintedFrameSet;
}

function setSoundWithID(charID, classID) {
  characterSoundStart[charID] = 'sounds/class_'+classID+'_start.wav';
  characterSoundAttack[charID] = 'sounds/class_'+classID+'_attack.wav';
  characterSoundGetHit[charID] = 'sounds/class_'+classID+'_gethit.wav';
  console.log(characterSoundGetHit[charID]);
}

function setBasicEffectOfCharacter(charID, effectID) {
  characterEffectAttackBasic[charID] = effectID;
}

function createCharacterBase(charID, faceDirection, XStart, YStart) {
  characterActive[charID] = true;
  characterState[charID] = "stand";
  characterStateStep[charID] = 0;
  characterSpriteSheet[charID] = new Image();
  characterSpriteSheet[charID].src = spriteStand[charID];
  characterSpriteFrameSet[charID] = spriteStandFrameSet[charID];
  characterFrameIndex[charID] = 0;
  characterImageIndex[charID] = 0;
  characterXStart[charID] = XStart;
  characterYStart[charID] = YStart;
  characterX[charID] = characterXStart[charID];
  characterY[charID] = characterYStart[charID];
  characterXMove[charID] = characterXStart[charID];
  characterYMove[charID] = characterYStart[charID];
  characterHSpeed[charID] = 0;
  characterVSpeed[charID] = 0;
  characterImageSpeed[charID] = 1;
  characterFaceDirection[charID] = faceDirection;
  characterOriginX[charID] = characterX[charID] - frameWidth / 2;
  characterOriginY[charID] = characterY[charID] - frameHeight / 2;
  characterDrawHitbox[charID] = false;
  characterDrawDepth[charID] = 0;
  characterShadowSize[charID] = 0;
  characterHitboxX[charID] = characterX[charID] - characterHitboxWidth / 2;
  characterHitboxY[charID] = characterY[charID] - characterHitboxHeight / 2;
  characterAttackTargetID[charID] = -1;
  characterAlarm1Tick[charID] = -1;

  characterSoundStart[charID] = 'sounds/_none.wav';
  characterSoundAttack[charID] = 'sounds/_none.wav';
  characterSoundGetHit[charID] = 'sounds/_none.wav';

  characterEffectAttackBasic[charID] = 0;
}

//-- Damage Text : Create new 
function createNewDamageText(damageNumber, positionX, positionY, critical) {
  // Find a new name :
  var number = 0;
  var newDamageTextName = "damage-text-"+number;
  while (damageText.hasOwnProperty(newDamageTextName)) {
    number++;
    newDamageTextName = "damage-text-"+number;
  }
  // New object :
  var newDamageTextObject = {
    damageNumber : damageNumber,
    positionX : positionX,
    positionY : positionY,
    critical : critical,
    vspeed : -10,
    alpha : 1
  };
  // Push the object as a key :
  damageText[newDamageTextName] = newDamageTextObject;
  return(newDamageTextName);
}

//-- Damage Text : Step
function damageTextStep() {
  for (let keyname in damageText) {
    var dmgTextName = keyname;
    var damageNumber = damageText[keyname].damageNumber;
    var positionX = damageText[keyname].positionX;
    var positionY = damageText[keyname].positionY;
    var critical = damageText[keyname].critical;
    var vspeed = damageText[keyname].vspeed;
    var alpha = damageText[keyname].alpha;

    // Gravity :
    var gravity = 3;
    positionY += vspeed;
    vspeed += gravity;

    // Decrease alpha :
    var alphaSpeed = 0.08;
    if (alpha - alphaSpeed > 0.4) {
      alpha -= alphaSpeed;
    } else {
      alpha = 0;
      delete damageText[keyname];
      return;
    }

    // Repack the object :
    var repackedObject = {
      damageNumber : damageNumber,
      positionX : positionX,
      positionY : positionY,
      critical : critical,
      vspeed : vspeed,
      alpha : alpha
    };
    // Reset data in object :
    damageText[dmgTextName] = repackedObject;
  }
}

function createAllEffects(totalNumber) {
  for (let effectID = 0; effectID < totalNumber; effectID++) {
    effectActive[effectID] = false;
  }
}

//-- Get the first effect slot which is currently inactive
function findSlotEffect() {
  for (let effectID = 0; effectID < effectTotalNumber; effectID++) {
    if (!effectActive[effectID]) {
      return effectID;
    }
  }
}

function removeEffect(effectID) {
  effectActive[effectID] = false;
}

function createNewEffect(spriteID,positionX,positionY,faceDirection,depth) {
  var effectID = findSlotEffect();
  effectActive[effectID] = true;
  effectSpriteSheet[effectID] = new Image();
  effectSpriteSheet[effectID].src = effectPack[spriteID].image;
  effectSpriteFrameNumber[effectID] = effectPack[spriteID].frameNumber;
  effectSpriteFrameSize[effectID] = effectPack[spriteID].imageSize;
  effectImageIndex[effectID] = 0;
  effectX[effectID] = positionX;
  effectY[effectID] = positionY;
  effectFaceDirection[effectID] = faceDirection;
  effectOriginX[effectID] = effectX[effectID] - effectSpriteFrameSize[effectID] / 2;
  effectOriginY[effectID] = effectY[effectID] - effectSpriteFrameSize[effectID] / 2;
  effectDepth[effectID] = depth;
}

function setupCharacterInfo(charID, partySide, HPMax, HPCur, MPMax, MPCur) {
  characterParty[charID] = partySide;
  characterHPMax[charID] = HPMax;
  characterHP[charID] = HPCur;
  characterMPMax[charID] = MPMax;
  characterMP[charID] = MPCur;
}

function setupCharacterStat(charID, tendency, ATK, DEF, MAG, SPD) {
  characterTendency[charID] = tendency;
  characterATK[charID] = ATK;
  characterDEF[charID] = DEF;
  characterMAG[charID] = MAG;
  characterSPD[charID] = SPD;
}

//-- Auto frame function (character) :
function nextFramePlayer(playerID) {
  if (characterImageSpeed[playerID] > 0) {
    const frameMax = characterSpriteFrameSet[playerID].length - 1;
    if (characterFrameIndex[playerID] < frameMax) {
      characterFrameIndex[playerID]++;
    } else {
      characterFrameIndex[playerID] = 0;
    }
    characterImageIndex[playerID] =
      characterSpriteFrameSet[playerID][characterFrameIndex[playerID]];
  }
}

function nextFrameEffect(effectID) {
  var finish = false;
  const frameMax = effectSpriteFrameNumber[effectID] - 1;
  if (effectImageIndex[effectID] < frameMax) {
    effectImageIndex[effectID]++;
  } else {
    effectImageIndex[effectID] = 0;
    finish = true;
  }
  return finish;
}

//-- Move to a point (PRO) :
function moveToPoint(charID, xTar, yTar, spdRate, reachingRange) {
  var reachPoint = false;
  var horiz = Math.abs(xTar - characterX[charID]); // khoảng cách ngang
  var verti = Math.abs(yTar - characterY[charID]); // khoảng cách dọc
  var total = verti + horiz;
  verti = verti / total;
  horiz = horiz / total;

  var vspDirection = 1;
  var hspDirection = 1;
  if (characterX[charID] > xTar) {
    hspDirection = -1;
  }
  if (characterY[charID] > yTar) {
    vspDirection = -1;
  }

  if (
    distanceTwoPoints(characterX[charID], characterY[charID], xTar, yTar) <=
    reachingRange
  ) {
    reachPoint = true;
    characterX[charID] = xTar;
    characterY[charID] = yTar;
  } else {
    // Move :
    characterHSpeed[charID] = hspDirection * horiz * spdRate; // chiều ngang
    characterVSpeed[charID] = vspDirection * verti * spdRate; // chiều dọc
    characterX[charID] += characterHSpeed[charID];
    characterY[charID] += characterVSpeed[charID];
    // Face direction :
    if (characterHSpeed[charID] > 0) {
      characterFaceDirection[charID] = 1;
    } else if (characterHSpeed[charID] < 0) {
      characterFaceDirection[charID] = -1;
    }
  }
  return reachPoint;
}

//-- Get distance between 2 points :
function distanceTwoPoints(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

//-- Get Depth from Y position :
function updateCharacterDepthFromY() {
  for (let charID = 0; charID < characterActive.length; charID++) {
    if (characterActive[charID]) {
      characterDrawDepth[charID] = Math.floor(characterY[charID] / 10);
    }
  }
}

//-- Sub-state Move to a target :
function subStateMoveToTarget(charID, moveSpeed) {
  nextFramePlayer(charID);
  var reachTarget = moveToPoint(
    charID,
    characterXMove[charID],
    characterYMove[charID],
    moveSpeed,
    moveSpeed
  );
  return reachTarget;
}

//-- Consider attacking or not (Normal) :
function damageCalculation(charID) {
  // TEST :
  var result = randomRangeInteger(80,120);
  return(result);
}

//-- Consider attacking or not (Normal) :
function consideringAttack(charID) {
  var decision = true;
  var tendencyPoint = characterTendency[charID];
  var mpRate = (characterMP[charID] / characterMPMax[charID]) * 100;
  if (mpRate < 60) {
    // If MP < 60% , considering pass the turn to restore MP.
    if (randomRange(0, 100) <= tendencyPoint) {
      decision = false;
    }
  }
  return decision;
}

//-- Get all enemies as an array :
function getEnemyArray(charID) {
  var enemyArray = [];
  for (let enemyID = 0; enemyID < characterActive.length; enemyID++) {
    if (
      characterActive[enemyID] &&
      characterParty[enemyID] != characterParty[charID]
    ) {
      enemyArray.push(enemyID);
    }
  }
  return enemyArray;
}

//-- Select a target for attacking (Normal) :
function getAttackedTargetNormal(charID) {
  var result = -1;
  var enemyArray = getEnemyArray(charID);
  if (enemyArray.length > 0) {
    result = randomSlotArray(enemyArray);
  }
  return result;
}

//-- Select a target for attacking (Pick the lowest HP) :
function getAttackedTargetLowestHP(charID) {
  var result = -1;
  var enemyArray = getEnemyArray(charID);
  if (enemyArray.length > 0) {
    var lowestHP = characterHP[enemyArray[0]];
    for (let enemyID = 0; enemyID < enemyArray.length; enemyID++) {
      if (characterHP[enemyArray[enemyID]] < lowestHP) {
        lowestHP = characterHP[enemyArray[enemyID]];
        result = enemyArray[enemyID];
      }
    }
  }
  return result;
}

//-- Select a target for attacking (Pick the largest HP) :
function getAttackedTargetLargestHP(charID) {
  var result = -1;
  var enemyArray = getEnemyArray(charID);
  if (enemyArray.length > 0) {
    var LargestHP = characterHP[enemyArray[0]];
    for (let enemyID = 0; enemyID < enemyArray.length; enemyID++) {
      if (characterHP[enemyArray[enemyID]] > LargestHP) {
        LargestHP = characterHP[enemyArray[enemyID]];
        result = enemyArray[enemyID];
      }
    }
  }
  return result;
}

//-- Get front position to attack target :
function getFrontPosition(charTarget) {
  var positionX = 0;
  var positionY = 0;

  switch (characterParty[charTarget]) {
    case 0:
      positionX = characterX[charTarget] + 64;
      positionY = characterY[charTarget];
      break;
    case 1:
      positionX = characterX[charTarget] - 64;
      positionY = characterY[charTarget];
      break;
  }

  return { positionX, positionY };
}

//-- Get behind position to attack target :
function getBehindPosition(charTarget) {
  var positionX = 0;
  var positionY = 0;

  switch (characterParty[charTarget]) {
    case 0:
      positionX = characterX[charTarget] - 48;
      positionY = characterY[charTarget];
      break;
    case 1:
      positionX = characterX[charTarget] + 48;
      positionY = characterY[charTarget];
      break;
  }

  return { positionX, positionY };
}

//-- Sub-state Move to a target :
function subStateAttackPerform(charID) {
  var finish = false;
  const frameMax = characterSpriteFrameSet[charID].length - 1;
  if (characterFrameIndex[charID] < frameMax) {
    nextFramePlayer(charID);
  } else {
    finish = true;
  }
  return finish;
}

//-- Random slot of array :
function randomSlotArray(inputArray) {
  var pickedSlot = Math.round(Math.random() * (inputArray.length-1));
  var resultSlot = inputArray[pickedSlot];
  return resultSlot;
}

//-- Random Range :
function randomRange(r1, r2) {
  if (r1 < r2) {
    if (r1 > 0 && r2 > 0) {
      var result = r1 + Math.random() * (r2-r1);
    } else if (r1 < 0 && r2 < 0) {
      var result = r1 - Math.random() * r2;
    } else if (r1 < 0 && r2 > 0) {
      var result = r1 + Math.random() * (-r1+r2);
    }
  } else {
    if (r2 > 0 && r1 > 0) {
      var result = r2 + Math.random() * (r1-r2);
    } else if (r2 < 0 && r1 < 0) {
      var result = r2 - Math.random() * r1;
    } else if (r2 < 0 && r1 > 0) {
      var result = r2 + Math.random() * (-r2+r1);
    }
  }
  return result;
}

//-- Random Range Integer :
function randomRangeInteger(r1, r2) {
  if (r1 < r2) {
    if (r1 > 0 && r2 > 0) {
      var result = r1 + Math.random() * (r2-r1);
    } else if (r1 < 0 && r2 < 0) {
      var result = r1 - Math.random() * r2;
    } else if (r1 < 0 && r2 > 0) {
      var result = r1 + Math.random() * (-r1+r2);
    }
  } else {
    if (r2 > 0 && r1 > 0) {
      var result = r2 + Math.random() * (r1-r2);
    } else if (r2 < 0 && r1 < 0) {
      var result = r2 - Math.random() * r1;
    } else if (r2 < 0 && r1 > 0) {
      var result = r2 + Math.random() * (-r2+r1);
    }
  }
  return Math.round(result);
}

//-- Get the next element of an array :
function getNextElementOfArray(currentElementSlot,inputArray) {
  if (currentElementSlot < inputArray.length - 1) {
    return (inputArray[currentElementSlot + 1]);
  } else {
    return (inputArray[0]);
  }
}


gameLoop();
