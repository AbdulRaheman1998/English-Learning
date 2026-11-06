/* Chapter 1 — gold-standard content file. All other chapters follow this exact shape. */
PM.chapter({
  id: 1,
  slug: "introducing-yourself",
  title: "Introducing Yourself and Others",
  subtitle: "Meeting at a party",
  emoji: "🤝",
  level: 1,
  minutes: 20,
  blurb: "Say who you are, introduce the people you came with, and keep the first five minutes of small talk alive.",
  tags: ["small talk", "first meetings"],
  objectives: [
    "Introduce yourself and other people naturally",
    "Answer yes/no questions with a short tag answer",
    "Ask and answer What do you do? without slipping on articles",
    "Use ten high-frequency conversational expressions"
  ],

  conversation: {
    title: "Meeting at a party",
    setting: "A house party in Chicago. Todd lives with the host; Matt has just flown in from San Diego.",
    cast: ["Todd", "Matt"],
    lines: [
      { who: "Todd", text: "Hi — you must be John's cousin Matt, right? From San Diego?", note: "Guessing, then checking" },
      { who: "Matt", text: "Correct! I just got in last night.", note: "just = a very short time ago" },
      { who: "Todd", text: "I'm Todd, John's roommate. Glad to meet you.", note: "Name + relation + greeting in one breath" },
      { who: "Matt", text: "I'm happy to meet you, too — and yes, I've heard about you!", note: "too mirrors the greeting back" },
      { who: "Todd", text: "Football, yes — and as a matter of fact, I do like parties. But tell me about yourself. What do you do in San Diego?", note: "as a matter of fact confirms and adds" },
      { who: "Matt", text: "I'm more of a surfer than a football player. We surf all day and party on the beach at night.", note: "more of a … than a … = soft comparison" },
      { who: "Todd", text: "That sounds awesome. How long are you staying?", note: "" },
      { who: "Matt", text: "Two weeks. John has promised me a nonstop schedule — sightseeing, meeting his friends, checking out the local scene, and hopefully camping for a couple of days.", note: "" },
      { who: "Todd", text: "John's a good guy, and he knows everybody in town. I'm sure he'll show you a good time.", note: "" },
      { who: "Matt", text: "Thanks so much — I really appreciate that. I'm still a bit jet-lagged, but I should be in good shape by tomorrow.", note: "jet-lagged = tired from flying across time zones" },
      { who: "Todd", text: "Don't worry. We'll take good care of you. And don't be surprised if we show up on your doorstep in San Diego one day, ready for surfing!", note: "show up on someone's doorstep = visit without warning" }
    ]
  },

  expressions: [
    {
      term: "You must be …, right?",
      ipa: "/juː mʌst biː/",
      meaning: "A polite, slightly tentative way to say who you think someone is before they confirm it.",
      usage: "Very common at parties, interviews and conferences. The tag right? softens the guess.",
      examples: [
        "You must be Daniela's sister — you look just like her.",
        "You must be the new intern. I'm Priya, from marketing."
      ],
      tip: "If the guess is wrong, say No, I'm not — I'm … rather than just no."
    },
    {
      term: "This is … / These are …",
      ipa: "/ðɪs ɪz/",
      meaning: "The standard way to introduce one person (this is) or several people (these are).",
      usage: "Add the relationship after the name: This is Mia, my colleague.",
      examples: [
        "This is my wife, Aisha. And this is Sam, my brother.",
        "These are my friends Rafa and Nina — we work together."
      ],
      tip: "Never say He is my friend when you are introducing him face to face; use This is."
    },
    {
      term: "(I'm) glad to meet you.",
      ipa: "/ɡlæd tə miːt juː/",
      meaning: "The standard friendly reply when you have just been introduced.",
      usage: "Happy to meet you, Nice to meet you and Pleased to meet you work the same way.",
      examples: [
        "Glad to meet you, Chris. I've heard a lot about you.",
        "Nice to meet you, too — thanks for coming."
      ],
      tip: "Add too when the other person said it first: Nice to meet you. — Nice to meet you, too."
    },
    {
      term: "As a matter of fact",
      ipa: "/əz ə ˈmætər əv fækt/",
      meaning: "Used to confirm what someone has just said and then add a detail, often a mild surprise.",
      usage: "Can open the sentence or follow the verb: I do, as a matter of fact.",
      examples: [
        "I heard you're a runner. — As a matter of fact, I just finished a marathon.",
        "Are you nervous? — I am, as a matter of fact."
      ],
      tip: "Actually does the same job but sits after the verb: I am, actually."
    },
    {
      term: "just",
      ipa: "/dʒʌst/",
      meaning: "A moment ago — something happened very recently.",
      usage: "With the past simple (I just arrived) or the present perfect (I have just arrived).",
      examples: [
        "Sorry, I just got home — give me two minutes.",
        "She has just finished the report, so you can ask her now."
      ],
      tip: "Don't use just this way with a finished past time: not I just arrived yesterday."
    },
    {
      term: "to get in",
      ipa: "/ɡet ɪn/",
      meaning: "To arrive — usually at a building, a city or a hotel.",
      usage: "Mostly in the past tense. For the future, people often say get there.",
      examples: [
        "What time did you get in? — Around midnight.",
        "We got in late, so we went straight to bed."
      ],
      tip: "get in can also mean be accepted: She got in to her first-choice college."
    },
    {
      term: "party animal",
      ipa: "/ˈpɑːrti ˈænɪml/",
      meaning: "Someone who loves going out and socialising — said with affection, not criticism.",
      usage: "Informal. Often with a real or a total: He's a real party animal.",
      examples: [
        "Don't wait for Leo — he's a total party animal and never leaves before 2 a.m.",
        "I used to be a party animal, but now I'm in bed by ten."
      ],
      tip: "For a quieter person you can say a homebody."
    },
    {
      term: "What do you do?",
      ipa: "/wɒt də juː duː/",
      meaning: "The standard question about someone's job or occupation.",
      usage: "With a form of be, use a job title with a/an: I'm a teacher. Use the for a unique position: I'm the manager.",
      examples: [
        "What do you do? — I'm a nurse at the city hospital.",
        "What does your brother do? — He runs a small bakery."
      ],
      tip: "Add a time or place and the question changes: What do you do on weekends? asks about free time, not work."
    },
    {
      term: "Tell me about yourself.",
      ipa: "/tel miː əˈbaʊt jɔːˈself/",
      meaning: "A warm, open invitation to share as much or as little as you like.",
      usage: "Politer than firing direct questions at someone you have just met.",
      examples: [
        "So, tell me about yourself — how did you end up in Chicago?",
        "Tell me about yourself. — Well, I'm from Lima originally, and I've been here three years."
      ],
      tip: "Answer with two or three facts and one feeling; then ask them something back."
    },
    {
      term: "looking forward to",
      ipa: "/ˈlʊkɪŋ ˈfɔːrwərd tə/",
      meaning: "To be genuinely happy about something that will happen.",
      usage: "Followed by a noun or an -ing verb: looking forward to seeing you.",
      examples: [
        "I'm really looking forward to the trip.",
        "She's looking forward to meeting your parents."
      ],
      tip: "Never to + base verb here: not looking forward to see you."
    },
    {
      term: "to have in store for",
      ipa: "/hæv ɪn stɔːr fər/",
      meaning: "To have plans or surprises waiting for someone — could be good or bad.",
      usage: "Often with no idea, or with a person as the subject of have.",
      examples: [
        "I have no idea what this week has in store for me.",
        "The city has a few surprises in store for first-time visitors."
      ],
      tip: "A common warm ending to a chat: Who knows what's in store for us?"
    },
    {
      term: "to show up on someone's doorstep",
      ipa: "/ʃoʊ ʌp ɒn ˈsʌmwʌnz ˈdɔːrstep/",
      meaning: "To arrive at someone's home without warning.",
      usage: "Friendly and slightly humorous. Drop in and drop by are for short visits only.",
      examples: [
        "We were in town, so we showed up on my aunt's doorstep with croissants.",
        "Don't be surprised if I show up on your doorstep one day."
      ],
      tip: "Show up on its own often has a negative tone: He said he'd come, but he never showed up."
    },
    {
      term: "in good shape",
      ipa: "/ɪn ɡʊd ʃeɪp/",
      meaning: "In a good position — physically, financially, or ready for what is coming.",
      usage: "Be in shape alone means physically fit.",
      examples: [
        "I'm still jet-lagged, but I should be in good shape by tomorrow.",
        "They paid off the loan, so they're in good shape financially."
      ],
      tip: "Out of shape means unfit; in bad shape usually means unwell or in trouble."
    }
  ],

  structures: [
    {
      title: "Short answers with a tag",
      body: "English rarely answers a yes/no question with a bare yes or no. Repeat the auxiliary and add a tag — and contract the negative.",
      table: {
        head: ["Question", "Yes", "No"],
        rows: [
          ["Are you tired?", "Yes, I am.", "No, I'm not."],
          ["Is he a doctor?", "Yes, he is.", "No, he isn't."],
          ["Are they leaving?", "Yes, they are.", "No, they aren't."],
          ["Do you eat meat?", "Yes, I do.", "No, I don't."],
          ["Does she work here?", "Yes, she does.", "No, she doesn't."]
        ]
      },
      examples: [
        "Are you from New York? — Yes, I am. / No, I'm not.",
        "Do your parents live here? — Yes, they do. / No, they don't."
      ]
    },
    {
      title: "a job title vs. a description",
      body: "After What do you do?, a form of be needs a/an for a job and the for a unique position. Any other verb gives detail about the work itself.",
      table: {
        head: ["Question", "Answer"],
        rows: [
          ["What do you do?", "I'm a lawyer."],
          ["What does she do?", "She's the head of design."],
          ["What do they do?", "They're professors."],
          ["What does he do?", "He drives a delivery truck."],
          ["What do you do on weekends?", "I relax and see friends."]
        ]
      },
      examples: [
        "What do you do? — I work for a small architecture firm.",
        "What does she do at the beach? — She swims and reads."
      ]
    },
    {
      title: "looking forward to / can't wait to",
      body: "Both express happy anticipation. The difference is grammatical: looking forward to takes a noun or -ing, can't wait takes to + base verb.",
      table: {
        head: ["Expression", "What follows", "Example"],
        rows: [
          ["I'm looking forward to", "noun / -ing", "I'm looking forward to seeing you."],
          ["I'm looking forward to", "noun", "I'm looking forward to the weekend."],
          ["I can't wait", "to + verb", "I can't wait to see you."]
        ]
      },
      examples: [
        "Are you looking forward to going back to school? — I can't wait to see my friends."
      ]
    }
  ],

  exercises: [
    {
      kind: "choice",
      q: "Is Larry coming tomorrow?",
      options: ["Yes, he does.", "Yes, he is.", "No, he won't.", "Yes, he will."],
      answer: 1,
      why: "The question uses is, so the short answer repeats is: Yes, he is."
    },
    {
      kind: "choice",
      q: "Do you like chocolate ice cream?",
      options: ["No, I'm not.", "Yes, I am.", "No, I don't.", "Yes, she does."],
      answer: 2,
      why: "The question uses do, so the negative tag is don't: No, I don't."
    },
    {
      kind: "choice",
      q: "Are we leaving at six?",
      options: ["Yes, they are.", "Yes, we are.", "No, we don't.", "Yes, they do."],
      answer: 1,
      why: "We ask with are, so we answer with we are."
    },
    {
      kind: "choice",
      q: "Which sentence introduces a third person face to face?",
      options: [
        "He is my friend Sam.",
        "This is my friend Sam.",
        "These is my friend Sam.",
        "It is my friend Sam."
      ],
      answer: 1,
      why: "When you are standing with the person, use This is + name. He is my friend describes him to someone else."
    },
    {
      kind: "choice",
      q: "I heard you're a marathon runner. — ___, I just finished my tenth race.",
      options: ["Actually", "As a matter of fact", "Hopefully", "At least"],
      answer: 1,
      why: "As a matter of fact confirms what the other person said and then adds a detail. Actually works too, but it follows the verb: I am, actually."
    },
    {
      kind: "fill",
      q: "Sorry I'm late — I ___ (just / get) here five minutes ago.",
      answer: "just got",
      accept: ["just got"],
      hint: "Use just with the past simple of get.",
      why: "Just + past simple means 'a very short time ago': I just got here."
    },
    {
      kind: "fill",
      q: "What time did your flight ___? (arrive, informal phrasal verb)",
      answer: "get in",
      accept: ["get in"],
      hint: "Two words: get + in.",
      why: "Get in means arrive. 'What time did your flight get in?'"
    },
    {
      kind: "fill",
      q: "She's really looking forward to ___ (start) her new job.",
      answer: "starting",
      accept: ["starting"],
      hint: "looking forward to takes an -ing form.",
      why: "Looking forward to is a preposition here, so the verb becomes -ing."
    },
    {
      kind: "fill",
      q: "I can't wait ___ (see) you next week.",
      answer: "to see",
      accept: ["to see"],
      hint: "can't wait takes the infinitive.",
      why: "Can't wait is followed by to + base verb: can't wait to see you."
    },
    {
      kind: "choice",
      q: "My sister is ___ accountant.",
      options: ["a", "an", "the", "no article"],
      answer: 1,
      why: "Use an before a vowel sound: an accountant. Use a before a consonant sound: a lawyer."
    },
    {
      kind: "choice",
      q: "My brothers are ___ engineers.",
      options: ["a", "an", "the", "— (no article)"],
      answer: 3,
      why: "Plural job titles take no article: They’re engineers. Use the only when you mean specific people."
    },
    {
      kind: "match",
      q: "Match each expression with its meaning.",
      pairs: [
        ["You must be Ana, right?", "I think I know who you are — confirm it"],
        ["As a matter of fact", "Yes, and here is a detail you didn't expect"],
        ["Party animal", "Someone who loves going out"],
        ["In good shape", "Ready and in a strong position"],
        ["Show up on someone's doorstep", "Arrive at their home without warning"]
      ],
      why: "These five expressions do most of the work in casual first meetings."
    },
    {
      kind: "match",
      q: "Match each opener with the most natural reply.",
      pairs: [
        ["Nice to meet you.", "Nice to meet you, too."],
        ["You're Matt, right?", "That's right — from San Diego."],
        ["Tell me about yourself.", "Well, I'm from Ohio and I teach chemistry."],
        ["Thanks so much for the ride.", "No problem — glad to help."],
        ["How long are you staying?", "Just a couple of weeks."]
      ],
      why: "Replies echo the grammar of the question and stay short."
    },
    {
      kind: "order",
      q: "Put the words in order to make a natural introduction.",
      words: ["This", "is", "my", "colleague", "Marta,", "and", "these", "are", "her", "two", "sons."],
      answer: "This is my colleague Marta, and these are her two sons.",
      why: "This is for one person, these are for more than one."
    },
    {
      kind: "order",
      q: "Put the words in order to make a short tag answer.",
      words: ["No,", "I'm", "not", "—", "I'm", "from", "Toronto."],
      answer: "No, I'm not — I'm from Toronto.",
      why: "A negative tag answer contracts: No, I'm not. Then add the correction."
    }
  ],

  speaking: [
    {
      prompt: "Introduce yourself to a new colleague in two sentences. Include your name and what you do.",
      model: "Hi, I'm Daniyal — I just joined the finance team. I'll be working on the monthly reports."
    },
    {
      prompt: "Introduce two friends to each other, saying how you know each one.",
      model: "Sara, this is Tom, my neighbour. Tom, this is Sara — we studied together in Lahore."
    },
    {
      prompt: "Someone says 'You must be Maya's brother, right?' but they are wrong. Correct them politely.",
      model: "No, I'm not, actually — I'm her cousin. Easy mistake, we look a lot alike."
    },
    {
      prompt: "Answer 'Tell me about yourself' in three sentences, then ask a question back.",
      model: "Well, I'm from Karachi, I've been teaching for six years, and I'm crazy about cricket. What about you — how long have you been here?"
    }
  ]
});
