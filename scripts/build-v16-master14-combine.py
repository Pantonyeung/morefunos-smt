from pathlib import Path
import subprocess,re

ROOT=Path('.')
TMP=ROOT/'.combine-tmp'
TMP.mkdir(exist_ok=True)

def show(ref,path):
    return subprocess.check_output(['git','show',f'{ref}:{path}'],text=True)

def replace_function(source,name,replacement_source):
    marker=f'function {name}('
    start=source.find(marker)
    rstart=replacement_source.find(marker)
    if start<0 or rstart<0:
        raise SystemExit(f'missing function {name}')
    def end_of(text,pos):
        brace=text.find('{',pos); depth=0; quote=None; esc=False; template_depth=0
        i=brace
        while i<len(text):
            c=text[i]
            if quote:
                if esc: esc=False
                elif c=='\\': esc=True
                elif c==quote: quote=None
            else:
                if c in "'\"`": quote=c
                elif c=='{': depth+=1
                elif c=='}':
                    depth-=1
                    if depth==0:return i+1
            i+=1
        raise SystemExit(f'unclosed function {name}')
    end=end_of(source,start); rend=end_of(replacement_source,rstart)
    return source[:start]+replacement_source[rstart:rend]+source[end:]

BASE='5b986636a199d4143738c8a07e62495415c20d84'
QUICK='bd3d9b38deb4d3ebeef6023efe24c376f4d138d5'
POPUP='5adb2e2a81a661dec7a7229a546e2af026524628'
DRINK='0ed468dd30c3ab4222de3b0801173450153736a0'

entry=show(QUICK,'pages/order/page.js')
drink_src=show(DRINK,'pages/order/page-v14.js')
for fn in ['quickDrinkPopover','positionQuickDrinkPopover']:
    entry=replace_function(entry,fn,drink_src)

# Preserve canonical V16 quick mode wording and make all card layers modal/non-click-through.
entry=entry.replace("<section class=\"workspace-card quick-card\">","<section class=\"workspace-card quick-card anchored-card\" data-card-kind=\"quick\">")
entry=entry.replace("<section class=\"workspace-card pending-card\">","<section class=\"workspace-card pending-card anchored-card\" data-card-kind=\"pending\">")
entry=entry.replace("<section class=\"workspace-card edit-card\">","<section class=\"workspace-card edit-card anchored-card\">")
entry=entry.replace("${state.card?'<button class=\"workspace-scrim\"", "${state.card?'<button class=\"workspace-scrim frosted-card-scrim\"")

# Build a temporary module tree matching original imports.
order=TMP/'pages'/'order'; order.mkdir(parents=True,exist_ok=True)
(order/'page.js').write_text(entry,encoding='utf-8')
(order/'page-data.js').write_text(show(QUICK,'pages/order/page-data.js'),encoding='utf-8')

# Bundle to a single browser runtime.
subprocess.run(['npx','--yes','esbuild',str(order/'page.js'),'--bundle','--format=iife','--platform=browser','--target=es2020','--outfile=smt-app.js'],check=True)

base_css=show(BASE,'shared/page-base.css')
quick_css=show(QUICK,'pages/order/page.css')
master_css=show(POPUP,'pages/order/page.css')
drink_css=show(DRINK,'pages/order/page-v14.css')
overrides='''
/* Combined lock overrides: V16 + Master 1.4 */
.workspace{position:relative}.workspace-scrim,.frosted-card-scrim{position:fixed!important;inset:0!important;z-index:28!important;border:0!important;background:rgba(246,242,238,.50)!important;-webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important;pointer-events:auto!important}
.workspace-card{position:fixed!important;right:20px!important;top:94px!important;bottom:86px!important;width:25%!important;height:auto!important;max-height:none!important;z-index:30!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;background:#fff!important;border:1px solid var(--line)!important;border-radius:15px!important;box-shadow:var(--shadow)!important}
.workspace-card>.body{flex:1!important;min-height:0!important;overflow:auto!important}.workspace-card>header{flex:none!important}.workspace-card .settings-foot{flex:none!important}
.quick-drink-popover{z-index:42!important}.quick-popover-scrim{position:absolute!important;inset:0!important;z-index:40!important;border:0!important;background:rgba(246,242,238,.42)!important;-webkit-backdrop-filter:blur(8px)!important;backdrop-filter:blur(8px)!important}
.modal-backdrop{background:rgba(246,242,238,.52)!important;-webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important;pointer-events:auto!important}
'''
Path('smt-app.css').write_text('\n'.join([base_css,quick_css,master_css,drink_css,overrides]),encoding='utf-8')

Path('smt-data.js').write_text("window.MoreFunSMTBuild=Object.freeze({version:'v16-master14-combine-1',base:'5b98663',quick:'bd3d9b3',popup:'5adb2e2',quickDrinkPopup:'0ed468d'});\n",encoding='utf-8')
Path('smt-api-client.js').write_text("window.MoreFunSMTApi=window.MoreFunSMTApi||{health:async()=>({}),submitOrder:async()=>({ok:true})};\n",encoding='utf-8')
Path('index.html').write_text('''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><meta name="theme-color" content="#f7f1e8"><title>磨飯 SMT｜V16 × Master 1.4</title><link rel="stylesheet" href="./smt-app.css?v=v16-master14-combine-1"></head><body><div id="app"></div><script src="./smt-data.js?v=v16-master14-combine-1"></script><script src="./smt-api-client.js?v=v16-master14-combine-1"></script><script src="./smt-app.js?v=v16-master14-combine-1"></script></body></html>''',encoding='utf-8')

# Verification markers.
assert '快速模式' in Path('smt-app.js').read_text(encoding='utf-8')
assert 'quick-drink-popover' in Path('smt-app.js').read_text(encoding='utf-8')
assert 'workspace-scrim' in Path('smt-app.js').read_text(encoding='utf-8')
assert 'width:25%' in Path('smt-app.css').read_text(encoding='utf-8')
print('combined five-root build created')
