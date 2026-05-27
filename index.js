import OpenAI from "openai"

const apiKey = localStorage.getItem("OPENAI_API_KEY")
if (!apiKey) {
    throw new Error(
        'Missing API key. Set it in DevTools: localStorage.setItem("OPENAI_API_KEY", "sk-...")'
    )
}

export const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
})

/**
 * Goal - build an agent that can get the current weather at my current location
 * and give me some localized ideas of activities I can do.
 */

const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        {
            role: "user",
            content: "Give me a list of activity ideas based on my current location and weather"
        }
    ]
})

console.log(response.choices[0].message.content)