// Variables globales
let horaSeleccionada = '14:30'; // Valor por defecto
let confetiLanzado = false;
const barra = document.getElementById('barraProgreso');
const porcentajeElemento = document.getElementById('porcentaje');
const tiempoRestanteElemento = document.getElementById('tiempoRestante');
const hastaDiaElemento = document.getElementById('hastaDia');
const horaElemento = document.getElementById('hora');

// Función para obtener la hora en tiempo real con la zona horaria de España
function obtenerHoraActual() {
	const opciones = {
		timeZone: 'Europe/Madrid',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	};
	return new Date().toLocaleTimeString('es-ES', opciones);
}

// Función para actualizar la hora en el DOM
function actualizarHora() {
	horaElemento.textContent = obtenerHoraActual();
}

// Función para calcular la siguiente hora seleccionada
function calcularSiguienteHora(horaSeleccionada) {
	const ahora = new Date();
	const [hora, minuto] = horaSeleccionada.split(':').map(num => parseInt(num));
	const siguienteHora = new Date();

	if (ahora.getHours() > hora || (ahora.getHours() === hora && ahora.getMinutes() >= minuto)) {
		siguienteHora.setDate(siguienteHora.getDate() + 1); // Si ya pasó, calcular para mañana
	}
	siguienteHora.setHours(hora, minuto, 0, 0); // Establecer la hora seleccionada
	return siguienteHora;
}

// Función para calcular el tiempo restante hasta la siguiente hora
function calcularTiempoRestante(siguienteHora) {
	const ahora = new Date();
	const diferencia = siguienteHora - ahora;
	const horasRestantes = Math.floor(diferencia / 1000 / 60 / 60);
	const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
	const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

	return { horasRestantes, minutosRestantes, segundosRestantes };
}

// Función para formatear el tiempo a dos dígitos
function formatearTiempo(tiempo) {
	return tiempo < 10 ? `0${tiempo}` : tiempo;
}

// Función para actualizar el cronómetro y calcular el tiempo restante
function actualizarCronometro() {
	const siguienteHora = calcularSiguienteHora(horaSeleccionada);
	const { horasRestantes, minutosRestantes, segundosRestantes } = calcularTiempoRestante(siguienteHora);

	// Mostrar el tiempo restante con formato 00:00:00
	tiempoRestanteElemento.textContent = `${formatearTiempo(horasRestantes)}:${formatearTiempo(minutosRestantes)}:${formatearTiempo(segundosRestantes)}`;

	// Mostrar el día de la próxima hora seleccionada
	let siguienteDiaTexto;
	const ahora = new Date();
	if (ahora.getHours() < siguienteHora.getHours() || (ahora.getHours() === siguienteHora.getHours() && ahora.getMinutes() < siguienteHora.getMinutes())) {
		siguienteDiaTexto = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][ahora.getDay()];
	} else {
		siguienteDiaTexto = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][(ahora.getDay() + 1) % 7]; // Día siguiente
	}
	hastaDiaElemento.textContent = `Hasta las ${horaSeleccionada} del ${siguienteDiaTexto}`;
}

// Función para actualizar la barra de progreso según el tiempo restante
function actualizarBarraProgreso() {
	const siguienteHora = calcularSiguienteHora(horaSeleccionada);
	const tiempoRestante = siguienteHora - new Date();

	// Calcular el porcentaje de progreso de la barra
	const tiempoTotal = 1000 * 60 * 60 * 24; // Total de 24 horas en milisegundos
	const porcentaje = ((tiempoRestante / tiempoTotal) * 100).toFixed(2); // Mostrar hasta dos decimales

	// Actualizar el ancho de la barra de progreso
	barra.style.width = `${porcentaje}%`;

	// Actualizar el porcentaje mostrado en la barra (formato 00,00%)
	porcentajeElemento.textContent = `${porcentaje}%`;

	// Cambiar el color de la barra y del texto según el progreso
	if (porcentaje > 50) {
		barra.classList.remove('amarilla', 'verde');
		barra.classList.add('roja');
		tiempoRestanteElemento.style.color = '#e74c3c'; // Rojo
	} else if (porcentaje > 25) {
		barra.classList.remove('verde', 'roja');
		barra.classList.add('amarilla');
		tiempoRestanteElemento.style.color = '#f1c40f'; // Amarillo
	} else {
		barra.classList.remove('roja', 'amarilla');
		barra.classList.add('verde');
		tiempoRestanteElemento.style.color = '#2ecc71'; // Verde
	}

	// Cuando la barra llegue al 0% y falten menos de 3 segundos, mostrar el efecto de confeti
	if (porcentaje <= 0.00 && !confetiLanzado) {
		const { segundosRestantes } = calcularTiempoRestante(siguienteHora);
		if (segundosRestantes <= 1) { // Solo lanzar confeti en el último segundo
			confetiLanzado = true; // Evitar que se lance más de una vez
			lanzarConfeti();
			console.log(`Hora fin: ${siguienteHora.toLocaleTimeString('es-ES')}`);
		}
	}
}

// Función para lanzar el confeti
function lanzarConfeti() {
	confetti({
		particleCount: 100,
		angle: 90,
		spread: 180,
		origin: { x: 0.5, y: 0.5 }, // Confeti centrado
		colors: ['#ff0000', '#00ff00', '#0000ff', '#ff0'] // Colores del confeti
	});
}

// Llamar a la función cada segundo
setInterval(actualizarBarraProgreso, 1000);

// Actualizar la hora cada segundo
setInterval(actualizarHora, 1000);

// Actualizar el cronómetro y la barra de progreso cada segundo
setInterval(() => {
	actualizarCronometro();
	actualizarBarraProgreso();
}, 1000);

// Escuchar cambios en la selección de hora
document.getElementById('horaInput').addEventListener('input', (event) => {
	horaSeleccionada = event.target.value;
});
