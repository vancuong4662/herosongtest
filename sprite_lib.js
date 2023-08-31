export const spritePack = [];
var _spriteName;
var _stand;
var _standFrameSet;
var _move;
var _moveFrameSet;
var _attack;
var _attackFrameSet;
var _getHit;
var _getHitFrameSet;
var _fainted;
var _faintedFrameSet;

function addToSpritePack() {
    var spriteObj = {
        spriteName: _spriteName,
        stand: _stand,
        standFrameSet: _standFrameSet,
        move: _move,
        moveFrameSet: _moveFrameSet,
        attack: _attack,
        attackFrameSet: _attackFrameSet,
        getHit: _getHit,
        getHitFrameSet: _getHitFrameSet,
        fainted: _fainted,
        faintedFrameSet: _faintedFrameSet,
    };
    spritePack.push(spriteObj);
}

export const effectPack = [];
var _effectName;
var _image;
var _imageSize;
var _frameNumber;

function addToEffectPack() {
    var spriteObj = {
        effectName: _effectName,
        image: _image,
        imageSize: _imageSize,
        frameNumber: _frameNumber
    };
    effectPack.push(spriteObj);
}

// ID : 0
_spriteName = "novice_1";
_stand =  "/char/" + _spriteName + "/stand.png";
_standFrameSet = [0,1,2,1];
_move =  "/char/" + _spriteName + "/move.png";
_moveFrameSet = [0,1,2,3];
_attack =  "/char/" + _spriteName + "/attack.png";
_attackFrameSet = [0,1,2,3,3];
_getHit =  "/char/" + _spriteName + "/gethit.png";
_getHitFrameSet = [0];
_fainted =  "/char/" + _spriteName + "/fainted.png";
_faintedFrameSet = [0];
addToSpritePack();

// ID : 1
_spriteName = "assassin";
_stand =  "/char/" + _spriteName + "/stand.png";
_standFrameSet = [0,1,2,1];
_move =  "/char/" + _spriteName + "/move.png";
_moveFrameSet = [0,1,2,3];
_attack =  "/char/" + _spriteName + "/attack.png";
_attackFrameSet = [0,1,2,3,3];
_getHit =  "/char/" + _spriteName + "/gethit.png";
_getHitFrameSet = [0];
_fainted =  "/char/" + _spriteName + "/fainted.png";
_faintedFrameSet = [0];
addToSpritePack();

// ID : 2
_spriteName = "crusader";
_stand =  "/char/" + _spriteName + "/stand.png";
_standFrameSet = [0,1,2,1];
_move =  "/char/" + _spriteName + "/move.png";
_moveFrameSet = [0,1,2,3];
_attack =  "/char/" + _spriteName + "/attack.png";
_attackFrameSet = [0,1,2,3,3];
_getHit =  "/char/" + _spriteName + "/gethit.png";
_getHitFrameSet = [0];
_fainted =  "/char/" + _spriteName + "/fainted.png";
_faintedFrameSet = [0];
addToSpritePack();


// ID : 3
_spriteName = "poring";
_stand =  "/enemies/" + _spriteName + "/stand.png";
_standFrameSet = [0,1,2,3];
_move =  "/enemies/" + _spriteName + "/move.png";
_moveFrameSet = [0,1,2,3];
_attack =  "/enemies/" + _spriteName + "/attack.png";
_attackFrameSet = [0,1,2,3,3];
_getHit =  "/enemies/" + _spriteName + "/gethit.png";
_getHitFrameSet = [0];
_fainted =  "/enemies/" + _spriteName + "/fainted.png";
_faintedFrameSet = [0];
addToSpritePack();

// ID : 4
_spriteName = "python";
_stand =  "/enemies/" + _spriteName + "/stand.png";
_standFrameSet = [0,1,2,3];
_move =  "/enemies/" + _spriteName + "/move.png";
_moveFrameSet = [0,1,2,3];
_attack =  "/enemies/" + _spriteName + "/attack.png";
_attackFrameSet = [0,1,2,2,3];
_getHit =  "/enemies/" + _spriteName + "/gethit.png";
_getHitFrameSet = [0];
_fainted =  "/enemies/" + _spriteName + "/fainted.png";
_faintedFrameSet = [0];
addToSpritePack();

//-------------------------------- EFFECT --------------------------------//

// // EFFECT ID : 0
_effectName = "effect_0";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 7;
addToEffectPack();

// // EFFECT ID : 1
_effectName = "effect_1";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 7;
addToEffectPack();

// // EFFECT ID : 2
_effectName = "effect_2";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 7;
addToEffectPack();

// // EFFECT ID : 3
_effectName = "effect_3";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 7;
addToEffectPack();

// // EFFECT ID : 4
_effectName = "effect_4";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 7;
addToEffectPack();

// // EFFECT ID : 5
_effectName = "effect_5";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 6
_effectName = "effect_6";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 7
_effectName = "effect_7";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 8
_effectName = "effect_8";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 9
_effectName = "effect_9";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 10
_effectName = "effect_10";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 11
_effectName = "effect_11";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 12
_effectName = "effect_12";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 13
_effectName = "effect_13";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 14
_effectName = "effect_14";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 32;
_frameNumber = 8;
addToEffectPack();

// // EFFECT ID : 15
_effectName = "effect_15";
_image =  "/effects/" + _effectName + ".png";
_imageSize = 192;
_frameNumber = 5;
addToEffectPack();