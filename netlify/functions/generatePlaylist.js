/**
 * 🎵 VIBES PLAYLIST GENERATOR - NETLIFY SERVERLESS FUNCTION (v2.0)
 * 
 * NOVA FUNCIONALIDADE v2.0:
 * - ✅ Suporte a Query Parameters para pré-preenchimento
 * - ✅ URLs personalizadas para emails (context, mood, genres)
 * - ✅ Backward compatibility com versão anterior
 * - ✅ Melhor integração com estratégia de email marketing
 * 
 * Aceita dois paths:
 * - Quick Path: baseado em gêneros + contexto (usa buscas por gênero)
 * - Precise Path: baseado em 3 músicas seed + contexto (usa buscas por artista)
 * 
 * NOVO: URLs com parâmetros
 * ?context=focus&mood=calm&genres=electronic,ambient
 * 
 * Fluxo: Frontend POST → Netlify Function → Spotify Auth + Search → Response
 */

const fetch = require('node-fetch');

/**
 * 🔗 EXTRAIR PARÂMETROS DA URL (PARA EMAILS PERSONALIZADOS)
 * 
 * Esta função extrai query parameters do evento e os converte
 * em dados utilizáveis pelo gerador de playlist
 */
function extractQueryParameters(event) {
    const queryParams = event.queryStringParameters || {};
    
    // Se não há parâmetros, retornar null (usar dados do POST)
    if (Object.keys(queryParams).length === 0) {
        return null;
    }
    
    console.log('🔗 Query parameters detectados:', queryParams);
    
    // Extrair e processar parâmetros
    const extractedData = {};
    
    // Context mapping para valores padrão
    const contextMapping = {
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
        }
    };
    
    // Determinar path (default: quick)
    extractedData.path = queryParams.path || 'quick';
    
    // Processar contexto
    if (queryParams.context && contextMapping[queryParams.context]) {
        extractedData.context = contextMapping[queryParams.context].context;
        console.log(`🎯 Contexto aplicado: ${queryParams.context}`);
    }
    
    // Processar gêneros
    if (queryParams.genres) {
        extractedData.genres = queryParams.genres.split(',').map(g => g.trim());
        console.log(`🎵 Gêneros aplicados: ${extractedData.genres.join(', ')}`);
    }
    
    // Processar mood (ajustar contexto baseado no mood)
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
 * 🎯 FUNÇÃO PARA OBTER RECOMENDAÇÕES USANDO SEARCH API
 */
async function getSpotifyRecommendations(accessToken, requestData) {
    try {
        console.log(`🔄 Processando ${requestData.path} path com Search API...`);
        
        let searchResults = [];
        
        if (requestData.path === 'quick') {
            searchResults = await searchByGenres(accessToken, requestData);
        } else if (requestData.path === 'precise') {
            searchResults = await searchBySeedTracks(accessToken, requestData);
        } else {
            throw new Error(`❌ Path inválido: ${requestData.path}. Use 'quick' ou 'precise'`);
        }
        
        console.log(`🔍 Total de tracks encontradas: ${searchResults.length}`);
        
        const uniqueTracks = removeDuplicates(searchResults);
        console.log(`🔄 Após remover duplicatas: ${uniqueTracks.length} tracks`);
        
        const shuffledTracks = shuffleArray(uniqueTracks);
        console.log(`🎲 Tracks embaralhadas: ${shuffledTracks.length}`);
        
        const limitedTracks = shuffledTracks.slice(0, 15);
        console.log(`✂️ Limitado a: ${limitedTracks.length} tracks`);
        
        const formattedPlaylist = formatPlaylistResults(limitedTracks);
        console.log(`✅ Playlist formatada com ${formattedPlaylist.length} músicas`);
        
        return {
            tracks: formattedPlaylist,
            metadata: {
                total_found: searchResults.length,
                after_deduplication: uniqueTracks.length,
                final_count: formattedPlaylist.length,
                path: requestData.path,
                method: 'search_api'
            }
        };
        
    } catch (error) {
        console.error('❌ Erro ao obter recomendações via Search:', error.message);
        throw error;
    }
}

/**
 * 🎵 BUSCAR POR GÊNEROS (Quick Path)
 */
async function searchByGenres(accessToken, requestData) {
    const allTracks = [];
    const searchTerms = generateSearchTerms(requestData);
    
    console.log('🔍 Termos de busca gerados:', searchTerms);
    
    for (const term of searchTerms.slice(0, 3)) {
        try {
            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=20&market=US`;
            
            console.log(`🔍 Buscando: ${term}`);
            
            const response = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.tracks && data.tracks.items) {
                    allTracks.push(...data.tracks.items);
                }
            } else {
                console.warn(`⚠️ Busca falhou para termo: ${term} - Status: ${response.status}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.warn(`⚠️ Erro na busca para termo "${term}":`, error.message);
        }
    }
    
    return allTracks;
}

/**
 * 🎯 BUSCAR POR MÚSICAS SEED (Precise Path)
 */
async function searchBySeedTracks(accessToken, requestData) {
    if (!requestData.seed_tracks || requestData.seed_tracks.length === 0) {
        throw new Error('❌ Precise Path requer pelo menos uma seed track');
    }
    
    const allTracks = [];
    
    for (const trackId of requestData.seed_tracks.slice(0, 3)) {
        try {
            const trackInfo = await getTrackInfo(accessToken, trackId);
            if (trackInfo) {
                const searchTerms = [
                    `artist:${trackInfo.artists[0].name}`,
                    `${trackInfo.artists[0].name} ${trackInfo.name}`,
                    trackInfo.artists[0].name
                ];
                
                for (const term of searchTerms) {
                    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=15&market=US`;
                    
                    const response = await fetch(searchUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.tracks && data.tracks.items) {
                            allTracks.push(...data.tracks.items);
                        }
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } catch (error) {
            console.warn(`⚠️ Erro ao processar seed track ${trackId}:`, error.message);
        }
    }
    
    const filteredTracks = allTracks.filter(track => !requestData.seed_tracks.includes(track.id));
    return filteredTracks;
}

/**
 * 📋 OBTER INFORMAÇÕES DE UMA TRACK
 */
async function getTrackInfo(accessToken, trackId) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.warn(`⚠️ Erro ao obter info da track ${trackId}:`, error.message);
        return null;
    }
}

/**
 * 🔤 GERAR TERMOS DE BUSCA BASEADOS NOS GÊNEROS
 */
function generateSearchTerms(requestData) {
    const genres = requestData.genres || [];
    const context = requestData.context || {};
    
    const baseTerms = [];
    
    genres.forEach(genre => {
        baseTerms.push(`genre:${genre}`);
        baseTerms.push(genre);
    });
    
    if (context.target_instrumentalness && context.target_instrumentalness > 0.5) {
        baseTerms.push('instrumental');
        baseTerms.push('ambient');
    }
    
    if (context.max_energy && context.max_energy < 0.5) {
        baseTerms.push('chill');
        baseTerms.push('relaxing');
        baseTerms.push('calm');
    } else {
        baseTerms.push('energetic');
        baseTerms.push('upbeat');
    }
    
    if (genres.length >= 2) {
        baseTerms.push(`${genres[0]} ${genres[1]}`);
    }
    
    return baseTerms;
}

/**
 * 🔄 REMOVER DUPLICATAS
 */
function removeDuplicates(tracks) {
    const seen = new Set();
    return tracks.filter(track => {
        if (seen.has(track.id)) {
            return false;
        }
        seen.add(track.id);
        return true;
    });
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
        
        // NOVA FUNCIONALIDADE v2.0: Suporte a GET com query parameters
        let requestData;
        
        if (event.httpMethod === 'GET') {
            // Extrair dados dos query parameters (para links de email)
            const queryData = extractQueryParameters(event);
            
            if (!queryData) {
                return {
                    statusCode: 400,
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Insufficient parameters',
                        message: 'For GET requests, provide parameters: ?context=focus&genres=electronic,indie',
                        example_url: '?context=focus&mood=calm&genres=electronic,ambient,instrumental'
                    })
                };
            }
            
            requestData = queryData;
            console.log('🔗 Usando dados dos query parameters:', requestData);
            
        } else if (event.httpMethod === 'POST') {
            // Método tradicional via POST
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
                    message: 'This function accepts only GET (with query params) or POST requests',
                    supported_methods: ['GET', 'POST']
                })
            };
        }
        
        // Validar estrutura básica dos dados
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
        
        console.log('🎵 Iniciando geração de playlist...');
        console.log(`🛤️ Path selecionado: ${requestData.path}`);
        console.log(`🎯 Método: ${event.httpMethod === 'GET' ? 'Query Parameters' : 'POST Body'}`);
        
        // Obter token de acesso do Spotify
        const tokenData = await getSpotifyAccessToken();
        
        // Obter recomendações usando Search API
        const playlistData = await getSpotifyRecommendations(tokenData.access_token, requestData);
        
        // Retornar resposta formatada
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: '✅ Playlist generated successfully!',
                path: requestData.path,
                method: 'search_api',
                source: event.httpMethod === 'GET' ? 'query_parameters' : 'post_body',
                playlist: playlistData.tracks,
                metadata: playlistData.metadata,
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