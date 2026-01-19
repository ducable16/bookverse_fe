import apiClient from '@/lib/api-client';

interface SpeakRequest {
  text: string;
}

export const ttsService = {
  async speak(text: string): Promise<Blob> {
    const response = await apiClient.post('/tts', { text }, {
      responseType: 'blob',
      headers: {
        Accept: 'audio/wav, application/octet-stream',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
