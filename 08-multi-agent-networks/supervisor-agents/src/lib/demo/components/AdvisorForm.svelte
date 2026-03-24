<script lang="ts">
  import type { AdvisorFormValues } from '$lib/demo/types';

  type Props = {
    values: AdvisorFormValues;
    disabled?: boolean;
    onSubmit: () => void;
    onReset: () => void;
  };

  let { values = $bindable(), disabled = false, onSubmit, onReset }: Props = $props();

  const skillOptions: AdvisorFormValues['skillLevel'][] = ['beginner', 'intermediate', 'advanced'];
  const privacyOptions: AdvisorFormValues['privacyPosture'][] = ['low', 'balanced', 'high'];
  const exposureOptions: AdvisorFormValues['internetExposure'][] = ['none', 'limited', 'public'];
</script>

<form
  class="space-y-6"
  onsubmit={(event) => {
    event.preventDefault();
    onSubmit();
  }}
>
  <details class="overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-50/80" name="manual-intake">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left [&::-webkit-details-marker]:hidden">
      <span class="inline-flex min-w-0 flex-col gap-1">
        <span class="text-xs font-medium tracking-widest uppercase text-zinc-500">Optional manual intake</span>
        <span class="text-sm text-zinc-600">Use this only when you want to override the canned scenarios.</span>
      </span>
    </summary>

    <div class="grid gap-4 border-t border-zinc-200/80 bg-white px-4 py-4 md:px-5">
      <label class="grid gap-2">
        <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Primary goal</span>
        <textarea
          bind:value={values.goal}
          rows="4"
          class="min-h-28 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
          placeholder="What should this stack accomplish?"
          disabled={disabled}
        ></textarea>
      </label>

      <div class="grid gap-4">
        <label class="grid gap-2">
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Users / scale</span>
          <input
            bind:value={values.users}
            class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
            placeholder="e.g. 12 staff, 2 admins"
            disabled={disabled}
          />
        </label>

        <label class="grid gap-2">
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Budget</span>
          <input
            bind:value={values.budget}
            class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
            placeholder="One-time or monthly budget"
            disabled={disabled}
          />
        </label>
      </div>

      <label class="grid gap-2">
        <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Hardware</span>
        <input
          bind:value={values.hardware}
          class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
          placeholder="Servers, NAS, VPS, or managed infrastructure"
          disabled={disabled}
        />
      </label>

      <label class="grid gap-2">
        <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Existing setup</span>
        <textarea
          bind:value={values.existingSetup}
          rows="3"
          class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
          placeholder="Current apps, infrastructure, or migration context"
          disabled={disabled}
        ></textarea>
      </label>

      <label class="grid gap-2">
        <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Preferences</span>
        <textarea
          bind:value={values.preferences}
          rows="3"
          class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
          placeholder="Preferred tooling, simplicity vs flexibility, remote access expectations"
          disabled={disabled}
        ></textarea>
      </label>

      <label class="grid gap-2">
        <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Constraints</span>
        <textarea
          bind:value={values.constraints}
          rows="3"
          class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-zinc-50"
          placeholder="Hard requirements, red lines, compliance, downtime tolerance"
          disabled={disabled}
        ></textarea>
      </label>

      <div class="grid gap-4">
        <label class="grid gap-2">
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Skill level</span>
          <select
            bind:value={values.skillLevel}
            class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-zinc-50"
            disabled={disabled}
          >
            {#each skillOptions as option (option)}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>

        <label class="grid gap-2">
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Privacy posture</span>
          <select
            bind:value={values.privacyPosture}
            class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-zinc-50"
            disabled={disabled}
          >
            {#each privacyOptions as option (option)}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>

        <label class="grid gap-2">
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-500">Internet exposure</span>
          <select
            bind:value={values.internetExposure}
            class="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-zinc-50"
            disabled={disabled}
          >
            {#each exposureOptions as option (option)}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </label>
      </div>
    </div>
  </details>

  <div class="flex flex-wrap gap-3 pt-2">
    <button
      type="submit"
      class="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300"
      disabled={disabled}
    >
      {disabled ? 'Supervisor running…' : 'Run advisor'}
    </button>

    <button
      type="button"
      class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium tracking-wide text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-zinc-400"
      onclick={onReset}
      disabled={disabled}
    >
      Reset intake
    </button>
  </div>
</form>
