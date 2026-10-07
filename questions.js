// ============================================================
//  QUIZ CONTENT  -  EDIT THIS FILE TO CUSTOMIZE YOUR QUIZ
// ============================================================
//
//  The quiz has TWO parts:
//
//  1) QUESTIONS  -  multiple-choice questions (30 of them).
//     Each one is an object with:
//       question : the text shown to the player
//       options  : the answer choices (keep them all strings)
//       answer   : the position of the CORRECT option, from 0:
//                    0 = first option, 1 = second, 2 = third, 3 = fourth
//
//  2) ESSAYS  -  open-ended questions (5 of them).
//     Each one is an object with:
//       question   : the prompt shown to the player
//       placeholder: light hint text inside the answer box
//       sample     : YOUR own answer, revealed on the results
//                    screen so the player can compare. Replace
//                    these with your real answers!
//
//  The counter, progress bar and score update by themselves,
//  so add or remove as many as you like. Multiple-choice
//  answers are scored automatically; essays are not scored,
//  they are just shown next to your sample answer at the end.
// ============================================================

const QUESTIONS = [
  {
    question: "Apa makanan favoritnya?",
    options: [
      "Burger khas Bungurasih",
      "Bayu",
      "Mie sedaap rasa Laksa",
      "Seblak Naira",
    ],
    answer: 3,
  },
  {
    question: "Apa game Favorit dia?",
    options: ["Minecraft", "Roblox", "Marvel Rivals", "Mobile Legend"],
    answer: 2,
  },
  {
    question: "Tiap kapan dia kebungur?",
    options: ["Setiap hari",
              "Setiap weekend",
              "Setiap disuruh bunda",
              "Karepku dewe"],
    answer: 2, 
  },
  {
    question: "Dia kalo gabut paling sering ngapain?",
    options: ["Mabar",
              "Ke Tunjungan",
              "Nonton Film",
              "Ngedit"],
    answer: 3,
  },
  {
    question: "Kira-kira dia ikut fandom apa?",
    options: ["Attack On Titan",
              "Marvel",
              "My Little Pony",
              "FOMO LEK WKWK"],
    answer: 1,
  },
  {
    question: "Karakters fiksi kesukaan dia apa?",
    options: ["Wanda Maximoff",
              "Jean Grey",
              "Betsy Braddock",
              "Tiga-tiganya"],
    answer: 3,
  },
  {
    question: "Mall Favorit dia?",
    options: ["Royal Plaza",
               "Pakuwon Mall",
                "Galaxy Mall",
                 "Tunjungan Plaza"],
    answer: 3,
  },
  {
    question: "My little Pony favorit dia?",
    options: ["Pinkie Pie", "Twilight Sparkle", "Princess Luna", "Princess Cadence"],
    answer: 1,
  },
  {
    question: "Anggik dan Nia siapanya dia?",
    options: [
      "Musuh",
      "Gak kenal",
      "Bestiieeehhhz",
      "Fav Gangster",
    ],
    answer: 3,
  },
  {
    question: "Kalo Dipi dan Luhur siapanya dia?",
    options: ["orang gelap",
              "kawan dekat",
              "gak kenal v2",
              "kawan punk fav"],
    answer: 3,
  },
  {
    question: "Mapel TKA yang dia pilih apa?",
    options: ["Jepang-manajemen",
              "Arab-Fisika",
              "Inggris T2-TJKT",
              "DKV-MTK T2"],
    answer: 2,
  },
  {
    question: "Lagu favorit dia apa?",
    options: ["Oh Yeah?-Steve",
              "Heroes-David Bowie",
              "Welcome And Goodbye-Dream, Ivory ",
              "Loving Machine-TV Girl"],
    answer: 2,
  },
  {
    question: "Tebak Tanggal Lahir dia?",
    options: ["24 Juni 2009",
              "06 Juni 2008",
               "16 Juni 2008",
                "16 Juni 2009"],
    answer: 2,
  },
  {
    question: "Tempat Makan fav dia apa kalau ke mall?",
    options: ["Marugame Udon",
               "Haraku Ramen",
                "Dua-duanya",
                 "gakk bet mangan"],
    answer: 1,
  },
  {
    question: "Menurutmu dia pernah pacarankah?",
    options: ["Pernah",
               "gak pernah",
                "bayu",
                 "dia kan pathetic"],
    answer: 1,
  },
  {
    question: "Kira-kira dia masih main Lego gak?",
    options: ["Masih",
               "udah enggak",
                "aku tanya chat gpt dulu",
                 "gak tau"],
    answer: 0,
  },
  {
    question: "Dia suka ke event-event kayak bazar buku gak?",
    options: [
      "Suka",
      "Suka banget",
      "Tergantung yang dijual",
      "bokek",
    ],
    answer: 1,
  },
  {
    question: "Kalo dia Main ML, apa hero fav nya dia?",
    options: ["Angela",
               "Kagura",
               "Selena",
                 "Nolan"],
    answer: 2,
  },
  {
    question: "Terus Character yang sering dia pake di Marvel Rivals apa?",
    options: [
      "Invisible Woman",
      "Cloak & Dagger",
      "Scarlet Witch",
      "Psylocke",
    ],
    answer: 0,
  },
  {
    question: "Isu komik Fav nya dia?",
    options: ["Secret Wars",
               "Avengers vs X-men",
               "Uncanny Avengers",
                "Uncanny X-men"],
    answer: 1,
  },
  {
    question: "Aktor cowo western Fav dia?",
    options: ["Chris Hemsworth", "Chris Evans", "Luke roberts", "Paul Mescal"],
    answer: 1,
  },
  {
    question: "Tema kesukaan dia apa?",
    options: ["Pixelate", "Neon Tech", "Paper scrap", "doodle"],
    answer: 0,
  },
  {
    question: "Menurutmu dia suka cewe gak?",
    options: ["iya", "dia gay", "gak tau", "Woooiii"],
    answer: 3,
  },
  {
    question: "Dia introvert atau ekstrovert?",
    options: ["Ekstrovert", "Introvert", "Ambivert", "Se mood dia kayaknya"],
    answer: 1,
  },
  {
    question: "Jajan kesukaan dia?",
    options: [
      "Sempol",
      "Telor gulung",
      "Maklor",
      "lgsg sego",
    ],
    answer: 2,
  },
  {
    question: "Pelajaran sekolah favorit dia?",
    options: ["MTK", "Produktif", "Inggris", "Wirausaha"],
    answer: 2,
  },
  {
    question: "Kalau suatu saat dia ke USA, toko apa yang akan dia kunjungi?",
    options: ["Lego store", "Comic Store", "White House", "Chris Evans"],
    answer: 1,
  },
  {
    question: "Menurut desas-desus sebenarnya dia punya seperti punya 2 kepribadian, apkaah benar?",
    options: ["iya", "gak", "gak tau", "lapo ngurusi"],
    answer: 3,
  },
  {
    question: "kalo menurutmu iya, emang siapa?",
    options: ["Fadhil-Dukun", "Ali-Fadhil", "Ali-Serigala Kedungturi", "Fadhi-lah"],
    answer: 3,
  },
  {
    question: "Fav bioskop buat nonton?",
    options: ["XXI", "CGV", "Cinepolis", "imax"],
    answer: 3,
  },
];

const ESSAYS = [
  {
    question: "Apa yang membuat kamu mau temenan ama dia?",
    placeholder: "Hayoo apa coba…",
    sample: "...",
  },
  {
    question: "Ada teori khusus kah kamu tentang ikatan antara dia dan Seblak Naira?",
    placeholder: "uihhh penasarannya aku…",
    sample: "Replace this with your real answer, e.g. gaming and sleeping in.",
  },
  {
    question: "Menurut kamu, apakah dia orang yang tepat untuk deeptalk",
    placeholder: "cocok kayaknya…",
    sample: "Replace this with your real answer.",
  },
  {
    question: "Menurutmu kalo setuju, apa alasanmu, dan apakah kamu ingin merekomenddasikannya ketemanmu?",
    placeholder: "oopsie…",
    sample: "Replace this with your real answer, e.g. Japan.",
  },
  {
    question: "Menurutmu kalo gak setuju, apa alasannya?",
    placeholder: "woilah sedih guweh…",
    sample: "Replace this with your real answer.",
  },
];
