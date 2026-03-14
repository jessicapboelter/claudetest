// ============================================================
// === TRANSLATIONS ===
// ============================================================
const LANG = {
  en: {
    // Mood screen
    greeting_morning: ['morning vibe check', 'gm gm, how we doing?', 'yo, morning check-in'],
    greeting_afternoon: ['afternoon vibe check', 'hey, mid-day check-in', 'how\u2019s the vibe rn?'],
    greeting_evening: ['evening vibe check', 'hey night owl, how are we?', 'late night check-in'],
    mood_subtitle: 'how\u2019s your nervous system doing rn?',
    mood_calm: 'chill',
    mood_anxious: 'anxious',
    mood_nervous: 'wired',
    mood_bored: 'meh',
    mood_overwhelmed: 'drowning',
    mood_restless: 'restless',

    // Dashboard
    level: 'Level',
    switch_mood: 'switch',
    screen_sesh: '\u23F1 screen sesh',
    badge_ok: 'vibing',
    badge_warning: 'hmm',
    badge_danger: 'yikes',
    timer_hint_ok: "timer's running, no judgment",
    timer_hint_warning: 'maybe start wrapping up?',
    timer_hint_danger: 'your nervous system is begging you',
    reset: 'reset',
    caught_scrolling: '\u{1F4F1} caught scrolling',
    honesty_msg: 'respect for the honesty \u{1F64F}',

    // Suggestion
    suggestion_title: '\u{1F4AC} hey bestie',
    lets_go: "let's go!",
    nah: 'nah',

    // Power-ups
    powerups_label: '\u{1F3AE} power-ups',
    pu_breath_game: 'breath game',
    pu_body_quest: 'body quest',
    pu_breathe: 'breathe',
    pu_ground: 'ground',
    pu_random_quest: 'random quest',
    pu_surprise: 'surprise me',

    // Breath game
    breath_cal_title: '\u{1FAC1} breath calibration',
    breath_cal_subtitle: 'hold the blob while you breathe in. let go when you breathe out. 5 rounds, your pace.',
    hold_me: 'hold me',
    breathing_in: 'breathing in...',
    breathing_out: 'breathing out...',
    round_x_of_5: 'round {n} / 5',
    cal_fast: "fast breaths! a guided session can gently slow you down.",
    cal_medium: "decent pace. let's deepen it a bit with guided breathing.",
    cal_deep: "wow, deep breaths already. let's ride that wave.",
    start_guided: 'start guided breathing \u2728',
    guided_title: '\u2728 your breathing',
    guided_subtitle: 'tuned to YOUR rhythm. follow the blob.',
    guided_done: 'nice \u2728',
    redo: 'redo',
    slower: 'slower (+1s)',
    breathe_in: 'breathe in',
    hold: 'hold',
    breathe_out: 'breathe out',
    get_ready: 'ready...',
    s_in: 's in',
    s_hold: 's hold',
    s_out: 's out',

    // Grounding
    breathe_in_anim: 'breathe in',
    hold_anim: 'hold',
    breathe_out_anim: 'breathe out',

    // Grounding exercises
    ex_breathing_title: 'box breathing',
    ex_breathing_inst: '4s in \u2022 4s hold \u2022 4s out \u2022 4s hold. 4 rounds. you got this.',
    ex_54321_title: '5-4-3-2-1 grounding',
    ex_54321_inst: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. go slow.',
    ex_cold_title: 'cold reset',
    ex_cold_inst: 'splash cold water on your face or hold ice. activates your dive reflex. instant calm hack.',
    ex_mindful_title: 'mindful check-in',
    ex_mindful_inst: 'close your eyes 10 seconds. find the tension. breathe into it. open when ready.',
    ex_movement_title: 'shake it off (literally)',
    ex_movement_inst: 'stand up. shake hands, arms, legs for 30 seconds. shake the tension right out of your body.',

    // Physical
    physical_title: '\u{1F4AA} body quest',
    done_claim_xp: 'done! claim xp',
    nah_next: 'nah, next one',

    physical_exercises: [
      {
        emoji: '\u{1F9CD}', name: 'Wall Push-Ups',
        desc: 'release upper body tension. low-key arm day.',
        steps: ['Stand arm\u2019s length from a wall, palms flat.', 'Bend elbows, lean in slowly.', 'Push back. Repeat 10 times.', 'Focus on slow, controlled movement.'],
      },
      {
        emoji: '\u{1F9D8}', name: 'Seated Spinal Twist',
        desc: 'releases tension + activates your vagus nerve. fancy.',
        steps: ['Sit tall, feet flat.', 'Right hand on left knee.', 'Twist left, hold 15s.', 'Switch sides. 3 times each.'],
      },
      {
        emoji: '\u{1F4AA}', name: 'Tension Squeeze & Release',
        desc: 'deliberately tense then release. your nervous system loves this trick.',
        steps: ['Clench both fists HARD for 5 seconds.', 'Release. Feel the warmth.', 'Shoulders to ears, 5 seconds.', 'Drop. Repeat 3 cycles.'],
      },
      {
        emoji: '\u{1F3C3}', name: 'Calf Raises',
        desc: 'gets blood moving. sneaky cardio.',
        steps: ['Stand hip-width, hold wall for balance.', 'Rise onto toes, hold 2s.', 'Lower slowly. 15 reps.', 'Last 5: go extra slow.'],
      },
      {
        emoji: '\u{1F64C}', name: 'Stretch & Shake',
        desc: 'break the phone hunch. shake out the stagnant energy.',
        steps: ['Reach overhead, interlace fingers.', 'Lean each side, 5s each.', 'Drop arms, shake everything 15s.', 'Stand still. Notice the difference.'],
      },
      {
        emoji: '\u{1F9CE}', name: 'Deep Squat Hold',
        desc: 'primal resting position. your hips will thank you.',
        steps: ['Feet wider than shoulders.', 'Lower into deep squat (use support).', 'Hold 20\u201330 seconds, breathe.', 'Stand slowly. Repeat 3x.'],
      },
      {
        emoji: '\u{270B}', name: 'Finger Tapping',
        desc: 'bilateral stimulation = calm amygdala. it\u2019s brain science.',
        steps: ['Tap each finger to thumb: index\u2192pinky.', 'Go forward and back. Speed up.', 'Both hands, opposite directions.', '60 seconds. Feel focus sharpen.'],
      },
      {
        emoji: '\u{1F43B}', name: 'Bear Crawl (30s)',
        desc: 'cross-lateral movement. full brain + body reset.',
        steps: ['All fours, knees hovering.', 'Crawl: right hand + left foot, then swap.', '15s forward, 15s backward.', 'Rest. Brain-body reset complete.'],
      },
    ],

    // Tasks
    quests_title: '\u{1F4CB} quests',
    new_quest: '+ new quest',
    empty_quests: 'no quests yet. add stuff you wanna get done and earn xp!',
    no_quests_nudge: "no quests yet! add some and i'll match one to your vibe.",

    // Add task screen
    add_quest_title: '\u{1F4CB} new quest',
    task_placeholder: 'e.g. reply to emails, go for a walk...',
    whats_mission: "what's the mission?",
    energy_cost: 'energy cost',
    energy_low: '\u{1F331} low',
    energy_medium: '\u2600\uFE0F medium',
    energy_high: '\u{1F525} high',
    category_label: 'category',
    cat_work: 'work',
    cat_personal: 'personal',
    cat_health: 'health',
    cat_creative: 'creative',
    cat_social: 'social',
    add_quest_btn: 'add quest \u2694\uFE0F',

    // Mood suggestions
    sug_calm: "great headspace. time to crush something.",
    sug_anxious: "let's slow it way down. tiny steps count.",
    sug_nervous: "your body's activated. let's work with that gently.",
    sug_bored: "boredom = doorway. what sounds even slightly fun?",
    sug_overwhelmed: "you don't have to do everything. pick ONE tiny thing.",
    sug_restless: "that energy wants to go somewhere. let's aim it.",

    // Nudge messages
    nudge_scroll: [
      "scroll patrol here \u{1F6A8} your brain deserves better content than that. wanna do a quest?",
      "caught ya! no judgment tho. how about we swap scrolling for something that'll actually feel good?",
      "hey \u{1F44B} that's some quality scroll time. your future self would love it if you switched gears rn.",
      "plot twist: doing literally anything on your quest list will feel better than scrolling. try it?",
    ],
    nudge_time: [
      "hey you've been on a while. your nervous system is giving side-eye. wanna take a breath?",
      "long sesh! even 2 minutes away from the screen can reset everything. power-up time?",
      "your eyes called, they want a break. how about a quick body quest?",
    ],

    // Titles
    titles: [
      'Phone Zombie', 'Scroll Apprentice', 'Awareness Spark', 'Breath Novice',
      'Grounding Student', 'Focus Padawan', 'Calm Warrior', 'Zen Knight',
      'Regulation Wizard', 'Nervous System Boss', 'Inner Peace Sensei',
      'Literally Buddha',
    ],

    // Streak
    day: 'day',
    days: 'days',

    // Lang toggle
    lang_label: 'PT',
  },

  pt: {
    greeting_morning: ['bom dia, como voc\u00ea t\u00e1?', 'e a\u00ed, como acordou?', 'check-in matinal'],
    greeting_afternoon: ['boa tarde, como t\u00e1 a vibe?', 'e a\u00ed, como t\u00e1?', 'check-in da tarde'],
    greeting_evening: ['boa noite, como t\u00e1?', 'e a\u00ed corujinha, tudo bem?', 'check-in noturno'],
    mood_subtitle: 'como t\u00e1 seu sistema nervoso agora?',
    mood_calm: 'de boa',
    mood_anxious: 'ansioso',
    mood_nervous: 'agitado',
    mood_bored: 'entediado',
    mood_overwhelmed: 'sobrecarregado',
    mood_restless: 'inquieto',

    level: 'N\u00edvel',
    switch_mood: 'trocar',
    screen_sesh: '\u23F1 tempo de tela',
    badge_ok: 'de boa',
    badge_warning: 'hmm',
    badge_danger: 'eita',
    timer_hint_ok: 'timer rodando, sem julgamento',
    timer_hint_warning: 'talvez seja hora de parar?',
    timer_hint_danger: 'seu sistema nervoso t\u00e1 implorando',
    reset: 'resetar',
    caught_scrolling: '\u{1F4F1} tava scrollando',
    honesty_msg: 'respeito pela honestidade \u{1F64F}',

    suggestion_title: '\u{1F4AC} ei, amigo',
    lets_go: 'bora!',
    nah: 'agora n\u00e3o',

    powerups_label: '\u{1F3AE} power-ups',
    pu_breath_game: 'jogo da respira\u00e7\u00e3o',
    pu_body_quest: 'quest corporal',
    pu_breathe: 'respirar',
    pu_ground: 'aterrar',
    pu_random_quest: 'quest aleat\u00f3ria',
    pu_surprise: 'me surpreenda',

    breath_cal_title: '\u{1FAC1} calibra\u00e7\u00e3o da respira\u00e7\u00e3o',
    breath_cal_subtitle: 'segure o blob enquanto inspira. solte quando expirar. 5 rodadas, no seu ritmo.',
    hold_me: 'segure',
    breathing_in: 'inspirando...',
    breathing_out: 'expirando...',
    round_x_of_5: 'rodada {n} / 5',
    cal_fast: 'respira\u00e7\u00e3o r\u00e1pida! uma sess\u00e3o guiada pode te ajudar a desacelerar.',
    cal_medium: 'ritmo bom. vamos aprofundar um pouco com respira\u00e7\u00e3o guiada.',
    cal_deep: 'uau, respira\u00e7\u00e3o profunda. vamos manter essa onda.',
    start_guided: 'come\u00e7ar respira\u00e7\u00e3o guiada \u2728',
    guided_title: '\u2728 sua respira\u00e7\u00e3o',
    guided_subtitle: 'ajustada ao SEU ritmo. siga o blob.',
    guided_done: 'muito bom \u2728',
    redo: 'refazer',
    slower: 'mais lento (+1s)',
    breathe_in: 'inspire',
    hold: 'segure',
    breathe_out: 'expire',
    get_ready: 'preparar...',
    s_in: 's inspira\u00e7\u00e3o',
    s_hold: 's pausa',
    s_out: 's expira\u00e7\u00e3o',

    breathe_in_anim: 'inspire',
    hold_anim: 'segure',
    breathe_out_anim: 'expire',

    ex_breathing_title: 'respira\u00e7\u00e3o quadrada',
    ex_breathing_inst: '4s inspira \u2022 4s segura \u2022 4s expira \u2022 4s segura. 4 rodadas. voc\u00ea consegue.',
    ex_54321_title: '5-4-3-2-1 aterramento',
    ex_54321_inst: '5 coisas que v\u00ea, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia. v\u00e1 devagar.',
    ex_cold_title: 'reset gelado',
    ex_cold_inst: 'jogue \u00e1gua fria no rosto ou segure gelo. ativa o reflexo de mergulho. hack instant\u00e2neo de calma.',
    ex_mindful_title: 'check-in consciente',
    ex_mindful_inst: 'feche os olhos 10 segundos. encontre a tens\u00e3o. respire nela. abra quando estiver pronto.',
    ex_movement_title: 'sacuda tudo (literalmente)',
    ex_movement_inst: 'levante. sacuda m\u00e3os, bra\u00e7os, pernas por 30 segundos. sacuda a tens\u00e3o pra fora do corpo.',

    physical_title: '\u{1F4AA} quest corporal',
    done_claim_xp: 'feito! pegar xp',
    nah_next: 'pr\u00f3ximo',

    physical_exercises: [
      {
        emoji: '\u{1F9CD}', name: 'Flex\u00e3o na Parede',
        desc: 'libera tens\u00e3o da parte superior. dia de bra\u00e7o leve.',
        steps: ['Fique a um bra\u00e7o de dist\u00e2ncia da parede, palmas apoiadas.', 'Dobre os cotovelos, incline devagar.', 'Empurre de volta. Repita 10 vezes.', 'Foque em movimentos lentos e controlados.'],
      },
      {
        emoji: '\u{1F9D8}', name: 'Tor\u00e7\u00e3o Espinhal Sentado',
        desc: 'libera tens\u00e3o + ativa o nervo vago. chique.',
        steps: ['Sente ereto, p\u00e9s no ch\u00e3o.', 'M\u00e3o direita no joelho esquerdo.', 'Gire pra esquerda, segure 15s.', 'Troque de lado. 3 vezes cada.'],
      },
      {
        emoji: '\u{1F4AA}', name: 'Aperto e Libera\u00e7\u00e3o',
        desc: 'tensione e solte de prop\u00f3sito. seu sistema nervoso ama esse truque.',
        steps: ['Feche os punhos COM FOR\u00c7A por 5 segundos.', 'Solte. Sinta o calor.', 'Ombros nas orelhas, 5 segundos.', 'Solte. Repita 3 ciclos.'],
      },
      {
        emoji: '\u{1F3C3}', name: 'Eleva\u00e7\u00e3o de Panturrilha',
        desc: 'faz o sangue circular. cardio disfarçado.',
        steps: ['P\u00e9s na largura do quadril, apoie na parede.', 'Suba na ponta dos p\u00e9s, segure 2s.', 'Des\u00e7a devagar. 15 repeti\u00e7\u00f5es.', '\u00daltimas 5: v\u00e1 bem devagar.'],
      },
      {
        emoji: '\u{1F64C}', name: 'Alongar e Sacudir',
        desc: 'quebre a postura de celular. sacuda a energia parada.',
        steps: ['Estique os bra\u00e7os acima, entrelace os dedos.', 'Incline pro lado, 5s cada.', 'Solte os bra\u00e7os, sacuda tudo por 15s.', 'Fique parado. Sinta a diferen\u00e7a.'],
      },
      {
        emoji: '\u{1F9CE}', name: 'Agachamento Profundo',
        desc: 'posi\u00e7\u00e3o de descanso primitiva. seu quadril agradece.',
        steps: ['P\u00e9s mais largos que os ombros.', 'Des\u00e7a num agachamento profundo (use apoio).', 'Segure 20\u201330 segundos, respire.', 'Levante devagar. Repita 3x.'],
      },
      {
        emoji: '\u{270B}', name: 'Toque dos Dedos',
        desc: 'estimula\u00e7\u00e3o bilateral = am\u00edgdala calma. \u00e9 neuroci\u00eancia.',
        steps: ['Toque cada dedo no polegar: indicador\u2192mindinho.', 'V\u00e1 e volte. Acelere.', 'Duas m\u00e3os, dire\u00e7\u00f5es opostas.', '60 segundos. Sinta o foco aumentar.'],
      },
      {
        emoji: '\u{1F43B}', name: 'Rastejar de Urso (30s)',
        desc: 'movimento cruzado. reset completo de c\u00e9rebro + corpo.',
        steps: ['Quatro apoios, joelhos flutuando.', 'Rasteje: m\u00e3o direita + p\u00e9 esquerdo, depois troque.', '15s pra frente, 15s pra tr\u00e1s.', 'Descanse. Reset completo.'],
      },
    ],

    quests_title: '\u{1F4CB} quests',
    new_quest: '+ nova quest',
    empty_quests: 'sem quests ainda. adicione coisas que quer fazer e ganhe xp!',
    no_quests_nudge: 'sem quests ainda! adicione algumas e eu vou combinar com sua vibe.',

    add_quest_title: '\u{1F4CB} nova quest',
    task_placeholder: 'ex. responder emails, dar uma caminhada...',
    whats_mission: 'qual \u00e9 a miss\u00e3o?',
    energy_cost: 'custo de energia',
    energy_low: '\u{1F331} baixo',
    energy_medium: '\u2600\uFE0F m\u00e9dio',
    energy_high: '\u{1F525} alto',
    category_label: 'categoria',
    cat_work: 'trabalho',
    cat_personal: 'pessoal',
    cat_health: 'sa\u00fade',
    cat_creative: 'criativo',
    cat_social: 'social',
    add_quest_btn: 'adicionar quest \u2694\uFE0F',

    sug_calm: 'cabe\u00e7a boa. hora de mandar ver em algo.',
    sug_anxious: 'vamos desacelerar. passos pequenos contam.',
    sug_nervous: 'seu corpo t\u00e1 ativado. vamos lidar com isso suavemente.',
    sug_bored: 't\u00e9dio = porta. o que parece minimamente interessante?',
    sug_overwhelmed: 'voc\u00ea n\u00e3o precisa fazer tudo. escolha UMA coisinha.',
    sug_restless: 'essa energia quer ir pra algum lugar. vamos direcionar.',

    nudge_scroll: [
      'patrulha do scroll aqui \u{1F6A8} seu c\u00e9rebro merece conte\u00fado melhor. bora fazer uma quest?',
      'peguei! sem julgamento. que tal trocar o scroll por algo que vai te fazer bem de verdade?',
      'ei \u{1F44B} bastante scroll hein. seu eu do futuro ia adorar se voc\u00ea mudasse de atividade agora.',
      'plot twist: fazer qualquer coisa da sua lista vai ser melhor que scrollar. tenta?',
    ],
    nudge_time: [
      'ei, voc\u00ea t\u00e1 h\u00e1 um tempo. seu sistema nervoso t\u00e1 te olhando torto. quer respirar?',
      'sess\u00e3o longa! 2 minutinhos longe da tela reseta tudo. hora do power-up?',
      'seus olhos ligaram, querem uma pausa. que tal uma quest corporal?',
    ],

    titles: [
      'Zumbi do Celular', 'Aprendiz do Scroll', 'Fagulha de Consci\u00eancia', 'Novato da Respira\u00e7\u00e3o',
      'Estudante de Aterramento', 'Padawan do Foco', 'Guerreiro da Calma', 'Cavaleiro Zen',
      'Mago da Regula\u00e7\u00e3o', 'Boss do Sistema Nervoso', 'Sensei da Paz Interior',
      'Literalmente Buda',
    ],

    day: 'dia',
    days: 'dias',

    lang_label: 'EN',
  },
};
