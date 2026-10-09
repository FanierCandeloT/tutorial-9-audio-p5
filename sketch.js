/* eslint-disable no-undef, no-unused-vars */

// DECLARACIONES

let canvas;
let canvasHeight = 120;
let canvasWidth;

const URL_AUDIO = "aud/audio.ogg";
let velocidad;
let volumen;
let soundFile;

let medidaAmplitud;
let diametroCirculo;

let reverberacion;

// Nuevas variables para la posición actual y objetivo del círculo (Retos 1 y 2)
let circuloX;
let circuloY;
let objetivoX;
let objetivoY;

function preload() {
  soundFormats("ogg");
  soundFile = loadSound(URL_AUDIO);
}

function setup() {
  canvasWidth = windowWidth;
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");
  
  velocidad = 1.0;
  volumen = 0.5;
  soundFile.pause();
  
  medidaAmplitud = new p5.Amplitude();

  reverberacion = new p5.Reverb();
  reverberacion.disconnect();
  reverberacion.process(soundFile, 2, 1);
  reverberacion.drywet(0.8);

  // Inicializar las posiciones del círculo en el centro
  circuloX = windowWidth / 2;
  circuloY = 60;
  objetivoX = circuloX;
  objetivoY = circuloY;
}

function draw() {
  background(128, 128, 128);
  
  amplitudAudio = medidaAmplitud.getLevel();
  diametroCirculo = map(amplitudAudio, 0, 1, 0, 200);

  // Animación de movimiento (Reto 2): interpolación lineal entre la posición actual y el objetivo
  // El valor 0.1 representa la velocidad de la animación (más cercano a 1 es más rápido)
  circuloX = lerp(circuloX, objetivoX, 0.1);
  circuloY = lerp(circuloY, objetivoY, 0.1);

  fill(255, 0, 0);
  // Dibujar el círculo usando las variables de posición dinámicas
  circle(circuloX, circuloY, diametroCirculo);
}

windowResized = function () {
  canvasWidth = windowWidth;
  resizeCanvas(canvasWidth, canvasHeight);
};

function keyTyped() {
  if (key === "p") {
    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
    }
  } else if (key === ">" && soundFile.isPlaying()) {
    velocidad += 0.1;
    soundFile.rate(velocidad);
  } else if (key === "<" && soundFile.isPlaying()) {
    velocidad -= 0.1;
    soundFile.rate(velocidad);
  } else if (key === "+" && soundFile.isPlaying()) {
    volumen += 0.1;
    soundFile.setVolume(volumen);
  } else if (key === "-" && soundFile.isPlaying()) {
    volumen -= 0.1;
    soundFile.setVolume(volumen);
  }
}

function mouseClicked() {
  // Verifica si el usuario hizo clic dentro del círculo rojo (usando las posiciones actuales y el radio)
  if (dist(circuloX, circuloY, mouseX, mouseY) <= diametroCirculo / 2) {
    // Permite que se escuche el efecto de reverberación
    reverberacion.connect();
  } else {
    // Evita que se escuche el efecto de reverberación
    reverberacion.disconnect();
    
    // Reto 1: Cambiar la posición objetivo al lugar donde se hizo clic fuera del círculo
    objetivoX = mouseX;
    objetivoY = mouseY;
  }
}