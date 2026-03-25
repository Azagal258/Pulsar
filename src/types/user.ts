export interface UserProfile {
  artistId: string
  artistName: string
  image: {
    original: string
    thumbnail: string
  }
}

export interface User {
  id: number
  address: string
  profileImageUrl: string
  nickname: string
  userProfiles: UserProfile[]
}