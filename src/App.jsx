import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import endingLetter from "../assets/текст в конце.txt?raw";

const imageModules = import.meta.glob("../assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  import: "default",
});

const videoModules = import.meta.glob("../assets/**/*.{mp4,MP4}", {
  eager: true,
  import: "default",
});

const audioModules = import.meta.glob("../assets/**/*.{mp3,MP3}", {
  eager: true,
  import: "default",
});

const mediaName = (path) =>
  path
    .split("/")
    .at(-1)
    .replace(/\.[^.]+$/, "");

const makeSlug = (value) =>
  value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();

const images = Object.entries(imageModules)
  .map(([path, src]) => ({
    path,
    src,
    name: mediaName(path),
    slug: makeSlug(mediaName(path)),
  }))
  .sort((first, second) => first.path.localeCompare(second.path, "ru"));

const videos = Object.entries(videoModules)
  .map(([path, src]) => ({
    path,
    src,
    name: mediaName(path),
    slug: makeSlug(mediaName(path)),
  }))
  .sort((first, second) => first.path.localeCompare(second.path, "ru"));

const [song] = Object.values(audioModules);

const byToken = (token) => images.find((item) => item.slug.includes(token));
const byExact = (token) => images.find((item) => item.slug === token);
const hiddenPhotoSlugs = new Set([
  "спнятася боп",
  "нятик помог мне ни панятя сьто зя названия",
]);

const heroVisuals = [
  byExact("сямая кисивая девотя на планете"),
  byExact("ми с нятиком на квести тякие тыдысь тыдысь"),
  byExact("нюнефь"),
].filter(Boolean);

const storyMoments = [
  {
    title: "нась маленький минь",
    text: "ми в нем как сямие незьние и пусистие коти котоние гатови сипеть ня всех внягов, нядом с тобой казди день становится пусистим и пниятним как коти",
    image: byExact("ми"),
  },
  {
    title: "наси путесествия",
    text: "дям паседнее внемя я забуксявал но у нась биля сьтока савместних путесетсвий! ми дунятились абнимались и спонили изя всякой енюнди но все нявно пнядалзяли нась путь вмести",
    image: byExact("стоим фатаняфиниемся новакотни"),
  },
  {
    title: "игюнси меми и нась язик",
    text: "у нась есь сваи пниколи, сваи меми и свой язик котоние никто не паймет снянюзи а ням ат етава тока типлее",
    image: byExact("ее любимый мем"),
  },
  {
    title: "дазе в бытю ми питались иськать ханёсее",
    text: "дазе сямие абитие фатаняфии на нянене имеют невеняятний смисл, ми тякие смесюни и вседя иськали ханесее ва всем и станялись бить сясливи",
    image: byExact("нятик поменял мне абои на тененене"),
  },
].filter((item) => item.image);

const keepsakes = [
  {
    eyebrow: "самае натяло",
    title: "нася пеньвая пенеписька вкантакти)",
    image: byExact("первая переписка"),
  },
  {
    eyebrow: "канетя!",
    title: "дям у миня не панютинясь дастать канети из эпоксидки но зято тякое каньцо купини тибе в севкабель поньту!",
    image: byExact("кольцо из эпоксидки"),
  },
  {
    eyebrow: "афициальни дагавонь",
    title: "насе свидетельства а заклютении бняка!",
    image: byExact("свидетельство о браке"),
  },
].filter((item) => item.image);

const memeStrip = [
  byExact("нашел не отдам"),
  byExact("зяя низяя"),
  byExact("маняфт"),
  byExact("маняфт 2"),
  byExact("китинька в питине"),
].filter(Boolean);

const gallery = images.filter((item) => item.path.includes("пак совмесных фоток"));
const stormPhotos = images
  .filter((item) => item.slug.includes("узясти после потопа"))
  .sort((first, second) => first.path.localeCompare(second.path, "ru"));

const featuredImagePaths = new Set([
  ...heroVisuals.map((item) => item.path),
  ...storyMoments.map((item) => item.image.path),
  ...keepsakes.map((item) => item.image.path),
  ...memeStrip.map((item) => item.path),
  ...stormPhotos.map((item) => item.path),
  ...gallery.map((item) => item.path),
]);

const extraPhotos = images.filter((item) => !featuredImagePaths.has(item.path));
const visibleExtraPhotos = extraPhotos.filter((item) => !hiddenPhotoSlugs.has(item.slug));

const floatingNotes = [
  "ти моя сямая кисивая девотя",
  "ти лутик соньця",
  "ти и есть мой домик",
  "ти мой сямий родной нятик на сем белом свети",
];

const sectionMotion = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function App() {
  const [musicReady, setMusicReady] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const audioRef = useRef(null);

  const cleanedLetter = useMemo(
    () =>
      endingLetter
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" "),
    [],
  );

  useEffect(() => {
    if (gallery.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % gallery.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const startMusic = async () => {
    setMusicReady(true);

    if (!audioRef.current) {
      return;
    }

    try {
      await audioRef.current.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }

      return;
    }

    audioRef.current.pause();
    setMusicPlaying(false);
  };

  return (
    <main className="page-shell">
      <audio
        loop
        ref={audioRef}
        src={song}
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      <AnimatePresence>
        {!musicReady ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="intro-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="intro-card"
              initial={{ y: 32, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="eyebrow">Для моей самой родной души</span>
              <h1>Наша жизнь только начинается, а у нас уже такая история</h1>
              <p>
                Я хотел сделать что-то своими руками и решил сделать это для нас чтобы не забывать все что у нас было под
                нашу с тобой музыку) пожалуйста посмотри это
              </p>
              <button className="magic-button" onClick={startMusic} type="button">
                Открыть (со звуком)
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="hero">
        <div className="hero-copy">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Наша история
          </motion.span>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ delay: 0.25, duration: 0.85 }}
          >
            вмести ми сямие незьние и смесьние нятики на планити
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 28 }}
            transition={{ delay: 0.35, duration: 0.9 }}
          >
            в насей зизи било сьтока мнёга пниколав и смеха и незьностей, любви
            и падерзки. нядам с тябой я осюсяю себя как в сказке пницеси нягуси
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="hero-actions"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.45, duration: 0.85 }}
          >
            <button className="magic-button" onClick={toggleMusic} type="button">
              {musicPlaying ? "Пауза нашей песни" : "Включить нашу песню"}
            </button>
            <span className="status-pill">
              {musicPlaying ? "Сейчас играет наша музыка" : "Музыка ждет тебя"}
            </span>
          </motion.div>
        </div>

        <div className="hero-visuals">
          {heroVisuals.map((item, index) => (
            <motion.figure
              animate={{ opacity: 1, y: 0, rotate: index === 1 ? 4 : -5 }}
              className={`hero-photo hero-photo-${index + 1}`}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              key={item.path}
              transition={{ delay: 0.25 + index * 0.12, duration: 0.9 }}
            >
              <img alt={item.name} src={item.src} />
            </motion.figure>
          ))}

          <div className="lotus lotus-a" />
          <div className="lotus lotus-b" />
          <div className="crown-spark crown-a" />
          <div className="crown-spark crown-b" />
        </div>

        <div className="floating-notes">
          {floatingNotes.map((note, index) => (
            <motion.span
              animate={{ y: [0, -10, 0], opacity: [0.65, 1, 0.65] }}
              className="floating-note"
              key={note}
              transition={{
                duration: 5 + index,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {note}
            </motion.span>
          ))}
        </div>
      </section>

      <motion.section
        className="story-grid section-card"
        initial="hidden"
        variants={sectionMotion}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="show"
      >
        <div className="section-heading">
          <span className="eyebrow">нася зизь</span>
          <h2>немнозя пня нясь минь и как ми зивем</h2>
        </div>

        <div className="moments-grid">
          {storyMoments.map((item, index) => (
            <motion.article
              className="moment-card"
              initial={{ opacity: 0, y: 40 }}
              key={item.title}
              transition={{ delay: index * 0.08, duration: 0.75 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="moment-copy">
                <span className="count-label">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <img alt={item.title} src={item.image.src} />
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="carousel-section"
        initial="hidden"
        variants={sectionMotion}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="show"
      >
        <div className="section-heading">
          <span className="eyebrow">сями лутьси фотосет</span>
          <h2>тякие сисивие бобики здесь нам тотя нузя есе адин фотасеть</h2>
        </div>

        <div className="carousel-shell">
          <div
            className="carousel-track"
            style={{ transform: `translateX(calc(-${activeSlide} * (100% + 1.2rem)))` }}
          >
            {gallery.map((item, index) => (
              <article className="gallery-card" key={item.path}>
                <img alt={`Наша совместная фотография ${index + 1}`} src={item.src} />
                <div className="gallery-meta">
                  <strong>сями сисиви маменти в зизи</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="carousel-dots" role="tablist" aria-label="Переключение галереи">
            {gallery.map((item, index) => (
              <button
                aria-label={`Показать фотографию ${index + 1}`}
                className={index === activeSlide ? "active" : ""}
                key={item.path}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section-card keepsakes"
        initial="hidden"
        variants={sectionMotion}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="show"
      >
        <div className="section-heading">
          <span className="eyebrow">аньтефакти насей истонии</span>
          <h2>те сямие маменти катоние насвегдя с нями</h2>
        </div>

        <div className="keepsake-grid">
          {keepsakes.map((item) => (
            <article className="keepsake-card" key={item.title}>
              <img alt={item.title} src={item.image.src} />
              <div>
                <span className="eyebrow">{item.eyebrow}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="section-card meme-section"
        initial="hidden"
        variants={sectionMotion}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="show"
      >
        <div className="section-heading">
          <span className="eyebrow">наси пникольние маменти 
          </span>
          <h2>нася нюнёфь самая незняя и сямая кнютая в зизи ни у каво такой нетю</h2>
        </div>

        <div className="meme-strip">
          {memeStrip.map((item) => (
            <figure className="meme-card" key={item.path}>
              <img alt={item.name} src={item.src} />
            </figure>
          ))}
        </div>
      </motion.section>

      {stormPhotos.length ? (
        <motion.section
          className="section-card storm-section"
          initial="hidden"
          variants={sectionMotion}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="show"
        >
          <div className="section-heading">
            <span className="eyebrow">дазе тенезь сняни патоп</span>
            <h2>мы пнеадалеваем тнюднясти вмести</h2>
          </div>

          <div className="storm-grid">
            {stormPhotos.map((item, index) => (
              <motion.article
                className="storm-card"
                initial={{ opacity: 0, y: 28 }}
                key={item.path}
                transition={{ delay: index * 0.08, duration: 0.65 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img alt={item.name} src={item.src} />
                <div className="storm-copy">
                  <h3>{index === 0 ? "дазе кадя снёзя ми все нявно нядам" : "дазе сямие худсие маменти зизи ми мозем пняйти в двоем"}</h3>
                  <p>
                    невазя сьто пняисходит вакнюк, сямае вазяе бить вмести и ресять все пнябнеми саапся а не двигаця па адинотьке
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      ) : null}

      {visibleExtraPhotos.length ? (
        <motion.section
          className="section-card extra-photos-section"
        >
          <div className="section-heading">
            <span className="eyebrow">есе босе нясь в этям мине</span>
            <h2>все эти маменти далзни зить в насих седетях</h2>
          </div>

          <div className="extra-photos-grid">
            {visibleExtraPhotos.map((item, index) => (
              <motion.figure
                className="extra-photo-card"
                initial={{ opacity: 0, y: 24 }}
                key={item.path}
                transition={{ delay: index * 0.04, duration: 0.55 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img alt={item.name} src={item.src} />
                <figcaption>{item.name}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>
      ) : null}

      {videos.length ? (
        <motion.section
          className="section-card videos-section"
          initial="hidden"
          variants={sectionMotion}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="show"
        >
          <div className="section-heading">
            <span className="eyebrow">Кнюзётьки</span>
            <h2>какие зе ми сирнявки на кнюзётях)</h2>
          </div>

          <div className="video-grid">
            {videos.map((item) => (
              <article className="video-card" key={item.path}>
                <video controls playsInline preload="metadata" src={item.src} />
                <p>{item.name}</p>
              </article>
            ))}
          </div>
        </motion.section>
      ) : null}

      <motion.section
        className="letter-section"
        initial="hidden"
        variants={sectionMotion}
        viewport={{ once: true, amount: 0.15 }}
        whileInView="show"
      >
        <div className="letter-backdrop">
          <span className="eyebrow">Самое важное</span>
          <h2>Пожалуйста, прочитай это</h2>
          <div className="letter-body">
            <p>{cleanedLetter}</p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default App;
