# Sogni Comfy Worker

Contribute a rented NVIDIA GPU to the [Sogni Supernet](https://www.sogni.ai) and earn rewards for completed AI jobs. The worker receives work automatically; monitor it and change supported settings in the [Sogni Workers dashboard](https://dashboard.sogni.ai/fast-workers/).

This template runs the Sogni Fast Worker service. Its interface is the Sogni dashboard; it does not provide a standalone ComfyUI editor.

## Before you deploy

You need a funded [Nosana account](https://deploy.nosana.com), a [Sogni account](https://app.sogni.ai), and:

| Required value | Where to get it |
| --- | --- |
| **Sogni API key** | Sign in at [dashboard.sogni.ai/api-key](https://dashboard.sogni.ai/api-key) and copy your account's key. |
| **Fast Worker NFT token ID** | Use the [Sogni Worker NFT site](https://nft.sogni.ai) and the account that owns the NFT. Copy the numeric token ID, not a wallet address. |

Use one unique NFT for each running GPU worker. Stop any worker already using that NFT before moving it here. The template does not mint an NFT or assign one from Sogni's partner fleet.

Keep the configured deployment **confidential**. Your API key must not be published in a GitHub file, shared job definition, public IPFS upload, screenshot, or support message. See [Nosana confidential jobs](https://learn.nosana.com/deployments/jobs/job-definition/confidential.html). The public template contains placeholders only.

## Choose your GPU preset

| Preset | GPU | Host RAM | Disk capacity to plan for |
| --- | --- | --- | --- |
| **24 GB GPUs** | RTX 3090 / 4090 | 64 GB recommended | 1 TB |
| **32 GB+ GPUs** | RTX 5090 / RTX PRO 6000 | 64 GB recommended; 128 GB for a 96 GB GPU | 500 GB |

Both presets use the official CUDA 13 worker and require **NVIDIA driver R580 or newer** on an x86-64 Linux host. Choose a GPU market whose hosts meet that requirement. GPU model alone does not establish the driver, available RAM, or free disk space.

The 24 GB preset preloads the general image, video, and audio catalog for that GPU size. The 32 GB+ preset preloads MiniMax video/music and FlashVSR upscaling, matching Sogni's larger-GPU Nosana catalog. The worker serves only workflows eligible for the actual hardware and available model files; a larger GPU does not unlock every model automatically.

As of September 2026, the model files alone total approximately **529 GB** and **116 GB**, respectively. These are planning snapshots, not quotas. Allow additional space for container images, caches, temporary files, and catalog growth. Setup requires at least **47 GiB of RAM visible to its container** and rejects smaller hosts before the worker starts. It does not enforce free disk space or driver requirements; confirm them when choosing a market and inspect the assigned host before relying on the worker. A rejected host can cause a retry or delay; the RAM check cannot reserve a suitable node.

## Deploy in Nosana

1. Open **Create Deployment** in [Nosana Deploy](https://deploy.nosana.com), select **Sogni Comfy Worker**, and choose the preset matching your GPU.
2. Choose a suitable GPU market. Keep **Replicas = 1** and use the **Infinite** strategy for an ongoing worker.
3. In the job definition form, expand **Environment variables** on **sogni-worker**. Replace both placeholders:

   | Field | Enter |
   | --- | --- |
   | `API_KEY` | Your Sogni API key |
   | `NFT_TOKEN_ID` | Your unique numeric Fast Worker NFT token ID |

4. Leave the resource loader, image, model mounts, and health endpoint at their template defaults. Review the deployment's confidentiality and rental cost, then deploy.
5. Follow the download progress in Nosana. A cold host can take tens of minutes or longer to fetch its model cache. Avoid repeatedly restarting a progressing download.
6. Open [Sogni Workers](https://dashboard.sogni.ai/fast-workers/), select your NFT, and confirm its version, GPU, online status, and available models. Check **Worker Health** and **Job History** as work arrives.

For another GPU, create another one-replica deployment with a different NFT token ID. Increasing replicas here copies the same credentials and makes workers compete for one identity.

## Manage the worker

Use the Sogni dashboard's **Settings** tab for supported workflow preferences and other operator controls. See the [dashboard guide](https://docs.sogni.ai/run-a-worker/fast-worker/worker-dashboard/) and [advanced configuration](https://docs.sogni.ai/run-a-worker/fast-worker/sogni-fast-worker-advanced-configuration/). Dashboard preferences cannot add files to Nosana's preloaded resource bundle; keep this template's managed download defaults unless following a specific Sogni recommendation.

The Sogni-owned [resource loader](https://hub.docker.com/r/sogni/nosana-worker-configurator/tags?name=0.1.0) is pinned to the immutable digest of version **0.1.0**. It resolves Sogni's recommended, versioned worker image on each new Nosana job. A running job stays on its existing image. Updates take effect when Nosana starts a new job; a replacement may need to queue for capacity and download models again. Review the [worker release notes](https://docs.sogni.ai/run-a-worker/fast-worker/release-notes/comfy-worker/) before an intentional update.

Models use Nosana's remote-resource cache mounted under `/data-models`. Cache reuse depends on the assigned host. This template does not provide a portable persistent `/data` volume; local state can be lost when a job is replaced. Supported dashboard overrides have best-effort recovery through the Sogni account, but this is not a backup of all worker data.

The exposed port **8001** is a dedicated health probe. `/startup` indicates valid startup progress; `/readiness` returns HTTP 200 when the worker can accept work. An online Nosana endpoint alone does not prove that a Sogni job has completed. Normal operation needs no public ComfyUI or worker control port.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| Queued in Nosana | Wait for a matching host or select another compatible market. The worker has not started yet. |
| Models downloading | Watch download progress. The first start on a cold host is slower than a cached start. |
| RAM, disk, or driver error | Select a host that meets the preset requirements. Repeatedly restarting on the same unsuitable host will not fix its hardware. |
| Resource JSON error during setup | Inspect the **resources** operation's logs first. A preceding RAM or configuration error prevents the worker from starting and can also produce a downstream resource-parse error. |
| Running in Nosana, offline in Sogni | Confirm both placeholders were replaced, the key belongs to the NFT owner, and the NFT is not running elsewhere. Review startup logs without sharing credentials. |
| Online, no jobs yet | Check available models and Worker Health. Work depends on Supernet demand and eligibility. |

Hosting charges are separate from Sogni rewards. Workload, revenue, and cost recovery are not guaranteed. Stop the deployment in Nosana when you want to stop renting the GPU; disconnecting the Sogni dashboard does not stop it.

More help: [Sogni Nosana guide](https://docs.sogni.ai/run-a-worker/fast-worker/running-on-nosana/), [Fast Worker FAQ](https://docs.sogni.ai/run-a-worker/fast-worker/fast-worker-faq/), [Sogni Discord](https://discord.com/invite/2JjzA2zrrc), or [app@sogni.ai](mailto:app@sogni.ai).
