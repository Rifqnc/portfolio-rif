export const ja = {
  nav: { home: 'ホーム', works: '作品', about: 'プロフィール', contact: 'お問い合わせ' },
  intro: { enter: 'クリックして入る', sub: 'イラストレーター · モデラー · 創造者' },
  hero: { title: '創造の書', sub: 'イラストレーター & モデラー' },
  about: { title: 'プロフィール', body: 'キャラクターイラスト、VTuberアセット、SDキャラクター、ロゴなど幅広い作品を手がける日本のアーティストです。' },
  sections: {
    vtuber: 'VTuberイラスト',
    sdChars: 'SDキャラクター',
    sdIllus: 'SDイラスト',
    sdIcons: 'SDアイコン',
    logo: 'ロゴ',
    badge: 'メンバーシップバッジ',
  },
  quest: { label: 'クエスト', rank: 'ランク', view: '依頼を見る' },
  footer: { copy: '© 2026 All rights reserved.' },
  lang: 'EN',
};

export const en = {
  nav: { home: 'Home', works: 'Works', about: 'About', contact: 'Contact' },
  intro: { enter: 'Click to Enter', sub: 'Illustrator · Modeler · Creator' },
  hero: { title: 'Book of Creation', sub: 'Illustrator & Modeler' },
  about: { title: 'About', body: 'A Japanese artist specialising in character illustrations, VTuber assets, SD characters, logos and more.' },
  sections: {
    vtuber: 'vTuber Illustrations',
    sdChars: 'SD Characters',
    sdIllus: 'SD Illustrations',
    sdIcons: 'SD Icons',
    logo: 'Logos & Sigils',
    badge: 'Membership Badges',
  },
  quest: { label: 'Quest', rank: 'Rank', view: 'View Quest' },
  footer: { copy: '© 2026 All rights reserved.' },
  lang: 'JP',
};

export type Lang = 'ja' | 'en';
export type T = typeof ja;
