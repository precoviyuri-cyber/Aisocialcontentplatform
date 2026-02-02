import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateContentRequest {
  title: string;
  platform: string;
  creativeBrief: string;
  targetAudience: string;
  brandVoice: string;
  variations: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: GenerateContentRequest = await req.json();

    const { title, platform, creativeBrief, targetAudience, brandVoice } = body;

    const platformLimits: Record<string, number> = {
      instagram: 2200,
      twitter: 280,
      linkedin: 3000,
      facebook: 63206,
    };

    const maxChars = platformLimits[platform] || 280;

    // Generate content variations based on brief
    // In production, replace this with actual AI API call (OpenAI, Anthropic, etc.)
    const variations = generateMockVariations(
      title,
      platform,
      creativeBrief,
      targetAudience,
      brandVoice,
      3
    );

    return new Response(JSON.stringify({ variations }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateMockVariations(
  title: string,
  platform: string,
  brief: string,
  audience: string,
  voice: string,
  count: number
): string[] {
  const variations: string[] = [];

  const toneMapping: Record<string, string> = {
    professional: "professional and business-focused",
    friendly: "warm and approachable",
    bold: "confident and impactful",
    creative: "creative and engaging",
    educational: "informative and helpful",
  };

  const tone = toneMapping[voice] || "engaging";

  const platformEmojis: Record<string, string> = {
    instagram: "📸",
    twitter: "𝕏",
    linkedin: "💼",
    facebook: "👥",
  };

  const emoji = platformEmojis[platform] || "✨";

  for (let i = 0; i < count; i++) {
    const variant = generateVariation(
      title,
      brief,
      audience,
      tone,
      emoji,
      i + 1
    );
    variations.push(variant);
  }

  return variations;
}

function generateVariation(
  title: string,
  brief: string,
  audience: string,
  tone: string,
  emoji: string,
  variantNum: number
): string {
  const variations = [
    `${emoji} ${title}\n\n${brief}\n\n${
      audience ? `📍 For: ${audience}` : ""
    }\n\n#contentflow #created`,
    `Excited to share: ${title} ${emoji}\n\n${brief}\n\n${
      audience ? `Perfect for ${audience}` : "For everyone"
    }\n\n#marketing #socialmedia`,
    `${title} - A ${tone} approach\n\n${brief}\n\n${
      audience ? `Tailored for ${audience}` : ""
    }\n\nWhat do you think? Let us know! ${emoji}\n\n#socialmedia #engagement`,
  ];

  return variations[(variantNum - 1) % variations.length];
}
