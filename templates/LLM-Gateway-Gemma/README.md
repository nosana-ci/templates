# Managed Gemma inference

Internal gateway template serving Gemma 4 26B A4B on vLLM. Client-manager injects the
shared `VLLM_API_KEY` and creates a confidential INFINITE deployment only after an
administrator enables a priced model on an approved market. Importing this template does
not start a deployment.

Sized and measured on an RTX PRO 6000. Of the nine models benchmarked it was the most
robust: no failed requests at any concurrency tested, up to 1024, and 108 concurrent users
at the throughput the field expects. Do not lower the declared VRAM without re-running the
benchmark; the weights alone are an FP8 26B.

The weights are `RedHatAI/gemma-4-26B-A4B-it-FP8-dynamic`. Google does not publish an FP8
build, so this is a third-party quantization of the standard vLLM lineage.

Thinking is off unless a caller asks for it. When they do, `--reasoning-parser gemma4`
splits it into `reasoning_content` rather than leaving it in the reply.
