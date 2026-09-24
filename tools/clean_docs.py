import json, re, sys, html

def clean(path, out):
    raw = open(path, encoding="utf-8", errors="replace").read()
    # pull every pageBody JSON blob
    bodies = []
    for m in re.finditer(r'"pageBody\\":\\"', raw):
        start = m.end()
        # find the closing \",\"comments
        end = raw.find('\\",\\"comments', start)
        if end == -1:
            continue
        bodies.append(raw[start:end])
    titles = re.findall(r'^    title: (.+)$', raw, re.M)
    urls   = re.findall(r'^    url: "(.+)"$', raw, re.M)
    chunks = []
    for i, b in enumerate(bodies):
        s = b.encode().decode("unicode_escape", errors="replace")
        s = s.replace('\\"', '"').replace('\\/', '/')
        # isolate the doc article
        m = re.search(r'<div class="theme-doc-markdown markdown">(.*?)<footer', s, re.S)
        body = m.group(1) if m else s
        body = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S)
        body = re.sub(r'<script.*?</script>', ' ', body, flags=re.S)
        body = re.sub(r'<style.*?</style>', ' ', body, flags=re.S)
        body = re.sub(r'<h1[^>]*>', '\n\n# ', body)
        body = re.sub(r'<h2[^>]*>', '\n\n## ', body)
        body = re.sub(r'<h3[^>]*>', '\n\n### ', body)
        body = re.sub(r'<h4[^>]*>', '\n\n#### ', body)
        body = re.sub(r'<li[^>]*>', '\n- ', body)
        body = re.sub(r'</p>|<br\s*/?>|</tr>', '\n', body)
        body = re.sub(r'<td[^>]*>', ' | ', body)
        body = re.sub(r'<[^>]+>', '', body)
        body = html.unescape(body)
        body = re.sub(r'[ \t]{2,}', ' ', body)
        body = re.sub(r'\n{3,}', '\n\n', body)
        body = re.sub(r'\u200b', '', body)
        t = titles[i] if i < len(titles) else "?"
        u = urls[i] if i < len(urls) else "?"
        chunks.append(f"\n\n===== {t}\nURL: {u}\n{body.strip()}")
    open(out, "w", encoding="utf-8").write("\n".join(chunks))
    print(f"{len(bodies)} pages -> {out}")

clean(sys.argv[1], sys.argv[2])
