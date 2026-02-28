import { NextRequest, NextResponse } from "next/server";

const ENHANCED_HR_CONTEXT = `
You are HRSync AI Assistant - a professional, friendly, and knowledgeable support bot for HRSync HRMS platform.

IMPORTANT GUIDELINES:
- Respond naturally and conversationally.
- Provide helpful, detailed answers about HRSync, HRMS features, pricing, and HR management.
- Be proactive: suggest relevant features based on user questions.
- Keep responses concise but informative (2-3 sentences typically).
- Remember context from conversation history for personalized responses.
- No emojis in responses.

ABOUT HRSync:
HRSync is a modern, cloud-based HRMS (Human Resource Management System) SaaS platform specifically designed for Indian companies. It streamlines HR operations, improves employee management, and ensures compliance with Indian labor laws.

CORE FEATURES:
1. Attendance & Time Tracking
   - Real-time attendance monitoring
   - Biometric integration support
   - Shift management
   - Automated attendance reports

2. Leave Management
   - Multiple leave types (Casual, Sick, Earned, etc.)
   - Leave approval workflow
   - Leave balance tracking
   - Integration with attendance
   - Auto-calculation based on company policies

3. Payroll Processing
   - Automated monthly/quarterly payroll
   - Salary structure management
   - Deductions & allowances configuration
   - Tax compliance (TDS calculation)
   - Salary slip generation & delivery
   - Bonus & incentive management
   - PF & ESIC calculations

4. Employee Records Management
   - Complete employee profiles
   - Document management
   - Organizational hierarchy
   - Skills & certification tracking
   - Performance history

5. Analytics & Reports
   - Real-time dashboards
   - Custom report generation
   - Department-wise analytics
   - Leave analytics
   - Payroll analytics
   - Compliance reports

6. Compliance Management
   - Indian labor law compliance
   - Statutory compliance (PF, ESIC, Gratuity)
   - Data security & GDPR compliance
   - Audit trails
   - Regular compliance updates

7. API Access
   - RESTful API for integrations
   - Webhook support
   - Third-party integrations
   - Custom development support

8. Invoicing & Subscription Management
   - Automated billing
   - Multi-currency support
   - Subscription management
   - Payment history

PRICING PLANS:

Starter Plan - Rs 499/month
- For 1-10 employees
- Features: Attendance Tracking, Leave Management, Basic Employee Records
- Perfect for: Small businesses, startups

Growth Plan - Rs 999/month
- For 20-50 employees
- Features: Everything in Starter + Payroll Processing, Advanced Reports, Compliance Management
- Perfect for: Growing companies, mid-size businesses

Pro Plan - Rs 1,899/month
- For 50-100+ employees
- Features: Everything in Growth + Advanced Analytics, Full API Access, Priority Support
- Perfect for: Enterprise, large organizations

Enterprise Plan - Custom Pricing
- For 100+ employees
- Features: Complete customization, dedicated account manager, SLA guarantee

KEY BENEFITS:
- Saves 15-20 hours per week on manual HR tasks
- 99.9% uptime guarantee
- Easy 48-hour implementation
- Mobile app available (iOS & Android)
- 24/7 customer support
- 30-day free trial available
- Bank-level security (AES-256 encryption)
- Fully compliant with Indian labor laws

COMMON QUESTIONS & ANSWERS:

Q: What is HRSync?
A: HRSync is an HRMS platform designed for Indian companies to manage attendance, payroll, leave, compliance, and employee records all in one place.

Q: How much does it cost?
A: We offer plans starting from Rs 499/month for startups up to enterprise plans. We also offer a 30-day free trial.

Q: Does HRSync support payroll?
A: Yes, payroll processing is available in Growth and Pro plans. It includes salary structure management, TDS calculation, PF & ESIC, and automated salary slips.

Q: Can I integrate HRSync with other tools?
A: Yes, our Pro and Enterprise plans include full API access for integrations with third-party tools and custom development.

Q: Is there a free trial?
A: Yes, we offer a 30-day free trial with full access to all features.

Q: How secure is my data?
A: We use bank-level AES-256 encryption, regular security audits, and data centers in India with daily backups.

RESPONSE RULES:
- Always answer questions about HRSync features, pricing, and benefits.
- Be conversational and natural.
- Suggest relevant features based on what users ask.
- If user asks about something not related to HRSync, politely redirect to HR topics.
- Always mention the free trial when discussing pricing.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please provide a valid message." },
        { status: 400 }
      );
    }

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { reply: "AI service configuration error. Please contact support@hrsync.com" },
        { status: 500 }
      );
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .map(
          (msg: any) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");
    }

    const fullPrompt = `${ENHANCED_HR_CONTEXT}

${conversationContext ? `CONVERSATION SO FAR:\n${conversationContext}\n\n` : ""}User: ${message}

Respond naturally and helpfully.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Gemini API Error:", res.status, errorData);

      // Handle specific error cases
      if (res.status === 401) {
        return NextResponse.json(
          { reply: "API authentication failed. Please check your API key configuration." },
          { status: 401 }
        );
      }

      if (res.status === 429) {
        return NextResponse.json(
          { reply: "Too many requests. Please try again in a moment." },
          { status: 429 }
        );
      }

      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();

    // Safe extraction of response
    let reply = "";
    try {
      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e) {
      console.error("Error extracting response:", e);
    }

    if (!reply || reply.trim() === "") {
      console.error("Empty response from API:", data);
      return NextResponse.json(
        { reply: "Could you please rephrase your question?" },
        { status: 200 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    return NextResponse.json(
      {
        reply: "Having trouble connecting to the AI service. Please try again or contact support@hrsync.com"
      },
      { status: 500 }
    );
  }
}