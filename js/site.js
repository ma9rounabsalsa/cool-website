(function(){
  "use strict";

  /* ---------- curtain / enter ---------- */
  var curtain = document.getElementById("curtain");
  var main = document.getElementById("main");
  var audio = document.getElementById("audio");
  var enterBtn = document.getElementById("enter");

  enterBtn.addEventListener("click", function(){
    curtain.classList.add("hidden");
    main.classList.add("visible");
    main.setAttribute("aria-hidden", "false");
    audio.volume = 0.35;
    audio.play().catch(function(){ /* autoplay may be blocked, that's fine :) */ });
    updateSoundUI();
  });

  /* ---------- sound toggle ---------- */
  var soundBtn = document.getElementById("sound-toggle");
  var soundLabel = document.getElementById("sound-label");

  function updateSoundUI(){
    var playing = !audio.paused;
    soundBtn.setAttribute("aria-pressed", String(playing));
    soundLabel.textContent = playing ? "turn volume off" : "turn volume on";
  }

  soundBtn.addEventListener("click", function(){
    if (audio.paused){
      audio.play().catch(function(){});
    } else {
      audio.pause();
    }
    updateSoundUI();
  });

  /* ---------- thread ---------- */
  var THREAD = [
    { author: "M", date: "14 sept. 2026", text: "irani lover" },
    { author: "M", date: "15 sept. 2025", text: "meow" }
  ];

  var threadList = document.getElementById("thread-list");
  var PALETTE = ["#ffffff", "#d9d9d9", "#bdbdbd"];

  function renderThread(){
    if (!threadList) return;
    threadList.innerHTML = "";

    THREAD.forEach(function(entry, i){
      var color = PALETTE[i % PALETTE.length];

      var card = document.createElement("article");
      card.className = "gb-entry";

      var avatar = document.createElement("span");
      avatar.className = "gb-avatar";
      avatar.style.background = color;
      avatar.textContent = (entry.author || "?").trim().charAt(0).toUpperCase() || "?";

      var body = document.createElement("div");
      body.className = "gb-body";

      var text = document.createElement("p");
      text.className = "gb-entry-text";
      text.textContent = entry.text;
      body.appendChild(text);

      if (entry.author || entry.date){
        var meta = document.createElement("div");
        meta.className = "gb-entry-meta";
        var who = document.createElement("span");
        who.className = "who";
        who.style.color = color;
        who.textContent = entry.author || "anonyme";
        meta.appendChild(who);
        if (entry.date){
          var sep = document.createElement("span");
          sep.className = "sep";
          sep.textContent = "·";
          var date = document.createElement("span");
          date.textContent = entry.date;
          meta.appendChild(sep);
          meta.appendChild(date);
        }
        body.appendChild(meta);
      }

      card.appendChild(avatar);
      card.appendChild(body);
      threadList.appendChild(card);
    });
  }

  renderThread();

  /* ---------- sparkle cursor trail ---------- */
  var canvas = document.getElementById("sparkle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion){
    var ctx = canvas.getContext("2d");
    var particles = [];
    var w, h;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x, y){
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.6 + 0.3,
        life: 1,
        size: Math.random() * 2 + 1.2
      });
      if (particles.length > 120) particles.shift();
    }

    var lastSpawn = 0;
    window.addEventListener("pointermove", function(e){
      var now = performance.now();
      if (now - lastSpawn < 30) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    });

    function tick(){
      ctx.clearRect(0, 0, w, h);
      for (var i = particles.length - 1; i >= 0; i--){
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        if (p.life <= 0){
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = "#e6d6ff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

})();
