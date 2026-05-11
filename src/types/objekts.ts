export type Objekts = Objekt[];

export interface Objekt {
    season: string;
    member: string;
    collectionNo: string;
    slug: string;
    frontImage: string;
    frontImage2x?: string
    collectionName?: string;
}