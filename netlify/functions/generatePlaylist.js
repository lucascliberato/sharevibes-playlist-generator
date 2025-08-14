/**
 * 🎵 VIBES PLAYLIST GENERATOR - FIXED PRECISE PATH + EXPANDED CONTEXTS (v2.2)
 * 
 * MAJOR FIXES v2.2:
 * - ✅ FIXED: Precise Path now works with artist names (not track IDs)
 * - ✅ NEW: 8 expanded contexts including "dancing", "party", "workout"
 * - ✅ IMPROVED: Artist-based search with genre matching
 * - ✅ ENHANCED: Context-aware music filtering
 * - ✅ FIXED: Proper error handling for artist searches
 * 
 * Result: Precise Path delivers music that actually matches the seed artists!
 */

const fetch = require('node-fetch');

/**
 * 🔐 FUNÇÃO PARA OBTER TOKEN DE ACESSO DO SPOTIFY
 */
async function getSpotifyAccessToken() {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
            throw new Error('❌ SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET não configurados nas variáveis de ambiente');
        }
        
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const authBody = new URLSearchParams({ grant_type: 'client_credentials' });
        
        console.log('🔄 Fazendo requisição de autenticação para o Spotify...');
        
        const authResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: authBody
        });
        
        if (!authResponse.ok) {
            const errorData = await authResponse.text();
            throw new Error(`❌ Falha na autenticação Spotify: ${authResponse.status} - ${errorData}`);
        }
        
        const authData = await authResponse.json();
        console.log('✅ Token de acesso obtido com sucesso!');
        
        return {
            access_token: authData.access_token,
            token_type: authData.token_type,
            expires_in: authData.expires_in
        };
        
    } catch (error) {
        console.error('❌ Erro na autenticação Spotify:', error.message);
        throw error;
    }
}

/**
 * 🎨 FORMATAR PLAYLIST FINAL
 */
function formatPlaylistResults(tracks) {
    return tracks.map(track => {
        const title = track.name || 'Unknown Title';
        const artist = track.artists && track.artists[0] ? track.artists[0].name : 'Unknown Artist';
        const albumCover = track.album && track.album.images && track.album.images[0] 
            ? track.album.images[0].url 
            : null;
        const spotifyUrl = track.external_urls && track.external_urls.spotify 
            ? track.external_urls.spotify 
            : null;
        
        const searchQuery = encodeURIComponent(`${artist} ${title}`);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        
        return {
            title,
            artist,
            albumCover,
            spotifyUrl,
            youtubeUrl
        };
    });
}

/**
 * 🎯 FUNÇÃO PRINCIPAL PARA OBTER RECOMENDAÇÕES (FIXED)
 */
async function getSpotifyRecommendations(accessToken, requestData) {
    try {
        console.log(`🔄 Processando ${requestData.path} path com FIXED Search API...`);
        
        let searchResults = [];
        
        if (requestData.path === 'quick') {
            searchResults = await searchByGenresOptimized(accessToken, requestData);
        } else if (requestData.path === 'precise') {
            // FIXED: Now uses artist names instead of fake track IDs
            searchResults = await searchByArtistNames(accessToken, requestData);
        } else {
            throw new Error(`❌ Path inválido: ${requestData.path}. Use 'quick' ou 'precise'`);
        }
        
        console.log(`🔍 Total de tracks encontradas: ${searchResults.length}`);
        
        const uniqueTracks = removeDuplicatesAdvanced(searchResults);
        console.log(`🔄 Após remoção avançada de duplicatas: ${uniqueTracks.length} tracks`);
        
        const diverseTracks = diversityShuffleAdvanced(uniqueTracks);
        console.log(`🎲 Tracks embaralhadas com diversidade: ${diverseTracks.length}`);
        
        const limitedTracks = diverseTracks.slice(0, 15);
        console.log(`✂️ Limitado a: ${limitedTracks.length} tracks`);
        
        const formattedPlaylist = formatPlaylistResults(limitedTracks);
        console.log(`✅ Playlist FIXED formatada com ${formattedPlaylist.length} músicas`);
        
        return {
            tracks: formattedPlaylist,
            metadata: {
                total_found: searchResults.length,
                after_deduplication: uniqueTracks.length,
                final_count: formattedPlaylist.length,
                path: requestData.path,
                method: 'fixed_search_api',
                diversity_level: 'high'
            }
        };
        
    } catch (error) {
        console.error('❌ Erro ao obter recomendações:', error.message);
        throw error;
    }
}

/**
 * 🎤 BUSCAR POR NOMES DE ARTISTAS (FIXED PRECISE PATH)
 * 
 * Esta função substitui completamente a searchBySeedTracksOptimized quebrada.
 * Agora funciona com nomes de artistas em vez de track IDs falsos.
 */
async function searchByArtistNames(accessToken, requestData) {
    if (!requestData.seed_artists || requestData.seed_artists.length === 0) {
        throw new Error('❌ Precise Path requer pelo menos um nome de artista em seed_artists');
    }
    
    const allTracks = [];
    const context = requestData.context || {};
    
    console.log(`🎤 Processando ${requestData.seed_artists.length} artistas seed:`, requestData.seed_artists);
    
    // For each seed artist, find similar music
    for (const artistName of requestData.seed_artists.slice(0, 3)) {
        try {
            console.log(`🔍 Buscando músicas relacionadas a: "${artistName}"`);
            
            // Strategy 1: Direct artist search
            const directTracks = await searchArtistDirect(accessToken, artistName, context);
            if (directTracks.length > 0) {
                allTracks.push(...directTracks);
                console.log(`   ✅ Encontradas ${directTracks.length} tracks diretas do artista`);
            }
            
            // Strategy 2: Similar artists search
            const similarTracks = await searchSimilarArtists(accessToken, artistName, context);
            if (similarTracks.length > 0) {
                allTracks.push(...similarTracks);
                console.log(`   ✅ Encontradas ${similarTracks.length} tracks de artistas similares`);
            }
            
            // Strategy 3: Genre-based search
            const genreTracks = await searchByArtistGenre(accessToken, artistName, context);
            if (genreTracks.length > 0) {
                allTracks.push(...genreTracks);
                console.log(`   ✅ Encontradas ${genreTracks.length} tracks do mesmo gênero`);
            }
            
            // Strategy 4: Context-enhanced search
            const contextTracks = await searchArtistWithContext(accessToken, artistName, context);
            if (contextTracks.length > 0) {
                allTracks.push(...contextTracks);
                console.log(`   ✅ Encontradas ${contextTracks.length} tracks com contexto aplicado`);
            }
            
            // Small delay between artists
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.warn(`⚠️ Erro ao processar artista "${artistName}":`, error.message);
        }
    }
    
    console.log(`🎯 Total coletado para Precise Path: ${allTracks.length} tracks`);
    return allTracks;
}

/**
 * 🎵 BUSCA DIRETA POR ARTISTA
 */
async function searchArtistDirect(accessToken, artistName, context) {
    const tracks = [];
    
    try {
        // Search for the artist's most popular tracks
        const searchQuery = `artist:"${artistName}"`;
        const response = await performSpotifySearch(accessToken, searchQuery, 15, 'artist_direct');
        
        if (response && response.length > 0) {
            tracks.push(...response);
        }
        
        // Also search without quotes for broader results
        const broadQuery = `artist:${artistName}`;
        const broadResponse = await performSpotifySearch(accessToken, broadQuery, 10, 'artist_broad');
        
        if (broadResponse && broadResponse.length > 0) {
            tracks.push(...broadResponse);
        }
        
    } catch (error) {
        console.warn(`⚠️ Erro na busca direta por "${artistName}":`, error.message);
    }
    
    return tracks;
}

/**
 * 🔎 BUSCA POR ARTISTAS SIMILARES
 */
async function searchSimilarArtists(accessToken, artistName, context) {
    const tracks = [];
    
    try {
        // Search for similar artists
        const queries = [
            `${artistName} similar artists`,
            `like ${artistName} recommendations`,
            `fans of ${artistName}`
        ];
        
        for (const query of queries) {
            const response = await performSpotifySearch(accessToken, query, 8, 'similar_artists');
            if (response && response.length > 0) {
                tracks.push(...response);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
    } catch (error) {
        console.warn(`⚠️ Erro na busca por similares a "${artistName}":`, error.message);
    }
    
    return tracks;
}

/**
 * 🏷️ BUSCA POR GÊNERO DO ARTISTA
 */
async function searchByArtistGenre(accessToken, artistName, context) {
    const tracks = [];
    
    try {
        // First, try to find the artist to get their genres
        const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (artistResponse.ok) {
            const artistData = await artistResponse.json();
            const artist = artistData.artists?.items?.[0];
            
            if (artist && artist.genres && artist.genres.length > 0) {
                // Use the artist's actual genres
                const genre = artist.genres[0];
                console.log(`   🏷️ Gênero detectado para ${artistName}: ${genre}`);
                
                const genreQuery = `genre:"${genre}"`;
                const response = await performSpotifySearch(accessToken, genreQuery, 12, 'artist_genre');
                
                if (response && response.length > 0) {
                    tracks.push(...response);
                }
            }
        }
        
        // Fallback: Use common genre patterns
        const genreGuesses = [
            `${artistName} rock`,
            `${artistName} folk`,
            `${artistName} alternative`,
            `${artistName} indie`
        ];
        
        for (const query of genreGuesses.slice(0, 2)) {
            const response = await performSpotifySearch(accessToken, query, 5, 'genre_guess');
            if (response && response.length > 0) {
                tracks.push(...response);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
    } catch (error) {
        console.warn(`⚠️ Erro na busca por gênero de "${artistName}":`, error.message);
    }
    
    return tracks;
}

/**
 * 🎯 BUSCA COM CONTEXTO APLICADO
 */
async function searchArtistWithContext(accessToken, artistName, context) {
    const tracks = [];
    
    try {
        let contextTerms = [];
        
        // Apply context-specific search terms
        if (context.target_instrumentalness && context.target_instrumentalness > 0.6) {
            contextTerms.push('instrumental');
        }
        
        if (context.max_energy && context.max_energy < 0.4) {
            contextTerms.push('chill', 'relaxing');
        } else if (context.max_energy && context.max_energy > 0.7) {
            contextTerms.push('energetic', 'upbeat');
        }
        
        if (context.target_danceability && context.target_danceability > 0.7) {
            contextTerms.push('dance', 'groove');
        }
        
        // Create context-enhanced queries
        for (const term of contextTerms.slice(0, 2)) {
            const query = `${artistName} ${term}`;
            const response = await performSpotifySearch(accessToken, query, 6, 'context_enhanced');
            
            if (response && response.length > 0) {
                tracks.push(...response);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
    } catch (error) {
        console.warn(`⚠️ Erro na busca com contexto para "${artistName}":`, error.message);
    }
    
    return tracks;
}

/**
 * 🔍 FUNÇÃO AUXILIAR PARA REALIZAR BUSCAS NO SPOTIFY
 */
async function performSpotifySearch(accessToken, query, limit = 20, searchType = 'generic') {
    try {
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=US`;
        
        const response = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
                // Tag tracks with search type for diversity tracking
                return data.tracks.items.map(track => ({
                    ...track,
                    _searchStrategy: searchType,
                    _searchQuery: query
                }));
            }
        } else {
            console.warn(`⚠️ Busca falhou para "${query}" - Status: ${response.status}`);
        }
        
        return [];
        
    } catch (error) {
        console.warn(`⚠️ Erro na busca "${query}":`, error.message);
        return [];
    }
}

/**
 * 🎵 BUSCAR POR GÊNEROS COM ALTA DIVERSIDADE (Quick Path - mantido da versão anterior)
 */
async function searchByGenresOptimized(accessToken, requestData) {
    const allTracks = [];
    const searchStrategies = generateDiverseSearchStrategies(requestData);
    
    console.log(`🔍 Estratégias de busca geradas: ${searchStrategies.length}`);
    console.log('📋 Estratégias:', searchStrategies.map(s => s.description));
    
    for (const strategy of searchStrategies) {
        try {
            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(strategy.query)}&type=track&limit=30&market=US`;
            
            console.log(`🔍 [${strategy.type}] ${strategy.description}: ${strategy.query}`);
            
            const response = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
                    const taggedTracks = data.tracks.items.map(track => ({
                        ...track,
                        _searchStrategy: strategy.type,
                        _searchDescription: strategy.description
                    }));
                    allTracks.push(...taggedTracks);
                    console.log(`   ✅ Encontradas: ${data.tracks.items.length} tracks`);
                } else {
                    console.log(`   ⚠️ Nenhuma track encontrada`);
                }
            } else {
                console.warn(`   ❌ Busca falhou - Status: ${response.status}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 150));
            
        } catch (error) {
            console.warn(`⚠️ Erro na estratégia "${strategy.description}":`, error.message);
        }
    }
    
    console.log(`🎯 Total coletado de ${searchStrategies.length} estratégias: ${allTracks.length} tracks`);
    return allTracks;
}

/**
 * 🔤 GERAR ESTRATÉGIAS DIVERSAS DE BUSCA (mantido da versão anterior)
 */
function generateDiverseSearchStrategies(requestData) {
    const genres = requestData.genres || [];
    const context = requestData.context || {};
    const strategies = [];
    
    // Basic genre searches
    genres.forEach(genre => {
        strategies.push({
            type: 'genre_basic',
            query: `genre:${genre}`,
            description: `Genre: ${genre}`
        });
    });
    
    // Underground/hipster music
    genres.forEach(genre => {
        strategies.push({
            type: 'genre_hipster',
            query: `genre:${genre} tag:hipster`,
            description: `Underground ${genre}`
        });
    });
    
    // Recent releases
    if (genres.length > 0) {
        strategies.push({
            type: 'recent',
            query: `genre:${genres[0]} tag:new`,
            description: `New releases in ${genres[0]}`
        });
    }
    
    // Decade-based searches
    const decades = ['2020-2025', '2010-2019', '2000-2009', '1990-1999'];
    const selectedDecades = decades.slice(0, 2);
    
    genres.forEach(genre => {
        selectedDecades.forEach(decade => {
            strategies.push({
                type: 'temporal',
                query: `genre:${genre} year:${decade}`,
                description: `${genre} from ${decade}`
            });
        });
    });
    
    // Context-enhanced searches
    if (context.target_instrumentalness && context.target_instrumentalness > 0.6) {
        strategies.push({
            type: 'context_instrumental',
            query: `instrumental ${genres.join(' OR ')}`,
            description: 'Instrumental focus music'
        });
    }
    
    if (context.max_energy && context.max_energy < 0.5) {
        strategies.push({
            type: 'context_chill',
            query: `chill ambient ${genres.join(' OR ')}`,
            description: 'Chill and ambient vibes'
        });
    } else {
        strategies.push({
            type: 'context_energetic',
            query: `energetic upbeat ${genres.join(' OR ')}`,
            description: 'Energetic upbeat tracks'
        });
    }
    
    // Genre combinations
    if (genres.length >= 2) {
        for (let i = 0; i < genres.length - 1; i++) {
            strategies.push({
                type: 'genre_combination',
                query: `genre:${genres[i]} genre:${genres[i + 1]}`,
                description: `${genres[i]} + ${genres[i + 1]} fusion`
            });
        }
    }
    
    return strategies;
}

/**
 * 🔄 REMOÇÃO AVANÇADA DE DUPLICATAS (mantido da versão anterior)
 */
function removeDuplicatesAdvanced(tracks) {
    const seen = new Map();
    const result = [];
    
    for (const track of tracks) {
        const trackId = track.id;
        const artistTitle = `${track.artists[0]?.name}-${track.name}`.toLowerCase();
        const isrcKey = track.external_ids?.isrc;
        
        if (!seen.has(trackId) && !seen.has(artistTitle) && !seen.has(isrcKey)) {
            seen.set(trackId, true);
            seen.set(artistTitle, true);
            if (isrcKey) seen.set(isrcKey, true);
            
            result.push(track);
        }
    }
    
    return result;
}

/**
 * 🎲 EMBARALHAMENTO AVANÇADO COM DIVERSIDADE (mantido da versão anterior)
 */
function diversityShuffleAdvanced(tracks) {
    const groups = {};
    
    tracks.forEach(track => {
        const strategy = track._searchStrategy || 'unknown';
        if (!groups[strategy]) groups[strategy] = [];
        groups[strategy].push(track);
    });
    
    Object.keys(groups).forEach(strategy => {
        groups[strategy] = shuffleArray(groups[strategy]);
    });
    
    const result = [];
    const groupKeys = Object.keys(groups);
    let maxLength = Math.max(...Object.values(groups).map(group => group.length));
    
    for (let i = 0; i < maxLength; i++) {
        for (const strategy of groupKeys) {
            if (groups[strategy][i]) {
                result.push(groups[strategy][i]);
            }
        }
    }
    
    return shuffleArray(result);
}

/**
 * 🎲 EMBARALHAR ARRAY
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 🔗 EXTRAIR PARÂMETROS DA URL - EXPANDED CONTEXTS
 */
function extractQueryParameters(event) {
    const queryParams = event.queryStringParameters || {};
    
    if (Object.keys(queryParams).length === 0) {
        return null;
    }
    
    console.log('🔗 Query parameters detectados:', queryParams);
    
    const extractedData = {};
    
    // EXPANDED CONTEXT MAPPING - Now includes dancing, party, workout, etc.
    const contextMapping = {
        // Work contexts (original)
        'focus': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.7,
                max_energy: 0.5,
                target_danceability: 0.4
            }
        },
        'creative': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.4,
                max_energy: 0.7,
                target_danceability: 0.6
            }
        },
        'admin': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.3,
                max_energy: 0.6,
                target_danceability: 0.7
            }
        },
        'casual': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.5,
                max_energy: 0.5,
                target_danceability: 0.5
            }
        },
        
        // NEW CONTEXTS - Activity-based
        'dancing': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.1,
                max_energy: 0.9,
                target_danceability: 0.9
            }
        },
        'party': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.2,
                max_energy: 0.8,
                target_danceability: 0.8
            }
        },
        'workout': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.3,
                max_energy: 0.9,
                target_danceability: 0.7
            }
        },
        'study': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.8,
                max_energy: 0.3,
                target_danceability: 0.2
            }
        },
        'sleep': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.9,
                max_energy: 0.1,
                target_danceability: 0.1
            }
        },
        'drive': {
            path: 'quick',
            context: {
                target_instrumentalness: 0.4,
                max_energy: 0.6,
                target_danceability: 0.6
            }
        }
    };
    
    extractedData.path = queryParams.path || 'quick';
    
    if (queryParams.context && contextMapping[queryParams.context]) {
        extractedData.context = contextMapping[queryParams.context].context;
        console.log(`🎯 Contexto aplicado: ${queryParams.context}`);
    }
    
    if (queryParams.genres) {
        extractedData.genres = queryParams.genres.split(',').map(g => g.trim());
        console.log(`🎵 Gêneros aplicados: ${extractedData.genres.join(', ')}`);
    }
    
    if (queryParams.mood && extractedData.context) {
        const moodAdjustments = {
            'calm': { max_energy: 0.3, target_instrumentalness: 0.8 },
            'energetic': { max_energy: 0.8, target_instrumentalness: 0.2 },
            'ambient': { max_energy: 0.2, target_instrumentalness: 0.9 },
            'uplifting': { max_energy: 0.7, target_danceability: 0.8 }
        };
        
        if (moodAdjustments[queryParams.mood]) {
            Object.assign(extractedData.context, moodAdjustments[queryParams.mood]);
            console.log(`😊 Mood aplicado: ${queryParams.mood}`);
        }
    }
    
    return extractedData;
}

/**
 * 🚀 FUNÇÃO PRINCIPAL DA NETLIFY (HANDLER)
 */
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    try {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }
        
        let requestData;
        
        if (event.httpMethod === 'GET') {
            const queryData = extractQueryParameters(event);
            
            if (!queryData) {
                return {
                    statusCode: 400,
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Insufficient parameters',
                        message: 'For GET requests, provide parameters: ?context=dancing&genres=electronic,dance',
                        available_contexts: ['focus', 'creative', 'admin', 'casual', 'dancing', 'party', 'workout', 'study', 'sleep', 'drive']
                    })
                };
            }
            
            requestData = queryData;
            console.log('🔗 Usando dados dos query parameters:', requestData);
            
        } else if (event.httpMethod === 'POST') {
            if (!event.body) {
                return {
                    statusCode: 400,
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Empty body',
                        message: 'POST requests need a JSON body'
                    })
                };
            }
            
            try {
                requestData = JSON.parse(event.body);
                console.log('📋 Dados recebidos via POST:', JSON.stringify(requestData, null, 2));
            } catch (parseError) {
                return {
                    statusCode: 400,
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Invalid JSON',
                        message: 'Could not parse request body'
                    })
                };
            }
        } else {
            return {
                statusCode: 405,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed',
                    message: 'This function accepts only GET (with query params) or POST requests'
                })
            };
        }
        
        if (!requestData.path || !['quick', 'precise'].includes(requestData.path)) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid path',
                    message: 'The "path" field must be "quick" or "precise"'
                })
            };
        }
        
        console.log('🎵 Iniciando geração de playlist FIXED...');
        console.log(`🛤️ Path selecionado: ${requestData.path}`);
        console.log(`🎯 Método: ${event.httpMethod === 'GET' ? 'Query Parameters' : 'POST Body'}`);
        
        const tokenData = await getSpotifyAccessToken();
        const playlistData = await getSpotifyRecommendations(tokenData.access_token, requestData);
        
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: '✅ FIXED Playlist generated successfully!',
                path: requestData.path,
                method: 'fixed_search_api',
                source: event.httpMethod === 'GET' ? 'query_parameters' : 'post_body',
                playlist: playlistData.tracks,
                metadata: playlistData.metadata,
                available_contexts: ['focus', 'creative', 'admin', 'casual', 'dancing', 'party', 'workout', 'study', 'sleep', 'drive'],
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('❌ Error in generatePlaylist function:', error.message);
        
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};