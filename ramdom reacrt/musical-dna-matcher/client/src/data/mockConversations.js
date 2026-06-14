// src/data/mockConversations.js

const mockConversations = [
  {
    matchId: "u1-u5",
    messages: [
      { sender: "u1", text: "Hey! Indie Pop forever?", timestamp: Date.now() - 86400000 },
      { sender: "u5", text: "Absolutely! Have you heard the new Phoebe Bridgers track?", timestamp: Date.now() - 86300000 },
      { sender: "u1", text: "Yes! Motion Sickness is on repeat. Her lyricism is incredible", timestamp: Date.now() - 86200000 },
      { sender: "u5", text: "Right?! We should check out that indie fest next month", timestamp: Date.now() - 86100000 },
      { sender: "u1", text: "I'm so down! Let's make a collaborative playlist first?", timestamp: Date.now() - 20000 },
    ],
  },
  {
    matchId: "u2-u7",
    messages: [
      { sender: "u2", text: "Your Latin Pop taste is immaculate! 🔥", timestamp: Date.now() - 172800000 },
      { sender: "u7", text: "Gracias! Bad Bunny's new album is pure fire", timestamp: Date.now() - 172700000 },
      { sender: "u2", text: "I've been obsessed with Rosalía lately too", timestamp: Date.now() - 172600000 },
      { sender: "u7", text: "She's revolutionary! Want to hit up that salsa night this weekend?", timestamp: Date.now() - 172500000 },
      { sender: "u2", text: "Yes! I need to practice my moves 💃", timestamp: Date.now() - 10000 },
    ],
  },
  {
    matchId: "u4-u10",
    messages: [
      { sender: "u4", text: "A fellow vinyl collector! What's your holy grail record?", timestamp: Date.now() - 259200000 },
      { sender: "u10", text: "Original pressing of Aretha's 'I Never Loved a Man'", timestamp: Date.now() - 259100000 },
      { sender: "u4", text: "Wow! I'm still hunting for Joni's 'Blue' original", timestamp: Date.now() - 259000000 },
      { sender: "u10", text: "That's a masterpiece. The raw emotion in every track...", timestamp: Date.now() - 258900000 },
      { sender: "u4", text: "Exactly! Music was so pure back then", timestamp: Date.now() - 30000 },
    ],
  },
  {
    matchId: "u3-u9",
    messages: [
      { sender: "u3", text: "Flying Lotus fan! You have incredible taste", timestamp: Date.now() - 345600000 },
      { sender: "u9", text: "Same to you! Kamasi Washington is my meditation", timestamp: Date.now() - 345500000 },
      { sender: "u3", text: "Yes! Jazz fusion is the future of music", timestamp: Date.now() - 345400000 },
      { sender: "u9", text: "Have you heard the new Thundercat collab?", timestamp: Date.now() - 345300000 },
      { sender: "u3", text: "Not yet! Sending me the link?", timestamp: Date.now() - 5000 },
    ],
  },
  {
    matchId: "u6-u12",
    messages: [
      { sender: "u6", text: "Your R&B playlist is everything! Frank Ocean hits different", timestamp: Date.now() - 432000000 },
      { sender: "u12", text: "Thank you! SZA's storytelling gives me chills every time", timestamp: Date.now() - 431900000 },
      { sender: "u6", text: "Good Days is my therapy song", timestamp: Date.now() - 431800000 },
      { sender: "u12", text: "Same! Music that heals the soul 💫", timestamp: Date.now() - 431700000 },
      { sender: "u6", text: "Want to create a 'songs that heal' playlist together?", timestamp: Date.now() - 15000 },
    ],
  },
];

export default mockConversations;
