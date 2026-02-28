export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  cover: string;
  bgLight: string;
  bgMid: string;
  accent: string;
  accentLight: string;
  description: string;
  pages: number;
  rating: number;
  tag: string;
  isbn: string;
  topics: string[];
}

export interface CartItem extends Book {
  qty: number;
}

export const books: Book[] = [
  {
    id: 1,
    title: "The Cell: A Molecular Approach",
    author: "Geoffrey M. Cooper",
    price: 1850,
    originalPrice: 2400,
    cover: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80",
    bgLight: "#edf7f0",
    bgMid: "#b7e4c7",
    accent: "#1e7e3e",
    accentLight: "#d8f3e3",
    description:
      "A comprehensive journey into the molecular machinery of life. Discover DNA, proteins, and the exquisite complexity of cellular biology.",
    pages: 820,
    rating: 4.8,
    tag: "Bestseller",
    isbn: "978-0878932207",
    topics: ["Cell Structure", "DNA Replication", "Protein Synthesis", "Cell Signaling"],
  },
  {
    id: 2,
    title: "Campbell Biology",
    author: "Lisa Urry, Michael Cain",
    price: 2200,
    originalPrice: 2900,
    cover: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80",
    bgLight: "#edf4fd",
    bgMid: "#bdd7f5",
    accent: "#1558b0",
    accentLight: "#dbeeff",
    description:
      "The gold standard in biology education. From atoms to ecosystems, this book weaves together life's grand tapestry with stunning clarity.",
    pages: 1464,
    rating: 4.9,
    tag: "Editor's Pick",
    isbn: "978-0135188743",
    topics: ["Evolution", "Genetics", "Ecology", "Physiology"],
  },
  {
    id: 3,
    title: "Human Anatomy & Physiology",
    author: "Elaine N. Marieb",
    price: 1650,
    originalPrice: 2100,
    cover: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
    bgLight: "#fdf0ed",
    bgMid: "#f5c4b5",
    accent: "#b03020",
    accentLight: "#fde5de",
    description:
      "Explore the breathtaking architecture of the human body. From neurons firing to hearts beating—life revealed in magnificent detail.",
    pages: 1264,
    rating: 4.7,
    tag: "Popular",
    isbn: "978-0134580999",
    topics: ["Nervous System", "Cardiovascular", "Musculoskeletal", "Homeostasis"],
  },
  {
    id: 4,
    title: "Molecular Biology of the Gene",
    author: "James D. Watson",
    price: 1980,
    originalPrice: 2600,
    cover: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80",
    bgLight: "#f3f0fc",
    bgMid: "#d5ccf5",
    accent: "#5235a0",
    accentLight: "#ece8fc",
    description:
      "Written by the co-discoverer of DNA's double helix. The definitive text on gene expression, regulation, and the secrets hidden in our genome.",
    pages: 900,
    rating: 4.9,
    tag: "Classic",
    isbn: "978-0321762436",
    topics: ["Genome", "Gene Expression", "CRISPR", "Epigenetics"],
  },
];

export const fmt = (n: number) => "৳" + n.toLocaleString("en-BD");
