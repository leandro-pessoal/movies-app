export const BASE_URL = 'https://api.themoviedb.org/3';
export const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzBiOTU1MWJjM2ViNDcxNWZhMGNkNjQyMWIzZjY0YyIsInN1YiI6IjY1MWI4NTEwNzQ1MDdkMDBhYzQ2MzgyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2hULmJzVC6zxC-uNqknUMeYrsDJFjf5H4I_PD7ppLW8'

export async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
}

export async function getNowPlaying(page) {
  const response = await fetchWithToken(`${BASE_URL}/movie/now_playing?page=${page}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
}

export async function getPopular(userId, page = 1) {
  // Prefer custom "most popular" endpoint which returns a ranked list
  // of popular movies (with tmdbId). Map each item to full TMDB movie
  // objects so the UI can render them just like other lists.
  try {
    const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/get_most_popular${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`;
    const res = await fetch(url);
    const json = await res.json();

    const recommendations = Array.isArray(json) ? json : [];

    const mapped = await Promise.all(recommendations.map(async (rec) => {
      const id = Number(rec.tmdbId ?? rec.movieId ?? rec.id);
      if (!id) return null;
      try {
        const r = await fetchWithToken(`${BASE_URL}/movie/${id}`);
        const j = await r.json();
        return j;
      } catch (e) {
        return null;
      }
    }));

    const filtered = mapped.filter(Boolean);
    return { error: false, data: filtered, total_pages: 1 };
  } catch (e) {
    // fallback to TMDB popular endpoint if custom endpoint fails
    try {
      const response = await fetchWithToken(`${BASE_URL}/movie/popular?page=${page}`);
      const responseJson = await response.json();
      return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
    } catch (err) {
      return { error: true, data: [], total_pages: 0 };
    }
  }
}

export async function getTopTated(page) {
  const response = await fetchWithToken(`${BASE_URL}/movie/top_rated?page=${page}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
}

export async function getUpcoming(page) {
  const response = await fetchWithToken(`${BASE_URL}/movie/upcoming?page=${page}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
}

export async function getMovieDetail(id) {
  const response = await fetchWithToken(`${BASE_URL}/movie/${id}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson };
}

export async function getMovieRecommendations(id, page) {
  const response = await fetchWithToken(`${BASE_URL}/movie/${id}/recommendations?page=${page}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
}

export async function getMovieVideos(id) {
  const response = await fetchWithToken(`${BASE_URL}/movie/${id}/videos`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results };
}

export async function getSearchMovie(query, page) {
  const response = await fetchWithToken(`${BASE_URL}/search/movie?query=${query}&page=${page}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results, total_pages: responseJson.total_pages };
}

/**
 * Fetches the latest trending movie data based on a time window.
 *
 * @async
 * @function
 * @param {boolean} time_window - A boolean value indicating whether to fetch data for the 'day' or 'week' time window.
 * @returns {Promise<{error: boolean, data: any}>} A promise that resolves to an object containing fetched data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch trending movies for the 'day' time window
 * const trendingMovies = await getLatestMovie(true);
 *
 * // Fetch trending movies for the 'week' time window
 * const trendingMovies = await getLatestMovie(false);
 */
export async function getLatestMovie(time_window) {
  const response = await fetchWithToken(`${BASE_URL}/trending/movie/${time_window ? 'day' : 'week'}`);
  const responseJson = await response.json();

  return { error: false, data: responseJson.results };
}

/**
 * Fetch personalized recommendations for a user from the AWS API Gateway endpoint.
 *
 * @async
 * @function
 * @param {number|string} userId - The id of the user to get recommendations for.
 * @returns {Promise<{error: boolean, data: Array}>} A promise that resolves to an object with recommendation data.
 *
 * Example response shape: [{ movieId, title, genres, imdbId, tmdbId, rank, score }, ...]
 */
export async function getRecomendation(userId) {
  const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/get_recomendation?userId=${userId}`;
  const response = await fetch(url);
  const responseJson = await response.json();

  return { error: false, data: responseJson };
}

/**
 * Fetch personalized recommendations for a given user and a selected tmdb movie id.
 * This will call the custom AWS endpoint and then fetch TMDB movie details
 * for each recommended item so the UI can use the same movie shape as TMDB.
 *
 * @param {number|string} userId
 * @param {number|string} tmdbId
 * @param {number} page (optional) - kept for API compatibility with components (ignored here)
 * @returns {Promise<{error:boolean, data:Array, total_pages:number}>}
 */
export async function getRecomendationX(userId, tmdbId, page = 1) {
  const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/get_recomendation_x?userId=${userId}&tmdbId=${tmdbId}`;
  const response = await fetch(url);
  const responseJson = await response.json();

  // Expected responseJson is an array of recommendation objects containing at least a tmdbId or movieId
  const recommendations = Array.isArray(responseJson) ? responseJson : [];

  // Map recommended items to full TMDB movie objects so components like MovieCard can render normally
  const mapped = await Promise.all(recommendations.map(async (rec) => {
    const id = rec.tmdbId ?? rec.movieId ?? rec.id;
    if (!id) return null;
    try {
      const res = await fetchWithToken(`${BASE_URL}/movie/${id}`);
      const json = await res.json();
      return json;
    } catch (e) {
      return null;
    }
  }));

  const filtered = mapped.filter(Boolean);

  return { error: false, data: filtered, total_pages: 1 };
}

/**
 * Fetch trending-now personalized list from the AWS endpoint and map
 * each item to full TMDB movie objects so the UI can render them.
 */
export async function getTrendingNow() {
  try {
    const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/get_trending_now`;
    const res = await fetch(url);
    const json = await res.json();

    const recommendations = Array.isArray(json) ? json : [];

    const mapped = await Promise.all(recommendations.map(async (rec) => {
      const id = Number(rec.tmdbId ?? rec.movieId ?? rec.id);
      if (!id) return null;
      try {
        const r = await fetchWithToken(`${BASE_URL}/movie/${id}`);
        const j = await r.json();
        return j;
      } catch (e) {
        return null;
      }
    }));

    const filtered = mapped.filter(Boolean);
    return { error: false, data: filtered, total_pages: 1 };
  } catch (e) {
    // fallback to TMDB trending (day) if custom endpoint fails
    try {
      return await getLatestMovie(true);
    } catch (err) {
      return { error: true, data: [], total_pages: 0 };
    }
  }
}

/**
 * Send user interaction event to AWS Personalize
 * @param {number|string} userId - The user ID
 * @param {number|string} tmdbId - The TMDB movie ID
 * @returns {Promise<{error: boolean}>}
 */
export async function putEvent(userId, tmdbId) {
  try {
    const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/put_event?userId=${userId}&tmdbId=${tmdbId}`;
    await fetch(url, { method: 'PUT' });
    return { error: false };
  } catch (e) {
    return { error: true };
  }
}
