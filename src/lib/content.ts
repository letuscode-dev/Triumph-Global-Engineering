import type {
  BlogPost,
  Faq,
  MediaItem,
  Project,
  Service,
  Stat,
  Testimonial,
} from "./types";

// Stable, royalty-free imagery (Unsplash) used as defaults. Replace any of
// these by uploading your own media through the Admin Dashboard / Cloudinary.
const IMG = {
  drillRig:
    "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=1200&q=80",
  borehole:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  pump: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  irrigation:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
  field:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  solar:
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
  solarRoof:
    "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80",
  water:
    "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=1200&q=80",
  survey:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  engineerTeam:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  hero: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1920&q=80",
};

export const SERVICES: Service[] = [
  {
    slug: "borehole-survey-and-siting",
    title: "Borehole Survey and Siting",
    shortTitle: "Survey & Siting",
    category: "borehole",
    icon: "Compass",
    excerpt:
      "Scientific water detection using geophysical surveys to pinpoint the highest-yielding drilling point on your property.",
    description:
      "Before any drilling begins, our qualified hydro-geologists conduct a professional geophysical survey of your site. Using electrical resistivity and magnetic survey equipment, we map underground water-bearing formations to identify the exact location with the strongest, most sustainable yield. Accurate siting dramatically reduces the risk of dry holes and saves you money on unnecessary drilling.",
    benefits: [
      "Reduces the risk of drilling a dry borehole",
      "Identifies the highest-yielding water point",
      "Estimates probable drilling depth and water table",
      "Detailed survey report for your records",
      "Saves money by avoiding misplaced drilling",
    ],
    process: [
      {
        step: "Site Assessment",
        detail: "We inspect your property and discuss your water requirements.",
      },
      {
        step: "Geophysical Survey",
        detail: "Resistivity and magnetic instruments scan for water-bearing fractures.",
      },
      {
        step: "Data Analysis",
        detail: "Our hydro-geologist interprets the readings to locate the best point.",
      },
      {
        step: "Survey Report",
        detail:
          "You receive a marked drilling point, recommended depth and yield estimate.",
      },
    ],
    image: IMG.survey,
    gallery: [IMG.survey, IMG.field, IMG.drillRig],
    keywords: ["Borehole Survey Zimbabwe", "Water Survey Harare", "Borehole Siting"],
  },
  {
    slug: "borehole-drilling-and-casing",
    title: "Borehole Drilling and Casing",
    shortTitle: "Drilling & Casing",
    category: "borehole",
    icon: "Drill",
    excerpt:
      "Professional borehole drilling and high-grade casing for domestic, agricultural, commercial and community water supply.",
    description:
      "Our modern drilling rigs and experienced crews drill clean, straight boreholes to the required depth through soil and rock. We install durable uPVC or steel casing and screens to protect the borehole, prevent collapse and ensure clean water flow for decades. Whether you need a domestic borehole or a high-capacity commercial well, we deliver reliable results on schedule.",
    benefits: [
      "Modern, well-maintained drilling rigs",
      "Durable certified casing and screening",
      "Domestic, agricultural and commercial capacity",
      "Clean, straight boreholes drilled to spec",
      "Fast turnaround and tidy site cleanup",
    ],
    process: [
      {
        step: "Mobilisation",
        detail: "Rig and crew are mobilised to your surveyed drilling point.",
      },
      {
        step: "Drilling",
        detail: "We drill through overburden and rock to the target depth.",
      },
      {
        step: "Casing & Screening",
        detail: "Quality casing and screens are installed to stabilise the hole.",
      },
      {
        step: "Development",
        detail: "The borehole is flushed and developed for clean, sediment-free water.",
      },
    ],
    image: IMG.drillRig,
    gallery: [IMG.drillRig, IMG.borehole, IMG.field],
    keywords: [
      "Borehole Drilling Zimbabwe",
      "Borehole Drilling Harare",
      "Borehole Casing",
    ],
  },
  {
    slug: "borehole-deepening",
    title: "Borehole Deepening",
    shortTitle: "Deepening",
    category: "borehole",
    icon: "ArrowDownToLine",
    excerpt:
      "Extend existing boreholes that have dried up or dropped in yield to reach deeper, more reliable water.",
    description:
      "When water tables drop or an existing borehole under-performs, deepening can restore and improve its yield without drilling a brand-new hole. We assess the current borehole, then deepen it safely to reach deeper aquifers — a cost-effective way to secure your water supply through dry seasons.",
    benefits: [
      "Restores yield in low-producing boreholes",
      "More affordable than drilling a new borehole",
      "Reaches deeper, more reliable aquifers",
      "Reduces seasonal water shortages",
      "Maximises your original drilling investment",
    ],
    process: [
      {
        step: "Inspection",
        detail: "We assess the existing borehole depth, casing and water level.",
      },
      {
        step: "Feasibility",
        detail: "We confirm deepening is viable and recommend a target depth.",
      },
      {
        step: "Deepening",
        detail: "The borehole is carefully drilled deeper to reach better water.",
      },
      { step: "Testing", detail: "Yield is re-tested to confirm the improvement." },
    ],
    image: IMG.borehole,
    gallery: [IMG.borehole, IMG.drillRig, IMG.water],
    keywords: ["Borehole Deepening Zimbabwe", "Borehole Deepening Harare"],
  },
  {
    slug: "borehole-capacity-testing",
    title: "Borehole Capacity Testing",
    shortTitle: "Capacity Testing",
    category: "borehole",
    icon: "Gauge",
    excerpt:
      "Accurate pumping tests to determine sustainable yield before you size a pump or plan irrigation.",
    description:
      "A capacity (yield) test measures exactly how much water your borehole can sustainably deliver. We perform controlled pumping tests and monitor water-level recovery to calculate the safe abstraction rate. This data is essential for correctly sizing your pump and designing irrigation or water-supply systems that won't over-draw the borehole.",
    benefits: [
      "Determines safe, sustainable yield",
      "Prevents over-pumping and pump damage",
      "Essential data for pump sizing",
      "Required for irrigation system design",
      "Professional yield certificate provided",
    ],
    process: [
      {
        step: "Setup",
        detail: "A test pump and water-level monitoring equipment are installed.",
      },
      {
        step: "Step Test",
        detail: "We pump at increasing rates to find the optimal output.",
      },
      {
        step: "Constant-Rate Test",
        detail: "Sustained pumping confirms long-term yield.",
      },
      {
        step: "Recovery & Report",
        detail: "Water-level recovery is logged and a yield certificate issued.",
      },
    ],
    image: IMG.water,
    gallery: [IMG.water, IMG.pump, IMG.borehole],
    keywords: ["Borehole Capacity Testing Zimbabwe", "Borehole Yield Test"],
  },
  {
    slug: "borehole-pump-installation",
    title: "Borehole Pump Installation",
    shortTitle: "Pump Installation",
    category: "borehole",
    icon: "Wrench",
    excerpt:
      "Supply and installation of submersible, solar and surface pumps, tanks, controls and reticulation.",
    description:
      "We supply and install the right pumping solution for your borehole — submersible pumps, solar pumping systems, surface pumps, storage tanks, control panels and complete water reticulation. Correctly sized pumps run efficiently, last longer and deliver reliable pressure to your home, farm or business.",
    benefits: [
      "Correctly sized for your borehole yield",
      "Solar, electric and surface pump options",
      "Tanks, tank-stands and reticulation supplied",
      "Energy-efficient, long-lasting systems",
      "Warranty-backed quality components",
    ],
    process: [
      {
        step: "Sizing",
        detail: "We match the pump to your yield, depth and water demand.",
      },
      {
        step: "Supply",
        detail: "Quality pumps, cabling, pipes and controls are supplied.",
      },
      {
        step: "Installation",
        detail: "The pump, rising main and electrics are professionally installed.",
      },
      {
        step: "Commissioning",
        detail: "We test pressure, flow and controls before handover.",
      },
    ],
    image: IMG.pump,
    gallery: [IMG.pump, IMG.solar, IMG.water],
    keywords: [
      "Borehole Pump Installation Zimbabwe",
      "Solar Pump Harare",
      "Submersible Pump",
    ],
  },
  {
    slug: "borehole-pump-retrieval",
    title: "Borehole Pump Retrieval (Fishing Out)",
    shortTitle: "Pump Retrieval",
    category: "borehole",
    icon: "ArrowUpFromLine",
    excerpt:
      "Specialist retrieval of stuck or dropped pumps, pipes and cables from your borehole — safely and quickly.",
    description:
      "When a pump, rising main or cable drops or becomes stuck in a borehole, specialist 'fishing out' equipment and experience are required. Our team safely retrieves dropped components without damaging your borehole, so it can be returned to service quickly and affordably.",
    benefits: [
      "Specialist fishing-out tools and expertise",
      "Avoids costly re-drilling",
      "Protects the borehole casing from damage",
      "Fast emergency response",
      "Pump can often be repaired and reinstalled",
    ],
    process: [
      { step: "Assessment", detail: "We determine what is stuck and at what depth." },
      {
        step: "Rigging",
        detail: "Appropriate fishing tools are deployed into the borehole.",
      },
      { step: "Retrieval", detail: "The lost equipment is carefully fished out." },
      {
        step: "Restoration",
        detail: "The borehole is cleaned and prepared for re-installation.",
      },
    ],
    image: IMG.borehole,
    gallery: [IMG.borehole, IMG.drillRig, IMG.pump],
    keywords: [
      "Borehole Pump Retrieval Zimbabwe",
      "Fishing Out Pump",
      "Stuck Pump Removal",
    ],
  },
  {
    slug: "irrigation-system-design-and-installation",
    title: "Irrigation System Design and Installation",
    shortTitle: "Irrigation Design",
    category: "irrigation",
    icon: "Droplets",
    excerpt:
      "Custom drip, sprinkler, centre-pivot and micro-irrigation systems engineered for maximum yield and water efficiency.",
    description:
      "We design and install complete irrigation systems tailored to your crop, soil, terrain and water source. From efficient drip and micro-irrigation for horticulture to sprinkler and centre-pivot systems for larger farms, our engineered solutions deliver water precisely where and when crops need it — boosting yields while conserving water and energy.",
    benefits: [
      "Custom-engineered for your crop and terrain",
      "Drip, sprinkler, micro and pivot options",
      "Significant water and energy savings",
      "Higher, more consistent crop yields",
      "Automation and fertigation ready",
    ],
    process: [
      {
        step: "Farm Survey",
        detail: "We assess your land, water source, soil and crop plan.",
      },
      {
        step: "System Design",
        detail: "A hydraulic design optimises coverage and efficiency.",
      },
      {
        step: "Installation",
        detail: "Pumps, mainlines, emitters and controls are installed.",
      },
      {
        step: "Training",
        detail: "We commission the system and train you on operation.",
      },
    ],
    image: IMG.irrigation,
    gallery: [IMG.irrigation, IMG.field, IMG.water],
    keywords: [
      "Irrigation Systems Zimbabwe",
      "Irrigation Design Zimbabwe",
      "Drip Irrigation Harare",
    ],
  },
  {
    slug: "irrigation-advisory-services",
    title: "Irrigation Advisory Services",
    shortTitle: "Irrigation Advisory",
    category: "irrigation",
    icon: "ClipboardList",
    excerpt:
      "Expert consulting on scheduling, water budgeting, system upgrades and efficiency audits for existing farms.",
    description:
      "Already farming but not getting the most from your water? Our irrigation advisory service provides expert guidance on scheduling, water budgeting, crop-water requirements, system audits and upgrades. We help you cut water and energy costs while improving crop performance — backed by sound agronomic and engineering principles.",
    benefits: [
      "Independent expert advice",
      "Water budgeting and scheduling plans",
      "Efficiency audits of existing systems",
      "Upgrade and expansion recommendations",
      "Lower water and energy running costs",
    ],
    process: [
      { step: "Consultation", detail: "We discuss your crops, goals and current setup." },
      {
        step: "Field Audit",
        detail: "We evaluate your system's efficiency and uniformity.",
      },
      {
        step: "Recommendations",
        detail: "You receive a practical action and scheduling plan.",
      },
      { step: "Follow-up", detail: "We support implementation and review results." },
    ],
    image: IMG.field,
    gallery: [IMG.field, IMG.irrigation, IMG.water],
    keywords: [
      "Irrigation Advisory Zimbabwe",
      "Irrigation Consulting",
      "Water Management Zimbabwe",
    ],
  },
  {
    slug: "solar-installations",
    title: "Solar Installations",
    shortTitle: "Solar",
    category: "solar",
    icon: "Sun",
    excerpt:
      "Solar power and solar water-pumping systems for homes, farms and businesses — reliable energy beyond the grid.",
    description:
      "Beat load-shedding and rising power costs with professionally installed solar systems. We design and install solar power systems for homes and businesses, plus dedicated solar borehole-pumping systems for farms and rural water supply. Our systems use quality panels, inverters and batteries, engineered and installed for safety, performance and long life.",
    benefits: [
      "Independence from load-shedding",
      "Lower long-term energy bills",
      "Solar borehole pumping for farms",
      "Home & business power with battery backup",
      "Quality components, professional installation",
    ],
    process: [
      { step: "Energy Audit", detail: "We assess your power or pumping needs." },
      {
        step: "System Design",
        detail: "Panels, inverter and storage are sized for your load.",
      },
      {
        step: "Installation",
        detail: "Certified technicians install and wire the system safely.",
      },
      {
        step: "Commissioning",
        detail: "We test, optimise and hand over your solar system.",
      },
    ],
    image: IMG.solar,
    gallery: [IMG.solar, IMG.solarRoof, IMG.pump],
    keywords: [
      "Solar Installations Zimbabwe",
      "Solar Pump Zimbabwe",
      "Solar Power Harare",
    ],
  },
];

export const STATS: Stat[] = [
  { label: "Projects Completed", value: 850, suffix: "+" },
  { label: "Years of Experience", value: 12, suffix: "+" },
  { label: "Happy Clients", value: 700, suffix: "+" },
  { label: "Districts Served", value: 40, suffix: "+" },
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "High-Yield Borehole — Borrowdale Farm",
    slug: "borrowdale-farm-borehole",
    category: "borehole",
    serviceType: "Borehole Drilling and Casing",
    location: "Borrowdale, Harare",
    completedAt: "2025-11-12",
    description:
      "Drilled and cased a 80m commercial borehole delivering 4,500 litres/hour for a horticultural operation, complete with development and yield testing.",
    cover: IMG.drillRig,
    images: [IMG.drillRig, IMG.borehole, IMG.field],
    featured: true,
  },
  {
    id: "p2",
    title: "5-Hectare Drip Irrigation — Mazowe",
    slug: "mazowe-drip-irrigation",
    category: "irrigation",
    serviceType: "Irrigation System Design and Installation",
    location: "Mazowe, Mashonaland Central",
    completedAt: "2025-09-30",
    description:
      "Designed and installed an automated drip irrigation system for a 5-hectare tomato and vegetable farm, cutting water use by 40%.",
    cover: IMG.irrigation,
    images: [IMG.irrigation, IMG.field, IMG.water],
    featured: true,
  },
  {
    id: "p3",
    title: "Solar Borehole Pumping — Bindura",
    slug: "bindura-solar-pump",
    category: "solar",
    serviceType: "Solar Installations",
    location: "Bindura, Mashonaland Central",
    completedAt: "2025-08-18",
    description:
      "Installed a 3kW solar pumping system feeding a 10,000L storage tank for a community water point — zero grid electricity required.",
    cover: IMG.solar,
    images: [IMG.solar, IMG.pump, IMG.solarRoof],
    featured: true,
  },
  {
    id: "p4",
    title: "Domestic Borehole & Pump — Chitungwiza",
    slug: "chitungwiza-domestic-borehole",
    category: "borehole",
    serviceType: "Borehole Pump Installation",
    location: "Chitungwiza, Harare",
    completedAt: "2025-07-05",
    description:
      "Complete domestic water solution: borehole drilling, submersible pump, 5,000L tank and household reticulation.",
    cover: IMG.pump,
    images: [IMG.pump, IMG.borehole, IMG.water],
    beforeImage: IMG.field,
    afterImage: IMG.water,
  },
  {
    id: "p5",
    title: "Borehole Deepening — Ruwa",
    slug: "ruwa-borehole-deepening",
    category: "borehole",
    serviceType: "Borehole Deepening",
    location: "Ruwa, Harare",
    completedAt: "2025-06-10",
    description:
      "Deepened a failing 45m borehole to 75m, restoring a reliable year-round water supply for a guesthouse.",
    cover: IMG.borehole,
    images: [IMG.borehole, IMG.drillRig, IMG.water],
  },
  {
    id: "p6",
    title: "Centre-Pivot Irrigation — Marondera",
    slug: "marondera-centre-pivot",
    category: "irrigation",
    serviceType: "Irrigation System Design and Installation",
    location: "Marondera, Mashonaland East",
    completedAt: "2025-05-22",
    description:
      "Engineered a centre-pivot irrigation system for a 20-hectare maize field with full pump and pipeline installation.",
    cover: IMG.field,
    images: [IMG.field, IMG.irrigation, IMG.water],
  },
  {
    id: "p7",
    title: "Home Solar & Battery Backup — Greendale",
    slug: "greendale-home-solar",
    category: "solar",
    serviceType: "Solar Installations",
    location: "Greendale, Harare",
    completedAt: "2025-04-14",
    description:
      "5kVA hybrid solar system with lithium battery backup keeping a family home powered through load-shedding.",
    cover: IMG.solarRoof,
    images: [IMG.solarRoof, IMG.solar],
  },
  {
    id: "p8",
    title: "Community Water Survey — Murewa",
    slug: "murewa-water-survey",
    category: "borehole",
    serviceType: "Borehole Survey and Siting",
    location: "Murewa, Mashonaland East",
    completedAt: "2025-03-02",
    description:
      "Geophysical survey identifying high-yield drilling points for a rural community water project.",
    cover: IMG.survey,
    images: [IMG.survey, IMG.field],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Tendai Moyo",
    role: "Commercial Farmer",
    location: "Mazowe",
    rating: 5,
    quote:
      "Triumph Global drilled our borehole and installed the drip system on our farm. Water use dropped and our tomato yields have never been better. Truly professional team.",
  },
  {
    id: "t2",
    name: "Rumbidzai Chikore",
    role: "Homeowner",
    location: "Borrowdale, Harare",
    rating: 5,
    quote:
      "From survey to pump installation, everything was handled professionally and on time. We finally have reliable water at home. Highly recommended!",
  },
  {
    id: "t3",
    name: "James Ncube",
    role: "Guesthouse Owner",
    location: "Ruwa",
    rating: 5,
    quote:
      "Our borehole had dried up. They deepened it and now we have water all year round. Fair pricing and excellent workmanship.",
  },
  {
    id: "t4",
    name: "Grace Dube",
    role: "Project Coordinator",
    location: "Bindura",
    rating: 5,
    quote:
      "The solar pumping system they installed for our community has been life-changing. No electricity bills and clean water every day.",
  },
];

export const FAQS: Faq[] = [
  {
    question: "How much does it cost to drill a borehole in Zimbabwe?",
    answer:
      "Borehole drilling cost depends on depth, ground formation and location. After a survey we provide a transparent, itemised quotation covering drilling, casing, pump and installation. Request a free quote and we will give you an accurate figure.",
  },
  {
    question: "Do I need a survey before drilling?",
    answer:
      "Yes — a professional geophysical survey greatly improves the chance of hitting strong, sustainable water and helps avoid the cost of a dry hole. We strongly recommend it for every site.",
  },
  {
    question: "How long does borehole drilling take?",
    answer:
      "Most domestic boreholes are drilled and cased within one to two days once on site, depending on depth and ground conditions. Pump installation can usually follow shortly after.",
  },
  {
    question: "Can you install a solar-powered pump?",
    answer:
      "Absolutely. Solar pumping is one of our specialities — ideal for beating load-shedding and cutting running costs on farms, homes and community water points.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We are based in Harare and serve clients across Zimbabwe, including Mashonaland, the Midlands and beyond. Contact us to confirm coverage for your location.",
  },
  {
    question: "Do you offer warranties?",
    answer:
      "Yes. Our workmanship is guaranteed and all supplied pumps and solar components carry manufacturer warranties. We also offer maintenance and support packages.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-borehole-drilling-company-zimbabwe",
    title: "How to Choose a Borehole Drilling Company in Zimbabwe",
    category: "Borehole Drilling Tips",
    excerpt:
      "Drilling a borehole is a major investment. Here are the key things to check before choosing a drilling contractor in Zimbabwe.",
    content:
      "Drilling a borehole is a significant investment, so choosing the right contractor matters. Start by confirming the company conducts a proper geophysical survey before drilling — siting dramatically affects success.\n\nNext, ask about equipment and experience. Modern, well-maintained rigs and experienced crews drill cleaner, straighter boreholes. Request references and look at completed projects.\n\nFinally, insist on a transparent, itemised quotation covering drilling, casing, development, yield testing and pump installation, plus a workmanship guarantee. At Triumph Global Engineering we provide all of this as standard.",
    cover: IMG.drillRig,
    author: "Triumph Global Engineering",
    publishedAt: "2026-01-15",
    readMinutes: 5,
  },
  {
    slug: "save-water-with-drip-irrigation",
    title: "5 Ways Drip Irrigation Saves Water and Boosts Yields",
    category: "Irrigation Solutions",
    excerpt:
      "Drip irrigation delivers water straight to the roots. Discover how it can cut your water bill while increasing production.",
    content:
      "Drip irrigation applies water directly to the root zone, drop by drop, which makes it one of the most efficient irrigation methods available.\n\n1. Less evaporation: water goes to the roots, not the air. 2. Less weed growth: dry soil between rows. 3. Precise scheduling: apply exactly what crops need. 4. Fertigation: feed nutrients with water. 5. Higher, more uniform yields.\n\nA well-designed drip system can cut water use by 30–50% compared with flood irrigation. Talk to our team about designing a system for your farm.",
    cover: IMG.irrigation,
    author: "Triumph Global Engineering",
    publishedAt: "2026-02-02",
    readMinutes: 4,
  },
  {
    slug: "beat-load-shedding-with-solar-pumping",
    title: "Beat Load-Shedding with Solar Borehole Pumping",
    category: "Solar Energy",
    excerpt:
      "Solar pumping keeps water flowing even when the grid is down. Here is why farms and homes are switching to solar.",
    content:
      "Load-shedding makes grid-powered pumping unreliable and expensive. Solar borehole pumping uses the sun to lift water into your storage tank during the day — no electricity bill and no downtime.\n\nModern solar pump systems are reliable, low-maintenance and ideal for farms, homes and community water points. With a properly sized array and storage tank, you can have water on demand all year round.\n\nContact us for a free solar pumping assessment.",
    cover: IMG.solar,
    author: "Triumph Global Engineering",
    publishedAt: "2026-03-10",
    readMinutes: 4,
  },
  {
    slug: "signs-your-borehole-needs-deepening",
    title: "5 Signs Your Borehole Needs Deepening",
    category: "Water Management",
    excerpt:
      "Is your borehole producing less water than it used to? These warning signs mean it may be time to deepen.",
    content:
      "Boreholes can lose yield over time as water tables drop. Watch for these signs: the pump runs dry or cycles often; water pressure drops; the borehole only works for part of the year; sediment increases; or your water demand has grown.\n\nDeepening an existing borehole is usually far cheaper than drilling a new one and can reach deeper, more reliable aquifers. Book an inspection and we will advise whether deepening is right for you.",
    cover: IMG.borehole,
    author: "Triumph Global Engineering",
    publishedAt: "2026-04-01",
    readMinutes: 3,
  },
];

export const MEDIA: MediaItem[] = [
  {
    id: "m1",
    type: "image",
    src: IMG.drillRig,
    caption: "Drilling rig on site in Harare",
    category: "borehole",
  },
  {
    id: "m2",
    type: "image",
    src: IMG.borehole,
    caption: "Casing installation",
    category: "borehole",
  },
  {
    id: "m3",
    type: "image",
    src: IMG.pump,
    caption: "Submersible pump installation",
    category: "borehole",
  },
  {
    id: "m4",
    type: "image",
    src: IMG.irrigation,
    caption: "Drip irrigation lines",
    category: "irrigation",
  },
  {
    id: "m5",
    type: "image",
    src: IMG.field,
    caption: "Irrigated maize field",
    category: "irrigation",
  },
  {
    id: "m6",
    type: "image",
    src: IMG.solar,
    caption: "Solar array for pumping",
    category: "solar",
  },
  {
    id: "m7",
    type: "image",
    src: IMG.solarRoof,
    caption: "Rooftop solar installation",
    category: "solar",
  },
  {
    id: "m8",
    type: "image",
    src: IMG.water,
    caption: "Clean water flowing",
    category: "water",
  },
  {
    id: "m9",
    type: "image",
    src: IMG.survey,
    caption: "Geophysical survey equipment",
    category: "borehole",
  },
];

export const TEAM = [
  { name: "Engineering Director", role: "Hydro-Geology & Drilling", initials: "TG" },
  { name: "Irrigation Lead", role: "Agricultural Engineering", initials: "IR" },
  { name: "Solar Lead", role: "Renewable Energy Systems", initials: "SO" },
  { name: "Operations Manager", role: "Project Delivery", initials: "OP" },
];

export const VALUES = [
  {
    title: "Integrity",
    detail: "Honest advice and transparent pricing on every project.",
    icon: "ShieldCheck",
  },
  {
    title: "Quality",
    detail: "Engineered solutions built to last using trusted components.",
    icon: "Award",
  },
  {
    title: "Reliability",
    detail: "We deliver on time and stand behind our workmanship.",
    icon: "Clock",
  },
  {
    title: "Innovation",
    detail: "Modern equipment and smart, water-wise solutions.",
    icon: "Lightbulb",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  borehole: "Borehole & Water",
  irrigation: "Irrigation",
  solar: "Solar",
  water: "Water Solutions",
};
