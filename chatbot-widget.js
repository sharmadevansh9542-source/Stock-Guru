/**
 * StockGuru — Floating AI Chatbot Widget
 * Injects a floating chat button + slide-up panel (iframe) on any page.
 * Just include: <script src="chatbot-widget.js"></script> before </body>
 */
(function () {
  const CHATBOT_URL = "http://localhost:5173";

  /* ── Styles ── */
  const style = document.createElement("style");
  style.textContent = `
    /* Floating button */
    #sg-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      box-shadow: 0 6px 28px rgba(139,92,246,0.55);
      z-index: 9999;
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
    }
    #sg-chat-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 10px 40px rgba(139,92,246,0.7);
    }
    /* Pulse ring */
    #sg-chat-btn::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      opacity: 0.3;
      animation: sg-pulse 2s ease-in-out infinite;
      z-index: -1;
    }
    @keyframes sg-pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50%       { transform: scale(1.25); opacity: 0; }
    }
    /* Notification dot */
    #sg-chat-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 13px;
      height: 13px;
      background: #22c55e;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: sg-blink 1.8s ease-in-out infinite;
    }
    @keyframes sg-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }
    /* Tooltip */
    #sg-chat-tooltip {
      position: fixed;
      bottom: 102px;
      right: 28px;
      background: #1e1b4b;
      color: #c4b5fd;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      z-index: 9998;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      font-family: 'Inter', sans-serif;
    }
    #sg-chat-tooltip::after {
      content: '';
      position: absolute;
      bottom: -6px;
      right: 20px;
      width: 12px;
      height: 12px;
      background: #1e1b4b;
      transform: rotate(45deg);
    }
    #sg-chat-btn:hover + #sg-chat-tooltip,
    #sg-chat-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
    /* Panel backdrop */
    #sg-chat-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      backdrop-filter: blur(3px);
      z-index: 9997;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #sg-chat-backdrop.open { opacity: 1; }
    /* Chat panel */
    #sg-chat-panel {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 420px;
      height: 88vh;
      max-height: 760px;
      border-radius: 20px 20px 0 0;
      overflow: hidden;
      box-shadow: 0 -8px 60px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(.22,1,.36,1);
      background: #0f172a;
    }
    #sg-chat-panel.open { transform: translateY(0); }
    /* Panel header */
    #sg-chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #4c1d95, #3730a3);
      flex-shrink: 0;
    }
    #sg-chat-header .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    #sg-chat-header .info { flex: 1; }
    #sg-chat-header .name {
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      font-family: 'Inter', sans-serif;
    }
    #sg-chat-header .status {
      color: #a5b4fc;
      font-size: 0.75rem;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    #sg-chat-header .status::before {
      content: '';
      display: inline-block;
      width: 7px;
      height: 7px;
      background: #4ade80;
      border-radius: 50%;
    }
    #sg-chat-close {
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: background 0.2s;
    }
    #sg-chat-close:hover { background: rgba(255,255,255,0.2); }
    /* iFrame */
    #sg-chat-iframe {
      flex: 1;
      border: none;
      width: 100%;
      background: #fff;
    }
    /* Responsive */
    @media (max-width: 480px) {
      #sg-chat-panel {
        width: 100%;
        height: 92vh;
        border-radius: 20px 20px 0 0;
      }
      #sg-chat-btn { bottom: 18px; right: 18px; }
      #sg-chat-tooltip { right: 18px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <!-- Floating Button -->
    <button id="sg-chat-btn" title="Open AI Chatbot" aria-label="Open AI Chatbot">
      🤖
      <span id="sg-chat-badge"></span>
    </button>
    <div id="sg-chat-tooltip">Ask StockGuru AI anything!</div>

    <!-- Backdrop -->
    <div id="sg-chat-backdrop"></div>

    <!-- Slide-up Panel -->
    <div id="sg-chat-panel" role="dialog" aria-label="AI Chatbot" aria-modal="true">
      <div id="sg-chat-header">
        <div class="avatar">🤖</div>
        <div class="info">
          <div class="name">StockGuru AI Assistant</div>
          <div class="status">Online — ready to help</div>
        </div>
        <button id="sg-chat-close" title="Close" aria-label="Close chat">✕</button>
      </div>
      <iframe
        id="sg-chat-iframe"
        src="${CHATBOT_URL}"
        title="StockGuru AI Chatbot"
        loading="lazy"
      ></iframe>
    </div>
  `;
  document.body.appendChild(wrap);

  /* ── Logic ── */
  const btn       = document.getElementById("sg-chat-btn");
  const panel     = document.getElementById("sg-chat-panel");
  const backdrop  = document.getElementById("sg-chat-backdrop");
  const closeBtn  = document.getElementById("sg-chat-close");
  const tooltip   = document.getElementById("sg-chat-tooltip");
  const badge     = document.getElementById("sg-chat-badge");

  let isOpen = false;

  function openChat() {
    isOpen = true;
    backdrop.style.display = "block";
    setTimeout(() => { backdrop.classList.add("open"); panel.classList.add("open"); }, 10);
    btn.innerHTML = `<span style="font-size:1.4rem">✕</span>`;
    badge.style.display = "none";
  }

  function closeChat() {
    isOpen = false;
    backdrop.classList.remove("open");
    panel.classList.remove("open");
    setTimeout(() => { backdrop.style.display = "none"; }, 350);
    btn.innerHTML = `🤖<span id="sg-chat-badge"></span>`;
  }

  btn.addEventListener("click", () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener("click", closeChat);
  backdrop.addEventListener("click", closeChat);

  // Tooltip on hover
  btn.addEventListener("mouseenter", () => tooltip.classList.add("visible"));
  btn.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));

  // Keyboard: ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeChat();
  });

  // Show tooltip hint after 3 seconds on first visit
  const shown = sessionStorage.getItem("sg_chat_hint");
  if (!shown) {
    setTimeout(() => {
      tooltip.classList.add("visible");
      setTimeout(() => tooltip.classList.remove("visible"), 3500);
      sessionStorage.setItem("sg_chat_hint", "1");
    }, 3000);
  }

})();
