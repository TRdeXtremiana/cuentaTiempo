import confetti from 'canvas-confetti';

const Confetti = () => {
	useEffect(() => {
		confetti({
			particleCount: 100,
			angle: 90,
			spread: 180,
			origin: { x: 0.5, y: 0.5 },
			colors: ['#ff0000', '#00ff00', '#0000ff', '#ff0'],
		});
	}, []);

	return null; // Este componente no tiene un UI visible, solo se encarga de lanzar confeti
};

export default Confetti;
