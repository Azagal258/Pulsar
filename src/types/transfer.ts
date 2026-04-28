export type Transfers = Entry[];

export interface Entry {
    from: string;
    to: string;
    timestamp: string;
    collection: {
        collectionId: string;
    };
    objekt: {
        serial: number;
    };
    created_at_hr_loc: string;
};

export type TransferRenderer = RendererEnrty[];

export interface RendererEnrty {
    collection: string;
    serial: number;
    partner: string;
    transferType: string;
    timestamp: string;
};