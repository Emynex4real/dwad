export interface Service {
  num: string;
  slug: string;
  title: string;
  titleItalic: string;
  desc: string;
}

export interface Project {
  title: string;
  artist: string;
  year: string;
  cover: string;
}

export interface Review {
  stars: number;
  quote: string;
  who: string;
  role: string;
}

export interface NavItem {
  slug: string;
  label: string;
}

export interface Artist {
  name: string;
  role: string;
  num: string;
}
