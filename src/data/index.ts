import type { Service, Project, Review, NavItem } from '../types';

// covers
import hushLittleBoys from '../assets/covers/hush-little-boys.jpg';
import demSay        from '../assets/covers/dem-say.jpg';
import giveUp        from '../assets/covers/give-up.jpg';
import halleHalle    from '../assets/covers/halle-halle.jpg';
import hustleAlabi   from '../assets/covers/hustle-alabi.jpg';
import moneyJarul    from '../assets/covers/money-jarul.jpg';
import emmanuelOlajide from '../assets/covers/emmanuel-olajide.jpg';
import ucheOnyeEgwu  from '../assets/covers/uche-onye-egwu.jpg';
import bulletOlayemi from '../assets/covers/bullet-olayemi.jpg';
import ayakata       from '../assets/covers/ayahata.jpg';

// artist photos
import mday          from '../assets/artists/mday.jpg';
import akiib         from '../assets/artists/akiib.jpg';
import bellaShmurda  from '../assets/artists/bella-shmurda.jpg';
import dremo         from '../assets/artists/dremo.jpg';
import zinoleesky    from '../assets/artists/zinoleesky.jpg';
import samad         from '../assets/artists/artist-6004.webp';
import raybekah      from '../assets/artists/raybekah.jpg';

// general
import logoDark      from '../assets/black logo.PNG';
import logoWhite     from '../assets/white logo.PNG';
import distroHero    from '../assets/IMG_6223.PNG';
import studioMain    from '../assets/studio/console-main.jpg';
import studioDetail  from '../assets/studio/console-detail.jpg';
import studioDaw     from '../assets/studio/daw.jpg';

export { logoDark, logoWhite, distroHero, studioMain, studioDetail, studioDaw };

export const SERVICES: Service[] = [
  {
    num: '01',
    slug: 'distro',
    title: 'Music',
    titleItalic: 'Distribution',
    desc: 'Upload your music to Apple Music, Spotify, Boomplay, TikTok and 200+ streaming platforms worldwide.',
  },
  {
    num: '02',
    slug: 'studio',
    title: 'Music',
    titleItalic: 'Production',
    desc: 'Beats, recording, mixing & mastering. Get world-class industry standard music production services.',
  },
  {
    num: '03',
    slug: 'promotion',
    title: 'Music',
    titleItalic: 'Promotion',
    desc: 'Radio placements, sponsored ads online, editorial and press releases… Get the best promotion plans here.',
  },
  {
    num: '04',
    slug: 'graphics',
    title: 'Cover Art',
    titleItalic: 'Graphics',
    desc: 'Professional cover art and graphic design for singles, EPs, albums, and social media — built to convert on every platform.',
  },
];

export const PROJECTS: Project[] = [
  { title: 'Hush Little Boys', artist: 'Davee Jay',               year: '2024', cover: hushLittleBoys },
  { title: 'Dem Say',          artist: 'Yungsheriff ft Graham D',  year: '2024', cover: demSay },
  { title: 'Never Give Up',    artist: 'Mana-Sseh ft Zub\'s',     year: '2024', cover: giveUp },
  { title: 'Halle Halle',      artist: 'Moh-Nice',               year: '2024', cover: halleHalle },
  { title: 'Hustle',           artist: 'Olani YTD',              year: '2024', cover: hustleAlabi },
  { title: 'Money',            artist: 'Jaruwiz x Babyrichs',    year: '2024', cover: moneyJarul },
  { title: 'Giving Thanks',    artist: 'Highness',               year: '2024', cover: emmanuelOlajide },
  { title: 'Oya Egbu Onwu',   artist: 'Uche Onye Egwu',         year: '2024', cover: ucheOnyeEgwu },
  { title: 'Bullet',           artist: 'Olasphere',              year: '2024', cover: bulletOlayemi },
  { title: 'Ayakata',          artist: 'Lyriq Yeyé',             year: '2024', cover: ayakata },
];

export const ROSTER_ARTISTS = [
  { name: 'M Day Yor', role: 'Afro Soul · NG', num: '01', photo: mday },
  { name: 'Akiib',     role: 'Alt Pop · NG',   num: '02', photo: akiib },
];

export const HOF_ARTISTS = [
  { name: 'Bella Shmurda', role: 'Afrobeats · NG',  photo: bellaShmurda, spotify: 'https://open.spotify.com/artist/7kK5badbqOjd8WlT2XWMeM' },
  { name: 'Dremo',         role: 'Hip Hop · NG',    photo: dremo,        spotify: 'https://open.spotify.com/artist/6m0X6OQm6w3h4k7xnh4LeR' },
  { name: 'Zinoleesky',    role: 'Street Pop · NG', photo: zinoleesky,   spotify: 'https://open.spotify.com/artist/6Kp3KWPiVgi33DkJqo9T4g' },
  { name: 'Samad',         role: 'Afrobeats · NG',  photo: samad,        spotify: 'https://open.spotify.com/artist/0X1sGf1y8XCupQFDUkiPmB' },
  { name: 'Raybekah',      role: 'Afropop · NG',    photo: raybekah,     spotify: 'https://open.spotify.com/artist/0SwPkNmxB2YGHWVJMI8kpW' },
];

export const ARTIST_NAMES: string[] = [
  'Akiib', 'Beats by Akiib', 'D Hyke', 'Iup Ray', 'Jdee Bankz', 'Jerry Cee', 'KingLordy', 'Kin-Splash', 'Kody Dekoko', 'Kute',
  'Lady Comfort', 'Lanreylot', 'Latest Boby', 'LuckyboyVP', 'Marstamind', 'Milyion', 'Obyno Nong', 'Official Visionboi', 'Oluwaremzy', 'Philipi Melo',
  'Princekash', 'Snowboy', 'Topnotch MS', 'Typhresh', 'Harrysea', 'Superbravino', 'TrilliB', 'Xplus Andrew', 'Finest Bj', 'Boi Blended',
  'Smartwizzy', 'Icedspice', 'Terryice', 'Toles Star', 'Samwisd Everyoung', 'Fisco Waskid', 'Obm Razzboy', 'Lilswaarg', 'Danny Vibez', 'Vertical B',
  'Royalboi OML', 'T.Khali', 'Dizkid', 'Danny Wave NDTL', 'Hendrix Shamaya', 'Sivik Morgan', 'Uglyfaiz', 'Salish Boy', 'Edmond Alabo', 'Tuneboi Col',
  'Iceberry Official', 'Wilson69', 'Dbills', 'Danny Blaze', '4reiign', 'Tizzy', 'Chanelee', 'Iyanu', 'Jerryterc', 'Dj Trendy',
  'Junbho', 'Boy Sluzza', 'Lil Chazze', 'King Dml', 'Tuwasha', 'Piro Boy', 'Rezzy Velly', 'Iceboi', 'Laneton', 'Juwcez',
  'Flybe Flybe', 'Abdollar F.T', 'Robert E', 'Slimdee', 'Blackice', 'WDEE', '1960 Vibes', 'Mtreal', '2good', 'Smart Guyo',
  'Krypto', 'Wizstar', 'Exboy', 'M-Day Yor', 'Daniel D', 'Toni Macanaki', 'Character Twins', 'Sparkkila', 'Futuremo', 'Lamzy Qbar',
  'DADEX', 'Micky Omiko', 'C Rex', 'DJ Ben Coco Vibes', 'Bobby Drey', 'DAVY', 'Tenbridge', 'Aztroboii', 'Opy DML', 'Shevaa',
  'Todawrld', 'Oluwa Favour', 'Tuneskid', 'Miriskii', 'Decent Mizzy', 'Taiyelolu', 'One Step', 'Big Funds', 'MAESTRO JOLLY', 'Boy Remili',
  'Silver P', 'Ibeto', 'Hb Baddest', 'Zaza_Blazing', 'Mr Pedro', 'PopXan', 'Sleeky Maany', 'Fome Greene', 'Jay Sthorm', 'Reagan_SB',
  'Jerrynizzy', 'Play Boy Mit', 'Raymond Dee', 'Livet-Kesh', 'Mickeymarun', 'Silver Rhythmm', 'Assurance Felix', 'Motivation4pf', 'Gucci Temple', 'Tosky Chills',
  'Kenkc', 'Rudie Black', 'Rankiss', 'Moneys777', 'Boi Mareek', 'Gospel Ramnap', 'BIG CHIMZY', 'Amaxx', 'SOLO-D Viber', 'Lord Luta',
  'Attah Rodoh', 'Splendid', 'Fela Marney', 'KD.Stin', 'Jobboy', 'Orente Nanny', 'Beejay', 'Kay-Lite', 'Ọlá Ọlátúnjí Mouthpiece', 'B.D.Y CE3',
  'Daviance', 'Ahkorede', 'Kinmyzol', 'Graceboy', 'Godlybwoy', 'Olumyda', 'YUNgsheriff', 'Dammy Dhot', 'Rice', 'Dj Litting',
  'Skiilachii', 'Mabinixx', 'Shemilore Nkots', 'Ribzy Jr', 'Boy Milez', 'Zeejoy', 'Flexman Dondada', 'Royal Kizz', 'El Vicci', 'BBG',
  'Pab Leo', 'SammyBhollar', 'Young Creck', 'Viper Flow', 'Morirejesu', 'Obaro', 'Emmysneh', 'STELEX', 'Lexxie WRLD', 'Sadakhalifa Oshaa',
  'Boy Slick', 'Jonesice', 'LEGENDDtony', 'Barion Element', 'Obed Cruz', 'Pop Teno', 'SUNNYZEE', 'Majorviq', 'CEDRICKY', 'Nikeyboy NB',
  'SPEK', 'Edu J', 'Mhizta Tee042', 'Kelly Bliss', 'OSB Succkid', 'Basky', 'GL Splash', 'Rabanny', 'Uche Onye Egwu', 'Hypeman Joy',
  'Fezee', 'Lordo Skid', 'OloyeFab', 'SUNKIWISSY', 'Ansestor', 'Best Boy', 'C.Priince', 'Lugy Boy', 'Africa Youngstar', 'Iam Joskizze',
  'Donteebest', 'Stevez Gyang', 'Omogbolabo Akanni', 'Lil Young', 'Samwizzy', 'Reskiz Osha', 'Jay Boy', 'Abefe Imole', 'Sister Ozioma Goodnews', 'Oluwa Sezze',
  'Don Makaveli', 'Donnytunes', 'Don Black', 'CHOKOSKIN', 'Kay Rainbow', 'Ogb Nwamama', '6ix2wo-BQUE', 'Femino', 'Dwise Blink', 'S.K BOY',
  'Sallyboii', 'SILVER BEE', 'Oluwaosmall', 'Fresh Bee', 'Tamzico_TheBMS', 'Youngsos450', 'Rollex Lee', 'DAVIDPRIEST', 'Richytizzie', 'Saucy Drizzy',
  'NBA Flash2wo Vibes', 'AMB. FAROOQ OMONLA', 'KINGG', 'Expensive Mission', 'I-Chord Melodee', 'Prince Kaycee', 'Dennis Derich', 'Black Jezuz', 'Boyjagga', 'Ernest Muz',
  'Shubi-Cash', 'Rotimi247', 'StarFlex', 'J-Prime', 'Armstrong_milex', 'Darcoz Drede', 'Normal Donzee', 'Tc Mayana', 'Franklyno', 'Samuel Emmanuel',
  'Boi Lavish', 'Lucky Star', 'Star Crownn', 'Saint Wrld', 'Prince Jide Obi', 'WARIZABLE', 'TASCA', 'Yung Blinks', 'Badboi Yemi', 'G Gramz',
  'Smizzi Drizzi', 'Brighto Abs', 'Chrisdollar', 'Opporboy', 'KINSXN', 'Rhado Funds', 'J-Smalling', 'Mercy Black', 'Endysis', 'Disophizz',
  'Samadowsky', 'Lapistar', 'Mek6ix', 'Davee Jay', 'Damo_ihno', 'Kenny Solar', 'SEGUN TOKY', 'FESTINO', 'Od Trace', 'Dj Scratch',
  'Berry-Mkay', 'Hammed', 'Mally', 'Ebat Lay', 'Word', 'Opee', 'Destiny AD', 'Liskey Boy', 'Donpink', 'Donwizzy',
  'Young Emmy Cool', 'Swizzy', 'Omoogun', 'Boldex', 'Boy Slayer', 'Panachey BG', 'Jaruwiz', 'Shadow D', 'Jahrolly', 'Phemtop',
  'Princevicky', 'Berry Cool', 'Austinero', 'Merry9ice', 'D FORTUNE', 'Josh D', 'Waczy Lee', 'Broby Jay', 'RapSon~G', 'Newface',
  'Joblessbig', 'Sinobobo', 'Marcos Gold', 'Favicstar', 'Confidencevibez', 'Sonjee_kl', 'S MONEY', 'Sir Reno', 'M.S Lee', 'Mr Bright Starz',
  'Bizzboylomono', 'Sezkid', 'Yunkay', 'Keem Wyt', 'Hicohn', 'Tee Gold Vibes', 'Dezzy Nle', 'Myd9ite', 'Heaven Hero', 'Yankee Boy',
  'LENKASTER', 'Topsy Gold', 'Patrick Fastpay', 'Oluwajosin', 'Eshine Nation', 'Talabi Olumide', 'Mr Jerry', 'Boy Grace', 'Ashi Belushi', 'Only1mikkyy',
  'Bishop Richie', 'Doll John', 'Gospel Child', 'Shomilyf', 'Gb Sky', 'Chesco Pee', 'Badmanstuner', 'Hurnnyboy', 'Ice Monie', "Path'Phynda",
  'Bluetooth', 'Desilva Of Abuja', 'Rholex', 'Julianah Kush', 'Hakbol Records', 'Joebazz', 'Iamfalexdino', 'Ability', 'Biggy Bj', 'Bigg Spesh',
  'Timmy Christ', 'D4 Adagogo', 'Lorde-Skipper', 'Sunnybobo', 'Horlarmero', 'Taiye Taiwo', 'Femi Glory', 'DariFF', 'Lil Bella', 'Chris Popular',
  'Stainless Worldwide', 'Star Zee Acidic', 'Jimmyvoice', 'T Spy', 'Ada', 'Dc Blaq', 'Wazomaley', 'Yolo Love', 'Cele Boy', 'Nezy6ixtiin',
  'Offixial5Glite', 'Monex', 'Klief Lurd', 'T Crown', 'Jayflex', 'Emlixky', 'Ebezener Obey', 'Small King434', "God's Vessel International", 'Smo Kee',
  'Lacarzino', 'Bhadboy Brandy', 'Mr_Toskid', 'Gittapappy', 'O Wise', 'Salchi Xrev', 'Cafimalix', 'Da Bold', 'Great Ovis', 'Starbetter',
  'Bioshocolate', 'Denvo Relds', 'Rae Medye', 'Confirm Boy', 'Rosco Banty', 'Melody Star', 'Osas Sax', 'Rolex', 'Mfizz Mr Classic', 'Tommy Tee',
  'Gg Nasty Boy', 'Dammy Jay Ya', 'Danmighty', 'Amadi Ne', 'Omoba De Jumbo Beats', 'EaziboiDonpee', 'Abp Tamara', 'BB-BILLZ', 'YUZZY BOI ORINLOMO', 'Tobesky Blaze',
  'Bolexy', 'Queen Seun Majesty', 'Yfmania', 'Sammyakins', 'Timmy Charles', 'Blaize iQ', 'Miles Bytheway', 'Zion Cc', 'Wayes', 'Johbad',
  'Oluwashallon', 'Tblad', 'Densel Boy', 'MANE MANCHY', 'Shababoy', 'ICECUTE BKO', 'Mr9etwork', 'Darling Smart', 'Badman Wizzy', 'Jeff Lyon',
  'N Tezi Da Wizi', 'AMITY DG', 'VOKE', 'Vandamareign', 'STN VIBEZ', 'Tozo', 'Titus TK', 'Safehands', 'Nicky Jazz', 'FAD',
  'Snowred', 'Johnpaul', 'Opeyemi Olasoji', 'Shedy Brown', 'Clips Taco', 'JAH Lingo', 'Bryno T', 'MONDAy Md', 'Lil Bima', 'ClazzyCostar',
  'Feezor Marley', 'TeeBoss', 'Major', 'Sunkid Dml', 'BLESS VIBES', 'Oluwadarasimi Gospel Singer', 'Olasphere', 'M SHEDY', 'Saintsam', 'Egacity',
  'Lavida Morgan', 'ELLE MI', 'AYSHOW', 'Abills', 'World Famous', '6frankie', 'Show Boy', 'Yung Pizzy', 'Saint Davis', 'BTP Royal',
  'Agbeke Ela', 'Rare V', 'Noble Boy', 'Expensive', 'IVOICE', 'Skidothefirst', 'Honey Zee', 'Gwin', 'Sunex', 'HENRMOJAY',
  'Mr Nasty B', 'CHARLYY', 'Auwalinta', 'Wasmart', 'GIFTED NATION', 'Scarface', 'SOSO NIGA', 'Lasisi Neh', 'King Dj Abdullah', 'Eric Promise',
  'Sheanrone', 'MMP Marco', 'Flex A', 'Major Doe', 'Lil Kiel', 'Metro C', 'Voltron', 'Sojibury', 'Vicky Sound', 'Gturner',
  'Bebzy Bsg', 'Rico Gsqad', 'CJ Star', 'City Boy', 'Kayvibes', 'EM', 'King Boizzy', 'J Paul Agbarusia Ngene', 'Twinkle Star', 'Superb',
  'Nokyes', 'Didipluto', 'Lilkingfire', 'Omooluwa', 'Kehywiin', 'PaulMuzar', 'Superdon', 'Prescoraw', 'Red O Nwa', 'Honey Crown',
  'Sis Chinenye Obioha', 'Tundex', 'O Wrld', 'Sogo Komputer', 'Proffcee', 'Success Obot', 'Olafrosh Ibile', 'Joson S.O.G', 'Titi Billionz', 'Taye Shine',
  'AKU LORD', 'Aristo', 'JGOLD', 'PayperMulla', 'Dg Omane', 'Triple G', 'Tope Haleluya', 'Chase Dream', 'Wizzy Kalli', 'World Famous DJ KC',
  'Redstar Ajuanu', 'Rabbi', 'NorthBoi Ace', 'Boyshade', 'Whiszy Pro', 'Mr Tinz', 'Kingfred', 'ABKYOUNGBOY', 'KNDFORTUNE', 'Fargo Gangan',
  'AD Quality', 'Great Signal', 'BHM Vibez', 'Mr Castro', 'Ghee Tunes', 'MoZay', 'Owizzy', 'BimMzy', 'Enlightener', 'ADEN ULTIMATE',
  'Zeali Zion', 'Sosoistrappin', 'Onyibillion', 'Alan Junior', 'Adellux Kinihun', 'Peanut Boy', 'Jbossradical', 'Ahbu', 'Cholystar', 'Giddinewz Gideon',
  'Hero BB', 'Sensational Mika', 'Parkerlicious', 'Biq Jay', 'KehDrild', 'King Banks', 'Itm Kofi Igna', 'Neil Munch', 'Yungzaga', 'Goodess Boy',
  'Too Much Omoologo', 'Amimboi', 'Vibezstunner', 'Mukz Ena', 'Dollar Riskin', 'KING WAZINGA', 'WHALE', 'Kofi Clemz', 'Boifreezy', 'More Black',
  'Yaw Jace', 'James Kenaj', 'King Tegha', 'Ikstan', 'Aligatorz Official', 'Amazing Bra Orca', 'Qhofipopkhan', 'Jagem254', 'KENZO MANE', 'Highness',
  'Lurdlee', 'Dimix', 'McThunder', 'Olasugar', 'Veez', 'Hero Banks', 'Ibile Popo', 'Mahnoel', 'Jose Da Lito UG', 'Dremmy',
  'Pizzy Vibez', 'Kojo Deen', 'Kwame Trappah', 'Phenkhan', 'Mr Target', 'Larry OA', 'BIGG SHADOW', 'Cee Daking', 'Richey Neamy', '1clef',
  'BThree', 'Honibow', 'Samirae', 'Don Mega', 'King Basty', 'Innobless', 'VapourGH', 'MARGRET Born Great', 'Hariyor Muller', 'Khamlight',
  'J FLASH STARMAN', 'Ranny Gee', 'BM2', 'Lordziky', 'Zaty Freshz', 'Vinnie Madrills', 'Starkingbwoy', 'Luckyboiz Twins', 'Merry J Zee', 'Stylish Liberty',
  'Martox', 'BIG EAGLE', 'Thatboi Tmoney', 'Saintwallet', 'T.Evidence', 'Victorsax', 'Honger Halliday', 'Shatta Ratty', 'Esther Adebiyi', 'Anando',
  'Jejesco', 'Boy Temmy', 'Meshachseax', 'Capture Dem', 'Omogeh', 'Kinqdaviz', 'CHOQO', 'Bstar Richy', 'Pijoro', 'Humble Baddo',
  'Rizz Martox', 'Westking OB', 'Barbie Doll', 'Anointed SZ', 'Dongo', 'Papercypher MC', 'Qwaku Sweet', 'UELIJAH', 'Yung Cee', 'Nancy Indimuli',
  'Yohrk Dee', 'Samlee', 'DBOY', 'HeskayLOUD', 'Mana Sseh', 'Brown Fils', 'Olacrown', '6tools', 'ABOLA V', 'SOFTIE JAX',
  'EMERALDSWISZ', 'FEEZY E', 'Eegoo', 'KINGTOGOOLEE', 'Emissary', 'Kingdom Gee', 'Dead Man Chest', 'TS08', 'Strapp', 'Cool Emi',
  'WINCASE', 'Gidismart', 'Baba J', 'iNayture', 'Voltage', 'Max Weiler', 'King Mozart', 'Joel Harmony', 'Cute Keed', 'Evansbovi',
  'Nwagbara', 'EAST BOY1', 'Shine Gold', 'Present Tp', 'Kwesi Isaiah', 'Farazo Stanzy', '2chains Official', 'Denwiss', 'Good Luck Jo', 'Zico Maria',
  'Soul Vibez', 'Fresh Faya Don Wan', 'Mrjj White KE', 'H Moneybillionz', 'Socket', 'Ybbfrancisco', 'Melody Sound', 'T Doo', 'Dradolee', 'Real King Pagess',
  'Capsan', 'Money P', 'YPI', 'Stephen Bani', 'Popsiedwizy', 'Gbenga Best Man', 'IFY J', 'Oluwa Replica', 'Abigi Bones', 'Famouzz Vb',
  'Boii Toxic', 'Sorgg', 'ChyGoda', 'Erelomo', 'EVANG. OBINNA', 'Legend Tee', 'Tony Wilson', 'Jerich Kay', 'Herigana', 'Stoneyboy_Muzik',
  'Kidd Shedrack', 'Wise King One On One', 'Moses Great', 'Kellyvic', 'Shollyberry', 'Mofflex', 'Atta Jerry', 'Johnwhite', 'Kiliankid', '400Paradise',
  'Akwasi Currency', 'Papa1', 'Dave Swager', 'Azamarly T.E', 'Natureblac', 'Dan Anie', 'Budutsatsa', 'Yobzi', 'Sweetxahrah', 'SnowPbtl',
  'CrudeOil', 'Terry Spy', 'Kaysmile', 'Loops Gh', 'Strago Talent', 'Highstar19', 'Bdlightstar', 'Tony Yaayo King', 'Oluwa Donright', 'XTO PURE',
  'Kwesi YD', 'Femzit', 'Moonice', 'KBE Homebowy', 'Great Mumbela', 'Black Xugar', 'Bright Son', 'Drima Official', 'BADBOYY SHEYII', 'Y2KINGS',
  'Ogo Oluwa', 'Rico Brown JP', 'Yhaw Hitz', 'Goodyboy Amon', 'Samdeck', 'Teemie', 'Plutonikes', 'Don Best', 'Deris Bi', 'Black Korea',
  'BIG SON', 'Shally Blaq', 'Vybzor', 'Inumidun Ajayi', 'Blink Chainz', 'Nerry Boy', 'Qhwaforski', 'AL-MAHBOOB', 'Mr Wisez', 'OneFinga',
  'FineBoy Zino', 'Ransom Ikedinachi', 'Luckybrill', '9TIX', 'Ebenezer Shine', 'African Boy', 'Mighty Boy Blinking', 'Sheyskillz', 'Waltaboy', 'Dnature',
  'Ayobams', 'Badmantino', 'Havantiiii', 'Poff K', 'GRANDMAA OLLENU', 'Baby Joker', 'Yhaw Slim', 'Luckzy', 'Flexxia Boi', 'Rofmelody',
  'Bukken', 'SHARE D MONEY', 'Cafa 9', 'Goodboy Ams', 'Boy Joga', '20K BUSS', 'Raga DonGee', 'Clark Shaw', 'Jazzy D King', 'Wyzwizzy',
  'Emmanuel Nya', 'RUBIS MAN', 'Samflexbaby', 'Scofie', 'Olarwise', 'BB BILLZ', 'Bluonce Blu', 'Whanted', 'Saint Sena Noney', 'Brown Spice',
  'Mira Jesus', 'Game Tag', 'BigMattyz', 'Kenzie', 'Datreasureboy', 'Qbless Mk', 'Success Much', 'BRYAN BIZZLE', 'Mr. FG', 'Nature Republiq',
  'Topboy', 'Brilliant Stars', 'BJ VIBEZ', 'Pappi', 'Jultim P', 'Zlartezy', "BYM'G", 'Lana J', 'TOCHUKWU UZOMA', 'Ayoola Wizyg',
  'KING B', 'Ola Omo Ogodo', 'Prophetess Mercy D', 'Spy Wiz', 'Igbako Moore', 'Hypeman Zino', 'Wan Bless', 'Dawnsimon Bnation', 'FRANCISCA DASE', 'Santos City',
  'Bensco', 'Tin Bwoy', 'Alfa Kendrick', 'Bulletsag', 'GB WHITE', 'Ladrae', 'Friday Lord', 'Jr Diego', 'DADDYVON', 'Mikky Dollar',
  'Bamiszn', 'Sunny Banky', 'Prince Donkafi', 'KTWINS', 'Josebaba', 'FRESH BHEE', 'Rudemooreni', 'Breezhole', 'Jimlon', 'Semight',
  'DeemeX', 'Sabexkiddy', 'Omostan', 'Oluwafemivibes', 'Valid Patema', 'Lascobo', 'ALPHA BOY', 'Qy Qawiyu', 'Pinging Singing', 'Pillar Burna',
  'DE JAGUAR', 'Weez Absan', 'Yours O', 'Olams Berry', 'Mayami Starr', 'Natharanking', 'MT VIBEZ', 'KOMusiq', 'Azamarley T.E', 'Rextic',
  'Shiningstar Vibe', 'Loverbwoy Vybez', 'Ap Valentino', 'Black Kelly', 'Bobble Boy', 'QBiz', 'Officer Winter', 'GBWYTE', 'Moh-Nice', 'Ola Loni Vibez',
  'OLANI YTD', 'Creamyice', 'Boldmanhs', 'Juicci Rano', 'SILVERBOY OMO OLOGO', 'Topboyy', 'Horbah', 'WHALE WTG', 'Profeth', 'Richhh & Famous',
  'DaPopzy', 'Bbyboy Shady', 'Blarkk Pee', 'BiG TimZ', 'Don Sparks DMB', 'Soddy Cee', 'Masterteee', 'Yanki Boy', 'Vintox', 'TonyeRaz',
  'Wonda Boii', 'Mhuftybwoy', 'Niytro', 'Omo Oluwa Badboi Kp', 'Unity Blessed', 'Pastor Sab', 'Empaya Vybez', 'Kizz Boy Nwanne', 'ABLEGOD DJ-YEMZY', 'Mr BERRI',
  'Tobilink', 'Mr Smart Boy', 'Sky Tenther', 'Classic Boy', 'True Talent', 'The Real Goddey', 'Sky Baddolee', 'EDYSONG', 'Ameer_dollars', 'Boyslickk',
  'Raw Gold', 'Dcblaq', 'Em Ice', 'Starr Angelo', 'Olu_focus', 'Porpular', 'Choice Ve', 'MR Gabriel Jordan', 'IamRankie', 'Steady Praise',
  'Chuxudo', 'Saint Peter De Rock', 'Nattyjoe', 'Virgo Okp', 'Elly Whizzy', 'Adam-Smith', 'ChiLifted', 'Dom Blaqh', 'Proxpa Scoff', '2ika',
  'Yungjazzy', 'DANNYBOI NWA OBOSI', 'The Sage Music', 'Nass Boymd', 'G K D', 'Djcross Your Partyrider', 'Laomee', 'King Easy Boy', 'Obimax Nwa OZ', 'Berry Zee',
  'Tropicanavibee', 'Juliet Ekuase Gabriel', 'SOLOTONE', 'Bad Man Flash', 'Ceebkc', 'Real2kind', 'Bluv Dee', 'TTG Rishi', 'VKthor FrDm', 'Purestar Vibe',
  'Danieboy', 'King Yungzil', 'Karmarr', 'Hola Boy', 'BIG OLA', 'Dmanteaser', 'BIG4 OFFICIAL', 'JAH WILMAN', 'Luckio', 'BoyRankie',
  'VIPRIMZ', 'Arianashika', 'Mikycool', 'Volkano', 'Phemsongz', 'Kext D', 'Danny UG', 'Prophet Yinka Raphael', 'Giraffe Asu', 'Trippy Leo',
  'Official_owizzy', 'Grand P Nneji', 'Beluv Dee', 'Kwesi Agez', 'Dykizz', 'Emmapreacher', 'Joint 99', 'Bobujazz', 'NATTYDIBOX', 'Nasi.IQ',
  'Emmystrings U', 'Oluslidoo', 'BIG IYCE', 'Kelvino TNT', 'Ebymelody', 'Nextlove', 'Johniz Star', 'KFT', 'Rullatunez', 'Lil Wales',
  'Double 9 YG', 'KwakuBaddy', 'Bongo RG', 'BrownX', 'Sdeen Whyz', 'Sholizy', 'EMEMOBONG', 'Lil Yelsmil', 'Vaiter', 'Mg Starr',
  'Joo Guud', 'DE ANGELIC CHORALE CHOIR', 'Big Zaddy', 'Minister Dorosong', 'Ariyo Babyboy', 'Black Kelly Og', 'Evangelist Chibuike', 'Snowzy Cee', 'JAY ZY', 'Elita Mercy',
  'Oluwasegun Of Lagos', 'EMOKAAY', 'Quainn', 'Mullah Bella', 'James Tuma', 'Samzy E Boi', 'Pastor Destiny Mordy', 'Favour Ogbeide', 'Zee Bento', 'Scamzy',
  'SHEGZYYOUNG', 'OfficialRG', 'Ovado', 'Iceboy Brown', 'Kayplus', 'RABALEE', 'Solo-Moni', 'Lil Ferron', 'Destiny Miles', 'Non Zi',
  "Dave's-Jon", 'Homeboy D Rich', 'General Omoola', 'Genuine Michael', 'Opera Omologo', 'JB Ologo Daya', '6iX_Tha_Truth', 'TBADBOY', 'Lyriq_yeye', 'Too_Gentle',
  'Orman Szn', 'Mrjj White Music', 'Flex Empire Music', 'Bruz_kid', 'SPOT BOI', 'Yokeerawx', 'Gerl Alone', 'Baller Boiz', 'Remy Sixnine', 'B.E',
  'Zikenuzy', 'Dauski', 'Femvee', 'Stoney Kay', 'Gyasi King', 'Dairect Mk', 'Bhigwhale', 'Don Muzzy', 'BLACK JESZ', 'Mrlucky 254',
  'OLOLA TOMMY J', 'Happy Tenpo', 'Pinowanzy', 'Kozinova Diloboi', 'PICOMZY KAY', 'Jamaican Bizy', 'Cee Vybes', 'Bahdboi Smiles', 'Loops Musick', 'IKOABASI MUSIC',
  "Ocean da'Poet", 'Nice-Sky', 'I.B.O', 'STYLEZZ BHAD', 'Bennywizzy', 'Dotkom Gh', 'Sammy TBL', 'Tripbvby Ike', 'Youngzy', 'Dty Zilla',
  'Chxrliee', 'VickyzBoy', 'Betnos Vibe', 'Cool Backlash', 'OBAAPA DORIS', 'Jay Lyfe', 'Chaser Boy', 'B.B PHILIP', 'Nadabanneh', 'Kulbhoi',
  'Aloys BeeJay', 'Berri Black', 'Bhadboi Beamer', 'Victory Banky', 'Mildred Jumbo', 'Teymiedollz', 'Gooddest Boy', 'African Boi 233', 'Million Vibezz', 'Barry Tone',
  'Story Bwoi', 'Mini Wizzy', 'Kingaftertwelvevibez', 'Vadolee', 'Mytoray', 'Big Gentle', 'Kojo Bandow', 'MIKEWAYA', 'DC Funder', 'Minister Etiboy',
  'Samuel Festus The Preacher Man', 'Ayomighty', 'Favyz Dwayne', 'Henshaw Lucas', 'Da Spencer', 'Badess Kid', 'FNBSQUARE', 'R-K', 'Swaky Amez', 'DAVID BLVZE',
  'TI-JOSKY', 'Menumenu Aramoda', 'King Benposa', 'Sunscor', 'Official Wondaboi', 'Badboikashy', 'IYKE MAN', 'BWOI RHOLIE', 'King EOCI', 'Joefere',
  'Oniseli Agbaye', 'Kwesi Ice', 'Mr Theophiluz', 'JOE SANTOS GN', 'JELIS TUNES', 'F6ix', 'Damoluas', 'Young Prophet Isaiah', 'Mezzo Songs', 'OYINBO JESU',
  'Lord Object', 'E Small', 'Gifted Saviour', 'Chiboy Yagi', 'Badboy Tyga', 'Kenzo-IDK', 'Jacky Wilson', 'Lil-Crown', 'Medianzee', 'Agogo Igbala',
  'Emma Solace', 'Alphaboy S.B', 'Drick', 'Quojo Bagio', 'Christopher Mercy', 'Standardboy', 'Ghoskoh MW', 'Fynestar', 'DBOYGC', 'BLACK_OG',
  'Kofi Jay', 'I-kimskiboi', 'Popeyad', 'Myles Vibes', 'Blendz Emcee', 'TEVANK', 'Evbota Richard', 'Don Wizzy', 'Kofi Oppong', 'Boi_jacee',
  'Samson Olugbenga Adekunle', 'Roqetthehusler', 'Humble Don', 'YUSEE DEY HERE SO', 'Escore Gatti', 'Eyinju Olodumare', 'McNova', 'Davi Lantvn', 'Johnny Barky', 'Future+',
  'Chioma Giovanni', 'Ice Guy World', 'Dr Lumen', 'Princess Mfonobong', 'Seyibad', 'Agbarusia Ngene', 'Mr Zoe Wisdom', 'Ayanfe Jesu Glorious Singer',
];

export const PLATFORMS: string[] = [
  'Spotify', 'Apple Music', 'Boomplay', 'TikTok',
  'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music',
];

export const REVIEWS: Review[] = [
  { stars: 5, quote: 'Tested & trusted. The dashboard makes royalty tracking effortless.', who: 'Celebboi', role: 'Artist' },
  { stars: 5, quote: 'No more payout headaches — Dwad made the whole thing easier for artists.', who: 'Kylie xxx', role: 'Artist' },
  { stars: 5, quote: 'Distributed three projects with Dwad. Communication is human, not bots.', who: 'Freshy boi', role: 'Producer' },
];

export const NAV: NavItem[] = [
  { slug: 'home',       label: 'Home' },
  { slug: 'distro',     label: 'Distribution' },
  { slug: 'studio',     label: 'Production' },
  { slug: 'promotion',  label: 'Promotion' },
  { slug: 'publishing', label: 'Publishing' },
  { slug: 'spotlight',  label: 'Spotlight' },
  { slug: 'management', label: 'Management' },
  { slug: 'graphics',   label: 'Cover Art' },
];
