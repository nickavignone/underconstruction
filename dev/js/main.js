/*jslint browser: true*/
/*global Letters*/
/*global alert*/
/*global createjs*/
var ctx;
var stage;
var stageWidth;
var stageHeight;
var particles = [];
var particleCount = 3000;
var speed = 0.1;
var cull = 3;
var r = 0;
var testtext = '';
var num = 0;

var data = [
      {txt: 'Hey There!!', color: randoColor(0,40,150,250,0,150) },
      {txt: 'I have Some Bad News', color: randoColor(0,40,150,250,0,150) },
      {txt: 'This Site is', color: randoColor(0,40,150,250,0,150) },
      {txt: 'UNDER CONSTRUCTION', color: randoColor(200,255,0,100,0,100) },
      {txt: 'However..', color: randoColor(0,40,150,250,0,150) },
      {txt: 'My Site From 2012', color: randoColor(0,40,150,250,0,150) },
      {txt: '------>', color: randoColor(100,255,100,255,100,255) }
      ];

function resize() {
  var i,
    particle;
  $("#canvas").attr("width", $(window).width());
  $("#canvas").attr("height", $(window).height());
  stageWidth = $(window).width();
  stageHeight = $(window).height();

  for (i = 0; i < particleCount; i++) {
    particle = particles[i];

    particle.x = particle.endX = _.random(stageWidth);
    particle.y = particle.endY = _.random(stageHeight);
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createParticle(color, radius, x, y, vx, vy, vx2, vy2) {
  var particle = new createjs.Shape();
  particle.graphics.beginFill(color);
  particle.graphics.drawCircle(0, 0, radius);
  particle.x = x;
  particle.y = y;
  particle.endX = x;
  particle.endY = y;
  particle.vx = vx;
  particle.vy = vy;
  particle.vx2 = vx2;
  particle.vy2 = vy2;

  return particle;
}


function clock() {
  var date = new Date();
  /*var h = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
  var m = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
  var s = (date.getSeconds() > 9) ? date.getSeconds() : "0" + date.getSeconds();*/
  
  var text = new createjs.Text(data[num].txt, "85px Times", "#f00"),
    rect,
    pixels,
    i,
    w,
    j,
    h,
    scale,
    particle;
  text.w = Math.floor(text.getMeasuredWidth());
  text.h = Math.floor(text.getMeasuredLineHeight());
  text.x = Math.floor(stageWidth / 2 - text.w / 2);
  text.y = Math.floor(stageHeight / 2 - text.h / 2);

  rect = new createjs.Shape();
  rect.graphics.beginFill("#000");
  rect.graphics.drawRect(0, 0, stageWidth, stageHeight);

  stage.compositeOperation = "default";

  stage.addChild(rect);
  stage.addChild(text);
  stage.update();

  pixels = ctx.getImageData(text.x, text.y, text.w, text.h);

  stage.removeChild(rect);
  stage.removeChild(text);
  stage.update();

  stage.compositeOperation = "lighter";
  shuffle(particles);

  i = 0;
  for (w = 0; w < text.w; w += cull) {
    for (h = 0; h < text.h; h += cull) {
      if (pixels.data[(w + text.w * h) * 4] !== 0 && i < particles.length) {
        particle = particles[i];

        //if(i == 0) {
        particle.graphics.clear().beginFill(data[num].color).drawCircle(0, 0, setRadius()).endFill();
        

        //}
        particle.endX = text.x + w;
        particle.endY = text.y + h;
        particle.vx = (1 - Math.random() * 2);
        particle.vy = (1 - Math.random() * 2);
        scale = _.random(1, 1);
        particle.scaleX = scale;
        particle.scaleY = scale;

        i++;
      }
    }
  }

  for (j = i; j < particles.length; j++) {
    particle = particles[j];


    particle.graphics.clear().beginFill(setColor()).drawCircle(0, 0, 1).endFill();
    //if (j < r) {
      particle.endX = _.random(stageWidth);
      particle.endY = _.random(stageHeight);
    //}
    scale = _.random(1, 1);
    particle.scaleX = scale;
    particle.scaleY = scale;
  }
  r = i;

  num ++;
  if(num < data.length) {
    setTimeout(clock, 3000);
  } else {
    $('.link').show();
  }
}


function tick() {
  var i,
    particle,
    v;
  for (i = 0; i < particleCount; i++) {
    particle = particles[i];

    if (i < r) {
      //particle.endX += particle.vx / 40;
      //particle.endY += particle.vy / 40;
      //v = 1.05 + Math.random() / 100;
      //particle.vx *= v;
      //particle.vy *= v;
    } else {
      //particle.endX += particle.vx2;
      //particle.endY += particle.vy2;
    }

    if (particle.x < 0) {
      particle.x = stageWidth;
      particle.endX = stageWidth;
    } else if (particle.x > stageWidth) {
      particle.x = 0;
      particle.endX = 0;
    }

    if (particle.y < 0) {
      particle.y = stageHeight;
      particle.endY = stageHeight;
    } else if (particle.y > stageHeight) {
      particle.y = 0;
      particle.endY = 0;
    }

    particle.x = particle.x + (particle.endX - particle.x) * speed;
    particle.y = particle.y + (particle.endY - particle.y) * speed;

    if (particle.scaleX > 1) {
      particle.scaleX = particle.scaleX * 0.85;
    }
    if (particle.scaleY > 1) {
      particle.scaleY = particle.scaleY * 0.85;
    }
  }

  stage.update();
}

function randoColor(r1, r2, g1, g2, b1, b2) {
  return "rgba(" + _.random(r1, r2)+"," + _.random(g1, g2) + "," + _.random(b1, b2) + ",1)";
}

function setColor() {
  //return "rgba(" + _.random(20)+"," + _.random(230, 355) + "," + _.random(50, 150) + ",1)";

  return "rgba(" + _.random(0, 40)+"," + _.random(150, 255) + "," + _.random(200, 255) + ",1)";
}

function setRadius() {
  return Math.floor(Math.random() * 10) / 10 + 0.5;
}

function init() {
  var canvas = document.getElementById("canvas"),
    i,
    color,
    radius,
    x,
    y,
    vx,
    vy,
    vx2,
    vy2,
    particle;
  ctx = canvas.getContext("2d");
  stage = new createjs.Stage(canvas);

  for (i = 0; i < particleCount; i++) {
    color = setColor();
    radius = setRadius();
    x = 0;
    y = 0;
    vx = (1 - Math.random() * 2);
    vy = (1 - Math.random() * 2);
    vx2 = (1 - Math.random() * 2) * 0.1;
    vy2 = (1 - Math.random() * 2) * 0.1;

    particle = createParticle(color, radius, x, y, vx, vy, vx2, vy2);
    particles.push(particle);
    stage.addChild(particle);
  }

  resize();
  clock();
}

init();

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

if (!isCanvasSupported()){
  alert('sigh.... your browser doesn\'t support canvas...');
  $('.link').show();
}

$(window).resize(resize);

if($(window).width() < 960) {
  $('canvas').css('display','none');
  alert('Site Under Construction, Sorry :/');
  $('.link').show();
}

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", tick);