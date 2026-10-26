/* =========================================================================
   SITE CONFIG — the only file you need to edit to add your video links.
   -------------------------------------------------------------------------
   • Paste a full YouTube link (watch, youtu.be or shorts) OR a Vimeo link
     into `video` for the reel and each project. Leave it "" until ready —
     the site then plays the short preview clip instead.
   • Replace `linkedin` with your real profile URL.
   ========================================================================= */
window.SITE = {
  name: "John Solomon",
  role: "Generative AI Artist & Colorist",
  email: "bjohnsolomon274@gmail.com",
  website: "www.johnsolomon.online",
  linkedin: "https://www.linkedin.com/in/your-profile/",   // ← replace with your LinkedIn URL
  cv: "assets/docs/John_Solomon_Resume.pdf",

  reel: {
    video: "https://youtu.be/LV8JD4fNiUc",
    preview: "assets/video/hero.mp4",            // silent background loop on the home screen
    poster: "assets/img/hero-poster.webp"
  },

  projects: [
    {
      id: "nippo",
      title: "Nippo BLDC Fan",
      type: "AI Product Film",
      for: "Nippo · TheCreativGrid",
      role: "AI generation · Edit · Colour grade",
      desc: "A premium product film for Nippo's BLDC fan — copper details, light reveals, exploded views and room-to-room lighting moods, generated shot by shot and finished in DaVinci Resolve.",
      production: [
        { label: "Frames & visual development", text: "Product reference frames established copper details, exploded views and distinct lighting moods." },
        { label: "Direction & camera", text: "Macro details, low-angle product reveals and smooth moves between room settings." },
        { label: "Prompt workflow", text: "Build the look in stills first, then direct and refine each video shot for product consistency." },
        { label: "Models & tools", text: "Seedance 2.5 · Kling · Magnific AI." },
        { label: "Edit & finish", text: "Edited and colour graded in DaVinci Resolve." }
      ],
      preview: "assets/video/nippo.mp4",
      poster: "assets/img/nippo.webp",
      video: "https://youtu.be/aCusyIgIr88"
    },
    {
      id: "notme",
      title: "Not Me",
      type: "AI Horror Short Film",
      for: "Personal project",
      role: "Story · Characters · Seedance 2.5 · Edit · Sound · Grade",
      desc: "A one-minute horror short about a man whose shadow walks away from him. Written, cast and shot entirely with AI — character sheets, location plates and Seedance 2.5 shots — then cut, sound-designed and graded.",
      production: [
        { label: "Frames & visual development", text: "Character sheets and location plates set the look before the shots were generated." },
        { label: "Direction & camera", text: "Tight, low-light frames build to a controlled reveal as the shadow separates from its owner." },
        { label: "Prompt workflow", text: "Use character and location references, then generate and refine the story beat by beat." },
        { label: "Models & tools", text: "Seedance 2.5 · Magnific AI." },
        { label: "Edit & finish", text: "Edited, sound-designed and graded." }
      ],
      preview: "assets/video/notme.mp4",
      poster: "assets/img/notme.webp",
      video: "https://youtu.be/1sJjOlutyWU"
    },
    {
      id: "soch",
      title: "Soch",
      type: "AI Fashion Film",
      for: "Soch",
      role: "AI generation · Edit",
      desc: "A vertical fashion film for Soch — warm courtyard light, printed co-ord sets and editorial poses, built for social.",
      production: [
        { label: "Frames & visual development", text: "Style frames set the printed co-ord looks, warm courtyard light and editorial mood." },
        { label: "Direction & camera", text: "Vertical tracking shots, close fabric details and slow editorial push-ins." },
        { label: "Prompt workflow", text: "Lock wardrobe and styling in reference frames, then generate short matching fashion shots." },
        { label: "Models & tools", text: "Seedance 2.0 · Kling · Magnific AI." },
        { label: "Edit & finish", text: "Edited for a vertical social format." }
      ],
      preview: "assets/video/soch.mp4",
      poster: "assets/img/soch.webp",
      video: "https://youtube.com/shorts/lfH4CD7yctU?feature=share"
    },
    {
      id: "jewellery",
      title: "Jewellery",
      type: "Jewellery Pitch Film",
      for: "Client pitch",
      role: "Concept · AI generation · Edit · Grade",
      desc: "A temple-heritage jewellery film made to pitch the studio — dawn over carved stone, temple elephants, silk and gold in close-up.",
      production: [
        { label: "Frames & visual development", text: "Reference frames shaped the dawn temple setting, carved stone, silk and gold details." },
        { label: "Direction & camera", text: "Low-angle temple wides lead into slow macro views of jewellery and silk." },
        { label: "Prompt workflow", text: "Establish the heritage palette in stills, then build a sequence from location to product close-up." },
        { label: "Models & tools", text: "Seedance 2.5 · Kling · Magnific AI." },
        { label: "Edit & finish", text: "Edited and graded as a studio pitch film." }
      ],
      preview: "assets/video/jewellery.mp4",
      poster: "assets/img/jewellery.webp",
      video: "https://youtu.be/1IPCikZWKE0"
    },
    {
      id: "urban",
      title: "Urban Rise",
      type: "Real Estate Pitch Film",
      for: "Urban Rise · Bangalore",
      role: "Concept · AI generation · Edit · Grade",
      desc: "From cracked, drought-struck earth to a green, water-rich city — a pitch film for a Bangalore real-estate developer.",
      production: [
        { label: "Frames & visual development", text: "Keyframes mapped the shift from cracked earth to a green, water-rich city." },
        { label: "Direction & camera", text: "Wide establishing views and aerial-style transitions carry the change in landscape." },
        { label: "Prompt workflow", text: "Create matching start and end frames, then generate transition shots to connect the environments." },
        { label: "Models & tools", text: "Seedance 2.5 · Kling · Magnific AI." },
        { label: "Edit & finish", text: "Edited and graded as a real-estate pitch film." }
      ],
      preview: "assets/video/urban.mp4",
      poster: "assets/img/urban.webp",
      video: "https://youtu.be/AMUgjYNr0wg"
    },
    {
      id: "fight",
      title: "Fight Sequence",
      type: "AI Action Sequence",
      for: "Personal project",
      role: "AI generation · Edit",
      desc: "A suit-up and street-fight sequence exploring how far AI video can push choreography, energy effects and camera movement.",
      production: [
        { label: "Frames & visual development", text: "Action frames map the suit-up, fight beats and energy-effect moments." },
        { label: "Direction & camera", text: "Low-angle tracking, quick reframes and impact close-ups drive the choreography." },
        { label: "Prompt workflow", text: "Break the action into short, readable beats and refine motion and camera movement shot by shot." },
        { label: "Models & tools", text: "Seedance 2.5 · Seedance 2.0 · Kling." },
        { label: "Edit & finish", text: "Edited as a continuous action sequence." }
      ],
      preview: "assets/video/fight.mp4",
      poster: "assets/img/fight.webp",
      video: "https://youtu.be/sAB4cs0HCSo"
    },
    {
      id: "home",
      title: "Home Interiors",
      type: "AI Animated Ad",
      for: "Social ad",
      role: "AI generation · Edit",
      desc: "A playful animated ad for home interiors — a couple, a renovation gone wrong, and the fix. Made for vertical social.",
      production: [
        { label: "Frames & visual development", text: "Story frames define the couple, interior, renovation mishap and final reveal." },
        { label: "Direction & camera", text: "Vertical room wides and medium two-shots keep the renovation story easy to follow." },
        { label: "Prompt workflow", text: "Generate the story in clear beats, keeping the room and characters consistent from problem to fix." },
        { label: "Models & tools", text: "Seedance 2.0 · Kling · Magnific AI." },
        { label: "Edit & finish", text: "Edited for vertical social." }
      ],
      preview: "assets/video/home.mp4",
      poster: "assets/img/home.webp",
      video: "https://youtube.com/shorts/fadZ9q7EuU4?feature=share"
    }
  ]
};
