// 1. Scroll Reveal UI Interactivity
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.reveal-trigger').forEach(el => observer.observe(el));

// 2. The 3D Neural Manifold Engine
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let width, height;

let nodes = [];
const numNodes = 600;

let scrollY = 0;
let targetScrollY = 0;
let flightSpeed = 0;

let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

window.addEventListener('scroll', () => { targetScrollY = window.scrollY; });

window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class NeuralNode {
    constructor() {
        this.x = (Math.random() - 0.5) * 4000;
        this.y = (Math.random() - 0.5) * 4000;
        this.z = Math.random() * 4000;
        this.baseSize = Math.random() * 2 + 1;
        this.isCore = Math.random() > 0.8;
    }

    update(zSpeed) {
        this.z -= (2 + zSpeed);
        if (this.z <= 0) {
            this.z = 4000;
            this.x = (Math.random() - 0.5) * 4000;
            this.y = (Math.random() - 0.5) * 4000;
        }
    }
}

function init3DSpace() {
    nodes = [];
    for (let i = 0; i < numNodes; i++) {
        nodes.push(new NeuralNode());
    }
}

function render3DSpace() {
    scrollY += (targetScrollY - scrollY) * 0.1;
    let currentScrollVel = targetScrollY - scrollY;
    flightSpeed = currentScrollVel * 0.3;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    let projectedNodes = [];

    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.update(flightSpeed);

        let fov = 400;
        let scale = fov / (fov + n.z);

        let shiftX = mouseX * (4000 - n.z) * 0.2;
        let shiftY = mouseY * (4000 - n.z) * 0.2;

        let x2d = (n.x + shiftX) * scale + width / 2;
        let y2d = (n.y + shiftY) * scale + height / 2;

        projectedNodes.push({
            x: x2d, y: y2d, z: n.z, scale: scale, isCore: n.isCore, baseSize: n.baseSize
        });
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < projectedNodes.length; i++) {
        let p1 = projectedNodes[i];
        if (p1.z > 2000) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
            let p2 = projectedNodes[j];
            if (p2.z > 2000) continue;

            let dx = nodes[i].x - nodes[j].x;
            let dy = nodes[i].y - nodes[j].y;
            let dz = nodes[i].z - nodes[j].z;
            let dist3D = dx * dx + dy * dy + dz * dz;

            if (dist3D < 150000) {
                let opacity = (1 - dist3D / 150000) * p1.scale * 2;
                if (opacity > 0) {
                    ctx.strokeStyle = p1.isCore || p2.isCore
                        ? `rgba(0, 229, 255, ${opacity * 0.5})`
                        : `rgba(157, 0, 255, ${opacity * 0.2})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    for (let i = 0; i < projectedNodes.length; i++) {
        let p = projectedNodes[i];
        let size = p.baseSize * p.scale * 2;
        let alpha = p.scale * 2;
        if (p.z < 100) alpha *= (p.z / 100);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.isCore
            ? `rgba(0, 229, 255, ${alpha})`
            : `rgba(157, 0, 255, ${alpha * 0.5})`;
        ctx.fill();
    }

    requestAnimationFrame(render3DSpace);
}

window.addEventListener('resize', resize);
resize();
init3DSpace();
render3DSpace();