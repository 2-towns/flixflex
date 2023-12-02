export const API_URL = "https://api.themoviedb.org";
export const API_ITEMS_PER_PAGE = 20;
export const IMAGE_URL = "https://image.tmdb.org";
export const ITEMS_PER_PAGE = 10;

// Since the api returns 20 results and we want 10
// we need to convert our current page to the api corresponding
// page. So for example the page 2 for us, will the
// the page 1 for the api.
export const API_RATIO = ITEMS_PER_PAGE / API_ITEMS_PER_PAGE;

export const YOUTUBE_URL = "https://www.youtube.com/embed/";
export const VIEMO_URL = "https://vimeo.com/";
