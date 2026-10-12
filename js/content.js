/*
 * All site content lives here. Both pages render from this file.
 *
 * To replace placeholders:
 *   - Text: edit the strings below.
 *   - Video: drop the file in assets/video/ and point `src` at it.
 *   - Photo or poster: drop the file in assets/img/ and point `poster` / `src` at it.
 * Optional fields left as '' are hidden on the page.
 */
window.TRIBUTE = {
  honoree: {
    name: 'Apostle Chidiebere Emmanuel Amanoh',
    nameLines: ['Apostle Chidiebere', 'Emmanuel Amanoh'], // hero line breaks
    initials: 'ACE'
  },

  occasion: {
    greeting: 'Happy birthday',
    date: '',            // e.g. '14 November 2026'. Hidden while empty.
    church: '',          // e.g. the church name. Hidden while empty.
    yearsInMinistry: '', // e.g. '25'. Hidden while empty.
    year: '2026'
  },

  hero: {
    line: 'One life, told by the people it changed.',
    video: 'assets/video/hero.mp4',
    poster: 'assets/img/hero-poster.jpg',
    film: { src: 'assets/video/opening-film.mp4', poster: 'assets/img/opening-film-poster.jpg', title: 'The opening film' }
  },

  story: {
    heading: 'We could tell your story in dates and titles. We would rather let the people tell it.'
  },

  /*
   * Titles use two marks: *word* sets an accent word, and | splits the title into a
   * lead part and a key part. How each is drawn depends on the type treatment in css/styles.css.
   *
   * Chapters appear on the home page in this order.
   * layout: 'panel'  full-screen video, text bottom left, more videos alongside, one written testimony after
   *         'center' full-screen video, text centred, three written testimonies after
   *         'split'  video on one half, text and one written testimony on the other (flip: true swaps sides)
   */
  chapters: [
    { id: 'home', label: 'Home', title: 'The ones who call *you* | theirs',
      intro: 'Long before the pulpit, there was a front door. The first voices belong to the people behind it.',
      layout: 'panel', video: 'assets/video/chapter-home.mp4', poster: 'assets/img/chapter-home-poster.jpg' },
    { id: 'raised', label: 'Sons and daughters', title: 'The ones *you* | raised',
      intro: 'You saw them before they saw themselves. They are leading now, and they have something to say about how that happened.',
      layout: 'split' },
    { id: 'house', label: 'The house', title: 'The ones *you* | shepherded',
      intro: 'A sermon lasts an hour. What it started in these lives is still going.',
      layout: 'center', video: 'assets/video/chapter-house.mp4', poster: 'assets/img/chapter-house-poster.jpg' },
    { id: 'next', label: 'Next generation', title: 'The ones *you* believed in | early',
      intro: 'You handed them real responsibility while they were still young enough to be surprised by it.',
      layout: 'split', flip: true },
    { id: 'ministers', label: 'Fellow ministers', title: 'The ones who walked | beside *you*',
      intro: 'Some people know the title. These people know the work behind it.',
      layout: 'panel', flip: true, video: 'assets/video/chapter-ministers.mp4', poster: 'assets/img/chapter-ministers-poster.jpg' },
    { id: 'beyond', label: 'Beyond the walls', title: 'The ones *you* | reached',
      intro: 'Not everyone in this story has sat in a service. The impact got to them anyway.',
      layout: 'split' }
  ],

  /*
   * Testimonies. One line each.
   *   chapter:  a chapter id from the list above
   *   type:     'video' or 'text'
   *   featured: true on the one video that leads its chapter
   * Add as many as you collect; the "Every testimony" page shows them all.
   */
  testimonies: [
    // 01 Home
    { chapter: 'home', type: 'video', featured: true, name: 'Full Name', role: 'Relationship to Apostle', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-01.jpg' },
    { chapter: 'home', type: 'video', name: 'Full Name', role: 'Relationship to Apostle', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-02.jpg' },
    { chapter: 'home', type: 'video', name: 'Full Name', role: 'Relationship to Apostle', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-03.jpg' },
    { chapter: 'home', type: 'video', name: 'Full Name', role: 'Relationship to Apostle', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-04.jpg' },
    { chapter: 'home', type: 'text', name: 'Full Name', role: 'Relationship to Apostle', quote: 'Placeholder. A moment at home that nobody at church gets to see, told in two or three sentences.' },
    { chapter: 'home', type: 'text', name: 'Full Name', role: 'Relationship to Apostle', quote: 'Placeholder. What you are like when the microphone is off.' },
    { chapter: 'home', type: 'text', name: 'Full Name', role: 'Relationship to Apostle', quote: 'Placeholder. The thing you taught us at the dinner table that we still live by.' },

    // 02 Sons and daughters
    { chapter: 'raised', type: 'video', featured: true, name: 'Full Name', role: 'Role or ministry', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-05.jpg' },
    { chapter: 'raised', type: 'video', name: 'Full Name', role: 'Role or ministry', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-06.jpg' },
    { chapter: 'raised', type: 'video', name: 'Full Name', role: 'Role or ministry', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-01.jpg' },
    { chapter: 'raised', type: 'video', name: 'Full Name', role: 'Role or ministry', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-02.jpg' },
    { chapter: 'raised', type: 'text', name: 'Full Name', role: 'Role or ministry', quote: 'Placeholder. What you saw in me before I saw it, and what I do today because of it.' },
    { chapter: 'raised', type: 'text', name: 'Full Name', role: 'Role or ministry', quote: 'Placeholder. The correction or instruction that changed my direction.' },
    { chapter: 'raised', type: 'text', name: 'Full Name', role: 'Role or ministry', quote: 'Placeholder. The first assignment you gave me, and what it made of me.' },

    // 03 The house
    { chapter: 'house', type: 'video', featured: true, name: 'Full Name', role: 'Member since year', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-03.jpg' },
    { chapter: 'house', type: 'video', name: 'Full Name', role: 'Member since year', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-04.jpg' },
    { chapter: 'house', type: 'video', name: 'Full Name', role: 'Member since year', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-05.jpg' },
    { chapter: 'house', type: 'video', name: 'Full Name', role: 'Member since year', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-06.jpg' },
    { chapter: 'house', type: 'text', name: 'Full Name', role: 'Member since year', quote: 'Placeholder. The season I was in, the word or visit that met me there, and where I am now.' },
    { chapter: 'house', type: 'text', name: 'Full Name', role: 'Member since year', quote: 'Placeholder. One sermon, one sentence, and what it set in motion.' },
    { chapter: 'house', type: 'text', name: 'Full Name', role: 'Member since year', quote: 'Placeholder. What I was praying for, and how you stood with me until it came.' },

    // 04 Next generation
    { chapter: 'next', type: 'video', featured: true, name: 'Full Name', role: 'Youth, campus or teens', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-02.jpg' },
    { chapter: 'next', type: 'video', name: 'Full Name', role: 'Youth, campus or teens', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-01.jpg' },
    { chapter: 'next', type: 'video', name: 'Full Name', role: 'Youth, campus or teens', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-06.jpg' },
    { chapter: 'next', type: 'video', name: 'Full Name', role: 'Youth, campus or teens', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-03.jpg' },
    { chapter: 'next', type: 'text', name: 'Full Name', role: 'Youth, campus or teens', quote: 'Placeholder. The first time you trusted me with something real.' },
    { chapter: 'next', type: 'text', name: 'Full Name', role: 'Youth, campus or teens', quote: 'Placeholder. What I believed about my future before, and what I believe now.' },
    { chapter: 'next', type: 'text', name: 'Full Name', role: 'Youth, campus or teens', quote: 'Placeholder. The question you asked me that I am still answering.' },

    // 05 Fellow ministers
    { chapter: 'ministers', type: 'video', featured: true, name: 'Full Name', role: 'Title, ministry or church', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-04.jpg' },
    { chapter: 'ministers', type: 'video', name: 'Full Name', role: 'Title, ministry or church', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-05.jpg' },
    { chapter: 'ministers', type: 'video', name: 'Full Name', role: 'Title, ministry or church', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-02.jpg' },
    { chapter: 'ministers', type: 'video', name: 'Full Name', role: 'Title, ministry or church', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-01.jpg' },
    { chapter: 'ministers', type: 'text', name: 'Full Name', role: 'Title, ministry or church', quote: 'Placeholder. One story that shows what it is like to serve next to you.' },
    { chapter: 'ministers', type: 'text', name: 'Full Name', role: 'Title, ministry or church', quote: 'Placeholder. Something you did when nobody was watching.' },
    { chapter: 'ministers', type: 'text', name: 'Full Name', role: 'Title, ministry or church', quote: 'Placeholder. The counsel you gave me that I now give to others.' },

    // 06 Beyond the walls
    { chapter: 'beyond', type: 'video', featured: true, name: 'Full Name', role: 'Neighbour, beneficiary or partner', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-06.jpg' },
    { chapter: 'beyond', type: 'video', name: 'Full Name', role: 'Neighbour, beneficiary or partner', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-03.jpg' },
    { chapter: 'beyond', type: 'video', name: 'Full Name', role: 'Neighbour, beneficiary or partner', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-04.jpg' },
    { chapter: 'beyond', type: 'video', name: 'Full Name', role: 'Neighbour, beneficiary or partner', src: 'assets/video/testimony-placeholder.mp4', poster: 'assets/img/poster-05.jpg' },
    { chapter: 'beyond', type: 'text', name: 'Full Name', role: 'Neighbour, beneficiary or partner', quote: 'Placeholder. How your work reached someone who has never sat in the church.' },
    { chapter: 'beyond', type: 'text', name: 'Full Name', role: 'Neighbour, beneficiary or partner', quote: 'Placeholder. What changed in this community, in one concrete example.' },
    { chapter: 'beyond', type: 'text', name: 'Full Name', role: 'Neighbour, beneficiary or partner', quote: 'Placeholder. The help that arrived before we knew who sent it.' }
  ],

  /* "Through the years" strip, oldest first. */
  years: {
    heading: 'Through the years',
    photos: [
      { src: 'assets/img/years-01.jpg', caption: 'Earliest picture' },
      { src: 'assets/img/years-02.jpg', caption: 'First years of ministry' },
      { src: 'assets/img/years-03.jpg', caption: 'With family' },
      { src: 'assets/img/years-04.jpg', caption: 'With the congregation' },
      { src: 'assets/img/years-05.jpg', caption: 'This year' }
    ]
  },

  closing: {
    label: 'From all of us',
    heading: 'Happy birthday, | Apostle.',
    blessing: 'Placeholder. A closing blessing or scripture, two or three lines, spoken to Apostle by the whole church.',
    video: 'assets/video/closing.mp4',
    poster: 'assets/img/closing-poster.jpg'
  }
};
