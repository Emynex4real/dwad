import type { Service, Project, Review, NavItem } from '../types';

// covers
import necessary     from '../assets/covers/necessary.jpg';
import hushLittleBoys from '../assets/covers/hush-little-boys.jpg';
import mdayEp        from '../assets/covers/mday-ep.jpg';
import demSay        from '../assets/covers/dem-say.jpg';
import giveUp        from '../assets/covers/give-up.jpg';
import halleHalle    from '../assets/covers/halle-halle.jpg';
import hustleAlabi   from '../assets/covers/hustle-alabi.jpg';
import moneyJarul    from '../assets/covers/money-jarul.jpg';
import emmanuelOlajide from '../assets/covers/emmanuel-olajide.jpg';
import ucheOnyeEgwu  from '../assets/covers/uche-onye-egwu.jpg';
import bulletOlayemi from '../assets/covers/bullet-olayemi.jpg';
import humanOlayemi  from '../assets/covers/human-olayemi.jpg';

// artist photos
import mday          from '../assets/artists/mday.jpg';
import akiib         from '../assets/artists/akiib.jpg';
import bellaShmurda  from '../assets/artists/bella-shmurda.jpg';
import dremo         from '../assets/artists/dremo.jpg';
import zinoleesky    from '../assets/artists/zinoleesky.jpg';
import youngzy       from '../assets/artists/youngzy.png';
import raybekah      from '../assets/artists/raybekah.jpg';

// general
import logoDark      from '../assets/logo-dark.png';
import distroHero    from '../assets/distro-hero.png';
import studioMain    from '../assets/studio/console-main.jpg';
import studioDetail  from '../assets/studio/console-detail.jpg';
import studioDaw     from '../assets/studio/daw.jpg';

export { logoDark, distroHero, studioMain, studioDetail, studioDaw };

export const SERVICES: Service[] = [
  {
    num: '01',
    slug: 'distro',
    title: 'Music',
    titleItalic: 'Distribution',
    desc: 'Upload your music to Apple Music, Spotify, Boomplay, TikTok and 200+ streaming platforms worldwide. Publishing setup and lyrics included.',
  },
  {
    num: '02',
    slug: 'studio',
    title: 'Production',
    titleItalic: '& Studio',
    desc: 'Beats, recording, mixing and mastering — a full-stack production house behind every release. Songs produced here qualify for free radio.',
  },
  {
    num: '03',
    slug: 'promotion',
    title: 'Radio &',
    titleItalic: 'Promotion',
    desc: 'Land your record on radio, in editorial playlists, and across social channels. Tailored campaigns for the territories that matter.',
  },
  {
    num: '04',
    slug: 'spotlight',
    title: 'Artist',
    titleItalic: 'Spotlight',
    desc: 'Be featured by the Dwad editorial team — interviews, cover stories and curated drops for artists building real careers.',
  },
];

export const PROJECTS: Project[] = [
  { title: 'Necessary',        artist: 'M Day Yor',              year: '2024', cover: necessary },
  { title: 'Hush Little Boys', artist: 'Davee Jay',              year: '2024', cover: hushLittleBoys },
  { title: 'EP',               artist: 'M Day Yor',              year: '2024', cover: mdayEp },
  { title: 'Dem Say',          artist: 'Yung Sheriff',           year: '2024', cover: demSay },
  { title: 'Give Up',          artist: 'Mana Sseh',              year: '2024', cover: giveUp },
  { title: 'Halle Halle',      artist: 'James Daniel',           year: '2024', cover: halleHalle },
  { title: 'Hustle',           artist: 'Alabi Enoch Olamide',    year: '2024', cover: hustleAlabi },
  { title: 'Money',            artist: 'Jarulwest',              year: '2024', cover: moneyJarul },
  { title: 'Cover Vol. 2',     artist: 'Emmanuel Olajide',       year: '2024', cover: emmanuelOlajide },
  { title: 'Official',         artist: 'Uche Onye Egwu',         year: '2024', cover: ucheOnyeEgwu },
  { title: 'Bullet',           artist: 'Olayemi Afolayan',       year: '2024', cover: bulletOlayemi },
  { title: 'Human',            artist: 'Olayemi Afolayan',       year: '2024', cover: humanOlayemi },
];

export const ROSTER_ARTISTS = [
  { name: 'M Day Yor', role: 'Afro Soul · NG', num: '01', photo: mday },
  { name: 'Akiib',     role: 'Alt Pop · NG',   num: '02', photo: akiib },
];

export const HOF_ARTISTS = [
  { name: 'Bella Shmurda', role: 'Afrobeats · NG', photo: bellaShmurda },
  { name: 'Dremo',         role: 'Hip Hop · NG',   photo: dremo },
  { name: 'Zinoleesky',    role: 'Street Pop · NG', photo: zinoleesky },
  { name: 'Youngzy',       role: 'Afrobeats · NG', photo: youngzy },
  { name: 'Raybekah',      role: 'Afropop · NG',   photo: raybekah },
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
  { slug: 'home',      label: 'Home' },
  { slug: 'distro',    label: 'Distro' },
  { slug: 'studio',    label: 'Studio' },
  { slug: 'promotion', label: 'Promotion' },
  { slug: 'spotlight', label: 'Spotlight' },
  { slug: 'contact',   label: 'Contact' },
];
