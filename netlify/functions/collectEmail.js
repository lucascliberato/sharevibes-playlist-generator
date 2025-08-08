/**
 * 📧 VIBES EMAIL COLLECTION - BREVO INTEGRATION
 * 
 * Endpoint para capturar emails após a geração da playlist
 * Integra com Brevo (antigo Sendinblue) para automação de newsletters
 * 
 * Funcionalidades:
 * - Coleta email + contexto preferido
 * - Cria contato no Brevo com segmentação automática
 * - Adiciona à lista de newsletter semanal
 * - Tracking de conversão email
 * 
 * URL: /.netlify/functions/collectEmail
 */

const fetch = require('node-fetch');

/**
 * 🔐 FUNÇÃO PARA CRIAR/ATUALIZAR CONTATO NO BREVO
 */
async function addContactToBrevo(email, contextPreference, playlistData) {
    try {
        const brevoApiKey = process.env.BREVO_API_KEY;
        const brevoListId = process.env.BREVO_LIST_ID; // ID da lista principal
        
        if (!brevoApiKey || !brevoListId) {
            throw new Error('❌ BREVO_API_KEY ou BREVO_LIST_ID não configurados');
        }
        
        // Mapear contextos para tags legíveis
        const contextMapping = {
            'focus': 'Deep Focus',
            'creative': 'Creative Work', 
            'admin': 'Admin Tasks',
            'casual': 'Casual Browsing'
        };
        
        const contextTag = contextMapping[contextPreference] || 'General';
        
        // Dados do contato para Brevo
        const contactData = {
            email: email,
            attributes: {
                FIRSTNAME: email.split('@')[0], // Usar parte do email como nome
                PREFERRED_CONTEXT: contextTag,
                SIGNUP_DATE: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                LAST_PLAYLIST_GENERATED: new Date().toISOString(),
                SIGNUP_SOURCE: 'Vibes Playlist Generator'
            },
            listIds: [parseInt(brevoListId)],
            updateEnabled: true // Atualizar se já existir
        };
        
        console.log('📧 Criando contato no Brevo:', email, `(${contextTag})`);
        
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            console.log('✅ Contato criado/atualizado com sucesso no Brevo');
            return {
                success: true,
                contactId: responseData.id,
                message: 'Contato adicionado com sucesso'
            };
        } else {
            // Se o contato já existe (código 400), ainda consideramos sucesso
            if (response.status === 400 && responseData.message?.includes('Contact already exist')) {
                console.log('✅ Contact already exists in Brevo - updated');
                return {
                    success: true,
                    message: 'Contact updated (already existed)'
                };
            }
            
            throw new Error(`Erro Brevo: ${response.status} - ${JSON.stringify(responseData)}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao adicionar contato no Brevo:', error.message);
        throw error;
    }
}

/**
 * 🔗 GERAR URL PERSONALIZADA PARA PRÓXIMA PLAYLIST
 */
function generatePersonalizedUrl(contextPreference, baseUrl = 'https://vibes-generator.netlify.app') {
    // Mapear contexto para parâmetros de URL
    const contextParams = {
        'focus': {
            context: 'focus',
            mood: 'calm',
            genres: 'electronic,ambient,instrumental'
        },
        'creative': {
            context: 'creative', 
            mood: 'energetic',
            genres: 'indie,alternative,electronic'
        },
        'admin': {
            context: 'admin',
            mood: 'uplifting', 
            genres: 'pop,indie,electronic'
        },
        'casual': {
            context: 'casual',
            mood: 'ambient',
            genres: 'indie,folk,alternative'
        }
    };
    
    const params = contextParams[contextPreference] || contextParams['focus'];
    const queryString = new URLSearchParams(params).toString();
    
    return `${baseUrl}?${queryString}`;
}

/**
 * 🚀 HANDLER PRINCIPAL
 */
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    try {
        // CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }
        
        // Validar método POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed',
                    message: 'This function accepts only POST requests'
                })
            };
        }
        
        // Parsear dados da requisição
        let requestData;
        try {
            requestData = JSON.parse(event.body);
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
        
        // Validar campos obrigatórios
        const { email, contextPreference, playlistData } = requestData;
        
        if (!email || !email.includes('@')) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email',
                    message: 'Please provide a valid email address'
                })
            };
        }
        
        if (!contextPreference || !['focus', 'creative', 'admin', 'casual'].includes(contextPreference)) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false, 
                    error: 'Invalid context',
                    message: 'contextPreference must be: focus, creative, admin or casual'
                })
            };
        }
        
        console.log('📧 Processing email collection:', email, `(${contextPreference})`);
        
        // Add contact to Brevo
        const brevoResult = await addContactToBrevo(email, contextPreference, playlistData);
        
        // Generate personalized URL for future emails
        const personalizedUrl = generatePersonalizedUrl(contextPreference);
        
        // Success response
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: '✅ Email collected successfully!',
                brevo_result: brevoResult,
                personalized_url: personalizedUrl,
                context_preference: contextPreference,
                next_steps: 'You\'ll receive your first personalized playlist next Monday!',
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('❌ Error in email collection:', error.message);
        
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