
export interface AnniversaryState {
  background: string;
  backgroundType: 'color' | 'gradient' | 'image';
  partnerName: string;
}

export interface LoveMessage {
  text: string;
  author: string;
}

export interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}
