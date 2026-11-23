const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const emptyState = document.getElementById("emptyState");
const scanButton = document.getElementById("scanButton");
const scanLine = document.getElementById("scanLine");
const canvas = document.getElementById("detectionCanvas");
const ctx = canvas.getContext("2d");

const sampleResults = [
  {
    name: "Printed Circuit Board",
    type: "Electronic component · E-waste",
    confidence: "96.4%",
    category: "Recyclable",
    material: "Copper, gold, silicon",
    recovery: "Metal recovery",
    decision: "Send to authorised e-waste recycler",
    note: "Contains recoverable metals. Avoid breaking or burning the board."
  },
  {
    name: "Lithium-ion Battery",
    type: "Energy storage · E-waste",
    confidence: "94.8%",
    category: "Special handling",
    material: "Lithium-based cell",
    recovery: "Battery material recovery",
    decision: "Keep separate for specialist collection",
    note: "Do not puncture, crush or place in regular household waste."
  },
  {
    name: "Electronic Cable",
    type: "Wire and cable · E-waste",
    confidence: "92.1%",
    category: "Recyclable",
    material: "Copper, PVC insulation",
    recovery: "Copper recovery",
    decision: "Send to authorised cable recycler",
    note: "Do not burn insulation to recover metal."
  },
  {
    name: "Old Smartphone",
    type: "Consumer electronics · E-waste",
    confidence: "97.2%",
    category: "Recyclable",
    material: "Glass, aluminium, circuit board",
    recovery: "Component and material recovery",
    decision: "Send to authorised electronics recycler",
    note: "Remove personal data before recycling. Do not dismantle the battery."
  }
];

let currentImageUrl = null;
let scanIndex = 0;

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageUrl = URL.createObjectURL(file);
  previewImage.src = currentImageUrl;
  previewImage.style.display = "block";
  emptyState.style.display = "none";
  document.getElementById("fileName").textContent = file.name.toUpperCase();
  scanButton.disabled = false;
  document.getElementById("resultTitle").textContent = "Image ready";
  document.getElementById("resultSubtitle").textContent = "Run the demo scan to view a sample result";
  clearOverlay();
});

scanButton.addEventListener("click", () => {
  if (!previewImage.src) return;
  scanButton.disabled = true;
  scanLine.style.display = "block";
  document.getElementById("resultTitle").textContent = "Analysing image...";
  document.getElementById("resultSubtitle").textContent = "Demo scan in progress";
  setTimeout(() => {
    const result = sampleResults[scanIndex % sampleResults.length];
    scanIndex++;
    showResult(result);
    drawDemoBox();
    scanLine.style.display = "none";
    scanButton.disabled = false;
  }, 1300);
});

function showResult(result) {
  document.getElementById("resultTitle").textContent = "Detection complete";
  document.getElementById("resultSubtitle").textContent = "Sample classification displayed";
  document.getElementById("itemName").textContent = result.name;
  document.getElementById("itemType").textContent = result.type;
  document.getElementById("confidence").textContent = result.confidence;
  document.getElementById("specComponent").textContent = result.name;
  document.getElementById("specCategory").textContent = result.category;
  document.getElementById("specMaterial").textContent = result.material;
  document.getElementById("specRecovery").textContent = result.recovery;
  const decision = document.getElementById("decisionBox");
  decision.querySelector("b").textContent = result.decision;
  decision.querySelector("p").textContent = result.note;
  decision.querySelector(".decision-icon").textContent = "✓";
}

function drawDemoBox() {
  const rect = previewImage.getBoundingClientRect();
  const stage = document.getElementById("previewStage").getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = stage.width * dpr;
  canvas.height = stage.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const x = stage.width * 0.18;
  const y = stage.height * 0.16;
  const w = stage.width * 0.62;
  const h = stage.height * 0.66;
  ctx.strokeStyle = "#27b96d";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#10251de8";
  ctx.fillRect(x, Math.max(0, y - 28), 190, 28);
  ctx.fillStyle = "#c9ff8a";
  ctx.font = "bold 12px monospace";
  ctx.fillText("DEMO OBJECT  96.4%", x + 8, Math.max(18, y - 10));
  ctx.fillStyle = "#27b96d";
  [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([px,py]) => ctx.fillRect(px-3,py-3,6,6));
}

function clearOverlay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("clearButton").addEventListener("click", () => {
  imageInput.value = "";
  previewImage.removeAttribute("src");
  previewImage.style.display = "none";
  emptyState.style.display = "block";
  document.getElementById("fileName").textContent = "NO IMAGE SELECTED";
  document.getElementById("resultTitle").textContent = "Awaiting image";
  document.getElementById("resultSubtitle").textContent = "Upload an image to begin the demo scan";
  document.getElementById("itemName").textContent = "No component detected";
  document.getElementById("itemType").textContent = "Detection result will appear here";
  document.getElementById("confidence").textContent = "—";
  ["specComponent","specCategory","specMaterial","specRecovery"].forEach(id => document.getElementById(id).textContent = "—");
  document.getElementById("decisionBox").querySelector("b").textContent = "Awaiting classification";
  document.getElementById("decisionBox").querySelector("p").textContent = "Upload an image to view a sample sorting recommendation.";
  document.getElementById("decisionBox").querySelector(".decision-icon").textContent = "!";
  scanButton.disabled = true;
  scanLine.style.display = "none";
  clearOverlay();
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageUrl = null;
});

window.addEventListener("resize", () => {
  if (previewImage.style.display === "block" && document.getElementById("resultTitle").textContent === "Detection complete") drawDemoBox();
});
