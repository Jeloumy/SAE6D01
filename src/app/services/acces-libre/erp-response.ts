// src/app/services/erp-response.ts

export interface ErpResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ErpResult[];
  }
  
  export interface ErpResult {
    geom: {
      coordinates: [number, number];
    };
    nom: string;
    adresse: string;
    // Ajoutez d'autres propriétés nécessaires ici
  }
  