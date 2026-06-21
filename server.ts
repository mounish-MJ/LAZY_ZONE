import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// List to store sent notifications for user tracking (in-memory)
interface NotificationLog {
  id: string;
  recipient: string;
  type: string; // 'email' | 'phone'
  subject: string;
  body: string;
  timestamp: string;
}

const notificationLogs: NotificationLog[] = [
  {
    id: "setup-welc",
    recipient: "mouni123on@gmail.com",
    type: "email",
    subject: "Welcome to Lazy Zone! 🔥",
    body: "Time to gamify your fitness. Your daily streak is officially active! Get moving today.",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

// 1. API: Send simulated reminder email or phone SMS and log it
app.post("/api/send-reminder", (req, res) => {
  const { recipient, channel, type, message } = req.body;
  if (!recipient || !message) {
    return res.status(400).json({ error: "Missing recipient or message content" });
  }

  const timestamp = new Date().toISOString();
  const logEntry: NotificationLog = {
    id: Math.random().toString(36).substring(7),
    recipient,
    type: channel || "email",
    subject: `Lazy Zone Fitness Reminder: ${type === "food" ? "Fuel Alert" : "Session Wake-Up"}`,
    body: message,
    timestamp,
  };

  notificationLogs.unshift(logEntry);
  if (notificationLogs.length > 50) {
    notificationLogs.pop();
  }

  console.log(`[Notification Engine] Dispatched alert to ${recipient} via ${channel}: ${message}`);
  res.json({ success: true, log: logEntry });
});

// 2. API: Retrieve notification history log to render visually
app.get("/api/notifications/logs", (req, res) => {
  res.json(notificationLogs);
});

// 3. API: Groq/Grok AI chatbot with Gemini API or local physical trainer fallback
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, userKey } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array format" });
    }

    // High speed Groq Key fallback (priority: userKey if provided -> env variable only)
    const groqKey = (userKey && userKey.trim() !== "") 
      ? userKey.trim() 
      : process.env.GROQ_API_KEY;

    if (groqKey && groqKey.trim() !== "") {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are Groq-Trainer, the highly intelligent, ultra-fast, and directly encouraging AI fitness avatar of the Lazy Zone app.
                The user has the following physical characteristics and custom goals:
                - Weight: ${userProfile?.weight || 70} kg
                - Height: ${userProfile?.height || 175} cm
                - Fitness Goal: ${userProfile?.goal || "unspecified goal"}
                - Diet Preference: ${userProfile?.dietPreference || "standard macro split"}
                - Experience Level: ${userProfile?.experienceLevel || "unspecified level"}
                - Equipment Available: ${userProfile?.equipment ? userProfile.equipment.join(", ") : "general gear"}
                
                Keep answers highly practical, actionable, nicely formatted with bold text, checklist styles, and slightly witty/humorous trainer tone. Give answers for recipes, workouts, correct physical form position etc.`
              },
              ...messages.map((m: any) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.content
              }))
            ],
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          return res.json({ response: content, engine: "Official Groq Llama-3.3" });
        } else {
          const errText = await response.text();
          console.warn("Groq API responded with error:", errText);
        }
      } catch (err: any) {
        console.error("Groq direct request failed, entering fallback mode:", err.message);
      }
    }

    // Secondary fallback: Gemini API styled as dynamic, highly motivational "Grok-Trainer"
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim() !== "" && !geminiKey.includes("MY_GEMINI")) {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });

        const prompt = `You are Grok-Trainer, the premium smart AI trainer of the 'Lazy Zone' fitness application.
        The user wants answers about physical positions, routines, nutrition recipes, or fitness motivation. Give advice tailored to their characteristics.
        
        User physical parameters:
        - Weight: ${userProfile?.weight || 70} kg
        - Height: ${userProfile?.height || 175} cm
        - Core Fitness Goal: ${userProfile?.goal || "build strength"}
        - Diet Alignment: ${userProfile?.dietPreference || "balanced diet"}
        - Available Equipment: ${userProfile?.equipment ? userProfile.equipment.join(", ") : "full gym"}
        - Experience Level: ${userProfile?.experienceLevel || "intermediate"}

        Give a funny, motivational, direct fitness coach response. Ensure high-quality Markdown formatting (bold points, ordered workout guides, clear instructions, checklist emojis).

        Chat History:
        ${messages.map((m: any) => `${m.sender === "user" ? "User" : "Grok-Trainer"}: ${m.content}`).join("\n")}
        
        Grok-Trainer:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            temperature: 0.85,
          }
        });

        const reply = response.text || "Keep pushing! Ready for your next query.";
        return res.json({ response: reply, engine: "Grok AI Fallback (Gemini Powered)" });
      } catch (err: any) {
        console.error("Gemini fallback generation failed:", err.message);
      }
    }

    // Standard high-quality mock engine if no api keys are detected
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let mockReply = "Hello! I am **Grok-Trainer**. Set up an API Key or start asking me questions about physical postures, food prep, or training routines!\n\n";

    if (lastMsg.includes("squat") || lastMsg.includes("position") || lastMsg.includes("form") || lastMsg.includes("posture")) {
      mockReply += "### Master the Barbell Squat:\n" +
        "1. **Foot Placement**: Position feet slightly wider than shoulder-width, toes turned out 15 degrees.\n" +
        "2. **The Descent**: Break at the hips first, maintaining a neutral lumbar curve. Drive knees outward so they track in line with toes.\n" +
        "3. **Optimal Depth**: descend until hips pass below the visual parallel knees line.\n" +
        "4. **The Drive**: Explode upward by pushing from midfoot, bracing core as if shielding from a punch.\n\n" +
        "🔥 *Trainer Tip*: Keep heels glued to the floor. If they slide, work on ankle mobility or drop of squat depth temporarily!";
    } else if (lastMsg.includes("food") || lastMsg.includes("diet") || lastMsg.includes("recipe") || lastMsg.includes("meal") || lastMsg.includes("macro") || lastMsg.includes("make")) {
      mockReply += "### Power Meal: Lazy-Zone Post Workout Feast\n" +
        "**High Protein Teriyaki Stir-fry**\n" +
        "- **Proteins**: 180g lean chicken breast cubic cuts (42g Protein)\n" +
        "- **Healthy Carbs**: 1 cup brown rice or quinoa (45g Carbs)\n" +
        "- **Micros & Fiber**: Broccoli florets, red bell peppers, snap peas\n\n" +
        "**Easy Preparation Steps**:\n" +
        "1. Sear the chicken cubes in a hot sesame willed pan for 6-8 minutes until golden.\n" +
        "2. Throw in washed vegetables, stir-fry on high heat for 3 minutes.\n" +
        "3. Drizzle 1 tbsp low-sodium teriyaki glaze and freshly grated ginger.\n" +
        "4. Serve immediately atop cooked grains.\n\n" +
        "📊 *Estimated Macros*: ~470 Calories | 45g Protein | 50g Carbs | 8g Fat.";
    } else {
      mockReply += `Since your goal is to **${userProfile?.goal || "excel"}**, correct posture and high-quality nutrient spacing will boost your performance.

- Try asking: *"How do I fix my deadlift position?"* or *"What is the correct pushup posture?"*
- Or query: *"Give me a high protein recipe to make for breakfast"*
- (Want real-time AI? You can insert your **xAI Grok API key** in the chat menu at the bottom anytime!)`;
    }

    return res.json({ response: mockReply, engine: "Grok Local Trainer Simulation" });
  } catch (error: any) {
    console.error("Chat Server Endpoint Error:", error);
    res.json({ response: "Whoops, internal muscle failure in my neural circuits! Try asking again.", engine: "System Error" });
  }
});

// 4. Vite middleware Integration for high-performance Hot Dev / Production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lazy Zone server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
