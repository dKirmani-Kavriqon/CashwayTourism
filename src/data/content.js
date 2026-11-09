// Editorial content. Facts here are general, public travel information about
// Kashmir (altitudes and distances are rounded and approximate). Nothing here
// is a KashWay price, package, review or statistic: those come from the client.

// ---------------------------------------------------------------------------
// Photography. `place` is only set when the photo really shows that place.
export const PHOTOS = {
  'dal-autumn': {
    alt: 'A red-canopied shikara on still, misty water under golden chinar leaves',
    caption: 'Autumn on Dal Lake, Srinagar',
    place: 'srinagar',
    tags: ['landscape', 'seasons'],
  },
  'gulmarg-gondola': {
    alt: 'A gondola cabin crossing above snow-laden pines and wooden huts, with white peaks behind',
    caption: 'The Gulmarg Gondola in winter',
    place: 'gulmarg',
    tags: ['landscape', 'adventure', 'seasons'],
  },
  'sonamarg-bridge': {
    alt: 'A snow-covered road leading through a bridge marked “Welcome to Sonamarg”',
    caption: 'The road into Sonamarg after snowfall',
    place: 'sonamarg',
    tags: ['landscape', 'seasons'],
  },
  houseboat: {
    alt: 'An ornately carved wooden houseboat with arched windows, a boatman resting at its door',
    caption: 'Carved cedar on a Kashmiri houseboat',
    place: 'srinagar',
    tags: ['culture', 'stays'],
  },
  'high-meadow': {
    alt: 'Sheep grazing a green slope with wild violets beneath a ridge of folded grey rock',
    caption: 'Summer grazing in the high pastures',
    place: null,
    tags: ['landscape', 'nature'],
  },
  'papier-mache': {
    alt: 'Hand-painted papier-mâché plates covered in roses and blossoming branches',
    caption: 'Hand-painted papier-mâché, a Kashmiri craft',
    place: null,
    tags: ['culture'],
  },
  pahalgam: {
    alt: 'A clear blue river running between snowy banks, with a red-roofed wooden hotel and pine slopes rising to white peaks',
    caption: 'The Lidder river at Pahalgam in winter',
    place: 'pahalgam',
    tags: ['landscape', 'seasons', 'stays'],
  },
  doodhpathri: {
    alt: 'Sheep grazing a sunlit green meadow, with dense pine forest and cloud-topped hills behind',
    caption: 'Sheep on the meadows of Doodhpathri',
    place: 'doodhpathri',
    tags: ['landscape', 'nature'],
  },
  yusmarg: {
    alt: 'Horses and a resting foal on a bright green meadow below tall pines and old wooden huts',
    caption: 'Horses grazing the meadow at Yusmarg',
    place: 'yusmarg',
    tags: ['landscape', 'nature'],
  },
  teaser: {
    alt: 'A lone walker on a winding mountain road disappearing into fog, with the KashWay wordmark',
    caption: 'The KashWay teaser',
    place: null,
    tags: ['brand'],
  },
};

// ---------------------------------------------------------------------------
export const DESTINATIONS = [
  {
    slug: 'srinagar',
    name: 'Srinagar',
    meaning: 'The lake city',
    region: 'Srinagar district',
    image: 'dal-autumn',
    altImage: 'houseboat',
    altitude: 'about 1,585 m',
    distance: 'Your base: the airport is here',
    coords: [34.0837, 74.7973],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    kinds: ['lakes', 'culture'],
    accent: '#a8401f',
    lede:
      'Mornings on Dal Lake begin before the light does. Vegetable sellers paddle out in the dark, mist sits on the water, and the city wakes to the sound of oars.',
    story: [
      'Srinagar is where every Kashmir journey starts and, for many people, the part they remember most. It is a city built around water: Dal and Nigeen lakes, the Jhelum winding through the old town, and the canals between them.',
      'Spend a night on a houseboat, walk the terraced Mughal gardens laid out by emperors who came here to escape the plains, and get lost in the lanes of the old city where papier-mâché, walnut-wood and shawl workshops still work by hand.',
    ],
    attractions: [
      { name: 'Dal Lake', note: 'Shikara rides, floating gardens and the early-morning vegetable market.' },
      { name: 'Nishat Bagh & Shalimar Bagh', note: 'Terraced Mughal gardens stepping down to the lake, with the Zabarwan hills behind.' },
      { name: 'Hazratbal Shrine', note: 'A white marble shrine on the lake’s western shore.' },
      { name: 'Indira Gandhi Memorial Tulip Garden', note: 'Opens each spring, when the tulips bloom (usually late March to April).' },
      { name: 'The old city', note: 'Jamia Masjid, the Khanqah of Shah-e-Hamadan and the craft lanes around them.' },
    ],
    todo: [
      'Take a dawn shikara to the floating vegetable market',
      'Stay a night on a carved houseboat',
      'Walk the Mughal gardens in the late afternoon light',
      'Visit a papier-mâché or shawl workshop in the old city',
      'Drink kahwa on a ghat as the lake lights come on',
    ],
    bestTime:
      'Late March to May for tulips and blossom. June to August is green and busy. October and November turn the chinars gold. December to February is cold, quiet and often misty, with occasional snow.',
    culture:
      'Srinagar is the cultural heart of the valley: Sufi shrines, centuries-old crafts and a deep tradition of hospitality. Dress modestly at shrines and mosques, and ask before photographing people.',
    food:
      'Look for wazwan (the multi-course feast), noon chai (pink salt tea) with bread from a kandur bakery, and kahwa, the saffron and cardamom green tea.',
    stay:
      'Houseboats on Dal and Nigeen lakes, heritage hotels, and family homestays. We arrange stays across all three.',
    tips: [
      'Shikara rates are posted at the ghats. Agree the route and time before you set off.',
      'Postpaid mobile connections from outside J&K work here. Prepaid ones from other states usually don’t.',
      'Friday midday prayers are busy at the major mosques and shrines. Plan visits around them.',
    ],
    nearby: ['gulmarg', 'sonamarg', 'doodhpathri'],
  },
  {
    slug: 'gulmarg',
    name: 'Gulmarg',
    meaning: 'Meadow of flowers',
    region: 'Baramulla district',
    image: 'gulmarg-gondola',
    altitude: 'about 2,650 m',
    distance: 'About 50 km west of Srinagar, roughly 2 hours by road',
    coords: [34.0484, 74.3805],
    seasons: ['winter', 'summer'],
    kinds: ['snow', 'meadows'],
    accent: '#3d5f86',
    lede:
      'A cup-shaped meadow ringed by forest, with the Apharwat ridge rising behind it. In winter it is one of India’s best-known ski slopes; in summer it turns green and full of flowers.',
    story: [
      'Gulmarg was a hill retreat long before skiing arrived, and the bowl of meadow at its centre still feels like a stage set: a small stone church, a golf course, wooden huts and snow-laden firs.',
      'The Gulmarg Gondola climbs in two phases, first to Kongdoori and then up toward the Apharwat ridge, close to 4,000 m. From the top, on a clear day, the view runs across the Pir Panjal range.',
    ],
    attractions: [
      { name: 'Gulmarg Gondola', note: 'Two phases: Gulmarg to Kongdoori, then Kongdoori up toward Apharwat.' },
      { name: 'Apharwat ridge', note: 'Snow for much of the year and wide views of the Pir Panjal.' },
      { name: 'St Mary’s Church', note: 'A small stone church in the middle of the meadow.' },
      { name: 'Alpather Lake', note: 'A high lake below Apharwat, often frozen until early summer.' },
    ],
    todo: [
      'Ride the gondola to Kongdoori, and on to Apharwat when weather allows',
      'Learn to ski or snowboard between December and March',
      'Walk the meadow and forest trails in summer',
      'Go sledging with the children on the lower slopes',
    ],
    bestTime:
      'December to March for snow and skiing. May to September for green meadows and walking. The gondola’s upper phase closes in high winds and heavy snow.',
    culture:
      'Gulmarg sits in Gujjar and Pahari country. In summer you will see herders bringing livestock up to the high pastures.',
    food:
      'Hot kahwa and simple Kashmiri meals at the meadow’s cafés. Most visitors eat at their hotel in the evening.',
    stay:
      'Ski lodges, mountain hotels and a few smaller guesthouses close to the gondola. Winter stays book early.',
    tips: [
      'Book gondola tickets online in advance through the official booking site, especially in winter.',
      'Bring proper winter layers from December to March. Boots and jackets can also be hired locally.',
      'Weather changes fast at altitude. Keep a flexible half-day in your plan.',
    ],
    nearby: ['srinagar', 'doodhpathri', 'yusmarg'],
  },
  {
    slug: 'sonamarg',
    name: 'Sonamarg',
    meaning: 'Meadow of gold',
    region: 'Ganderbal district',
    image: 'sonamarg-bridge',
    altitude: 'about 2,800 m',
    distance: 'About 80 km north-east of Srinagar along the Sindh river',
    coords: [34.3036, 75.293],
    seasons: ['summer', 'winter'],
    kinds: ['snow', 'meadows'],
    accent: '#2f5a74',
    lede:
      'The road to Sonamarg follows the Sindh river upstream until the valley opens into meadows under glaciers. It is the last broad valley before the road climbs to Zoji La and Ladakh.',
    story: [
      'Sonamarg is a valley of rivers and ice. In summer, the meadows fill with grazing herds, and walkers head up to the Thajiwas Glacier or set out on the Kashmir Great Lakes trek, which starts here.',
      'In winter it becomes a snow valley. The Z-Morh tunnel now gives Sonamarg all-weather road access, but snowfall can still close the roads, so plans stay flexible.',
    ],
    attractions: [
      { name: 'Thajiwas Glacier', note: 'A walk or pony ride from the meadow to the glacier snout.' },
      { name: 'Sindh river', note: 'Fast, clear water running the length of the valley.' },
      { name: 'Kashmir Great Lakes trek', note: 'A multi-day alpine trek that begins near Sonamarg (July to September).' },
      { name: 'Zoji La road', note: 'The high pass toward Ladakh, open in the warmer months.' },
    ],
    todo: [
      'Walk or ride up to the Thajiwas Glacier',
      'Spend a slow afternoon by the Sindh',
      'Start the Kashmir Great Lakes trek in summer',
      'Play in fresh snow on a winter day trip',
    ],
    bestTime:
      'May to September for meadows, glaciers and trekking. December to March for deep snow, when road conditions decide the day.',
    culture:
      'In summer, Gujjar and Bakarwal families camp in the high meadows with their herds, as they have for generations. Ask before taking photographs.',
    food:
      'Riverside dhabas serve rajma-chawal, Maggi and kahwa. Pack a picnic for the glacier walk.',
    stay:
      'Hotels and riverside camps in summer. Most winter visitors come as a day trip from Srinagar.',
    tips: [
      'Agree pony rates and the route before you set out for the glacier.',
      'Check road status the evening before a winter trip.',
      'It is colder than Srinagar all year. Bring a warm layer even in July.',
    ],
    nearby: ['srinagar', 'pahalgam'],
  },
  {
    slug: 'pahalgam',
    name: 'Pahalgam',
    meaning: 'Valley of shepherds',
    region: 'Anantnag district',
    image: 'pahalgam',
    altitude: 'about 2,200 m',
    distance: 'About 95 km east of Srinagar, along the Lidder river',
    coords: [34.0161, 75.315],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    kinds: ['meadows', 'adventure', 'snow'],
    accent: '#4b6b3a',
    lede:
      'Pahalgam sits where two streams meet to form the Lidder, with pine forest climbing on every side. Side valleys open off it in every direction.',
    story: [
      'Pahalgam is the valley most people picture when they think of Kashmir: a fast river, pine slopes, wooden bridges and meadows full of horses. It is also the starting point for the Amarnath Yatra route via Chandanwari.',
      'Day trips run up to Aru Valley and Betaab Valley, and the Lidder itself is good for rafting in the warmer months.',
    ],
    attractions: [
      { name: 'Betaab Valley', note: 'A broad green valley a short drive up from Pahalgam.' },
      { name: 'Aru Valley', note: 'A meadow village and the start of several treks.' },
      { name: 'Chandanwari', note: 'Snow bridges early in the season, and the start of the Amarnath route.' },
      { name: 'Lidder river', note: 'Rafting stretches and riverside walks.' },
    ],
    todo: [
      'Raft a stretch of the Lidder in summer',
      'Drive up to Aru and Betaab valleys',
      'Ride a pony through the pine forest',
      'Fish for trout (a licence is required)',
    ],
    bestTime:
      'April to October. Spring brings snowmelt and blossom, summer is green and busy, autumn is clear and calm. Winter is snowy and quiet.',
    culture:
      'Shepherd families move their flocks up the valley each summer, which is how Pahalgam got its name.',
    food:
      'Trout from the Lidder, cooked simply, and Kashmiri meals at riverside restaurants.',
    stay:
      'Riverside hotels, cottages and forest lodges along the Lidder.',
    tips: [
      'Local taxi unions run the side-valley trips. Rates are fixed and posted.',
      'Rafting depends on water levels. Ask on the day.',
    ],
    nearby: ['sonamarg', 'srinagar'],
  },
  {
    slug: 'doodhpathri',
    name: 'Doodhpathri',
    meaning: 'Valley of milk',
    region: 'Budgam district',
    image: 'doodhpathri',
    altitude: 'about 2,700 m',
    distance: 'About 42 km south-west of Srinagar',
    coords: [33.8846, 74.5657],
    seasons: ['summer', 'autumn'],
    kinds: ['meadows'],
    accent: '#5b7a5e',
    lede:
      'Rolling meadows cut by the Shaliganga, a river that foams white over its stones. It is quieter than the better-known valleys and close enough for a day trip.',
    story: [
      'Doodhpathri is a wide bowl of grassland and pine, with the Shaliganga river splitting into streams across it. The name is usually translated as “valley of milk”, after the white water.',
      'It suits slow days: a walk along the river, a picnic on the grass, and the drive back to Srinagar before dark.',
    ],
    attractions: [
      { name: 'Shaliganga river', note: 'White water braiding through the meadow.' },
      { name: 'The meadows', note: 'Open grassland ringed by pine forest.' },
    ],
    todo: ['Walk along the Shaliganga', 'Picnic in the meadow', 'Ride a pony to the upper slopes'],
    bestTime: 'May to October. Snow usually closes the meadows to casual visits in winter.',
    culture: 'In summer, herders bring their flocks up from the plains to graze here.',
    food: 'Simple stalls serve tea and snacks. Bring a packed lunch.',
    stay: 'Usually visited as a day trip from Srinagar.',
    tips: ['Start early to make the most of the light.', 'Mobile coverage is patchy on the meadow.'],
    nearby: ['yusmarg', 'gulmarg', 'srinagar'],
  },
  {
    slug: 'yusmarg',
    name: 'Yusmarg',
    meaning: 'A meadow in the pines',
    region: 'Budgam district',
    image: 'yusmarg',
    altitude: 'about 2,400 m',
    distance: 'About 47 km south of Srinagar',
    coords: [33.8344, 74.6646],
    seasons: ['summer', 'autumn'],
    kinds: ['meadows'],
    accent: '#3f5f50',
    lede:
      'A long meadow framed by pine and fir, with the Doodh Ganga river below and the Pir Panjal range to the south. Far fewer visitors than Gulmarg.',
    story: [
      'Yusmarg is a quiet meadow valley, good for walking and for families who want space to roam. A short trail leads to Nilnag, a small lake set in the forest.',
    ],
    attractions: [
      { name: 'Nilnag', note: 'A small forest lake reached on foot or by pony.' },
      { name: 'Doodh Ganga', note: 'A river running below the meadow.' },
    ],
    todo: ['Walk to Nilnag lake', 'Spend an afternoon in the meadow', 'Pair it with Doodhpathri'],
    bestTime: 'May to October.',
    culture: 'A rural, pastoral valley: please close gates and keep to paths near grazing land.',
    food: 'Limited options. Bring a packed lunch.',
    stay: 'A small number of government and private lodges; most visit as a day trip.',
    tips: ['Combine with Doodhpathri on a long day if time is short.'],
    nearby: ['doodhpathri', 'srinagar'],
  },
];

export const DEST_BY_SLUG = Object.fromEntries(DESTINATIONS.map((d) => [d.slug, d]));

export const SEASONS = {
  spring: { name: 'Spring', months: 'Mar – May' },
  summer: { name: 'Summer', months: 'Jun – Aug' },
  autumn: { name: 'Autumn', months: 'Sep – Nov' },
  winter: { name: 'Winter', months: 'Dec – Feb' },
};

export const KINDS = {
  lakes: 'Lakes & gardens',
  snow: 'Snow & mountains',
  meadows: 'Meadows & valleys',
  culture: 'Culture & heritage',
  adventure: 'Rivers & adventure',
};

// ---------------------------------------------------------------------------
export const EXPERIENCE_CATEGORIES = {
  adventure: 'Adventure',
  culture: 'Culture',
  food: 'Food',
  nature: 'Nature',
  luxury: 'Slow luxury',
  family: 'Family',
  photography: 'Photography',
  hidden: 'Hidden gems',
};

export const EXPERIENCES = [
  {
    slug: 'dawn-shikara',
    title: 'A dawn shikara to the floating market',
    place: 'srinagar',
    image: 'dal-autumn',
    cats: ['culture', 'photography', 'hidden'],
    season: 'All year',
    text: 'Set out in the dark and drift into the lake’s floating vegetable market as it trades at first light.',
  },
  {
    slug: 'gondola',
    title: 'The Gulmarg Gondola',
    place: 'gulmarg',
    image: 'gulmarg-gondola',
    cats: ['adventure', 'family', 'photography'],
    season: 'All year, weather permitting',
    text: 'Two cable-car phases from the meadow toward the Apharwat ridge, close to 4,000 m.',
  },
  {
    slug: 'houseboat',
    title: 'A night on a carved houseboat',
    place: 'srinagar',
    image: 'houseboat',
    cats: ['luxury', 'family', 'culture'],
    season: 'All year',
    text: 'Walnut and cedar panelling, a veranda on the water, and breakfast brought across by boat.',
  },
  {
    slug: 'skiing',
    title: 'Ski and snowboard lessons',
    place: 'gulmarg',
    image: null,
    cats: ['adventure'],
    season: 'December – March',
    text: 'Beginner to advanced terrain on Gulmarg’s slopes, with local ski instructors.',
  },
  {
    slug: 'craft-lanes',
    title: 'Craft lanes of the old city',
    place: 'srinagar',
    image: 'papier-mache',
    cats: ['culture', 'hidden', 'photography'],
    season: 'All year',
    text: 'Watch papier-mâché painted by hand, and visit the shawl and walnut-wood workshops around them.',
  },
  {
    slug: 'wazwan',
    title: 'Wazwan, the Kashmiri feast',
    place: 'srinagar',
    image: null,
    cats: ['food', 'culture'],
    season: 'All year',
    text: 'A multi-course meal cooked by a waza: rista, rogan josh, yakhni and gushtaba, shared from one copper trami.',
  },
  {
    slug: 'kandur-dawn',
    title: 'Noon chai and the dawn bakeries',
    place: 'srinagar',
    image: null,
    cats: ['food', 'hidden'],
    season: 'All year',
    text: 'Join the morning queue at a kandur for girda and lavasa, with a cup of pink salt tea.',
  },
  {
    slug: 'high-pastures',
    title: 'Walk the high pastures',
    place: null,
    image: 'high-meadow',
    cats: ['nature', 'photography'],
    season: 'June – September',
    text: 'Day walks into summer grazing grounds, where shepherds bring their flocks up from the valleys.',
  },
  {
    slug: 'thajiwas',
    title: 'Up to the Thajiwas Glacier',
    place: 'sonamarg',
    image: 'sonamarg-bridge',
    cats: ['nature', 'family'],
    season: 'May – September',
    text: 'A walk or pony ride from the Sonamarg meadow to the snout of the glacier.',
  },
  {
    slug: 'great-lakes',
    title: 'The Kashmir Great Lakes trek',
    place: 'sonamarg',
    image: null,
    cats: ['adventure', 'nature'],
    season: 'July – September',
    text: 'A multi-day alpine trek past a chain of glacial lakes, starting near Sonamarg.',
  },
  {
    slug: 'lidder-rafting',
    title: 'Rafting the Lidder',
    place: 'pahalgam',
    image: 'pahalgam',
    cats: ['adventure', 'family'],
    season: 'April – September',
    text: 'Short, lively rafting stretches on the river that runs through Pahalgam.',
  },
  {
    slug: 'meadow-day',
    title: 'A meadow day in Doodhpathri and Yusmarg',
    place: 'doodhpathri',
    image: 'doodhpathri',
    cats: ['nature', 'family', 'hidden'],
    season: 'May – October',
    text: 'Two quiet meadow valleys south-west of Srinagar, close enough to pair on one long day: river walks, ponies and a packed lunch on the grass.',
  },
  {
    slug: 'tulips',
    title: 'Tulip season and the Mughal gardens',
    place: 'srinagar',
    image: null,
    cats: ['nature', 'photography'],
    season: 'Late March – April',
    text: 'Time your trip for the tulip garden’s brief bloom, then walk the terraces of Nishat and Shalimar.',
  },
  {
    slug: 'snow-day',
    title: 'A first snow day',
    place: 'sonamarg',
    image: null,
    cats: ['family', 'nature'],
    season: 'December – February',
    text: 'Sledges, snowmen and hot kahwa: a day trip from Srinagar into a white valley.',
  },
];

// ---------------------------------------------------------------------------
// Sample routes for inspiration. Not fixed packages and not priced.
export const ROUTES = [
  {
    slug: 'lake-and-meadow',
    title: 'Lake and meadow',
    length: '4 days',
    mood: 'A first taste',
    days: [
      { place: 'srinagar', text: 'Arrive, settle into a houseboat, sunset shikara on Dal Lake.' },
      { place: 'srinagar', text: 'Mughal gardens in the morning, the old city in the afternoon.' },
      { place: 'gulmarg', text: 'Day trip to Gulmarg and the gondola.' },
      { place: 'srinagar', text: 'Dawn floating market, then departure.' },
    ],
  },
  {
    slug: 'three-valleys',
    title: 'Three valleys',
    length: '7 days',
    mood: 'The classic loop',
    days: [
      { place: 'srinagar', text: 'Arrive, houseboat night, evening on the lake.' },
      { place: 'srinagar', text: 'Gardens, Hazratbal and the old city.' },
      { place: 'gulmarg', text: 'Drive to Gulmarg, gondola, overnight in the meadow.' },
      { place: 'srinagar', text: 'Back via Tangmarg, a slow evening in Srinagar.' },
      { place: 'pahalgam', text: 'Drive along the Lidder to Pahalgam.' },
      { place: 'pahalgam', text: 'Aru and Betaab valleys, rafting if the river allows.' },
      { place: 'sonamarg', text: 'Day trip to Sonamarg on the way to departure.' },
    ],
  },
  {
    slug: 'winter-white',
    title: 'Winter white',
    length: '5 days',
    mood: 'Snow season',
    days: [
      { place: 'srinagar', text: 'Arrive into a quiet, misty Srinagar. Kahwa by a bukhari stove.' },
      { place: 'gulmarg', text: 'To Gulmarg. First ski lesson or a sledge on the lower slopes.' },
      { place: 'gulmarg', text: 'Gondola to Apharwat if the weather is kind.' },
      { place: 'sonamarg', text: 'A snow day in Sonamarg, roads permitting.' },
      { place: 'srinagar', text: 'Dawn shikara on the winter lake, then home.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Map points (approximate coordinates).
export const MAP_CATEGORIES = {
  towns: 'Valleys & towns',
  lakes: 'Lakes & gardens',
  heritage: 'Heritage & faith',
  mountains: 'Mountains & snow',
};

export const MAP_POINTS = [
  ...DESTINATIONS.map((d) => ({
    id: d.slug, name: d.name, cat: 'towns', coords: d.coords, image: d.image,
    text: d.meaning + '. ' + d.distance + '.', dest: d.slug,
  })),
  { id: 'dal', name: 'Dal Lake', cat: 'lakes', coords: [34.1132, 74.8611], image: 'dal-autumn', text: 'Shikaras, houseboats and the floating market.', dest: 'srinagar' },
  { id: 'nishat', name: 'Nishat Bagh', cat: 'lakes', coords: [34.1253, 74.8797], text: 'The largest of the terraced Mughal gardens on Dal Lake.', dest: 'srinagar' },
  { id: 'shalimar', name: 'Shalimar Bagh', cat: 'lakes', coords: [34.1494, 74.8737], text: 'A Mughal garden of fountains and chinar trees.', dest: 'srinagar' },
  { id: 'tulip', name: 'Tulip Garden', cat: 'lakes', coords: [34.0937, 74.8733], text: 'Opens each spring when the tulips bloom.', dest: 'srinagar' },
  { id: 'hazratbal', name: 'Hazratbal Shrine', cat: 'heritage', coords: [34.1286, 74.8414], text: 'White marble shrine on the shore of Dal Lake.', dest: 'srinagar' },
  { id: 'jamia', name: 'Jamia Masjid', cat: 'heritage', coords: [34.0985, 74.8105], text: 'The great wooden-pillared mosque of the old city.', dest: 'srinagar' },
  { id: 'gondola', name: 'Gulmarg Gondola', cat: 'mountains', coords: [34.0458, 74.3897], image: 'gulmarg-gondola', text: 'Cable car toward the Apharwat ridge.', dest: 'gulmarg' },
  { id: 'thajiwas', name: 'Thajiwas Glacier', cat: 'mountains', coords: [34.2876, 75.2905], text: 'A walk or pony ride from Sonamarg.', dest: 'sonamarg' },
  { id: 'betaab', name: 'Betaab Valley', cat: 'towns', coords: [34.0558, 75.3633], text: 'A green side valley above Pahalgam.', dest: 'pahalgam' },
  { id: 'aru', name: 'Aru Valley', cat: 'towns', coords: [34.0912, 75.2626], text: 'Meadow village and trailhead.', dest: 'pahalgam' },
];

// ---------------------------------------------------------------------------
export const PLANNER_INTERESTS = [
  'Snow & skiing', 'Lakes & shikaras', 'Trekking', 'Food', 'Culture & crafts',
  'Photography', 'Gardens & tulips', 'Slow & relaxed',
];
