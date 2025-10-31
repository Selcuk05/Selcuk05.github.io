class NeuralNetworkBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-bg';
        this.ctx = this.canvas.getContext('2d');

        this.layers = [];
        this.particles = [];
        this.time = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.buildNetwork();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.buildNetwork();
    }

    buildNetwork() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        const architecture = [4, 6, 6, 4];
        const layerSpacing = w / (architecture.length + 1);

        this.layers = [];
        this.connections = [];

        for (let l = 0; l < architecture.length; l++) {
            const layerNodes = [];
            const numNodes = architecture[l];
            const nodeSpacing = h / (numNodes + 1);
            const x = layerSpacing * (l + 1);

            for (let n = 0; n < numNodes; n++) {
                const y = nodeSpacing * (n + 1);
                layerNodes.push({ x, y });
            }
            this.layers.push(layerNodes);
        }

        this.connections = [];
        for (let l = 0; l < this.layers.length - 1; l++) {
            const currentLayer = this.layers[l];
            const nextLayer = this.layers[l + 1];

            for (let i = 0; i < currentLayer.length; i++) {
                for (let j = 0; j < nextLayer.length; j++) {
                    this.connections.push({
                        from: currentLayer[i],
                        to: nextLayer[j],
                        particles: []
                    });
                }
            }
        }
    }

    createParticle() {
        if (Math.random() > 0.98) {
            const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            connection.particles.push({
                progress: 0,
                speed: 0.005 + Math.random() * 0.01
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 5;

        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();

            conn.particles = conn.particles.filter(particle => {
                particle.progress += particle.speed;

                if (particle.progress >= 1) return false;

                const x = conn.from.x + (conn.to.x - conn.from.x) * particle.progress;
                const y = conn.from.y + (conn.to.y - conn.from.y) * particle.progress;

                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 4);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                this.ctx.fill();

                return true;
            });
        });

        this.layers.forEach((layer, layerIdx) => {
            layer.forEach((node, nodeIdx) => {
                const pulse = Math.sin(this.time * 2 + layerIdx + nodeIdx) * 0.3 + 0.7;

                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.5})`;
                this.ctx.fill();

                this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulse * 0.3})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });
        });
    }

    animate() {
        this.createParticle();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class TurkishFlag {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 400;
        this.height = 267;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.time = 0;
        this.waveAmplitude = 12;
        this.waveFrequency = 0.02;

        this.drawFlag();
        this.originalFlag = this.ctx.getImageData(0, 0, this.width, this.height);

        this.animate();
    }

    drawFlag() {
        this.ctx.fillStyle = '#E30A17';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const flagCenterX = this.width * 0.425;
        const flagCenterY = this.height / 2;
        const moonRadius = this.height * 0.28;

        this.ctx.fillStyle = '#FFFFFF';

        this.ctx.beginPath();
        this.ctx.arc(flagCenterX, flagCenterY, moonRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#E30A17';
        this.ctx.beginPath();
        this.ctx.arc(flagCenterX + moonRadius * 0.35, flagCenterY, moonRadius * 0.75, 0, Math.PI * 2);
        this.ctx.fill();

        const starCenterX = flagCenterX + moonRadius * 1.05;
        const starCenterY = flagCenterY;
        const starOuterRadius = this.height * 0.14;
        const starInnerRadius = starOuterRadius * 0.382;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();

        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? starOuterRadius : starInnerRadius;
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const x = starCenterX + Math.cos(angle) * radius;
            const y = starCenterY + Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    applyDithering() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;

        const grayscale = new Float32Array(this.width * this.height);
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
            grayscale[i / 4] = gray;
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = y * this.width + x;
                const oldPixel = grayscale[idx];

                const threshold = 140;
                const newPixel = oldPixel < threshold ? 0 : 255;
                grayscale[idx] = newPixel;

                const error = oldPixel - newPixel;

                if (x + 1 < this.width) {
                    grayscale[idx + 1] += error * 7 / 16;
                }
                if (y + 1 < this.height) {
                    if (x > 0) {
                        grayscale[idx + this.width - 1] += error * 3 / 16;
                    }
                    grayscale[idx + this.width] += error * 5 / 16;
                    if (x + 1 < this.width) {
                        grayscale[idx + this.width + 1] += error * 1 / 16;
                    }
                }
            }
        }

        for (let i = 0; i < grayscale.length; i++) {
            const value = grayscale[i] > 127 ? 255 : 0;
            const idx = i * 4;
            data[idx] = value;
            data[idx + 1] = value;
            data[idx + 2] = value;
            data[idx + 3] = 255;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    applyWaveEffect() {
        const originalImageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const outputImageData = this.ctx.createImageData(this.width, this.height);

        for (let i = 0; i < outputImageData.data.length; i += 4) {
            outputImageData.data[i] = 0;
            outputImageData.data[i + 1] = 0;
            outputImageData.data[i + 2] = 0;
            outputImageData.data[i + 3] = 255;
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const normalizedX = x / this.width;
                const amplitudeFactor = Math.sin(normalizedX * Math.PI);
                const waveOffset = Math.sin(x * this.waveFrequency + this.time) * this.waveAmplitude * amplitudeFactor;
                const sourceY = Math.floor(y + waveOffset);

                if (sourceY >= 0 && sourceY < this.height) {
                    const sourceIdx = (sourceY * this.width + x) * 4;
                    const destIdx = (y * this.width + x) * 4;

                    outputImageData.data[destIdx] = originalImageData.data[sourceIdx];
                    outputImageData.data[destIdx + 1] = originalImageData.data[sourceIdx + 1];
                    outputImageData.data[destIdx + 2] = originalImageData.data[sourceIdx + 2];
                    outputImageData.data[destIdx + 3] = originalImageData.data[sourceIdx + 3];
                }
            }
        }

        this.ctx.putImageData(outputImageData, 0, 0);
    }

    animate() {
        this.time += 0.03;

        this.ctx.putImageData(this.originalFlag, 0, 0);

        this.applyWaveEffect();

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetworkBackground();
    new TurkishFlag('flag-canvas');
});

document.addEventListener('mousemove', (e) => {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    terminal.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
});

document.addEventListener('mouseleave', () => {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    terminal.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
});
