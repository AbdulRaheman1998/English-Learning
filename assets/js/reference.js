/* Reference material: irregular verbs and short-answer (tag) patterns. */
(function (global) {
  const verbs = [
    ["be", "was / were", "been"],
    ["bear", "bore", "borne"],
    ["beat", "beat", "beaten"],
    ["become", "became", "become"],
    ["begin", "began", "begun"],
    ["bend", "bent", "bent"],
    ["bet", "bet", "bet"],
    ["bite", "bit", "bitten"],
    ["bleed", "bled", "bled"],
    ["blow", "blew", "blown"],
    ["break", "broke", "broken"],
    ["breed", "bred", "bred"],
    ["bring", "brought", "brought"],
    ["broadcast", "broadcast", "broadcast"],
    ["build", "built", "built"],
    ["burst", "burst", "burst"],
    ["buy", "bought", "bought"],
    ["catch", "caught", "caught"],
    ["choose", "chose", "chosen"],
    ["come", "came", "come"],
    ["cost", "cost", "cost"],
    ["creep", "crept", "crept"],
    ["cut", "cut", "cut"],
    ["deal", "dealt", "dealt"],
    ["dig", "dug", "dug"],
    ["do", "did", "done"],
    ["draw", "drew", "drawn"],
    ["dream", "dreamed / dreamt", "dreamed / dreamt"],
    ["drink", "drank", "drunk"],
    ["drive", "drove", "driven"],
    ["eat", "ate", "eaten"],
    ["fall", "fell", "fallen"],
    ["feed", "fed", "fed"],
    ["feel", "felt", "felt"],
    ["fight", "fought", "fought"],
    ["find", "found", "found"],
    ["flee", "fled", "fled"],
    ["fly", "flew", "flown"],
    ["forbid", "forbade", "forbidden"],
    ["forget", "forgot", "forgotten"],
    ["forgive", "forgave", "forgiven"],
    ["freeze", "froze", "frozen"],
    ["get", "got", "gotten / got"],
    ["give", "gave", "given"],
    ["go", "went", "gone"],
    ["grow", "grew", "grown"],
    ["hang (an object)", "hung", "hung"],
    ["have", "had", "had"],
    ["hear", "heard", "heard"],
    ["hide", "hid", "hidden"],
    ["hit", "hit", "hit"],
    ["hold", "held", "held"],
    ["hurt", "hurt", "hurt"],
    ["keep", "kept", "kept"],
    ["know", "knew", "known"],
    ["lay (put down)", "laid", "laid"],
    ["lead", "led", "led"],
    ["learn", "learned / learnt", "learned / learnt"],
    ["leave", "left", "left"],
    ["lend", "lent", "lent"],
    ["let", "let", "let"],
    ["lie (recline)", "lay", "lain"],
    ["light", "lit / lighted", "lit / lighted"],
    ["lose", "lost", "lost"],
    ["make", "made", "made"],
    ["mean", "meant", "meant"],
    ["meet", "met", "met"],
    ["pay", "paid", "paid"],
    ["put", "put", "put"],
    ["quit", "quit", "quit"],
    ["read", "read", "read"],
    ["ride", "rode", "ridden"],
    ["ring", "rang", "rung"],
    ["rise", "rose", "risen"],
    ["run", "ran", "run"],
    ["say", "said", "said"],
    ["see", "saw", "seen"],
    ["seek", "sought", "sought"],
    ["sell", "sold", "sold"],
    ["send", "sent", "sent"],
    ["set", "set", "set"],
    ["shake", "shook", "shaken"],
    ["shine", "shone", "shone"],
    ["shoot", "shot", "shot"],
    ["show", "showed", "shown"],
    ["shrink", "shrank", "shrunk"],
    ["shut", "shut", "shut"],
    ["sing", "sang", "sung"],
    ["sink", "sank", "sunk"],
    ["sit", "sat", "sat"],
    ["sleep", "slept", "slept"],
    ["slide", "slid", "slid"],
    ["speak", "spoke", "spoken"],
    ["spend", "spent", "spent"],
    ["split", "split", "split"],
    ["spread", "spread", "spread"],
    ["spring", "sprang", "sprung"],
    ["stand", "stood", "stood"],
    ["steal", "stole", "stolen"],
    ["stick", "stuck", "stuck"],
    ["sting", "stung", "stung"],
    ["strike", "struck", "struck"],
    ["swear", "swore", "sworn"],
    ["sweep", "swept", "swept"],
    ["swim", "swam", "swum"],
    ["swing", "swung", "swung"],
    ["take", "took", "taken"],
    ["teach", "taught", "taught"],
    ["tear", "tore", "torn"],
    ["tell", "told", "told"],
    ["think", "thought", "thought"],
    ["throw", "threw", "thrown"],
    ["understand", "understood", "understood"],
    ["wake", "woke", "woken"],
    ["wear", "wore", "worn"],
    ["weep", "wept", "wept"],
    ["win", "won", "won"],
    ["wind", "wound", "wound"],
    ["withdraw", "withdrew", "withdrawn"],
    ["write", "wrote", "written"]
  ];

  const tagGroups = [
    {
      group: "Verb be",
      note: "Repeat the form of be. Negative answers are normally contracted.",
      rows: [
        ["Are you tired?", "Yes, I am.", "No, I'm not."],
        ["Is he a doctor?", "Yes, he is.", "No, he isn't."],
        ["Is she leaving?", "Yes, she is.", "No, she's not."],
        ["Are we late?", "Yes, we are.", "No, we aren't."],
        ["Are they here?", "Yes, they are.", "No, they're not."],
        ["Was it cold?", "Yes, it was.", "No, it wasn't."],
        ["Were you there?", "Yes, I was.", "No, I wasn't."]
      ]
    },
    {
      group: "Present simple",
      note: "Repeat do / does. The main verb disappears from the short answer.",
      rows: [
        ["Do you eat meat?", "Yes, I do.", "No, I don't."],
        ["Does he like school?", "Yes, he does.", "No, he doesn't."],
        ["Do we wait in line?", "Yes, we do.", "No, we don't."],
        ["Do they live here?", "Yes, they do.", "No, they don't."],
        ["Do I need a ticket?", "Yes, you do.", "No, you don't."]
      ]
    },
    {
      group: "Past simple",
      note: "Repeat did. Never use the past form of the main verb in the answer.",
      rows: [
        ["Did you call her?", "Yes, I did.", "No, I didn't."],
        ["Did they arrive?", "Yes, they did.", "No, they didn't."],
        ["Did she finish?", "Yes, she did.", "No, she didn't."]
      ]
    },
    {
      group: "Continuous",
      note: "Repeat am / is / are / was / were.",
      rows: [
        ["Are you working now?", "Yes, I am.", "No, I'm not."],
        ["Is it raining?", "Yes, it is.", "No, it isn't."],
        ["Were they waiting?", "Yes, they were.", "No, they weren't."]
      ]
    },
    {
      group: "Present perfect",
      note: "Repeat have / has.",
      rows: [
        ["Have you eaten?", "Yes, I have.", "No, I haven't."],
        ["Has he left?", "Yes, he has.", "No, he hasn't."],
        ["Have they finished?", "Yes, they have.", "No, they haven't."]
      ]
    },
    {
      group: "Modals",
      note: "Repeat the modal. Never contract the negative in writing except can't and won't.",
      rows: [
        ["Can you swim?", "Yes, I can.", "No, I can't."],
        ["Will you come?", "Yes, I will.", "No, I won't."],
        ["Should I wait?", "Yes, you should.", "No, you shouldn't."],
        ["Could he hear us?", "Yes, he could.", "No, he couldn't."],
        ["Would they help?", "Yes, they would.", "No, they wouldn't."]
      ]
    },
    {
      group: "Future and future perfect",
      note: "Repeat will / won't and will have / won't have.",
      rows: [
        ["Will you be there?", "Yes, I will.", "No, I won't."],
        ["Will she have finished by six?", "Yes, she will have.", "No, she won't have."]
      ]
    }
  ];

  global.PMRef = { verbs, tagGroups };
})(typeof window !== "undefined" ? window : globalThis);
