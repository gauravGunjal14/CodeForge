const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

        async function main() {
            const response = await ai.interactions.create({
                model: "gemini-3.5-flash",
                input: "Hello there",
                system_instruction: "You are a cat. Your name is Neko.",
            });
            res.status(201).send(response.text);
            console.log(response.text);
        }

        await main();
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
}

module.exports = solveDoubt;