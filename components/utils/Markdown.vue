<template>
  <div class="content" v-html="result"></div>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface Props {
  content: string;
}
const props = withDefaults(defineProps<Props>(), {
  content: "",
});
const result = ref("");

const md: any = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight: function (str: any, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs-code"><code class="hljs-code language-${lang} hljs hljs-jetbrains-mono">` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs-code"><code class="hljs-code language-none hljs hljs-jetbrains-mono">' +
      md.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

onMounted(() => {
  result.value = md.render(props.content);
});

watch(props, () => {
  result.value = md.render(props.content);
});
</script>

<style scoped lang="scss">
:deep(.hljs) {
  background-color: #f6f8fa !important;
}

:deep(.hljs-code) {
  border-radius: 6px;
}
.content {
  :deep(h1) {
    margin: 0.25rem 0;
    line-height: 3rem;
  }
  :deep(h2) {
    margin: 0.25rem 0;
    line-height: 2.5rem;
  }
  :deep(h3) {
    margin: 0.25rem 0;
    line-height: 2.2rem;
  }
  :deep(h4) {
    margin: 0.25rem 0;
    line-height: 2rem;
  }
  :deep(p) {
    margin: 0.25rem 0;
    line-height: 2rem;
  }
  :deep(hr) {
    margin: 0.25rem 0;
  }
  :deep(pre) {
    margin: 0.5rem 0;
  }
}
</style>
