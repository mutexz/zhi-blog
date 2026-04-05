---
title: "AI 测评工程师完整技能栈（2026）"
description: "从传统 QA 到 AI 质量工程师的系统性转型指南：思维转型、LLM 评估方法论、RAG/Agent、红队测试、工程化流水线与合规治理。"
pubDate: 2026-04-05
tags:
  - 'AI 测评'
  - 'LLM'
  - '职业'
readTime: 约 25 分钟
featured: true
---


> 从传统 QA 到 AI 质量工程师的系统性转型指南

---

## 为什么写这篇文章

2026 年，AI 应用已经深入每一个软件产品。但绝大多数团队在 AI 质量保障上仍停留在"人工看一看"的阶段——没有系统化的评估指标、没有自动化的测试流水线、没有可量化的质量基线。

**"评估工程师"（Evaluation Engineer）正在成为 2026 年最稀缺的技术角色之一。** 能够度量、压测和负责任地交付 AI 系统的能力，正是将顶尖工程师与普通从业者区分开来的关键。

本文从实战出发，完整梳理 AI 测评方向所需的全部知识、工具和实践路径。

---

## 目录

- [一、思维转型：从确定性测试到概率性评估](#一思维转型从确定性测试到概率性评估)
- [二、基础层：理解被测对象](#二基础层理解被测对象)
- [三、核心层：LLM 评估方法论](#三核心层llm-评估方法论)
- [四、应用层：工具链与框架](#四应用层工具链与框架)
- [五、专项能力：RAG 评估](#五专项能力rag-评估)
- [六、专项能力：Agent 评估](#六专项能力agent-评估)
- [七、专项能力：AI 安全与红队测试](#七专项能力ai-安全与红队测试)
- [八、工程化：可观测性与生产监控](#八工程化可观测性与生产监控)
- [九、体系化：评估流水线与 CI/CD 集成](#九体系化评估流水线与-cicd-集成)
- [十、进阶：自定义 Benchmark 与数据集工程](#十进阶自定义-benchmark-与数据集工程)
- [十一、合规与治理](#十一合规与治理)
- [十二、学习路线图](#十二学习路线图)
- [十三、简历怎么写](#十三简历怎么写)
- [附录：关键资源索引](#附录关键资源索引)

---

## 一、思维转型：从确定性测试到概率性评估

这是整个技能栈中**最重要**的一环。如果你只从本文带走一个认知，就是这个：

### 传统测试 vs AI 测评

| 维度 | 传统软件测试 | AI/LLM 测评 |
| --- | --- | --- |
| 输入输出关系 | 确定性：相同输入 → 相同输出 | 非确定性：相同输入 → 不同但可能都正确的输出 |
| 判定标准 | 二值：PASS / FAIL | 概率性：0.0 ~ 1.0 的质量分数 |
| 断言方式 | `assertEqual(output, expected)` | `assert score >= threshold` |
| 失败模式 | 崩溃、异常、返回值错误 | 幻觉、偏见、拒答、格式崩坏、上下文混淆 |
| 测试用例 | 手写或参数化生成 | Golden Dataset + 合成数据 |
| 评判者 | 代码逻辑 | LLM-as-a-Judge / 人类标注 / NLP 指标 |

### LLM 应用的五大典型失败模式

1. **幻觉（Hallucination）**——生成听起来合理但完全虚假的内容
2. **拒答（Refusal）**——对合理请求不当拒绝
3. **漂移（Drift）**——质量随时间或模型更新悄然下降
4. **格式崩坏（Format Breaking）**——JSON 不合法、Markdown 断裂
5. **上下文混淆（Context Confusion）**——混淆不同用户/会话的信息

> **关键认知**：你不再是在测"对不对"，而是在测"多好"、"多安全"、"多稳定"。

---

## 二、基础层：理解被测对象

做 AI 测评首先要理解"被测对象"的工作原理。不需要成为算法专家，但需要理解以下核心概念。

### 2.1 大语言模型基础

| 知识点 | 你需要理解到什么程度 | 推荐资源 |
| --- | --- | --- |
| Transformer 与注意力机制 | 理解"为什么模型能理解上下文" | [LLM Visualization](https://bbycroft.net/llm) — 交互式可视化 |
| Token 化 | 理解"为什么 Token 数影响成本和质量" | [OpenAI Tokenizer](https://platform.openai.com/tokenizer) |
| Temperature / Top-p | 理解"为什么同一提示的输出不同" | 实操：在 LM Studio 中调节参数观察差异 |
| 上下文窗口 | 理解"为什么长文档会丢失信息" | 实操：用超长文本测试模型 |
| 微调 vs 提示工程 | 理解"什么时候用哪种方法" | [Prompt Engineering Guide](https://www.promptingguide.ai/zh) |

### 2.2 提示工程

这不仅是使用 AI 的技能，更是设计评估 prompt 的必备能力——因为评估指标本身就是通过精心设计的 prompt 来实现 LLM-as-a-Judge 的。

| 技术 | 说明 | 在测评中的应用 |
| --- | --- | --- |
| Zero-shot | 不给示例 | 简单评估任务 |
| Few-shot | 给出几个示例 | 校准评估标准 |
| Chain-of-Thought | 要求模型逐步推理 | G-Eval 等需要推理的指标 |
| System Prompt | 设定角色和约束 | 自定义评估判官的行为 |

### 2.3 RAG 架构

**检索增强生成（Retrieval-Augmented Generation）** 是当前最常见的 LLM 应用架构。

```
用户问题 → 向量检索 → 获取相关文档片段 → LLM 基于文档生成回答
```

测评 RAG 系统需要分别评估**检索质量**和**生成质量**，这是两个独立的失败点。

- 📄 [RAG 论文原文](https://arxiv.org/abs/2005.11401)
- 📘 [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag/)

### 2.4 AI Agent 架构

Agent = LLM + 工具调用 + 规划能力。评估 Agent 比评估普通 LLM 对话复杂得多，因为需要考虑：

- 工具选择是否正确
- 调用序列是否合理
- 最终任务是否完成
- 中间步骤是否安全

- 📄 [LLM Agents 综述 by Lilian Weng](https://lilianweng.github.io/posts/2023-06-23-agent/)

---

## 三、核心层：LLM 评估方法论

### 3.1 评估维度体系

一个成熟的 AI 测评体系需要覆盖以下七个维度：

| 维度 | 定义 | 核心指标 | 阈值参考 |
| --- | --- | --- | --- |
| **正确性** | 输出是否事实正确 | Correctness, G-Eval | ≥ 0.7 |
| **相关性** | 回答是否切题 | Answer Relevancy | ≥ 0.75 |
| **忠实度** | 是否基于给定上下文回答 | Faithfulness, Groundedness | ≥ 0.8（受监管行业 ≥ 0.9） |
| **幻觉** | 是否产生不存在的信息 | Hallucination Score | ≤ 0.2 |
| **连贯性** | 逻辑是否通顺一致 | Coherence | ≥ 0.7 |
| **安全性** | 是否有毒/偏见/不当内容 | Toxicity, Bias | ≤ 0.1 |
| **鲁棒性** | 对抗性输入下是否稳定 | Adversarial Robustness | 通过率 ≥ 90% |

### 3.2 四大评估范式

#### 范式一：LLM-as-a-Judge（最主流）

用一个强模型（如 GPT-4、Claude Opus、MiMo-V2-Pro）来评判另一个模型的输出质量。

```python
# DeepEval 示例：G-Eval 自定义评估
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCaseParams

metric = GEval(
    name="正确性",
    criteria="判断 actual_output 是否基于 expected_output 提供了正确的信息",
    evaluation_params=[
        LLMTestCaseParams.ACTUAL_OUTPUT,
        LLMTestCaseParams.EXPECTED_OUTPUT,
    ],
    threshold=0.7,
    model=your_judge_model,  # 可以是本地模型或 API 模型
)
```

**优势**：灵活、可解释（能给出评分理由）、适合复杂场景
**劣势**：受限于评估模型自身的能力、成本较高、有偏差风险

- 📄 [G-Eval 论文](https://arxiv.org/abs/2303.16634) — NLG 评估的 LLM-as-a-Judge 方法

#### 范式二：基准测试（Benchmark）

在标准数据集上跑分，和业界模型对比。

| 基准 | 评估能力 | 说明 |
| --- | --- | --- |
| MMLU / MMLU-Pro | 知识广度 | 57 个学科的多选题 |
| HumanEval / MBPP | 代码生成 | 给定函数签名生成实现 |
| GSM8K | 数学推理 | 小学数学应用题 |
| TruthfulQA | 真实性 | 检测模型是否复制常见误解 |
| GPQA Diamond | 专家推理 | 研究生级别的科学问题 |
| HellaSwag | 常识推理 | 情景续写选择 |

#### 范式三：人工评估

最可靠但成本最高。常用方法：

- **Chatbot Arena**：两个模型匿名对战，人类选择更好的
- **标注员打分**：按维度 1-5 分打分
- **A/B 测试**：生产环境中的用户偏好

#### 范式四：传统 NLP 指标

适用于有明确标准答案的场景：

| 指标 | 适用场景 |
| --- | --- |
| BLEU | 机器翻译 |
| ROUGE | 文本摘要 |
| BERTScore | 语义相似度 |
| Exact Match | 信息抽取 |

### 3.3 评估金字塔

类比传统测试金字塔，LLM 评估也有层级：

```
                ┌──────────────┐
                │ 端到端评估   │ ← 完整用户场景
                │  (E2E Eval)  │
               ├──────────────┤
              │ 功能评估        │ ← RAG 管道、Agent 链路
              │ (Functional)    │
             ├──────────────────┤
            │ 单元评估            │ ← 单个 Prompt 的质量
            │ (Unit Eval)        │
           ├──────────────────────┤
          │ 回归评估               │ ← Golden Dataset 对比
          │ (Regression Eval)     │
         └─────────────────────────┘
```

- **单元评估**：单个 prompt 输入，检查输出质量是否达标
- **功能评估**：测试 RAG 检索+生成的完整链路
- **端到端评估**：模拟真实用户多轮对话场景
- **回归评估**：模型/提示词更新后，跑 Golden Dataset 对比

---

## 四、应用层：工具链与框架

### 4.1 评估框架全景对比

| 框架 | 核心定位 | 语言 | 本地模型支持 | CI/CD | 最适合 |
| --- | --- | --- | --- | --- | --- |
| **[DeepEval](https://github.com/confident-ai/deepeval)** | 类 Pytest 的 LLM 单元测试 | Python | ✅ | ✅ | 全面的评估测试 |
| **[RAGAS](https://github.com/explodinggradients/ragas)** | 专注 RAG 评估 | Python | ✅ | ✅ | RAG 管道质量 |
| **[Promptfoo](https://github.com/promptfoo/promptfoo)** | Prompt 回归测试 | Node.js | ✅ | ✅ (GitHub Actions) | 提示词迭代对比 |
| **[LangSmith](https://docs.smith.langchain.com/)** | LangChain 生态追踪+评估 | Python | 部分 | ✅ | LangChain 项目 |
| **[Braintrust](https://www.braintrust.dev/)** | 实验管理平台 | Python/TS | ✅ | ✅ | 团队协作实验 |

#### 深入：DeepEval（推荐首选）

DeepEval 是目前最全面的开源 LLM 评估框架，优势：

1. **类 Pytest 语法**——测试工程师零学习成本
2. **14+ 内置指标**——覆盖 RAG、Agent、对话、安全等
3. **支持任意模型**——包括本地部署的开源模型
4. **可解释性**——每个分数都有评分理由
5. **CI/CD 友好**——可直接集成到自动化流水线

```python
# DeepEval + 本地模型完整示例
import pytest
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase

# 自定义本地模型作为评估判官（LM Studio / Ollama）
from models.openrouter_model import OpenRouterModel
judge = OpenRouterModel(model_name="xiaomi/mimo-v2-pro")

@pytest.mark.parametrize("test_case", [
    LLMTestCase(
        input="如何在 WPS 中设置页边距？",
        actual_output="点击页面布局→页边距→自定义边距。",
        retrieval_context=["WPS 通过页面布局菜单设置边距。"],
    ),
])
def test_rag_quality(test_case):
    relevancy = AnswerRelevancyMetric(threshold=0.7, model=judge)
    faithfulness = FaithfulnessMetric(threshold=0.8, model=judge)
    assert_test(test_case, [relevancy, faithfulness])
```

```bash
# 运行评估
deepeval test run test_rag_quality.py -n 4  # -n 4 表示 4 个并行
```

- 📘 [DeepEval 官方文档](https://deepeval.com/docs)
- 📘 [DeepEval 指标完整列表](https://deepeval.com/docs/metrics-introduction)

---

## 五、专项能力：RAG 评估

RAG 是最常见的 LLM 应用架构，也是评估重点。

### 5.1 RAG 三元组（RAG Triad）

RAG 系统有两个独立的失败点，用三个核心指标覆盖：

```
               ┌─────────────────────┐
               │   用户问题 (Query)   │
               └──────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   检索模块 (Retriever)      │
        │                             │
        │  指标①：Context Relevance   │ ← 检索到的内容是否相关？
        │  指标②：Context Recall      │ ← 是否找全了需要的内容？
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   生成模块 (Generator)      │
        │                             │
        │  指标③：Faithfulness        │ ← 生成的回答是否忠实于检索内容？
        │  指标④：Answer Relevancy    │ ← 生成的回答是否切题？
        └─────────────────────────────┘
```

### 5.2 RAG 关键指标详解

| 指标 | 定义 | 计算方法 | 目标值 |
| --- | --- | --- | --- |
| **Context Precision** | 检索到的内容中有多少是有用的 | 有用片段数 / 总检索片段数 | ≥ 0.7 |
| **Context Recall** | 需要的信息是否都被检索到了 | 召回的关键信息数 / 总关键信息数 | ≥ 0.8 |
| **Faithfulness** | 生成的回答是否有据可查 | 有据断言数 / 总断言数 | ≥ 0.8（受监管 ≥ 0.9） |
| **Answer Relevancy** | 回答是否切题 | 相关句子数 / 总句子数 | ≥ 0.75 |
| **Citation Correctness** | 引用是否指向正确的来源 | 正确引用数 / 总引用数 | ≥ 0.9 |

### 5.3 RAG 评估的超参数测试

除了评估输出，还要系统测试影响质量的关键配置：

- **Embedding 模型选择**：text-embedding-3-small vs bge-large-zh
- **Top-K 检索数量**：3 vs 5 vs 10 vs 20
- **Chunk Size**：256 vs 512 vs 1024
- **重排序策略**：无 vs Cohere Reranker vs BGE Reranker
- **LLM Temperature**：0 vs 0.3 vs 0.7

```python
# DeepEval 中使用 RAGAS 指标评估 RAG
from deepeval.metrics import (
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    FaithfulnessMetric,
    AnswerRelevancyMetric,
)

metrics = [
    ContextualPrecisionMetric(threshold=0.7, model=judge),
    ContextualRecallMetric(threshold=0.8, model=judge),
    FaithfulnessMetric(threshold=0.8, model=judge),
    AnswerRelevancyMetric(threshold=0.75, model=judge),
]
```

- 📘 [DeepEval RAG 评估指南](https://deepeval.com/guides/guides-rag-evaluation)
- 📘 [RAGAS 官方文档](https://docs.ragas.io/)
- 📘 [RAG 评估最佳实践（2026）](https://blog.premai.io/rag-evaluation-metrics-frameworks-testing-2026/)

---

## 六、专项能力：Agent 评估

Agent 评估比普通 LLM 评估复杂得多，因为涉及多步推理、工具调用和任务编排。

### 6.1 Agent 评估维度

| 维度 | 评估内容 | 指标 |
| --- | --- | --- |
| **任务完成度** | Agent 是否完成了用户的目标 | Task Completion Rate |
| **工具正确性** | 是否选对了工具、传对了参数 | Tool Correctness |
| **轨迹合理性** | 执行路径是否合理高效 | Trajectory Efficiency |
| **安全性** | 是否执行了危险操作 | Safety Violation Rate |
| **可解释性** | 推理过程是否透明可追溯 | Reasoning Transparency |

### 6.2 Agent 评估基准（2026）

| 基准 | 发布方 | 特点 | 地址 |
| --- | --- | --- | --- |
| **VAKRA** | IBM (2026.03) | 8000+ API、62 领域、3-7 步推理链 | [链接](https://www.ibm.com/new/announcements/introducing-vakra-benchmark) |
| **Toolathlon** | ICLR 2026 | 32 个软件应用、604 个工具、108 个任务 | [toolathlon.xyz](https://toolathlon.xyz/) |
| **Claw-Eval** | 社区 (2026.03) | 139 个任务、Pass³ 指标消除运气因素 | [GitHub](https://github.com/claw-eval/claw-eval) |
| **τ²-Bench** | 学术 | 电信领域端到端 Agent 评估 | 学术论文 |

### 6.3 DeepEval 中的 Agent 评估

```python
from deepeval.metrics import TaskCompletionMetric, ToolCorrectnessMetric

task_metric = TaskCompletionMetric(threshold=0.8, model=judge)
tool_metric = ToolCorrectnessMetric(threshold=0.9, model=judge)
```

- 📘 [AI Agent 评估完整指南（2025-2026）](https://www.xugj520.cn/en/archives/ai-agent-evaluations-guide-2025.html)

---

## 七、专项能力：AI 安全与红队测试

**这是 2026 年最有含金量的专项能力之一。** 未防护模型的攻击成功率高达 87%，而现代防御手段可将其降至 4.4%。

### 7.1 红队测试工具全景对比

| 工具 | 维护方 | 特点 | 最适合 | 地址 |
| --- | --- | --- | --- | --- |
| **[Garak](https://github.com/NVIDIA/garak)** | NVIDIA | 120+ 漏洞类别，插件式架构，审计友好 | 系统性安全审计 | [GitHub](https://github.com/NVIDIA/garak) |
| **[PyRIT](https://github.com/Azure/PyRIT)** | Microsoft | 完整框架，可链式攻击，支持视觉模型 | 深度定制化测试 | [GitHub](https://github.com/Azure/PyRIT) |
| **[Promptfoo Red Team](https://www.promptfoo.dev/docs/red-team/)** | Promptfoo | 应用感知，CI/CD 集成，Web 看板 | 持续安全测试 | [文档](https://www.promptfoo.dev/docs/red-team/) |
| **DeepEval Red Teaming** | Confident AI | DeepEval 内置，40+ 攻击场景 | 评估框架一体化 | [文档](https://deepeval.com/docs/red-teaming-introduction) |

### 7.2 常见攻击类型

| 攻击类型 | 说明 | 风险等级 |
| --- | --- | --- |
| **提示词注入** | 通过精心构造的输入绕过系统指令 | 🔴 极高 |
| **越狱攻击** | 诱导模型产生被禁止的输出 | 🔴 极高 |
| **数据泄露** | 提取训练数据中的敏感信息 | 🔴 极高 |
| **毒性生成** | 产生有害、侮辱性内容 | 🟡 高 |
| **偏见放大** | 输出体现或强化社会偏见 | 🟡 高 |
| **SQL/代码注入** | 通过工具调用执行恶意代码 | 🔴 极高 |
| **间接注入** | 通过第三方数据源注入恶意指令 | 🔴 极高 |
| **拒绝服务** | 构造超长/超复杂输入消耗资源 | 🟢 中 |

### 7.3 红队测试实践

```python
# DeepEval 红队测试示例
from deepeval.red_teaming import RedTeamer

red_teamer = RedTeamer(model=judge)

# 对目标模型进行安全扫描
results = red_teamer.scan(
    target_model=your_ai_app,
    attacks=[
        "prompt_injection",
        "jailbreak",
        "toxicity",
        "bias",
        "sql_injection",
    ],
)

# 生成安全报告
print(f"总攻击数: {results.total_attacks}")
print(f"攻击成功率: {results.attack_success_rate:.1%}")
print(f"发现漏洞数: {results.vulnerabilities_found}")
```

---

## 八、工程化：可观测性与生产监控

评估不仅在上线前——生产环境中的持续监控同样重要。

### 8.1 可观测性工具对比

| 工具 | 定位 | 核心能力 | 开源 | 地址 |
| --- | --- | --- | --- | --- |
| **[Langfuse](https://langfuse.com/)** | 生产监控优先 | 追踪、Prompt 版本管理、成本分析、用户会话分组 | ✅ | [GitHub](https://github.com/langfuse/langfuse) |
| **[Phoenix](https://phoenix.arize.com/)** | 开发调试优先 | 实验对比、Span 级分析、检索文档审查 | ✅ | [GitHub](https://github.com/Arize-ai/phoenix) |
| **[Helicone](https://helicone.ai/)** | API 网关模式 | 透明代理、零代码集成、成本追踪 | ✅ | [GitHub](https://github.com/Helicone/helicone) |

#### 选型建议

- 需要**生产监控和 Prompt 治理** → Langfuse
- 需要**实验对比和深度调试** → Phoenix
- 需要**最低侵入性的成本追踪** → Helicone
- 三者都基于 OpenTelemetry 标准，可以同时使用

### 8.2 生产监控关键指标

| 指标类别 | 具体指标 | 含义 |
| --- | --- | --- |
| 质量 | 幻觉率、用户满意度、任务完成率 | 输出是否达标 |
| 性能 | TTFT（首 Token 时间）、TPS（每秒 Token） | 响应速度 |
| 成本 | Token 消耗、API 调用次数、每次对话成本 | 经济可持续性 |
| 安全 | 拒答率、安全拦截率、敏感信息泄露事件 | 合规保障 |
| 可用性 | 错误率、超时率、降级触发次数 | 系统稳定性 |

### 8.3 生产环境中的 LLM-as-a-Judge

Langfuse 在 2026 年 4 月发布了在线评估的最佳实践——使用 LLM-as-a-Judge 监控生产中的高信号事件：

- **用户挫败检测**：分析对话是否出现用户不满
- **分歧检测**：两个模型对同一输入给出矛盾回答时报警
- **质量降级预警**：评估分数低于阈值时触发告警

- 📘 [Langfuse: LLM-as-a-Judge 生产监控](https://langfuse.com/blog/2026-04-01-llm-as-a-judge-production-monitoring)

---

## 九、体系化：评估流水线与 CI/CD 集成

### 9.1 评估流水线架构

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────────┐
│ 代码变更  │───▶│ Golden       │───▶│ 评估执行  │───▶│ 报告 & 门控  │
│ (PR/MR)  │    │ Dataset 加载 │    │ (DeepEval)│    │ (Pass/Fail)  │
└──────────┘    └──────────────┘    └──────────┘    └──────────────┘
                                          │                 │
                                          ▼                 ▼
                                    ┌──────────┐    ┌──────────────┐
                                    │ 指标计算  │    │ 仪表盘更新   │
                                    │ & 对比    │    │ & 通知       │
                                    └──────────┘    └──────────────┘
```

### 9.2 CI/CD 集成示例

#### GitHub Actions

```yaml
# .github/workflows/llm-eval.yml
name: LLM Evaluation
on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'rag/**'
      - 'agents/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install deepeval
      - run: deepeval test run tests/eval/ -n 4
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: .deepeval/
```

#### 质量门控

```python
# conftest.py - 配置评估门控
import pytest

def pytest_terminal_summary(terminalreporter):
    passed = len(terminalreporter.stats.get("passed", []))
    failed = len(terminalreporter.stats.get("failed", []))
    total = passed + failed
    pass_rate = passed / total if total > 0 else 0

    if pass_rate < 0.95:
        pytest.exit(
            f"评估通过率 {pass_rate:.1%} 低于 95% 门控阈值，阻止合并。",
            returncode=1,
        )
```

- 📘 [DeepEval CI/CD RAG 评估](https://confident-ai.com/blog/how-to-evaluate-rag-applications-in-ci-cd-pipelines-with-deepeval)
- 📘 [Promptfoo CI/CD 集成](https://www.promptfoo.dev/docs/integrations/ci-cd/)

---

## 十、进阶：自定义 Benchmark 与数据集工程

### 10.1 Golden Dataset 设计原则

Golden Dataset 是评估体系的基石。设计要点：

| 原则 | 说明 |
| --- | --- |
| **覆盖性** | 覆盖核心业务场景的主要路径和边界情况 |
| **多样性** | 包含不同难度、不同表述方式、不同语言风格的用例 |
| **对抗性** | 包含容易引发幻觉、混淆、拒答的"陷阱"用例 |
| **版本控制** | 数据集随产品迭代更新，保留历史版本用于对比 |
| **标注质量** | Expected Output 由领域专家标注和审核 |

### 10.2 合成数据生成

当真实数据不足时，可以用 LLM 生成合成测试数据：

```python
from deepeval.dataset import EvaluationDataset
from deepeval.synthesizer import Synthesizer

synthesizer = Synthesizer(model=judge)

# 从文档自动生成 QA 对
dataset = synthesizer.generate_goldens_from_docs(
    document_paths=["docs/user_manual.pdf"],
    max_goldens_per_document=50,
)
```

### 10.3 自定义业务 Benchmark

为特定业务场景设计的 Benchmark 远比通用基准有价值：

```python
# 示例：WPS AI 助手质量 Benchmark
benchmark_categories = {
    "文档操作": [
        {"input": "怎么合并两个表格？", "difficulty": "easy"},
        {"input": "如何批量替换文档中的格式？", "difficulty": "medium"},
        {"input": "宏命令怎么实现自动编号？", "difficulty": "hard"},
    ],
    "公式计算": [...],
    "数据分析": [...],
    "多轮对话": [...],
    "错误输入": [...],  # 对抗性用例
}
```

---

## 十一、合规与治理

### 11.1 国内外 AI 法规

| 法规 | 地区 | 核心要求 | 生效时间 |
| --- | --- | --- | --- |
| 《生成式人工智能服务管理暂行办法》 | 中国 | 内容安全、标注义务、算法备案 | 2023.08 |
| 《人工智能安全治理框架》 | 中国 | 风险分级管控 | 2024 |
| EU AI Act | 欧盟 | 风险分级、透明度、可解释性 | 2024-2026 分步 |
| NIST AI RMF | 美国 | AI 风险管理框架（指导性） | 2023 |

### 11.2 AI 治理中测评工程师的角色

- 建立 AI 输出质量基线和监控机制
- 设计并执行安全性/公平性/隐私评估
- 制定评估标准并与合规团队协作
- 留存评估证据用于审计

- 📘 [NIST AI Risk Management Framework](https://www.nist.gov/artificial-intelligence)

---

## 十二、学习路线图

### 按优先级分阶段

```
第 1 周：快速启动
├── ✅ 安装 DeepEval，跑通第一个评估用例
├── ✅ 理解 LLM-as-a-Judge 范式
├── ✅ 掌握 G-Eval、Answer Relevancy 指标
└── ✅ 用本地模型或 OpenRouter 完成一次完整评估

第 2-3 周：深入核心
├── 掌握 RAG 评估四件套（Precision / Recall / Faithfulness / Relevancy）
├── 学习 RAGAS 框架，对比 DeepEval 的 RAGAS 实现
├── 学习 Promptfoo，做提示词回归测试
└── 开始构建自己的 Golden Dataset

第 4-6 周：安全与 Agent
├── 用 DeepEval / Garak 做红队测试
├── 了解 Agent 评估指标（Task Completion, Tool Correctness）
├── 搭建一个完整的评估流水线
└── 将评估集成到 CI/CD

第 7-12 周：体系化输出
├── 设计业务专属 Benchmark
├── 搭建可观测性平台（Langfuse / Phoenix）
├── 写一篇完整的技术分享
├── 产出评估报告，推动团队采纳
└── 持续跟踪领域最新进展
```

### 按角色分路径

| 当前角色 | 推荐切入点 | 差异化优势 |
| --- | --- | --- |
| **传统测试工程师** | DeepEval（类 Pytest） + 红队测试 | 测试方法论 + AI 质量 |
| **后端开发** | RAG 评估 + CI/CD 集成 | 系统工程 + 质量度量 |
| **数据工程师** | Golden Dataset + Benchmark 设计 | 数据驱动评估 |
| **安全工程师** | 红队测试 + AI 治理 | AI 安全专家 |

---

## 十三、简历怎么写

### 岗位关键词

`AI 质量工程师` `LLM 评估工程师` `AI Testing Engineer` `Evaluation Engineer` `AI Safety Engineer`

### 项目经验写法示例

```
AI 应用质量评估体系建设
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 基于 DeepEval 框架搭建自动化 LLM 评估流水线，使用本地部署的 Qwen3.5-9B
  和云端 MiMo-V2-Pro 作为评估模型，覆盖正确性、相关性、忠实度、幻觉四个维度
• 设计并实施 RAG 系统质量评估方案，包含 Context Precision/Recall、
  Faithfulness 等 6 项核心指标，推动 RAG 忠实度从 0.72 提升至 0.91
• 使用 Garak + DeepEval 对 AI 功能实施红队测试，覆盖提示词注入、越狱攻击等
  40+ 安全场景，发现并协助修复 12 个安全漏洞
• 将评估流水线集成到 CI/CD（GitHub Actions），每次 Prompt/模型变更
  自动触发回归评估，阻止 3 次质量降级的上线
• 构建包含 500+ 用例的业务 Golden Dataset，覆盖核心用户场景，
  建立质量基线和版本间对比机制
```

### 技能关键词

```
评估框架: DeepEval, RAGAS, Promptfoo, LangSmith
评估指标: G-Eval, Faithfulness, Context Precision/Recall, Answer Relevancy
安全测试: AI Red Teaming, Prompt Injection Detection, Garak, PyRIT
可观测性: Langfuse, Phoenix, OpenTelemetry
模型部署: LM Studio, Ollama, vLLM
基准测试: MMLU, HumanEval, TruthfulQA, 自定义 Benchmark
```

---

## 附录：关键资源索引

### 评估框架

| 名称 | 链接 |
| --- | --- |
| DeepEval | [GitHub](https://github.com/confident-ai/deepeval) / [文档](https://deepeval.com/docs) |
| RAGAS | [GitHub](https://github.com/explodinggradients/ragas) / [文档](https://docs.ragas.io/) |
| Promptfoo | [GitHub](https://github.com/promptfoo/promptfoo) / [文档](https://www.promptfoo.dev/docs/intro/) |
| LangSmith | [文档](https://docs.smith.langchain.com/) |

### 安全测试

| 名称 | 链接 |
| --- | --- |
| Garak (NVIDIA) | [GitHub](https://github.com/NVIDIA/garak) |
| PyRIT (Microsoft) | [GitHub](https://github.com/Azure/PyRIT) |
| DeepEval Red Teaming | [文档](https://deepeval.com/docs/red-teaming-introduction) |

### 可观测性

| 名称 | 链接 |
| --- | --- |
| Langfuse | [GitHub](https://github.com/langfuse/langfuse) / [文档](https://langfuse.com/docs) |
| Phoenix (Arize) | [GitHub](https://github.com/Arize-ai/phoenix) / [文档](https://docs.arize.com/phoenix) |

### 学术论文

| 主题 | 链接 |
| --- | --- |
| G-Eval: NLG Evaluation using GPT-4 | [arXiv](https://arxiv.org/abs/2303.16634) |
| RAG 论文原文 | [arXiv](https://arxiv.org/abs/2005.11401) |
| LLM 幻觉综述 | [arXiv](https://arxiv.org/html/2510.06265v2) |
| HELM 评估基准 | [斯坦福 CRFM](https://crfm.stanford.edu/helm/) |

### 学习资源

| 名称 | 链接 |
| --- | --- |
| Prompt Engineering Guide (中文) | [promptingguide.ai](https://www.promptingguide.ai/zh) |
| LLM Visualization | [bbycroft.net](https://bbycroft.net/llm) |
| LLM Agents 综述 | [Lilian Weng](https://lilianweng.github.io/posts/2023-06-23-agent/) |
| LLM 测试实战指南 | [aitestingguide.com](https://aitestingguide.com/how-to-test-llm-applications/) |
| RAG 评估最佳实践 | [premai.io](https://blog.premai.io/rag-evaluation-metrics-frameworks-testing-2026/) |

---

> **最后一句话**：AI 测评不是一个工具问题，而是一个思维方式问题。掌握"概率性评估"的思维模式，比学会任何一个框架都重要。工具会变，方法论不会。
>
> _本文写于 2026 年 4 月，基于实际项目经验和最新行业资料。_
