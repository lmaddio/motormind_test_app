"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenAiRequest = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_KEY,
});
const createOpenAiRequest = async (text) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            { "role": "user", "content": `${text}, what could be the issue? Please send me 3 issues with difference category based on the probability and format the response as a JSON` },
        ],
    });
    return completion.choices[0].message.content;
};
exports.createOpenAiRequest = createOpenAiRequest;
