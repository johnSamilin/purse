import { notify } from './helpers';

export function share(title, text, url) {
  if (navigator.share !== undefined) {
    navigator.share({
      title,
      text,
      url,
    });
  } else {
    try {
      Clipboard.writeText(`${title} ${text}: ${url}`)
        .then(() => notify('Текст скопирован в буфер обмена'))
        .catch(() => alert(`${text}: ${url}`));
    } catch(er) {
      alert(`${title} ${text}: ${url}`)
    }
  }
}