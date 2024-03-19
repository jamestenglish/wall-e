namespace SpriteKind {
    export const Track = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Battery = SpriteKind.create()
    export const Eve = SpriteKind.create()
}
function pageOneMoveLeft () {
    sprite_tmpWalle.sayText("")
    sprite_tmpEve.sayText("WALLLLL-EEEE?")
    animation.runImageAnimation(
    sprite_tmpWalle,
    assets.animation`walleLeft`,
    300,
    true
    )
    sprite_tmpWalle.vx = -50
    animation.runImageAnimation(
    sprite_tmpEve,
    assets.animation`eveLeft`,
    400,
    true
    )
    sprite_tmpEve.setFlag(SpriteFlag.Ghost, true)
    sprite_tmpEve.vx = -50
    timer.after(8000, function () {
        pageOneMoveRight()
    })
}
function getTilemapLocation (spriteIn: Sprite) {
    spriteInCol = (spriteIn.x - 8) / 16 - 0
    spriteInRow = (spriteIn.y - 8) / 16 - 0
    return tiles.getTileLocation(spriteInCol, spriteInRow)
}
function placeEve () {
    spriteEve = sprites.create(assets.image`eve`, SpriteKind.Eve)
    tiles.placeOnRandomTile(spriteEve, floorSprite)
    grid.snap(spriteEve, true)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    addTrail(spriteWalle, "up")
    moveWalle("up")
    previousDirection = "up"
})
function moveWalle (directionIn: string) {
    characterAnimations.setCharacterState(spriteWalle, characterAnimations.rule(getAnimationDirection(directionIn)))
    hasMoved = true
    batteryStatus.value += -3
    moveWalle_offset = directionOffets[directionStrings.indexOf(directionIn)]
    grid.move(spriteWalle, moveWalle_offset[0], moveWalle_offset[1])
    if (randint(0, 8) <= sprites.allOfKind(SpriteKind.Track).length) {
        moveMo(spriteMo, sprites.allOfKind(SpriteKind.Track), spriteWalle)
    }
}
function getAnimationDirection (directionIn: string) {
    if (directionIn == "left") {
        return Predicate.MovingLeft
    } else if (directionIn == "up") {
        return Predicate.MovingUp
    } else if (directionIn == "right") {
        return Predicate.MovingRight
    } else {
        return Predicate.MovingDown
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    pageNum += 1
    if (pageNum == 0) {
    	
    } else if (pageNum == 1) {
        tiles.setCurrentTilemap(tilemap`gridMap`)
    } else {
        startGamePlay()
    }
})
function pageOneMoveRight () {
    animation.runImageAnimation(
    sprite_tmpWalle,
    assets.animation`walleRight0`,
    300,
    true
    )
    sprite_tmpWalle.setStayInScreen(false)
    sprite_tmpWalle.setFlag(SpriteFlag.Ghost, true)
    sprite_tmpWalle.sayText("EEE-VVV-EEE??")
    grid.place(sprite_tmpWalle, tiles.getTileLocation(0, 1))
    sprite_tmpWalle.x += -16
    sprite_tmpWalle.vx = 50
    sprite_tmpEve = sprites.create(assets.image`walle`, SpriteKind.Projectile)
    animation.runImageAnimation(
    sprite_tmpEve,
    assets.animation`eveRight`,
    400,
    true
    )
    sprite_tmpEve.setFlag(SpriteFlag.Ghost, true)
    grid.place(sprite_tmpEve, tiles.getTileLocation(0, 1))
    sprite_tmpEve.x = -80
    sprite_tmpEve.vx = 50
    timer.after(7000, function () {
        pageOneMoveLeft()
    })
}
function getTrackSprite (previousDirectionIn: string, currentDirectionIn: string) {
    if (previousDirectionIn == "left") {
        if (currentDirectionIn == "left") {
            return sprites.create(assets.image`tracksL`, SpriteKind.Track)
        } else if (currentDirectionIn == "up") {
            return sprites.create(assets.image`tracksRtoU`, SpriteKind.Track)
        } else if (currentDirectionIn == "right") {
            return sprites.create(assets.image`tracksR`, SpriteKind.Track)
        } else {
            return sprites.create(assets.image`tracksRtoD`, SpriteKind.Track)
        }
    } else if (previousDirectionIn == "up") {
        if (currentDirectionIn == "left") {
            return sprites.create(assets.image`tracksDtoL`, SpriteKind.Track)
        } else if (currentDirectionIn == "up") {
            return sprites.create(assets.image`tracksU`, SpriteKind.Track)
        } else if (currentDirectionIn == "right") {
            return sprites.create(assets.image`tracksDtoR`, SpriteKind.Track)
        } else {
            return sprites.create(assets.image`tracksD`, SpriteKind.Track)
        }
    } else if (previousDirectionIn == "right") {
        if (currentDirectionIn == "left") {
            return sprites.create(assets.image`tracksL`, SpriteKind.Track)
        } else if (currentDirectionIn == "up") {
            return sprites.create(assets.image`tracksLtoU`, SpriteKind.Track)
        } else if (currentDirectionIn == "right") {
            return sprites.create(assets.image`tracksR`, SpriteKind.Track)
        } else {
            return sprites.create(assets.image`tracksLtoD`, SpriteKind.Track)
        }
    } else {
        if (currentDirectionIn == "left") {
            return sprites.create(assets.image`tracksUtoL`, SpriteKind.Track)
        } else if (currentDirectionIn == "up") {
            return sprites.create(assets.image`tracksU`, SpriteKind.Track)
        } else if (currentDirectionIn == "right") {
            return sprites.create(assets.image`tracksUtoR`, SpriteKind.Track)
        } else {
            return sprites.create(assets.image`tracksD`, SpriteKind.Track)
        }
    }
}
function placeBattery () {
    spriteBattery = sprites.create(assets.image`battery`, SpriteKind.Battery)
    tiles.placeOnRandomTile(spriteBattery, floorSprite)
    grid.snap(spriteBattery, true)
}
function moveMo (moIn: Sprite, trailsIn: Sprite[], walleIn: Sprite) {
    characterAnimations.setCharacterState(moIn, characterAnimations.rule(getAnimationDirection(getDirectionFromOffsets(moveMo_colRowOffsets))))
    if (isMoEnabled != 0) {
        moveMo_targets = trailsIn
        moveMo_targets.push(walleIn)
        moveMo_target = getClosestTarget(moIn, moveMo_targets)
        moveMo_colRowOffsets = getColRowOffsets(moIn, moveMo_target)
        grid.move(moIn, moveMo_colRowOffsets[0], moveMo_colRowOffsets[1])
        previousMoDirection += getDirectionFromOffsets(moveMo_colRowOffsets)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    addTrail(spriteWalle, "left")
    moveWalle("left")
    previousDirection = "left"
})
function pageZero () {
    scene.setBackgroundColor(14)
    sprite_tmpWalle = sprites.create(assets.image`walle`, SpriteKind.Projectile)
    sprite_tmpWalle.sx = 2
    sprite_tmpWalle.sy = 2
    animation.runImageAnimation(
    sprite_tmpWalle,
    assets.animation`walleRight0`,
    300,
    true
    )
    sprite_tmpWalle.sayText("EEE-VVV-EEE??")
    textSprite = textsprite.create("help wall-e find eve")
    textSprite.setPosition(70, 91)
    spriteButton = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Projectile)
    spriteButton.setPosition(140, 101)
    spriteButton.sx = 0.5
    spriteButton.sy = 0.5
    animation.runImageAnimation(
    spriteButton,
    assets.animation`button`,
    500,
    true
    )
}
function eveTmp () {
    tiles.placeOnRandomTile(spriteEve, floorSprite)
    grid.snap(spriteBattery, true)
    grid.snap(spriteEve, true)
    // DEBUG
    grid.place(spriteEve, getTilemapLocation(spriteEve))
}
function pageNegOne () {
    tiles.setCurrentTilemap(tilemap`gridMap`)
    sprite_tmpWalle = sprites.create(assets.image`walle`, SpriteKind.Projectile)
    timer.background(function () {
        pageOneMoveRight()
    })
    textSprite2 = textsprite.create("start")
    grid.place(textSprite2, tiles.getTileLocation(3, 3))
    textSprite3 = textsprite.create("difficulty: easy")
    grid.place(textSprite3, tiles.getTileLocation(5, 4))
    textSprite4 = textsprite.create("batteries: on")
    grid.place(textSprite4, tiles.getTileLocation(4, 5))
    textSprite4.x += 8
}
function getDirectionFromOffsets (offsetsIn: number[]) {
    console.logValue("offsetsIn", offsetsIn)
    if (offsetsIn[0] == 1) {
        return "right"
    } else if (offsetsIn[0] == -1) {
        return "left"
    } else if (offsetsIn[1] == -1) {
        return "up"
    } else {
        return "down"
    }
}
statusbars.onZero(StatusBarKind.Health, function (status) {
    if (isBatteryEnabled != 0) {
        game.gameOver(false)
    }
})
function getPreviousDirection (currentDirection: string) {
    if (previousDirection == "") {
        return currentDirection
    }
    return previousDirection
}
function startGamePlay () {
    floorSprite = assets.tile`floorLight2`
    hasMoved = false
    tiles.setCurrentTilemap(tilemap`level`)
    spriteWalle = sprites.create(assets.image`walle`, SpriteKind.Player)
    spriteMo = sprites.create(assets.image`myImage`, SpriteKind.Enemy)
    spriteDebug = sprites.create(assets.image`debug`, SpriteKind.Debug)
    tiles.placeOnRandomTile(spriteWalle, floorSprite)
    tiles.placeOnRandomTile(spriteMo, floorSprite)
    tiles.placeOnRandomTile(spriteDebug, floorSprite)
    spriteWalle.z = 10
    spriteMo.z = 11
    placeEve()
    placeBattery()
    scene.cameraFollowSprite(spriteWalle)
    batteryStatus = statusbars.create(20, 2, StatusBarKind.Health)
    batteryStatus.attachToSprite(spriteWalle)
    directionStrings = [
    "up",
    "down",
    "left",
    "right"
    ]
    directionOffets = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0]
    ]
    previousDirection = ""
    previousMoDirection = ""
    isMoEnabled = 1
    isBatteryEnabled = 0
    isMoEndEnabled = 0
    setupCharacterAnimations()
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    addTrail(spriteWalle, "right")
    moveWalle("right")
    previousDirection = "right"
})
function getClosestIndex (spriteIn: Sprite, otherSpritesIn: any[]) {
    getClosestIndex_distances = getDistances(spriteIn, otherSpritesIn)
    // index 0 is distance
    // index 1 is the index
    getClosestIndex_meta = [9999, 0]
    for (let getClosestIndex_index = 0; getClosestIndex_index <= getClosestIndex_distances.length; getClosestIndex_index++) {
        getClosestIndex_distance = getClosestIndex_distances[getClosestIndex_index]
        if (getClosestIndex_distance <= getClosestIndex_meta[0]) {
            getClosestIndex_meta[0] = getClosestIndex_distance
            getClosestIndex_meta[1] = getClosestIndex_index
        }
    }
    return getClosestIndex_meta[1]
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    if (isMoEndEnabled != 0) {
        game.gameOver(false)
    }
})
function getColRowDifference (spriteAIn: Sprite, spriteBIn: Sprite) {
    getColRowDifference_spriteALocation = getTilemapLocation(spriteAIn)
    getColRowDifference_spriteBLocation = getTilemapLocation(spriteBIn)
    getColRowDifference_colRowResult = []
    getColRowDifference_colRowResult.push(getColRowDifference_spriteALocation.column - getColRowDifference_spriteBLocation.column)
    getColRowDifference_colRowResult.push(getColRowDifference_spriteALocation.row - getColRowDifference_spriteBLocation.row)
    return getColRowDifference_colRowResult
}
function getClosestTarget (spriteIn: Sprite, targetsIn: Sprite[]) {
    getClosestTarget_closestIndex = getClosestIndex(spriteIn, targetsIn)
    // DEBUG
    grid.place(spriteDebug, getTilemapLocation(targetsIn[getClosestTarget_closestIndex]))
    return targetsIn[getClosestTarget_closestIndex]
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    addTrail(spriteWalle, "down")
    moveWalle("down")
    previousDirection = "down"
})
function updatePreviousDirection (currentDirection: string) {
    previousDirection = currentDirection
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Battery, function (sprite, otherSprite) {
    console.logValue("playerOverlapFood!!!!!", otherSprite)
    console.logValue("manual overlap-------", 0)
    batteryStatus.value = 100
    sprites.destroy(otherSprite)
    placeBattery()
})
function getDistances (spriteIn: Sprite, otherSpritesIn: Sprite[]) {
    getDistances_distances = []
    for (let otherSprite of otherSpritesIn) {
        getDistances_xDiff = Math.abs(spriteIn.x - otherSprite.x)
        getDistances_yDiff = Math.abs(spriteIn.y - otherSprite.y)
        getDistances_distance = Math.sqrt(getDistances_xDiff ** 2 + getDistances_yDiff ** 2)
        getDistances_distances.push(getDistances_distance)
    }
    return getDistances_distances
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Eve, function (sprite, otherSprite) {
    console.logValue("eveOverlap!!!!!", otherSprite)
    game.gameOver(true)
})
function setupCharacterAnimations () {
    characterAnimations.setCharacterState(spriteWalle, characterAnimations.rule(Predicate.NotMoving))
    characterAnimations.loopFrames(
    spriteWalle,
    assets.animation`walleStill`,
    300,
    characterAnimations.rule(Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    spriteWalle,
    assets.animation`walleRight0`,
    300,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    spriteWalle,
    assets.animation`walleRight0`,
    300,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    spriteWalle,
    assets.animation`walleLeft`,
    300,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    spriteWalle,
    assets.animation`walleLeft`,
    300,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.setCharacterState(spriteMo, characterAnimations.rule(Predicate.NotMoving))
    characterAnimations.loopFrames(
    spriteMo,
    assets.animation`moRight`,
    200,
    characterAnimations.rule(Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    spriteMo,
    assets.animation`moRight`,
    200,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    spriteMo,
    assets.animation`moRight`,
    200,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    spriteMo,
    assets.animation`moLeft`,
    200,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    spriteMo,
    assets.animation`moLeft`,
    200,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.setCharacterState(spriteEve, characterAnimations.rule(Predicate.NotMoving))
    characterAnimations.loopFrames(
    spriteEve,
    assets.animation`eveRight`,
    400,
    characterAnimations.rule(Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    spriteEve,
    assets.animation`eveRight`,
    400,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    spriteEve,
    assets.animation`eveRight`,
    400,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    spriteEve,
    assets.animation`eveLeft`,
    400,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    spriteEve,
    assets.animation`eveLeft`,
    400,
    characterAnimations.rule(Predicate.MovingDown)
    )
}
function addTrail (walleIn: Sprite, directionIn: string) {
    getTilemapLocation(walleIn)
    grid.place(getTrackSprite(getPreviousDirection(directionIn), directionIn), getTilemapLocation(walleIn))
    return 0
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Track, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
})
function getColRowOffsets (spriteIn: Sprite, targetIn: Sprite) {
    getColRowOffsets_colOffset = 0
    getColRowOffsets_rowOffset = 0
    getColRowOffsets_colRowDiff = getColRowDifference(spriteIn, targetIn)
    if (Math.abs(getColRowOffsets_colRowDiff[0]) > Math.abs(getColRowOffsets_colRowDiff[1])) {
        if (getColRowOffsets_colRowDiff[0] < 0) {
            getColRowOffsets_colOffset += 1
        } else {
            getColRowOffsets_colOffset += -1
        }
    } else {
        if (getColRowOffsets_colRowDiff[1] < 0) {
            getColRowOffsets_rowOffset += 1
        } else {
            getColRowOffsets_rowOffset += -1
        }
    }
    return [getColRowOffsets_colOffset, getColRowOffsets_rowOffset]
}
let getColRowOffsets_colRowDiff: number[] = []
let getColRowOffsets_rowOffset = 0
let getColRowOffsets_colOffset = 0
let getDistances_distance = 0
let getDistances_yDiff = 0
let getDistances_xDiff = 0
let getDistances_distances: number[] = []
let getClosestTarget_closestIndex = 0
let getColRowDifference_colRowResult: number[] = []
let getColRowDifference_spriteBLocation: tiles.Location = null
let getColRowDifference_spriteALocation: tiles.Location = null
let getClosestIndex_distance = 0
let getClosestIndex_meta: number[] = []
let getClosestIndex_distances: number[] = []
let isMoEndEnabled = 0
let spriteDebug: Sprite = null
let isBatteryEnabled = 0
let textSprite4: TextSprite = null
let textSprite3: TextSprite = null
let textSprite2: TextSprite = null
let spriteButton: Sprite = null
let textSprite: TextSprite = null
let previousMoDirection = ""
let moveMo_target: Sprite = null
let moveMo_targets: Sprite[] = []
let isMoEnabled = 0
let moveMo_colRowOffsets: number[] = []
let spriteBattery: Sprite = null
let spriteMo: Sprite = null
let directionStrings: string[] = []
let directionOffets: number[][] = []
let moveWalle_offset: number[] = []
let batteryStatus: StatusBarSprite = null
let hasMoved = false
let previousDirection = ""
let spriteWalle: Sprite = null
let floorSprite: Image = null
let spriteEve: Sprite = null
let spriteInRow = 0
let spriteInCol = 0
let sprite_tmpEve: Sprite = null
let sprite_tmpWalle: Sprite = null
let pageNum = 0
pageNum = 0
pageNegOne()
game.onUpdateInterval(400, function () {
    if (hasMoved) {
        if (randint(Math.max(5, sprites.allOfKind(SpriteKind.Track).length), 5) <= 5) {
            moveMo(spriteMo, sprites.allOfKind(SpriteKind.Track), spriteWalle)
        }
    }
})
