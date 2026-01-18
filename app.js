const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let selectedNode = null;

function addNode(type) {
    nodes.push({
        id: Date.now(),
        type: type,
        x: 50 + nodes.length * 120,
        y: 100,
        data: type === "Prompt" ? "Enter prompt here" : ""
    });
    draw();
}

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedNode = nodes.find(n =>
        x > n.x && x < n.x + 100 && y > n.y && y < n.y + 50
    );
});

canvas.addEventListener("mousemove", (e) => {
    if (!selectedNode) return;
    const rect = canvas.getBoundingClientRect();
    selectedNode.x = e.clientX - rect.left - 50;
    selectedNode.y = e.clientY - rect.top - 25;
    draw();
});

canvas.addEventListener("mouseup", () => selectedNode = null);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(n => {
        ctx.fillStyle = "#e3e3ff";
        ctx.fillRect(n.x, n.y, 100, 50);
        ctx.strokeRect(n.x, n.y, 100, 50);
        ctx.fillStyle = "#000";
        ctx.fillText(n.type, n.x + 10, n.y + 25);
    });
}

async function saveAgent() {
    await fetch("http://localhost:8000/save_agent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: "my_agent",
            nodes: nodes,
            edges: edges
        })
    });
    alert("Agent saved");
}

async function runAgent() {
    const res = await fetch("http://localhost:8000/run_agent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: "my_agent",
            nodes: nodes,
            edges: edges
        })
    });
    const data = await res.json();
    document.getElementById("output").textContent = data.result;
}

draw();
