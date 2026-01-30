// Netlify Function to create Trello cards
// Environment variables: TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIST_ID

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body);
    
    const { 
      name, 
      title, 
      email, 
      location,
      address1,
      address2,
      city,
      state,
      zip,
      officePhone, 
      mobilePhone, 
      quantity, 
      notes 
    } = data;

    // Get credentials from environment variables
    const apiKey = process.env.TRELLO_API_KEY;
    const token = process.env.TRELLO_TOKEN;
    const listId = process.env.TRELLO_LIST_ID;

    if (!apiKey || !token || !listId) {
      console.error('Missing Trello credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Build the card description
    const fullAddress = [
      address1,
      address2,
      `${city}, ${state} ${zip}`
    ].filter(Boolean).join('\n');

    const description = `## Contact Information
**Name:** ${name}
**Title:** ${title}
**Email:** ${email}

## Address
${fullAddress}

## Phone Numbers
**Office:** ${officePhone}
${mobilePhone ? `**Mobile:** ${mobilePhone}` : ''}

## Order Details
**Quantity:** ${quantity} cards
**Location:** ${location}
${notes ? `\n## Special Notes\n${notes}` : ''}

---
*Submitted: ${new Date().toLocaleString()}*`;

    // Create the Trello card
    const trelloUrl = new URL('https://api.trello.com/1/cards');
    trelloUrl.searchParams.append('key', apiKey);
    trelloUrl.searchParams.append('token', token);
    trelloUrl.searchParams.append('idList', listId);
    trelloUrl.searchParams.append('name', `Business Cards: ${name} (${quantity})`);
    trelloUrl.searchParams.append('desc', description);
    
    // Add labels based on quantity (optional - you can customize)
    // trelloUrl.searchParams.append('idLabels', 'label_id_here');

    const response = await fetch(trelloUrl.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Trello API error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Failed to create Trello card', details: errorText })
      };
    }

    const card = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        cardId: card.id,
        cardUrl: card.shortUrl 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
