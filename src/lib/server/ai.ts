import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const generateSchema = z.object({
  productName: z.string().trim().min(2, "Nama produk minimal 2 karakter.").max(120),
  category: z.string().trim().min(2, "Kategori wajib diisi.").max(80),
  audience: z.string().trim().max(160).default("masyarakat umum"),
  tone: z.enum(["profesional", "ramah", "persuasif"]).default("ramah"),
  notes: z.string().trim().max(1000).default(""),
});

export const generateProductCopy = createServerFn({ method: "POST" })
  .validator(generateSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY belum diatur. Tambahkan di .env.local lalu mulai ulang server.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "Kamu adalah asisten copywriting untuk produk ekonomi kreatif Indonesia. Buat teks Bahasa Indonesia yang jelas, menarik, tidak mengada-ada, dan siap diedit. Keluarkan tepat dalam format: Judul: ...\nDeskripsi: ...\nKeunggulan:\n- ...\n- ...\n- ...\nAjakan: ... . Jangan klaim fakta yang tidak diberikan.",
          },
          {
            role: "user",
            content: `Nama produk: ${data.productName}\nKategori: ${data.category}\nTarget audiens: ${data.audience || "masyarakat umum"}\nGaya bahasa: ${data.tone}\nCatatan tambahan: ${data.notes || "Tidak ada"}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: { message?: string } };
      if (response.status === 401) throw new Error("API key OpenAI tidak valid. Periksa OPENAI_API_KEY.");
      if (response.status === 429) throw new Error("Batas penggunaan OpenAI tercapai. Periksa kuota dan billing akun OpenAI.");
      throw new Error(body.error?.message || `OpenAI gagal merespons (HTTP ${response.status}).`);
    }

    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = result.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("OpenAI tidak mengembalikan teks. Silakan coba lagi.");
    return { content };
  });
