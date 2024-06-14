export interface Handicap {
  id: number;
  handicap: string;
}

export interface DispositifLieu {
  id: number;
  name: string;
}

export interface SystemPreferences {
  colorBlindMode?: boolean;
  highContrast?: boolean;
  brightness?: number;
  blackAndWhite?: boolean;
  darkMode?: boolean,
  [key: string]: any;
}

export interface UserProfile {
  id: number;
  username: string;
  handicapList: Handicap[];
  dispositifLieu: DispositifLieu[];
  photo?: string;
  systemPreferences?: SystemPreferences;
}

export interface ERP {
  url: string;
  web_url: string;
  uuid: string;
  activite: {
    nom: string;
    slug: string;
  };
  nom: string;
  slug: string;
  adresse: string;
  commune: string;
  code_insee: string;
  code_postal: string;
  geom: {
    type: string;
    coordinates: [number, number];
  };
  ban_id: string;
  siret: string | null;
  telephone: string | null;
  site_internet: string | null;
  contact_email: string | null;
  contact_url: string | null;
  user_type: string;
  accessibilite: {
    url: string;
    erp: string;
    transport: {
      transport_station_presence: boolean | null;
      transport_information: string | null;
      stationnement_presence: boolean | null;
      stationnement_pmr: boolean | null;
      stationnement_ext_presence: boolean | null;
      stationnement_ext_pmr: boolean | null;
    };
    cheminement_ext: {
      cheminement_ext_presence: boolean | null;
      cheminement_ext_terrain_stable: boolean | null;
      cheminement_ext_plain_pied: boolean | null;
      cheminement_ext_ascenseur: boolean | null;
      cheminement_ext_nombre_marches: number | null;
      cheminement_ext_sens_marches: string | null;
      cheminement_ext_reperage_marches: boolean | null;
      cheminement_ext_main_courante: boolean | null;
      cheminement_ext_rampe: boolean | null;
      cheminement_ext_pente_presence: boolean | null;
      cheminement_ext_pente_degre_difficulte: string | null;
      cheminement_ext_pente_longueur: number | null;
      cheminement_ext_devers: string | null;
      cheminement_ext_bande_guidage: boolean | null;
      cheminement_ext_retrecissement: string | null;
    };
    entree: {
      entree_reperage: boolean | null;
      entree_porte_presence: boolean | null;
      entree_porte_manoeuvre: string | null;
      entree_porte_type: string | null;
      entree_vitree: boolean | null;
      entree_vitree_vitrophanie: boolean | null;
      entree_plain_pied: boolean | null;
      entree_ascenseur: boolean | null;
      entree_marches: number | null;
      entree_marches_sens: string | null;
      entree_marches_reperage: boolean | null;
      entree_marches_main_courante: boolean | null;
      entree_marches_rampe: boolean | null;
      entree_dispositif_appel: boolean | null;
      entree_dispositif_appel_type: string[];
      entree_balise_sonore: boolean | null;
      entree_aide_humaine: boolean | null;
      entree_largeur_mini: number;
      entree_pmr: boolean | null;
      entree_pmr_informations: string | null;
    };
    accueil: {
      accueil_visibilite: boolean | null;
      accueil_cheminement_plain_pied: boolean | null;
      accueil_cheminement_ascenseur: boolean | null;
      accueil_cheminement_nombre_marches: number | null;
      accueil_cheminement_sens_marches: string | null;
      accueil_cheminement_reperage_marches: boolean | null;
      accueil_cheminement_main_courante: boolean | null;
      accueil_cheminement_rampe: boolean | null;
      accueil_retrecissement: string | null;
      accueil_chambre_nombre_accessibles: number | null;
      accueil_chambre_douche_plain_pied: boolean | null;
      accueil_chambre_douche_siege: boolean | null;
      accueil_chambre_douche_barre_appui: boolean | null;
      accueil_chambre_sanitaires_barre_appui: boolean | null;
      accueil_chambre_sanitaires_espace_usage: boolean | null;
      accueil_chambre_numero_visible: boolean | null;
      accueil_chambre_equipement_alerte: boolean | null;
      accueil_chambre_accompagnement: boolean | null;
      accueil_personnels: string | null;
      accueil_audiodescription_presence: boolean | null;
      accueil_audiodescription: string[];
      accueil_equipements_malentendants_presence: boolean | null;
      accueil_equipements_malentendants: string[];
      sanitaires_presence: boolean | null;
      sanitaires_adaptes: boolean | null;
    };
    registre: {
      registre_url: string | null;
    };
    conformite: {
      conformite: boolean | null;
    };
    commentaire: {
      labels: string[];
      labels_familles_handicap: string[];
      labels_autre: string | null;
      commentaire: string | null;
    };
  };
  distance: number | null;
  source_id: string;
  asp_id: string | null;
  updated_at: string;
  created_at: string;
  published: boolean;
}

export interface Accessibilite {
  transport: {
    transport_station_presence: boolean | null;
    transport_information: string | null;
    stationnement_presence: boolean | null;
    stationnement_pmr: boolean | null;
    stationnement_ext_presence: boolean | null;
    stationnement_ext_pmr: boolean | null;
  };
  cheminement_ext: {
    cheminement_ext_presence: boolean | null;
    cheminement_ext_terrain_stable: boolean | null;
    cheminement_ext_plain_pied: boolean | null;
    cheminement_ext_ascenseur: boolean | null;
    cheminement_ext_nombre_marches: number | null;
    cheminement_ext_sens_marches: string | null;
    cheminement_ext_reperage_marches: boolean | null;
    cheminement_ext_main_courante: boolean | null;
    cheminement_ext_rampe: boolean | null;
    cheminement_ext_pente_presence: boolean | null;
    cheminement_ext_pente_degre_difficulte: string | null;
    cheminement_ext_pente_longueur: number | null;
    cheminement_ext_devers: string | null;
    cheminement_ext_bande_guidage: boolean | null;
    cheminement_ext_retrecissement: string | null;
  };
  entree: {
    entree_reperage: boolean | null;
    entree_porte_presence: boolean | null;
    entree_porte_manoeuvre: string | null;
    entree_porte_type: string | null;
    entree_vitree: boolean | null;
    entree_vitree_vitrophanie: boolean | null;
    entree_plain_pied: boolean | null;
    entree_ascenseur: boolean | null;
    entree_marches: number | null;
    entree_marches_sens: string | null;
    entree_marches_reperage: boolean | null;
    entree_marches_main_courante: boolean | null;
    entree_marches_rampe: boolean | null;
    entree_dispositif_appel: boolean | null;
    entree_dispositif_appel_type: string[];
    entree_balise_sonore: boolean | null;
    entree_aide_humaine: boolean | null;
    entree_largeur_mini: number | null;
    entree_pmr: boolean | null;
    entree_pmr_informations: string | null;
  };
  accueil: {
    accueil_visibilite: boolean | null;
    accueil_cheminement_plain_pied: boolean | null;
    accueil_cheminement_ascenseur: boolean | null;
    accueil_cheminement_nombre_marches: number | null;
    accueil_cheminement_sens_marches: string | null;
    accueil_cheminement_reperage_marches: boolean | null;
    accueil_cheminement_main_courante: boolean | null;
    accueil_cheminement_rampe: boolean | null;
    accueil_retrecissement: string | null;
    accueil_chambre_nombre_accessibles: number | null;
    accueil_chambre_douche_plain_pied: boolean | null;
    accueil_chambre_douche_siege: boolean | null;
    accueil_chambre_douche_barre_appui: boolean | null;
    accueil_chambre_sanitaires_barre_appui: boolean | null;
    accueil_chambre_sanitaires_espace_usage: boolean | null;
    accueil_chambre_numero_visible: boolean | null;
    accueil_chambre_equipement_alerte: boolean | null;
    accueil_chambre_accompagnement: boolean | null;
    accueil_personnels: string | null;
    accueil_audiodescription_presence: boolean | null;
    accueil_audiodescription: string[];
    accueil_equipements_malentendants_presence: boolean | null;
    accueil_equipements_malentendants: string[];
    sanitaires_presence: boolean | null;
    sanitaires_adaptes: boolean | null;
  };
  registre: {
    registre_url: string | null;
  };
  conformite: {
    conformite: boolean | null;
  };
  commentaire: {
    labels: string[];
    labels_familles_handicap: string[];
    labels_autre: string | null;
    commentaire: string | null;
  };
}
