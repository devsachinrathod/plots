// Populates the database with starter content: 30 Day-1 vocabulary words
// and a handful of grammar lessons. Run with: npm run seed
require('dotenv').config();
const connectDB = require('./config/db');
const Word = require('./models/Word');
const Progress = require('./models/Progress');
const Grammar = require('./models/Grammar');

const day1 = [
  {
    word: 'Convenient',
    pronunciation: '/kənˈviːniənt/',
    meaning: 'Suitable, easy, or not causing trouble for a particular situation.',
    hindiMeaning: 'सुविधाजनक',
    example: 'Is Monday convenient for the meeting?',
    exampleMeaning: 'क्या मीटिंग के लिए सोमवार सुविधाजनक है?',
    memoryTrick: '"Convenient" has "vent" in it - like a vent that lets things flow easily, without trouble.',
  },
  {
    word: 'Confident',
    pronunciation: '/ˈkɒnfɪdənt/',
    meaning: 'Feeling sure about yourself or your abilities.',
    hindiMeaning: 'आत्मविश्वासी',
    example: 'He felt confident before his presentation.',
    exampleMeaning: 'प्रेजेंटेशन से पहले उसे आत्मविश्वास महसूस हुआ।',
    memoryTrick: 'Stand tall like nothing can put a "dent" in your confidence.',
  },
  {
    word: 'Reliable',
    pronunciation: '/rɪˈlaɪəbl/',
    meaning: 'Able to be trusted to do what is expected.',
    hindiMeaning: 'भरोसेमंद',
    example: 'He is a reliable colleague who always finishes work on time.',
    exampleMeaning: 'वह एक भरोसेमंद सहकर्मी है जो हमेशा समय पर काम पूरा करता है।',
    memoryTrick: '"Rely-able" - someone you are able to rely on.',
  },
  {
    word: 'Available',
    pronunciation: '/əˈveɪləbl/',
    meaning: 'Free or ready to be used, met, or spoken to.',
    hindiMeaning: 'उपलब्ध',
    example: 'Are you available for a call this afternoon?',
    exampleMeaning: 'क्या आप आज दोपहर कॉल के लिए उपलब्ध हैं?',
    memoryTrick: '"Avail" means to use - "available" means ready for you to use or reach.',
  },
  {
    word: 'Punctual',
    pronunciation: '/ˈpʌŋktʃuəl/',
    meaning: 'Arriving or doing things at the exact expected time.',
    hindiMeaning: 'समयनिष्ठ / समय का पाबंद',
    example: 'She is always punctual and never late for meetings.',
    exampleMeaning: 'वह हमेशा समयनिष्ठ है और मीटिंग के लिए कभी देर नहीं करती।',
    memoryTrick: 'Think of a "point" on the clock - punctual people hit that exact point every time.',
  },
  {
    word: 'Genuine',
    pronunciation: '/ˈdʒenjuɪn/',
    meaning: 'Real, sincere, and honest - not fake.',
    hindiMeaning: 'सच्चा / वास्तविक',
    example: 'Thank you for your genuine concern about my health.',
    exampleMeaning: 'मेरी सेहत को लेकर आपकी सच्ची चिंता के लिए धन्यवाद।',
    memoryTrick: 'A "genuine" diamond is the real one, not the imitation.',
  },
  {
    word: 'Considerate',
    pronunciation: '/kənˈsɪdərət/',
    meaning: 'Careful not to cause inconvenience or hurt to others.',
    hindiMeaning: 'विचारशील / दूसरों का ख्याल रखने वाला',
    example: 'It was considerate of you to call before visiting.',
    exampleMeaning: 'आपका विज़िट से पहले कॉल करना बहुत विचारशील था।',
    memoryTrick: '"Consider" + ate - someone who has really thought about how you feel.',
  },
  {
    word: 'Approachable',
    pronunciation: '/əˈproʊtʃəbl/',
    meaning: 'Easy and friendly to talk to.',
    hindiMeaning: 'सहज रूप से बात करने योग्य',
    example: 'Our new manager is very approachable and easy to talk to.',
    exampleMeaning: 'हमारे नए मैनेजर बहुत सहज हैं और उनसे बात करना आसान है।',
    memoryTrick: '"Approach" + able - someone you are easily able to walk up to and talk to.',
  },
  {
    word: 'Straightforward',
    pronunciation: '/ˌstreɪtˈfɔːrwərd/',
    meaning: 'Simple, clear, and direct - easy to understand.',
    hindiMeaning: 'सीधा-सादा / स्पष्ट',
    example: 'Please give me a straightforward answer, yes or no.',
    exampleMeaning: 'कृपया मुझे सीधा जवाब दें, हाँ या ना।',
    memoryTrick: 'It goes "straight forward" - no twists, no turns.',
  },
  {
    word: 'Appreciate',
    pronunciation: '/əˈpriːʃieɪt/',
    meaning: 'To be grateful for something, or to recognize its value.',
    hindiMeaning: 'सराहना करना / आभारी होना',
    example: 'I really appreciate your help with this project.',
    exampleMeaning: 'इस प्रोजेक्ट में आपकी मदद के लिए मैं वाकई आभारी हूँ।',
    memoryTrick: 'Think "a price" - you are putting a high value on what someone did for you.',
  },
  {
    word: 'Keep me posted',
    pronunciation: '/kiːp miː ˈpoʊstɪd/',
    meaning: 'Please continue to update me with new information.',
    hindiMeaning: 'मुझे जानकारी देते रहना',
    example: 'Keep me posted on how the project is going.',
    exampleMeaning: 'प्रोजेक्ट कैसा चल रहा है, मुझे बताते रहना।',
    memoryTrick: 'Picture updates being "posted" to you regularly, like letters in the mail.',
  },
  {
    word: 'Get back to you',
    pronunciation: '/ɡet bæk tuː juː/',
    meaning: 'To reply or respond to someone at a later time.',
    hindiMeaning: 'बाद में जवाब देना / संपर्क करना',
    example: 'Let me check and get back to you by tomorrow.',
    exampleMeaning: 'मुझे जांचने दो, मैं कल तक आपको जवाब दूँगा।',
    memoryTrick: 'Picture the question flying out to you, then coming "back" like a boomerang.',
  },
  {
    word: 'Touch base',
    pronunciation: '/tʌtʃ beɪs/',
    meaning: 'To make brief contact or check in with someone.',
    hindiMeaning: 'संपर्क करना / हालचाल लेना',
    example: "Let's touch base next week about the budget.",
    exampleMeaning: 'अगले हफ्ते बजट के बारे में बात करते हैं।',
    memoryTrick: 'From baseball - quickly "touching base" before moving on to the next thing.',
  },
  {
    word: 'Look forward to',
    pronunciation: '/lʊk ˈfɔːrwərd tuː/',
    meaning: 'To feel excited or pleased about something that is going to happen.',
    hindiMeaning: 'बेसब्री से इंतज़ार करना',
    example: 'I look forward to meeting you in person.',
    exampleMeaning: 'मैं आपसे व्यक्तिगत रूप से मिलने का बेसब्री से इंतज़ार कर रहा/रही हूँ।',
    memoryTrick: 'Your eyes are already looking "forward" toward something good coming up.',
  },
  {
    word: 'To be honest',
    pronunciation: '/tuː biː ˈɒnɪst/',
    meaning: 'Used to say something truthfully, even if it might be awkward.',
    hindiMeaning: 'सच कहूँ तो',
    example: "To be honest, I didn't understand the last point.",
    exampleMeaning: 'सच कहूँ तो, मुझे आखिरी बात समझ नहीं आई।',
    memoryTrick: 'Like raising a small flag before you say something completely truthful.',
  },
  {
    word: 'By the way',
    pronunciation: '/baɪ ðə weɪ/',
    meaning: 'Used to casually introduce a new or related topic.',
    hindiMeaning: 'वैसे / प्रसंगवश',
    example: 'By the way, did you finish the report?',
    exampleMeaning: 'वैसे, क्या आपने रिपोर्ट पूरी की?',
    memoryTrick: 'Picture casually turning onto a small side street ("the way") mid-conversation.',
  },
  {
    word: 'As soon as possible',
    pronunciation: '/æz suːn æz ˈpɒsəbl/',
    meaning: 'Immediately, without any delay.',
    hindiMeaning: 'जितनी जल्दी हो सके',
    example: 'Please send the file as soon as possible.',
    exampleMeaning: 'कृपया फ़ाइल जितनी जल्दी हो सके भेज दें।',
    memoryTrick: 'The short form is everywhere: "ASAP" - As Soon As Possible.',
  },
  {
    word: 'On the same page',
    pronunciation: '/ɒn ðə seɪm peɪdʒ/',
    meaning: 'To have the same understanding or be in agreement.',
    hindiMeaning: 'एक ही राय पर होना / सहमत होना',
    example: "Let's make sure we're on the same page before the client call.",
    exampleMeaning: 'क्लाइंट कॉल से पहले सुनिश्चित करते हैं कि हम सब एक ही राय पर हैं।',
    memoryTrick: 'Picture everyone literally reading the same page of the same book.',
  },
  {
    word: 'Bear with me',
    pronunciation: '/beər wɪð miː/',
    meaning: 'Please be patient with me for a moment.',
    hindiMeaning: 'मेरे साथ थोड़ा धैर्य रखें',
    example: "Bear with me, I'm still learning this software.",
    exampleMeaning: 'थोड़ा धैर्य रखें, मैं अभी भी यह सॉफ्टवेयर सीख रहा/रही हूँ।',
    memoryTrick: 'Picture a slow, patient bear walking calmly beside you - no rushing.',
  },
  {
    word: 'No worries',
    pronunciation: '/noʊ ˈwʌriz/',
    meaning: 'A casual way of saying "it is okay" or "no problem."',
    hindiMeaning: 'कोई बात नहीं',
    example: 'No worries, we can reschedule the meeting.',
    exampleMeaning: 'कोई बात नहीं, हम मीटिंग फिर से शेड्यूल कर सकते हैं।',
    memoryTrick: 'Picture every worry simply melting away - none left at all.',
  },
  {
    word: 'Let me know',
    pronunciation: '/let miː noʊ/',
    meaning: 'Please tell or inform me.',
    hindiMeaning: 'मुझे बता देना',
    example: 'Let me know if you need any help.',
    exampleMeaning: 'अगर आपको कोई मदद चाहिए तो मुझे बता देना।',
    memoryTrick: 'You are literally asking someone to "let" the information reach you, to "know" it.',
  },
  {
    word: 'Feel free to',
    pronunciation: '/fiːl friː tuː/',
    meaning: 'You are welcome or allowed to do something, without hesitation.',
    hindiMeaning: 'बेझिझक करें',
    example: 'Feel free to ask me any questions.',
    exampleMeaning: 'बेझिझक मुझसे कोई भी सवाल पूछें।',
    memoryTrick: 'Picture yourself completely "free," with no hesitation, to just go ahead.',
  },
  {
    word: 'Make sense',
    pronunciation: '/meɪk sens/',
    meaning: 'To be understandable, clear, or logical.',
    hindiMeaning: 'समझ में आना / तर्कसंगत होना',
    example: 'Does this explanation make sense to you?',
    exampleMeaning: 'क्या यह व्याख्या आपको समझ में आती है?',
    memoryTrick: 'Picture puzzle pieces clicking together until the full picture "makes sense."',
  },
  {
    word: 'Catch up',
    pronunciation: '/kætʃ ʌp/',
    meaning: 'To meet and share news after a while, or to reach the same level as others.',
    hindiMeaning: 'मिलकर बातें करना / बराबरी करना',
    example: "Let's catch up over coffee this weekend.",
    exampleMeaning: 'इस वीकेंड कॉफी पर मिलकर बातें करते हैं।',
    memoryTrick: 'Picture jogging to "catch up" with a friend who walked ahead of you.',
  },
  {
    word: 'Follow up',
    pronunciation: '/ˈfɒloʊ ʌp/',
    meaning: 'To check on progress or take further action on something.',
    hindiMeaning: 'आगे की कार्रवाई करना / फॉलो-अप करना',
    example: "I'll follow up with the client tomorrow.",
    exampleMeaning: 'मैं कल क्लाइंट के साथ फॉलो-अप करूँगा/करूँगी।',
    memoryTrick: 'Picture following footprints until the job is truly finished "up" to completion.',
  },
  {
    word: 'Point out',
    pronunciation: '/pɔɪnt aʊt/',
    meaning: 'To draw attention to a specific detail or fact.',
    hindiMeaning: 'इशारा करना / बताना',
    example: 'She kindly pointed out a mistake in my email.',
    exampleMeaning: 'उसने बड़े प्यार से मेरे ईमेल में एक गलती की ओर इशारा किया।',
    memoryTrick: 'Picture literally pointing your finger "out" toward something specific.',
  },
  {
    word: 'Figure out',
    pronunciation: '/ˈfɪɡər aʊt/',
    meaning: 'To understand or solve something after thinking it through.',
    hindiMeaning: 'समझ पाना / हल निकालना',
    example: 'I need some time to figure out this problem.',
    exampleMeaning: 'मुझे इस समस्या को समझने के लिए थोड़ा समय चाहिए।',
    memoryTrick: 'Picture scattered numbers ("figures") slowly arranging themselves into an answer.',
  },
  {
    word: 'Bring up',
    pronunciation: '/brɪŋ ʌp/',
    meaning: 'To introduce or mention a topic in conversation.',
    hindiMeaning: 'विषय उठाना / बात छेड़ना',
    example: "He didn't want to bring up the topic during dinner.",
    exampleMeaning: 'वह डिनर के दौरान यह विषय नहीं उठाना चाहता था।',
    memoryTrick: 'Picture physically lifting a topic "up" from the ground into the conversation.',
  },
  {
    word: 'Sort out',
    pronunciation: '/sɔːrt aʊt/',
    meaning: 'To resolve a problem or arrange things properly.',
    hindiMeaning: 'सुलझाना / व्यवस्थित करना',
    example: 'We finally sorted out the confusion about the schedule.',
    exampleMeaning: 'आखिरकार हमने शेड्यूल को लेकर हुई उलझन सुलझा ली।',
    memoryTrick: 'Picture sorting messy papers into neat piles - that is "sorting out" a mess.',
  },
  {
    word: 'Sounds good',
    pronunciation: '/saʊndz ɡʊd/',
    meaning: 'A casual way of agreeing to or accepting a plan.',
    hindiMeaning: 'ठीक लगता है / मंज़ूर है',
    example: "Sounds good, let's meet at 5 PM.",
    exampleMeaning: 'ठीक लगता है, चलिए शाम 5 बजे मिलते हैं।',
    memoryTrick: 'Picture a pleasant "sound" reaching your ears - a plan that just sounds right.',
  },
];

const grammarLessons = [
  {
    title: 'Present Simple vs Present Continuous',
    category: 'Tenses',
    explanation:
      'The present simple describes habits, routines, facts, and permanent situations. The present continuous (be + verb-ing) describes actions happening right now or temporary situations around the present time.',
    rules: [
      "Use present simple for habits and routines: 'I go to the gym every morning.'",
      "Use present simple for facts and general truths: 'Water boils at 100°C.'",
      "Use present continuous for actions happening right now: 'She is cooking dinner.'",
      "Use present continuous for temporary situations: 'I am staying with my cousin this week.'",
      'Some verbs (know, like, believe, own) are rarely used in the continuous form.',
    ],
    examples: [
      { sentence: 'He plays cricket every Sunday.', meaning: 'वह हर रविवार क्रिकेट खेलता है। (आदत/नियमित क्रिया)' },
      { sentence: 'He is playing cricket right now.', meaning: 'वह अभी क्रिकेट खेल रहा है। (इस पल हो रही क्रिया)' },
      { sentence: 'Water freezes at 0°C.', meaning: 'पानी 0°C पर जम जाता है। (सामान्य सत्य)' },
      { sentence: 'I am learning English this year.', meaning: 'मैं इस साल अंग्रेज़ी सीख रहा/रही हूँ। (अस्थायी स्थिति)' },
    ],
  },
  {
    title: 'Present Perfect Tense',
    category: 'Tenses',
    explanation:
      "The present perfect (have/has + past participle) connects the past to the present. It's used for experiences, changes, and actions that started in the past and continue now, without saying exactly when something happened.",
    rules: [
      'Form: subject + have/has + past participle.',
      "Use it for life experiences: 'I have visited Japan.'",
      "Use it for recent actions with a present result: 'She has finished her homework.'",
      "Use it with 'for' and 'since' for actions continuing until now: 'I have lived here for 5 years.'",
      "Don't use it with a specific finished time (yesterday, last year) — use past simple instead.",
    ],
    examples: [
      { sentence: 'I have already eaten lunch.', meaning: 'मैं पहले ही दोपहर का खाना खा चुका/चुकी हूँ।' },
      { sentence: 'They have never been to Goa.', meaning: 'वे कभी गोवा नहीं गए हैं।' },
      { sentence: 'She has worked here since 2019.', meaning: 'वह 2019 से यहाँ काम कर रही है।' },
      { sentence: 'Have you finished the report yet?', meaning: 'क्या आपने रिपोर्ट पूरी कर ली है?' },
    ],
  },
  {
    title: 'Articles: A, An, and The',
    category: 'Articles',
    explanation:
      "Articles (a, an, the) tell us whether we're talking about something specific or general. 'A' and 'an' are indefinite articles used for one unspecified thing; 'the' is the definite article used for something specific or already known.",
    rules: [
      "Use 'a' before words starting with a consonant sound: 'a book', 'a university'.",
      "Use 'an' before words starting with a vowel sound: 'an apple', 'an hour'.",
      "Use 'the' when both speaker and listener know exactly what is meant: 'Close the door.'",
      "Use 'a/an' the first time you mention something; use 'the' after that.",
      "Don't use an article with plural or uncountable nouns used in a general sense: 'I like music.'",
    ],
    examples: [
      { sentence: 'I saw a dog in the park.', meaning: 'मैंने पार्क में एक कुत्ता देखा।' },
      { sentence: 'The dog was chasing a ball.', meaning: "वह कुत्ता एक गेंद के पीछे भाग रहा था। ('the dog' — वही कुत्ता जिसका पहले ज़िक्र हुआ)" },
      { sentence: 'She is an honest person.', meaning: "वह एक ईमानदार व्यक्ति है। ('honest' के 'h' की ध्वनि स्वर जैसी है)" },
      { sentence: 'The sun rises in the east.', meaning: 'सूरज पूर्व में उगता है। (एक ही जाना-पहचाना तथ्य)' },
    ],
  },
  {
    title: 'Prepositions of Time: In, On, At',
    category: 'Prepositions',
    explanation:
      'In, on, and at are the most common prepositions of time in English. Each one is used with a different level of specificity — from broad time periods to exact moments.',
    rules: [
      "Use 'in' for months, years, seasons, and long periods: 'in July', 'in 2024'.",
      "Use 'on' for specific days and dates: 'on Monday', 'on 5 August'.",
      "Use 'at' for precise times and fixed expressions: 'at 6 PM', 'at night', 'at noon'.",
      "Use 'in' for parts of the day (except night): 'in the morning', 'in the evening'.",
      "Exception: 'at night' uses 'at', not 'in'.",
    ],
    examples: [
      { sentence: 'My birthday is in March.', meaning: 'मेरा जन्मदिन मार्च में है।' },
      { sentence: 'We have a meeting on Friday.', meaning: 'हमारी शुक्रवार को एक बैठक है।' },
      { sentence: 'The train leaves at 9 o\'clock.', meaning: 'ट्रेन 9 बजे निकलती है।' },
      { sentence: 'I usually read at night.', meaning: 'मैं आमतौर पर रात में पढ़ता/पढ़ती हूँ।' },
    ],
  },
  {
    title: 'Common Punctuation Rules',
    category: 'Punctuation',
    explanation:
      'Punctuation marks organize sentences and make meaning clear. Getting the basics right — periods, commas, apostrophes, and question marks — makes your writing much easier to read.',
    rules: [
      'End every statement with a period (.) and every question with a question mark (?).',
      "Use a comma to separate items in a list: 'I bought apples, bananas, and milk.'",
      "Use an apostrophe for possession: 'Sachin's book', and for contractions: 'don't'.",
      "Use a comma before 'and/but/or' when joining two complete sentences.",
      'Capitalize the first word of every sentence and all proper nouns.',
    ],
    examples: [
      { sentence: 'Where are you going?', meaning: 'आप कहाँ जा रहे हैं? (प्रश्नवाचक चिह्न)' },
      { sentence: 'I need eggs, bread, and butter.', meaning: 'मुझे अंडे, ब्रेड और मक्खन चाहिए। (सूची में कॉमा)' },
      { sentence: "That is Priya's laptop.", meaning: 'वह प्रिया का लैपटॉप है। (स्वामित्व के लिए अपॉस्ट्रॉफी)' },
      { sentence: "It's raining, so take an umbrella.", meaning: 'बारिश हो रही है, इसलिए छाता ले जाओ।' },
    ],
  },
  {
    title: 'Subject-Verb Agreement',
    category: 'Sentence Structure',
    explanation:
      'The verb in a sentence must match its subject in number — singular subjects take singular verbs, and plural subjects take plural verbs. This is one of the most common areas where English learners make small mistakes.',
    rules: [
      "A singular subject takes a singular verb: 'He runs every day.'",
      "A plural subject takes a plural verb: 'They run every day.'",
      "Words like 'everyone' and 'each' are treated as singular: 'Everyone knows the answer.'",
      "Two subjects joined by 'and' usually take a plural verb: 'Rahul and Priya are coming.'",
      "The subject, not a nearby word, decides the verb: 'The box of chocolates is on the table.'",
    ],
    examples: [
      { sentence: 'She works at a hospital.', meaning: 'वह एक अस्पताल में काम करती है।' },
      { sentence: 'My friends live in Pune.', meaning: 'मेरे दोस्त पुणे में रहते हैं।' },
      { sentence: 'Everybody loves a good story.', meaning: 'हर किसी को एक अच्छी कहानी पसंद होती है।' },
      { sentence: 'The list of items is on the desk.', meaning: 'वस्तुओं की सूची डेस्क पर है।' },
    ],
  },
];

async function seed() {
  await connectDB();

  const existingWords = await Word.countDocuments();
  if (existingWords > 0) {
    console.log(`Database already has ${existingWords} word(s) — skipping word seed so nothing is overwritten.`);
  } else {
    const docs = day1.map((w, i) => ({ ...w, dayNumber: 1, order: i + 1 }));
    await Word.insertMany(docs);
    console.log(`Seeded ${docs.length} words for Day 1.`);
  }

  const existingGrammar = await Grammar.countDocuments();
  if (existingGrammar > 0) {
    console.log(`Database already has ${existingGrammar} grammar lesson(s) — skipping grammar seed.`);
  } else {
    await Grammar.insertMany(grammarLessons.map((g) => ({ ...g, source: 'seed' })));
    console.log(`Seeded ${grammarLessons.length} grammar lessons.`);
  }

  await Progress.getSingleton(); // creates the singleton progress doc if missing

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
