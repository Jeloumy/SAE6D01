// dispositif-mapping.ts

export const dispositifMapping: { [key: string]: string } = {
  "Chemin vers l'accueil accessible": 'having_accessible_exterior_path',
  "Dispositif d'appel à l'entrée": 'having_entry_call_device',
  "Proximité de l'accueil": 'having_visible_reception',
  'Présence de personnel': 'having_staff',
  'Personnel sensibilisé ou formé': 'having_trained_staff',
  'Audiodescription': 'having_audiodescription',
  'Equipements spécifiques pour personne malentendante':
    'having_hearing_equipments',
  "Chemin sans rétrécissement jusqu'à l'accueil ou information inconnue":
    'having_entry_no_shrink',
  'Chambre accessible': 'having_accessible_rooms',
  'Toilettes PMR': 'having_adapted_wc',
  'Établissement labellisé': 'having_label',
  'Stationnement à proximité': 'having_parking',
  'Transport en commun à proximité': 'having_public_transportation',
  "Stationnement PMR (dans l'établissement ou à proximité)":
    'having_adapted_parking',
  "Maximum une marche à l'entrée": 'having_path_low_stairs',
  "Maximum une marche à l'accueil": 'having_entry_low_stairs',
  'Entrée accessible': 'having_accessible_entry',
  'Largeur de porte supérieure à 80cm ou information inconnue':
    'having_entry_min_width',
  'Entrée spécifique PMR': 'having_adapted_entry',
  'Balise sonore': 'having_sound_beacon',
  'Pas de chemin extérieur ou information inconnue': 'having_no_path',
  'Chemin adapté aux personnes mal marchantes': 'having_adapted_path',
  'Extérieur - plain-pied ou accessible via rampe ou ascenseur':
    'having_reception_low_stairs',
  'Chemin extérieur accessible': 'having_accessible_path_to_reception',
  'Extérieur - bande de guidage': 'having_guide_band',
};
