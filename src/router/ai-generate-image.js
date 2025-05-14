const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const base64Image = response?.data?.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData
    )?.inlineData?.data;

    if (!base64Image) {
      return res.status(500).json({ error: "No image returned" });
    }

    res.json({ image: base64Image });
  } catch (err) {
    console.error("Image generation error:", err.message || err);
    res
      .status(500)
      .json({ error: "Image generation failed", details: err.message || err });
  }
});

module.exports = router;
