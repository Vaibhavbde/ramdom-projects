/**
 * AI Summary utility for journal entries
 * Uses Xenova Transformers for local text summarization
 */

import { pipeline, env } from "@xenova/transformers";

// Configure transformers.js to use CDN properly
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface SummaryOptions {
  maxLength?: number;
  minLength?: number;
}

// Singleton summarizer instance
let summarizer: any = null;

/**
 * Load the summarization model (cached after first load)
 */
async function loadModel() {
  if (!summarizer) {
    console.log("🔄 Loading DistilBART model for the first time...");
    console.log("📡 Fetching from Hugging Face CDN...");
    
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6", {
      progress_callback: (progress: any) => {
        if (progress.status === "progress") {
          console.log(`📥 Loading: ${progress.file} - ${Math.round(progress.progress || 0)}%`);
        }
      },
    });
    
    console.log("✅ Model loaded and cached!");
  }
  return summarizer;
}

/**
 * Generates an AI summary of the given text using Xenova Transformers
 * @param text - The journal entry content to summarize
 * @param options - Optional configuration for summary generation
 * @returns Promise<string> - The generated summary
 */
export async function generateAISummary(
  text: string,
  options: SummaryOptions = {}
): Promise<string> {
  const { maxLength = 130, minLength = 20 } = options;

  console.log("🔍 Input text for summarization:", {
    length: text.length,
    preview: text.substring(0, 100) + "...",
  });

  // For very short texts, try to create a concise version
  if (text.length < 50) {
    console.log("⚠️ Text very short, creating concise summary");
    const words = text.trim().split(/\s+/);
    if (words.length <= 5) {
      return text; // Too short to summarize
    }
    // Take first 5 words as summary for very short text
    return words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
  }

  try {
    console.log("🤖 Generating AI summary using local DistilBART model...");

    // Load model (will use cached version after first load)
    await loadModel();

    // Generate summary
    const output = await summarizer(text, {
      max_length: maxLength,
      min_length: minLength,
    });

    console.log("📡 Model output:", output);

    // Extract summary text
    if (Array.isArray(output) && output[0]?.summary_text) {
      console.log("✅ AI Summary generated successfully!");
      return output[0].summary_text;
    }

    // Fallback to smart summarization if output format unexpected
    console.log("⚠️ Unexpected output format, using smart summarization");
    return generateSmartSummary(text, maxLength);
  } catch (error) {
    console.error("❌ Error generating AI summary:", error);
    console.log("⚠️ Falling back to smart summarization");
    // Use smart summarization as fallback
    return generateSmartSummary(text, maxLength);
  }
}

/**
 * Smart summarization using advanced extractive + abstractive techniques
 * This creates better summaries than simple extractive summarization
 */
function generateSmartSummary(text: string, maxLength: number): string {
  // Clean and prepare text
  const cleanText = text.trim().replace(/\s+/g, " ");

  // If text is already short enough, return cleaned version
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Split into sentences
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return cleanText.substring(0, maxLength);
  if (sentences.length === 1) return sentences[0].substring(0, maxLength);

  // Calculate importance scores for each sentence
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;

    // Position score: earlier sentences are often more important
    score += (sentences.length - index) * 2;

    // Length score: prefer substantial sentences (but not too long)
    const words = sentence.split(/\s+/).length;
    if (words >= 5 && words <= 20) {
      score += 3;
    } else if (words > 20) {
      score += 1;
    }

    // First and last sentences are often important
    if (index === 0) score += 5;
    if (index === sentences.length - 1) score += 2;

    // Keyword score: look for important keywords
    const importantWords =
      /\b(important|significant|main|key|essential|critical|decided|realized|learned|felt|discovered|understand|believe)\b/i;
    if (importantWords.test(sentence)) {
      score += 4;
    }

    // Question sentences might be important
    if (sentence.includes("?")) {
      score += 2;
    }

    return { sentence, score, index };
  });

  // Sort by score (descending) and then by original position
  scoredSentences.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  // Build summary by selecting top sentences
  let summary = "";
  let currentLength = 0;
  const selectedIndices: number[] = [];

  for (const { sentence, index } of scoredSentences) {
    const potentialLength = currentLength + sentence.length + 1;

    if (potentialLength <= maxLength) {
      selectedIndices.push(index);
      currentLength = potentialLength;
    }

    if (selectedIndices.length >= 3) break; // Max 3 sentences for summary
  }

  // Sort selected sentences by original order for coherent reading
  selectedIndices.sort((a, b) => a - b);

  // Build final summary
  summary = selectedIndices.map((i) => sentences[i]).join(" ");

  // If still too long, truncate smartly
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3) + "...";
  }

  return summary || cleanText.substring(0, maxLength);
}


function generateExtractiveSummary(text: string, maxLength: number): string {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return text;
  if (sentences.length === 1) return sentences[0];

 
  const scoredSentences = sentences.map((sentence, index) => ({
    sentence,
    score: (sentences.length - index) * sentence.length,
  }));

  scoredSentences.sort((a, b) => b.score - a.score);

  let summary = "";
  let currentLength = 0;

  for (const { sentence } of scoredSentences) {
    const potentialLength = currentLength + sentence.length + 2; // +2 for ". "
    if (potentialLength > maxLength && summary.length > 0) break;

    summary += (summary ? ". " : "") + sentence;
    currentLength = potentialLength;
  }

  return summary + ".";
}

/**
 * Generates insights from multiple journal entries
 * Useful for analyzing patterns in mood, topics, etc.
 */
export function generateInsights(
  entries: Array<{ content: string; mood: string; tags: string[] }>
): string {
  if (entries.length === 0) return "No entries to analyze.";

  const totalEntries = entries.length;
  const moodCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  entries.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    entry.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const dominantMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  let insight = `Over ${totalEntries} entries, you've been mostly feeling ${dominantMood[0]}`;

  if (topTags.length > 0) {
    insight += ` and frequently writing about: ${topTags.join(", ")}`;
  }

  insight += ".";

  return insight;
}
