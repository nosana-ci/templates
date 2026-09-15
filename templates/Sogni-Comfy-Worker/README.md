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

## Choose your workload

Start with a focused bundle of popular models. Rental workers do not need the entire Sogni catalog: extra model families add download time and storage cost. Choose the work to serve first, then a compatible GPU and host.

| Preset | GPU | Minimum RAM available to setup | Model downloads |
| --- | --- | --- | --- |
| **Krea images + Identity** | 16 GB+ NVIDIA GPU; RTX 5080, 3090, 4090, 5090 or larger | 31 GiB | About 35.4 GB |
| **MiniMax — 32 GB GPU** | RTX 5090 | 47 GiB | About 110 GB |
| **MiniMax — 48 GB+ GPU** | Such as RTX PRO 6000 Blackwell 96 GB | 31 GiB | About 110 GB |

The image bundle includes **Krea 2 Turbo**, **Dark Beast Krea 2 v3**, **Krea 2 Identity Edit v1.2**, and **Dark Beast Krea 2 Identity Edit v1.2**. Both MiniMax presets contain the same **MiniMax H3 video and Music 3** files. Shared files are downloaded once. The worker serves only workflows eligible for its hardware and local files.

System RAM is separate from GPU VRAM. MiniMax Turbo, including FastH3, needs at least 47 GiB of system RAM on 24/32 GB GPUs; larger GPUs use the 31 GiB floor. The preset's setup check applies to RAM available inside the container, which may be less than the host's advertised total. A large GPU does not imply a proportionally large host-RAM requirement.

Download sizes are unique model-file totals from the live catalog on **September 14, 2026**, not total disk requirements or measurements of a host's cache. Allow additional free space for the worker image, temporary downloads, generated files, and catalog changes. Choose storage for that bundle and inspect the space actually available on the assigned host.

All presets use the CUDA 13 worker and require [NVIDIA driver R580 or newer](https://docs.nvidia.com/deploy/cuda-compatibility/minor-version-compatibility.html) on an x86-64 Linux host. Setup enforces the preset's RAM floor but does not validate the driver or free disk space. A RAM rejection can cause a retry or delay; it cannot reserve a suitable node.

For a smaller bundle, change the value after `--comfyConfig` in the **resources** operation before deploying:

| Work to serve | Catalog selector | Model downloads |
| --- | --- | --- |
| Krea 2 Turbo only | `comfy?filter=krea2_turbo_fp8_scaled` | About 19.4 GB |
| Dark Beast Krea 2 v3 only | `comfy?filter=dark_beast_krea2_fp8` | About 20.4 GB |
| MiniMax FastH3 video only | `comfy?filter=minimax-h3-shared,minimax-h3-fastvideo-int8` | About 45.1 GB |

Single-image bundles omit Identity Edit. FastH3-only includes its shared dependencies and omits other MiniMax tiers and music; retain the MiniMax preset's RAM check for your GPU class.

## Deploy in Nosana

1. Open **Create Deployment** in [Nosana Deploy](https://deploy.nosana.com), select **Sogni Comfy Worker**, and choose your workload preset. As of September 2026, this entry is proposed in [PR #172](https://github.com/nosana-ci/pipeline-templates/pull/172); these dashboard steps apply once it is available in the catalog.
2. Choose a suitable GPU market. Keep **Replicas = 1** and use the **Infinite** strategy for an ongoing worker.
3. In the job definition form, expand **Environment variables** on **sogni-worker**. Replace both placeholders:

   | Field | Enter |
   | --- | --- |
   | `API_KEY` | Your Sogni API key |
   | `NFT_TOKEN_ID` | Your unique numeric Fast Worker NFT token ID |

4. Keep the chosen preset's setup and health settings, apart from an optional smaller bundle above. Review the deployment's confidentiality and rental cost, then deploy.
5. Follow the download progress in Nosana. A cold host can take tens of minutes or longer to fetch its model cache. Avoid repeatedly restarting a progressing download.
6. Open [Sogni Workers](https://dashboard.sogni.ai/fast-workers/), select your NFT, and confirm its version, GPU, online status, and available models. Check **Worker Health** and **Job History** as work arrives.

For another GPU, create another one-replica deployment with a different NFT token ID. Increasing replicas here copies the same credentials and makes workers compete for one identity.

## Manage the worker

Use the Sogni dashboard's **Settings** tab for supported workflow preferences and other operator controls. See the [dashboard guide](https://docs.sogni.ai/run-a-worker/fast-worker/worker-dashboard/) and [advanced configuration](https://docs.sogni.ai/run-a-worker/fast-worker/sogni-fast-worker-advanced-configuration/). Preferences choose among models already available to the worker. Change the Nosana preset or catalog selector for a replacement job to change its preloaded files. Check Job History before expanding into more model families.

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
