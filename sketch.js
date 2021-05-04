var PLAY = 1;
var END = 0;
var gameState = PLAY;
var touches
var trex, trex_running, trex_collided,trex;
var ground, invisibleGround, groundImage;
var bg,bg1,bg2,backgroundImg,background;

var cloudsGroup, cloudImage,bgImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var trex1;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
 trex=loadImage("trex.png")
 bg=loadImage("bg1.png")
 bg=loadImage("bg2.jpg")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("clouds2.png");
  
  obstacle1 = loadImage("cactus.png");
  obstacle2 = loadImage("cactus.png");
  obstacle3 = loadImage("cactus.png");
  obstacle4 = loadImage("cactus.png");
  obstacle5 = loadImage("cactus.png");
  obstacle6 = loadImage("cactus.png");
  
  restartImg = loadImage("reset.png")
  gameOverImg = loadImage("go.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
 
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
 console.log(message)
 
 
  
  trex1 = createSprite(50,height-70,20,50);
 trex1.addImage(trex);
 trex1.scale=0.12;
  

  
  
  ground = createSprite(width/2,height,width,3);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.debug=true
  ground.setCollider("rectangle",0,0,300,2)
  gameOver = createSprite(width/2,height/2-95);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  trex1.setCollider("circle",0,0,200)
 
  gameOver.scale = 0.8;
  restart.scale = 0.4;
  
  invisibleGround = createSprite(width/2,height-10,width,3);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex1.debug=true
 
  
  score = 0;
  
}

function draw() {
 background(bg);
  
  
  //displaying score
  fill("red")
  textSize(30)
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score =score + Math.round(getFrameRate()/60); 
    
      if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
  
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //add gravity
    trex1.velocityY = trex1.velocityY + 0.4
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex1)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
     
   
     
     
      ground.velocityX = 0;
      trex1.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex1.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
    reset();
  }


  drawSprites();
  
  }

function reset(){
  gameState=PLAY
  //obstaclesGroup.setLifetimeEach(0);
  //cloudsGroup.setLifetimeEach(0);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  }


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-30,20,30);
   obstacle.velocityX = -(6 + score/100);
   
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   obstacle.setCollider("circle",0,0,150)
   //add each obstacle to the group
   obstacle.debug=true
    obstaclesGroup.add(obstacle);
    
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex1.depth;
    trex1.depth = trex1.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
async function getTime(){
  var response  = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata')
  var responceaz = await response.json()
  //console.log(responceaz)
  var responseaq = responceaz.datetime
  //console.log(responseaq)
  var responceq = responseaq.slice(11,19)
  //console.log(responceq)
  if(responceq>=06&&responceq<=19){
    bg = "bg2.jpg"
}else{
    bg = "bg1.png"
}
  backgroundImg = loadImage(bg);
}

