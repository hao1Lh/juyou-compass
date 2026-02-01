import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, UserInputs } from "../types";

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    user_profile: {
      type: Type.OBJECT,
      properties: {
        energy_type: { type: Type.STRING, description: "基于用户生辰推算的命理能量类型，如'炉中火'或'森林木'" },
        match_score: { type: Type.NUMBER, description: "个人与城市的契合度 0-100" },
        match_comment: { type: Type.STRING, description: "关于人地关系的简短分析" },
        wuxing: {
          type: Type.OBJECT,
          properties: {
            wood: { type: Type.NUMBER },
            fire: { type: Type.NUMBER },
            earth: { type: Type.NUMBER },
            metal: { type: Type.NUMBER },
            water: { type: Type.NUMBER },
          },
          required: ["wood", "fire", "earth", "metal", "water"],
        },
      },
      required: ["energy_type", "match_score", "match_comment", "wuxing"],
    },
    social_badge: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "极具传播性的称号，格式：[城市]·[形容词][名词]，如'大理·逍遥谪仙人'" },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3个关键词" },
        auspicious_direction: { type: Type.STRING, description: "吉利方位，如'古城东北'" },
        lucky_color: { type: Type.STRING, description: "幸运色" },
      },
      required: ["title", "keywords", "auspicious_direction", "lucky_color"],
    },
    dest_analysis: {
      type: Type.OBJECT,
      properties: {
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "维度名称，不超过5个字" },
              val: { type: Type.NUMBER, description: "评分 0-10" },
              desc: { type: Type.STRING, description: "简短评语" },
            },
            required: ["name", "val", "desc"],
          },
          description: "必须精确生成4个维度，以便在UI上呈2x2对称排列",
        },
      },
      required: ["dimensions"],
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        short_term: { type: Type.NUMBER },
        mid_term: { type: Type.NUMBER },
        long_term: { type: Type.NUMBER },
        comment: { type: Type.STRING },
      },
      required: ["short_term", "mid_term", "long_term", "comment"],
    },
    paid_content: {
      type: Type.OBJECT,
      properties: {
        pitfalls: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "警示标题" },
            risk_analysis: { type: Type.STRING, description: "深入分析为什么这对用户是一个风险" },
            mitigation_strategy: { type: Type.STRING, description: "具体的、可操作的解决方案" },
            severity: { type: Type.STRING, enum: ["high", "medium", "low"] }
          },
          required: ["title", "risk_analysis", "mitigation_strategy", "severity"],
        },
        roadmap: {
          type: Type.ARRAY,
          description: "三个阶段的旅居融入/发展规划",
          items: {
            type: Type.OBJECT,
            properties: {
              stage_name: { type: Type.STRING, description: "阶段名称，如 'Week 1: 着陆'" },
              action_title: { type: Type.STRING, description: "核心行动主题" },
              description: { type: Type.STRING, description: "详细建议" }
            },
            required: ["stage_name", "action_title", "description"]
          }
        },
        cheat_code: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "在地思维/内行洞察的标题" },
            content: { type: Type.STRING, description: "一条关于该城市非显而易见的、反直觉的高价值建议。" }
          },
          required: ["title", "content"]
        },
        lucky_spots: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            spots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "高能量地点名称" },
          },
          required: ["title", "spots"],
        },
      },
      required: ["pitfalls", "roadmap", "cheat_code", "lucky_spots"],
    },
  },
  required: ["user_profile", "social_badge", "dest_analysis", "scores", "paid_content"],
};

export const generateReport = async (inputs: UserInputs): Promise<ReportData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    请扮演一位精通中国传统命理（八字五行和紫微斗数）、现代环境心理学和数字游民生活方式的高级咨询师。
    
    用户信息：
    - 目标城市：${inputs.targetCity}
    - 旅居核心目的：${inputs.tripPurpose}
    - 出生日期：${inputs.birthDate}
    - 出生时间：${inputs.birthTime || "未知"}
    - 出生地：${inputs.birthPlace}
    - MBTI：${inputs.mbti || "未知"}
    - 当前时间：${new Date().toLocaleDateString()}

    任务：
    生成一份高价值的《旅居能量策略报告》。付费内容必须提供**深度的策略分析**和**实操建议**。
    
    关键要求：
    1. **dest_analysis (磁场维度)**: 必须且只能输出**4个**维度（例如：'开放包容度'、'生活节奏感'、'创业友好度'、'自然疗愈力'），以确保前端2x2网格布局完美对称。
    2. **Paid Content**:
       - **Pitfalls**: 结合命理弱点与城市特质的深度风险对冲。
       - **Roadmap**: 具体的三个阶段时间线规划。
       - **Cheat Code**: 一条反直觉的、内行视角的城市生活建议。

    语气：理性、深刻、一针见血，如同给特工下达的任务简报。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as ReportData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
