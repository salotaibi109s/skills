# سرّ الغرفة 404 — ملف الإنتاج الكامل
**القناة:** ابنِ ذكاءك · **الجمهور:** ٧–١٣ سنة · **الحلقات:** ٣ × ٦٠ ثانية · **المقاس:** 9:16 (1080×1920)
**الجملة الثابتة:** «فكّر، اكتشف، وخلّ ذكاءك يقودك!»

## الملفات الجاهزة
- الفيديوهات: `out/room404-ep1.mp4` و`out/room404-ep2.mp4` و`out/room404-ep3.mp4`.
- الكود: `src/room404/`.
  - `kit.tsx` فيه الشخصيات المشتركة وزيرو والأماكن والعد التنازلي وبطاقة الجملة الثابتة.
  - `EpA.tsx` و`EpB.tsx` و`EpC.tsx` للحلقات الثلاث.
- **ملاحظة:** الحلقات مرسومة بستايل كرتون مجسّم بالكود (2.5D)، مو 3D حقيقي. البرومتات تحت جاهزة لو حبيت تولّد نسخة 3D سينمائية في Higgsfield أو Veo أو Kling.

---

## ١) الوصف المرجعي الثابت للشخصيات

### جوانا (البطلة)
- **العمر:** ٩ سنوات، طالبة في الصف الثالث، ونفس جوانا من «يوميات جوانا».
- **الشكل:** وجه دائري، عيون بنية واسعة، ونظارة طبية بإطار وردي مستطيل بزوايا مدوّرة.
- **الشعر:** بني مرتب، فيه غرّة، وذيل حصان على اليمين بربطة وردية.
- **اللبس:** مريول مدرسي أزرق فاتح فوق قميص أبيض بأكمام طويلة، وجوارب بيضاء طويلة، وحذاء أسود.
- **الصوت:** ElevenLabs «Abir» (`VcSFj5ljnKA0aQcxeHpl`)، موديل `eleven_v4`، برفع نبرة ‎×1.14. نفس صوتها في «يوميات جوانا».
- **الشخصية:** تلاحظ التفاصيل وتحلّلها، وتوصل للحل بالمنطق.
- **Prompt reference (EN):** *Joanna, a 9-year-old Saudi girl, round friendly face, large warm brown eyes behind pink rounded-rectangle prescription glasses, neat brown hair with bangs and a side ponytail tied with a pink scrunchie, light-blue school pinafore over a white long-sleeve shirt, white knee socks, black shoes, pink backpack. Pixar-style 3D, soft lighting. Keep identical in every shot.*

### فيصل (الشريك)
- **العمر:** ٦ سنوات، فهو أصغر وأقصر من جوانا بوضوح، تقريباً ثلاثة أرباع طولها.
- **الشكل:** وجه طفولي دائري، وعيون بنية واسعة، و**بدون نظارة**.
- **الشعر:** أسود قصير.
- **اللبس:** ثوب أبيض صغير بأزرار، وحذاء بني.
- **الصوت:** ElevenLabs «Salama – Saudi Character» (`0pDT8WvJXiBq0hxYB2Cp`)، صوت كرتون سعودي طفولي، برفع نبرة ‎×1.18 عشان يطلع بعمر ٦ سنين.
- **الشخصية:** مرح وشجاع، يحب الاختراعات، ويتسرّع أحياناً، مثل لما يضغط الدائرة في الحلقة ١ ويمسك السلك الأحمر في الحلقة ٢.
- **Prompt reference (EN):** *Faisal, a 6-year-old Saudi boy, noticeably shorter than Joanna (about three-quarters her height), chubby round face, big brown eyes, short black hair, small white thobe with buttons, brown shoes, no glasses, playful energetic body language. Pixar-style 3D. Keep identical in every shot.*

### زيرو (الروبوت)
- **الشكل:** روبوت صغير يطفو في الهواء، طوله تقريباً مثل فيصل، جسمه أبيض فضي لامع.
- **الرأس:** شاشة داكنة فيها عيون مضيئة بلون **سماوي #5CF2FF**. العيون تتغير:
  - نائم: خطوط رمادية.
  - سعيد: أقواس ^^.
  - واثق أو ساخر: خطوط مسطّحة.
  - مشكوك فيه: أحمر #FF4D6D مع تقطّع.
- **التفاصيل:** هوائي فوق الرأس بنقطة صفراء، ودائرة مضيئة في الصدر، وذراعين قصيرين، وتوهّج سماوي تحته.
- **الصوت:** ElevenLabs «Maher – Curious & Comedic Character» (`owhXz0MzSe5DSEzgWad4`) برفع نبرة ‎×1.04، مع مؤثر روبوتي خفيف (phaser وchorus وbitcrush). الكلام يبقى واضح.
- **الشخصية:** مرح وساخر أحياناً، ويخفي سر.
- **Prompt reference (EN):** *Zero, a small cute hovering robot, glossy white-silver capsule body, rounded head with a dark screen face showing glowing cyan (#5CF2FF) pill-shaped eyes, small antenna with a yellow tip, glowing cyan core on the chest, short stubby arms, soft cyan hover glow beneath, no legs. Eyes turn red and glitch when suspicious. Pixar-style 3D. Keep identical in every shot.*

### الهوية البصرية
- **الألوان:** خلفيات تيل غامقة (#0E2A33)، وسماوي نيون (#5CF2FF)، وأصفر للأسئلة (#FFD23F)، وأخضر للنجاح (#8EF7A0)، وأحمر للتحذير (#FF4D6D).
- **الخط:** Baloo Bhaijaan 2.
- **الأماكن الثابتة:**
  - ممر المدرسة الليلي: دواليب زرقاء، وأضواء سقف ترمش، والباب 404 برقم مضيء.
  - المختبر السري: أنابيب زجاج فيها فقاعات، وشاشة رسم بياني، وطاولة عمل.

---

## ٢) الحلقة الأولى: «الباب الذي لا يجب أن يُفتح» (٦٠ث)

| الوقت | اللقطة | الكاميرا | الحوار والأحداث | التعبير والحركة | الصوت والانتقال |
|---|---|---|---|---|---|
| 0–3.6 | ممر المدرسة الليلي، والباب 404 يلمع | Push-in بطيء نحو الباب | **فيصل:** «جوانا… هذا الباب ما كان موجود أمس!» | فيصل مصدوم ويأشر، وجوانا مصدومة | همهمة كهرباء، وضوء يرمش |
| 3.6–8.4 | نفس اللقطة | Push-in يكمل | **جوانا:** «غرفة أربعمية وأربعة؟ بس مدرستنا ما فيها إلا ثلاث أدوار!» | جوانا تفكر ويدها على ذقنها | — |
| 8.4–11.9 | لقطة قريبة للقفل: مثلث، مربع، خماسي، ؟ وتحته خيارات: دائرة، سداسي، نجمة | القفل يطلع من تحت للأعلى | **فيصل:** «وفيه قفل غريب… أشكال!» | فيصل متحمس | Whoosh |
| 11.9–15.5 | فيصل يضغط الدائرة | اهتزاز | **فيصل:** «أكيد دائرة! … لا؟» | يتحول للتوتر ويعرق | صوت خطأ، وفلاش أحمر |
| 15.5–20.9 | **وقت التفكير:** القفل كامل وعد تنازلي ٥ | ثابتة | على الشاشة: «تقدر تحلّها قبل جوانا؟» | — | دقات ساعة |
| 20.9–29 | جوانا تشرح، والأرقام ٣، ٤، ٥، ٦ تطلع تحت الأشكال | ثابتة على القفل | **جوانا:** «المثلث ثلاث أضلاع، والمربع أربعة، والخماسي خمسة… يعني الجاي سداسي!» | واثقة، وبعدها فرحانة | Beep مع كل رقم، ورنّة نجاح، وفلاش أخضر |
| 29–31 | الباب ينفتح، وضوء يغطي الشاشة | Push-in | — | — | صوت باب ثقيل وهسهسة |
| 31–37 | المختبر السري | Dolly-in بطيء | **فيصل:** «واو… مختبر سرّي تحت مدرستنا؟!» | الاثنين مبهورين ورافعين أيديهم | جو المختبر |
| 35.5–42.5 | زيرو يشتغل، وعيونه تولّع | Push نحو زيرو | **زيرو:** «تم التشغيل… أهلاً جوانا، أهلاً فيصل.» · **جوانا:** «يعرف أسماءنا؟!» | زيرو سعيد ^^ ويلوّح | صوت تشغيل الروبوت |
| 43–50 | هولوغرام «المستقبل» | ثابتة | **زيرو:** «أنا زيرو. وعندكم مهمّة… لإنقاذ المستقبل.» | الطفلين مصدومين | صوت هولوغرام |
| 50–55 | الثلاثة للكاميرا، وبطاقة الجملة الثابتة | قريبة | **جوانا:** «فكّر، اكتشف، وخلّ ذكاءك يقودك!» | ابتسامة | Jingle القناة |
| 55–60 | بطاقة النهاية: «وش المهمة؟ 🤖 · يتبع… الحلقة ٢: رسالة من المستقبل» | — | — | — | مؤثر تشويق |

### برومتات التوليد (لكل مشهد)
1. **Hook — corridor:** *Night school corridor, blue lockers, a flickering ceiling light, a mysterious metal door with a glowing cyan "404" sign. [Faisal ref] points at the door in shock; [Joanna ref] beside him, surprised. Slow push-in, cinematic volumetric light, 9:16.*
2. **Shape lock:** *Close-up of a futuristic door keypad screen showing a triangle, a square, a pentagon and a glowing question mark, with three option buttons: circle, hexagon, star. Neon cyan UI, dark background, 9:16.*
3. **Wrong answer:** *[Faisal ref] eagerly presses the circle button; the button flashes red and the screen shakes; Faisal's face turns to a sweaty "oops". Comedic timing, 9:16.*
4. **Solution:** *[Joanna ref] confidently points at the shapes as numbers 3, 4, 5 appear under them, then presses the hexagon; it glows green and the door unlocks with light pouring out. 9:16.*
5. **Secret lab:** *A hidden futuristic laboratory under the school: glass tubes with rising bubbles, glowing monitors, a workbench; a small sleeping robot [Zero ref] powers on, eyes lighting up cyan. Joanna and Faisal amazed. Dolly-in, 9:16.*
6. **Mission:** *[Zero ref] projects a cyan hologram of a futuristic city skyline above the bench while [Joanna ref] and [Faisal ref] stare in awe. 9:16.*

---

## ٣) الحلقة الثانية: «رسالة من المستقبل» (٦٠ث)

| الوقت | اللقطة | الكاميرا | الحوار والأحداث | الصوت والانتقال |
|---|---|---|---|---|
| 0–4 | هولوغرام «٢٠٦٠» ومدينة مضيئة | Medium | **زيرو:** «رسالة واردة… من سنة ألفين وستين.» | فلاش سماوي، وصوت هولوغرام |
| 4.8–8.4 | أضواء المدينة تطفي | ثابتة | **جوانا:** «مدينة المستقبل بتطفي… الطاقة بتوقف!» | صوت انطفاء الكهرباء |
| 8.7–12 | فيصل قريب | Close-up | **فيصل:** «طيب وش نسوي؟ إحنا بس في الصف الخامس!» | — |
| 12.4–17.3 | لوحة الأسلاك: أحمر وأزرق وأصفر، ومقابس ١ و٢ و٣ | Insert | **زيرو:** «لوحة الطاقة تبي توصيل الأسلاك صح… وعندكم محاولة وحدة.» + الدليلين: «الأزرق في النص» و«الأحمر مو في رقم ١» | Whoosh |
| 17.6–22.6 | **وقت التفكير** | ثابتة | «وين يروح كل سلك؟» وعد تنازلي ٥ | دقات |
| 22.8–25.1 | فيصل يمسك الأحمر لرقم ١ | Insert | **فيصل:** «أنا أعرف! الأحمر في واحد!» | شرارة |
| 25.7–33.3 | جوانا توقفه وتحل، والدليل يتظلّل وقت ما تقوله | Insert | **جوانا:** «لا! مكتوب الأحمر مو في واحد. والأزرق في النص… يعني الأحمر في ثلاثة، والأصفر في واحد!» | شرارة لكل سلك، وفلاش أخضر |
| 33.6–37.6 | المدينة تولّع والطفلين يفرحون | Medium | **فيصل:** «اشتغلت! أنقذنا المستقبل!» | صوت رجعة الكهرباء، وهتاف |
| 38.3–40.7 | زيرو | Medium | **زيرو:** «لحظة… فيه ملف مرفق.» | Beep |
| 41–45.2 | صورة هولوغرام لجوانا وفيصل وهم أكبر | ثابتة | **جوانا:** «هذولا… إحنا؟ لما نكبر؟!» | صوت هولوغرام |
| 45.9–49 | الهولوغرام يصير أحمر: «لا تثقوا بزيرو!» | اهتزاز | **فيصل (همس):** «جوانا… شوفي آخر سطر.» | Glitch، وإنذار خفيف |
| 50–52.1 | وجه جوانا، وعيون زيرو حمراء وراها | Push-in | **جوانا:** «لا تثقوا… بزيرو؟!» | مؤثر تشويق |
| 52.5–57 | «هل تثق في زيرو؟ 🤖» وبطاقة الجملة الثابتة | — | **جوانا:** «فكّر، اكتشف، وخلّ ذكاءك يقودك!» | Jingle |
| 57–60 | «يتبع… الحلقة ٣: هل زيرو صديق أم عدو؟» | — | — | — |

### برومتات التوليد
1. *[Zero ref] projects a hologram reading "2060" showing a futuristic city whose lights flicker and go dark one building at a time; [Joanna ref] and [Faisal ref] look worried. 9:16.*
2. *Insert of a glowing energy panel: three plugs (red, blue, yellow) on the right, three numbered sockets 1-2-3 on the left; two clue cards float below. Neon UI, 9:16.*
3. *[Faisal ref] grabs the red wire toward socket 1; [Joanna ref] stops him, then calmly connects blue to 2, red to 3, yellow to 1 with sparks; the panel turns green. 9:16.*
4. *The hologram city lights up brightly; the kids cheer, Faisal jumping. 9:16.*
5. *A hologram photo of a grown-up Joanna and Faisal glitches red and displays the warning text; [Zero ref]'s eyes flicker red in the background; close-up of Joanna's shocked face. Child-friendly suspense, 9:16.*

---

## ٤) الحلقة الثالثة: «هل زيرو صديق أم عدو؟» (٦٠ث)

| الوقت | اللقطة | الكاميرا | الحوار والأحداث | الصوت والانتقال |
|---|---|---|---|---|
| 0–6 | الطفلين ورا الطاولة يتهامسون، وزيرو مطفّي جزئياً | Close-up | **فيصل:** «إذا زيرو عدو… ليش ساعدنا؟» · **جوانا:** «ما ندري… بس لازم نختبره.» | جو المختبر |
| 6.6–10 | زيرو يلتفت بعيون واثقة | Whip نحو زيرو | **زيرو:** «أسمعكم ترى… عندي سمّاعات بدقة عالية.» | صوت روبوت، وفلاش |
| 10.5–13.4 | الخزنة في الجدار | Crane-up | **زيرو:** «إذا تبون الحقيقة… افتحوا الخزنة.» | Whoosh |
| 13.7–19 | **اللغز:** «الرقم السري ٣ خانات: الثانية = ٤ · الأولى = نصّ الثانية · الثالثة = مجموع الأولى والثانية» | ثابتة | «تقدر تحلّها قبل فيصل؟» وعد تنازلي ٥ | دقات |
| 19.1–25.2 | الأرقام تطلع على الشاشة: ٢ ثم ٤ ثم ٦ | Insert | **فيصل:** «الثانية أربعة… والأولى نصّها، يعني اثنين… والثالثة المجموع… ستة!» | Beep لكل رقم |
| 25.8–29.6 | جوانا تكتب الرقم ٢٤٦ | Medium | **جوانا:** «يعني الرقم: اثنين، أربعة، ستة!» | ٣ Beeps ورنّة نجاح |
| 29.7–35 | الخزنة تنفتح، ويطلع جهاز مضيء عليه شعار «ابنِ ذكاءك» ولافتة «الاختبار ١ من ١٠٠ ✓» | Push-in | **فيصل:** «الاختبار واحد… من مية؟!» | فتح الخزنة، وصوت اكتشاف |
| 35.5–41.6 | زيرو سعيد | Medium | **زيرو:** «مبروك… نجحتوا في أول اختبار. أنا ما كنت عدو… كنت أختبر ذكاءكم.» | — |
| 42.3–45.5 | جوانا تشك | Close-up | **جوانا:** «طيب ومين كتب: لا تثقوا بزيرو؟» | — |
| 46.4–48.1 | عيون زيرو تلمع وإضاءة خافتة | Push-in | **زيرو:** «هذا… اللغز الجاي.» | Glitch ومؤثر تشويق |
| 48.5–56.5 | «هل تثق في زيرو؟ · باقي ٩٩ اختبار…» وبطاقة الجملة الثابتة | — | **جوانا:** «فكّر، اكتشف، وخلّ ذكاءك يقودك!» | Jingle |
| 56.5–60 | «يتبع… المغامرة الأكبر قريباً!» | — | — | — |

### برومتات التوليد
1. *[Joanna ref] and [Faisal ref] crouch behind a lab bench whispering while [Zero ref] hovers dimly in the background, then turns with smug flat eyes. Comedic suspense, 9:16.*
2. *A futuristic wall safe with a 3-digit display and keypad; a floating clue card; digits 2, 4, 6 appear one by one. 9:16.*
3. *The safe swings open with golden light, revealing a glowing cube device bearing a lightbulb-brain emblem; a green banner "Test 1 of 100 ✓" appears. Kids amazed. 9:16.*
4. *[Zero ref] happily confesses, then its eyes glint mysteriously as the lights dim — cliffhanger. 9:16.*

---

## ٥) معايير الجودة المطبّقة
- **الخطّاف:** في أول ٣ ثواني، بدون مقدمة. اسم الحلقة يطلع صغير في الزاوية بس.
- **الألغاز:** لغز في كل حلقة، ومعه **٥ ثواني تفكير** وعد تنازلي قبل الحل.
- **التفاعل مع المشاهد:** سؤال في كل حلقة:
  - «تقدر تحلّها قبل جوانا/فيصل؟»
  - «وين يروح كل سلك؟»
  - «هل تثق في زيرو؟»
- **النهايات:** كل حلقة تنتهي بمفاجأة وتشويق للحلقة الجاية.
- **الأمان:** ما فيه عنف ولا رعب. الغموض خفيف ومناسب للأطفال، والأحمر يُستخدم للتحذير بس.
- **الثبات:** نفس تصميم الشخصيات وأصواتها في كل الحلقات، والجملة الثابتة بنفس التسجيل في الحلقات الثلاث.

---

# الجزء الأول (تكملة): الحلقات ٤–٦

**الملفات:** `out/room404-ep4.mp4` (٧٠ث)، `out/room404-ep5.mp4` (٧٠ث)، `out/room404-ep6.mp4` (٧٥ث). الكود في `src/room404/EpD.tsx` و`EpE.tsx` و`EpF.tsx`، والستوري بورد في `out/storyboard-room404-ep4..6.jpg`.

## تحسينات عن الحلقات ١–٣
- **صوت زيرو:**
  - الموسيقى تنخفض إلى ‎-30 dB تحت أي كلام، وكانت ‎-22.
  - صوت زيرو أعلى بـ٢٥٪، مع رفع خفيف للترددات اللي توضّح الكلام.
  - المؤثر الروبوتي أخف: chorus خفيف بدل phaser وbitcrush.
- **المستوى:** ألغاز منطقية حقيقية لأعمار ١٠–١٣: المفاتيح الثلاثة، وسلسلة الأرقام، والحارس الصادق والكاذب.
- **القصة:** خط واحد متصل للحلقات الثلاث:
  - الرسالة من المستقبل.
  - ذاكرة زيرو.
  - الفيروس «فراغ».
  - تضحية فيصل.
  - الغرفة 405.

## شخصيات صوتية جديدة
| الشخصية | الصوت | المعالجة |
|---|---|---|
| فيصل الكبير (من ٢٠٦٠) | Fahad – Saudi Professional & Warm (`YCN2uLvOoKxKJtRmeub3`) | فلتر «تسجيل» (‎250 Hz إلى 5 kHz) وصدى قصير |
| فراغ (الفيروس) | Ali – Calmly Reflective (`taIPgcOka6lQyJOPdNGp`) | نبرة أخفض ‎×0.92 وصدى. صوت هادي وغامض بدون رعب |
- **شكل فراغ:** كتلة سوداء متقطّعة فيها عين بيضاء وحدة.
- **Prompt (EN):** *a black glitching blob with a single white eye, red glitch lines, eerie but child-friendly.*

## الألغاز وحلولها
1. **الحلقة ٤، المفاتيح الثلاثة:**
   - شغّل الأول دقيقتين وطفّه، وشغّل الثاني وادخل.
   - إذا اللمبة شغالة فهو الثاني، وإذا طافية بس حارة فهو الأول، وإذا باردة فهو الثالث.
2. **الحلقة ٥، السلسلة ٢، ٦، ١٢، ٢٠، ٣٠:**
   - الفروق ‎+٤ ‎+٦ ‎+٨ ‎+١٠، فالجاي ‎+١٢.
   - الجواب **٤٢**.
3. **الحلقة ٦، الحارسين:**
   - اسأل أي واحد: «لو سألت صاحبك وين الباب الصح، وش بيقول؟».
   - بعدها روح للباب الثاني.
