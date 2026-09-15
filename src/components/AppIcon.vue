<script setup lang="ts">
/** Иконки инлайном: спрайт из ~15 штук не стоит отдельного запроса или библиотеки. */
withDefaults(defineProps<{ name: string; size?: number | string }>(), { size: 20 })
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'mail'">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </template>

    <template v-else-if="name === 'telegram'">
      <path d="M21.5 3.5 2.8 10.6c-.8.3-.8 1.4 0 1.7l4.3 1.4 1.6 5c.2.7 1.1.9 1.6.3l2.3-2.6 4.4 3.2c.6.5 1.5.1 1.7-.6l3.4-14.4c.2-.8-.6-1.4-1.6-1.1Z" />
      <path d="M7.1 13.7 18.6 6l-8 8.4-.3 4.1" />
    </template>

    <template v-else-if="name === 'github'">
      <path
        d="M9 19c-4 1.4-4-2.2-6-2.7m12 5.4v-3.4c0-1 .1-1.4-.5-2 2.3-.3 4.5-1.1 4.5-5a3.9 3.9 0 0 0-1.1-2.7 3.6 3.6 0 0 0-.1-2.7s-1.1-.3-3.5 1.3a8.7 8.7 0 0 0-4.6 0C7.3 5.6 6.2 5.9 6.2 5.9a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 5 11.3c0 3.9 2.2 4.7 4.5 5-.6.6-.6 1.2-.5 2v3.4"
      />
    </template>

    <template v-else-if="name === 'linkedin'">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M7 10.5v6.5M7 7.3v.2M11.5 17v-6.5M11.5 13.4c0-1.6.9-2.6 2.4-2.6s2.6.9 2.6 2.9V17" />
    </template>

    <template v-else-if="name === 'whatsapp'">
      <path
        d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.5A8.4 8.4 0 1 1 20.5 11.6Z"
      />
      <path
        d="M9 8.6c-.3 0-.6.1-.8.4-.3.4-.7 1-.6 1.9.1 1 .8 2.1 1.8 3 1.3 1.2 2.5 1.7 3.4 1.8.8.1 1.5-.3 1.8-.7.2-.3.3-.7.2-.9l-1.5-.8c-.2-.1-.4 0-.6.2l-.4.5c-.7-.3-1.4-.8-2-1.6l.4-.5c.2-.2.2-.4.1-.6l-.8-1.4c-.1-.2-.3-.3-.6-.3H9Z"
      />
    </template>

    <template v-else-if="name === 'arrow-right'">
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </template>

    <template v-else-if="name === 'arrow-up'">
      <path d="M12 20V4m0 0L5.5 10.5M12 4l6.5 6.5" />
    </template>

    <template v-else-if="name === 'arrow-down'">
      <path d="M12 4v16m0 0 6.5-6.5M12 20l-6.5-6.5" />
    </template>

    <template v-else-if="name === 'external'">
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" />
    </template>

    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>

    <template v-else-if="name === 'menu'">
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </template>

    <template v-else-if="name === 'accessibility'">
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="7.4" r="1.3" fill="currentColor" stroke="none" />
      <path d="M7.6 10.4c2.9.8 5.9.8 8.8 0M12 10.8v4m0 0-2 4.2m2-4.2 2 4.2" />
    </template>

    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M2.8 12h18.4M12 2.8c2.4 2.5 3.6 5.6 3.6 9.2S14.4 18.7 12 21.2c-2.4-2.5-3.6-5.6-3.6-9.2S9.6 5.3 12 2.8Z" />
    </template>

    <template v-else-if="name === 'shield'">
      <path d="M12 2.8 4.5 5.6v5.7c0 4.4 3 8.3 7.5 9.9 4.5-1.6 7.5-5.5 7.5-9.9V5.6L12 2.8Z" />
      <path d="M9 12.2l2.1 2.2L15.3 10" />
    </template>

    <template v-else-if="name === 'terminal'">
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M6.5 10l2.4 2.4-2.4 2.4M11.5 15h5" />
    </template>

    <template v-else-if="name === 'check'">
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </template>

    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>

    <template v-else-if="name === 'code'">
      <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 5 10.5 19" />
    </template>

    <template v-else-if="name === 'pin'">
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </template>

    <template v-else-if="name === 'send'">
      <path d="M21 3 10.5 13.5M21 3l-6.8 18.5-3.7-8-8-3.7L21 3Z" />
    </template>

    <template v-else-if="name === 'spark'">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
    </template>
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
}
</style>
