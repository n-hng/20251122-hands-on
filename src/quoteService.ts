interface Quote {
    text: string;
    author: string;
    keywords: string[];
}

const QUOTES: Quote[] = [
    {
        text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
        author: "Thomas Edison",
        keywords: ["work", "job", "task", "project", "hard", "create", "make"]
    },
    {
        text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        author: "Mahatma Gandhi",
        keywords: ["study", "learn", "read", "book", "school", "exam", "test"]
    },
    {
        text: "Early to bed and early to rise makes a man healthy, wealthy and wise.",
        author: "Benjamin Franklin",
        keywords: ["sleep", "wake", "morning", "health", "gym", "run", "exercise", "doctor"]
    },
    {
        text: "Whoever said money can't buy happiness simply didn't know where to go shopping.",
        author: "Bo Derek",
        keywords: ["buy", "shop", "purchase", "store", "money", "pay", "gift"]
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        keywords: ["code", "program", "develop", "design", "build"]
    },
    {
        text: "Time is money.",
        author: "Benjamin Franklin",
        keywords: ["meeting", "schedule", "time", "appointment", "deadline"]
    },
    {
        text: "A journey of a thousand miles begins with a single step.",
        author: "Lao Tzu",
        keywords: ["travel", "trip", "go", "visit", "walk", "journey"]
    },
    {
        text: "Cleanliness is next to godliness.",
        author: "John Wesley",
        keywords: ["clean", "wash", "tidy", "organize", "trash", "garbage"]
    }
];

const DEFAULT_QUOTES: Quote[] = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", keywords: [] },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", keywords: [] },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", keywords: [] }
];

export function getQuote(title: string): { text: string; author: string } {
    const lowerTitle = title.toLowerCase();

    // Find matching quote based on keywords
    for (const quote of QUOTES) {
        if (quote.keywords.some(keyword => lowerTitle.includes(keyword))) {
            return { text: quote.text, author: quote.author };
        }
    }

    // Return random default quote if no match found
    const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
    return { 
        text: DEFAULT_QUOTES[randomIndex].text, 
        author: DEFAULT_QUOTES[randomIndex].author 
    };
}
