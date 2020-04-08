import { Category } from "../enum/category";
import { Role } from "../enum/role";
import { NominationCategory } from "../enum/nomination-category";

export const API_URL = 'http://localhost:3000/database/';

export const ALL_CATEGORIES = [
    Category.Action,
    Category.Comedy,
    Category.Drama,
    Category.Romance,
    Category.Thriller
];

export const ALL_NOMINATIONS = [
    NominationCategory.Actor,
    NominationCategory.Actress,
    NominationCategory.International,
    NominationCategory.Makeup,
    NominationCategory.OrginalSong,
    NominationCategory.Soung,
    NominationCategory.VE
];

export const TITLE = 'title';

export const YOUTUBE_API = 'http://youtube.com/iframe_api';

export const CC_NUMBER_OF_DIGITS = 16;

export const CANADIAN_PROVINCES = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
];

export const DEFAULT_USER = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    adress: '',
    number: '',
    postalCode: '',
    city: '',
    state: '',
    country: 'Canada',
    isSubsc: false,
    fee: 0,
    dateSubsc: '0',
};

export const DEFAULT_MOVIE = {
    title: '',
    category: Category.None,
    productionDate: '',
    duration: 0,
    dvdPrice: 0,
    streamingFee: 0,
    movieURL: '',
    imageURL: '',
    participants: [],
    honors: [],
};

export const DEFAULT_PARTICIPANT = {
    name: '',
    dateOfbirth: '',
    nationality: '',
    sex: '',
    role: Role.None,
    salary: 0
};

export const ALL_ROLES = [
    Role.Actor,
    Role.Producer,
];

export const DEFAULT_CEREMONY = {
    date        :   '',
    location    :   '',
    host        :   '',
    winner      :   false,
    category    :   NominationCategory.None
}

export const POLYTECHNIQUE_POSTAL_CODE = 'H3T1J4';

export const MAPS_API_KEY = 'AIzaSyBwnIPWbcvxyKd0inqjMZZocyCIDUKPGkE';