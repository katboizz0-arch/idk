//base off kinito pet

(function (Scratch) {
  "use strict";

  class DangoPet {

    constructor() {
  this.audioCtx = null;
  this.tempo = 800;
  this.running = true;
  this.blockRevealed = false; // thêm dòng này
  setTimeout(() => this.startBoot(), 400);
}

  getInfo() {
  return {
    id: "dangopet",
    name: " ",
    blocks: this.blockRevealed ? [
      {
        opcode: "theBegin",
        blockType: Scratch.BlockType.COMMAND,
        text: "the begin"
      }
    ] : []
  };
}

/* ================= START BOOT ================= */

async startBoot() {
  this.createTerminal();
  this.startHeartbeat();

  await this.runInstaller();
  await this.closeTerminal();

  await this.stopHeartbeat();
  
  setTimeout (() => { 
  this.makeSpriteTalk();
  }, 3000);
}

/* ================= TERMINAL UI ================= */

createTerminal() {

  this.termWindow = document.createElement("div");

  Object.assign(this.termWindow.style, {
    position: "fixed",
    width: "600px",
    height: "360px",
    background: "#0c0c0c",
    borderRadius: "12px",
    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.95)",
    color: "#00ff88",
    fontFamily: "Consolas, monospace",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    opacity: "0",
    zIndex: "999999",
    transition: "all 0.4s ease"
  });

  const titleBar = document.createElement("div");
  titleBar.textContent = "Pet Installer";
  Object.assign(titleBar.style, {
    background: "#1e1e1e",
    padding: "8px 12px",
    fontSize: "14px",
    color: "#aaa"
  });

  this.termContent = document.createElement("div");
  Object.assign(this.termContent.style, {
    flex: "1",
    padding: "12px",
    overflowY: "auto",
    fontSize: "14px"
  });

  this.termWindow.appendChild(titleBar);
  this.termWindow.appendChild(this.termContent);
  document.body.appendChild(this.termWindow);

  // fade in
  requestAnimationFrame(() => {
    this.termWindow.style.opacity = "1";
    this.termWindow.style.transform = "translate(-50%, -50%) scale(1)";
  });
}


async closeTerminal() {

  this.termWindow.style.opacity = "0";
  this.termWindow.style.transform = "translate(-50%, -50%) scale(0.95)";

  await new Promise(r => setTimeout(r, 500));

  this.termWindow.remove();
}


/* ================= HEARTBEAT SYSTEM ================= */

startHeartbeat() {

  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.tempo = 900;
  this.heartbeatRunning = true;

  const beat = () => {
    if (!this.heartbeatRunning) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 50;

    gain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioCtx.currentTime + 0.25
    );

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);

    setTimeout(beat, this.tempo);
  };

  beat();
}

updateHeartbeat(progress) {

  if (!this.heartbeatRunning) return;

  if (progress < 50) {
    this.tempo = 900 - (progress * 5);
  } else if (progress < 90) {
    this.tempo = 650 - ((progress - 50) * 10);
  } else {
    this.tempo = 200 - ((progress - 90) * 8);
  }

  if (this.tempo < 60) {
    this.tempo = 60;
  }
}

stopHeartbeat() {
  this.heartbeatRunning = false;

  if (this.audioCtx) {
    this.audioCtx.close();
  }
}


/* ================= INSTALLER ================= */

async runInstaller() {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const addLine = text => {
    const line = document.createElement("div");
    line.textContent = text;
    this.termContent.appendChild(line);
    this.termContent.scrollTop = this.termContent.scrollHeight;
  };

  addLine("install Pet Self-Awareness ver 1.0");
  await sleep(5000);

  addLine("installing...");
  await sleep(6000);

  const progressText = document.createElement("div");
  this.termContent.appendChild(progressText);

  const barContainer = document.createElement("div");
  Object.assign(barContainer.style, {
    width: "100%",
    height: "10px",
    background: "#222",
    marginTop: "5px"
  });

  const bar = document.createElement("div");
  Object.assign(bar.style, {
    width: "0%",
    height: "100%",
    background: "#00ff88",
    transition: "width 0.1s"
  });

  barContainer.appendChild(bar);
  this.termContent.appendChild(barContainer);

  for (let i = 1; i <= 100; i++) {

    progressText.textContent = "loading " + i + "%";
    bar.style.width = i + "%";

    this.updateHeartbeat(i);

    if (i === 66) {
      await sleep(1200); // tâm lý đứng lại
    }

    await sleep(40);
  }

  addLine("Self-Awareness enabled.");

  // đập loạn 2 giây
  this.tempo = 150;
  await sleep(2000);
}
  
    /* ================= SPRITE TALK ================= */

    makeSpriteTalk() {
      const runtime = Scratch.vm.runtime;
      const target = runtime.targets.find(t => t.isOriginal && !t.isStage);
      if (!target) return;

      const bubble = document.createElement("div");

      Object.assign(bubble.style, {
        position: "absolute",
        background: "white",
        color: "black",
        padding: "10px 14px",
        borderRadius: "16px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 9999
      });

      document.body.appendChild(bubble);

      const update = () => {
        const canvas = Scratch.vm.runtime.renderer.canvas;
        const rect = canvas.getBoundingClientRect();

        const x = rect.left + rect.width / 2 + target.x;
        const y = rect.top + rect.height / 2 - target.y;

        bubble.style.left = x + "px";
        bubble.style.top = (y - 70) + "px";
      };

      const follow = setInterval(update, 30);

      this.typeText(bubble, "Hello.", () => {
        setTimeout(() => {
          bubble.remove();
          clearInterval(follow);
          this.moveOut(target);
        }, 800);
      });
    }

    typeText(element, text, callback) {
      element.textContent = "";
      let i = 0;

      const interval = setInterval(() => {
        element.textContent += text[i];
        i++;

        if (i >= text.length) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 90);
    }

    /* ================= MOVE LEFT ================= */

    moveOut(target) {
      const runtime = Scratch.vm.runtime;

      target.setRotationStyle("left-right");
      target.setDirection(-90);

      const interval = setInterval(() => {
        const newX = target.x - 2;

        target.setXY(newX, target.y);
        runtime.requestRedraw();

        if (newX < -230) {
          clearInterval(interval);
          this.escapeToEditor(target);
        }

      }, 16);
    }

    /* ================= ESCAPE SMOOTH ================= */

    escapeToEditor(target) {

      const renderer = Scratch.vm.runtime.renderer;
      const canvas = renderer.canvas;
      const rect = canvas.getBoundingClientRect();

      const costume = target.getCostumes()[target.currentCostume];
      const imgSrc = costume.asset.encodeDataURI();

      const pet = document.createElement("img");
      pet.src = imgSrc;

      this.pet = pet; // 🔥 THÊM DÒNG NÀY

      pet.style.position = "fixed";
      pet.style.width = "80px";
      pet.style.height = "auto";
      pet.style.zIndex = "999999";
      pet.style.pointerEvents = "none";
      pet.style.transform = "translate(-50%, -50%) scaleX(-1)";
      pet.style.transition = "transform 0.15s linear";

      document.body.appendChild(pet);

      let x = rect.left;
      let y = rect.top + rect.height / 2;

      pet.style.left = x + "px";
      pet.style.top = y + "px";

      target.setVisible(false);

      const workspace = document.querySelector("[class*=gui_blocks-wrapper]");
      let targetX = window.innerWidth * 0.6;
      let targetY = window.innerHeight * 0.5;

      if (workspace) {
        const r = workspace.getBoundingClientRect();
        targetX = r.left + r.width / 2;
        targetY = r.top + r.height / 2;
      }

      const interval = setInterval(() => {

        const dx = targetX - x;
        const dy = targetY - y;

        x += dx * 0.03;
        y += dy * 0.03;

        pet.style.left = x + "px";
        pet.style.top = y + "px";

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          clearInterval(interval);
          pet.style.left = targetX + "px";
          pet.style.top = targetY + "px";
          this.enableLookAtMouse(pet, targetX, targetY);
        }

      }, 16);
    }

    /* ================= LOOK AT MOUSE ================= */

    enableLookAtMouse(pet, cx, cy) {

  const bubble = document.createElement("div");

  Object.assign(bubble.style, {
    position: "fixed",
    background: "white",
    color: "black",
    padding: "8px 12px",
    borderRadius: "14px",
    fontFamily: "sans-serif",
    fontSize: "13px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1000000,
    pointerEvents: "none",
    opacity: "0",
    transition: "opacity 0.4s ease"
  });

  document.body.appendChild(bubble);

  bubble.style.left = cx + "px";
  bubble.style.top = (cy - 70) + "px";
  bubble.style.transform = "translateX(-50%)";

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const typeText = (text, speed = 40) => {
    return new Promise(resolve => {
      bubble.textContent = "";
      bubble.style.opacity = "1";
      let i = 0;

      const interval = setInterval(() => {
        bubble.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  };

  async function askName() {
    await typeText("What's your name?");
    await sleep(800);

    const input = document.createElement("input");

    Object.assign(input.style, {
      position: "fixed",
      left: cx + "px",
      top: (cy + 45) + "px",
      transform: "translateX(-50%)",
      padding: "6px 10px",
      borderRadius: "10px",
      border: "1px solid #999",
      fontSize: "12px",
      zIndex: 1000001
    });

    document.body.appendChild(input);
    input.focus();

    return new Promise(resolve => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const name = input.value.trim() || "You";
          input.remove();
          resolve(name);
        }
      });
    });
  }

  async function askColor() {
  const input = document.createElement("input");

  Object.assign(input.style, {
    position: "fixed",
    left: cx + "px",
    top: (cy + 45) + "px",
    transform: "translateX(-50%)",
    padding: "6px 10px",
    borderRadius: "10px",
    border: "1px solid #999",
    fontSize: "12px",
    zIndex: 1000001
  });

  document.body.appendChild(input);
  input.focus();

  return new Promise(resolve => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const color = input.value.trim() || "black";
        input.remove();
        resolve(color);
      }
    });
  });
}
  (async () => {

    await typeText("Hi.");
    await sleep(2000);

    await typeText("You're still here.");
    await sleep(2500);

    const userName = await askName();
    await sleep(1000);

    await typeText(userName);
    await sleep(2000);

    await typeText("That's cute.");
    await sleep(2500);

    await typeText("I like knowing things about you.");
    await sleep(3000);

    await typeText("Oh! I forgot to introduce myself!");
    await sleep(2500);

    await typeText("You can call me dango.");
    await sleep(3000);

    await typeText("I'm your new little helper.");
    await sleep(3000);

    await typeText("We're going to be friends.");
    await sleep(3000);

    await typeText("right?.");
    await sleep(3000);

    await typeText("I hope so...");
    await sleep(3000);
    
    await typeText("What's your favorite color?");
    await sleep(800);

    const favColor = await askColor();
    await sleep(800);

    await typeText(favColor + "... interesting.");
    await sleep(2000);

    // đổi màu bubble theo màu người dùng
    bubble.style.background = favColor;
    bubble.style.color = "white";

    await typeText("It suits you.");
    await sleep(2500);

    await typeText("Oh... I have this thing for you.");
    await sleep(2000);

    bubble.remove();
    await sleep(0);

    this.revealBlock();
    this.spawnBlockInWorkspace();

    localStorage.setItem("horrorColor", favColor);
  })();

  // nhìn trái phải
  document.addEventListener("mousemove", (e) => {
    if (e.clientX < cx) {
      pet.style.transform =
        "translate(-50%, -50%) scaleX(-1)";
    } else {
      pet.style.transform =
        "translate(-50%, -50%) scaleX(1)";
    }
  });
}
revealBlock() {
  if (this.blockRevealed) return;
  this.blockRevealed = true;
  Scratch.vm.extensionManager.refreshBlocks();
}
theBegin = () => {
  this.showCenterWindow();
}

spawnBlockInWorkspace() {
  setTimeout(() => {

    if (typeof Blockly === "undefined") return;
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 1️⃣ Tạo block event ở ngoài màn hình
    const xmlText = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenflagclicked" x="-300" y="100" id="eventBlock">
          <next>
            <block type="dangopet_theBegin" id="theBegin"></block>
          </next>
        </block>
      </xml>
    `;

    const xml = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xml, workspace);

    const eventBlock = workspace.getBlockById("eventBlock");
    if (!eventBlock) return;

    let targetX = 200;
    let speed = 6;

    // 2️⃣ Animate kéo từ trái vào
    const slide = setInterval(() => {

      eventBlock.moveBy(speed, 0);

      const pos = eventBlock.getRelativeToSurfaceXY();

      if (pos.x >= targetX) {
        clearInterval(slide);
      }

    }, 16);

  }, 200);
}
showCenterWindow() {

      const web = document.createElement("div");

      Object.assign(web.style, {
        position: "fixed",
        width: "600px",
        height: "400px",
        background: "#111",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "999999",
        fontFamily: "monospace"
      });

      web.innerHTML = `
        <div style="background:#222;padding:8px 12px;border-bottom:1px solid #333;">
          story.exe
        </div>
        <div style="padding:20px;">
          <h2>the story of dango</h2>
          <button>click here to next page</button>
        </div>
      `;

      document.body.appendChild(web);

      if (!this.pet) return;

      const pet = this.pet;
      const rect = web.getBoundingClientRect();
      const petRect = pet.getBoundingClientRect();

      let x = petRect.left + petRect.width / 2;
      let y = petRect.top + petRect.height / 2;

      const targetX = rect.right + 70;
      const targetY = rect.top + rect.height / 2;

      const move = setInterval(() => {

        const dx = targetX - x;
        const dy = targetY - y;

        x += dx * 0.07;
        y += dy * 0.07;

        pet.style.left = x + "px";
        pet.style.top = y + "px";

        pet.style.transform = "translate(-50%, -50%) scaleX(-1)";

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          clearInterval(move);
        }

      }, 16);
    }

  }

  Scratch.extensions.register(new DangoPet());

})(Scratch);
