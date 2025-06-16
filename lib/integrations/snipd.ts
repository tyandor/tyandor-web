export interface SnipdSnippet {
  id: string
  text: string
  startTime: number
  endTime: number
  createdAt: string
  updatedAt: string
  episode: {
    id: string
    title: string
    description: string
    publishedAt: string
    podcast: {
      id: string
      title: string
      description: string
      imageUrl: string
    }
  }
  tags: string[]
  isPublic: boolean
}

export interface SnipdEpisode {
  id: string
  title: string
  description: string
  audioUrl: string
  publishedAt: string
  duration: number
  podcast: {
    id: string
    title: string
    description: string
    imageUrl: string
  }
}

export interface SnipdPodcast {
  id: string
  title: string
  description: string
  imageUrl: string
  episodeCount: number
}

export class SnipdClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.SNIPD_API_KEY!
    this.baseUrl = 'https://api.snipd.com/v1'
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: 3600 } // 1 hour cache
    })

    if (!response.ok) {
      throw new Error(`Snipd API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  public async getSnippets(limit: number = 50, offset: number = 0): Promise<SnipdSnippet[]> {
    const response = await this.makeRequest(`/snippets?limit=${limit}&offset=${offset}`)
    return response.data
  }

  public async getSnippetById(id: string): Promise<SnipdSnippet> {
    const response = await this.makeRequest(`/snippets/${id}`)
    return response.data
  }

  public async getSnippetsByEpisode(episodeId: string): Promise<SnipdSnippet[]> {
    const response = await this.makeRequest(`/episodes/${episodeId}/snippets`)
    return response.data
  }

  public async getEpisodes(limit: number = 50, offset: number = 0): Promise<SnipdEpisode[]> {
    const response = await this.makeRequest(`/episodes?limit=${limit}&offset=${offset}`)
    return response.data
  }

  public async getEpisodeById(id: string): Promise<SnipdEpisode> {
    const response = await this.makeRequest(`/episodes/${id}`)
    return response.data
  }

  public async getPodcasts(limit: number = 50, offset: number = 0): Promise<SnipdPodcast[]> {
    const response = await this.makeRequest(`/podcasts?limit=${limit}&offset=${offset}`)
    return response.data
  }

  public async searchSnippets(query: string, limit: number = 25): Promise<SnipdSnippet[]> {
    const response = await this.makeRequest(`/snippets/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    return response.data
  }

  public async createSnippet(episodeId: string, startTime: number, endTime: number, text?: string): Promise<SnipdSnippet> {
    const response = await this.makeRequest('/snippets', {
      method: 'POST',
      body: JSON.stringify({
        episodeId,
        startTime,
        endTime,
        text
      })
    })
    return response.data
  }

  public async updateSnippet(id: string, updates: Partial<Pick<SnipdSnippet, 'text' | 'tags' | 'isPublic'>>): Promise<SnipdSnippet> {
    const response = await this.makeRequest(`/snippets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    return response.data
  }

  public async deleteSnippet(id: string): Promise<void> {
    await this.makeRequest(`/snippets/${id}`, {
      method: 'DELETE'
    })
  }
}