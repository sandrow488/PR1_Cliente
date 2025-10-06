function Iniciar() {
    const id = document.getElementById('Nombre').value;
    window.alert("Bienvenido " + id)
    localStorage.setItem('nombreUsuario', id);
}

let MixtPreguntas = [];
let Pacertadas = 0;
let tandaActual = 1;

function EnviarRespuestas() {
    if (tandaActual === 1) {
        corregirPrimeraTanda();
    } else if (tandaActual === 2) {
        corregirSegundaTanda();
    }
}

function corregirPrimeraTanda() {
    const q1sel = document.querySelector('input[name="q0"]:checked');
    const q2sel = document.querySelector('input[name="q1"]:checked');

    if (!q1sel || !q2sel) {
        alert('Te falta alguna pregunta ');
        return;
    }

    if (q1sel.value === MixtPreguntas[0].correct) Pacertadas++;
    if (q2sel.value === MixtPreguntas[1].correct) Pacertadas++;

    if (Pacertadas === 2) {
        alert("Has acertado todas las preguntas");
    } else if (Pacertadas === 1) {
        alert("Has acertado una pregunta");
    } else {
        alert("No has acertado ninguna pregunt casiiiii ");
    }
    document.querySelectorAll('#lista-preguntas input').forEach(input => input.disabled = true);

    NuevasPreguntas();

    tandaActual = 2;
}

function corregirSegundaTanda() {
    const q1sel = document.querySelector('input[name="q2"]:checked');
    const q2sel = document.querySelector('input[name="q3"]:checked');

    if (!q1sel || !q2sel) {
        alert('Te falta alguna pregunta');
        return;
    }

    if (q1sel.value === MixtPreguntas[2].correct) Pacertadas++;
    if (q2sel.value === MixtPreguntas[3].correct) Pacertadas++;

    alert("¡Has terminado todas las preguntas!");

    document.querySelectorAll('#lista-preguntas2 input').forEach(input => input.disabled = true);
    MostrarResultados();
}




function cargarJSON() {
    const listaPreguntas = document.getElementById('lista-preguntas');
    let objetoHTML = '';

    const primerasDosPreguntas = MixtPreguntas.slice(0, 2);

    primerasDosPreguntas.forEach((pregunta, index) => {

        objetoHTML += `
            <div class="pregunta">

                <h2>${pregunta.question}</h2>
                <ul>
                    <p><input type="radio" name="q${index}" value="a"> ${pregunta.options.A}</p>
                    <p><input type="radio" name="q${index}" value="b"> ${pregunta.options.B}</p>
                    <p><input type="radio" name="q${index}" value="c"> ${pregunta.options.C}</p>
                    <p><input type="radio" name="q${index}" value="d"> ${pregunta.options.D}</p>
                </ul>
            </div>
        `;
    });

    listaPreguntas.innerHTML = objetoHTML;
}



function NuevasPreguntas() {
    const listaPreguntas2 = document.getElementById('lista-preguntas2');
    let objetoHTML = '';
    const indiceInicial = 2;
    const siguientesPreguntas = MixtPreguntas.slice(indiceInicial, indiceInicial + 2);
    siguientesPreguntas.forEach((pregunta, index) => {
        const indicePregunta = indiceInicial + index;
        objetoHTML += `
            <div class="pregunta">
                <h2>${pregunta.question}</h2>
                <ul>
                    <p><input type="radio" name="q${indicePregunta}" value="a"> ${pregunta.options.A}</p>
                    <p><input type="radio" name="q${indicePregunta}" value="b"> ${pregunta.options.B}</p>
                    <p><input type="radio" name="q${indicePregunta}" value="c"> ${pregunta.options.C}</p>
                    <p><input type="radio" name="q${indicePregunta}" value="d"> ${pregunta.options.D}</p>
                </ul>
            </div>
        `;
    });
    listaPreguntas2.innerHTML = objetoHTML;
}

function MostrarResultados() {
    let Usuario = localStorage.getItem('nombreUsuario');
    const contenedor = document.getElementById('Acertadas');
    const botonEnviar = document.getElementById('botonEnviar');

    if (botonEnviar) {
        botonEnviar.style.display = 'none';
    }
    let noacertadas = 4 - Pacertadas;
    let Aprobado = '';
    if (noacertadas <= 2) {
        Aprobado = '../media/tick.jpg';
    } else {
        Aprobado = '../media/cruz.jpg';
    }
    contenedor.innerHTML = `
        <h2>Usuario: ${Usuario}</h2>
        <h2>Has acertado ${Pacertadas} preguntas.</h2>
        <h2>Has fallado ${noacertadas} preguntas.</h2>
        <img src="${Aprobado}" alt="Imagen de resultado">
        <h2>Gracias por participar en el cuestionario.</h2>
        <Button onclick="location.reload()">Volver a empezar</Button>
    `;
}

window.onload = function() {
    fetch('preguntas.json')
        .then(response => response.json())
        .then(data => {
            MixtPreguntas = data.questions.sort(() => Math.random() - 0.5);
            cargarJSON();
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
};