# Frama-Tech Business Card Request Tool

Internal tool for employees to request business cards. Submissions create Trello cards automatically.

## Project Structure

```
framatech-cards/
├── index.html              # Main application
├── netlify.toml            # Netlify configuration
├── netlify/
│   └── functions/
│       └── create-trello-card.js  # Serverless function for Trello
├── .env.example            # Example environment variables
└── README.md
```

## Deployment to Netlify

### Option 1: Netlify CLI (Recommended)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   cd framatech-cards
   netlify deploy --prod
   ```

### Option 2: Git Integration

1. Push this folder to a GitHub/GitLab repository
2. Connect the repo to Netlify at [app.netlify.com](https://app.netlify.com)
3. Netlify will auto-deploy on every push

### Option 3: Drag & Drop

1. Zip the entire `framatech-cards` folder
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the zip file to deploy

## Environment Variables Setup

After deploying, configure these in **Netlify Dashboard → Site Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `TRELLO_API_KEY` | Your Trello API key |
| `TRELLO_TOKEN` | Your Trello API token |
| `TRELLO_LIST_ID` | ID of the Trello list for new cards |

### Getting Trello Credentials

1. **API Key**: Visit [trello.com/power-ups/admin](https://trello.com/power-ups/admin) and create a new Power-Up or use an existing key

2. **Token**: Visit this URL (replace YOUR_API_KEY):
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=YOUR_API_KEY
   ```

3. **List ID**: 
   - Open your Trello board
   - Add `.json` to the end of the URL
   - Search for your list name and copy its `id`

## Features

- **Live Preview**: See business card as you type
- **Location Presets**: Dallas, Chicago, LA, NY, Navarre + Custom
- **Trello Integration**: Each submission creates a card
- **Admin Dashboard**: Track request status (uses localStorage)
- **CSV Export**: Download all requests

## Local Development

For local testing without Trello (uses localStorage only):
1. Open `index.html` directly in a browser
2. The Trello call will fail but form still works

For full testing with Netlify Functions:
```bash
npm install -g netlify-cli
netlify dev
```

## Customization

- **Colors**: Edit CSS variables in `:root` section
- **Locations**: Modify the `locations` object in the Vue script
- **Card Format**: Edit the Trello card template in `create-trello-card.js`
