ClientNest app.js — targeted fixes
===================================

IMPORTANT:
This is a patch file, not a full replacement for app.js. Apply these changes only inside your existing app.js. Do not replace index.html or styles.css.

1) Local date fix
-----------------
Find:
const todayISO = () => new Date().toISOString().slice(0,10);

Replace with:
const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};


2) Fix editing linked clients/leads in showModal()
--------------------------------------------------
Find:
if(f.name==='related'&&existing)val=existing.client||existing.lead||'';
if(f.name==='contact'&&existing)val=existing.contact||'';

Replace with:
if (f.name === 'related' && existing) {
  val = existing.client
    ? `c:${existing.client}`
    : existing.lead
      ? `l:${existing.lead}`
      : '';
}

if (f.name === 'contact' && existing) {
  val = existing.contactType
    ? `${existing.contactType}:${existing.contact}`
    : '';
}


3) Fix task relationship changes in handleSubmit()
--------------------------------------------------
Find:
if(v.related){const [k,ref]=v.related.split(':');if(k==='c')obj.client=ref;if(k==='l')obj.lead=ref}

Replace with:
delete obj.client;
delete obj.lead;

if (v.related) {
  const [type, ...parts] = v.related.split(':');
  const ref = parts.join(':');

  if (type === 'c') obj.client = ref;
  if (type === 'l') obj.lead = ref;
}


4) Prevent a false success message if saving fails
--------------------------------------------------
Find:
save();hideModal();render();toast(`${modalType[0].toUpperCase()+modalType.slice(1)} ${old?'updated':'saved'} successfully.`)

Replace with:
if (!save()) return;

hideModal();
render();

toast(
  `${modalType[0].toUpperCase() + modalType.slice(1)} ${
    old ? 'updated' : 'saved'
  } successfully.`
);

   
