function app() {
    //llamar Canvas
    var canvas = document.getElementById("pantalla");

    //Contexto del Canvas
    var ctx = canvas.getContext("2d");

    // Variables 
    var ctx;
    var canvas;
    var palabra;
    var letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var colorTecla = "#585858";
    var colorMargen = "red";
    var inicioX = 200;
    var inicioY = 300;
    var lon = 35;
    var margen = 20;
    var pista = "Animales";
    var pistaText = "";

    // Arreglos 
    var teclas_A = new Array();
    var letras_A = new Array();
    var palabras_A = new Array();

    // Variables de control 
    var aciertos = 0;
    var errores = 0;
    var intentosRestantes = 6;
    var juegosGanados = 0;

    // Palabras 
    palabras_A.push("CABALLO");
    palabras_A.push("AGUILA");
    palabras_A.push("PERRO");
    palabras_A.push("GATO");
    palabras_A.push("LAGARTIJA");
    palabras_A.push("OCELOTE");
    palabras_A.push("TIBURON");
    palabras_A.push("CARACOL");
    palabras_A.push("LEON");
    palabras_A.push("CONEJO");
    palabras_A.push("AVESTRUZ");
    palabras_A.push("SERPIENTE");
    palabras_A.push("PUMA");
    palabras_A.push("OSO");
    palabras_A.push("JIRAFA");

    //Constructores
    function Tecla(x, y, ancho, alto, letra) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = ahorcado.dibujaTecla;
    }

    function Letra(x, y, ancho, alto, letra) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = ahorcado.dibujaCajaLetra;
        this.dibujaLetra = ahorcado.dibujaLetraLetra;
    }


    //Objeto del juego del ahorcado
    const ahorcado =
    {
        // Funciones 
        // Dibujar Teclas
        dibujaTecla: function () {
            ctx.fillStyle = colorTecla;
            ctx.strokeStyle = colorMargen;
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);

            ctx.fillStyle = "white";
            ctx.font = "bold 20px courier";
            ctx.fillText(this.letra, this.x + this.ancho / 2 - 5, this.y + this.alto / 2 + 5);
            console.log("dibujar tecla:" + this.letra);
        },

        // Dibua la letra y su caja 
        dibujaLetraLetra: function () {
            var w = this.ancho;
            var h = this.alto;
            ctx.fillStyle = "black";
            ctx.font = "bold 40px Courier";
            ctx.fillText(this.letra, this.x + w / 2 - 12, this.y + h / 2 + 14);
            console.log("dibujar tecla 2 : " + this.letra);

        },
        dibujaCajaLetra: function () {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
        },
        // Dibuja la informacion de juego
        informacion: function(){

            ctx.fillStyle = "black";
            ctx.font = "bold 20px Courier";
            ctx.clearRect(80, 0, 270, 200);
            ctx.fillText("Pista: " + pista , 80, 20);
            ctx.fillText("Juegos Ganados: " + juegosGanados, 80, 50);
            ctx.fillText("intentos restantes: " + intentosRestantes, 80, 110);
            ctx.fillText("errores: " + errores, 80, 180);
            
            ctx.strokeStyle = "#C6C6C6";
            ctx.fillRect(750, 400, 140, 25);
            ctx.strokeRect(750, 400, 140, 25);


            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 14px Courier";
            ctx.fillText("Volver a Jugar",760,417);
        },
        // Distribuir nuestro teclado con sus letras
        teclado: function () {
            var ren = 0;
            var col = 0;
            var letra = "";
            var miLetra;
            var x = inicioX;
            var y = inicioY;
            for (var i = 0; i < letras.length; i++) {
                letra = letras.substr(i, 1);
                miLetra = new Tecla(x, y, lon, lon, letra);
                miLetra.dibuja();
                teclas_A.push(miLetra);
                x += lon + margen;
                col++;
                if (col == 10) {
                    col = 0;
                    ren++;
                    if (ren == 2) {
                        x = 280;
                    } else {
                        x = inicioX;
                    }
                }
                y = inicioY + ren * 50;
            }
        },
        // aqui obtenemos nuestra palabra aleatoriamente y la dividimos en letras 
        pintaPalabra: function () {
            var p = Math.floor(Math.random() * palabras_A.length);
            palabra = palabras_A[p];
            console.log(palabra);
            var w = canvas.width;
            var len = palabra.length;
            var ren = 0;
            var col = 0;
            var y = 230;
            var lon = 50;
            var x = (w - (lon + margen) * len) / 2;
            for (var i = 0; i < palabra.length; i++) {
                letra = palabra.substr(i, 1);
                miLetra = new Letra(x, y, lon, lon, letra);
                miLetra.dibuja();
                letras_A.push(miLetra);
                x += lon + margen;
            }
        },
        // funcion de error el cual dibuja ahorcado  
        horca: function (errores) {
            var imagen = new Image();
            imagen.src = "imagenes/ahorcado" + errores + ".png";
            ahorcado.informacion();
            imagen.onload = function () {
                ctx.drawImage(imagen, 390, 0, 230, 230);
            }

        },
        // ajustar coordenadas 
        ajusta: function (xx, yy) {
            var posCanvas = canvas.getBoundingClientRect();
            var x = xx - posCanvas.left;
            var y = yy - posCanvas.top;
            return { x: x, y: y }
        },
        // Detecta click y la compara con las de la palabra
        selecciona: function (e) {
            var pos = ahorcado.ajusta(e.clientX, e.clientY);
            var x = pos.x;
            var y = pos.y;
            var tecla;
            var bandera = false;

            var coordenadas = document.getElementById("coordenadas");
            coordenadas.innerHTML = "coordenadas:  X: " + x + " Y: " + y;

            for (var i = 0; i < teclas_A.length; i++) {
                tecla = teclas_A[i];
                if (tecla.x > 0) {
                    if ((x > tecla.x) && (x < tecla.x + tecla.ancho) && (y > tecla.y) && (y < tecla.y + tecla.alto)) {
                        console.log(tecla.x);
                        break;
                    }
                }
            }
            if (i < teclas_A.length) {
                for (var i = 0; i < palabra.length; i++) {
                    letra = palabra.substr(i, 1);

                    console.log("letra en seleccion: " + letra);
                    console.log("Palabra desconocida: "+ palabra.substr(i, 1));

                    if (letra == tecla.letra) { // comparamos y vemos si acerto la letra 
                        var caja = letras_A[i];
                        caja.dibujaLetra();
                        aciertos++;
                        bandera = true;
                        console.log("variable desconocida 1: " + caja.dibujaLetra());
                    }
                }
                if (bandera == false) { // Si falla aumenta los errores y checa si perdio para mandar a la funcion gameover 

                    errores++;
                    intentosRestantes-=1;

                    ahorcado.horca(errores);
                    if (errores == 6) ahorcado.gameOver(errores);

                }
                // Colorea la tecla que se a presionado
                ctx.fillStyle = "#0080FF"; 
                ctx.fillRect(tecla.x - 1, tecla.y - 1, tecla.ancho + 2, tecla.alto + 2);
                tecla.x - 1;
                // checa si se gano y manda a la funcion gameover 
                if (aciertos == palabra.length) ahorcado.gameOver(errores);
            }
            if(x > 750 && x < 890 && y > 400 && y < 420){
                window.location.reload();
            }
            if(x > 750 && x < 890 && y > 360 && y < 380){
                ahorcado.palabraSiguiente();
            }
        },
        // funcion en caso de perder o ganar
        // Borramos las teclas y la palabra con sus cajas 
        // manda msj
        palabraSiguiente: function (){
            juegosGanados=juegosGanados+1;//aqui agrega el conteo de juego
            intentosRestantes = 6;
            aciertos = 0;
            errores = 0;
            inicioX = 200;
            inicioY = 300;
            lon = 35;
            margen = 20;
            palabra = "";
            letras_A= new Array();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ahorcado.play();
        },
        gameOver: function (errores) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";

            ctx.font = "bold 50px Courier";
            if (errores < 6) {
                ctx.fillText("Muy bien, la palabra es: ", 110, 280);
                ctx.strokeStyle = "#C6C6C6";
                //ctx.fillRect(750, 360, 140, 25);
                ctx.strokeRect(750, 360, 140, 25);
                //ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 14px Courier", color="#ffffff";
                ctx.fillText("Siguiente palabra",760,380);
            } else {
                ctx.fillText("Perdiste, la palabra era: ", 110, 280);
            }

            ctx.font = "bold 80px Courier";
            lon = (canvas.width - (palabra.length * 48)) / 2;
            ctx.fillText(palabra, lon, 380);
            ahorcado.horca(errores);
        },
        play: function () {
            // Detectar si se a cargado nuestro contexco en el canvas, iniciamos las funciones necesarias para jugar o se le manda msj de error segun sea el caso 
            ctx.clearRect(0, 0, canvas.width, canvas.height);    
            ahorcado.teclado();
                ahorcado.pintaPalabra();
                ahorcado.horca(errores);
                canvas.addEventListener("click", ahorcado.selecciona, false);
                console.log("entra a play");
        }
    }
    ahorcado.play(true);
}

window.onload = function () {
    app();
}