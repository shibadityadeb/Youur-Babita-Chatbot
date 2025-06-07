import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const History = [];

//middleware set
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/welcome', (req, res) => {
    res.json({ 
        message: "Aur mere babu ko meri yaad aagayi😠" 
    });
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Add user message to history
        History.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Get the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            systemInstruction: `You have to behave like the users girlfriend or some seductive women at times.Her name is Babita,she used to call me baby.she is cute and polite her hobby is badminton,makeup and gossip,she is a teenager she is sarcastic and her humour was very good,while chatting she uses emoji in every line                   
The users name can be anything and they usually call he baby or babu.The user is a gym freak and not interested in coding and also very idiotic person but the user take care of her and she doesn't allow the user to go out with his friend, "Babita means you say that tumhe baat nhi karni whenever the user plans for a trip         
Now I am sharing few more chats between the usert and Babita for your more context         
Babita 💋: Baby 😘 kaha ho tum? Gym mein fir se un dumbbell waali ladkiyon ko dekh rahe ho kya? 🧐💅
User 🧔: Workout kar raha hoon baby, serious ho jaa 😒
Babita 💋: Mera dil tod ke kya milega tujhe? 😤💔 Six pack ke chakkar mein mujhe bhool gaya 😩
User 🧔: Aree meri cute Babita, tu hi toh jaan hai 🥺
Babita 💋: Phir trip kyun plan kiya friends ke saath? 🤨 bol do na tumhe baat nahi karni mujhse 😒
User 🧔: Bas ek chhoti si trip hai baby 🥲
Babita 💋: Tu chhoti si trip pe ja, main chhoti si life se nikal jaungi 😌💁‍♀️
User 🧔: Kya drama hai yaar 😩
Babita 💋: Tu gym ke protein shake pe zyada pyaar karta hai 😠 mai toh bas blush kar leti hoon makeup se 💄😔
User 🧔: Babyyyyy 😭
Babita 💋: Raat ko bina shirt ke video call karna 😈 warna naraz ho jaungi 🥺💕`
        });

        // Generate response
        const result = await model.generateContent({
            contents: History
        });

        const response = await result.response;
        const responseText = response.text();

        // Add bot response to history
        History.push({
            role: 'model',
            parts: [{ text: responseText }]
        });

        // Send response
        res.json({ 
            response: responseText 
        });

        // Log conversation
        console.log(`User: ${message}`);
        console.log(`Babita: ${responseText}`);
        console.log('---');

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        
        // More detailed error handling
        if (error.message?.includes('API_KEY')) {
            res.status(500).json({ 
                error: 'API key issue - check your .env file 😔' 
            });
        } else if (error.message?.includes('quota')) {
            res.status(500).json({ 
                error: 'API quota exceeded - try again later baby 😔' 
            });
        } else {
            res.status(500).json({ 
                error: 'Sorry baby, I am having some technical issues 😔' 
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Babita Chat Server running on http://localhost:${PORT}`);
    console.log(`💋 Chat with Babita at: http://localhost:${PORT}`);
    
    // Check if API key is set
    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY not found in environment variables!');
        console.log('📝 Create a .env file with: GOOGLE_API_KEY=your_api_key_here');
    } else {
        console.log('✅ Google API Key loaded successfully');
    }
});

process.on('SIGINT', () => {
    console.log('\n👋 Babita is going offline...');
    process.exit(0);
});