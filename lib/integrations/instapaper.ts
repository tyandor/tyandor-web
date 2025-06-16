import { InstapaperAuth } from './instapaper-auth'

export interface InstapaperBookmark {
  bookmark_id: string
  url: string
  title: string
  description: string
  time: number
  starred: '0' | '1'
  progress: number
  progress_timestamp: number
}

export interface InstapaperFolder {
  folder_id: string
  title: string
  display_title: string
  sync_to_mobile: number
  position: number
}

export class InstapaperClient {
  private auth: InstapaperAuth

  constructor() {
    this.auth = new InstapaperAuth()
  }

  private async makeAuthenticatedRequest(endpoint: string, params: Record<string, string> = {}) {
    const url = `https://www.instapaper.com/api/1.1${endpoint}`
    const authHeader = this.auth.generateAuthHeader('POST', url, params)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
      next: { revalidate: 1800 } // 30 minutes
    })

    if (!response.ok) {
      throw new Error(`Instapaper API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  public async getBookmarks(limit: number = 25, folderId?: string): Promise<InstapaperBookmark[]> {
    const params: Record<string, string> = {
      limit: limit.toString()
    }

    if (folderId) {
      params.folder_id = folderId
    }

    const response = await this.makeAuthenticatedRequest('/bookmarks/list', params)
    return response
  }

  public async getFolders(): Promise<InstapaperFolder[]> {
    const response = await this.makeAuthenticatedRequest('/folders/list')
    return response
  }

  public async addBookmark(url: string, title?: string, description?: string): Promise<InstapaperBookmark> {
    const params: Record<string, string> = { url }
    
    if (title) params.title = title
    if (description) params.description = description

    const response = await this.makeAuthenticatedRequest('/bookmarks/add', params)
    return response
  }

  public async getBookmarkText(bookmarkId: string): Promise<string> {
    const response = await this.makeAuthenticatedRequest('/bookmarks/get_text', {
      bookmark_id: bookmarkId
    })
    return response
  }
}