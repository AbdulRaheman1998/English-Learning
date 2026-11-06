/* Chapter 11 — Narrating a Story. Follows the ch01 gold-standard shape. */
PM.chapter({
  id: 11,
  slug: 'narrating-a-story',
  title: 'Narrating a Story',
  subtitle: 'A traffic accident',
  emoji: '🚗',
  level: 2,
  minutes: 25,
  blurb: 'Set the scene, put the events in order and land the ending — the language that turns a messy morning into a story people actually listen to.',
  tags: ['storytelling', 'past tenses', 'everyday mishaps'],
  objectives: [
    'Order events with first, then, after that and finally',
    'Hold the scene with the past continuous, then break it with the past simple',
    'React to bad news with thank goodness, bummer and what a pain in the neck',
    'Choose correctly between too, very and enough'
  ],

  conversation: {
    title: 'A traffic accident',
    setting: 'Monday morning in the office kitchen. Owen is late; Nadia is making coffee and wants the whole story.',
    cast: ['Nadia', 'Owen'],
    lines: [
      { who: 'Nadia', text: 'You’re never late. What happened?', note: '' },
      { who: 'Owen', text: 'To tell you the truth, I nearly didn’t make it at all. There was a crash on Fifth Street, right in front of my car.', note: 'to tell you the truth = I’ll be honest with you' },
      { who: 'Nadia', text: 'Thank goodness you’re all right.', note: 'relief after a near miss' },
      { who: 'Owen', text: 'I’m fine. I was waiting at the light when all of a sudden a taxi shot out of a side street.', note: 'all of a sudden = with no warning' },
      { who: 'Nadia', text: 'Was it pouring down rain?', note: '' },
      { who: 'Owen', text: 'Pouring. First the taxi stopped dead in the road. Then a van behind it braked hard. After that a third car slid into the van, and finally the whole street was blocked.', note: 'first … then … after that … finally order the events' },
      { who: 'Nadia', text: 'Was anyone hurt?', note: '' },
      { who: 'Owen', text: 'No, thank goodness. But to top it all off, a cop asked me to move my car and I couldn’t, because I was boxed in.', note: 'cop = police officer (informal)' },
      { who: 'Nadia', text: 'What a pain in the neck. How long were you stuck there?', note: 'a pain in the neck = really annoying' },
      { who: 'Owen', text: 'A whole hour. The worst thing was standing in the rain with no umbrella. The best thing was the van driver — he was completely calm. I was freaked out and he was telling jokes. Honestly, it kind of creeped me out.', note: 'The worst thing / The best thing frame an opinion' },
      { who: 'Nadia', text: 'Some people are like that. And the local paper sent a photographer, didn’t it? I saw the picture online.', note: 'the paper = the newspaper' },
      { who: 'Owen', text: 'They did. The upshot is I’m stuck with a dented bumper and a pile of forms. I was so stressed out that I left my laptop at home.', note: 'the upshot = the final result' },
      { who: 'Nadia', text: 'Chill out. Nobody was hurt — that’s the main thing.', note: 'chill out = calm down, relax' }
    ]
  },

  expressions: [
    {
      term: 'all of a sudden',
      ipa: '/ɔːl əv ə ˈsʌdn/',
      meaning: 'Very quickly and with no warning — the moment a story turns.',
      usage: 'Usually mid-sentence, just before the surprising event: I was walking home when all of a sudden …',
      examples: [
        'We were talking quietly and all of a sudden the lights went out.',
        'All of a sudden, everyone in the room started clapping.'
      ],
      tip: 'The phrase is fixed: not in a sudden. Suddenly is one word and fits the same slot.'
    },
    {
      term: 'to top it all off',
      ipa: '/tə tɒp ɪt ɔːl ɒf/',
      meaning: 'Used to add one last item that makes a bad situation worse — or, in a joking tone, better.',
      usage: 'Usually opens a sentence in a story: And to top it all off, …',
      examples: [
        'The train was late, I lost a glove, and to top it all off it started to snow.',
        'To top it all off, she paid for everyone’s coffee.'
      ],
      tip: 'On top of that is the neutral version; to top it all off sounds more dramatic.'
    },
    {
      term: 'thank goodness',
      ipa: '/θæŋk ˈɡʊdnəs/',
      meaning: 'A quick, sincere way to show relief that something bad did not happen.',
      usage: 'Stands alone or opens a sentence: Thank goodness you’re okay.',
      examples: [
        'Thank goodness nobody was hurt.',
        'You found your keys? Thank goodness for that.'
      ],
      tip: 'Thank God is stronger, and some people avoid it at work; thank goodness is always safe.'
    },
    {
      term: 'the best thing / the worst thing',
      ipa: '/ðə best θɪŋ/',
      meaning: 'Frames for judging one part of an experience as the high or the low point.',
      usage: 'Often followed by was: The worst thing was the waiting. Add about + noun or -ing to be specific.',
      examples: [
        'The best thing about the trip was the food.',
        'The worst thing was not knowing what had happened.'
      ],
      tip: 'For a single bad feature, The worst thing about it is … sounds more natural than It has the worst …'
    },
    {
      term: 'the upshot',
      ipa: '/ði ˈʌpʃɒt/',
      meaning: 'The final result or conclusion of a complicated situation.',
      usage: 'Often opens a summary: The upshot is that we have to start again.',
      examples: [
        'The upshot is that the repair will take a week.',
        'So the upshot was a long delay and no refund.'
      ],
      tip: 'Very common in business and at the end of a story. The bottom line does the same job.'
    },
    {
      term: 'a pain in the neck',
      ipa: '/ə peɪn ɪn ðə nek/',
      meaning: 'Something or someone that is annoying and inconvenient.',
      usage: 'Informal but polite enough for most situations. For a person: He’s a pain in the neck.',
      examples: [
        'Filling in these forms is a real pain in the neck.',
        'My neighbour’s dog is a pain in the neck at six in the morning.'
      ],
      tip: 'A pain in the backside is ruder; keep neck for mixed company.'
    },
    {
      term: 'pouring (down) rain',
      ipa: '/ˈpɔːrɪŋ/',
      meaning: 'Raining very heavily.',
      usage: 'It was pouring. / It was pouring down. / It was pouring with rain.',
      examples: [
        'Take the car — it’s pouring out there.',
        'We got soaked; it was pouring down rain the whole way.'
      ],
      tip: 'Drizzle is light rain, pouring is heavy. It’s raining cats and dogs means the same but sounds old-fashioned.'
    },
    {
      term: 'freaked out',
      ipa: '/friːkt ˈaʊt/',
      meaning: 'Very frightened, panicked or upset — usually for a short time.',
      usage: 'Adjective after be or get: I was freaked out. / She freaked out when she saw the bill.',
      examples: [
        'I was freaked out when the car started sliding.',
        'Don’t freak out — the file is backed up.'
      ],
      tip: 'Get freaked out is the event; be freaked out is the state you are in afterwards.'
    },
    {
      term: 'creeped out',
      ipa: '/kriːpt ˈaʊt/',
      meaning: 'Made to feel uneasy or slightly scared by something strange.',
      usage: 'Usually about a place, a person’s behaviour or a story: I was creeped out by the silence.',
      examples: [
        'The empty house creeped me out.',
        'I don’t watch those films — they leave me creeped out.'
      ],
      tip: 'Weaker and stranger than freaked out. British English often prefers crept out.'
    },
    {
      term: 'stressed out',
      ipa: '/strest ˈaʊt/',
      meaning: 'So worried and busy that you cannot relax.',
      usage: 'Be or get stressed out about something. Stressed alone is also common.',
      examples: [
        'She’s been stressed out about the exam all week.',
        'I get stressed out when three people call me at once.'
      ],
      tip: 'Stressful describes the cause (a stressful week); stressed describes the person.'
    },
    {
      term: 'pumped up',
      ipa: '/pʌmpt ˈʌp/',
      meaning: 'Full of energy and excitement about something that is coming.',
      usage: 'Informal. Pumped up for or about + noun or -ing.',
      examples: [
        'The team was pumped up before the final.',
        'I’m really pumped up about starting the course.'
      ],
      tip: 'Pumped works alone too, especially in American English: I’m so pumped.'
    },
    {
      term: 'stuck with',
      ipa: '/stʌk wɪð/',
      meaning: 'Left with something you did not choose and cannot easily get rid of.',
      usage: 'Be stuck with + noun: We’re stuck with the old printer for now.',
      examples: [
        'I’m stuck with the late shift all week.',
        'They cancelled, so I’m stuck with two concert tickets.'
      ],
      tip: 'Stuck in means trapped in a place (stuck in traffic). Stuck with is about something you have to deal with.'
    },
    {
      term: 'chill out',
      ipa: '/tʃɪl ˈaʊt/',
      meaning: 'To relax, or to tell someone to calm down.',
      usage: 'Friendly and informal. As a command it can sound rude to a stranger, so soften it.',
      examples: [
        'We chilled out on the balcony all afternoon.',
        'Chill out — we’ve got plenty of time.'
      ],
      tip: 'Chill out also means relax socially. Keep it away from a boss or a client.'
    },
    {
      term: 'to tell you the truth',
      ipa: '/tə tel juː ðə truːθ/',
      meaning: 'Introduces an honest, sometimes unwelcome admission.',
      usage: 'Usually at the start of a sentence, or at the end after a comma.',
      examples: [
        'To tell you the truth, I forgot all about it.',
        'It’s not my favourite film, to tell you the truth.'
      ],
      tip: 'To be honest is more common in British English and slightly softer.'
    }
  ],

  structures: [
    {
      title: 'Sequencing a story: first, then, after that, finally',
      body: 'Sequencing words are the skeleton of a story. First opens it, then and next move it forward, after that marks a later stage, and finally closes the list. When the word starts the sentence, put a comma after it.',
      table: {
        head: ['Stage', 'Word', 'Example'],
        rows: [
          ['Opening', 'First,', 'First, the taxi stopped dead in the road.'],
          ['Step two', 'Then, / Next,', 'Then a van behind it braked hard.'],
          ['Later', 'After that,', 'After that, a third car slid into the van.'],
          ['Closing', 'Finally,', 'Finally, the whole street was blocked.'],
          ['Contrast', 'At first,', 'At first I thought it was just a flat tyre.']
        ]
      },
      examples: [
        'First we waited at the lights, then the taxi came out of nowhere, and finally everything stopped.',
        'At first nobody moved. After that, three people got out of their cars at once.'
      ]
    },
    {
      title: 'Scene and event: past continuous + past simple',
      body: 'The past continuous paints the scene — what was already happening. The past simple drops in the event that interrupted it. Join them with when; for the longer background action, while also works.',
      table: {
        head: ['Pattern', 'Example', 'What it does'],
        rows: [
          ['was/were + -ing … when + past simple', 'I was driving when the taxi pulled out.', 'scene, then interruption'],
          ['Past simple … while + was/were + -ing', 'The phone rang while I was cooking.', 'event, then background'],
          ['was/were + -ing (alone)', 'It was pouring and everyone was shouting.', 'atmosphere only'],
          ['Past simple, past simple', 'The van braked. A car hit it.', 'a fast sequence of events']
        ]
      },
      examples: [
        'I was waiting at the light when a taxi shot out of a side street.',
        'While the driver was calling his insurance company, a photographer arrived.'
      ]
    },
    {
      title: 'too vs. very vs. enough',
      body: 'Very makes an adjective stronger. Too means more than is good or possible, and usually brings a negative result. Enough comes after the adjective and means as much as is needed. Both too and enough commonly pair with to + verb. Too has a second job as well: at the end of a sentence it means also.',
      table: {
        head: ['Word', 'Position', 'Example', 'Meaning'],
        rows: [
          ['very', 'before the adjective', 'The coffee is very hot.', 'strong, but fine'],
          ['too', 'before the adjective', 'The coffee is too hot to drink.', 'more than I can handle'],
          ['enough', 'after the adjective', 'The coffee is cool enough to drink.', 'just right'],
          ['too much / too many', 'before a noun', 'There was too much traffic.', 'more than we wanted'],
          ['not … enough', 'after the adjective', 'He isn’t old enough to drive.', 'less than we need'],
          ['too (= also)', 'at the end of the sentence', 'She’s coming, too.', 'as well']
        ]
      },
      examples: [
        'It was too wet to see, and the road wasn’t wide enough for two cars.',
        'I was very tired, but I wasn’t too tired to tell the story.'
      ]
    }
  ],

  exercises: [
    {
      kind: 'choice',
      q: 'I ___ dinner when the phone rang.',
      options: ['had', 'was having', 'have had', 'was had'],
      answer: 1,
      why: 'The past continuous describes the action already in progress; the past simple (rang) is the event that interrupted it.'
    },
    {
      kind: 'choice',
      q: 'The morning was a disaster. ___, I locked my keys in the car.',
      options: ['To top it all off', 'To top it all', 'On top it all off', 'Topping it all off'],
      answer: 0,
      why: 'To top it all off introduces the last and worst item in a list of problems. The phrase is fixed, so it cannot lose its it.'
    },
    {
      kind: 'choice',
      q: 'This box is ___ heavy for me to lift.',
      options: ['very', 'too', 'enough', 'much'],
      answer: 1,
      why: 'Too + adjective + to + verb means more than is possible. Very would only describe the weight, not the impossibility.'
    },
    {
      kind: 'choice',
      q: 'The coffee isn’t hot ___ — could you heat it up?',
      options: ['too', 'very', 'enough', 'much'],
      answer: 2,
      why: 'Enough comes after the adjective: hot enough. Too and very come before it.'
    },
    {
      kind: 'choice',
      q: 'A cyclist stopped right ___ me and asked for directions.',
      options: ['in front of', 'in the front of', 'in front', 'front of'],
      answer: 0,
      why: 'In front of means ahead of. In the front of means inside the front part of something, like a car or a train.'
    },
    {
      kind: 'choice',
      q: 'He’s been really ___ since the accident.',
      options: ['stressful', 'stressed', 'stress', 'stressing'],
      answer: 1,
      why: 'Stressed describes how a person feels. Stressful describes the thing that causes the feeling, as in a stressful week.'
    },
    {
      kind: 'fill',
      q: 'It was ___ down rain, so we waited under the bridge.',
      answer: 'pouring',
      accept: ['pouring'],
      hint: 'One word, from the verb pour.',
      why: 'Pouring (down) rain means raining very heavily. It was pouring is enough on its own.'
    },
    {
      kind: 'fill',
      q: 'We’re ___ with the old printer until the new one arrives.',
      answer: 'stuck',
      accept: ['stuck'],
      hint: 'The pattern is be ___ with + noun.',
      why: 'Be stuck with something means you have to keep it, even though you did not choose it.'
    },
    {
      kind: 'fill',
      q: 'I only ___ that I’d left my keys inside when I heard the door click.',
      answer: 'realized',
      accept: ['realized', 'realised'],
      hint: 'The past of realize — notice the -ize ending.',
      why: 'Realize takes a that-clause: I realized that I had left them. Do not add about before the clause.'
    },
    {
      kind: 'fill',
      q: 'The whole team was ___ up before the final.',
      answer: 'pumped',
      accept: ['pumped'],
      hint: 'pump + -ed; it means excited and full of energy.',
      why: 'Pumped up means excited about something that is coming. It is informal but very common.'
    },
    {
      kind: 'fill',
      q: 'We missed the last train. — Oh, ___.',
      answer: 'bummer',
      accept: ['bummer'],
      hint: 'One informal word for what a shame.',
      why: 'Bummer is a mild, friendly reaction to bad news. Keep it for friends, not for a client.'
    },
    {
      kind: 'match',
      q: 'Match each expression with its meaning.',
      pairs: [
        ['All of a sudden', 'With no warning at all'],
        ['To top it all off', 'And here is one more problem'],
        ['The upshot', 'The final result of the whole business'],
        ['A pain in the neck', 'Really annoying and inconvenient'],
        ['Creeped out', 'Made to feel uneasy by something strange']
      ],
      why: 'These five phrases carry the shape of a spoken story: the shock, the extra problem, the result, the complaint and the strange feeling.'
    },
    {
      kind: 'match',
      q: 'Match each sequencing word with what it does in a story.',
      pairs: [
        ['First', 'This is where the story starts'],
        ['Then / Next', 'One step later in the story'],
        ['After that', 'A later stage, once the previous one is over'],
        ['Finally', 'The last thing that happens'],
        ['At first', 'How things were at the beginning, before a change']
      ],
      why: 'Sequencing words are the skeleton of a story. At first is different from the others because it sets up a contrast instead of moving time forward.'
    },
    {
      kind: 'order',
      q: 'Put the words in order to start a story.',
      words: ['First', 'the', 'taxi', 'stopped,', 'and', 'then', 'a', 'van', 'hit', 'it.'],
      answer: 'First the taxi stopped, and then a van hit it.',
      why: 'First opens the sequence and then moves it on. Both verbs stay in the past simple because the events are finished.'
    },
    {
      kind: 'order',
      q: 'Put the words in order to set the scene and then break it.',
      words: ['I', 'was', 'driving', 'home', 'when', 'all', 'of', 'a', 'sudden', 'it', 'started', 'pouring.'],
      answer: 'I was driving home when all of a sudden it started pouring.',
      why: 'The past continuous sets the scene, when + past simple brings the event, and all of a sudden makes it sudden.'
    },
    {
      kind: 'order',
      q: 'Put the words in order to end the story with a complaint.',
      words: ['To', 'top', 'it', 'all', 'off,', 'I', 'was', 'stuck', 'with', 'the', 'bill.'],
      answer: 'To top it all off, I was stuck with the bill.',
      why: 'The phrase comes first and takes a comma; the main clause keeps normal subject–verb order.'
    }
  ],

  speaking: [
    {
      prompt: 'Tell a partner about a journey that went wrong. Use first, then, finally and one -ed out adjective.',
      model: 'First the bus didn’t come, then I realized I’d left my ticket at home, and finally I ran the last two kilometres. By the time I arrived I was completely stressed out.'
    },
    {
      prompt: 'Describe an accident or a near miss you saw. Set the scene with the past continuous, then say what happened.',
      model: 'I was walking past the station when a cyclist came off the pavement right in front of me. He was fine, thank goodness, but his front wheel wasn’t.'
    },
    {
      prompt: 'A friend tells you they had a terrible day. Respond with sympathy and one expression from the chapter.',
      model: 'Oh no, what a pain in the neck. And to top it all off, you had to do it in the rain? Chill out tonight — tomorrow can’t be worse.'
    },
    {
      prompt: 'Summarise the result of a difficult week in two sentences using the upshot and too.',
      model: 'The upshot is that we lost two days and I’m stuck with the paperwork. The room was too small and the equipment wasn’t good enough, so we gave up.'
    }
  ]
});
