// Variables para audio
let mic;
let soundLevel = 0;
let smoothedLevel = 0;

// Variables para detección de manos
let video;
let handpose;
let hands = [];

// Variables para visualización 3D
let rotationX = 0;
let rotationY = 0;
let sphereSize = 50;
let particles = [];
let handX = 0;
let handY = 0;
let handZ = 0;

// Estado de la aplicación
let audioStarted = false;
let handposeReady = false;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Configurar captura de video para detección de manos
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Cargar modelo de detección de manos
    handpose = ml5.handpose(video, modelReady);
    handpose.on('hand', gotHands);

    // Inicializar partículas
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Configuración de audio (se iniciará con interacción del usuario)
    getAudioContext().suspend();
}

function modelReady() {
    console.log('Modelo de detección de manos cargado');
    handposeReady = true;
}

function gotHands(results) {
    hands = results;

    // Actualizar UI
    document.getElementById('handsDetected').textContent = hands.length;

    // Si hay manos detectadas, usar la primera
    if (hands.length > 0) {
        let hand = hands[0];

        // Obtener posición del centro de la palma (punto 9 es el centro)
        if (hand.landmarks && hand.landmarks.length > 9) {
            let palm = hand.landmarks[9];

            // Mapear coordenadas de la mano a espacio 3D
            handX = map(palm[0], 0, 640, -width/2, width/2);
            handY = map(palm[1], 0, 480, -height/2, height/2);

            // Usar distancia entre puntos para estimar profundidad
            let wrist = hand.landmarks[0];
            let middle = hand.landmarks[12];
            let dist = distance(wrist, middle);
            handZ = map(dist, 50, 150, -200, 200);

            // Calcular rotación basada en orientación de la mano
            let thumb = hand.landmarks[4];
            let pinky = hand.landmarks[20];
            rotationY = map(thumb[0] - pinky[0], -200, 200, -PI, PI);
            rotationX = map(palm[1], 0, 480, -PI/4, PI/4);
        }
    }
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function mousePressed() {
    // Iniciar audio cuando el usuario hace clic
    if (!audioStarted) {
        userStartAudio();
        mic = new p5.AudioIn();
        mic.start();
        audioStarted = true;
        console.log('Audio iniciado');

        // Actualizar UI
        let warning = document.querySelector('.warning');
        if (warning) {
            warning.textContent = '✓ Sistema activo';
            warning.style.color = '#00ff00';
        }
    }
}

function draw() {
    background(20);

    // Obtener nivel de sonido
    if (audioStarted && mic) {
        soundLevel = mic.getLevel();
        smoothedLevel = lerp(smoothedLevel, soundLevel, 0.1);

        // Actualizar UI
        document.getElementById('soundLevel').textContent = (smoothedLevel * 100).toFixed(1) + '%';
    }

    // Configurar luces
    ambientLight(60);
    pointLight(255, 255, 255, 200, -200, 400);
    pointLight(100, 200, 255, -200, 200, -400);

    // Aplicar rotación basada en manos
    if (hands.length > 0) {
        rotateX(rotationX);
        rotateY(rotationY);
    } else {
        // Rotación automática si no hay manos
        rotateX(frameCount * 0.003);
        rotateY(frameCount * 0.005);
    }

    // Calcular tamaño basado en sonido
    let targetSize = map(smoothedLevel, 0, 0.5, 50, 200);
    sphereSize = lerp(sphereSize, targetSize, 0.1);

    // Dibujar esfera central principal
    push();
    if (hands.length > 0) {
        translate(handX * 0.3, handY * 0.3, handZ);
    }

    // Material reactivo al sonido
    let r = map(smoothedLevel, 0, 0.3, 100, 255);
    let g = map(sin(frameCount * 0.05), -1, 1, 50, 200);
    let b = map(cos(frameCount * 0.03), -1, 1, 150, 255);

    specularMaterial(r, g, b);
    shininess(20);
    sphere(sphereSize);
    pop();

    // Dibujar esferas orbitales
    for (let i = 0; i < 8; i++) {
        push();
        let angle = (frameCount * 0.01) + (i * PI / 4);
        let radius = 150 + smoothedLevel * 300;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        let z = sin(angle * 2) * 100;

        translate(x, y, z);

        let size = 20 + smoothedLevel * 40;

        let hue = (i * 45 + frameCount) % 360;
        let col = color(hue, 80, 90);
        fill(col);
        noStroke();
        sphere(size);
        pop();
    }

    // Dibujar anillos
    push();
    rotateX(PI/2);
    noFill();
    stroke(100, 200, 255, 100);
    strokeWeight(2);
    let ringSize = 200 + smoothedLevel * 200;
    ellipse(0, 0, ringSize, ringSize);
    pop();

    push();
    rotateY(PI/2);
    stroke(255, 100, 200, 100);
    strokeWeight(2);
    ellipse(0, 0, ringSize * 0.8, ringSize * 0.8);
    pop();

    // Actualizar y dibujar partículas
    for (let particle of particles) {
        particle.update(smoothedLevel, hands.length > 0);
        particle.display();
    }

    // Dibujar visualización de manos (opcional, para debug)
    if (hands.length > 0) {
        drawHandIndicator();
    }
}

function drawHandIndicator() {
    push();
    translate(handX * 0.3, handY * 0.3, handZ);
    noFill();
    stroke(0, 255, 0, 150);
    strokeWeight(2);
    sphere(30);
    pop();
}

// Clase para partículas flotantes
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(-400, 400);
        this.y = random(-400, 400);
        this.z = random(-400, 400);
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.vz = random(-1, 1);
        this.size = random(2, 6);
    }

    update(soundLevel, hasHands) {
        // Movimiento influenciado por sonido
        let speed = 1 + soundLevel * 5;
        this.x += this.vx * speed;
        this.y += this.vy * speed;
        this.z += this.vz * speed;

        // Si hay manos, atraer partículas
        if (hasHands) {
            let dx = handX * 0.3 - this.x;
            let dy = handY * 0.3 - this.y;
            let dz = handZ - this.z;
            this.vx += dx * 0.001;
            this.vy += dy * 0.001;
            this.vz += dz * 0.001;
        }

        // Límites
        if (abs(this.x) > 500 || abs(this.y) > 500 || abs(this.z) > 500) {
            this.reset();
        }
    }

    display() {
        push();
        translate(this.x, this.y, this.z);
        noStroke();
        fill(255, 255, 255, 150);
        sphere(this.size);
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
