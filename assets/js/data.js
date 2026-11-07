/* =========================================================
   KickCulture — data produk (dummy)
   Nanti bagian ini diganti dengan data dari API di folder Backend.
   Struktur objeknya sengaja dibuat sama dengan rencana respons API
   (lihat Backend/README.md) supaya peralihannya mudah.
   ========================================================= */

const CATEGORY_LABEL = {
  running: 'Running',
  lifestyle: 'Lifestyle',
  basketball: 'Basket',
  skate: 'Skate',
};

const BADGE_LABEL = {
  new: 'Baru',
  hot: 'Hot',
  limited: 'Limited',
};

/** Minimal belanja untuk gratis ongkir (Rupiah). */
const FREE_SHIPPING_MIN = 2000000;

/** Ukuran EU yang tersedia di quick view. */
const SIZES = [39, 40, 41, 42, 43, 44, 45];

/**
 * group: 'hero'  -> slide di hero
 *        'best'  -> grid Best Seller
 *        'drop'  -> carousel Limited Drop
 */
const PRODUCTS = [
  /* ---------- Hero ---------- */
  {
    id: 'kc-h01', group: 'hero', name: 'Volt Runner 01', category: 'running',
    price: 1899000, oldPrice: null, badge: 'new', rating: 4.9, reviews: 312,
    colors: ['#C8F031', '#111111', '#FFFFFF'], accent: '#B3E140',
    image: 'assets/images/hero/hero-1.jpg',
    desc: 'Runner ringan dengan upper mesh yang bernapas dan midsole responsif. Warna volt yang mencolok untuk lari pagi maupun nongkrong sore.',
  },
  {
    id: 'kc-h02', group: 'hero', name: 'Sky Court Mid', category: 'basketball',
    price: 2149000, oldPrice: null, badge: 'hot', rating: 4.8, reviews: 187,
    colors: ['#1B1B1F', '#FFFFFF', '#86BEDF'], accent: '#86BEDF',
    image: 'assets/images/hero/hero-2.jpg',
    desc: 'Sepatu basket mid-cut dengan bantalan responsif dan outsole herringbone yang mencengkeram lantai lapangan.',
  },
  {
    id: 'kc-h03', group: 'hero', name: 'Terra Slip Low', category: 'lifestyle',
    price: 1349000, oldPrice: null, badge: null, rating: 4.7, reviews: 96,
    colors: ['#F2EDE4', '#C9A27A', '#CC7533'], accent: '#CC7533',
    image: 'assets/images/hero/hero-3.jpg',
    desc: 'Low-top bernuansa tanah dengan panel suede dan sol karet natural. Santai, rapi, dan mudah dipadukan.',
  },

  /* ---------- Best Seller ---------- */
  {
    id: 'kc-01', group: 'best', name: 'Aero Glide X', category: 'running',
    price: 1899000, oldPrice: null, badge: 'new', rating: 4.9, reviews: 214,
    colors: ['#1A1A1A', '#6B6B6B', '#C8F031'],
    image: 'assets/images/products/p01.jpg',
    desc: 'Runner hitam super ringan dengan foam empuk dan outsole grip tinggi. Siap menemani dari 5K pertamamu sampai half marathon.',
  },
  {
    id: 'kc-02', group: 'best', name: 'Crimson Court Hi', category: 'basketball',
    price: 2299000, oldPrice: null, badge: 'hot', rating: 4.8, reviews: 176,
    colors: ['#C8102E', '#FFFFFF'],
    image: 'assets/images/products/p02.jpg',
    desc: 'High-top merah menyala dengan bantalan tumit tebal dan penyangga pergelangan kaki untuk main di lapangan.',
  },
  {
    id: 'kc-03', group: 'best', name: 'Clean Slate Low', category: 'lifestyle',
    price: 1249000, oldPrice: 1499000, badge: null, rating: 4.7, reviews: 402,
    colors: ['#FFFFFF', '#2B2B2B'],
    image: 'assets/images/products/p03.jpg',
    desc: 'Sneaker putih minimalis yang cocok dengan outfit apa pun. Kulit sintetis premium yang gampang dibersihkan.',
  },
  {
    id: 'kc-04', group: 'best', name: 'Sunset Pacer', category: 'running',
    price: 1649000, oldPrice: null, badge: 'new', rating: 4.8, reviews: 98,
    colors: ['#F4F1EC', '#FF6B3D', '#F2B8C6'],
    image: 'assets/images/products/p04.jpg',
    desc: 'Daily trainer dengan gradasi sunset, upper rajut adaptif, dan drop 8 mm yang nyaman untuk pemula.',
  },
  {
    id: 'kc-05', group: 'best', name: "Rebel Hi '85", category: 'basketball',
    price: 2499000, oldPrice: 2999000, badge: null, rating: 4.9, reviews: 521,
    colors: ['#111111', '#C8102E', '#FFFFFF'],
    image: 'assets/images/products/p05.jpg',
    desc: 'Siluet high-top klasik era 80-an dengan kombinasi merah-hitam yang ikonik dan kulit full-grain.',
  },
  {
    id: 'kc-06', group: 'best', name: 'Pastel Drift', category: 'lifestyle',
    price: 1399000, oldPrice: null, badge: null, rating: 4.6, reviews: 143,
    colors: ['#F6C1CF', '#BFD7F5', '#F7E7A6'],
    image: 'assets/images/products/p06.jpg',
    desc: 'Paduan warna pastel dengan sol tumpuk yang bikin tampilan lebih jenjang. Favorit untuk OOTD.',
  },
  {
    id: 'kc-07', group: 'best', name: 'Mocha Trail', category: 'skate',
    price: 1149000, oldPrice: null, badge: 'hot', rating: 4.7, reviews: 88,
    colors: ['#B07A3C', '#2B2B2B', '#F2EDE4'],
    image: 'assets/images/products/p07.jpg',
    desc: 'Suede cokelat mocha dengan sol vulkanisir tebal. Tahan gesekan, enak untuk skate maupun harian.',
  },
  {
    id: 'kc-08', group: 'best', name: 'Blush Runner', category: 'running',
    price: 1549000, oldPrice: 1799000, badge: null, rating: 4.6, reviews: 121,
    colors: ['#F2B8C6', '#9A9A9A', '#FFFFFF'],
    image: 'assets/images/products/p08.jpg',
    desc: 'Runner bergaya retro dengan aksen pink lembut dan bantalan ganda yang empuk untuk jalan seharian.',
  },
  {
    id: 'kc-09', group: 'best', name: 'Peach Dunk Hi', category: 'skate',
    price: 1799000, oldPrice: null, badge: 'new', rating: 4.8, reviews: 64,
    colors: ['#F4B183', '#1A1A1A', '#E9E4D8'],
    image: 'assets/images/products/p09.jpg',
    desc: 'High-top skate dengan panel peach dan krem, lidah empuk, serta cupsole yang stabil.',
  },
  {
    id: 'kc-10', group: 'best', name: 'Cloud White', category: 'lifestyle',
    price: 1099000, oldPrice: null, badge: null, rating: 4.8, reviews: 689,
    colors: ['#FFFFFF', '#E5E5E5'],
    image: 'assets/images/products/p10.jpg',
    desc: 'Si putih andalan sejuta umat. Kulit lembut, sol tebal, dan siluet bersih yang tak lekang waktu.',
  },
  {
    id: 'kc-11', group: 'best', name: 'Maroon Vault', category: 'skate',
    price: 899000, oldPrice: 1199000, badge: null, rating: 4.5, reviews: 57,
    colors: ['#6E1F2B', '#FFFFFF', '#E8B400'],
    image: 'assets/images/products/p11.jpg',
    desc: 'Canvas maroon dengan side stripe putih dan sol waffle yang grippy untuk trik di papan.',
  },
  {
    id: 'kc-12', group: 'best', name: 'Amber Rush 90', category: 'lifestyle',
    price: 1999000, oldPrice: null, badge: 'hot', rating: 4.9, reviews: 233,
    colors: ['#E8812E', '#F5C542', '#FFFFFF'],
    image: 'assets/images/products/p12.jpg',
    desc: 'Colorway amber-kuning yang berani dengan unit udara di tumit. Statement piece untuk streetwear.',
  },

  /* ---------- Limited Drop ---------- */
  {
    id: 'kc-d1', group: 'drop', name: 'Nightshift Court', category: 'lifestyle',
    price: 2799000, oldPrice: null, badge: 'limited', rating: 5.0, reviews: 41,
    stock: 6, totalStock: 50, colors: ['#FFFFFF', '#111111'],
    image: 'assets/images/products/d01.jpg',
    desc: 'Edisi malam: kulit putih bersih dengan aksen perforasi. Hanya diproduksi 50 pasang.',
  },
  {
    id: 'kc-d2', group: 'drop', name: 'Olive Strider', category: 'running',
    price: 2199000, oldPrice: null, badge: 'limited', rating: 4.9, reviews: 37,
    stock: 12, totalStock: 40, colors: ['#5B6B3A', '#1A1A1A', '#FFFFFF'],
    image: 'assets/images/products/d02.jpg',
    desc: 'Runner hijau zaitun dengan sol putih tebal. Kombinasi utilitarian yang tetap ringan dipakai.',
  },
  {
    id: 'kc-d3', group: 'drop', name: 'Red Canvas Hi', category: 'skate',
    price: 999000, oldPrice: null, badge: 'limited', rating: 4.8, reviews: 52,
    stock: 3, totalStock: 30, colors: ['#C1272D', '#FFFFFF'],
    image: 'assets/images/products/d03.jpg',
    desc: 'Canvas high-top merah klasik dengan toe cap karet. Edisi kolektor dengan tali ekstra.',
  },
  {
    id: 'kc-d4', group: 'drop', name: 'Pastel Stack', category: 'lifestyle',
    price: 2399000, oldPrice: null, badge: 'limited', rating: 4.9, reviews: 29,
    stock: 9, totalStock: 35, colors: ['#F3E9DC', '#E86A33', '#6BA7D8'],
    image: 'assets/images/products/d04.jpg',
    desc: 'Panel berlapis dengan warna-warna playful dan sol bertumpuk. Desain eksperimental drop kali ini.',
  },
  {
    id: 'kc-d5', group: 'drop', name: 'Levitate Knit', category: 'running',
    price: 2599000, oldPrice: null, badge: 'limited', rating: 5.0, reviews: 18,
    stock: 4, totalStock: 25, colors: ['#9C9C9C', '#D4F75E'],
    image: 'assets/images/products/d05.jpg',
    desc: 'Upper rajut satu lapis yang membungkus kaki seperti kaus kaki, dengan aksen volt di sisi.',
  },
  {
    id: 'kc-d6', group: 'drop', name: 'Obsidian Low', category: 'lifestyle',
    price: 1899000, oldPrice: null, badge: 'limited', rating: 4.8, reviews: 63,
    stock: 15, totalStock: 60, colors: ['#111111', '#FFFFFF'],
    image: 'assets/images/products/d06.jpg',
    desc: 'Low-top hitam pekat dengan kontras putih. Bersih, tegas, dan cocok untuk segala suasana.',
  },
];
