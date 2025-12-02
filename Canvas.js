var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

// Variabel
var MusuhX = 900;
var MusuhY = 300;
var posX = 50;
var posY = 50;
var gerak_Musuh = 1;
var musuh_PeluruX = MusuhX;
var musuh_PeluruY = MusuhY;
var gerak = true;
var Tembak = false;
var bulletX = 100;
var bulletY = posY;
var musuhMenembak = false;
var Score = 0;
var nyawa = 3;
var RandomX = 0;
var RandomY = 0;


// Fungsi tampilan

function angkaRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function hapusKotak() {
    ctx.clearRect(RandomX, RandomY, 100, 100);
  }

  function tampilkanKotak() {
    RandomX = angkaRandom(150, 850);
    RandomY = angkaRandom(100, 660);
  
    ctx.fillStyle = "blue";
    ctx.fillRect(posisiX, posisiY, 100, 100);
  }

function angkaRandom(max,min){
    return Math.floor(Math.random() * (max - min) + min)
    
}

function Mati() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "bold 60px Arial";
    const text = "GAME OVER";
    const textWidth = ctx.measureText(text).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2;
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawBullet(x, y) {
    ctx.beginPath();
    ctx.arc(x + 50, y + 50, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

function drawBulletMusuh(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "purple";
    ctx.fillRect(x + 20, y - 20, 50, 10);
}

function drawTriangle(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 100);
    ctx.lineTo(x + 50, y + 50);
    ctx.closePath();

    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
}

function drawKotak(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 100, 100);
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTriangle(posX, posY);
    drawKotak(MusuhX, MusuhY);
    if (Tembak) drawBullet(bulletX, bulletY);
    if (musuhMenembak) drawBulletMusuh(musuh_PeluruX, musuh_PeluruY);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score = " + Score, 10, 30);
    ctx.fillText("Nyawa = " + nyawa, 10, 60);

    setInterval(() => {
        if (medkit) {
          // Jika medkit sedang tampil, hilangkan
          hapusKotak();
          medkit = false;
        } else {
          // Jika medkit sedang tidak tampil, munculkan
          tampilkanKotak();
          medkit = true;
        }
      }, 10000);
}

// ---------------------
// Game Loop utama

setInterval(() => {
    if (nyawa > 0) {
        // Semua logika permainan hanya berjalan jika nyawa > 0

        // Gerak peluru player
        if (Tembak) {
            bulletX += 20;
            if (bulletX > canvas.width) Tembak = false;

            // Deteksi tabrakan dengan musuh
            if (
                bulletX + 50 >= MusuhX && bulletX + 50 <= MusuhX + 100 &&
                bulletY + 50 >= MusuhY && bulletY + 50 <= MusuhY + 100
            ) {
                Score += 1;
                gerak_Musuh += 0.5;
                Tembak = false;
            }
        }

        // Gerak peluru musuh
        if (!musuhMenembak && Math.abs(MusuhY - posY) <= 50) {
            musuhMenembak = true;
            musuh_PeluruX = MusuhX;
            musuh_PeluruY = MusuhY + 50;
        }

        if (musuhMenembak) {
            musuh_PeluruX -= 10;

            // Cek tabrakan dengan player
            if (
                musuh_PeluruX <= posX + 50 &&
                musuh_PeluruX + 50 >= posX &&
                musuh_PeluruY >= posY &&
                musuh_PeluruY <= posY + 100
            ) {
                musuhMenembak = false;
                nyawa -= 1;
            }

            if (musuh_PeluruX < -100) musuhMenembak = false;
        }

        // Gerak musuh
        if (gerak) {
            MusuhY += gerak_Musuh;
            if (MusuhY + 100 > canvas.height) gerak = false;
        } else {
            MusuhY -= gerak_Musuh;
            if (MusuhY <= 0) gerak = true;
        }

        drawAll();
    } else {
        // Kalau nyawa habis, tampilkan Game Over
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Mati();
    }
}, 20);

// ---------------------
// Kontrol player
// ---------------------
window.addEventListener("keydown", (e) => {
    if (nyawa > 0) {
        if (e.key == "ArrowDown" || e.key == "s") posY += 10;
        if (e.key == "ArrowUp" || e.key == "w") posY -= 10;
        if (e.key == "ArrowLeft" || e.key == "a") posX -= 10;
        if (e.key == "ArrowRight" || e.key == "d") posX += 10;

        if (e.code == "Space" && !Tembak) {
            Tembak = true;
            bulletX = posX;
            bulletY = posY;
        }
        drawAll();
    }
});
