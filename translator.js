// translator.js
const DICTIONARY = {
    // GRAMMATICAL MARKERS
    "do": "DO", "era": "PAST", "eri": "PRESENT", "eru": "FUTURE", "vane": "NOT",
    "pe": "AND", "teki": "BUT", "mi": "BECAUSE_FOR", 
    
    // PRONOUNS & NUMBERS
    "ni": "I", "ka": "YOU", "che": "HE/SHE/IT", "fa": "ONE", "ti": "TWO", 
    "ne": "THREE", "rupu": "MANY",
    
    // POSTPOSITIONS
    "mu": "WITH", "lo": "TO/AT", 

    // VERBS
    "li": "BE", "sa": "SEE", "pena": "RUN", "weka": "WALK", "sulo": "SPEAK",

    // NOUNS
    "fu": "WATER", "ro": "SUN/DAY", "maku": "DOG", "chope": "FLOWER", "mena": "PEOPLE",
    "dama": "TREE", "ko": "STONE", "nami": "TIME", "lofa": "HOME", "supe": "VOICE",
    "seka": "FISH", "fenu": "AIR",

    // ADJECTIVES (Adverbs are derived: Falo -> Falo-li)
    "falo": "BIG", "piko": "SMALL", "chami": "RED", "wecha": "HAPPY", "sofi": "BLUE",
    "tula": "YELLOW", "nefa": "GREEN", "fiki": "BLACK", "palo": "WHITE", "pini": "SAD",
    "foka": "AFRAID", "lepo": "KIND", "tore": "ANGRY",
    
    // ADVERBS (Explicitly listed)
    "falo-li": "GREATLY", "piko-li": "MINUTELY", "chami-li": "REDLY", "wecha-li": "HAPPILY", 
    "sofi-li": "CALMLY", "tula-li": "BRIGHTLY", "nefa-li": "NATURALLY", "fiki-li": "DARKLY", 
    "palo-li": "PURELY", "pini-li": "SADLY", "foka-li": "FEARFULLY", "lepo-li": "KINDLY/WELL", 
    "tore-li": "ANGRILY/BADLY", "tena": "QUICKLY"
};

const FLOWING_TO_ENGLISH = DICTIONARY;
const ENGLISH_TO_FLOWING = Object.fromEntries(
    Object.entries(DICTIONARY).flatMap(([k, v]) => v.includes('/') ? 
        v.split('/').map(val => [val.toLowerCase(), k]) : [[v.toLowerCase(), k]]
);

function sanitize(text) {
    // Normalize and remove punctuation, then split into words
    return text.toLowerCase().replace(/[\.,?!]/g, '').trim().split(/\s+/);
}

function translateEnToFlowing(words) {
    // English -> Flowing is complex due to word order and tense markers.
    // This function will prioritize finding the correct Flowing word, but
    // will NOT attempt to rearrange the sentence into T-V-Adv-S-O. 
    // This is left as a challenge to the user to apply the grammar rules manually.
    
    return words.map(word => {
        // Handle common English tense/plural markers that don't exist in Flowing
        let baseWord = word.replace(/(s|ing|ed)$/, ''); 
        
        let translation = ENGLISH_TO_FLOWING[word] || ENGLISH_TO_FLOWING[baseWord];
        
        return translation || `[${word}]`; // Mark untranslatable words
    }).join(' ');
}

function translateFlowingToEn(words) {
    // Flowing -> English: Simple word-for-word lookup and formatting.
    // This maintains the T-V-S-O order in the translation box, 
    // reminding the user of the Flowing language structure.
    
    return words.map(word => {
        let translation = FLOWING_TO_ENGLISH[word];
        
        if (translation) {
            // Special handling for key markers for readability
            if (["PAST", "PRESENT", "FUTURE"].includes(translation)) {
                return `[${translation}]`;
            } else if (translation === "HE/SHE/IT") {
                return "He/She"; 
            }
            return translation.toLowerCase();
        }
        return `[${word}]`; // Mark untranslatable words
    }).join(' ');
}

function autoTranslate(direction) {
    const englishInput = document.getElementById('englishInput');
    const flowingInput = document.getElementById('flowingInput');
    
    if (direction === 'enToFlowing' && englishInput.value.length > 0) {
        const words = sanitize(englishInput.value);
        flowingInput.value = translateEnToFlowing(words);
    } else if (direction === 'flowingToEn' && flowingInput.value.length > 0) {
        const words = sanitize(flowingInput.value);
        englishInput.value = translateFlowingToEn(words);
    } else if (englishInput.value.length === 0 && flowingInput.value.length === 0) {
        // Clear if both are empty
        englishInput.value = "";
        flowingInput.value = "";
    }
}

function translateBoth() {
    // When the button is clicked, we run the translation in the direction
    // where the user has the most text, or from left to right by default.
    const englishInput = document.getElementById('englishInput');
    const flowingInput = document.getElementById('flowingInput');
    
    if (englishInput.value.length >= flowingInput.value.length) {
        autoTranslate('enToFlowing');
    } else {
        autoTranslate('flowingToEn');
    }
}
