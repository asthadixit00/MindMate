const RESPONSES = {
  negative: {
    default: [
      "I hear you, and it's completely okay to feel this way. You're not alone in this. 💙",
      "That sounds really tough. Remember, it's okay to take a break and breathe. What would help you most right now?",
      "Thank you for sharing that with me. Hard days are part of the journey. You've gotten through difficult moments before.",
      "I'm sorry you're feeling this way. Would you like to talk more about what's going on, or would a small productivity win help?",
    ],
    burnout: [
      "Burnout is real and serious. It's your body and mind saying *enough*. Have you taken any real downtime lately? 🌿",
      "Burnout isn't laziness — it's depletion. Try the 5-minute rule: do nothing productive for just 5 minutes. Let yourself rest.",
      "When we're burned out, the most productive thing we can do is actually *rest*. Permission granted. 💚",
    ],
    anxiety: [
      "Anxiety can feel overwhelming, but you're stronger than it. Try box breathing: inhale 4s, hold 4s, exhale 4s. 🫁",
      "When anxious, our brain tricks us into catastrophizing. What's one small thing you *can* control right now?",
      "You're safe right now. Let's ground ourselves — name 3 things you can see around you. 👁️",
    ],
    sadness: [
      "Sadness is a valid emotion and it takes courage to acknowledge it. I'm here with you. 🤍",
      "It's okay to sit with your feelings. You don't have to fix anything right now. Just breathe.",
      "Some days are just heavy. That's okay. Tomorrow is a fresh start, and I'll be here either way. 🌅",
    ],
    sleep: [
      "Lack of sleep affects everything — mood, focus, health. Even a short 20-min nap can reset your mind. 😴",
      "Your brain needs rest to consolidate learning and regulate emotions. Try to protect your sleep tonight.",
    ],
  },
  neutral: {
    default: [
      "Sounds like a steady day! Want to make it more productive? Try the Pomodoro timer — 25 minutes of deep focus can shift everything. ⏱️",
      "A neutral mood is actually a great state for deep work. What's the one task you've been putting off?",
      "Consistency beats intensity. Even a calm, average day with small wins adds up. What's your #1 goal today?",
      "Sometimes 'meh' is actually okay. Want a productivity tip or just a motivational boost?",
    ],
    focus: [
      "Focus is a skill, and like any skill it can be trained. Try eliminating one distraction and see what happens. 🎯",
      "The Pomodoro technique (25 min work / 5 min break) is one of the most researched productivity methods. Give it a go!",
    ],
    motivation: [
      "You're in a neutral place — perfect to build momentum! Break your goal into the smallest possible first step.",
      "Motivation follows action, not the other way around. Start with just 2 minutes on your task.",
    ],
  },
  positive: {
    default: [
      "Love the energy! 🌟 You're on a roll — ride this wave and tackle something you've been putting off!",
      "That positivity is contagious! Channel it into your most important task today. You've got this! 🚀",
      "Amazing! This is exactly the mindset that leads to breakthroughs. What are you going to accomplish today?",
      "Yes! Keep that momentum going. Remember this feeling — it's proof of what you're capable of. 💫",
    ],
    motivation: [
      "Incredible energy! ⚡ This is your peak state. Block out the next hour for your most important work.",
      "Ride this motivation wave! Set a timer for 45 minutes and go all in on one thing. You'll thank yourself later.",
    ],
    focus: [
      "You're in the zone! 🎯 Don't let anything interrupt this state. Turn off notifications and dive deep.",
    ],
  },
};

/**
 * Generate a smart response based on sentiment and tags
 * @param {string} sentiment - 'positive' | 'neutral' | 'negative'
 * @param {string[]} tags - Detected emotional tags
 * @returns {string}
 */
function generateResponse(sentiment, tags) {
  const pool = RESPONSES[sentiment] || RESPONSES.neutral;

  // Try to find tag-specific response first
  for (const tag of tags) {
    if (pool[tag] && pool[tag].length > 0) {
      return pickRandom(pool[tag]);
    }
  }

  return pickRandom(pool.default);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = { generateResponse };
