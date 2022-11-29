<!-- Script -->
<script lang="ts">
    import { onMount, tick } from "svelte";
    import { writable } from "svelte/store";

    export let text = '';
    export let height = '100%';

    let html = writable('');
    let browser = false;
    let content: HTMLDivElement;
    let md: any;
    onMount(async () => {
        if(window && window.markdownit) {
            browser = true;
            md = window.markdownit({
                html:	 	 true,
                xhtmlOut:	 false,
                breaks:		 true,
                langPrefix:	 'language-',
                linkify:	 false,
                typographer: false,
                highlight: 	 function (code: string, lang: string) : string {
                    let res = code;
                    if(window.hljs) {
                        const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
                        res = window.hljs.highlight(code, { language }).value;
                    }
                    return res;
                }
            });
            md.use(window.markdownitEmoji);
            md.use(window.markdownitFootnote);
            $html = md.render(text);
            await tick();
            await typeset();
        }
    });

    $: watch_text(text);
    async function watch_text(txt: string) {
        if(md) {
            $html = md.render(text);
            await tick();
            await typeset();
        }
    }

    async function typeset() {
        let aux : HTMLElement[] = [];
        let codes = content.getElementsByTagName('code');
        for(let i=0; i<codes.length; i++) {
            let code = codes[i];
            let parent = code.parentNode ;
            if(parent && (parent as HTMLElement).tagName !== 'PRE' && code.childElementCount === 0) {
                let text = code.textContent;
                if(text) {
                    if (/^\$[^$]/.test(text) && /[^$]\$$/.test(text)) {
                        text = text.replace(/^\$/, '\\(').replace(/\$$/, '\\)');
                        code.textContent = text;
                    }
                    if (/^\\\((.|\s)+\\\)$/.test(text) || /^\\\[(.|\s)+\\\]$/.test(text) ||
                        /^\$(.|\s)+\$$/.test(text) ||
                        /^\\begin\{([^}]+)\}(.|\s)+\\end\{[^}]+\}$/.test(text)) {
                            if(aux.indexOf(parent as HTMLElement) === -1) {
                                aux.push(parent as HTMLElement);
                            }
                    }
                }
            }
        }
        if(aux.length > 0) {
            let elements : HTMLElement[] = [];
            for(let i=0; i<aux.length; i++) {
                let parent = aux[i];
                let code = parent.getElementsByTagName('code')[0];
                while(code) {
                    let span = document.createElement('span');
                    span.innerHTML = code.innerHTML;
                    parent.replaceChild(span, code);
                    elements.push(span);
                    code = parent.getElementsByTagName('code')[0];
                }
            }
            
            window.MathJax.startup.promise = window.MathJax.startup.promise
            .then(() => window.MathJax.typesetPromise(elements))
            .catch((err: Error) => console.log('Typeset failed: ' + err.message));
            await window.MathJax.startup.promise;
        }
    }

</script>

<!-- Elements -->
<div class="markdown-panel" style="height: {height}">
    <div class="markdown-body" bind:this={content}>
        {#if browser}
            {@html $html}
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
.markdown-panel {
    width: 100%;
    max-width: 900px;
    padding: 0;
    margin: 0;
    overflow: auto;

    background-color: transparent;
    -webkit-text-size-adjust: 100%;
    -webkit-font-feature-settings: "kern" 1;
    -moz-font-feature-settings: "kern" 1;
    -o-font-feature-settings: "kern" 1;
    font-feature-settings: "kern" 1;
    font-kerning: normal;
}

.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}

</style>