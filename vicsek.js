const canvas = document.getElementById('simulation');
const ctx = canvas.getContext('2d');

// Parameters
let numAgents = 500;
let noise = 0.3;
let speed = 5;

// Agents array
let agents = [];

// Initialize agents
function initAgents() {
    agents = [];
    for (let i = 0; i < numAgents; i++) {
        agents.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * 2 * Math.PI,
        });
    }
}

// Update agents
function updateAgents() {
    const newAgents = [];
    for (let agent of agents) {
        // Compute average direction of neighbors
        let avgAngle = 0;
        let count = 0;

        for (let neighbor of agents) {
            const dx = neighbor.x - agent.x;
            const dy = neighbor.y - agent.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) { // Neighbor radius
                avgAngle += neighbor.angle;
                count++;
            }
        }

        if (count > 0) {
            avgAngle /= count;
        } else {
            avgAngle = agent.angle;
        }

        // Add noise
        avgAngle += (Math.random() - 0.5) * noise * 2 * Math.PI;

        // Update agent position and angle
        const newAngle = avgAngle;
        const newX = (agent.x + Math.cos(newAngle) * speed + canvas.width) % canvas.width;
        const newY = (agent.y + Math.sin(newAngle) * speed + canvas.height) % canvas.height;

        newAgents.push({ x: newX, y: newY, angle: newAngle });
    }

    agents = newAgents;
}

// Draw agents as arrowheads
function drawAgents() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let agent of agents) {
        drawArrow(agent.x, agent.y, agent.angle, speed * 5); // Arrow length proportional to speed
    }
}

// Function to draw an arrow
function drawArrow(x, y, angle, length) {
    const headLength = 10; // Length of arrowhead

    // Compute endpoint of the arrow shaft
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    // Draw the shaft
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(endX, endY);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

// Calculate order parameter
function calculateOrderParameter() {
    let vx = 0;
    let vy = 0;

    for (let agent of agents) {
        vx += Math.cos(agent.angle);
        vy += Math.sin(agent.angle);
    }

    const magnitude = Math.sqrt(vx * vx + vy * vy) / numAgents;
    return magnitude;
}

// Animation loop
function animate() {
    updateAgents();
    drawAgents();

    // Update order parameter
    const orderParameter = calculateOrderParameter();
    document.getElementById('orderParameter').innerText = orderParameter.toFixed(3);

    requestAnimationFrame(animate);
}

// Initialize and run
initAgents();
animate();

// Real-time parameter updates
document.getElementById('numAgents').addEventListener('input', (e) => {
    numAgents = parseInt(e.target.value);
    document.getElementById('numAgentsValue').innerText = numAgents;
    initAgents();
});

document.getElementById('noise').addEventListener('input', (e) => {
    noise = parseFloat(e.target.value);
    document.getElementById('noiseValue').innerText = noise.toFixed(2);
});

document.getElementById('speed').addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
    document.getElementById('speedValue').innerText = speed;
});
