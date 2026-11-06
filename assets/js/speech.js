/* Text-to-speech helpers. Uses the browser's speechSynthesis engine. */
(function (global) {
  const synth = global.speechSynthesis;
  let voices = [];
  let current = null;

  function loadVoices() {
    if (!synth) return;
    const all = synth.getVoices() || [];
    voices = all.filter((v) => /^en(-|_)?/i.test(v.lang) || /english/i.test(v.name));
    if (!voices.length) voices = all;
  }

  if (synth) {
    loadVoices();
    synth.addEventListener?.("voiceschanged", loadVoices);
    // Some browsers populate voices asynchronously without the event.
    setTimeout(loadVoices, 400);
  }

  function pickVoice(pref) {
    if (!voices.length) loadVoices();
    if (pref) {
      const exact = voices.find((v) => v.name === pref);
      if (exact) return exact;
    }
    const order = ["Google US English", "Samantha", "Microsoft Aria", "Microsoft Jenny", "Microsoft Zira", "Daniel", "Alex"];
    for (const name of order) {
      const v = voices.find((x) => x.name.includes(name));
      if (v) return v;
    }
    return voices.find((v) => /en[-_]US/i.test(v.lang)) || voices[0] || null;
  }

  const PMSpeech = {
    available() {
      return !!synth;
    },
    voices() {
      if (!voices.length) loadVoices();
      return voices.slice();
    },
    get speaking() {
      return !!(synth && (synth.speaking || synth.pending));
    },
    /**
     * Speak some text.
     * @param {string} text
     * @param {{rate?:number, voice?:string, onstart?:Function, onend?:Function}} opts
     */
    speak(text, opts = {}) {
      if (!synth || !text) {
        opts.onend?.();
        return;
      }
      this.stop();
      const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, " ").trim());
      const v = pickVoice(opts.voice);
      if (v) u.voice = v;
      u.lang = (v && v.lang) || "en-US";
      u.rate = Math.min(1.6, Math.max(0.5, opts.rate ?? 0.95));
      u.pitch = 1;
      u.onstart = () => opts.onstart?.();
      u.onend = () => {
        current = null;
        opts.onend?.();
      };
      u.onerror = () => {
        current = null;
        opts.onend?.();
      };
      current = u;
      // Chrome occasionally needs a resume after cancel.
      setTimeout(() => synth.speak(u), 30);
    },
    stop() {
      if (!synth) return;
      try {
        synth.cancel();
      } catch (_) {}
      current = null;
    }
  };

  global.PMSpeech = PMSpeech;
})(typeof window !== "undefined" ? window : globalThis);
