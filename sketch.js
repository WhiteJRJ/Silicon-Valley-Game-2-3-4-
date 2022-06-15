var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var nuclearGroup
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload() {
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")

  backgroundImg = loadImage("game-desert-background-vector.jpg")
  sunAnimation = loadImage("sun.png");

  trex_running = loadAnimation("tile0.png", "tile1.png", "tile2.png", "tile3.png");
  trex_collided = loadAnimation("crack/tile000.png","crack/tile001.png","crack/tile002.png","crack/tile003.png",
  "crack/tile004.png","crack/tile005.png","crack/tile006.png","crack/tile007.png","crack/tile008.png",
  "crack/tile009.png","crack/tile010.png","crack/tile011.png","crack/tile012.png","crack/tile013.png",
  "crack/tile014.png","crack/tile015.png","crack/tile016.png","crack/tile017.png","crack/tile018.png",
  "crack/tile019.png","crack/tile020.png","crack/tile021.png","crack/tile022.png","crack/tile023.png",
  "crack/tile024.png","crack/tile025.png");
  trex_collided.playing = true
  trex_collided.looping = false

  groundImage = loadImage("download (1)-modified.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(width/2, height - 70, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle', 0, 0, 250)
  trex.scale = 0.08

  sun = createSprite(trex.x + 100, 100, 10, 10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  invisibleGround = createSprite(trex.x, height - 10, 10000000000, 125);
  invisibleGround.shapeColor = "#f4cbaa";

  ground = createSprite(width / 4, height, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = width / 2
 
  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;


  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  nuclearGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: " + score, 30, 50);
  console.log(width)
  translate(width/2, height/2);   // centres us to the middle of the screen
  translate(-trex.x, -422);  // makes the player the centre of the world

  sun.x = (trex.x + 718) - 50
  invisibleGround.x = trex.x
  gameOver.x = trex.x
  restart.x = trex.x

  if (gameState === PLAY) {
    if (trex.velocityX !== 0){
    score = Math.round((trex.x * 3 / getFrameRate())/2);
    }
    ground.velocityX = 0;

    if ((touches.length > 0 || keyDown("SPACE")) && trex.y >= height - 120) {
      jumpSound.play()
      trex.velocityY = -10;
      touches = [];
    }
    /*if(trex.x >= sun.x){
        sun.x = trex.x + width/2 + 50 
      }*/

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x <= width / 44 || ground.x >= width - width / 44) {
      ground.x = width/2;
    }
    

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnNuclearBombs();

    if (obstaclesGroup.isTouching(trex)) {
      if(trex.velocityX >= 16){
        score += 10
        obstaclesGroup.destroyEach()
      }
      else{
        collidedSound.play()
        gameState = END;}
    }
    if (nuclearGroup.isTouching(trex)) {
        collidedSound.play()
        gameState = END;
      }

    if(keyDown(LEFT_ARROW)){
      if(ground.x >= 0){  
      ground.velocityX = +10
      }
      trex.velocityX = -6 
    }
    else if(keyDown(RIGHT_ARROW)){
      if(ground.x !== width){
      ground.velocityX = -10
      }  
      trex.velocityX = +6
    }
    else {
      trex.velocityX = 0
      ground.velocityX = 0
    }
      if(keyDown(SHIFT)){
        if(keyDown(RIGHT_ARROW)){
          trex.velocityX = 20
          ground.velocityX = -50
        }
        if(keyDown(LEFT_ARROW)){
          trex.velocityX = -20
          ground.velocityX = 50
        }
      }    

    /*
    if(keyReleased(LEFT_ARROW)){
      ground.velocityX = 0
      trex.velocityX = 0
    }
    else if(keyReleased(RIGHT_ARROW)){
      ground.velocityX = 0 
      trex.velocityX = 0
    }*/
    /*function keyPressed() {
      if (keyCode === LEFT_ARROW) {
        ground.velocityX += 6
        //trex.velocityX -= 6
      } else if (keyCode === RIGHT_ARROW) {
        ground.velocityX -= 6
        //trex.velocityX += 6
      }

    }*/
    if(score >= 2030){
      gameState = WIN
    }

    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    //obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    nuclearGroup.setLifetimeEach(-1)

    if (touches.length > 0 || keyDown("SPACE") || mousePressedOver(restart)) {
      reset();
      touches = []
    }
  }
  else if(gameState === WIN){
    swal({
      title: `Congratulations`,
      text: "You've escaped the nuclear earthquake",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + width/2 + 20, height - 300, 40, 10);
    cloud.y = Math.round(random(100, 220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 300;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x + (Math.round(random(300, 1200))), height - 95, 20, 30);
    obstacle.setCollider('circle', 0, 0, 45)
    /* obstacle.debug = true
    if(keyDown(LEFT_ARROW)){
      obstacle.velocityX = 3
    }
    else if(keyDown(RIGHT_ARROW)){
      obstacle.velocityX = -3
    }*/
    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnNuclearBombs() {
  if (frameCount % 20 === 0) {
    var nuclearBomb = createSprite(trex.x + (Math.round(random(-300, 1200))), 0, 60, 90);
    nuclearBomb.setCollider('circle', 0, 0, 45)
    nuclearBomb.velocityY = (Math.round(random(0, 35)))
    nuclearGroup.collide(invisibleGround)
    


    /* obstacle.debug = true
    if(keyDown(LEFT_ARROW)){
      obstacle.velocityX = 3
    }
    else if(keyDown(RIGHT_ARROW)){
      obstacle.velocityX = -3
    }*/
    //generate random obstacles
    /*var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      default: break;
    }*/

    //assign scale and lifetime to the obstacle           
    nuclearBomb.scale = 0.7;
    nuclearBomb.lifetime = 2500;
    //add each obstacle to the group
    nuclearGroup.add(nuclearBomb);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  nuclearGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  trex.x = width/2

  score = 0;

}
