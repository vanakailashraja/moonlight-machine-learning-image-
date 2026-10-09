let imageModelURL = 'https://teachablemachine.withgoogle.com/models/8klfdX02N/';

let classifier, video, label = "Ready", confidence = 0.0;
let cartItems = [];
let totalBill = 0;
let lastScannedItem = "";
let canScan = true;

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', video, () => classifyVideo());
}

function classifyVideo() { classifier.classify(gotResult); }

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
    processScan();
  }
  classifyVideo();
}

function processScan() {
  if (confidence > 0.85 && canScan) {
    let item = label.toLowerCase();
    if (item.includes("pen")) {
      addItem("Ballpoint Pen", 15);
    } else if (item.includes("bottle")) {
      addItem("Water Bottle", 25);
    } else if (item.includes("id")) {
      addItem("Student Badge Lanyard", 50);
    }
  }
}

function addItem(name, price) {
  cartItems.push(name + " - ₹" + price);
  totalBill += price;
  canScan = false;
  setTimeout(() => { canScan = true; }, 2000); // 2-second scan delay
}

function draw() {
  background(240);
  push(); translate(320, 0); scale(-1, 1);
  image(video, 0, 0, 320, 240);
  pop();

  // Receipt Panel
  fill(255); rect(330, 10, 300, 420, 8);
  fill(30); textAlign(LEFT, TOP); textSize(20);
  text("🛒 Digital Cart", 350, 25);
  stroke(200); line(350, 55, 610, 55); noStroke();

  textSize(14);
  let y = 70;
  for (let i = max(0, cartItems.length - 6); i < cartItems.length; i++) {
    text(cartItems[i], 350, y);
    y += 26;
  }

  stroke(200); line(350, 360, 610, 360); noStroke();
  textSize(20); fill(0, 140, 80);
  text("Total: ₹" + totalBill, 350, 380);

  // Bottom HUD
  fill(30); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Scanner: " + label + " (" + floor(confidence * 100) + "%)", 20, 480);
}
