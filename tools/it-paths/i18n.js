// IT Paths Explorer — UI strings, quiz i18n, path translations, glossary translations, helpers
// Translations: UI strings, quiz, and path content (English + Indonesian)
// NOTE: path id, image, tools, salary, difficulty, mathHeavy, earningStyles, vibes
// stay in the base data (paths-data.jsx). Only translatable text lives here.
const UI_STRINGS = {
en: {
take_quiz: "Take the quiz",
find_my_path: "Find my path",
browse_all: "Browse all",
n_directions: "{n} directions, plain english",
hero_eyebrow: "A map for beginners · 2026 edition",
hero_title_a: "So you want",
hero_title_b: "to get into",
hero_title_c: "tech",
hero_title_d: "— but where?",
hero_lede_a: "The internet makes IT sound like a secret language. It isn't. Here are",
hero_lede_b: "real paths — from fixing laptops to programming music to teaching robots — each explained without jargon. Hover any",
hero_lede_c: "underlined term",
hero_lede_d: "for a plain-English definition.",
hero_stat_paths: "paths to explore",
hero_stat_earn: "ways to earn — job, freelance, or hobby",
hero_note: "You don't need a computer science degree. You don't need to be good at math (for most of these). You just need a few months and a direction.",
browse: "Browse",
section_title: "Every path, in one place.",
section_note: "Use the filters below to narrow by field, how you want to earn, or how much math you're willing to do. Click any card for the full story.",
filter_field: "Field",
filter_earn: "How you'd work",
filter_diff: "Max difficulty",
filter_math: "Math",
filter_count: "{n} of {total} paths",
cat_all: "All",
cat_building: "Building things",
cat_data: "Data & AI",
cat_security: "Security & infrastructure",
cat_creative: "Creative & design",
earn_all: "All",
earn_job: "Job",
earn_freelance: "Freelance",
earn_hobby: "Hobby / side income",
diff_1: "Easy",
diff_2: "Gentle",
diff_3: "Medium",
diff_4: "Hard",
diff_5: "Any",
math_any: "Any",
math_light: "Little math",
math_heavy: "Math-heavy",
no_match: "No paths match those filters.",
reset: "Reset filters",
footer_tag: "A friendly map for total beginners. No prior tech required.",
footer_salary: "Salaries are US-based annual ranges.",
footer_roadmaps: "Roadmaps assume a few hours most days.",
sec_what: "What you actually do",
sec_tools: "Tools you'll use",
sec_pay: "Typical pay",
sec_diff: "Difficulty",
sec_earn: "How you can earn",
sec_day: "A typical day",
sec_road: "Your roadmap to start",
pay_note: "USD, varies by region & experience",
diff_label_1: "Beginner-friendly",
diff_label_2: "Gentle learning curve",
diff_label_3: "Medium effort",
diff_label_4: "Challenging",
diff_label_5: "Steep climb",
math_heavy_y: "Math-heavy: Yes",
math_heavy_n: "Math-heavy: Not really",
badge_job: "💼 Job",
badge_freelance: "🧑‍💻 Freelance",
badge_hobby: "🎨 Hobby / side",
encourage: "Remember: these timelines assume a few hours every day. Go slower or faster. Nobody's watching the clock except you. The best time to start was a year ago. The second best time is today.",
quiz_q_of: "Question {n} of {total}",
quiz_back: "Back",
quiz_continue: "Continue",
quiz_see_results: "See results",
quiz_multi_hint: "Pick one or more",
quiz_single_hint: "Pick one",
results_match: "Your match",
results_title: "Top paths for you",
results_sub: "Based on your answers. Click any to learn more. These are starting points — explore freely.",
results_retake: "Retake quiz",
results_browse: "Browse all paths",
tweaks: "Tweaks",
tweak_theme: "Theme",
tweak_accent: "Accent hue",
tweak_size: "Text size",
lang_en: "EN",
lang_id: "ID",
theme_dark: "Hacker Dark",
theme_editorial: "Editorial",
theme_warm: "Warm Magazine"
},
id: {
take_quiz: "Ikut kuis",
find_my_path: "Cari jalurku",
browse_all: "Lihat semua",
n_directions: "{n} jalur, bahasa sederhana",
hero_eyebrow: "Peta untuk pemula · edisi 2026",
hero_title_a: "Jadi kamu mau",
hero_title_b: "masuk ke dunia",
hero_title_c: "teknologi",
hero_title_d: "— tapi dari mana?",
hero_lede_a: "Internet bikin IT kedengeran kayak bahasa rahasia. Sebenarnya enggak. Ini",
hero_lede_b: "jalur nyata — dari benerin laptop sampai bikin musik pakai kode sampai ngajarin robot — semua dijelasin tanpa istilah ribet. Arahkan kursor ke",
hero_lede_c: "kata bergaris bawah",
hero_lede_d: "buat lihat arti sederhananya.",
hero_stat_paths: "jalur untuk dijelajahi",
hero_stat_earn: "cara dapat uang — kerja, freelance, atau hobi",
hero_note: "Kamu nggak butuh gelar ilmu komputer. Kamu nggak harus jago matematika (untuk kebanyakan jalur ini). Kamu cuma butuh beberapa bulan dan arah yang jelas.",
browse: "Jelajahi",
section_title: "Semua jalur, satu tempat.",
section_note: "Pakai filter di bawah buat saring berdasarkan bidang, cara kamu mau kerja, atau seberapa banyak matematika yang kamu sanggupi. Klik kartu mana pun buat cerita lengkapnya.",
filter_field: "Bidang",
filter_earn: "Cara kerja",
filter_diff: "Maks. kesulitan",
filter_math: "Matematika",
filter_count: "{n} dari {total} jalur",
cat_all: "Semua",
cat_building: "Membangun sesuatu",
cat_data: "Data & AI",
cat_security: "Keamanan & infrastruktur",
cat_creative: "Kreatif & desain",
earn_all: "Semua",
earn_job: "Kerja",
earn_freelance: "Freelance",
earn_hobby: "Hobi / sampingan",
diff_1: "Mudah",
diff_2: "Santai",
diff_3: "Sedang",
diff_4: "Sulit",
diff_5: "Semua",
math_any: "Semua",
math_light: "Sedikit matematika",
math_heavy: "Banyak matematika",
no_match: "Tidak ada jalur yang cocok.",
reset: "Reset filter",
footer_tag: "Peta ramah buat pemula total. Nggak perlu latar belakang tech.",
footer_salary: "Gaji dalam rentang tahunan di AS.",
footer_roadmaps: "Roadmap asumsi kamu meluangkan beberapa jam hampir setiap hari.",
sec_what: "Apa yang kamu kerjakan",
sec_tools: "Alat yang kamu pakai",
sec_pay: "Gaji umum",
sec_diff: "Tingkat kesulitan",
sec_earn: "Cara menghasilkan uang",
sec_day: "Hari biasa",
sec_road: "Roadmap kamu buat mulai",
pay_note: "USD, tergantung daerah & pengalaman",
diff_label_1: "Ramah pemula",
diff_label_2: "Belajar santai",
diff_label_3: "Effort sedang",
diff_label_4: "Cukup menantang",
diff_label_5: "Tanjakan curam",
math_heavy_y: "Banyak matematika: Ya",
math_heavy_n: "Banyak matematika: Nggak juga",
badge_job: "💼 Kerja",
badge_freelance: "🧑‍💻 Freelance",
badge_hobby: "🎨 Hobi / sampingan",
encourage: "Ingat: timeline ini anggap kamu latihan beberapa jam tiap hari. Boleh lebih lambat atau lebih cepat. Nggak ada yang ngitung waktumu kecuali kamu sendiri. Waktu terbaik buat mulai adalah setahun lalu. Waktu terbaik kedua adalah hari ini.",
quiz_q_of: "Pertanyaan {n} dari {total}",
quiz_back: "Kembali",
quiz_continue: "Lanjut",
quiz_see_results: "Lihat hasil",
quiz_multi_hint: "Pilih satu atau lebih",
quiz_single_hint: "Pilih satu",
results_match: "Cocok untukmu",
results_title: "Jalur teratas buatmu",
results_sub: "Berdasarkan jawabanmu. Klik buat lihat lebih dalam. Ini titik awal — jelajahi bebas.",
results_retake: "Ulang kuis",
results_browse: "Lihat semua jalur",
tweaks: "Penyesuaian",
tweak_theme: "Tema",
tweak_accent: "Warna aksen",
tweak_size: "Ukuran teks",
lang_en: "EN",
lang_id: "ID",
theme_dark: "Gelap Hacker",
theme_editorial: "Editorial",
theme_warm: "Majalah Hangat"
}
};
// Quiz — multi-select where it makes sense (multiple interests!)
const QUIZ_I18N = {
en: [
{
q: "What sounds fun? (pick as many as you want)",
multi: true,
options: [
{ label: "Making something people can use", vibes: ["creative", "product-minded", "people-facing"] },
{ label: "Solving a tough puzzle", vibes: ["logical", "problem-solver", "detective"] },
{ label: "Designing or drawing things", vibes: ["creative", "visual"] },
{ label: "Taking apart & fixing physical things", vibes: ["hands-on", "hardware-curious"] },
{ label: "Writing or teaching", vibes: ["writer", "people-facing"] },
{ label: "Investigating mysteries", vibes: ["detective", "curious", "researcher"] },
{ label: "Making art with code", vibes: ["creative", "visual", "hobby-friendly"] }
]
},
{
q: "How do you feel about math?",
options: [
{ label: "Love it — more equations please", mathPref: 1 },
{ label: "Can handle it", mathPref: 0.5 },
{ label: "Would prefer to avoid it", mathPref: -1 },
{ label: "Indifferent", mathPref: 0 }
]
},
{
q: "How visible do you want your work to be? (pick any)",
multi: true,
options: [
{ label: "I want to SEE my work — buttons, screens, visuals", vibes: ["visual", "creative"] },
{ label: "Behind the scenes — the engine, not the paint", vibes: ["behind-the-scenes", "logical"] },
{ label: "In front of people — talking, teaching", vibes: ["people-facing", "writer"] },
{ label: "Detail-focused — details matter to me", vibes: ["detail-oriented", "logical"] }
]
},
{
q: "How fast do you need to be earning?",
options: [
{ label: "Soon — I want a job in 6 months", difficultyMax: 2 },
{ label: "Within a year", difficultyMax: 3 },
{ label: "I'm patient — great career over fast entry", difficultyMax: 5 }
]
},
{
q: "Which fields draw you most? (pick any)",
multi: true,
options: [
{ label: "Building games, apps, or websites", categories: ["Building things"] },
{ label: "Finding patterns in data & AI", categories: ["Data & AI"] },
{ label: "Protecting systems, catching hackers", categories: ["Security & infrastructure"] },
{ label: "Designing how things look & feel", categories: ["Creative & design"] }
]
},
{
q: "How do you want to work?",
options: [
{ label: "A steady job at a company", earning: "job" },
{ label: "Freelancing — my own clients", earning: "freelance" },
{ label: "As a hobby / side project", earning: "hobby" },
{ label: "Any of these", earning: null }
]
},
{
q: "Pick your superpowers (one or more)",
multi: true,
options: [
{ label: "Creativity — make beautiful things", vibes: ["creative", "visual"] },
{ label: "Logic — solve anything step-by-step", vibes: ["logical", "problem-solver"] },
{ label: "Curiosity — figure out how things work", vibes: ["curious", "detective", "researcher"] },
{ label: "Communication — explain hard things simply", vibes: ["writer", "people-facing"] },
{ label: "Strategy — see the big picture", vibes: ["strategic", "product-minded"] }
]
}
],
id: [
{
q: "Apa yang keliatan seru? (pilih sebanyak yang kamu mau)",
multi: true,
options: [
{ label: "Bikin sesuatu yang bisa dipakai orang", vibes: ["creative", "product-minded", "people-facing"] },
{ label: "Memecahkan teka-teki yang sulit", vibes: ["logical", "problem-solver", "detective"] },
{ label: "Mendesain atau menggambar", vibes: ["creative", "visual"] },
{ label: "Bongkar & benerin barang fisik", vibes: ["hands-on", "hardware-curious"] },
{ label: "Menulis atau mengajar", vibes: ["writer", "people-facing"] },
{ label: "Menyelidiki misteri", vibes: ["detective", "curious", "researcher"] },
{ label: "Bikin seni pakai kode", vibes: ["creative", "visual", "hobby-friendly"] }
]
},
{
q: "Gimana perasaanmu sama matematika?",
options: [
{ label: "Suka banget — kasih lebih banyak rumus", mathPref: 1 },
{ label: "Bisa lah", mathPref: 0.5 },
{ label: "Kalau bisa dihindari", mathPref: -1 },
{ label: "Biasa aja", mathPref: 0 }
]
},
{
q: "Seberapa kelihatan karyamu? (pilih bebas)",
multi: true,
options: [
{ label: "Aku mau LIHAT karyaku — tombol, layar, visual", vibes: ["visual", "creative"] },
{ label: "Di belakang layar — mesinnya, bukan catnya", vibes: ["behind-the-scenes", "logical"] },
{ label: "Di depan orang — ngomong, ngajarin", vibes: ["people-facing", "writer"] },
{ label: "Fokus detail — detail itu penting buatku", vibes: ["detail-oriented", "logical"] }
]
},
{
q: "Seberapa cepat kamu butuh penghasilan?",
options: [
{ label: "Cepet — mau kerja dalam 6 bulan", difficultyMax: 2 },
{ label: "Dalam setahun", difficultyMax: 3 },
{ label: "Sabar — karier bagus lebih penting", difficultyMax: 5 }
]
},
{
q: "Bidang mana yang paling menarik? (pilih bebas)",
multi: true,
options: [
{ label: "Bikin game, app, atau website", categories: ["Building things"] },
{ label: "Cari pola di data & AI", categories: ["Data & AI"] },
{ label: "Lindungi sistem, tangkap hacker", categories: ["Security & infrastructure"] },
{ label: "Desain tampilan & rasanya", categories: ["Creative & design"] }
]
},
{
q: "Kamu mau kerja gimana?",
options: [
{ label: "Kerja tetap di perusahaan", earning: "job" },
{ label: "Freelance — klien sendiri", earning: "freelance" },
{ label: "Sebagai hobi / sampingan", earning: "hobby" },
{ label: "Semua bisa", earning: null }
]
},
{
q: "Pilih superpower kamu (satu atau lebih)",
multi: true,
options: [
{ label: "Kreativitas — bikin hal indah", vibes: ["creative", "visual"] },
{ label: "Logika — pecahin apa pun step-by-step", vibes: ["logical", "problem-solver"] },
{ label: "Rasa ingin tahu — cari tahu cara kerjanya", vibes: ["curious", "detective", "researcher"] },
{ label: "Komunikasi — jelaskan hal rumit dengan simpel", vibes: ["writer", "people-facing"] },
{ label: "Strategi — lihat gambaran besar", vibes: ["strategic", "product-minded"] }
]
}
]
};
// Path content translations. Only include Indonesian here; English uses the base.
const PATH_I18N_ID = {
frontend: {
name: "Frontend Developer",
tagline: "Bikin bagian website & aplikasi yang kamu lihat dan klik.",
whatYouDo: "Kamu ambil gambar desain dari desainer dan ubah jadi halaman beneran di browser. Tombol, menu, animasi — itu kerjamu.",
dayInLife: ["Standup pagi — 15 menit ngobrol sama tim tentang progres hari ini.", "Ubah desain baru jadi kode (misal: halaman sign up).", "Perbaiki bug di mana tombolnya kelihatan aneh di HP.", "Review kode — baca kerjaan teman dan kasih saran."],
roadmap: [
{ step: "Dasar HTML & CSS", weeks: "2-4 minggu", what: "Pelajari HTML (kerangka halaman: heading, paragraf, link, tombol, form) lalu CSS (warna, font, layout, spacing). Targetnya: bisa bikin halaman profil statis. Topik wajib: selector CSS, box model, Flexbox, Grid, responsive design (media query), variabel CSS, dan dasar aksesibilitas (semantic HTML, alt text)." },
{ step: "Dasar JavaScript", weeks: "2-3 bulan", what: "Pelajari variabel, tipe data, function, loop, kondisi, array, object, DOM manipulation (ubah halaman lewat JS), event (klik, submit), async/await untuk panggil API, dan fetch. Tambahan: JSON, localStorage, error handling. Latihan: bikin to-do list, kalkulator, galeri foto interaktif." },
{ step: "Framework (React)", weeks: "2-3 bulan", what: "React + komponen, props, state, useState, useEffect, event handler, list rendering, conditional rendering, form terkontrol, React Router untuk navigasi antar halaman. Tambah: fetch API ke backend, context untuk state global, dasar TypeScript (opsional tapi dihargai)." },
{ step: "Tooling & deployment", weeks: "3-4 minggu", what: "Git + GitHub (commit, branch, pull request), npm/pnpm, bundler (Vite), ESLint/Prettier, dasar Tailwind CSS. Deploy ke Vercel atau Netlify. Belajar Chrome DevTools untuk debug." },
{ step: "Bikin 3 project portfolio", weeks: "2 bulan", what: "Klon sederhana (Twitter/Instagram feed), dashboard dengan grafik (pakai Recharts/Chart.js), dan satu project pribadi. Upload ke GitHub, tulis README yang rapi, deploy live. Ini yang employer lihat." }
]
},
backend: {
name: "Backend Developer",
tagline: "Bikin mesin yang nggak kelihatan — yang nyimpan data, login, ngurus pembayaran.",
whatYouDo: "Pas kamu klik 'login', ada sesuatu di server yang cek password, ambil profilmu, dan kirim balik. Kamu yang bangun itu.",
dayInLife: ["Desain cara fitur baru menyimpan data.", "Tulis kode yang nanganin 10.000 login per menit tanpa crash.", "Debug kenapa pembayaran gagal buat sebagian user.", "Review pull request teman."],
roadmap: [
{ step: "Pilih bahasa (Python)", weeks: "1-2 bulan", what: "Sintaks Python, tipe data, function, class, module, pip, virtualenv. Framework web: FastAPI atau Flask — belajar routing, request/response, middleware, validasi input. Alternatif: Node.js + Express, atau Go." },
{ step: "Database (SQL)", weeks: "1 bulan", what: "PostgreSQL atau MySQL. Pelajari SELECT, INSERT, UPDATE, DELETE, JOIN (inner, left), GROUP BY, index, foreign key, normalisasi. Dasar ORM (SQLAlchemy/Prisma) biar nggak tulis SQL mentah terus. Singgung NoSQL (MongoDB, Redis) buat kasus khusus." },
{ step: "API & web server", weeks: "2 bulan", what: "Bangun REST API: GET/POST/PUT/DELETE, status code, authentication (JWT, session, OAuth), hashing password (bcrypt), rate limiting, CORS, dokumentasi API (OpenAPI/Swagger). Pelajari struktur project (MVC, clean architecture)." },
{ step: "Testing & kualitas kode", weeks: "2-3 minggu", what: "Unit test (pytest/Jest), integration test, mocking, code coverage, logging, error handling yang benar. Belajar baca stack trace." },
{ step: "Deploy project beneran", weeks: "1 bulan", what: "Docker (kemas app jadi container), deploy ke Railway/Render/Fly.io, dasar Linux (SSH, cron, env variable), monitoring sederhana (uptime, log). Setup domain + HTTPS." }
]
},
fullstack: {
name: "Full-Stack Developer",
tagline: "Ngerjain frontend & backend. Generalis.",
whatYouDo: "Kamu bisa bangun website atau app sendirian — bagian cantik yang dilihat user DAN mesin di baliknya. Cocok buat tim kecil & freelance.",
dayInLife: ["Bangun fitur baru dari ujung ke ujung — tombolnya DAN apa yang terjadi pas diklik.", "Loncat antara tweak desain dan query database.", "Ngobrol sama klien tentang kebutuhan mereka.", "Deploy update di akhir hari."],
roadmap: [
{ step: "Dasar frontend (HTML/CSS/JS)", weeks: "2-3 bulan", what: "Sama seperti jalur frontend: HTML semantik, CSS layout (Flexbox, Grid), JavaScript (DOM, event, async, fetch). Bonus: dasar Tailwind CSS." },
{ step: "Framework frontend (React)", weeks: "2 bulan", what: "Komponen, state, hooks (useState/useEffect), routing, form, panggil API. Setidaknya bisa bikin UI yang ambil data dan tampilin." },
{ step: "Dasar backend (Node/Python)", weeks: "2-3 bulan", what: "Pilih Node.js + Express atau Python + FastAPI. Belajar routing, middleware, koneksi database (PostgreSQL), auth JWT, validasi input, env variable." },
{ step: "Sambungkan frontend & backend", weeks: "1 bulan", what: "Panggil REST API dari React (fetch/axios), CORS, handle loading/error state, upload file, realtime dasar (WebSocket atau polling). Git + GitHub untuk versi." },
{ step: "Bikin project lengkap + deploy", weeks: "2 bulan", what: "Mini Twitter, app to-do kolaboratif, atau marketplace sederhana. Fitur: register/login, CRUD, upload gambar. Deploy frontend ke Vercel, backend ke Railway, database managed (Neon/Supabase)." }
]
},
mobile: {
name: "Mobile App Developer",
tagline: "Bikin aplikasi di HP kamu.",
whatYouDo: "Kamu bikin app buat iPhone atau Android. Dari desain, rasa swipe, sampai cara ngobrol sama server.",
dayInLife: ["Bikin layar baru — misalnya halaman profil.", "Tes di 3 HP berbeda biar yakin jalan semua.", "Submit update ke App Store.", "Baca review user buat cari bug."],
roadmap: [
{ step: "Pilih platform", weeks: "1 minggu", what: "iOS native (Swift + SwiftUI/UIKit, tool Xcode — butuh Mac), Android native (Kotlin + Jetpack Compose, tool Android Studio), atau cross-platform: Flutter (Dart) atau React Native (JS/TS). Cross-platform paling efisien buat satu developer." },
{ step: "Dasar bahasa & UI toolkit", weeks: "2 bulan", what: "Sintaks bahasa pilihanmu, navigasi antar layar, layout (Stack/Flex/Column), form input, gambar & list (RecyclerView/FlatList/LazyColumn), state management (Provider, Riverpod, Redux tergantung framework)." },
{ step: "Bikin app kecil fungsional", weeks: "1-2 bulan", what: "App cuaca (panggil API), timer & stopwatch, note app dengan penyimpanan lokal (SharedPreferences, AsyncStorage, Core Data, atau SQLite). Belajar permission (lokasi, kamera, notifikasi)." },
{ step: "Backend & fitur lanjutan", weeks: "1 bulan", what: "Firebase (Auth, Firestore, Cloud Messaging untuk push notifikasi) ATAU backend sendiri. Login sosial (Google, Apple), upload gambar, realtime update." },
{ step: "Publish ke store", weeks: "2 minggu", what: "Bayar akun developer (Apple $99/thn, Google $25 sekali), siapin screenshot + deskripsi, build release (signed APK/IPA), submit review. Latih sabar — review bisa ditolak karena hal remeh." }
]
},
game: {
name: "Game Developer",
tagline: "Bikin video game.",
whatYouDo: "Dari indie kecil sampai dunia 3D gede — kamu tulis kode yang bikin karakter lompat, musuh ngejar, dan level jalan.",
dayInLife: ["Bikin karakter pemain lompat sedikit lebih bagus.", "Perbaiki glitch musuh tembus tembok.", "Tes desain level baru.", "Playtest — iya, main game ITU kerjaan."],
roadmap: [
{ step: "Pilih engine", weeks: "1 minggu", what: "Unity (C#, standar industri, ekosistem besar), Godot (GDScript, gratis & open source, ramah pemula), atau Unreal (C++, visual keren, lebih berat). Pemula solo: Godot atau Unity." },
{ step: "Belajar engine dasar + bikin Pong", weeks: "1 bulan", what: "Scene & node/gameobject, script dasar, input (keyboard/mouse/touch), kolisi 2D, sprite, suara. Bikin Pong atau Breakout dulu — ngajarin loop game (update tiap frame, handle input, gerak, cek menang/kalah)." },
{ step: "Mekanik & struktur game", weeks: "2-3 bulan", what: "Physics (rigidbody, gravity), animasi (state machine, keyframe), UI (menu, skor, health bar), save/load, particle effect, sound effect & musik, scene transition. Pelajari pola state (menu → main → pause → game over)." },
{ step: "Bikin game kecil original", weeks: "3-4 bulan", what: "Platformer 5 level, top-down shooter, atau puzzle game. Fokus: satu mekanik yang matang, bukan fitur berantakan. Pelajari dasar 3D (kalau mau) atau mendalami 2D pixel art." },
{ step: "Rilis di itch.io", weeks: "1 minggu", what: "Build executable untuk Windows/Mac/Linux/WebGL, tulis halaman game (screenshot, gif, deskripsi), rilis gratis atau bayar. Ikut game jam (Ludum Dare, itch jams) buat latihan menyelesaikan." }
]
},
gamedesign: {
name: "Game Designer",
tagline: "Nentuin apa yang seru. Desain aturan, level, pengalaman pemain — nggak selalu penuh kode.",
whatYouDo: "Kamu nentuin kenapa sebuah game seru. Aturannya, cara bangun level, rasa reward-nya. Lebih sedikit koding, lebih banyak mikirin pemain.",
dayInLife: ["Sketsa level baru di kertas.", "Lihat playtester main, catat di mana mereka bingung.", "Atur angka — berapa damage pedang?", "Tulis design doc buat tim."],
roadmap: [
{ step: "Main game dengan kritis", weeks: "terus menerus", what: "Main 3-5 game beragam genre per bulan. Catat kenapa seru/membosankan: loop inti (core loop), reward, progresi, kejutan, feedback (visual + audio). Baca buku: The Art of Game Design (Schell), A Theory of Fun (Koster)." },
{ step: "Prototipe board game", weeks: "1 bulan", what: "Kertas + dadu + kartu ngajarin desain lebih cepat dari kode. Belajar: playtesting, tuning angka, balance, teori probabilitas dasar. Rancang 2 board game, tes sama teman, revisi 3x." },
{ step: "Dasar engine (Unity atau Godot)", weeks: "2 bulan", what: "Cukup buat bikin prototipe — scripting dasar, input, UI, scene. Tujuan bukan jadi programmer pro, tapi bisa tes idemu tanpa nunggu developer." },
{ step: "Design document & pitch", weeks: "1 bulan", what: "Tulis one-pager (visi 1 halaman), GDD (design doc lengkap), level design, progression chart. Pelajari cara pitch game ke publisher atau tim." },
{ step: "Rilis game kecil di itch.io", weeks: "3 bulan", what: "Menyelesaikan ngajarin lebih dari merencanakan. Game jam 48 jam bagus banget. Kumpulkan feedback, iterasi." }
]
},
data: {
name: "Data Analyst",
tagline: "Ubah spreadsheet berantakan jadi cerita & keputusan.",
whatYouDo: "Perusahaan punya tumpukan angka (penjualan, user, klik). Kamu gali dan temuin ceritanya: 'Penjualan turun karena email Selasa nggak nyampai.'",
dayInLife: ["Jawab pertanyaan dari manajer: 'Kenapa signup turun minggu lalu?'", "Tarik data dari database pakai SQL.", "Bikin grafik yang bikin jawabannya jelas.", "Presentasi temuan di rapat."],
roadmap: [
{ step: "Excel + spreadsheet", weeks: "2-4 minggu", what: "Rumus (VLOOKUP, INDEX/MATCH, XLOOKUP, SUMIF, COUNTIF), pivot table, chart, conditional formatting, filter, data validation. Google Sheets juga oke. Ini fondasi — 80% data kerja tetap di spreadsheet." },
{ step: "SQL", weeks: "1-2 bulan", what: "SELECT, WHERE, GROUP BY, HAVING, JOIN (inner/left/right), subquery, CTE (WITH), window function (ROW_NUMBER, RANK, LAG), tanggal. Latihan di DataLemur, LeetCode SQL, atau Mode Analytics tutorial." },
{ step: "Visualisasi data", weeks: "1 bulan", what: "Tableau atau Power BI atau Looker. Pelajari: pilih jenis grafik yang benar (bar vs line vs scatter), dashboard interaktif, filter, tooltip, storytelling lewat data. Baca buku: Storytelling with Data (Knaflic)." },
{ step: "Python buat data (pandas)", weeks: "2 bulan", what: "Python dasar, pandas (read_csv, groupby, merge, pivot), numpy, matplotlib/seaborn, Jupyter Notebook. Belajar bersihin data kotor (missing value, duplikat, tipe salah) — ini 70% kerjaan." },
{ step: "Statistik praktis", weeks: "1 bulan", what: "Mean/median/mode, distribusi, korelasi vs kausal, sampling, A/B testing dasar, p-value secara intuitif. Nggak perlu matematika berat — cukup paham kapan angka itu bohong." }
]
},
datascience: {
name: "Data Scientist",
tagline: "Data analyst + machine learning. Prediksi masa depan dari data.",
whatYouDo: "Kayak data analyst, tapi kamu juga bangun model yang prediksi — siapa bakal berhenti langganan, produk apa yang pelanggan beli, kapan mesin rusak.",
dayInLife: ["Bersihin dataset berantakan (selalu lebih lama dari perkiraan).", "Latih model buat prediksi sesuatu.", "Cek model beneran berguna atau cuma nebak.", "Jelaskan hasil ke teman non-teknis."],
roadmap: [
{ step: "Python + statistik", weeks: "3-4 bulan", what: "Python (pandas, numpy), matplotlib/seaborn, Jupyter. Statistik: probabilitas, distribusi, hypothesis test, regresi linear. Aljabar linear dasar (vektor, matriks). Kalkulus dasar (turunan). Buku: An Introduction to Statistical Learning (ISL) gratis." },
{ step: "Dasar machine learning", weeks: "3-6 bulan", what: "Supervised (regresi linear/logistik, decision tree, random forest, gradient boosting), unsupervised (k-means, PCA), metric (accuracy, precision, recall, F1, ROC AUC), cross-validation, overfitting, feature engineering. Tool: scikit-learn. Kursus: Andrew Ng Machine Learning Specialization." },
{ step: "Deep learning dasar", weeks: "2-3 bulan", what: "Neural network, backpropagation, loss function, optimizer (SGD, Adam). Framework: PyTorch atau TensorFlow/Keras. Kursus: fast.ai Practical Deep Learning." },
{ step: "Kompetisi Kaggle", weeks: "terus menerus", what: "Mulai dari Titanic, House Prices. Baca notebook top kompetitor. Belajar feature engineering, ensemble, validasi tanpa leak. Kaggle adalah gym data science." },
{ step: "Project portfolio end-to-end", weeks: "1-2 bulan", what: "Satu project lengkap: ambil data (scrape atau API), bersihin, EDA (analisis eksploratori), modeling, deploy ke Streamlit/Gradio. Tulis blog post Medium/personal site — ini yang dibaca recruiter." }
]
},
ml: {
name: "Machine Learning Engineer",
tagline: "Bawa model AI ke user nyata. Sisi engineering dari AI.",
whatYouDo: "Data scientist bikin model di notebook. Kamu yang bikin model itu jalan cepat & handal buat jutaan user. Contoh: filter spam di email.",
dayInLife: ["Optimasi model biar 10x lebih cepet.", "Set up sistem yang latih ulang model tiap malam.", "Debug kenapa prediksi jadi aneh setelah update.", "Baca paper riset sambil kopi."],
roadmap: [
{ step: "Programming + matematika kuat", weeks: "6+ bulan", what: "Python mahir (OOP, decorator, generator), aljabar linear (vektor, matriks, eigenvalue), kalkulus (turunan, chain rule), probabilitas. Data structure & algorithm (big-O, array, hash, graph) — karena MLE juga software engineer." },
{ step: "Fondasi deep learning", weeks: "6 bulan", what: "CNN (gambar), RNN/LSTM/Transformer (teks, sequence), attention, fine-tuning, transfer learning. PyTorch mendalam. Kursus: Andrew Ng Deep Learning, fast.ai, Karpathy Zero to Hero." },
{ step: "Production ML (MLOps)", weeks: "3-4 bulan", what: "Containerize model (Docker), deploy (FastAPI + endpoint inference), versioning (DVC, MLflow), orchestration (Airflow), monitoring (drift detection, latency), CI/CD untuk ML. Cloud: AWS SageMaker atau GCP Vertex AI." },
{ step: "Spesialisasi", weeks: "6+ bulan", what: "Pilih: NLP/LLM (Transformer, RAG, fine-tune), computer vision (deteksi, segmentasi, diffusion), recommender system, atau time series. Dalam 1 bidang lebih berharga dari dangkal di 5." },
{ step: "Kontribusi ke open source & paper", weeks: "terus menerus", what: "Reproduksi paper, buka PR ke Hugging Face/PyTorch, tulis blog teknis. Bangun reputasi publik — ini yang bikin recruiter top-tier DM kamu." }
]
},
promptai: {
name: "AI / Prompt Engineer",
tagline: "Maksimalin AI kayak ChatGPT. Peran baru yang cepat tumbuh.",
whatYouDo: "Kamu desain cara perusahaan pakai AI — tulis prompt, bangun alur kerja, pastikan AI kasih jawaban bagus buat pelanggan.",
dayInLife: ["Iterasi prompt sampai AI berhenti ngomong yang aneh.", "Bangun chatbot customer support.", "Tes edge case — gimana kalau user tanya hal aneh?", "Tulis dokumentasi pakai AI dengan aman."],
roadmap: [
{ step: "Pakai ChatGPT/Claude intens", weeks: "1 bulan", what: "Pakai tiap hari buat kerja nyata. Pelajari: system prompt vs user prompt, konteks, chain-of-thought, few-shot, role prompting, output format (JSON, markdown), temperature, batasan model. Ikuti Anthropic Prompt Engineering Guide." },
{ step: "Python dasar + API LLM", weeks: "1-2 bulan", what: "Python sintaks, function, class. Panggil API OpenAI/Anthropic/Gemini dari script. Pelajari: streaming response, token counting, cost calculation, error handling (rate limit, context length)." },
{ step: "Framework & RAG", weeks: "1-2 bulan", what: "LangChain atau LlamaIndex untuk chaining prompt. RAG (Retrieval-Augmented Generation): embedding, vector database (Pinecone, Chroma, pgvector), chunking dokumen, re-ranking. Ini cara bikin AI yang tahu dokumen internal." },
{ step: "Bangun tool AI end-to-end", weeks: "2 bulan", what: "Chatbot customer support, tutor bahasa, asisten riset, generator konten. Tambah: function calling (AI yang panggil API), agents (multi-step task), evaluasi otomatis (LLM-as-judge)." },
{ step: "Bagi & iterasi", weeks: "terus menerus", what: "Rilis project di publik (Twitter/LinkedIn/GitHub), tulis teardown prompt yang bagus, ikut komunitas Discord. Prompt engineering adalah profesi sambil belajar di publik." }
]
},
cybersec: {
name: "Analis Cybersecurity",
tagline: "Lindungi perusahaan dari hacker. Bodyguard digital.",
whatYouDo: "Kamu pembelanya. Cek titik lemah, pantau serangan, dan tanggapi kalau ada yang buruk terjadi.",
dayInLife: ["Review peringatan keamanan semalaman.", "Investigasi login mencurigakan dari negara lain.", "Lakukan tes phishing ke rekan sendiri (dengan izin).", "Patch kerentanan di server."],
roadmap: [
{ step: "Dasar networking", weeks: "2 bulan", what: "Model OSI, TCP/IP, subnet, DNS, HTTP/HTTPS, VPN, firewall, NAT, port umum (80, 443, 22, 3389). Tool: Wireshark (sniff paket), nmap (scan port), ping, traceroute, dig. Paham cara data benar-benar mengalir di internet." },
{ step: "Linux + command line", weeks: "1 bulan", what: "Ubuntu/Kali Linux: ls, cd, grep, awk, sed, pipe, permission (chmod 755), service (systemd), log (/var/log), cron. Bash scripting dasar. Kebanyakan tool security Linux-only." },
{ step: "Fondasi security", weeks: "2-3 bulan", what: "CIA triad (Confidentiality, Integrity, Availability), cryptography dasar (hash, symmetric, asymmetric, TLS), authentication vs authorization, OWASP Top 10 (SQL injection, XSS, CSRF), social engineering, malware jenisnya." },
{ step: "Sertifikasi CompTIA Security+", weeks: "2-3 bulan", what: "Sertifikasi entry standar yang diakui HR. Cover: threat, attack, vulnerability, arsitektur security, operation, governance. Buku: Mike Meyers atau Professor Messer (YouTube gratis)." },
{ step: "Hack The Box / TryHackMe", weeks: "terus menerus", what: "Latihan di lingkungan legal. Mulai dari jalur 'Complete Beginner' TryHackMe. Tambah: ikut CTF (Capture The Flag) kecil — picoCTF bagus buat pemula." }
]
},
pentest: {
name: "Hacker Etis / Pentester",
tagline: "Dibayar buat menerobos — legal. Cari lubang sebelum hacker nyata.",
whatYouDo: "Perusahaan nyewa kamu buat coba ngehack mereka. Kamu laporin temuan, mereka perbaiki. Tukang kunci digital yang spesialis menerobos.",
dayInLife: ["Petakan jejak digital perusahaan target.", "Coba serangan umum, lihat mana yang nembus.", "Tulis laporan buat klien.", "Pelajari kerentanan terbaru sambil makan siang."],
roadmap: [
{ step: "Dasar cybersecurity dulu", weeks: "6 bulan", what: "Wajib paham pertahanan sebelum penyerangan: networking, Linux, security fundamental, OWASP Top 10. Lewati step ini = pentester yang cuma bisa jalanin tool tanpa paham." },
{ step: "Teknik menyerang terpandu", weeks: "6 bulan", what: "TryHackMe jalur Offensive Pentesting, HackTheBox Academy. Pelajari: reconnaissance (pengintaian), enumerasi, exploitation (Metasploit, manual), privilege escalation (Linux & Windows), pivoting, password cracking (John the Ripper, hashcat). Tool: Burp Suite buat web." },
{ step: "Sertifikasi OSCP", weeks: "6-12 bulan", what: "Offensive Security Certified Professional — sertifikasi pentest paling dihormati. Ujian 24 jam praktek hack beberapa mesin + laporan. Siapin: PEN-200 course, HTB boxes yang sesuai list TJ Null, banyak catatan." },
{ step: "Spesialisasi", weeks: "6+ bulan", what: "Pilih: web app (Burp Suite mendalam, OSWE), Active Directory (kunci di enterprise), cloud pentest (AWS/Azure), mobile, hardware/IoT, red team ops (phishing, C2 framework). Spesialisasi = bayaran naik." },
{ step: "Bug bounty", weeks: "terus menerus", what: "Platform: HackerOne, Bugcrowd, Intigriti. Mulai dari program publik gampang (IDOR, XSS), baca write-up top hacker. Dibayar per vuln yang diterima ($100-$50.000). Bisa side income atau full-time." }
]
},
cloud: {
name: "Cloud Engineer",
tagline: "Jalanin app di gudang komputer raksasa (AWS, Google Cloud, Azure).",
whatYouDo: "Waktu kamu pakai Netflix, itu nggak jalan di satu komputer — tapi ribuan server di gudang. Kamu desain & kelola setup itu.",
dayInLife: ["Set up environment server baru buat tim.", "Investigasi kenapa semua jadi lambat semalaman.", "Potong biaya cloud — perusahaan benci pemborosan.", "Latihan disaster recovery: kalau region down?"],
roadmap: [
{ step: "Linux + networking", weeks: "2 bulan", what: "Perintah Linux, SSH, file system, service, log, firewall (iptables/ufw). Networking: IP, subnet, routing, load balancer, CDN, DNS. Ini fondasi — server cloud tetap Linux box." },
{ step: "Sertifikasi AWS Cloud Practitioner", weeks: "1 bulan", what: "Sertifikasi entry termudah. Cover: EC2 (server), S3 (storage), RDS (database), VPC (network), IAM (akses), billing. Gratis banyak materi (AWS Skill Builder, freeCodeCamp). Alternatif: Azure Fundamentals (AZ-900) atau GCP Cloud Digital Leader." },
{ step: "Infrastructure as Code (Terraform)", weeks: "2 bulan", what: "Tulis kode definisi server (bukan klik manual). Pelajari: Terraform sintaks (HCL), module, state, workspace. Alternatif: Pulumi, AWS CloudFormation, Ansible untuk config management." },
{ step: "Container & orchestration", weeks: "2-3 bulan", what: "Docker (bikin image, Dockerfile, compose), Kubernetes (pod, service, deployment, ingress). Managed: EKS/GKE/AKS. Ini standar cara deploy app modern di cloud." },
{ step: "Sertifikasi AWS Solutions Architect Associate", weeks: "3 bulan", what: "Booster karier serius. Cover desain arsitektur multi-tier, high availability, disaster recovery, cost optimization, security. Setelah ini: Professional atau spesialisasi (Security, Networking, Data)." }
]
},
devops: {
name: "DevOps Engineer",
tagline: "Pastikan kode dari laptop developer nyampai ke user dengan lancar & otomatis.",
whatYouDo: "Kamu bangun jalur perakitan yang ngambil kode developer dan kirim ke jutaan user — otomatis, aman, tiap hari.",
dayInLife: ["Perbaiki deploy pipeline yang rusak semalam.", "Otomatisasi proses manual yang tim keluhkan.", "Pantau alert & dashboard.", "Pair sama developer buat ngebut workflow mereka."],
roadmap: [
{ step: "Linux + shell scripting", weeks: "2 bulan", what: "Hidup di terminal. Bash scripting (variabel, loop, function, argument), sed/awk, cron, systemd, SSH, rsync. Networking dasar. Tanpa Linux, DevOps nggak mulai." },
{ step: "Git + kolaborasi", weeks: "2-3 minggu", what: "Git mendalam (branch, merge, rebase, cherry-pick, reflog, hook), Git flow vs trunk-based, code review via pull request, resolve conflict. GitHub/GitLab UI mendalam." },
{ step: "Docker + container", weeks: "1 bulan", what: "Dockerfile, image, volume, network, docker-compose, multi-stage build, best practice keamanan & ukuran. Pelajari Alpine Linux base." },
{ step: "CI/CD pipeline", weeks: "2 bulan", what: "GitHub Actions / GitLab CI / Jenkins: build otomatis, test, deploy. Strategi deploy: blue-green, canary, rolling. Pelajari semantic versioning, release note otomatis." },
{ step: "Kubernetes + observability", weeks: "3 bulan", what: "K8s: pod, deployment, service, ingress, configmap, secret, helm chart. Observability: Prometheus (metric), Grafana (dashboard), Loki/ELK (log), Jaeger (trace). Incident response + on-call culture." }
]
},
network: {
name: "Network Engineer",
tagline: "Desain & rawat kabel, router, Wi-Fi yang bikin internet jalan.",
whatYouDo: "Wi-Fi ngadat? Kantor nggak bisa ke cloud? Kamu orang yang tahu kenapa jalan raya tak kasat mata macet.",
dayInLife: ["Troubleshoot VPN kantor lelet.", "Konfigurasi router baru buat cabang.", "Upgrade perangkat jaringan pas jendela maintenance jam 2 pagi (kadang).", "Dokumentasi jaringan biar tim paham."],
roadmap: [
{ step: "Sertifikasi CompTIA Network+", weeks: "2 bulan", what: "Fundamental wajib: model OSI, TCP/IP, subnet + CIDR, routing static vs dynamic, switch vs router, VLAN, Wi-Fi standar, protokol (DHCP, DNS, NAT, ICMP), troubleshooting metodologi." },
{ step: "Sertifikasi Cisco CCNA", weeks: "4-6 bulan", what: "Sertifikasi starter vendor paling dihormati. Cover: IPv4/IPv6, routing (OSPF, EIGRP), switching (STP, VLAN, trunk), Wi-Fi, security dasar, automation (Python + Ansible untuk network). Belajar CLI Cisco." },
{ step: "Lab rumah pakai router bekas", weeks: "terus menerus", what: "Beli router Cisco/Mikrotik bekas ($30-100) atau pakai simulator (Packet Tracer, GNS3, EVE-NG). Latihan itu segalanya — konfig real bikin pengetahuan stick." },
{ step: "Monitoring & automation", weeks: "2-3 bulan", what: "SNMP, NetFlow, Zabbix/PRTG/LibreNMS untuk monitor. Python + Netmiko/NAPALM untuk otomasi. Ansible untuk config banyak device sekaligus. Infrastructure-as-code untuk jaringan." },
{ step: "Spesialisasi", weeks: "1+ tahun", what: "Pilih arah: network security (firewall — Palo Alto/Fortinet, IDS/IPS), SD-WAN, cloud networking (AWS VPC, Azure VNet), service provider, atau DevNet (programmable network). Sertifikasi lanjutan: CCNP, CCIE." }
]
},
helpdesk: {
name: "IT Support / Help Desk",
tagline: "Orang ramah yang benerin komputer kamu. Pekerjaan IT pertama yang umum.",
whatYouDo: "Laptop seseorang nggak nyala, emailnya aneh, atau dia lupa password. Kamu bantu — langsung, chat, atau telepon.",
dayInLife: ["Reset 4 password lupa sebelum kopi.", "Set up laptop karyawan baru.", "Pandu orang connect Wi-Fi lewat telepon.", "Eskalasi masalah aneh ke tim networking."],
roadmap: [
{ step: "Sertifikasi CompTIA A+", weeks: "2-3 bulan", what: "Sertifikasi IT entry klasik. Cover: hardware PC (CPU, RAM, storage, PSU), troubleshooting, OS (Windows, macOS, Linux, mobile), networking dasar, security dasar, dokumentasi & soft skill." },
{ step: "Soft skill & proses", weeks: "ongoing", what: "Komunikasi sabar & jelas dengan user non-teknis, active listening, empati, dokumentasi tiket (Jira, ServiceNow, Zendesk), SLA, eskalasi. 50% kerjaan help desk itu bukan teknis — itu manusia." },
{ step: "Dapat kerja help desk", weeks: "bervariasi", what: "Banyak mulai tanpa gelar. Tulis CV fokus ke: sertifikasi, lab rumah, project pribadi (bikin PC, konfigurasi Windows Server di VM). Internship atau tier-1 remote position bagus banget." },
{ step: "Belajar scripting (PowerShell + Bash)", weeks: "2 bulan", what: "PowerShell buat Windows (reset password massal, audit akun AD, export laporan), Bash buat Linux. Otomatisasi bagian membosankan = kamu jadi lebih produktif = promosi lebih cepat." },
{ step: "Pindah ke sysadmin / networking / cloud", weeks: "1-2 tahun kerja", what: "Help desk itu batu loncatan. Pilih arah berdasar apa yang kamu suka: server & Windows (sysadmin), jaringan (network engineer), cloud (Azure/AWS admin), atau security (SOC analyst)." }
]
},
sysadmin: {
name: "System Administrator",
tagline: "Jaga server tetap jalan. Tulang punggung tiap perusahaan tech.",
whatYouDo: "Server email down? File share rusak? Kamu pastikan komputer & server perusahaan terus jalan.",
dayInLife: ["Apply update security tanpa merusak apa pun.", "Perbaiki backup yang gagal.", "Otomatisasi tugas membosankan lewat script.", "Rencanakan upgrade server tahun depan."],
roadmap: [
{ step: "Pengalaman help desk", weeks: "6-12 bulan", what: "Bangun pemahaman dasar OS, user, dan masalah umum. Tanpa pengalaman user-facing, sysadmin gampang ngambil keputusan yang nyebelin user." },
{ step: "Linux atau Windows Server mendalam", weeks: "6 bulan", what: "Windows: Active Directory, Group Policy, DNS, DHCP, file server, WSUS, PowerShell. Linux: systemd, package manager, SSH, cron, log, LVM, iptables, bash. Pilih satu dalam dulu." },
{ step: "Virtualisasi & storage", weeks: "2 bulan", what: "VMware vSphere atau Hyper-V atau Proxmox. Konsep: VM, snapshot, live migration, HA cluster. Storage: RAID, SAN/NAS, backup strategi (3-2-1 rule). Tool backup: Veeam, Bacula." },
{ step: "Scripting (Bash atau PowerShell)", weeks: "2 bulan", what: "Otomasi itu superpower sysadmin. Scripting + scheduler (cron/Task Scheduler) buat patch, user provisioning, laporan harian, health check. Config management: Ansible/Puppet/Chef." },
{ step: "Pindah ke cloud atau DevOps", weeks: "2+ tahun kerja", what: "Sysadmin modern arah cloud (Azure/AWS admin), DevOps (CI/CD, Kubernetes), atau SRE (Site Reliability Engineer — sysadmin + coding + observability)." }
]
},
dba: {
name: "Database Administrator",
tagline: "Jaga hal paling berharga di perusahaan: datanya.",
whatYouDo: "Tiap app punya database. Kamu pastikan cepat, aman, dicadangkan, & nggak kehilangan data — karena hilang data bisa bunuh perusahaan.",
dayInLife: ["Tuning query lambat yang bikin perusahaan rugi.", "Tes backup dengan restore.", "Review desain database fitur baru.", "Migrasi data dari sistem lama tanpa kehilangan baris."],
roadmap: [
{ step: "Fasih SQL", weeks: "2-3 bulan", what: "Bukan cuma baca — tulis query kompleks: JOIN banyak tabel, subquery, CTE, window function, stored procedure, trigger, view, index type (B-tree, hash, partial). Query optimization + EXPLAIN plan." },
{ step: "Pelajari satu database mendalam", weeks: "6 bulan", what: "PostgreSQL atau MySQL awalan bagus (open source). Enterprise: Oracle atau SQL Server. Pelajari: arsitektur internal (storage engine, buffer pool, WAL), tipe data, isolation level, MVCC, partitioning, replikasi (master-slave, master-master)." },
{ step: "Backup & recovery", weeks: "1 bulan", what: "Sebagian besar kerjanya. Backup full vs incremental vs differential, point-in-time recovery, test restore rutin (backup yang belum pernah ditest = backup palsu), RTO/RPO, disaster recovery plan." },
{ step: "Performance tuning & security", weeks: "2-3 bulan", what: "Slow query log, EXPLAIN ANALYZE, index strategy, connection pooling, caching (Redis di atas DB), role & permission, enkripsi at-rest dan in-transit, audit log, GDPR/compliance dasar." },
{ step: "Sertifikasi + NoSQL dasar", weeks: "bervariasi", what: "Oracle OCP, Microsoft Azure DB, atau AWS DB Specialty. Tambah NoSQL: MongoDB, Redis, Cassandra, DynamoDB — tiap app modern pakai multiple database." }
]
},
uxui: {
name: "Desainer UX / UI",
tagline: "Nentuin tampilan & rasa app. Lebih sedikit kode, lebih banyak empati.",
whatYouDo: "UX = cara kerjanya. UI = tampilannya. Kamu cari tahu kebutuhan user, gambar, tes, lalu serahkan ke developer buat dibikin.",
dayInLife: ["Wawancara user buat paham frustrasinya.", "Sketsa 5 cara layar baru bisa kerja.", "Bangun prototipe klik di Figma.", "Serahin desain ke developer dan jawab pertanyaannya."],
roadmap: [
{ step: "Belajar Figma", weeks: "1 bulan", what: "Frame, auto-layout, komponen & variant, style (color, text), prototype dengan interaksi, constraint, grid. Plugin wajib: Iconify, Unsplash, Content Reel. Shortcut itu game changer." },
{ step: "Fundamental desain visual", weeks: "2-3 bulan", what: "Tipografi (pairing, hierarki, leading, tracking, ukuran), teori warna (kontras WCAG, palette, mood), layout (Gestalt, grid, spacing scale 4/8pt), visual hierarchy, whitespace. Buku: Refactoring UI (Schoger & Wathan)." },
{ step: "UX research & proses", weeks: "2 bulan", what: "Wawancara user, persona, user journey, problem statement, wireframe low vs high fidelity, usability testing, A/B test dasar. Metodologi: Double Diamond, Design Thinking, Jobs-to-be-Done." },
{ step: "Redesain 3 app nyata", weeks: "2 bulan", what: "Ambil app yang kamu pakai sehari-hari, identifikasi 3 masalah, redesain. Dokumentasikan proses (problem → research → sketch → high-fi → prototype) di Behance/Dribbble atau case study blog. Ini yang direkrut lihat." },
{ step: "Design system & handoff", weeks: "1-2 bulan", what: "Design token, komponen library (Figma), dokumentasi pola, aksesibilitas (WCAG, kontras, focus state, screen reader), dasar HTML/CSS biar komunikasi sama developer lancar. Project nyata atau magang = pembuat portfolio." }
]
},
pm: {
name: "Product Manager",
tagline: "Nentuin APA yang dibangun & KENAPA. Jembatan bisnis, desain, engineering.",
whatYouDo: "Kamu nggak ngoding. Kamu ngobrol sama user, ngobrol sama bisnis, dan bilang ke engineer/desainer apa yang layak dibangun — dan kenapa.",
dayInLife: ["Ketemu user buat belajar apa yang susah.", "Tulis spec fitur baru.", "Bilang TIDAK ke 10 ide bagus biar tim bisa rilis satu yang luar biasa.", "Cek data buat lihat fitur bulan lalu beneran work."],
roadmap: [
{ step: "Pelajari dasar tiap bidang", weeks: "3 bulan", what: "Sedikit desain (Figma basic), sedikit kode (bisa baca HTML/CSS/JS, paham cara API kerja), sedikit bisnis (unit economics, funnel, retention, CAC/LTV). Jangan jadi expert — jadi cukup fasih buat ngobrol." },
{ step: "Framework produk", weeks: "1-2 bulan", what: "Jobs-to-be-Done, RICE scoring, OKR, North Star Metric, product discovery (Teresa Torres), opportunity solution tree, MVP, kill criteria. Baca: Inspired (Cagan), Continuous Discovery Habits (Torres)." },
{ step: "Rilis side project", weeks: "3-6 bulan", what: "Bukti kamu bisa nyelesaiin. Bisa no-code (Bubble, Glide) atau tim kecil dengan developer freelance. Tulis PRD, prioritas fitur, rilis v1, iterasi berdasar user. Dokumentasikan di LinkedIn/blog." },
{ step: "Analytics + SQL", weeks: "2 bulan", what: "SQL dasar buat nanya data sendiri, Mixpanel/Amplitude/Google Analytics/Posthog untuk funnel & retention. A/B testing basic. Data = cara buktiin ide, bukan argumen. Seorang PM yang nggak bisa baca data = PM yang gampang dibohongi." },
{ step: "Lamar Associate PM", weeks: "bervariasi", what: "Program APM (Google, Meta, Uber, Gojek) kompetitif. Juga: PM di startup (masuk lebih gampang, belajar cepat). Portfolio: case study, side project rilis, tulisan opini produk. Jangan nunggu 'siap' — mulai lamar." }
]
},
qa: {
name: "QA Engineer / Tester",
tagline: "Menghancurkan software dengan sengaja — biar user nggak harus.",
whatYouDo: "Sebelum software rilis, kamu coba rusakin. Klik yang aneh, input yang salah, dan tulis tes otomatis biar bug nggak lolos lagi.",
dayInLife: ["Tes fitur baru & temuin 3 bug.", "Tulis tes otomatis biar nggak kejadian lagi.", "Laporan bug yang jelas biar developer bisa perbaiki.", "Pair sama developer buat kasus tricky."],
roadmap: [
{ step: "Dasar manual testing", weeks: "1 bulan", what: "Mindset tester: asumsi adalah musuh. Jenis testing: functional, regression, smoke, sanity, exploratory, usability. Test case design, boundary value analysis, equivalence partitioning, bug report yang jelas (reproduce step, expected vs actual, severity)." },
{ step: "Sertifikasi ISTQB Foundation", weeks: "2 bulan", what: "Sertifikasi QA awalan paling diakui. Cover: fundamental testing, test level (unit, integration, system, acceptance), test management, tool. Silabus gratis tersedia online." },
{ step: "Otomasi test web", weeks: "2-3 bulan", what: "Selenium (klasik), Cypress (modern, populer di JS ekosistem), Playwright (paling hot 2024-2026). Page Object Model, test data management, parallel execution, CI integration. Bahasa pendamping: JavaScript/TypeScript atau Python." },
{ step: "API testing & performance", weeks: "2 bulan", what: "Postman (manual), REST Assured atau Playwright API, schema validation. Performance: JMeter, k6, Locust — load test, stress test, spike test. Paham status code, header, auth." },
{ step: "Programming + mobile/security testing", weeks: "2 bulan", what: "Python atau JavaScript mendalam (otomasi butuh kode beneran). Mobile: Appium, BrowserStack. Security testing dasar: OWASP ZAP, Burp Suite. Kontrak testing: Pact." }
]
},
embedded: {
name: "Embedded / Firmware Developer",
tagline: "Programin komputer kecil di dalam benda fisik — mobil, drone, microwave.",
whatYouDo: "Ada kode di microwave-mu, mobilmu, lampu pintarmu. Kamu tulis kode itu — kecil, cepat, handal, di hardware terbatas.",
dayInLife: ["Program chip kecil buat baca sensor.", "Debug pakai osiloskop — iya, kabel beneran.", "Optimasi kode buat jalan di memori 4KB.", "Kerja sama sama engineer hardware."],
roadmap: [
{ step: "Belajar C", weeks: "2-3 bulan", what: "Bahasa si logam. Pointer, memory management manual, struct, bitwise operation, preprocessor, makefile. Nggak ada garbage collector — kamu yang atur memori. Buku: K&R C Programming." },
{ step: "Elektronika dasar", weeks: "1-2 bulan", what: "Hukum Ohm, rangkaian seri/paralel, resistor, kapasitor, transistor, LED, voltage divider, baca skematik, multimeter. Paham digital (HIGH/LOW) vs analog (ADC/DAC). Nggak perlu jadi EE, tapi harus paham apa yang terjadi di pin." },
{ step: "Project Arduino", weeks: "2 bulan", what: "Arduino Uno ($10-20). Project: LED blink, baca sensor (suhu, jarak ultrasonik), kontrol motor, LCD display, wireless (bluetooth, WiFi via ESP32). Ngajarin GPIO, PWM, I2C, SPI, UART." },
{ step: "Pindah ke STM32 / Raspberry Pi Pico", weeks: "3 bulan", what: "Arduino itu training wheels. STM32: RTOS (FreeRTOS), interrupt, DMA, debugging lewat JTAG/SWD. Tool pro: STM32CubeIDE, PlatformIO, osiloskop (dipinjam aja dulu)." },
{ step: "Bangun device dari nol", weeks: "3+ bulan", what: "Dari skematik sendiri → PCB (KiCad gratis) → solder → firmware → case. Emas buat portfolio. Project ide: environmental sensor IoT, custom keyboard, pet feeder, weather station." }
]
},
robotics: {
name: "Robotics Engineer",
tagline: "Ajarin robot gerak, lihat, & keputusan.",
whatYouDo: "Dari mobil self-driving, lengan pabrik, sampai drone mini — kamu tulis kode yang bikin mesin merasakan dunia & bertindak.",
dayInLife: ["Tuning lengan robot biar nggak jatohin barang.", "Debug kenapa vision kadang gagal di cahaya terang.", "Simulasi skenario sebelum di hardware nyata.", "Kolaborasi sama engineer mekanis & elektrik."],
roadmap: [
{ step: "Python + matematika kuat", weeks: "6 bulan", what: "Python (numpy, scipy), aljabar linear (matriks transformasi, vektor, dot product, cross product), kalkulus (turunan buat kontrol), trigonometri, geometri. Buku: Modern Robotics (Lynch & Park) gratis." },
{ step: "ROS (Robot Operating System)", weeks: "3-6 bulan", what: "ROS2 (bukan ROS1 lagi). Konsep: node, topic, service, action, parameter, launch file, package, rviz (visualisasi), gazebo (simulator). Bahasa: Python atau C++. Ini framework standar industri robotik." },
{ step: "Dasar computer vision", weeks: "3 bulan", what: "OpenCV: image processing, thresholding, edge detection, contour, feature (SIFT/ORB), camera calibration. Deep learning vision: YOLO (deteksi objek), segmentasi. Depth sensing (stereo, LiDAR, RGBD)." },
{ step: "Kontrol & path planning", weeks: "3 bulan", what: "PID controller, state estimation (Kalman filter), SLAM (simultaneous localization and mapping), path planning (A*, RRT), motion planning, kinematika (forward & inverse). Simulasi: Gazebo, Isaac Sim." },
{ step: "Bangun robot fisik", weeks: "6+ bulan", what: "Mulai kecil: robot line follower, lengan 3-DOF, drone. Hardware: Raspberry Pi + motor driver, servo, IMU. Pakai platform edukasi: TurtleBot, LeRobot (HuggingFace), atau rakit sendiri. Yang kecil pun ngajarin segala." }
]
},
blockchain: {
name: "Blockchain / Web3 Developer",
tagline: "Bangun app di jaringan crypto. Kontroversial, masih ngehire.",
whatYouDo: "Kamu bangun app di blockchain kayak Ethereum. Anggap sebagai internet aneh yang bisa diprogram di mana uang, kepemilikan, & aturan sudah tertanam.",
dayInLife: ["Tulis smart contract (kode yang jalan di blockchain).", "Audit kode buat bug mahal — itu uang sungguhan.", "Tes di jaringan test sebelum deploy beneran.", "Baca laporan security project lain yang dihack."],
roadmap: [
{ step: "Dasar JavaScript + TypeScript", weeks: "2 bulan", what: "JS mendalam (async, Promise, class), TypeScript (tipe, interface, generic). Node.js + npm. Tooling Web3 umumnya JS/TS ekosistem." },
{ step: "Cara kerja blockchain", weeks: "1 bulan", what: "Konseptual: hash, block, chain, consensus (Proof of Work vs Proof of Stake), wallet, private/public key, gas, transaksi. Ethereum vs Solana vs Bitcoin. Baca Mastering Ethereum (Antonopoulos) gratis." },
{ step: "Solidity + smart contract", weeks: "3 bulan", what: "Solidity: variabel, function, modifier, event, mapping, struct, inheritance, ERC-20, ERC-721 (NFT), ERC-1155. Pola keamanan: reentrancy, overflow, access control. Kursus: CryptoZombies, Solidity by Example, Cyfrin Updraft (gratis)." },
{ step: "Tool developer", weeks: "1-2 bulan", what: "Hardhat atau Foundry (framework dev), ethers.js atau viem (library interaksi), Remix (IDE browser), MetaMask, testnet (Sepolia), block explorer (Etherscan). Unit test wajib — kode di blockchain nggak bisa di-patch." },
{ step: "Rilis dApp test + security audit", weeks: "2-3 bulan", what: "Bikin app voting, token ERC-20, NFT marketplace mini. Frontend: React + wagmi/RainbowKit. Deploy ke testnet. Pelajari audit: baca laporan Trail of Bits, ikut Code4rena contest, kenali exploit umum (The DAO, Ronin, dll)." }
]
},
musicprog: {
name: "Music Programmer / Audio Developer",
tagline: "Koding tool musik, plugin, synthesizer, atau audio game.",
whatYouDo: "Kamu setengah musisi, setengah coder. Kamu bangun plugin yang dipakai artis, synthesizer yang bikin suara dari matematika, atau sistem audio di game.",
dayInLife: ["Implementasi efek audio baru buat plugin.", "Tuning — harfiah, pakai telinga.", "Perbaiki bug di mana nada nge-click.", "Tulis lagu tes buat demo karyamu."],
roadmap: [
{ step: "Teori musik + sedikit koding", weeks: "bervariasi", what: "Butuh keduanya. Teori: interval, chord, skala, irama, notasi, mixing dasar. Koding: Python atau JS awalnya. Dengerin dengan telinga kritis (A/B test plugin, frekuensi)." },
{ step: "DSP (Digital Signal Processing)", weeks: "3-4 bulan", what: "Konsep: sample rate, bit depth, FFT, filter (low-pass, high-pass, band-pass), envelope (ADSR), LFO, delay line, convolution. Buku: Introduction to Digital Filters (Smith) gratis. Coba implement filter sederhana di Python dulu." },
{ step: "Belajar C++", weeks: "4-6 bulan", what: "Kebanyakan audio C++ karena realtime. Pointer, template, STL, RAII, smart pointer, multithreading. CMake build system. Paham: audio callback dijalankan tiap ~5ms — NGGAK boleh alokasi memori, lock, atau log di situ." },
{ step: "Framework JUCE", weeks: "2-3 bulan", what: "Standar industri plugin. Pelajari: AudioProcessor, parameter, GUI, preset, format plugin (VST3, AU, AAX). Alternatif: iPlug2, RNBO, Max MSP gen~ buat prototyping cepat." },
{ step: "Bangun plugin simpel", weeks: "2-3 bulan", what: "Reverb, delay, distorsi, EQ, chorus, compressor. Rilis gratis di website sendiri atau jual di Gumroad. Masuk komunitas: KVR Forum, The Audio Programmer Discord. Alternatif karier: audio programmer game (FMOD, Wwise)." }
]
},
creativecoder: {
name: "Creative Coder / Seniman Generatif",
tagline: "Bikin seni, visual, & pengalaman pakai kode.",
whatYouDo: "Instalasi interaktif di galeri. Video klip musik dari matematika bergerak. Seni NFT generatif. Kamu pakai kode kayak kuas cat.",
dayInLife: ["Sketsa ide visual di p5.js.", "Atur matematikanya sampai kerasa pas.", "Pasang karya di festival atau galeri.", "Ajar workshop atau posting prosesnya online."],
roadmap: [
{ step: "Tutorial p5.js", weeks: "1 bulan", what: "p5.js (JS): setup(), draw(), shape, color, transform, perlin noise, random, interaksi mouse/keyboard. Daniel Shiffman YouTube (The Coding Train) = sumber emas. Setelahnya: Processing (Java) atau OpenFrameworks (C++) buat yang serius." },
{ step: "Matematika visual", weeks: "2 bulan", what: "Trigonometri (sin/cos buat gerak melingkar), vektor, interpolasi (lerp), easing curve, noise (perlin, simplex), sistem partikel, flocking (Boids), L-system, cellular automata. Buku: The Nature of Code (Shiffman) gratis online." },
{ step: "Shader & WebGL", weeks: "2-3 bulan", what: "GLSL shader (fragment + vertex), Three.js, shadertoy.com buat latihan. Raymarching, SDF (signed distance function), post-processing. Ini levelnya naik dari 2D flat ke efek sinematik." },
{ step: "Sketsa harian (#100days)", weeks: "100 hari", what: "Satu sketch per hari, post di Twitter/Instagram dengan #creativecoding. Cara klasik naik level — konsistensi > ambisi. Lihat: Zach Lieberman, Tyler Hobbs, Manolo Gamboa Naon." },
{ step: "Rilis karya nyata", weeks: "bervariasi", what: "NFT (fx(hash), Art Blocks), instalasi interaktif (TouchDesigner buat VJ), cetak/plotter art, musik video, website portfolio keren. Ikut festival seni digital, CCFest, ITP Camp." }
]
},
tech_writer: {
name: "Technical Writer",
tagline: "Tulis dokumentasi, tutorial, panduan yang bikin tech dimengerti.",
whatYouDo: "Tiap tool bagus punya dokumentasi jelas. Kamu yang nulis — ubah kode ruwet jadi penjelasan yang manusia nyata bisa ikutin.",
dayInLife: ["Wawancara engineer tentang API baru.", "Tulis tutorial, termasuk kode yang kamu jalanin.", "Edit dokumentasi berdasar feedback user.", "Review tulisan teman."],
roadmap: [
{ step: "Belajar nulis jelas", weeks: "terus menerus", what: "Ini skill sejatinya. Tulisan aktif, kalimat pendek, hindari jargon nggak perlu, chunk informasi, gunakan heading, numbered list buat prosedur. Buku: On Writing Well (Zinsser), The Elements of Style, Docs for Developers (Bhatti et al)." },
{ step: "Markdown + Git + dokumentasi tool", weeks: "2-3 minggu", what: "Markdown (heading, list, code block, link, image), Git (commit, branch, PR), static site generator: Docusaurus, MkDocs, Hugo, Jekyll. Diagram: Mermaid, Excalidraw. Screenshot tool: CleanShot, Flameshot." },
{ step: "Struktur dokumentasi modern", weeks: "1 bulan", what: "Diátaxis framework: Tutorial (learning-oriented), How-to (goal-oriented), Reference (information-oriented), Explanation (understanding-oriented). Baca dokumentasi Stripe, Twilio, Tailwind — standar emas." },
{ step: "Tulis 5 tutorial bagus", weeks: "2 bulan", what: "Pilih tool yang kamu pakai. Tulis: getting started, integrasi umum, troubleshooting. Publish di dev.to, Medium, personal site. Bonus: bikin video pendamping (Loom atau YouTube)." },
{ step: "Kontribusi ke open source", weeks: "terus menerus", what: "Perbaiki dokumentasi project yang kamu pakai — typo, penjelasan tambahan, example baru. Cara tercepat dilihat maintainer. Banyak tech writer dihire dari kontribusi dokumentasi." }
]
},
devrel: {
name: "Developer Advocate",
tagline: "Programmer yang ngobrol sama programmer lain — ngajar, demo, bangun komunitas.",
whatYouDo: "Kamu coder DAN pengajar. Kamu kasih talk, tulis tutorial, tweet, bikin video — bantu developer lain pakai tool perusahaanmu.",
dayInLife: ["Rekam tutorial YouTube.", "Jawab pertanyaan di Discord komunitas.", "Siapkan talk buat konferensi.", "Bangun demo seru buat pamer fitur baru."],
roadmap: [
{ step: "Jadi developer dulu", weeks: "1+ tahun", what: "Butuh pengalaman rilis produk nyata — kredibilitas = modal DevRel. Kuasai 1 stack, rilis 2-3 project beneran, paham pain point developer." },
{ step: "Bangun audiens publik", weeks: "1+ tahun", what: "Pilih 1 channel utama: Twitter/X (thread teknis), YouTube (tutorial + live coding), blog personal (deep dive), atau TikTok (short dev content). Konsistensi > viral. Target: 1 konten / minggu selama 1 tahun." },
{ step: "Publik speaking", weeks: "terus menerus", what: "Mulai dari Meetup lokal (5-10 orang) → komunitas regional → konferensi kecil → keynote. Latihan: rekam diri, kirim CFP (Call For Papers) ke konferensi. Tool: Keynote/Slides, OBS." },
{ step: "Demo & sample code", weeks: "3 bulan", what: "Bikin demo keren yang memperlihatkan produk dalam konteks nyata (bukan to-do list klise). Sample repo di GitHub dengan README jelas. Tutorial step-by-step." },
{ step: "Lamar peran DevRel", weeks: "bervariasi", what: "Banyak peran DevRel junior sekarang. Role: Developer Advocate, DevRel Engineer, Community Manager, Technical Evangelist. Perusahaan: Stripe, Vercel, Supabase, MongoDB, AWS, HashiCorp." }
]
},
noCode: {
name: "No-Code / Automation Builder",
tagline: "Bangun app & otomasi tanpa kode tradisional. Cepat & ramah pemula.",
whatYouDo: "Kamu drag-and-drop buat bikin tool nyata: portal pelanggan, dashboard internal, otomasi yang hemat 20 jam seminggu. Jalur masuk bagus.",
dayInLife: ["Otomasi proses yang tadinya kerjaan full-time seseorang.", "Bangun tool internal buat tim non-teknis.", "Latih klien pakai yang kamu bangun.", "Sambungin 5 app biar saling berbagi data."],
roadmap: [
{ step: "Pilih satu tool", weeks: "2-3 minggu", what: "Mulai sempit. Pilih: Zapier/Make (otomasi antar app), Airtable (database + UI), Bubble (web app lengkap), Webflow (website desainer-first), Glide/Softr (app dari spreadsheet), Notion (workspace + API). Jangan pelajari semua." },
{ step: "Otomasi hidup sendiri", weeks: "1 bulan", what: "Otomasi tugas berulang kamu: email → task otomatis, RSS → Slack, receipt email → Notion database, kalendar sync, invoice generator. Latihan project pribadi = familiar dengan tool." },
{ step: "3 otomasi gratis buat teman", weeks: "1 bulan", what: "Testimoni + portfolio. Contoh: booking system buat salon, CRM sederhana buat UMKM, onboarding klien buat freelancer. Dokumentasi: sebelum vs sesudah, waktu yang dihemat." },
{ step: "Gabung low-code yang lebih powerful", weeks: "2-3 bulan", what: "Tambah skill: SQL dasar (karena Airtable/Bubble punya query), JavaScript dasar (custom logic di Bubble, Airtable script, Retool), API & webhook (bikin integrasi custom). Ini yang bedain senior no-code dari beginner." },
{ step: "Freelance di Upwork / Fiverr / Makerpad", weeks: "terus menerus", what: "Gig $500-5000 per project. Makerpad Experts, Zapier Experts directory, Bubble Agency Program. Bangun niche: automation untuk real estate, no-code MVP buat startup, dashboard internal." }
]
},
ar_vr: {
name: "AR / VR Developer",
tagline: "Bangun pengalaman buat headset kayak Vision Pro & Quest.",
whatYouDo: "Kamu bangun hal yang orang bisa masuk ke dalamnya — simulator latihan, game, rapat virtual, tool desain. Bidang muda yang seru.",
dayInLife: ["Bangun interaksi baru buat app VR.", "Tes dengan pasang headset beneran (sering).", "Optimasi — VR butuh 90+ frame/detik biar nggak bikin mual.", "Kolaborasi sama artis 3D."],
roadmap: [
{ step: "Unity + C#", weeks: "3 bulan", what: "Unity engine: scene, GameObject, component, prefab, script C# (MonoBehaviour, Update, Start), animation, UI, physics. C#: OOP, event, coroutine, async. Unity paling populer buat VR; alternatif Unreal (C++, visual lebih keren)." },
{ step: "Matematika 3D", weeks: "1-2 bulan", what: "Vektor 3D, matriks transformasi, rotasi (Euler, Quaternion — penting!), dot/cross product, raycasting, kolisi. Book: 3D Math Primer for Graphics and Game Development." },
{ step: "XR development", weeks: "2-3 bulan", what: "XR Interaction Toolkit (Unity), OpenXR standar, Meta XR SDK buat Quest, ARKit (iOS) / ARCore (Android) buat mobile AR. Pelajari: hand tracking, eye tracking, passthrough, anchor, spatial mapping." },
{ step: "Bikin demo VR", weeks: "2-3 bulan", what: "Bahkan di Quest 3 / Quest 2 (termurah). Demo ide: escape room, simulator latihan, galeri seni, tool edukasi. Fokus: interaksi natural, performance (90 FPS wajib), nggak bikin mual (teleport vs smooth locomotion)." },
{ step: "Spesialisasi", weeks: "6+ bulan", what: "Pilih: WebXR (VR di browser via three.js + WebXR API), Vision Pro (visionOS + SwiftUI), Unreal buat visual AAA, enterprise XR (training industri), AR mobile. Tiap platform punya ekosistem beda." }
]
},
bi: {
name: "Business Intelligence Analyst",
tagline: "Bangun dashboard & laporan yang jalanin bisnis.",
whatYouDo: "Tiap eksekutif cek dashboard buat nentuin hal. Kamu bangun dashboard itu. Lebih sedikit matematika berat, lebih banyak bisnis.",
dayInLife: ["Bangun dashboard yang CEO cek harian.", "Investigasi angka yang kelihatan aneh.", "Latih manajer baca dashboard sendiri.", "Bersihin sumber data berantakan."],
roadmap: [
{ step: "Jago Excel", weeks: "1-2 bulan", what: "Rumus lanjut (INDEX/MATCH, XLOOKUP, SUMIFS), pivot table, Power Query (transformasi data), Power Pivot (data model), VBA dasar (opsional), chart yang efektif. Masih tool data paling dipakai dunia." },
{ step: "SQL mendalam", weeks: "1-2 bulan", what: "Wajib buat peran ini. JOIN, CTE, window function, aggregation, date function, performance tuning dasar. Latihan di StrataScratch, DataLemur." },
{ step: "Pilih satu tool BI", weeks: "2 bulan", what: "Power BI (dominan di enterprise Microsoft, DAX language), Tableau (visualisasi terbaik, perusahaan besar), atau Looker/LookML (Google ekosistem). Pelajari: data modeling, measure, calculated column, filter, dashboard interaktif." },
{ step: "Data warehouse & ETL dasar", weeks: "1-2 bulan", what: "Konsep: star schema, fact vs dimension table, slowly changing dimension. Tool: dbt (transformasi SQL modern), Airflow (orkestrasi), Snowflake/BigQuery/Redshift (warehouse). Paham pipeline dari source → warehouse → BI." },
{ step: "Bangun 3 dashboard publik", weeks: "1-2 bulan", what: "Dari dataset publik (Kaggle, data.gov, Our World in Data). Tema: ekonomi, olahraga, iklim, crypto. Tulis case study: pertanyaan → data → insight. Upload ke Tableau Public / Power BI, bagi di LinkedIn." }
]
},
seo: {
name: "Technical SEO Specialist",
tagline: "Bikin website muncul pertama di Google. Setengah marketing, setengah engineering.",
whatYouDo: "Kamu bantu website peringkat lebih tinggi di Google — perbaiki halaman lambat, link rusak, tag, struktur konten. Banyak tech + psikologi.",
dayInLife: ["Audit situs klien & temuin 20 link rusak.", "Cek apa yang peringkatnya bagus buat keyword target.", "Tulis laporan buat tim marketing.", "Perbaiki masalah teknis sama tim dev."],
roadmap: [
{ step: "HTML dasar + cara kerja Google", weeks: "1 bulan", what: "HTML (meta tag, heading, schema markup JSON-LD), robots.txt, sitemap XML, canonical, hreflang. Cara Google index: crawl → render → index → rank. Core Web Vitals (LCP, CLS, INP). Mobile-first indexing." },
{ step: "Kursus SEO gratis (Ahrefs, Moz, Semrush)", weeks: "2 bulan", what: "Ahrefs Academy & Moz Beginner's Guide (gratis, kualitas tinggi). Topik: keyword research, on-page optimization, link building, technical SEO, local SEO, content strategy, E-E-A-T." },
{ step: "Tool SEO", weeks: "1 bulan", what: "Google Search Console (wajib), Google Analytics 4, Ahrefs/Semrush (berbayar tapi coba trial), Screaming Frog (crawler desktop, gratis limit 500 URL), PageSpeed Insights, Lighthouse. Belajar baca log server." },
{ step: "Kerja di situsmu sendiri", weeks: "3+ bulan", what: "Bikin blog niche (hobi atau bidangmu), tulis 20-30 artikel dengan target keyword jelas, optimasi on-page, bangun 5-10 backlink natural. Peringkatin punyamu dulu — pengalaman nyata yang portable." },
{ step: "Freelance UKM + spesialisasi", weeks: "bervariasi", what: "Mulai dari UKM lokal (UMKM, restoran, dokter, pengacara) — butuh SEO tapi belum punya tim. Spesialisasi: SEO programmatic, ecommerce SEO (Shopify), SaaS SEO, SEO internasional." }
]
}
};
// Category localization
const CAT_I18N = {
en: {
"Building things": "Building things",
"Data & AI": "Data & AI",
"Security & infrastructure": "Security & infrastructure",
"Creative & design": "Creative & design"
},
id: {
"Building things": "Membangun sesuatu",
"Data & AI": "Data & AI",
"Security & infrastructure": "Keamanan & infrastruktur",
"Creative & design": "Kreatif & desain"
}
};
// Glossary translations
const GLOSSARY_ID = {
"HTML": "Bahasa buat bikin kerangka halaman web — heading, paragraf, gambar, tombol.",
"CSS": "Bahasa buat styling halaman web — warna, font, layout, animasi.",
"JavaScript": "Bahasa pemrograman utama di browser. Bikin halaman jadi interaktif.",
"TypeScript": "JavaScript plus sistem tipe. Nangkep bug sebelum jalan.",
"DOM": "Struktur pohon elemen halaman yang JS bisa ubah.",
"API": "Cara dua program saling ngobrol. Kayak pelayan antara kamu dan dapur.",
"REST": "Gaya populer bikin API — pakai URL & metode HTTP (GET, POST, dll).",
"JSON": "Format teks buat kirim data struktural antara program.",
"fetch": "Fungsi JS buat ambil data dari server (API call).",
"async": "Kode yang nunggu sesuatu (API, file) tanpa nge-block program.",
"React": "Framework JS paling populer buat bikin UI interaktif.",
"Flexbox": "Sistem layout CSS modern buat atur elemen 1 dimensi.",
"Grid": "Sistem layout CSS buat atur elemen 2 dimensi (baris + kolom).",
"Tailwind CSS": "Framework CSS yang pakai class kecil (utility) buat styling cepat.",
"Vite": "Tool build super cepat buat project frontend modern.",
"ESLint": "Tool yang cek kode JS kamu ada masalah apa nggak.",
"Vercel": "Platform hosting web modern, favorit frontend dev. Gratis buat mulai.",
"Netlify": "Platform hosting web mirip Vercel — gratis buat project personal.",
"WebSocket": "Koneksi dua arah realtime antara browser & server. Buat chat, notifikasi.",
"framework": "Toolkit siap-pakai yang ngurusin setup membosankan biar kamu fokus ke ide.",
"Python": "Bahasa pemrograman ramah pemula, populer buat data & backend.",
"FastAPI": "Framework Python modern buat bikin API cepat.",
"Flask": "Framework Python kecil & sederhana buat web.",
"Node.js": "JavaScript di luar browser — buat server, CLI, otomasi.",
"Express": "Framework web Node.js paling populer.",
"Go": "Bahasa cepat dari Google, favorit buat backend skala besar.",
"ORM": "Tool yang translate kode ke SQL — nggak perlu tulis SQL mentah.",
"JWT": "Token login berupa string. Simpan di browser buat akses selanjutnya.",
"OAuth": "Standar login sosial (Google, Facebook, dll).",
"bcrypt": "Algoritma hashing password yang aman.",
"CORS": "Aturan browser yang batasin website panggil API dari domain lain.",
"middleware": "Lapisan kode yang jalan antara request masuk & response keluar.",
"SQL": "Bahasa buat nanya ke database. Diucapin 'sekuel'.",
"database": "Spreadsheet raksasa & rapi tempat app nyimpan data.",
"PostgreSQL": "Database SQL gratis & powerful. Standar industri modern.",
"MySQL": "Database SQL populer, dipakai dari blog kecil sampai Facebook.",
"MongoDB": "Database NoSQL berbasis dokumen JSON.",
"Redis": "Database super cepat di RAM. Buat cache & antrian.",
"NoSQL": "Database yang nggak pakai tabel SQL klasik — buat data fleksibel.",
"SQLite": "Database kecil yang simpan di 1 file. Populer di mobile app.",
"index": "Struktur yang bikin query database jauh lebih cepat.",
"CTE": "Query SQL sementara yang bantu tulis query kompleks.",
"window function": "Fungsi SQL yang hitung sesuatu per baris + konteks sekitarnya.",
"Swift": "Bahasa resmi Apple buat iPhone, iPad, Mac.",
"Kotlin": "Bahasa modern buat Android, menggantikan Java.",
"Flutter": "Framework Google buat bikin 1 app yang jalan di iOS & Android.",
"Dart": "Bahasa yang dipakai Flutter.",
"React Native": "Framework bikin mobile app pakai JavaScript/React.",
"Xcode": "IDE (editor kode) resmi Apple buat bikin iOS app. Cuma di Mac.",
"Android Studio": "IDE resmi Google buat bikin Android app.",
"Firebase": "Backend instant dari Google — database, login, storage, notifikasi.",
"Git": "Mesin waktu buat kode. Simpan versi & kerja bareng tim.",
"GitHub": "Layanan hosting Git — tempat kode disimpan & tim kolaborasi.",
"GitLab": "Alternatif GitHub, sering dipakai di perusahaan besar.",
"Linux": "Sistem operasi gratis yang jalanin kebanyakan server di internet.",
"Docker": "Cara ngemas app + semua yang dibutuhin jadi kotak portable.",
"Kubernetes": "Sistem yang jalanin banyak kotak Docker sekaligus & restart kalau crash.",
"VPN": "Tunnel privat di internet. Buat keamanan & akses jaringan kerja.",
"SSH": "Cara login ke server dari terminal dengan aman.",
"cron": "Penjadwal tugas di Linux — jalankan script otomatis tiap jam/hari.",
"pull request": "Cara ngajuin perubahan kode. Teman review sebelum diterima.",
"CI/CD": "Otomatisasi test + deploy kode tiap kali ada perubahan.",
"GitHub Actions": "Tool CI/CD yang tertanam di GitHub — otomatisasi workflow.",
"Terraform": "Tool yang definisi server cloud pakai kode, bukan klik manual.",
"Ansible": "Tool otomasi konfigurasi banyak server sekaligus.",
"AWS": "Amazon Web Services — penyedia cloud terbesar.",
"Azure": "Penyedia cloud dari Microsoft.",
"GCP": "Google Cloud Platform — penyedia cloud dari Google.",
"EC2": "Layanan AWS buat sewa server virtual.",
"S3": "Layanan AWS buat simpan file (gambar, video, backup).",
"VPC": "Jaringan virtual privat kamu di cloud AWS.",
"IAM": "Sistem akses AWS — atur siapa bisa apa.",
"Prometheus": "Tool monitoring metrik server & aplikasi.",
"Grafana": "Tool bikin dashboard dari metrik — grafik real-time cantik.",
"TCP/IP": "Protokol dasar yang bikin internet jalan.",
"DNS": "Sistem yang translate nama domain (google.com) jadi alamat IP.",
"DHCP": "Protokol yang kasih alamat IP otomatis ke device.",
"NAT": "Teknik router bagi 1 IP publik ke banyak device privat.",
"subnet": "Pembagian jaringan jadi bagian-bagian lebih kecil.",
"VLAN": "Jaringan virtual yang pisahin lalu lintas di switch fisik sama.",
"firewall": "Penjaga yang izinin/blokir lalu lintas jaringan berdasar aturan.",
"Wireshark": "Tool buat lihat & analisis paket jaringan secara detail.",
"nmap": "Tool buat scan port terbuka di server/jaringan.",
"OWASP": "Organisasi security web — bikin daftar kerentanan paling umum.",
"SQL injection": "Serangan di mana hacker selipin SQL ke input form.",
"XSS": "Cross-Site Scripting — hacker selipin JS jahat ke halaman web.",
"CSRF": "Serangan yang tipu user ngirim request yang dia nggak mau.",
"TLS": "Enkripsi yang bikin HTTPS aman. Pengganti SSL lama.",
"hash": "Ubah data jadi string pendek yang nggak bisa dibalik. Buat password.",
"Metasploit": "Framework hacking ethical — koleksi exploit siap pakai.",
"Burp Suite": "Tool favorit pentester buat nge-hack web app.",
"CTF": "Capture The Flag — kompetisi hacking di lingkungan legal.",
"OSCP": "Sertifikasi pentest paling dihormati, ujiannya praktek 24 jam.",
"CompTIA": "Organisasi sertifikasi IT paling populer (A+, Network+, Security+).",
"pandas": "Library Python paling populer buat olah data tabel.",
"numpy": "Library Python buat angka, matriks, kalkulasi cepat.",
"Jupyter": "Notebook interaktif buat tulis kode + grafik + teks bareng.",
"machine learning": "Komputer belajar pola dari data tanpa diprogram eksplisit.",
"deep learning": "Machine learning pakai neural network berlapis-lapis.",
"neural network": "Model AI yang terinspirasi cara otak bekerja.",
"PyTorch": "Framework deep learning favorit peneliti & Meta.",
"TensorFlow": "Framework deep learning dari Google.",
"scikit-learn": "Library Python buat machine learning klasik.",
"Kaggle": "Platform kompetisi data science — gym buat data scientist.",
"Tableau": "Tool visualisasi data populer di perusahaan besar.",
"Power BI": "Tool visualisasi data dari Microsoft.",
"A/B testing": "Tes 2 versi (A vs B) buat lihat mana yang lebih baik.",
"MLOps": "Kerjaan membosankan tapi krusial buat jaga model AI tetap jalan di produksi.",
"LLM": "Large Language Model — AI kayak ChatGPT atau Claude.",
"RAG": "Retrieval-Augmented Generation — AI yang baca dokumen dulu sebelum jawab.",
"vector database": "Database khusus buat cari berdasar kemiripan makna.",
"embedding": "Ubah teks jadi angka-angka yang representasi maknanya.",
"LangChain": "Framework Python/JS buat chain prompt LLM jadi aplikasi.",
"fine-tuning": "Latih ulang model AI pakai data spesifik kamu.",
"Transformer": "Arsitektur neural network yang jadi dasar semua LLM modern.",
"YOLO": "Model deteksi objek cepat di gambar/video.",
"blockchain": "Buku catatan digital terdistribusi yang nggak bisa diubah.",
"Ethereum": "Blockchain paling populer buat smart contract & app.",
"Solidity": "Bahasa pemrograman buat smart contract Ethereum.",
"smart contract": "Kode yang jalan di blockchain. Nanganin uang atau aturan otomatis.",
"dApp": "'App terdesentralisasi' yang jalan di blockchain, bukan di server satu perusahaan.",
"NFT": "Token unik di blockchain — biasanya buat karya digital.",
"wallet": "Dompet digital yang simpan kunci privat & aset blockchain.",
"gas": "Biaya transaksi di Ethereum. Makin sibuk, makin mahal.",
"testnet": "Blockchain uji coba — pakai token palsu buat developer test.",
"Hardhat": "Framework developer paling populer buat Ethereum.",
"MetaMask": "Wallet crypto paling populer, ekstensi browser.",
"C": "Bahasa pemrograman tua tapi masih wajib buat hardware & sistem.",
"C++": "C yang ditambah OOP. Standar buat audio, game engine, sistem berat.",
"C#": "Bahasa Microsoft, populer di Unity & aplikasi Windows.",
"Arduino": "Microcontroller murah & ramah pemula buat belajar elektronika.",
"Raspberry Pi": "Komputer kecil seukuran kartu kredit, harga terjangkau.",
"ESP32": "Microcontroller murah dengan WiFi + Bluetooth bawaan.",
"GPIO": "Pin input/output di microcontroller — nyalain LED, baca tombol.",
"I2C": "Protokol komunikasi antara chip, pakai 2 kabel.",
"SPI": "Protokol komunikasi antara chip, lebih cepat dari I2C.",
"UART": "Protokol komunikasi serial klasik antara chip/komputer.",
"PCB": "Printed Circuit Board — papan sirkuit cetak.",
"KiCad": "Software gratis buat desain PCB.",
"ROS": "Robot Operating System — framework standar buat program robot.",
"OpenCV": "Library populer buat computer vision (proses gambar/video).",
"SLAM": "Teknik robot sambil bergerak sambil bikin peta lingkungan.",
"PID": "Algoritma kontrol klasik — bikin sistem stabil (suhu, motor, drone).",
"Kalman filter": "Algoritma filter noise dari sensor, estimasi state akurat.",
"IMU": "Sensor yang baca akselerasi + rotasi. Di tiap HP & drone.",
"LiDAR": "Sensor laser yang ukur jarak 3D — buat self-driving & robot.",
"JUCE": "Framework paling umum buat bikin plugin audio.",
"DSP": "Digital Signal Processing — pemrosesan audio/sinyal pakai matematika.",
"VST": "Format plugin audio paling populer di DAW.",
"FFT": "Algoritma cepat ubah audio dari waktu ke frekuensi. Dasar DSP.",
"ADSR": "Attack Decay Sustain Release — bentuk envelope suara di synth.",
"p5.js": "Library JS ramah pemula buat bikin seni visual pakai kode.",
"Three.js": "Library JS buat bikin grafis 3D di browser.",
"GLSL": "Bahasa shader — program yang jalan di GPU buat efek visual.",
"shader": "Program kecil di GPU yang atur warna tiap pixel.",
"WebGL": "API browser buat grafis 3D akselerasi GPU.",
"Unity": "Engine game paling populer, pakai C#. Standar industri.",
"Unreal": "Engine game high-end dari Epic, pakai C++.",
"Godot": "Engine game gratis & open source, ramah pemula.",
"itch.io": "Platform rilis game indie, favorit developer kecil.",
"Zapier": "Tool no-code buat connect app (Gmail → Slack, dll).",
"Airtable": "Spreadsheet + database hybrid, base buat no-code app.",
"Bubble": "Platform no-code buat bangun web app lengkap.",
"Webflow": "Platform no-code buat bikin website profesional.",
"webhook": "URL yang auto-dipanggil app lain saat ada event. Lem integrasi modern.",
"Figma": "Tool desain UI favorit industri, jalan di browser.",
"WCAG": "Standar aksesibilitas web — biar semua orang bisa pakai.",
"design system": "Kumpulan komponen + aturan desain yang konsisten.",
"IDE": "Integrated Development Environment — editor kode yang lengkap.",
"CLI": "Command Line Interface — pakai kode di terminal, bukan klik.",
"terminal": "Jendela teks tempat kamu ngetik perintah ke komputer.",
"open source": "Kode yang bebas dibaca & diubah siapa aja.",
"standup": "Rapat harian singkat di mana semua bilang lagi ngerjain apa.",
"sprint": "Periode kerja pendek (biasanya 2 minggu) di metodologi Agile.",
"Agile": "Cara kerja tim software yang fleksibel & iteratif.",
"Scrum": "Kerangka kerja Agile paling populer — punya sprint, standup, dll.",
"MVP": "Minimum Viable Product — versi paling kecil yang berguna buat tes ide.",
"cert": "Singkatan dari sertifikasi — tes lulus yang buktiin kamu paham.",
"frontend": "Bagian website/app yang bisa kamu lihat & klik.",
"backend": "Mesin tak kasat mata yang jalan di balik website/app.",
"CDN": "Content Delivery Network — jaringan server yang kirim file cepat ke user global.",
"load balancer": "Pembagi trafik — kirim request ke beberapa server biar nggak ada yang kewalahan.",
"stack trace": "Jejak kesalahan yang nunjukin kode mana yang crash.",
"endpoint": "Alamat URL API (contoh: /api/users) yang nanggepin request."
};
window.UI_STRINGS = UI_STRINGS;
window.QUIZ_I18N = QUIZ_I18N;
window.PATH_I18N_ID = PATH_I18N_ID;
window.CAT_I18N = CAT_I18N;
window.GLOSSARY_ID = GLOSSARY_ID;
// Helpers
window.T = function(lang) {
return window.UI_STRINGS[lang] || window.UI_STRINGS.en;
};
// Returns a path with translated text if lang='id', else original
window.localizePath = function(path, lang) {
if (lang === 'id' && window.PATH_I18N_ID[path.id]) {
const tr = window.PATH_I18N_ID[path.id];
return { ...path, ...tr };
}
return path;
};
// Translated category label
window.localizeCat = function(cat, lang) {
return (window.CAT_I18N[lang] && window.CAT_I18N[lang][cat]) || cat;
};
// Swap glossary
window.applyGlossary = function(lang) {
if (lang === 'id') {
window.GLOSSARY = window.GLOSSARY_ID;
} else {
window.GLOSSARY = window.GLOSSARY_EN;
}
};
// Save original English glossary
if (!window.GLOSSARY_EN) window.GLOSSARY_EN = window.GLOSSARY;
