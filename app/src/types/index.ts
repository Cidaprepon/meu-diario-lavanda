export interface DiaryEntry {
  id: string;
  text: string;
  image?: string;
  audio?: string;
  audioDuration?: number;
  createdAt: Date;
  mood?: 'happy' | 'calm' | 'sad' | 'excited' | 'grateful';
}

export interface MediaUpload {
  type: 'image' | 'audio';
  file: File;
  preview: string;
}

export type MoodType = 'happy' | 'calm' | 'sad' | 'excited' | 'grateful';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
}
