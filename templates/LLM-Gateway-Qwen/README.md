# Managed Qwen inference

Internal gateway template serving Qwen3.5-4B on vLLM. Client-manager injects the
shared `VLLM_API_KEY` and creates a confidential INFINITE deployment only after
an administrator enables a priced model on an approved market. Importing this
template does not start a deployment.

Sized for a 24 GB card that is not exclusively ours: vLLM refuses to start when
free VRAM is below `--gpu-memory-utilization` of the card's total, so the 0.75
setting leaves room for whatever else holds memory on the node. Within that
budget the 8.7 GiB of weights and the 2 GiB of KV cache for 16,384 tokens fit
with headroom. Raising the context or the utilization needs a node with the card
to itself.

The chat template opens the assistant turn with `<think>`, so the model's reply
begins inside a reasoning block and closes it before the answer. Without a
reasoning parser that whole block arrives as ordinary message content. `qwen3`
splits it into `reasoning_content`, and it handles the missing opening tag
because the template supplies it rather than the model.

## Qwen3.6 27B

Sized and measured on an RTX PRO 6000, where it earned more per card than any other model
benchmarked. It serves long prompts, so time to first token is the trade: around five
seconds at the concurrency it is calibrated for. That suits agents and batch work rather
than interactive chat.

Weights are the first-party `Qwen/Qwen3.6-27B-FP8`. Do not lower the declared VRAM without
re-running the benchmark.
